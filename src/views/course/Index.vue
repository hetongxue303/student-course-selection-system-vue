<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="3">
        <el-input
          v-model="query.courseName"
          type="text"
          placeholder="课程名称"
        />
      </el-col>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
    <div class="operate-box">
      <el-button icon="Plus" type="primary" @click="setDialog('insert')">
        新增
      </el-button>
      <el-button
        icon="EditPen"
        :disabled="disabled.edit"
        type="success"
        @click="setDialog('update')"
      >
        修改
      </el-button>
      <el-button
        icon="Delete"
        :disabled="disabled.delete"
        type="danger"
        @click="handleBatchDelete"
      >
        删除
      </el-button>
      <el-button
        icon="Bottom"
        :disabled="disabled.export"
        type="warning"
        @click="handleExport"
      >
        导出
      </el-button>
    </div>
  </div>

  <!--表格-->
  <el-table
    ref="multipleTableRef"
    v-loading="tableLoading"
    :data="tableData"
    width="100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column prop="courseName" label="课程名称" width="auto" />
    <el-table-column prop="teacherName" label="任课教师" width="auto" />
    <el-table-column label="已选" width="auto" align="center">
      <template #default="{ row }">
        <el-tag disable-transitions type="success">{{ row.choice }}人</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="剩余" v width="auto">
      <template #default="{ row }">
        <el-tag
          v-if="row.count === row.choice"
          disable-transitions
          effect="dark"
          type="warning"
        >
          已满
        </el-tag>
        <el-tag v-else effect="dark" type="success" disable-transitions>
          {{ row.count - row.choice }}人
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="总人数" width="auto" align="center">
      <template #default="{ row }">
        <el-tag disable-transitions type="info" effect="dark"
          >{{ row.count }}人
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="描述" align="center" width="auto" />
    <el-table-column label="创建时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="300">
      <template #default="{ row }">
        <el-button
          icon="EditPen"
          type="primary"
          @click="setDialog('update', row)"
        />
        <el-popconfirm
          title="确定删除本条数据吗？"
          @confirm="handleDelete(row)"
        >
          <template #reference>
            <el-button type="danger" icon="Delete" />
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!--分页-->
  <Pagination
    :current-page="query.currentPage"
    :page-size="query.pageSize"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <!--对话框-->
  <el-dialog
    v-model="dialog.show"
    :title="dialog.title"
    width="25%"
    :close-on-click-modal="false"
  >
    <el-form
      ref="ruleFormRef"
      :model="dialogForm"
      :rules="rules"
      label-width="80px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="dialogForm.courseName" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="课程人数">
            <el-input
              v-model="dialogForm.count"
              style="width: 100%"
              type="number"
              placeholder="介于10~200之间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-role="['admin']" :gutter="20">
        <el-col :span="12">
          <el-form-item label="任课老师" prop="userId">
            <el-select v-model="dialogForm.userId" placeholder="请选择">
              <el-option
                v-for="(item, index) in teachers"
                :key="index"
                :label="item.realName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="课程描述" prop="remark">
            <el-input
              v-model="dialogForm.remark"
              type="textarea"
              :rows="3"
              resize="none"
              placeholder="默认：空"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.show = false">返回</el-button>
        <el-button type="primary" @click="handleOperate(ruleFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Pagination from '../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { Course, User } from '../../types/entity'
import { QueryCourse } from '../../types/query'
import { getUserByType } from '../../api/user'
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElTable,
  FormInstance,
  FormRules
} from 'element-plus'
import {
  addCourse,
  delBatchCourse,
  delCourse,
  getCoursePage,
  updateCourse
} from '../../api/course'
import { randomTimeout } from '../../utils/common'

