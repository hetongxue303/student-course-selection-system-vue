<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="3">
        <el-input
          v-model="query.courseName"
          type="text"
          placeholder="课程名称"
        />
      </el-col>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
  </div>

  <!--表格-->
  <el-table v-loading="tableLoading" :data="tableData" width="100%">
    <el-table-column prop="courseName" label="课程名称" width="auto" />
    <el-table-column
      prop="user.realName"
      label="任课教师"
      width="auto"
      align="center"
    />
    <el-table-column prop="remark" label="描述" align="center" width="auto" />
    <el-table-column label="创建时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="300">
      <template #default>
        <el-button type="primary">查看详情</el-button>
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
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { Course } from '../../types/entity'
import { QueryCourse } from '../../types/query'
import { ElTable } from 'element-plus'
import { getMyCoursePage } from '../../api/course'
import { randomTimeout } from '../../utils/common'

// 初始化相关
const tableData = ref<Course[]>([])
const tableLoading = ref<boolean>(false)
const getCourseListPage = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getMyCoursePage(query)
    tableData.value = cloneDeep(data.data.records)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, randomTimeout(5, 500))
}
onMounted(() => getCourseListPage())
// 查询属性
const query: QueryCourse = reactive({
  currentPage: 1,
  pageSize: 10
})
// 分页相关
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
}
// 重置搜索
const resetSearch = () => (query.courseName = undefined)

// 监听查询属性
watch(
  () => query,
  async () => {
    await getCourseListPage()
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

  .operate-box {
    margin-bottom: 15px;
  }
}
</style>
