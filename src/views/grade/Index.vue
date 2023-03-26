<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.gradeName"
          type="text"
          placeholder="班级名称"
        />
      </el-col>
      <el-button
        icon="RefreshLeft"
        type="warning"
        :disabled="query.gradeName === undefined"
        @click="resetSearch"
      >
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
    <el-table-column prop="gradeName" label="班级名称" width="auto" />
    <el-table-column prop="gradeCount" label="人数" width="auto">
      <template #default="{ row }">
        <el-tag type="success" disable-transitions>
          {{ row.gradeCount }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="college.collegeName" label="所属学院" width="auto" />
    <el-table-column prop="major.majorName" label="所属专业" width="auto" />
    <el-table-column label="创建时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="200">
      <template #default="scope">
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
    width="35%"
    :style="{ borderRadius: '10px' }"
    destroy-on-close
    :show-close="false"
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
        <el-col :span="24">
          <el-form-item label="班级名称" prop="gradeName">
            <el-input
              v-model="dialogForm.gradeName"
              type="text"
              placeholder="班级名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="所属学院" prop="collegeId">
            <el-select
              v-model="dialogForm.collegeId"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in colleges"
                :key="index"
                :label="item.collegeName"
                :value="item.collegeId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="所属专业" prop="majorId">
            <el-select
              v-model="dialogForm.majorId"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in majors"
                :key="index"
                :label="item.majorName"
                :value="item.majorId"
              />
            </el-select>
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
import {
  ElMessageBox,
  ElNotification,
  ElTable,
  FormInstance,
  FormRules
} from 'element-plus'
import { randomTimeout } from '../../utils/common'
import { College, Grade, Major } from '../../types/entity'
import {
  addGrade,
  delBatchGrade,
  delGrade,
  getGradePage,
  updateGrade
} from '../../api/grade'
import { QueryGrade } from '../../types/query'
import { getCollegeAll } from '../../api/college'
import { getMajorAll } from '../../api/major'

// 初始化相关
const tableData = ref<Grade[]>([])
const tableLoading = ref<boolean>(false)
const getGradePageList = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getGradePage(query)
    tableData.value = cloneDeep(data.data.records)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, randomTimeout(5, 500))
}
onMounted(() => getGradePageList())
// 表单检验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  gradeName: [
    {
      required: true,
      type: 'string',
      message: '班级名称不能为空',
      trigger: 'blur'
    }
  ],
  collegeId: [
    {
      required: true,
      message: '请选择学院',
      trigger: 'blur'
    }
  ],
  majorId: [
    {
      required: true,
      message: '请选择专业',
      trigger: 'blur'
    }
  ]
})
// 查询属性
const query: QueryGrade = reactive({
  currentPage: 1,
  pageSize: 10
})
// 分页相关
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) =>
  (query.currentPage = currentPage)

const handleSizeChange = (pageSize: number) => (query.pageSize = pageSize)

// 重置搜索
const resetSearch = () => {
  query.gradeName = undefined
}
// 监听查询属性
watch(
  () => query,
  async () => {
    await getGradePageList()
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
const multipleSelection = ref<Grade[]>([])
const handleSelectionChange = (grades: Grade[]) => {
  multipleSelection.value = grades
}
// 单个删除
const handleDelete = async ({ gradeId }: Grade) => {
  if (gradeId) {
    const { data } = await delGrade(gradeId)
    if (data.code === 200) {
      await getGradePageList()
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
      return item.gradeId as number
    })
    const { data } = await delBatchGrade(ids)
    if (data.code === 200) {
      await getGradePageList()
      ElNotification.success('删除成功')
      return
    }
    ElNotification.error('删除失败,请重试！')
  })
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
const dialogForm = ref<Grade>({})
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})
const colleges = ref<College[]>([])
const getColleges = () => {
  getCollegeAll().then(({ data }) => {
    if (data.code === 200) colleges.value = cloneDeep(data.data)
  })
}
const majors = ref<Major[]>([])
const getMajors = () => {
  getMajorAll().then(({ data }) => {
    if (data.code === 200) majors.value = cloneDeep(data.data)
  })
}
// 设置dialog
const setDialog = async (operate: string, row?: Grade) => {
  if (operate === 'insert') {
    dialog.title = '新增学院'
    multipleSelection.value = []
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as Grade)
    }
    dialog.title = '编辑学院'
  }
  dialog.show = true
  dialog.operate = operate
  getColleges()
  getMajors()
}
// 处理dialog操作
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (dialog.operate === 'insert') {
        const { data } = await addGrade(dialogForm.value)
        if (data.code === 200) {
          await getGradePageList()
          dialog.show = false
          ElNotification.success('添加成功')
          return
        }
        ElNotification.error('添加失败,请重试！')
      }
      if (dialog.operate === 'update') {
        const { data } = await updateGrade(dialogForm.value)
        if (data.code === 200) {
          await getGradePageList()
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
  () => dialog.show,
  (value) => {
    if (!value) dialogForm.value = {}
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
