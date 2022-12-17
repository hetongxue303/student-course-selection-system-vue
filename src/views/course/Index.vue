<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.courseName"
          type="text"
          placeholder="请输入学院名称..."
        />
      </el-col>
      <el-button icon="Search" type="success" @click="handleSearch">
        搜索
      </el-button>
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
    :data="tableData"
    width="100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column prop="courseName" label="名称" width="auto" />
    <el-table-column label="已选人数" width="auto">
      <template #default="scope">
        <span>{{ scope.row.choice }}</span>
      </template>
    </el-table-column>
    <el-table-column label="总人数" prop="count" width="auto" />
    <el-table-column prop="remark" label="描述" align="center" width="auto" />
    <el-table-column label="创建时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="300">
      <template #default="scope">
        <el-button type="info" @click="handleChoiceCourse(1, scope.row)"
          >选择
        </el-button>
        <el-button type="warning" @click="handleChoiceCourse(2, scope.row)"
          >退课
        </el-button>
        <el-button
          icon="EditPen"
          type="primary"
          @click="setDialog('update', scope.row)"
        />
        <el-popconfirm
          title="确定删除本条数据吗？"
          @confirm="handleDelete(scope.row)"
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
    width="40%"
    :close-on-click-modal="false"
  >
    <el-form
      ref="ruleFormRef"
      :model="dialogForm"
      :rules="rules"
      status-icon
      label-width="80px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="dialogForm.courseName" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="课程人数" prop="count">
            <el-input-number
              v-model="dialogForm.count"
              controls-position="right"
              :min="0"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
              :rows="5"
              resize="none"
              placeholder="请输入课程描述(默认：空)"
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
import { studentChoiceCourse } from '../../api/choice'
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

// 初始化相关
const tableData = ref<Course[]>([])
const getCourseListPage = async () => {
  const { data } = await getCoursePage(query)
  tableData.value = cloneDeep(data.data.records)
  total.value = JSON.parse(data.data.total)
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
  ],
  userId: [
    {
      required: true,
      type: 'number',
      message: '请选择任课老师',
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
  getCourseListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getCourseListPage()
}
// 处理搜索
const handleSearch = () => {
  if (!query.courseName) {
    ElMessage.info('请输入搜索内容...')
    return
  }
  getCourseListPage()
}
// 重置搜索
const resetSearch = () => {
  query.courseName = ''
  getCourseListPage()
}
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
// 处理选课/退课
const handleChoiceCourse = async (type: number, row: Course) => {
  const info: any = reactive({
    text: '',
    success: '',
    error: ''
  })
  if (type === 1) {
    info.text = `确认选择 ${row.courseName} 课程吗?`
    info.successText = '选课成功'
    info.errorText = '选课失败,请重试！'
  } else {
    info.text = `确认退选 ${row.courseName} 课程吗?`
    info.successText = '退选成功'
    info.errorText = '退选失败,请重试！'
  }
  ElMessageBox.confirm(info.text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { data } = await studentChoiceCourse(type, row.courseId as number)
    switch (data.code) {
      case 200:
        await getCourseListPage()
        ElNotification.success(info.successText)
        break
      default:
        ElNotification.error(info.errorText)
    }
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
const dialogForm = ref<Course>({ count: 0 })
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
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as Course)
    }
    dialog.title = '编辑课程'
  }
  dialog.show = true
  dialog.operate = operate
  getSelectTeacherList(2)
}
// 处理dialog操作
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
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
    if (!value.show) ruleFormRef.value?.resetFields()
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
</style>
