<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.menuTitle"
          type="text"
          placeholder="菜单标题"
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
    </div>
  </div>

  <!--表格-->
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
    table-layout="fixed"
    row-key="menuId"
    empty-text="暂无数据"
    :highlight-current-row="true"
    lazy
    :load="load"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column label="菜单标题" width="180">
      <template #default="{ row }">
        <span
          :class="[
            row.hasChildren ? '' : 'menu-title',
            row.menuType !== 2 ? '' : 'menu-title-type'
          ]"
        >
          {{ row.menuTitle }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="图标" width="100" align="center">
      <template #default="{ row }">
        <div v-if="row.icon" class="menu-icon">
          <svg-icon :name="row.icon" :mr="0" />
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="sort" label="排序" width="100" align="center" />
    <el-table-column label="权限标识" width="auto" align="center">
      <template #default="{ row }">
        <span style="float: left; margin-left: 50px">
          {{ row.perKey }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="组件路径" width="auto" show-overflow-tooltip>
      <template #default="{ row }">
        <span v-if="row.component && row.component.indexOf('Layout') === -1">
          {{ row.component }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="isFrame" label="外链" width="80" align="center">
      <template #default="{ row }">
        <span v-if="row.isFrame">是</span>
        <span v-else>否</span>
      </template>
    </el-table-column>
    <el-table-column prop="isCache" label="缓存" width="80" align="center">
      <template #default="{ row }">
        <span v-if="row.isFrame">是</span>
        <span v-else>否</span>
      </template>
    </el-table-column>
    <el-table-column prop="isDisplay" label="可见" width="80" align="center">
      <template #default="{ row }">
        <span v-if="row.isDisplay">是</span>
        <span v-else>否</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="150">
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

  <!--新增/编辑-->
  <el-dialog
    v-model="dialog.show"
    :title="dialog.title"
    width="40%"
    destroy-on-close
    :close-on-click-modal="false"
    :show-close="false"
    :style="{ borderRadius: '10px' }"
  >
    <el-form ref="ruleFormRef" :model="dialogForm" :rules="rules" status-icon>
      <el-row :gutter="20">
        <el-col v-show="[0, 1, 2].includes(dialogForm.menuType)" :span="12">
          <el-form-item label="菜单类型">
            <el-radio-group v-model="dialogForm.menuType">
              <el-radio-button :label="0">目录</el-radio-button>
              <el-radio-button :label="1">菜单</el-radio-button>
              <el-radio-button :label="2">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="[2].includes(dialogForm.menuType)" :span="12">
          <el-form-item label="按钮名称">
            <el-input
              v-model="dialogForm.menuTitle"
              type="text"
              placeholder="按钮名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="[0, 1].includes(dialogForm.menuType)" :span="24">
          <el-form-item label="菜单图标">
            <el-select
              v-model="dialogForm.icon"
              placeholder="user"
              clearable
              style="width: 100%"
            >
              <el-option label="user" value="user" />
              <el-option label="college" value="college" />
              <el-option label="school" value="school" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="[0, 1].includes(dialogForm.menuType)" :span="8">
          <el-form-item label="是否外链">
            <el-radio-group v-model="dialogForm.isFrame">
              <el-radio-button label="true">是</el-radio-button>
              <el-radio-button label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="[1].includes(dialogForm.menuType)" :span="8">
          <el-form-item label="菜单缓存">
            <el-radio-group v-model="dialogForm.isCache">
              <el-radio-button label="true">是</el-radio-button>
              <el-radio-button label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="[0, 1].includes(dialogForm.menuType)" :span="8">
          <el-form-item label="菜单可见">
            <el-radio-group v-model="dialogForm.isDisplay">
              <el-radio-button label="true">是</el-radio-button>
              <el-radio-button label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          v-show="[0, 1].includes(dialogForm.menuType)"
          :span="[0].includes(dialogForm.menuType) ? 24 : 12"
        >
          <el-form-item label="菜单标题">
            <el-input
              v-model="dialogForm.menuTitle"
              type="text"
              placeholder="菜单标题"
            />
          </el-form-item>
        </el-col>
        <el-col v-show="[1, 2].includes(dialogForm.menuType)" :span="12">
          <el-form-item label="权限标识">
            <el-input
              v-model="dialogForm.perKey"
              type="text"
              placeholder="权限标识"
            />
          </el-form-item>
        </el-col>
        <el-col v-show="[2].includes(dialogForm.menuType)" :span="12">
          <el-form-item label="菜单排序">
            <el-input v-model="dialogForm.sort" type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="[0, 1].includes(dialogForm.menuType)" :span="12">
          <el-form-item label="路由地址">
            <el-input
              v-model="dialogForm.path"
              type="text"
              placeholder="路由地址"
            />
          </el-form-item>
        </el-col>
        <el-col v-show="[0, 1].includes(dialogForm.menuType)" :span="12">
          <el-form-item label="菜单排序">
            <el-input v-model="dialogForm.sort" type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="[1].includes(dialogForm.menuType)" :span="12">
          <el-form-item label="组件名称">
            <el-input
              v-model="dialogForm.menuName"
              type="text"
              placeholder="匹配组件内name字段"
            />
          </el-form-item>
        </el-col>
        <el-col v-show="[1].includes(dialogForm.menuType)" :span="12">
          <el-form-item label="组件路径">
            <el-input
              v-model="dialogForm.component"
              type="text"
              placeholder="组件路径"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="[0, 1, 2].includes(dialogForm.menuType)" :span="24">
          <el-form-item label="上级目录">
            <!--            <el-tree-select-->
            <!--              v-model="value"-->
            <!--              style="width: 100%"-->
            <!--              lazy-->
            <!--              value-key="name"-->
            <!--              node-key="name"-->
            <!--              placeholder="请选择"-->
            <!--              show-checkbox-->
            <!--              check-strictly-->
            <!--              highlight-current-->
            <!--              :load="loadTreeSelect"-->
            <!--              :props="{ value: 'name', label: 'label' }"-->
            <!--              :cache-data="cacheData"-->
            <!--            />-->
            <el-input
              v-model="dialogForm.parentId"
              type="number"
              placeholder="上级目录"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="default" @click="dialog.show = false">返回</el-button>
        <el-button
          size="default"
          type="primary"
          @click="handleOperate(ruleFormRef)"
        >
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Menu, MenuTree, User } from '../../../types/entity'
import { onMounted, reactive, ref, watch } from 'vue'
import {
  addMenu,
  delBatchMenu,
  delMenu,
  getMenuTableTree,
  updateMenu
} from '../../../api/menu'
import { QueryMenuTree } from '../../../types/query'
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElTable,
  FormInstance,
  FormRules
} from 'element-plus'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { addUser, delBatchUser, updateUser } from '../../../api/user'

/* 树形选择 */
const value = ref(1)
const cacheData = [{ value: 1, label: '顶级目录' }]
let id = 2
// eslint-disable-next-line consistent-return
const loadTreeSelect = (node: any, resolve: any) => {
  if (node.isLeaf) return resolve([])
  setTimeout(() => {
    resolve([
      {
        value: (id += 1),
        label: `lazy load node${id}`
      },
      {
        value: (id += 1),
        label: `lazy load node${id}`,
        isLeaf: true
      }
    ])
  }, 400)
}
const handleDelete = (row: Menu) => {
  delMenu(row.menuId as number).then(({ data }) => {
    if (data.code === 200) {
      ElNotification.success('删除成功')
      getMenuTree()
      return
    }
    ElNotification.success('删除失败，请重试！')
  })
}
/* 初始化相关 */
const tableData = ref<MenuTree[]>([])
const getMenuTree = async () => {
  const { data } = await getMenuTableTree(query)
  tableData.value = data.data
}
onMounted(() => getMenuTree())

/* 表格懒加载 */
const load = (
  row: MenuTree,
  treeNode: unknown,
  resolve: (date: MenuTree[]) => void
) => {
  setTimeout(() => {
    if (row.menuId) {
      query.parentId = row.menuId
      getMenuTableTree(query).then(({ data }) => resolve(data.data))
    }
  }, 500)
}

/* 查询相关 */
const query: QueryMenuTree = reactive({
  currentPage: 1,
  pageSize: 10,
  parentId: 0
})
watch(
  () => query,
  () => getMenuTree(),
  { deep: true }
)
const resetSearch = () => (query.menuTitle = undefined)

/* 表格相关 */
const dialogForm = ref<Menu>({
  menuType: 0,
  icon: 'user',
  isFrame: false,
  isDisplay: true,
  isCache: false,
  sort: 999,
  parentId: 0
})
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})

