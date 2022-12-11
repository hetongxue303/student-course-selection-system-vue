<script setup lang="ts">
import { MenuTable } from '../../../types/entity'
import { onMounted, ref } from 'vue'
import { getMenuToTable } from '../../../api/menu'

/* 初始化相关 */
const tableData = ref<MenuTable[]>([])
const getMenuList = async () => {
  const { data } = await getMenuToTable(0)
  tableData.value = data.data
}
onMounted(() => getMenuList())

/* 懒加载 */
const load = (
  row: MenuTable,
  treeNode: unknown,
  resolve: (date: MenuTable[]) => void
) => {
  setTimeout(() => {
    if (row.menuId != null) {
      getMenuToTable(row.menuId).then((res) => {
        console.log(res.data.data)
        resolve(res.data.data)
      })
    }
  }, 500)
}
</script>

<template>
  <el-table
    :data="tableData"
    table-layout="fixed"
    style="width: 100%"
    row-key="menuId"
    border
    lazy
    :load="load"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column prop="menuTitle" label="菜单标题" width="200" />
    <el-table-column label="图标" align="center">
      <template #default="{ row }">
        <div
          style="display: flex; align-items: center; justify-content: center"
        >
          <svg-icon :name="row.icon" />
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="sort" label="排序" />
    <el-table-column prop="perKey" label="权限标识" />
    <el-table-column prop="component" label="组件路径" />
    <el-table-column prop="isFrame" label="外链">
      <template #default="{ row }">
        <span v-if="row.isFrame">是</span>
        <span v-else>否</span>
      </template>
    </el-table-column>
    <el-table-column prop="isCache" label="缓存">
      <template #default="{ row }">
        <span v-if="row.isFrame">是</span>
        <span v-else>否</span>
      </template>
    </el-table-column>
    <el-table-column prop="isDisplay" label="可见">
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
</template>

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
