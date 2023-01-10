<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="3">
        <el-input v-model="query.roleName" type="text" placeholder="角色名" />
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

  <!--主体-->
  <el-row :gutter="10">
    <el-col :span="18">
      <el-card>
        <template #header>
          <div class="header-box">
            <span>角色列表</span>
          </div>
        </template>

        <!--表格-->
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          highlight-current-row
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="roleName" label="名称" width="auto" />
          <el-table-column prop="dataScope" label="数据权限" width="auto" />
          <el-table-column
            prop="level"
            label="角色级别"
            width="auto"
            align="center"
          />
          <el-table-column prop="description" label="描述" width="auto" />
          <el-table-column label="创建时间" align="center" width="180">
            <template #default="{ row }">
              <span>
                {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
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
                  <el-button
                    type="danger"
                    :disabled="row.roleKey.includes(useUserStore().getRoles)"
                    icon="Delete"
                  />
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
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="header-box">
            <span>菜单分配</span>
            <el-button
              :disabled="saveDisabled"
              type="primary"
              size="small"
              icon="Check"
              @click="handleSaveMenu"
            >
              保存
            </el-button>
          </div>
        </template>
        <!--菜单树-->
        <el-tree
          ref="menuTreeRef"
          lazy
          empty-text="暂无数据"
          node-key="id"
          :load="menuTreeLoad"
          :highlight-current="false"
          :props="{
            value: 'id',
            label: 'label',
            children: 'children',
            disabled: 'disabled',
            isLeaf: 'isLeaf'
          }"
          show-checkbox
        />
      </el-card>
    </el-col>
  </el-row>

  <!--对话框-->
  <el-dialog
    v-model="dialog.show"
    :title="dialog.title"
    width="30%"
    destroy-on-close
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
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="dialogForm.roleName" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色标识" prop="roleKey">
            <el-input v-model="dialogForm.roleKey" clearable type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色级别" prop="level">
            <el-input-number
              v-model="dialogForm.level"
              style="width: 100%"
              :min="0"
              :step="1"
              controls-position="right"
              @change="handleRoleLevelChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据范围" prop="dataScope">
            <el-select
              v-model="dialogForm.dataScope"
              @change="handleDataScopeChange"
            >
              <el-option label="全部" value="全部" />
              <el-option label="本级" value="本级" />
              <el-option label="自定义" value="自定义" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="isDataScope" :gutter="20">
        <el-col :span="24">
          <el-form-item label="菜单权限" prop="dataScope">
            <el-tree-select
              ref="dataScopeRef"
              v-model="dataScopeId"
              multiple
              lazy
              :load="dataScopeLoad"
              :render-after-expand="false"
              style="width: 100%"
              :props="{
                id: 'id',
                label: 'label',
                children: 'children',
                disabled: 'disabled',
                isLeaf: 'isLeaf'
              }"
              show-checkbox
              check-strictly
              check-on-click-node
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="描述信息">
            <el-input
              v-model="dialogForm.description"
              type="textarea"
              :rows="3"
              resize="none"
              clearable
              placeholder="描述信息(默认：空)"
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
import { Role } from '../../../types/entity'
import { QueryRole } from '../../../types/query'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { getMenuSelectTree, getMenuTree } from '../../../api/menu'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElTable,
  ElTree,
  FormInstance,
  FormRules
} from 'element-plus'
import {
  addRole,
  delBatchRole,
  delRole,
  getRolePage,
  updateRole
} from '../../../api/role'
import { useUserStore } from '../../../store/modules/user'

