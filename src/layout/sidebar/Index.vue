<template>
  <el-menu
    router
    unique-opened
    collapse-transition
    :default-active="activeValue"
    :collapse="isCollapse"
    mode="vertical"
    text-color="#fff"
    active-text-color="#ffd04b"
    background-color="#545c64"
  >
    <Logo :collapse="isCollapse" />
    <menu-item :data="menuList" />
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import MenuItem from './components/MenuItem.vue'
import Logo from './components/Logo.vue'
import { usePermissionStore } from '../../store/modules/permission'
import { menus } from '../data/menus'
const route = useRoute()
const permissionStore = usePermissionStore()

const menuList: Array<any> = menus
// const menus: Array<any> = [
//   {
//     name: '首页',
//     icon: 'document',
//     path: '/dashboard'
//   }
// ]

// permissionStore.getMenus.forEach((menu) => menus.push(menu))

defineProps({
  isCollapse: { type: Boolean, required: true, default: false }
})

const activeValue = computed((): string => {
  return route.path
})
</script>

<style scoped lang="scss">
.el-menu {
  width: 64px;
  height: 100vh;

  &:not(.el-menu--collapse) {
    width: 200px;
  }
}
</style>
