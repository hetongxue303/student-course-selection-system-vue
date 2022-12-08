<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.name"
          type="text"
          placeholder="请输入学院名称..."
        />
      </el-col>
      <el-button icon="Search" type="success" @click="getCollegeListPage">
        搜索
      </el-button>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
    <div class="operate-box">
      <el-button icon="Plus" type="primary" @click="dialog.add = true">
        新增
      </el-button>
      <el-button
        icon="EditPen"
        :disabled="disabled.edit"
        type="success"
        @click="handleEdit()"
      >
        修改
      </el-button>
      <el-button
        icon="Delete"
        :disabled="disabled.delete"
        type="danger"
        @click="dialog.delete = true"
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
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="30" />
    <el-table-column prop="collegeId" label="ID" align="center" width="80" />
    <el-table-column prop="collegeName" label="学院名称" width="200" />
    <el-table-column
      prop="remark"
      label="学院描述"
      align="center"
      width="auto"
    />
    <el-table-column
      prop="createTime"
      label="创建时间"
      align="center"
      width="200"
    />
    <el-table-column label="操作" align="center" width="200">
      <template #default="scope">
        <el-button
          icon="EditPen"
          type="primary"
          @click="handleEdit(scope.row)"
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

  <!--新增-->
  <el-dialog v-model="dialog.add" title="新增学院" width="40%">
    <el-form :model="addForm">
      <el-form-item label="学院名称">
        <el-input
          v-model="addForm.collegeName"
          type="text"
          placeholder="请输入学院名"
        />
      </el-form-item>
      <el-form-item label="学院描述">
        <el-input
          v-model="addForm.remark"
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="请输入学院描述(默认：空)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.add = false">返回</el-button>
        <el-button type="primary" @click="handleAddCollege"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!--编辑-->
  <el-dialog v-model="dialog.edit" title="编辑学院" width="40%">
    <el-form :model="editForm">
      <el-form-item label="学院名称">
        <el-input v-model="editForm.collegeName" />
      </el-form-item>
      <el-form-item label="学院描述">
        <el-input
          v-model="editForm.remark"
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="请输入学院描述(默认：空)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.edit = false">返回</el-button>
        <el-button type="primary" @click="handleEditCollege"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!--确认删除框-->
  <el-dialog v-model="dialog.delete" title="提示" width="30%">
    <div style="display: flex; align-items: center">
      <svg-icon name="warning" size="1.5" />
      <span>确认删除选中的{{ multipleSelection.length }}条数据?</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.delete = false">返回</el-button>
        <el-button type="primary" @click="handleBatchDelete"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  addCollege,
  delBatchCollege,
  delCollege,
  getCollegePage,
  updateCollege
} from '../../../api/college'
import { onMounted, reactive, ref, watch } from 'vue'
import { College } from '../../../types/entity'
import { ElMessage, ElNotification, ElTable } from 'element-plus'
import { QueryCollege } from '../../../types/query'
import Pagination from '../../../components/Pagination/Index.vue'

/* 初始化相关 */
const tableData = ref<College[]>([])
const getCollegeListPage = async () => {
  const { data } = await getCollegePage(query)
  tableData.value = data.data.records
  total.value = JSON.parse(data.data.total)
}
onMounted(() => getCollegeListPage())

/* 分页相关 */
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
  getCollegeListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getCollegeListPage()
}

/* 查询相关 */
const query = reactive<QueryCollege>({
  name: '',
  currentPage: 1,
  pageSize: 10
})
const resetSearch = () => {
  query.name = ''
  getCollegeListPage()
}

/* 表格相关 */
const disabled = reactive({
  edit: true,
  delete: true,
  export: false
})
const dialog = reactive({
  add: false,
  delete: false,
  edit: false
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<College[]>([])
const handleSelectionChange = (colleges: College[]) => {
  multipleSelection.value = colleges
}
const handleBatchDelete = async () => {
  const ids: number[] = multipleSelection.value.map((item) => {
    return item.collegeId as number
  })
  const { data } = await delBatchCollege(ids)
  switch (data.code) {
    case 200:
      await getCollegeListPage()
      dialog.delete = false
      ElNotification.success('删除成功')
      break
    default:
      ElNotification.success('删除失败,请重试！')
  }
}
const handleExport = () => {
  ElMessage.info('待开发...')
}
watch(
  () => multipleSelection.value,
  () => {
    disabled.edit = multipleSelection.value.length !== 1
    disabled.delete = multipleSelection.value.length < 1
  },
  { immediate: true, deep: true }
)

/* 重置表单方法 */
const resetForm = (form: any) => {
  const keys = Object.keys(form)
  const obj: { [name: string]: string } = {}
  keys.forEach((item) => {
    obj[item] = ''
  })
  Object.assign(form, obj)
}

/* 删除相关 */
const handleDelete = async ({ collegeId }: College) => {
  if (collegeId) {
    const { data } = await delCollege(collegeId)
    switch (data.code) {
      case 200:
        await getCollegeListPage()
        ElNotification.success('删除成功')
        break
      default:
        ElNotification.success('删除失败,请重试！')
    }
  }
}

/* 新增相关 */
const addForm = reactive<College>({})
watch(
  () => dialog.add,
  (value) => {
    if (!value) {
      resetForm(addForm)
    }
  },
  { deep: true }
)
const handleAddCollege = async () => {
  const { data } = await addCollege(addForm)
  switch (data.code) {
    case 200:
      await getCollegeListPage()
      dialog.add = false
      ElNotification.success('添加成功')
      break
    default:
      ElNotification.error('添加失败,请重试！')
  }
}

/* 编辑相关 */
const editForm = ref<College>({})
const handleEdit = (row?: College) => {
  if (row) {
    editForm.value = JSON.parse(JSON.stringify(row))
  } else {
    editForm.value = JSON.parse(
      JSON.stringify(multipleSelection.value[0] as College)
    )
  }
  dialog.edit = true
}
const handleEditCollege = async () => {
  const { data } = await updateCollege(editForm.value)
  switch (data.code) {
    case 200:
      await getCollegeListPage()
      dialog.edit = false
      ElNotification.success('更新成功')
      break
    default:
      ElNotification.error('更新失败,请重试！')
  }
}
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
