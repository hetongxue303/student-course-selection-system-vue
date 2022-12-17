import { defineStore } from 'pinia'
import { PermissionStore } from '../../types/store'
import { constMenu } from '../../layout/data/constMenu'
import { Menu } from 'element-plus'
import { RouteRecordRaw } from 'vue-router'
import Layout from '@layout/Index.vue'
import router from '../../router'

// 解决vite不能使用vue2+router动态导入问题
const modules = import.meta.glob('../../views/**/**.vue')

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionStore => {
    return {
      menus: constMenu,
      routers: [],
      loadMenu: false,
      loadRouter: false,
      permissions: []
    }
  },
  getters: {
    getMenus: (state) => state.menus,
    getLoadMenu: (state) => state.loadMenu,
    getRouters: (state) => state.routers,
    getLoadRouter: (state) => state.loadRouter,
    getPermissions: (state) => state.permissions
  },
  actions: {
    setMenus(data: Array<Menu>) {
      if (!this.loadMenu) {
        data.forEach((item: Menu) => this.menus.push(item))
        this.loadMenu = true
      }
    },
    setRouter(data: Array<any>) {
      if (!this.loadRouter) {
        console.log('到这')
        this.routers = filterAsyncRouter(data)
        this.getRouters.forEach((item) => router.addRoute(item))
        this.loadRouter = true
      }
    },
    setPermission(data: string[]) {
      this.permissions = data
    }
  },
  persist: { key: 'PERMISSION' }
})

/**
 * 过滤后台路由
 * @param routers
 */
const filterAsyncRouter = (routers: Array<any>): RouteRecordRaw[] => {
  const router: Array<RouteRecordRaw> = []
  routers.forEach((item) => {
    const route: RouteRecordRaw = {
      name: item.name,
      path: item.path,
      component:
        item.component === 'Layout'
          ? Layout
          : () => modules[`../../view${item.component}/Index.vue`],
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        show: item.meta.show,
        cache: item.meta.cache,
        permission: item.meta.permission
      },
      children: item.children ? filterAsyncRouter(item.children) : []
    }
    if (route.children) {
      router.push(route)
    } else {
      router.push({
        name: 'main',
        path: '/',
        component: Layout,
        meta: { cache: false },
        children: [route]
      })
    }
  })
  return router
}
