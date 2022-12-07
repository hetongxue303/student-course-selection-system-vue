<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="queryInfo.name"
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
      <el-button icon="Plus" type="primary" @click="dialogVisible = true">
        新增
      </el-button>
      <el-button icon="EditPen" type="success"> 修改</el-button>
      <el-button icon="Delete" type="danger"> 删除</el-button>
      <el-button icon="Bottom" type="warning"> 导出</el-button>
    </div>
  </div>

  <!--表格-->
  <el-table :data="tableData">
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
        <!--编辑-->
        <el-button
          icon="EditPen"
          type="primary"
          @click="handleEdit(scope.row)"
        />
        <!--删除-->
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

  <!--新增-->
  <el-dialog v-model="dialogVisible" title="新增学院">
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
        <el-button @click="dialogVisible = false">返回</el-button>
        <el-button type="primary" @click="handlerAddCollege"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!--编辑-->
  <el-dialog v-model="editDialogVisible" title="编辑学院" width="40%">
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
        <el-button @click="editDialogVisible = false">返回</el-button>
        <el-button type="primary" @click="handlerEditCollege"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  addCollege,
  delCollege,
  getCollegePage,
  updateCollege
} from '../../../api/college'
import { onMounted, reactive, ref, watch } from 'vue'
import { College } from '../../../types/entity'
import { ElNotification } from 'element-plus'
import { QueryCollege } from '../../../types/query'

/* 重置表单方法 */
const resetForm = (form: any) => {
  const keys = Object.keys(form)
  const obj: { [name: string]: string } = {}
  keys.forEach((item) => {
    obj[item] = ''
  })
  Object.assign(form, obj)
}

/* 查询相关 */
const queryInfo = reactive<QueryCollege>({
  name: '',
  page: 1,
  size: 5
})
const resetSearch = () => {
  queryInfo.name = ''
  getCollegeListPage()
}

/* 删除相关 */
const handleDelete = async ({ collegeId }: College) => {
  if (collegeId) {
    const { data } = await delCollege(collegeId)
    switch (data.code) {
      case 200:
        ElNotification.success('删除成功')
        await getCollegeListPage()
        break
      default:
        ElNotification.success('删除失败')
    }
  }
}

/* 新增相关 */
const dialogVisible = ref(false)
const addForm = reactive<College>({
  collegeName: '',
  remark: ''
})
watch(
  () => dialogVisible.value,
  (value) => {
    if (!value) {
      resetForm(addForm)
    }
  },
  { deep: true }
)
const handlerAddCollege = async () => {
  const { data } = await addCollege(addForm)
  switch (data.code) {
    case 200:
      await getCollegeListPage()
      dialogVisible.value = false
      ElNotification.success('添加成功')
      break
    default:
      ElNotification.error('添加失败,请重试！')
  }
}

/* 编辑相关 */
const editDialogVisible = ref(false)
const editForm = ref<College>({})
const handleEdit = (row: College) => {
  editDialogVisible.value = true
  editForm.value = row
}
const handlerEditCollege = async () => {
  const { data } = await updateCollege(editForm.value)
  switch (data.code) {
    case 200:
      await getCollegeListPage()
      editDialogVisible.value = false
      ElNotification.success('更新成功')
      break
    default:
      ElNotification.error('更新失败,请重试！')
  }
}

/* 初始化相关 */
const tableData = ref<College[]>([])
const getCollegeListPage = async () => {
  const { data } = await getCollegePage(queryInfo)
  tableData.value = data.data.records
}
onMounted(() => {
  getCollegeListPage()
})
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
