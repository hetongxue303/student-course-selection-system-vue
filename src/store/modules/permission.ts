import { defineStore } from 'pinia'
import { PermissionStore } from '../../types/StoreTypes'

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionStore => {
    return {
      isAdmin: false,
      menus: [],
      routers: []
    }
  },
  getters: {
    getIsAdmin: (state) => state.isAdmin,
    getMenus: (state) => state.menus,
    getRouters: (state) => state.routers
  },
  actions: {
    setIsAdmin(status: boolean) {
      this.isAdmin = status
    },
    setMenus(menus: any) {
      this.menus = menus
    },
    setRouters(routers: any) {
      this.routers = routers
    },
    setInfo(result: any) {
      const { data } = result
      this.setMenus(data.menus)
      this.setRouters(data.routers)
      this.setIsAdmin(data.isAdmin)
    },
    // 过滤菜单
    filterMenus() {}
  },
  persist: { key: 'PERMISSION' }
})
