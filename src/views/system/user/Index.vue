<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="3">
        <el-input
          v-if="query.type === undefined || query.type === 1"
          v-model="query.username"
          type="text"
          placeholder="账号"
        />
        <el-input
          v-else-if="query.type === 2"
          v-model="query.username"
          type="text"
          placeholder="工号"
        />
        <el-input
          v-else
          v-model="query.username"
          type="text"
          placeholder="学号"
        />
      </el-col>
      <el-col :span="3">
        <el-select v-model="query.isEnable" placeholder="状态" clearable>
          <el-option label="启用" :value="true" />
          <el-option label="禁用" :value="false" />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="query.type" placeholder="角色" clearable>
          <el-option label="管理员" :value="1" />
          <el-option label="教师" :value="2" />
          <el-option label="学生" :value="3" />
        </el-select>
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
    <el-table-column
      v-if="query.type === undefined || query.type === 1"
      prop="username"
      label="账号"
      width="auto"
    />
    <el-table-column
      v-else-if="query.type === 2"
      prop="username"
      label="工号"
      width="auto"
    />
    <el-table-column v-else prop="username" label="学号" width="auto" />
    <el-table-column
      v-if="query.type === undefined || query.type === 1"
      prop="realName"
      label="姓名"
      width="auto"
    >
      <template #default="{ row }">
        <span v-if="!row.realName">管理员</span>
      </template>
    </el-table-column>
    <el-table-column
      v-else-if="query.type === 2"
      prop="realName"
      label="教师姓名"
      width="auto"
    />
    <el-table-column v-else prop="realName" label="学生姓名" width="auto" />
    <el-table-column label="性别" width="auto">
      <template #default="{ row }">
        <el-tag type="success" effect="dark">
          {{ row.gender === '1' ? '男' : '女' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="phone" label="电话" align="center" width="auto" />
    <el-table-column prop="email" label="邮箱" align="center" width="auto" />
    <el-table-column prop="isEnable" label="状态" align="center" width="auto">
      <template #default="scope">
        <el-switch
          v-model="scope.row.isEnable"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          :disabled="!useUserStore().getIsAdmin"
          inline-prompt
          active-text="正常"
          inactive-text="禁用"
          @change="handleSwitchChange(scope.row)"
        />
      </template>
    </el-table-column>
    <el-table-column label="注册时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="200">
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
    width="30%"
    :close-on-click-modal="false"
  >
    <el-form
      ref="ruleFormRef"
      :model="dialogForm"
      :rules="rules"
      status-icon
      label-width="70px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            v-if="dialogForm.type === undefined || dialogForm.type === 1"
            label="账号"
            prop="username"
          >
            <el-input
              v-model="dialogForm.username"
              type="text"
              clearable
              placeholder="账号"
            />
          </el-form-item>
          <el-form-item
            v-else-if="dialogForm.type === 2"
            label="工号"
            prop="username"
          >
            <el-input
              v-model="dialogForm.username"
              type="text"
              clearable
              placeholder="工号"
            />
          </el-form-item>
          <el-form-item v-else label="学号" prop="username">
            <el-input
              v-model="dialogForm.username"
              type="text"
              clearable
              placeholder="学号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="phone">
            <el-input
              v-model="dialogForm.phone"
              :controls="false"
              type="number"
              maxlength="11"
              placeholder="电话"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            v-if="dialogForm.type === undefined || dialogForm.type === 1"
            label="昵称"
            prop="nickName"
          >
            <el-input
              v-model="dialogForm.nickName"
              placeholder="昵称"
              type="text"
              clearable
              @close="dialogForm.nickName = undefined"
            />
          </el-form-item>
          <el-form-item v-else label="姓名" prop="realName">
            <el-input
              v-model="dialogForm.realName"
              placeholder="姓名"
              type="text"
              clearable
              @close="dialogForm.realName = undefined"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="dialogForm.email"
              placeholder="邮箱"
              type="text"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="dialogForm.gender">
              <el-radio :label="'1'">男</el-radio>
              <el-radio :label="'2'">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="isEnable">
            <el-radio-group v-model="dialogForm.isEnable">
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="角色" prop="type">
            <el-select
              v-model="dialogForm.type"
              style="width: 100%"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="描述" prop="remark">
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
import Pagination from '../../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { Role, User } from '../../../types/entity'
import { QueryUser } from '../../../types/query'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import {
  ElMessageBox,
  ElNotification,
  ElTable,
  FormInstance,
  FormRules
} from 'element-plus'
import {
  addUser,
  delBatchUser,
  delUser,
  getUserPage,
  updateUser
} from '../../../api/user'
import { getRoleAll } from '../../../api/role'
import { useUserStore } from '../../../store/modules/user.js'

// 初始化相关
const tableData = ref<User[]>([])
const getUserListPage = async () => {
  const { data } = await getUserPage(query)
  tableData.value = cloneDeep(data.data.records)
  total.value = JSON.parse(data.data.total)
}
onMounted(() => getUserListPage())
// 表单检验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      type: 'string',
      message: '不能为空',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: '电话不能为空',
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      type: 'email',
      message: '邮箱不能为空',
      trigger: 'blur'
    }
  ]
})
// 查询属性
const query: QueryUser = reactive({
  currentPage: 1,
  pageSize: 10
})
// 分页相关
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
  getUserListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getUserListPage()
}
// 重置搜索
const resetSearch = () => {
  query.username = undefined
  query.type = undefined
  query.isEnable = undefined
}
// 监听查询属性
watch(
  () => query,
  async () => {
    await getUserListPage()
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
const multipleSelection = ref<User[]>([])
const handleSelectionChange = (users: User[]) => {
  multipleSelection.value = users
}
// 单个删除
const handleDelete = async ({ userId }: User) => {
  if (userId) {
    const { data } = await delUser(userId)
    if (data.code === 200) {
      await getUserListPage()
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
      return item.userId as number
    })
    const { data } = await delBatchUser(ids)
    if (data.code === 200) {
      await getUserListPage()
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
const dialogForm = ref<User>({ gender: '1', isEnable: false })
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})
// 设置dialog
const setDialog = async (operate: string, row?: User) => {
  if (operate === 'insert') {
    dialog.title = '新增用户'
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as User)
    }
    dialog.title = '编辑用户'
  }
  getRoleList()
  dialog.show = true
  dialog.operate = operate
}
// 处理dialog操作
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (dialog.operate === 'insert') {
        const { data } = await addUser(dialogForm.value)
        if (data.code === 200) {
          await getUserListPage()
          dialog.show = false
          ElNotification.success('添加成功')
          return
        }
        ElNotification.error('添加失败,请重试！')
      }
      if (dialog.operate === 'update') {
        const { data } = await updateUser(dialogForm.value)
        if (data.code === 200) {
          await getUserListPage()
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
    // 关闭表单时重置表单
    if (!value) dialogForm.value = { gender: '1', isEnable: false }
  },
  { deep: true }
)
// switch改变处理
const handleSwitchChange = (user: User) => {
  ElMessageBox.confirm(
    `此操作将 ${user.isEnable ? '启用' : '禁用'} ${user.nickName}, 是否继续？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const { data } = await updateUser(user)
      // eslint-disable-next-line no-unused-expressions
      data.code === 200
        ? ElNotification.success('更新成功')
        : ElNotification.error('更新失败，请重试！')
    })
    .catch(() => (user.isEnable = !user.isEnable))
}
// 获取所有角色信息
const roleList = ref<Role[]>([])
const getRoleList = () => {
  getRoleAll().then(({ data }) => (roleList.value = cloneDeep(data.data)))
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

:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none !important;
}

:deep(input[type='number']) {
  -moz-appearance: textfield !important;
}
</style>
