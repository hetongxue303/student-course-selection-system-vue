<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.username"
          type="text"
          placeholder="请输入学生姓名..."
        />
      </el-col>
      <el-button icon="Search" type="success" @click="handleSearch">
        搜索
      </el-button>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
  </div>

  <!--表格-->
  <el-table :data="tableData" width="100%">
    <el-table-column prop="realName" label="学生姓名" width="auto" />
    <el-table-column prop="teacherName" label="任课教师" width="auto" />
    <el-table-column prop="courseName" label="课程名称" width="auto" />
    <el-table-column label="状态" width="auto">
      <template #default="{ row }">
        <el-tag v-if="row.status === 0" type="info">未处理</el-tag>
        <el-tag v-else-if="row.status === 1" type="success">已同意</el-tag>
        <el-tag v-else type="danger">已拒绝</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="成绩" align="center" width="auto">
      <template #default="{ row }">
        <span v-if="row.score">{{ row.score }}</span>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column label="是否结课" align="center" width="auto">
      <template #default="{ row }">
        <span v-if="row.isEnd">是</span>
        <span v-else>否</span>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
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
import Pagination from '../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { Choice } from '../../types/entity'
import { QueryChoice } from '../../types/query'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { getChoicePage } from '../../api/choice'
import { ElMessage, ElTable } from 'element-plus'

// 初始化相关
const tableData = ref<Choice[]>([])
const getChoiceListPage = async () => {
  const { data } = await getChoicePage(query)
  tableData.value = cloneDeep(data.data.records)
  total.value = JSON.parse(data.data.total)
}
onMounted(() => getChoiceListPage())
// 查询属性
const query: QueryChoice = reactive({
  currentPage: 1,
  pageSize: 10
})
// 分页相关
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
  getChoiceListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getChoiceListPage()
}
// 处理搜索
const handleSearch = () => {
  if (!query.realName) {
    ElMessage.info('请输入搜索内容...')
    return
  }
  getChoiceListPage()
}
// 重置搜索
const resetSearch = () => {
  query.realName = ''
  getChoiceListPage()
}
// 监听查询属性
watch(
  () => query,
  async () => {
    await getChoiceListPage()
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.table-tool {
  padding: 15px 0 15px 0;

  .search-box {
    margin-bottom: 15px;
  }
}
</style>
