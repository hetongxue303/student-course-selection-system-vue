<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="3">
        <el-input
          v-model="query.courseName"
          type="text"
          placeholder="请输入学院名称..."
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
    <el-table-column prop="user.realName" label="任课教师" width="auto" />
    <el-table-column label="性别" width="auto">
      <template #default="{ row }">
        {{ row.user.gender === '1' ? '男' : '女' }}
      </template>
    </el-table-column>
    <el-table-column label="剩余" width="auto">
      <template #default="{ row }">
        <el-tag
          :type="row.choice === row.count ? 'warning' : 'success'"
          disable-transitions
        >
          {{
            row.choice === row.count ? '已满' : `${row.count - row.choice}人`
          }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="总人数" width="auto">
      <template #default="{ row }">
        <el-tag type="info" disable-transitions effect="dark">
          {{ row.count }}人
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="描述" align="center" width="auto" />
    <el-table-column label="创建时间" align="center" width="180">
      <template #default="{ row }">
        <span>
          {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="300">
      <template #default="{ row }">
        <el-button
          :disabled="row.choice === row.count"
          type="primary"
          @click="handleChoiceCourse(1, row)"
        >
          选择
        </el-button>
        <el-button type="warning" @click="handleChoiceCourse(2, row)">
          退选
        </el-button>
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
import { ElMessageBox, ElNotification, ElTable } from 'element-plus'
import moment from 'moment'
import { Course } from '../../types/entity'
import { getCoursePage } from '../../api/course'
import { QueryCourse } from '../../types/query'
import { cloneDeep } from 'lodash'
import { studentChoiceCourse } from '../../api/choice'
import { randomTimeout } from '../../utils/common'

// 初始化相关
const tableData = ref<Course[]>([])
const tableLoading = ref<boolean>(false)
const getCourseListPage = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getCoursePage(query)
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
const resetSearch = () => {
  query.courseName = undefined
}
// 监听查询属性
watch(
  () => query,
  async () => {
    await getCourseListPage()
  },
  { deep: true }
)
// 处理选课/退课
const handleChoiceCourse = async (type: number, row: Course) => {
  const info: any = reactive({
    text: '',
    success: '',
    error: ''
  })
  if (type === 1) {
    info.text = `确认选择 ${row.courseName} 课程吗?`
    info.successText = '选课成功'
    info.errorText = '选课失败,请重试！'
  } else {
    info.text = `确认退选 ${row.courseName} 课程吗?`
    info.successText = '退选成功'
    info.errorText = '退选失败,请重试！'
  }
  ElMessageBox.confirm(info.text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { data } = await studentChoiceCourse(type, row.courseId as number)
    switch (data.code) {
      case 200:
        await getCourseListPage()
        ElNotification.success(info.successText)
        break
      default:
        ElNotification.error(data.message ? data.message : info.errorText)
    }
  })
}
</script>

<style scoped lang="scss">
.table-tool {
  padding: 15px 0 15px 0;

  .search-box {
    margin-bottom: 15px;
  }
}
</style>