// 初始化相关
const tableData = ref<Course[]>([])
const tableLoading = ref<boolean>(false)
const getCourseListPage = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getCoursePage(query)
    tableData.value = cloneDeep(data.data.records)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, randomTimeout(5, 500))
}
onMounted(() => getCourseListPage())
// 表单检验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  courseName: [
    {
      required: true,
      type: 'string',
      message: '课程名称不能为空',
      trigger: 'blur'
    }
  ],
  count: [
    {
      required: true,
      type: 'number',
      message: '课程人数不能为空',
      trigger: 'blur'
    }
  ]
})
// 查询属性
const query: QueryCourse = reactive({
  currentPage: 1,
  pageSize: 10
})
// 分页相关
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
}
// 重置搜索
const resetSearch = () => (query.courseName = undefined)

// 监听查询属性
watch(
  () => query,
  async () => {
    await getCourseListPage()
  },
  { deep: true }
)
/* 表格相关 */
const disabled = reactive({
  edit: true,
  delete: true,
  export: false
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Course[]>([])
const handleSelectionChange = (colleges: Course[]) => {
  multipleSelection.value = colleges
}
// 单个删除
const handleDelete = async ({ courseId }: Course) => {
  if (courseId) {
    const { data } = await delCourse(courseId)
    if (data.code === 200) {
      await getCourseListPage()
      ElNotification.success('删除成功')
      return
    }
    ElNotification.error('删除失败,请重试！')
  }
}
// 批量删除
const handleBatchDelete = async () => {
  ElMessageBox.confirm(
    `确认删除选中的${multipleSelection.value.length}条数据?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const ids: number[] = multipleSelection.value.map((item) => {
      return item.courseId as number
    })
    const { data } = await delBatchCourse(ids)
    if (data.code === 200) {
      await getCourseListPage()
      ElNotification.success('删除成功')
      return
    }
    ElNotification.error('删除失败,请重试！')
  })
}
// 处理导出
const handleExport = () => {
  ElMessage.info('待开发...')
}
// 监听多选
watch(
  () => multipleSelection.value,
  () => {
    disabled.edit = multipleSelection.value.length !== 1
    disabled.delete = multipleSelection.value.length < 1
  },
  { immediate: true, deep: true }
)

/* 增加 编辑相关 */
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})
const dialogForm = ref<Course>({ count: 10 })
const teachers = ref<User[]>([])
// 下拉框数据
const getSelectTeacherList = (type: number) => {
  getUserByType(type).then(
    ({ data }) => (teachers.value = cloneDeep(data.data))
  )
}
// 设置dialog
const setDialog = async (operate: string, row?: Course) => {
  if (operate === 'insert') {
    dialog.title = '新增课程'
    multipleSelection.value = []
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as Course)
    }
    dialog.title = '编辑课程'
  }
  dialog.operate = operate
  dialog.show = true
  getSelectTeacherList(2)
}
// 处理dialog操作
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (
        (dialogForm.value.count as number) < 10 ||
        (dialogForm.value.count as number) > 200
      ) {
        ElMessage.warning('课程人数介于10~200之间')
        return
      }
      if (dialog.operate === 'insert') {
        const { data } = await addCourse(dialogForm.value)
        if (data.code === 200) {
          await getCourseListPage()
          dialog.show = false
          ElNotification.success('添加成功')
          return
        }
        ElNotification.error('添加失败,请重试！')
      }
      if (dialog.operate === 'update') {
        const { count, choice } = dialogForm.value
        if ((count as number) < (choice as number)) {
          ElMessage.warning('课程人数应不少于已选人数')
          return
        }
        const { data } = await updateCourse(dialogForm.value)
        if (data.code === 200) {
          await getCourseListPage()
          dialog.show = false
          ElNotification.success('更新成功')
          return
        }
        ElNotification.error('更新失败,请重试！')
      }
    }
  })
}
// 监听dialog显示
watch(
  () => dialog,
  (value) => {
    if (!value.show) dialogForm.value = { count: 10 }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.table-tool {
  padding: 15px 0 15px 0;

  .search-box {
    margin-bottom: 15px;
  }

  .operate-box {
    margin-bottom: 15px;
  }
}

:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none !important;
}

:deep(input[type='number']) {
  -moz-appearance: textfield !important;
}
</style>
