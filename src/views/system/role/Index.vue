<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.roleName"
          type="text"
          placeholder="角色名称..."
        />
      </el-col>
      <el-button icon="Search" type="success" @click="getRoleListPage">
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
            id: 'id',
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

  <!--新增-->
  <el-dialog
    v-model="dialog.add"
    title="新增角色"
    width="40%"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form :model="addForm">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色名称">
            <el-input v-model="addForm.roleName" type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色标识">
            <el-input v-model="addForm.roleKey" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色级别">
            <el-input-number
              v-model="addForm.level"
              style="width: 100%"
              :min="0"
              :step="1"
              controls-position="right"
              @change="handleRoleLevelChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据范围">
            <el-select v-model="addForm.dataScope">
              <el-option label="全部" value="全部" />
              <el-option label="本级" value="本级" />
              <el-option label="自定义" value="自定义" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述信息">
        <el-input
          v-model="addForm.description"
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="请输入描述信息(默认：空)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.add = false">返回</el-button>
        <el-button type="primary" @click="handleAddRole"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!--编辑-->
  <el-dialog
    v-model="dialog.edit"
    title="编辑角色"
    width="40%"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form :model="editForm">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色名称">
            <el-input v-model="editForm.roleName" type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色标识">
            <el-input v-model="editForm.roleKey" type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色级别">
            <el-input-number
              v-model="editForm.level"
              style="width: 100%"
              :min="0"
              :step="1"
              controls-position="right"
              @change="handleRoleLevelChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据范围">
            <el-select v-model="editForm.dataScope">
              <el-option label="全部" value="全部" />
              <el-option label="本级" value="本级" />
              <el-option label="自定义" value="自定义" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述信息">
        <el-input
          v-model="editForm.description"
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="请输入描述信息(默认：空)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.edit = false">返回</el-button>
        <el-button type="primary" @click="handleEditRole"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Pagination from '../../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import {
  addRole,
  delBatchRole,
  delRole,
  getRolePage,
  updateRole
} from '../../../api/role'
import { Role } from '../../../types/entity'
import { QueryRole } from '../../../types/query'
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElTable,
  ElTree
} from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { getMenuSelectTree, getMenuTree } from '../../../api/menu'
import { cloneDeep } from 'lodash'
import moment from 'moment'

/* 初始化相关 */
const tableData = ref<Role[]>([])
const getRoleListPage = async () => {
  const { data } = await getRolePage(query)
  tableData.value = cloneDeep(data.data.records)
  total.value = JSON.parse(data.data.total)
}
onMounted(() => getRoleListPage())

/* 分页相关 */
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
  getRoleListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getRoleListPage()
}

/* 查询相关 */
const query: QueryRole = reactive({
  currentPage: 1,
  pageSize: 10
})
const resetSearch = () => {
  query.roleName = ''
  getRoleListPage()
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
const multipleSelection = ref<Role[]>([])
const handleSelectionChange = (roles: Role[]) => {
  multipleSelection.value = roles
}
const handleRowClick = async ({ roleId }: Role, column: any, event: Event) => {
  const { data } = await getMenuSelectTree(roleId as number)
  menuTreeRef.value?.setCheckedNodes(cloneDeep(data.data))
}
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
      return item.roleId as number
    })
    const { data } = await delBatchRole(ids)
    switch (data.code) {
      case 200:
        await getRoleListPage()
        ElNotification.success('删除成功')
        break
      default:
        ElNotification.success(
          data.message ? data.message : '删除失败,请重试！'
        )
    }
  })
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
const handleRoleLevelChange = (currentValue: number, oldValue: number) => {
  addForm.level = currentValue
}

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
const handleDelete = async ({ roleId }: Role) => {
  if (roleId) {
    const { data } = await delRole(roleId)
    switch (data.code) {
      case 200:
        await getRoleListPage()
        ElNotification.success('删除成功')
        break
      default:
        ElNotification.success('删除失败,请重试！')
    }
  }
}

/* 新增相关 */
const addForm: Role = reactive({ level: 0, dataScope: '全部' })
watch(
  () => dialog.add,
  (value) => {
    if (!value) {
      resetForm(addForm)
    }
  },
  { deep: true }
)
const handleAddRole = async () => {
  const { data } = await addRole(addForm)
  switch (data.code) {
    case 200:
      await getRoleListPage()
      dialog.add = false
      ElNotification.success('添加成功')
      break
    default:
      ElNotification.error('添加失败,请重试！')
  }
}

/* 编辑相关 */
const editForm = ref<Role>({})
const handleEdit = (row?: Role) => {
  if (row) {
    editForm.value = cloneDeep(row)
  } else {
    editForm.value = cloneDeep(multipleSelection.value[0] as Role)
  }
  dialog.edit = true
}
const handleEditRole = async () => {
  const { data } = await updateRole(editForm.value)
  switch (data.code) {
    case 200:
      await getRoleListPage()
      dialog.edit = false
      ElNotification.success('更新成功')
      break
    default:
      ElNotification.error(data.message ? data.message : '更新失败,请重试！')
  }
}

/* 菜单树相关 */
interface menuTree {
  id: number
  label: string
  isLeaf?: boolean
  disabled?: boolean
  children?: menuTree[]
}
const menuTreeLoad = async (
  node: Node,
  resolve: (data: menuTree[]) => void
  // eslint-disable-next-line consistent-return
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
}
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const handleSaveMenu = () => {
  const menuIds: number[] = menuTreeRef.value?.getCheckedKeys(false) as number[]
  console.log(menuIds)
  console.log(moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
}

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