// 初始化相关
const tableData = ref<Role[]>([])
const getRoleListPage = async () => {
  const { data } = await getRolePage(query)
  tableData.value = cloneDeep(data.data.records)
  total.value = JSON.parse(data.data.total)
}
onMounted(() => getRoleListPage())
// 表单检验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  roleName: [
    {
      required: true,
      type: 'string',
      message: '角色名称不能为空',
      trigger: 'blur'
    }
  ],
  roleKey: [
    {
      required: true,
      type: 'string',
      message: '角色标识不能为空',
      trigger: 'blur'
    }
  ],
  level: [
    {
      required: true,
      type: 'number',
      message: '角色等级不能为空',
      trigger: 'blur'
    }
  ],
  dataScope: [
    {
      required: true,
      type: 'string',
      message: '数据范围不能为空',
      trigger: 'blur'
    }
  ]
})
// 查询属性
const query: QueryRole = reactive({
  currentPage: 1,
  pageSize: 10
})
// 分页相关
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
  getRoleListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getRoleListPage()
}
// 重置搜索
const resetSearch = () => {
  query.roleName = undefined
}
// 监听查询属性
watch(
  () => query,
  async () => {
    await getRoleListPage()
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
const multipleSelection = ref<Role[]>([])
const handleSelectionChange = (roles: Role[]) => {
  multipleSelection.value = roles
}
// 单个删除
const handleDelete = async ({ roleId }: Role) => {
  if (roleId) {
    const { data } = await delRole(roleId)
    if (data.code === 200) {
      await getRoleListPage()
      ElNotification.success('删除成功')
      return
    }
    ElNotification.error('删除失败,请重试！')
  }
}
// 批量删除
const handleBatchDelete = async () => {
  const flag = ref<boolean>(true)
  multipleSelection.value.forEach((item) => {
    const { roleKey } = item
    if (roleKey) {
      if (useUserStore().getRoles.includes(roleKey)) {
        ElMessage.warning('不能删除当前角色')
        flag.value = false
      }
    }
  })
  if (flag.value) {
    ElMessageBox.confirm(
      `确认删除选中的${multipleSelection.value.length}条角色数据?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      const ids: number[] = multipleSelection.value.map((item) => {
        return item.roleId as number
      })
      const { data } = await delBatchRole(ids)
      if (data.code === 200) {
        await getRoleListPage()
        ElNotification.success('删除角色成功')
        return
      }
      ElNotification.error('删除角色失败,请重试！')
    })
  }
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
const dialogForm = ref<Role>({ level: 3, dataScope: '全部' })
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})
// 设置dialog
const setDialog = async (operate: string, row?: Role) => {
  if (operate === 'insert') {
    dialog.title = '新增角色'
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as Role)
    }
    dialog.title = '编辑角色'
  }
  dialog.show = true
  isDataScope.value = row?.dataScope === '自定义'
  dialog.operate = operate
}
// 处理dialog操作
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (dialog.operate === 'insert') {
        const { data } = await addRole(dialogForm.value)
        if (data.code === 200) {
          await getRoleListPage()
          dialog.show = false
          ElNotification.success('添加成功')
          return
        }
        ElNotification.error('添加失败,请重试！')
      }
      if (dialog.operate === 'update') {
        const { data } = await updateRole(dialogForm.value)
        if (data.code === 200) {
          await getRoleListPage()
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
  (newValue) => {
    if (!newValue.show) ruleFormRef.value?.resetFields()
  },
  { deep: true }
)
// 处理行点击
const handleRowClick = async ({ roleId }: Role, column: any, event: Event) => {
  const { data } = await getMenuSelectTree(roleId as number)
  menuTreeRef.value?.setCheckedNodes(cloneDeep(data.data))
}
// 处理改变角色等级回调
const handleRoleLevelChange = (currentValue: number, oldValue: number) => {
  dialogForm.value.level = currentValue
}
// 处理更改权限范围
const isDataScope = ref<boolean>(false)
const handleDataScopeChange = (currentValue: string | number) => {
  isDataScope.value = currentValue === '自定义'
}
// 处理菜单下拉列表选中
const dataScopeRef = ref<InstanceType<typeof ElTree>>()
const dataScopeId = ref()
const dataScopeLoad = async (
  node: Node,
  resolve: (data: menuTree[]) => void
) => {
  const { level, key } = node
  if (level === 0) {
    const { data } = await getMenuTree(0)
    return resolve(cloneDeep(data.data))
  }
  if (level > 0) {
    setTimeout(async () => {
      const { data } = await getMenuTree(key as number)
      return resolve(cloneDeep(data.data))
    }, 500)
  }
  return resolve([])
}

/* 菜单树相关 */
interface menuTree {
  id: number
  label: string
  isLeaf?: boolean
  disabled?: boolean
  children?: menuTree[]
}

// 菜单树懒加载
const menuTreeLoad = async (
  node: Node,
  resolve: (data: menuTree[]) => void
) => {
  const { level, key } = node
  if (level === 0) {
    const { data } = await getMenuTree(0)
    return resolve(cloneDeep(data.data))
  }
  if (level > 0) {
    setTimeout(async () => {
      const { data } = await getMenuTree(key as number)
      return resolve(cloneDeep(data.data))
    }, 500)
  }
  return resolve([])
}

const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const handleSaveMenu = () => {
  const menuIds: number[] = menuTreeRef.value?.getCheckedKeys(false) as number[]
  console.log(menuIds)
  console.log(moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
}

// 是否禁用保存按钮
const saveDisabled = ref<boolean>(true)
watch(
  () => menuTreeRef.value?.getCheckedNodes(),
  (value) => {
    if (value) {
      saveDisabled.value = !(value.length > 0)
    }
  }
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

.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

  span:first-child {
    font-weight: bold;
  }
}
</style>
