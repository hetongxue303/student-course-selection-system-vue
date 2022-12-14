<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.courseName"
          type="text"
          placeholder="请输入学院名称..."
        />
      </el-col>
      <el-button icon="Search" type="success" @click="getCourseListPage">
        搜索
      </el-button>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
    <div class="operate-box">
      <el-button icon="Plus" type="primary" @click="handleAdd">
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
    <el-table-column prop="courseName" label="名称" width="200" />
    <el-table-column label="已选" width="200">
      <template #default="scope">
        <span>{{ scope.row.choice }}</span>
      </template>
    </el-table-column>
    <el-table-column label="总人数" prop="count" width="200" />
    <el-table-column prop="remark" label="描述" align="center" width="auto" />
    <el-table-column label="创建时间" align="center" width="180">
      <template #default="{ row }">
        <span>
          {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="300">
      <template #default="scope">
        <el-button type="primary" @click="handleChoiceCourse(1, scope.row)">
          <span>选课</span>
        </el-button>
        <el-button type="primary" @click="handleChoiceCourse(2, scope.row)">
          <span>退课</span>
        </el-button>
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

  <!--新增-->
  <el-dialog v-model="dialog.add" title="新增课程" width="40%">
    <el-form :model="addForm">
      <el-form-item label="课程名称">
        <el-input
          v-model="addForm.courseName"
          type="text"
          placeholder="请输入课程名"
        />
      </el-form-item>
      <el-form-item label="课程人数">
        <el-input v-model="addForm.count" type="number" />
      </el-form-item>
      <el-form-item label="任课老师">
        <el-select v-model="addForm.userId" placeholder="请选择">
          <el-option
            v-for="(item, index) in teachers"
            :key="index"
            :label="item.realName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程描述">
        <el-input
          v-model="addForm.remark"
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="请输入课程描述(默认：空)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.add = false">返回</el-button>
        <el-button type="primary" @click="handleAddCollege"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!--编辑-->
  <el-dialog v-model="dialog.edit" title="编辑课程" width="40%">
    <el-form :model="editForm">
      <el-form-item label="课程名称">
        <el-input
          v-model="editForm.courseName"
          type="text"
          placeholder="请输入课程名"
        />
      </el-form-item>
      <el-form-item label="课程人数">
        <el-input v-model="editForm.count" type="number" />
      </el-form-item>
      <el-form-item label="任课老师">
        <el-select v-model="editForm.userId" placeholder="请选择">
          <el-option
            v-for="(item, index) in teachers"
            :key="index"
            :label="item.realName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程描述">
        <el-input
          v-model="editForm.remark"
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="请输入课程描述(默认：空)"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.edit = false">返回</el-button>
        <el-button type="primary" @click="handleEditCollege"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <!--确认删除框-->
  <el-dialog v-model="dialog.delete" title="提示" width="30%">
    <div style="display: flex; align-items: center">
      <svg-icon name="warning" size="1.5" />
      <span>确认删除选中的{{ multipleSelection.length }}条数据?</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.delete = false">返回</el-button>
        <el-button type="primary" @click="handleBatchDelete"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import Pagination from '../../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import {
  addCourse,
  delBatchCourse,
  delCourse,
  getCoursePage,
  updateCourse
} from '../../../api/course'
import { QueryCourse } from '../../../types/query'
import { Course, User } from '../../../types/entity'
import { ElMessage, ElMessageBox, ElNotification, ElTable } from 'element-plus'
import { getUserByType } from '../../../api/user'
import moment from 'moment'
import { studentChoiceCourse } from '../../../api/choice'

/* 初始化相关 */
const tableData = ref<Course[]>([])
const getCourseListPage = async () => {
  const { data } = await getCoursePage(query)
  tableData.value = data.data.records
  total.value = JSON.parse(data.data.total)
}
onMounted(() => getCourseListPage())

/* 分页相关 */
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
  getCourseListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getCourseListPage()
}

/* 查询相关 */
const query: QueryCourse = reactive({
  currentPage: 1,
  pageSize: 10
})
const resetSearch = () => {
  query.courseName = ''
  getCourseListPage()
}

/* 表格相关 */
const disabled = reactive({
  edit: true,
  delete: true,
  export: false
})
const dialog = reactive({
  add: false,
  delete: false,
  edit: false
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Course[]>([])
const handleSelectionChange = (colleges: Course[]) => {
  multipleSelection.value = colleges
}
const handleBatchDelete = async () => {
  const ids: number[] = multipleSelection.value.map((item) => {
    return item.courseId as number
  })
  const { data } = await delBatchCourse(ids)
  switch (data.code) {
    case 200:
      await getCourseListPage()
      dialog.delete = false
      ElNotification.success('删除成功')
      break
    default:
      ElNotification.success('删除失败,请重试！')
  }
}
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
    info.successText = '退课成功'
    info.errorText = '退课失败,请重试！'
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
const handleExport = () => {
  ElMessage.info('待开发...')
}
watch(
  () => multipleSelection.value,
  () => {
    disabled.edit = multipleSelection.value.length !== 1
    disabled.delete = multipleSelection.value.length < 1
  },
  { immediate: true, deep: true }
)

/* 重置表单方法 */
const resetForm = (form: any) => {
  const keys = Object.keys(form)
  const obj: { [name: string]: string } = {}
  keys.forEach((item) => {
    obj[item] = ''
  })
  Object.assign(form, obj)
}

/* 删除相关 */
const handleDelete = async ({ courseId }: Course) => {
  if (courseId) {
    const { data } = await delCourse(courseId)
    switch (data.code) {
      case 200:
        await getCourseListPage()
        ElNotification.success('删除成功')
        break
      default:
        ElNotification.success('删除失败,请重试！')
    }
  }
}

/* 新增相关 */
const addForm: Course = reactive({})
const teachers = ref<User[]>([])
const getTeacherList = async (type: number) => {
  const { data } = await getUserByType(type)
  teachers.value = data.data
}
const handleAdd = () => {
  getTeacherList(2)
  dialog.add = true
}
watch(
  () => dialog.add,
  (value) => {
    if (!value) {
      resetForm(addForm)
    }
  },
  { deep: true }
)
const handleAddCollege = async () => {
  const { data } = await addCourse(addForm)
  switch (data.code) {
    case 200:
      await getCourseListPage()
      dialog.add = false
      ElNotification.success('添加成功')
      break
    default:
      ElNotification.error('添加失败,请重试！')
  }
}

/* 编辑相关 */
const editForm = ref<Course>({})
const handleEdit = (row?: Course) => {
  if (row) {
    editForm.value = JSON.parse(JSON.stringify(row))
  } else {
    editForm.value = JSON.parse(
      JSON.stringify(multipleSelection.value[0] as Course)
    )
  }
  getTeacherList(2)
  dialog.edit = true
}
const handleEditCollege = async () => {
  const { data } = await updateCourse(editForm.value)
  switch (data.code) {
    case 200:
      await getCourseListPage()
      dialog.edit = false
      ElNotification.success('更新成功')
      break
    default:
      ElNotification.error('更新失败,请重试！')
  }
}
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
