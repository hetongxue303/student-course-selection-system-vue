<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <el-input placeholder="请输入搜索内容..." />
    </el-col>
    <el-col :span="2">
      <el-button type="primary">查询</el-button>
    </el-col>
  </el-row>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="selection" width="30" />
    <el-table-column prop="accountId" label="ID" />
    <el-table-column prop="username" label="用户名" />
    <el-table-column label="状态">
      <template #default="scope">
        <el-switch
          v-model="scope.row.status"
          inline-prompt
          :loading="loading"
          @change="changeStatus(scope.row)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="lastLoginIp" label="最后登录IP" />
    <el-table-column prop="lastLoginTime" label="最后登录时间" />
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = [
  {
    accountId: '1',
    username: 'Tom',
    lastLoginIp: '127.0.0.1',
    lastLoginTime: '2022-05-10',
    status: true
  },
  {
    accountId: '2',
    username: 'aam',
    lastLoginIp: '127.0.0.1',
    lastLoginTime: '2022-05-10',
    status: false
  },
  {
    accountId: '3',
    username: 'Tom',
    lastLoginIp: '127.0.0.1',
    lastLoginTime: '2022-05-10',
    status: false
  },
  {
    accountId: '4',
    username: 'oimm',
    lastLoginIp: '127.0.0.1',
    lastLoginTime: '2022-05-10',
    status: true
  }
]
/**
 * 事件
 */
const loading = ref(false)
// 改变状态
const changeStatus = (data: any) => {}
</script>

<style scoped lang="scss"></style>
