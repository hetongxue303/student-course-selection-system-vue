<template>
  <Logo :collapse="isCollapse" />
  <el-scrollbar class="scrollbar" wrap-class="scrollbar-wrapper">
    <el-menu
      router
      :unique-opened="false"
      :collapse-transition="true"
      :default-active="activeValue"
      :collapse="isCollapse"
      mode="vertical"
      text-color="#f4f4f5"
      active-text-color="#409eff"
      background-color="#304156"
    >
      <menu-item :data="menus" />
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import Logo from './components/Logo.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MenuItem from './components/MenuItem.vue'
import { constMenu } from '../data/constMenu'
import { usePermissionStore } from '../../store/modules/permission'

const route = useRoute()
const permissionStore = usePermissionStore()

const menus: Array<any> = constMenu
permissionStore.getMenus.forEach((menu) => menus.push(menu))

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
  //height: calc(100% - 50px);
  border-right: 0 !important;

  &:not(.el-menu--collapse) {
    width: 200px;
  }
}
.el-scrollbar {
  height: calc(100% - 50px);
  background-color: #304156;
}
.scrollbar-wrapper {
  overflow-x: hidden !important;
}
.horizontal-collapse-transition {
  transition: 0.25s width ease-in-out, 0.25s padding-left ease-in-out,
    0.25s padding-right ease-in-out;
}
</style>
