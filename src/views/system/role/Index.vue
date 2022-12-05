<script setup lang="ts">
import { onMounted } from 'vue'
import { getRoleAll } from '../../../api/role'
import { Role } from '../../../types/entity'

interface menuTree {
  label: string
  children?: menuTree[]
}

let tableData: Role[] = []

const getRoleListAll = async () => {
  const { data } = await getRoleAll()
  tableData = data.data
  console.log(tableData)
}

const handleEdit = (index: number, row: any) => {
  console.log(index, row)
}

const handleDelete = (index: number, row: any) => {
  console.log(index, row)
}

const handleNodeClick = (data: menuTree) => {
  console.log(data)
}

const data: menuTree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1'
          }
        ]
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1'
          }
        ]
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1'
          }
        ]
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}

onMounted(() => {
  getRoleListAll()
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
        <el-icon> <component is="Search" /> </el-icon>
        <span>搜索</span>
      </el-button>
      <el-button type="warning">
        <el-icon> <component is="RefreshLeft" /> </el-icon>
        <span>重置</span>
      </el-button>
    </el-row>
    <div class="operate-box">
      <el-button type="primary">
        <el-icon> <component is="Plus" /> </el-icon>
        <span>新增</span>
      </el-button>
      <el-button type="success" disabled>
        <el-icon> <component is="EditPen" /> </el-icon>
        <span>修改</span>
      </el-button>
      <el-button type="danger" disabled>
        <el-icon> <component is="Delete" /> </el-icon>
        <span>删除</span>
      </el-button>
      <el-button type="warning" disabled>
        <el-icon> <component is="Bottom" /> </el-icon>
        <span>导出</span>
      </el-button>
    </div>
  </div>

  <!--主体-->
  <el-row :gutter="10">
    <el-col :span="18">
      <el-card>
        <template #header>
          <div class="header-box">
            <span>角色列表</span>
          </div>
        </template>
        <!--表格-->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="selection" width="30" />
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="roleKey" label="角色代码" />
          <el-table-column prop="status" label="状态" />
          <el-table-column prop="createTime" align="center" label="创建时间" />
          <el-table-column label="操作" align="center" width="200">
            <template #default="scope">
              <el-button
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                ><el-icon> <component is="EditPen" /> </el-icon
              ></el-button>
              <el-button
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >
                <el-icon> <component is="Delete" /> </el-icon
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="header-box">
            <span>菜单分配</span>
            <el-button type="primary" size="small">
              <el-icon>
                <component is="Check" />
              </el-icon>
              <span>保存</span>
            </el-button>
          </div>
        </template>
        <!--菜单树-->
        <el-tree
          :data="data"
          :props="defaultProps"
          show-checkbox
          @node-click="handleNodeClick"
        />
      </el-card>
    </el-col>
  </el-row>
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
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span:first-child {
    font-weight: bold;
  }
}
</style>
