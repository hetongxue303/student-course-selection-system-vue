<template>
  <div class="dashboard">
    <div
      class="card"
      style="
        background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
      "
    >
      <svg-icon name="student-box" :size="60" unit="px" />
      <div class="card-content">
        <span>
          <span class="card-content-text"> {{ info.studentCount }} </span>
          人
        </span>
        <span>学生人数</span>
      </div>
    </div>
    <div
      class="card"
      style="
        background-image: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);
      "
    >
      <svg-icon name="teacher-box" :size="60" unit="px" />
      <div class="card-content">
        <span>
          <span class="card-content-text"> {{ info.teacherCount }} </span>
          人
        </span>
        <span>教师人数</span>
      </div>
    </div>
    <div
      class="card"
      style="
        background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
      "
    >
      <svg-icon name="major-box" :size="60" unit="px" />
      <div class="card-content">
        <span>
          <span class="card-content-text"> {{ info.majorCount }} </span>
          个
        </span>
        <span>专业数量</span>
      </div>
    </div>
    <div
      class="card"
      style="
        background-image: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
      "
    >
      <svg-icon name="course-box" :size="60" unit="px" />
      <div class="card-content">
        <span>
          <span class="card-content-text"> {{ info.courseCount }} </span>
          门
        </span>
        <span>课程数量</span>
      </div>
    </div>
  </div>
  <div
    ref="refData"
    style="
      height: 300px;
      width: 100%;
      border-radius: 10px;
      border: 1px solid #968e8e;
      margin-top: 20px;
    "
  />
</template>

<script setup lang="ts">
import { getIndexInfo } from '../../api'
import { onMounted, ref } from 'vue'
import { IndexVo } from '../../types/entity'
import { cloneDeep } from 'lodash'
import * as echarts from 'echarts'

const info = ref<IndexVo>({})
const getIndexInfoData = () => {
  getIndexInfo().then(({ data }) => {
    if (data.code === 200) {
      info.value = cloneDeep(data.data)
    }
  })
}
onMounted(() => {
  getIndexInfoData()
  initEchartsData()
})

const refData = ref<HTMLElement>()
const initEchartsData = () => {
  echarts.init(refData.value!).setOption({
    title: {
      text: '选课统计',
      left: 'center'
    }
  })
}
</script>

<style scoped lang="scss">
.dashboard {
  width: 100%;
  height: 80px;
  margin-top: 15px;
  display: flex;
  justify-content: space-around;

  .card {
    height: 80px;
    width: 280px;
    background-color: #13ce66;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding-left: 20px;
    border-radius: 15px;
    transition: all linear 0.2s;

    &:hover {
      transform: scale(1.05, 1.05);
      height: 85px;
      width: 285px;
    }

    &-content {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      color: white;
      font-size: 12px;

      &-text {
        font-size: 30px;
        font-weight: bold;
      }
    }
  }
}
</style>
