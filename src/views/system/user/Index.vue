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
      <el-button icon="Search" type="success" @click="getUserListPage">
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
    <el-table-column type="selection" width="50" />
    <el-table-column prop="username" label="用户名" width="150" />
    <el-table-column prop="nickName" label="昵称" width="150" />
    <el-table-column label="性别" width="100">
      <template #default="scope">
        <span v-if="scope.row.gender === '1'">男</span>
        <span v-else-if="scope.row.gender === '2'">女</span>
        <span v-else>保密</span>
      </template>
    </el-table-column>
    <el-table-column prop="phone" label="电话" align="center" width="auto" />
    <el-table-column prop="email" label="邮箱" align="center" width="auto" />
    <el-table-column prop="isEnable" label="状态" align="center" width="auto">
      <template #default="scope">
        <el-switch
          v-model="scope.row.isEnable"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          @change="handleSwitchChange(scope.row)"
        />
      </template>
    </el-table-column>
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
  <el-dialog v-model="dialog.add" title="新增用户" width="40%">
    <el-form :model="addForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="addForm.username" type="text" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="addForm.phone" type="number" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="addForm.nickName" type="text" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="addForm.email" type="email" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="addForm.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="addForm.isEnable">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色">
        <el-radio-group v-model="addForm.type">
          <el-radio-button :label="1">管理员</el-radio-button>
          <el-radio-button :label="2">教师</el-radio-button>
          <el-radio-button :label="3">学生</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户描述">
        <el-input
          v-model="addForm.remark"
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="请输入用户描述(默认：空)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.add = false">返回</el-button>
        <el-button type="primary" @click="handleAddUser"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!--编辑-->
  <el-dialog v-model="dialog.edit" title="编辑用户" width="40%">
    <el-form :model="editForm">
      <el-form-item label="用户名">
        <el-input v-model="editForm.nickName" />
      </el-form-item>
      <el-form-item label="用户描述">
        <el-input
          v-model="editForm.remark"
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="请输入用户描述(默认：空)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.edit = false">返回</el-button>
        <el-button type="primary" @click="handleEditUser"> 确认 </el-button>
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
import { onMounted, reactive, ref, watch } from 'vue'
import { User } from '../../../types/entity'
import { ElMessage, ElMessageBox, ElNotification, ElTable } from 'element-plus'
import { QueryUser } from '../../../types/query'
import Pagination from '../../../components/Pagination/Index.vue'
import {
  addUser,
  delBatchUser,
  delUser,
  getUserPage,
  updateUser
} from '../../../api/user'

const aa = ref(1)
/* 初始化相关 */
const tableData = ref<User[]>([])
const getUserListPage = async () => {
  const { data } = await getUserPage(query)
  tableData.value = data.data.records
  total.value = JSON.parse(data.data.total)
}
onMounted(() => getUserListPage())

/* 分页相关 */
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
  getUserListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getUserListPage()
}

/* 查询相关 */
const query = reactive<QueryUser>({
  name: '',
  currentPage: 1,
  pageSize: 10
})
const resetSearch = () => {
  query.name = ''
  getUserListPage()
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
const multipleSelection = ref<User[]>([])
const handleSelectionChange = (colleges: User[]) => {
  multipleSelection.value = colleges
}
const handleBatchDelete = async () => {
  const ids: number[] = multipleSelection.value.map((item) => {
    return item.userId as number
  })
  const { data } = await delBatchUser(ids)
  switch (data.code) {
    case 200:
      await getUserListPage()
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
const handleSwitchChange = (user: User) => {
  ElMessageBox.confirm(`此操作将 "禁用" ${user.nickName}, 是否继续？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { data } = await updateUser(user)
      switch (data.code) {
        case 200:
          ElNotification.success('更新成功')
          break
        default:
          ElNotification.error('更新失败，请重试！')
      }
    })
    .catch(() => {
      user.isEnable = !user.isEnable
    })
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
    if (!['isEnable', 'gender', 'type'].includes(item)) {
      obj[item] = ''
    }
  })
  Object.assign(form, obj)
}

/* 删除相关 */
const handleDelete = async ({ userId }: User) => {
  if (userId) {
    const { data } = await delUser(userId)
    switch (data.code) {
      case 200:
        await getUserListPage()
        ElNotification.success('删除成功')
        break
      default:
        ElNotification.success('删除失败,请重试！')
    }
  }
}

/* 新增相关 */
const addForm = reactive<User>({ gender: 1, isEnable: false, type: 1 })
watch(
  () => dialog.add,
  (value) => {
    if (!value) {
      resetForm(addForm)
    }
  },
  { deep: true }
)
const handleAddUser = async () => {
  const { data } = await addUser(addForm)
  switch (data.code) {
    case 200:
      await getUserListPage()
      dialog.add = false
      ElNotification.success('添加成功')
      break
    default:
      ElNotification.error('添加失败,请重试！')
  }
}

/* 编辑相关 */
const editForm = ref<User>({})
const handleEdit = (row?: User) => {
  if (row) {
    editForm.value = JSON.parse(JSON.stringify(row))
  } else {
    editForm.value = JSON.parse(
      JSON.stringify(multipleSelection.value[0] as User)
    )
  }
  dialog.edit = true
}
const handleEditUser = async () => {
  const { data } = await updateUser(editForm.value)
  switch (data.code) {
    case 200:
      await getUserListPage()
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
