<script setup lang="ts">
import { getMajorAll } from '../../../api/major'
import { onMounted } from 'vue'
import { Major } from '../../../types/entity'

let tableData: Major[] = []

const getMajorListAll = async () => {
  const { data } = await getMajorAll()
  tableData = data.data
  console.log(tableData)
}

const handleEdit = (index: number, row: any) => {
  console.log(index, row)
}

const handleDelete = (index: number, row: any) => {
  console.log(index, row)
}

onMounted(() => {
  getMajorListAll()
})
</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="selection" width="30"></el-table-column>
    <el-table-column prop="collegeId" label="ID" align="center" width="80" />
    <el-table-column
      prop="collegeName"
      label="专业名称"
      align="center"
      width="200"
    />
    <el-table-column
      prop="remark"
      label="专业描述"
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
        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)"
          ><el-icon> <component is="EditPen" /> </el-icon
        ></el-button>
        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">
          <el-icon> <component is="Delete" /> </el-icon
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss"></style>
