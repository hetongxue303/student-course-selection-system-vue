<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input v-model="query.realName" type="text" placeholder="学生姓名" />
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="query.courseName"
          type="text"
          placeholder="课程名称"
        />
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="query.status"
          placeholder="状态"
          clearable
          @close="query.status = undefined"
        >
          <el-option label="所有记录" :value="-1" />
          <el-option label="未处理" :value="0" />
          <el-option label="已同意" :value="1" />
          <el-option label="已拒绝" :value="2" />
        </el-select>
      </el-col>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
  </div>

  <!--表格-->
  <el-table v-loading="tableLoading" :data="tableData" width="100%">
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column label="学生名字" prop="realName" width="auto" />
    <el-table-column label="课程名称" prop="courseName" width="auto" />
    <el-table-column label="申请时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column
      v-role="['admin', 'teacher']"
      label="操作"
      align="center"
      width="300"
    >
      <template #default="{ row }">
        <el-button
          v-show="row.status === 0"
          type="success"
          @click="handleOperate(1, row)"
        >
          同意
        </el-button>
        <el-button
          v-show="row.status === 0"
          type="danger"
          @click="handleOperate(2, row)"
        >
          拒绝
        </el-button>
        <el-tag
          v-show="row.status !== 0"
          disable-transitions
          :type="row.status === 1 ? 'success' : 'danger'"
        >
          {{ row.status === 1 ? '已同意' : '已拒绝' }}
        </el-tag>
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
import { Choice } from '../../types/entity'
import { QueryChoice } from '../../types/query'
import { getChoicePage, updateChoice } from '../../api/choice'
import { ElNotification, ElTable } from 'element-plus'
import { randomTimeout } from '../../utils/common'

// 初始化相关
const tableData = ref<Choice[]>([])
const tableLoading = ref<boolean>(false)
const getChoiceListPage = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getChoicePage(query)
    tableData.value = cloneDeep(data.data.records)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, randomTimeout(5, 500))
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
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
}

// 重置搜索
const resetSearch = () => {
  query.realName = undefined
  query.courseName = undefined
  query.status = undefined
}
// 监听查询属性
watch(
  () => query,
  async () => {
    await getChoiceListPage()
  },
  { deep: true }
)
// 处理表格
const handleOperate = async (operate: number, row: Choice) => {
  row.status = operate
  const { data } = await updateChoice(row)
  if (data.code === 200) {
    if (operate === 1) {
      ElNotification.success('已同意')
    } else {
      ElNotification.success('已拒绝')
    }
    await getChoiceListPage()
  } else if (operate === 1) {
    ElNotification.success('同意失败，请重试！')
  } else {
    ElNotification.success('拒绝失败，请重试！')
  }
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
