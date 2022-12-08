<script setup lang="ts">
const tableData = []
const handlerChangeSwitchStatus = (id: number, status: boolean) => {
  console.log(id, status)
}
</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <template v-for="(item, index) in tableData" :key="index">
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :align="item.align || 'center'"
        :show-overflow-tooltip="item.showOverflowTooltip || false"
        :min-width="item.minWidth || '100px'"
        :sortable="item.sortable || false"
        :type="item.type || 'normal'"
        :fixed="item.fixed"
        :width="item.width || ''"
        :formatter="item.formatter"
      >
        <template v-if="item.dataType === 'switch'" #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-text="开"
            inactive-text="关"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handlerChangeSwitchStatus(scope.row.id, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="isOperate"
        fixed="right"
        label="操作列"
        :width="operateWidth"
      >
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<style scoped lang="scss"></style>
