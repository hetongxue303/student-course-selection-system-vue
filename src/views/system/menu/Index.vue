<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.menuTitle"
          type="text"
          placeholder="菜单标题..."
        />
      </el-col>
      <el-button icon="Search" type="success" @click="getMenuTree">
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
    :data="tableData"
    style="width: 100%"
    table-layout="fixed"
    row-key="menuId"
    empty-text="暂无数据"
    :highlight-current-row="true"
    lazy
    :load="load"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column label="菜单标题" width="120">
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
    <el-table-column label="组件路径" width="auto" align="center">
      <template #default="{ row }">
        <span
          v-if="row.component && row.component.indexOf('Layout') === -1"
          style="float: left"
        >
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
        <span v-if="row.isFrame">是</span>
        <span v-else>否</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="创建时间"
      align="center"
      width="180"
    />
    <el-table-column label="操作" align="center" width="150">
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

  <!--新增-->
  <el-dialog v-model="dialog.add" title="新增菜单" width="40%">
    <el-form :model="addForm" size="default">
      <el-row :gutter="20">
        <el-col v-show="[0, 1, 2].includes(addForm.menuType)" :span="12">
          <el-form-item label="菜单类型">
            <el-radio-group v-model="addForm.menuType">
              <el-radio-button :label="0">目录</el-radio-button>
              <el-radio-button :label="1">菜单</el-radio-button>
              <el-radio-button :label="2">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="[2].includes(addForm.menuType)" :span="12">
          <el-form-item label="按钮名称">
            <el-input
              v-model="addForm.menuTitle"
              type="text"
              placeholder="按钮名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="[0, 1].includes(addForm.menuType)" :span="24">
          <el-form-item label="菜单图标">
            <el-select
              v-model="addForm.icon"
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
        <el-col v-show="[0, 1].includes(addForm.menuType)" :span="8">
          <el-form-item label="是否外链">
            <el-radio-group v-model="addForm.isFrame">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="[1].includes(addForm.menuType)" :span="8">
          <el-form-item label="菜单缓存">
            <el-radio-group v-model="addForm.isCache">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="[0, 1].includes(addForm.menuType)" :span="8">
          <el-form-item label="菜单可见">
            <el-radio-group v-model="addForm.isDisplay">
              <el-radio-button :label="true">是</el-radio-button>
              <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          v-show="[0, 1].includes(addForm.menuType)"
          :span="[0].includes(addForm.menuType) ? 24 : 12"
        >
          <el-form-item label="菜单标题">
            <el-input
              v-model="addForm.menuTitle"
              type="text"
              placeholder="菜单标题"
            />
          </el-form-item>
        </el-col>
        <el-col v-show="[1, 2].includes(addForm.menuType)" :span="12">
          <el-form-item label="权限标识">
            <el-input
              v-model="addForm.perKey"
              type="text"
              placeholder="权限标识"
            />
          </el-form-item>
        </el-col>
        <el-col v-show="[2].includes(addForm.menuType)" :span="12">
          <el-form-item label="菜单排序">
            <el-input v-model="addForm.sort" type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="[0, 1].includes(addForm.menuType)" :span="12">
          <el-form-item label="路由地址">
            <el-input
              v-model="addForm.path"
              type="text"
              placeholder="路由地址"
            />
          </el-form-item>
        </el-col>
        <el-col v-show="[0, 1].includes(addForm.menuType)" :span="12">
          <el-form-item label="菜单排序">
            <el-input v-model="addForm.sort" type="number" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="[1].includes(addForm.menuType)" :span="12">
          <el-form-item label="组件名称">
            <el-input
              v-model="addForm.menuName"
              type="text"
              placeholder="匹配组件内name字段"
            />
          </el-form-item>
        </el-col>
        <el-col v-show="[1].includes(addForm.menuType)" :span="12">
          <el-form-item label="组件路径">
            <el-input
              v-model="addForm.component"
              type="text"
              placeholder="组件路径"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-show="[0, 1, 2].includes(addForm.menuType)" :span="24">
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
              v-model="addForm.parentId"
              type="number"
              placeholder="上级目录"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="default" @click="dialog.add = false">返回</el-button>
        <el-button size="default" type="primary" @click="handleAddMenu">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Menu, MenuTree } from '../../../types/entity'
import { onMounted, reactive, ref, watch } from 'vue'
import { addMenu, getMenuTableTree } from '../../../api/menu'
import { QueryMenuTree } from '../../../types/query'
import { ElMessage, ElNotification } from 'element-plus'

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
const resetSearch = () => {
  query.menuTitle = ''
  getMenuTree()
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
const handleExport = () => {
  ElMessage.info('待开发...')
}

/* 新增相关 */
const addForm: Menu = reactive({
  menuType: 0,
  icon: 'user',
  isFrame: false,
  isDisplay: true,
  isCache: false,
  sort: 999,
  parentId: 0
})
watch(
  () => dialog.add,
  (value) => {
    if (!value) {
      resetForm(addForm)
    }
  },
  { deep: true }
)
const handleAddMenu = async () => {
  console.log(addForm)
  setTimeout(() => {
    dialog.add = false
  }, 1000)
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

/* 重置表单方法 */
const resetForm = (form: any) => {
  const keys = Object.keys(form)
  const obj: { [name: string]: string } = {}
  keys.forEach((item) => {
    if (
      ![
        'menuType',
        'icon',
        'isFrame',
        'isDisplay',
        'isCache',
        'sort',
        'parentId'
      ].includes(item)
    ) {
      obj[item] = ''
    }
  })
  Object.assign(form, obj)
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
</style>
