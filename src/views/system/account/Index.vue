<script setup lang="ts">
import { onMounted } from 'vue'
import { getAccountAll } from '../../../api/account'
import { Account } from '../../../types/entity'

let tableData: Account[] = []

const getAccountListAll = async () => {
  const { data } = await getAccountAll()
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
  getAccountListAll()
})
</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="selection" align="center" width="30" />
    <el-table-column prop="accountId" align="center" label="ID" />
    <el-table-column prop="username" align="center" label="用户名" />
    <el-table-column prop="status" align="center" label="状态" />
    <el-table-column prop="lastLoginIp" align="center" label="最后登录IP" />
    <el-table-column prop="lastLoginTime" align="center" label="最后登录时间" />
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
