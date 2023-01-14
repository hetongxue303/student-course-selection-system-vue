<template>
  <div class="logo">
    <el-image src="" alt="" />
  </div>
  <div class="dashboard">
    <div
      class="card"
      style="
        background-image: linear-gradient(to right, #004c8f 0%, #1ec2c2 100%);
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
        background-image: linear-gradient(120deg, #00ef5c 0%, #2dcbd0 100%);
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
        background-image: linear-gradient(120deg, #461b93 0%, #ac82d3 100%);
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
        background-image: linear-gradient(120deg, #a900bd 0%, #c5649b 100%);
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
  <div class="ref-box">
    <div ref="choiceRef" style="height: 400px; width: 50%; margin-top: 30px" />
    <div ref="courseRef" style="height: 400px; width: 50%; margin-top: 30px" />
  </div>
</template>

<script setup lang="ts">
import { getIndexInfo } from '../../api'
import { onMounted, ref } from 'vue'
import { IndexVo } from '../../types/entity'
import { cloneDeep } from 'lodash'
import moment from 'moment'
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

const choiceRef = ref<HTMLElement>()
const courseRef = ref<HTMLElement>()
const initEchartsData = () => {
  echarts.init(choiceRef.value!).setOption({
    title: {
      text: '近期选课',
      left: 'center'
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      data: [
        moment(new Date()).format('YYYY-MM-DD'),
        moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD'),
        moment(new Date()).subtract(2, 'day').format('YYYY-MM-DD'),
        moment(new Date()).subtract(3, 'day').format('YYYY-MM-DD'),
        moment(new Date()).subtract(4, 'day').format('YYYY-MM-DD'),
        moment(new Date()).subtract(5, 'day').format('YYYY-MM-DD'),
        moment(new Date()).subtract(6, 'day').format('YYYY-MM-DD')
      ]
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 50,
      interval: 10,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    series: {
      name: '人数',
      type: 'bar',
      data: [15, 20, 5, 0, 17, 33, 22],
      barWidth: '50%',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    },
    tooltip: {
      trigger: 'axis',
      showDelay: 0,
      axisPointer: {
        type: 'shadow'
      }
    }
  })
  echarts.init(courseRef.value!).setOption({
    title: {
      text: '课程人数',
      left: 'center'
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      data: ['JAVA实战', '物联网工程', '单片机及其应用', '高等数学', '大学英语']
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 10,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    series: {
      name: '人数',
      type: 'bar',
      data: [15, 45, 15, 8, 57],
      barWidth: '50%',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    },
    tooltip: {
      trigger: 'axis',
      showDelay: 0,
      axisPointer: {
        type: 'shadow'
      }
    }
  })
}
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: 250px;
  background: linear-gradient(
    123deg,
    #461b93 0%,
    #461b93 40%,
    #6a3cbc calc(40% + 1px),
    #6a3cbc 60%,
    #8253d7 calc(60% + 1px),
    #8253d7 70%,
    #f78f1e calc(70% + 1px),
    #f78f1e 100%
  );
}

.ref-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

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