watch(
  () => dialog.show,
  (value) => {
    if (!value)
      dialogForm.value = {
        menuType: 0,
        icon: 'user',
        isFrame: false,
        isDisplay: true,
        isCache: false,
        sort: 999,
        parentId: 0
      }
  },
  { deep: true }
)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Menu[]>([])
const handleSelectionChange = (menus: Menu[]) => {
  multipleSelection.value = menus
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
      return item.menuId as number
    })
    const { data } = await delBatchMenu(ids)
    if (data.code === 200) {
      await getMenuTree()
      ElNotification.success('删除成功')
      return
    }
    ElNotification.error('删除失败,请重试！')
  })
}
const disabled = reactive({
  edit: true,
  delete: true,
  export: false
})
watch(
  () => multipleSelection.value,
  () => {
    disabled.edit = multipleSelection.value.length !== 1
    disabled.delete = multipleSelection.value.length < 1
  },
  { immediate: true, deep: true }
)
const setDialog = async (operate: string, row?: Menu) => {
  if (operate === 'insert') {
    dialog.title = '新增菜单'
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as Menu)
    }
    dialog.title = '编辑菜单'
  }
  dialog.show = true
  dialog.operate = operate
}

const handleAddMenu = async () => {
  // const { data } = await addMenu(addForm)
  // switch (data.code) {
  //   case 200:
  //     await getMenuTree()
  //     dialog.add = false
  //     ElNotification.success('添加成功')
  //     break
  //   default:
  //     ElNotification.error('添加失败,请重试！')
  // }
}
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      if (dialog.operate === 'insert') {
        addMenu(dialogForm.value).then(({ data }) => {
          if (data.code === 200) {
            getMenuTree()
            dialog.show = false
            ElNotification.success('添加成功')
            return
          }
          ElNotification.error('添加失败,请重试！')
        })
      }
      if (dialog.operate === 'update') {
        updateMenu(dialogForm.value).then(({ data }) => {
          if (data.code === 200) {
            getMenuTree()
            dialog.show = false
            ElNotification.success('更新成功')
            return
          }
          ElNotification.error('更新失败,请重试！')
        })
      }
    }
  })
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

.menu-title {
  margin-left: 20px;

  &-type {
    margin-left: 0;
  }
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none !important;
}

:deep(input[type='number']) {
  -moz-appearance: textfield !important;
}
</style>
