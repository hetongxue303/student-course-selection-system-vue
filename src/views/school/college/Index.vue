<script setup lang="ts">
import { getCollegeAll } from '../../../api/college'
import { onMounted } from 'vue'

interface College {
  collegeId: number
  collegeName: string
  remark: string | undefined
  createTime: string
  updateTime: string
  delete: boolean
}
let tableData: College[] = []

const getCollegeListAll = async () => {
  const { data } = await getCollegeAll()
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
  getCollegeListAll()
})
</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="selection" width="30" />
    <el-table-column prop="collegeId" label="ID" align="center" width="80" />
    <el-table-column
      prop="collegeName"
      label="学院名称"
      align="center"
      width="200"
    />
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
        <el-button
          type="primary"
          size="small"
          @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss"></style>
