<script setup lang="ts">
import { getCollegeAll } from '../../../api/college'
import { onMounted, ref } from 'vue'
import { College } from '../../../types/entity'

const tableData = ref<College[]>([])

const getCollegeListAll = async () => {
  const { data } = await getCollegeAll()
  tableData.value = data.data
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
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input type="text" placeholder="请输入搜索内容..." />
      </el-col>
      <el-button type="success">
        <el-icon>
          <component is="Search" />
        </el-icon>
        <span>搜索</span>
      </el-button>
      <el-button type="warning">
        <el-icon>
          <component is="RefreshLeft" />
        </el-icon>
        <span>重置</span>
      </el-button>
    </el-row>
    <div class="operate-box">
      <el-button type="primary">
        <el-icon>
          <component is="Plus" />
        </el-icon>
        <span>新增</span>
      </el-button>
      <el-button type="success" disabled>
        <el-icon>
          <component is="EditPen" />
        </el-icon>
        <span>修改</span>
      </el-button>
      <el-button type="danger" disabled>
        <el-icon>
          <component is="Delete" />
        </el-icon>
        <span>删除</span>
      </el-button>
      <el-button type="warning" disabled>
        <el-icon>
          <component is="Bottom" />
        </el-icon>
        <span>导出</span>
      </el-button>
    </div>
  </div>

  <!--表格-->
  <el-table :data="tableData">
    <el-table-column type="selection" width="30" />
    <el-table-column prop="collegeId" label="ID" align="center" width="80" />
    <el-table-column prop="collegeName" label="学院名称" width="200" />
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
        <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">
          <el-icon>
            <component is="EditPen" />
          </el-icon>
        </el-button>
        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">
          <el-icon>
            <component is="Delete" />
          </el-icon>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

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
