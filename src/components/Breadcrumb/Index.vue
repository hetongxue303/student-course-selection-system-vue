<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbData" :key="index">
        <a
          v-if="item.path === '/dashboard'"
          class="jup"
          @click.prevent="router.replace('/')"
        >
          {{ item.meta.title }}
        </a>
        <span v-else class="no-redirect">{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import {
  RouteLocationMatched,
  RouteRecord,
  useRoute,
  useRouter
} from 'vue-router'
import { onMounted, Ref, ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()

// 面包屑数据
const breadcrumbData: Ref<RouteLocationMatched[]> = ref([])

// 获取数据
const getBreadcrumbs = () => {
  // 获取所有含有meta和title的数据
  let matched: RouteRecord[] = route.matched.filter(
    (item) => item.meta && item.meta.title
  )
  // 判断第一个是否为首页  如果不是首页就构造一个首页
  const first: RouteRecord = matched[0]
  if (first.path !== '/dashboard') {
    matched = [
      { path: '/dashboard', meta: { title: '首页' } } as RouteRecord
    ].concat(matched)
  }
  breadcrumbData.value = matched
}

watch(
  () => route.path,
  () => getBreadcrumbs(),
  { immediate: true }
)

onMounted(() => getBreadcrumbs())
</script>

<style scoped lang="scss">
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}

.jup {
  cursor: pointer;

  &:hover {
    color: #409eff;
  }
}
</style>
