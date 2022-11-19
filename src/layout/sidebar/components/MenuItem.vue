<template>
  <template v-for="(item, index) in data" :key="index">
    <!--有子组件时-->
    <el-sub-menu
      v-if="item.children && item.children.length > 0"
      :index="item.path"
    >
      <template #title>
        <svg-icon :name="item.icon" />
        <span>{{ item.name }}</span>
      </template>
      <MenuItem :data="item.children" />
    </el-sub-menu>
    <!--无子组件时-->
    <el-menu-item v-else :index="item.path">
      <svg-icon :name="item.icon" />
      <template #title>{{ item.name }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

defineProps({
  data: { type: Array as PropType<any[]>, required: true }
})
</script>

<style scoped lang="scss">
:deep(.el-menu-item) {
  background-color: #1f2d3d;
  border-right: 0;
  &:hover {
    background-color: #001528;
  }
}
:deep(.el-sub-menu__title:hover) {
  background-color: #263445 !important;
}
</style>
