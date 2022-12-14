<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.collegeName"
          type="text"
          placeholder="请输入学院名称..."
        />
      </el-col>
      <el-button icon="Search" type="success" @click="getCollegeListPage">
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
    ref="multipleTableRef"
    :data="tableData"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column prop="collegeName" label="学院名称" width="200" />
    <el-table-column
      prop="remark"
      label="学院描述"
      align="center"
      width="auto"
    />
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
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Choice } from '../../../types/entity'
import { getCollegePage } from '../../../api/college'
import { QueryCollege } from '../../../types/query'

/* 初始化相关 */
const tableData = ref<Choice[]>([])
const getChoiceListPage = async () => {
  const { data } = await getCollegePage(query)
  tableData.value = data.data.records
  total.value = JSON.parse(data.data.total)
}
onMounted(() => getChoiceListPage())

/* 分页相关 */
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
  getChoiceListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getChoiceListPage()
}

/* 查询相关 */
const query: QueryCollege = reactive({
  currentPage: 1,
  pageSize: 10
})
const resetSearch = () => {
  query.collegeName = ''
  getChoiceListPage()
}
</script>

<style scoped lang="scss"></style>
