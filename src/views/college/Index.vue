<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="3">
        <el-input
          v-model="query.collegeName"
          type="text"
          placeholder="学院名称"
        />
      </el-col>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
    <div v-role="['admin', 'teacher']" class="operate-box">
      <el-button
        v-role="['admin']"
        icon="Plus"
        type="primary"
        @click="setDialog('insert')"
      >
        新增
      </el-button>
      <el-button
        v-role="['admin']"
        icon="EditPen"
        :disabled="disabled.edit"
        type="success"
        @click="setDialog('update')"
      >
        修改
      </el-button>
      <el-button
        v-role="['admin']"
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
    <el-table-column
      v-role="['admin', 'teacher']"
      type="selection"
      width="50"
      align="center"
    />
    <el-table-column prop="collegeName" label="学院名称" width="auto" />
    <el-table-column prop="remark" label="学院描述" width="auto" />
    <el-table-column label="创建时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column v-role="['admin']" label="操作" align="center" width="200">
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
        <el-col :span="24">
          <el-form-item label="学院名称" prop="collegeName">
            <el-input
              v-model="dialogForm.collegeName"
              type="text"
              placeholder="学院名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="学院描述" prop="remark">
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
import { College } from '../../types/entity'
import { QueryCollege } from '../../types/query'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElTable,
  FormInstance,
  FormRules
} from 'element-plus'
import {
  addCollege,
  delBatchCollege,
  delCollege,
  getCollegePage,
  updateCollege
} from '../../api/college'
import { randomTimeout } from '../../utils/common'

// 初始化相关
const tableData = ref<College[]>([])
const tableLoading = ref<boolean>(false)
const getCollegeListPage = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getCollegePage(query)
    tableData.value = cloneDeep(data.data.records)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, randomTimeout(5, 500))
}
onMounted(() => getCollegeListPage())
// 表单检验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  collegeName: [
    {
      required: true,
      type: 'string',
      message: '学院名称不能为空',
      trigger: 'blur'
    }
  ]
})
// 查询属性
const query: QueryCollege = reactive({
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
const resetSearch = () => {
  query.collegeName = undefined
}
// 监听查询属性
watch(
  () => query,
  async () => {
    await getCollegeListPage()
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
const multipleSelection = ref<College[]>([])
const handleSelectionChange = (colleges: College[]) => {
  multipleSelection.value = colleges
}
// 单个删除
const handleDelete = async ({ collegeId }: College) => {
  if (collegeId) {
    const { data } = await delCollege(collegeId)
    if (data.code === 200) {
      await getCollegeListPage()
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
      return item.collegeId as number
    })
    const { data } = await delBatchCollege(ids)
    if (data.code === 200) {
      await getCollegeListPage()
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
const dialogForm = ref<College>({})
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})
// 设置dialog
const setDialog = async (operate: string, row?: College) => {
  if (operate === 'insert') {
    dialog.title = '新增学院'
    multipleSelection.value = []
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as College)
    }
    dialog.title = '编辑学院'
  }
  dialog.show = true
  dialog.operate = operate
}
// 处理dialog操作
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (dialog.operate === 'insert') {
        const { data } = await addCollege(dialogForm.value)
        if (data.code === 200) {
          await getCollegeListPage()
          dialog.show = false
          ElNotification.success('添加成功')
          return
        }
        ElNotification.error('添加失败,请重试！')
      }
      if (dialog.operate === 'update') {
        const { data } = await updateCollege(dialogForm.value)
        if (data.code === 200) {
          await getCollegeListPage()
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
