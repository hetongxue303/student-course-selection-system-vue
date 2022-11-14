<template>
  <template v-for="(item, index) in data" :key="index">
    <!--有子组件时-->
    <el-sub-menu
      v-if="item.children && item.children.length > 0"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.name }}</span>
      </template>
      <MenuItem :data="item.children" />
    </el-sub-menu>
    <!--无子组件时-->
    <el-menu-item v-else :index="item.path">
      <el-icon>
        <component :is="item.icon" />
      </el-icon>
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

<style scoped lang="scss"></style>
