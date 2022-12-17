<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.username"
          type="text"
          placeholder="学生名..."
        />
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="query.courseName"
          type="text"
          placeholder="课程名..."
        />
      </el-col>
      <el-col :span="3">
        <el-select v-model="query.status" placeholder="状态" clearable>
          <el-option label="所有记录" :value="-1" />
          <el-option label="未处理" :value="0" />
          <el-option label="同意" :value="1" />
          <el-option label="拒绝" :value="2" />
        </el-select>
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
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column label="学生名字" prop="readName" width="auto" />
    <el-table-column label="课程名称" prop="courseName" width="auto" />
    <el-table-column label="状态" align="center" width="auto">
      <template #default="{ row }">
        <el-tag v-if="row.status === 0" type="warning" disable-transitions>
          未处理
        </el-tag>
        <el-tag v-if="row.status === 1" type="success" disable-transitions>
          已同意
        </el-tag>
        <el-tag v-if="row.status === 2" type="danger" disable-transitions>
          已拒绝
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center" width="180">
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
          type="success"
          :disabled="row.status !== 0"
          @click="handleOperate(1, row)"
        >
          同意
        </el-button>
        <el-button
          :disabled="row.status !== 0"
          type="danger"
          @click="handleOperate(2, row)"
        >
          拒绝
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
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { Choice } from '../../types/entity'
import { QueryChoice } from '../../types/query'
import { getChoicePage, updateChoice } from '../../api/choice'
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
  console.log(query)
  // if (!query.username || !query.courseName || query.status === undefined) {
  //   ElMessage.info('请输入搜索内容...')
  //   return
  // }
  getChoiceListPage()
}
// 重置搜索
const resetSearch = () => {
  query.username = ''
  query.courseName = ''
  query.status = undefined
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
// 处理表格
const handleOperate = (operate: number, row: Choice) => {
  row.status = operate
  updateChoice(row)
  getChoiceListPage()
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
