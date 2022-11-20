import { defineStore } from 'pinia'
import { PermissionStore } from '../../types/StoreTypes'

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionStore => {
    return {
      isAdmin: false,
      menus: [],
      routers: [],
      permissions: ['user:add', 'user:del']
    }
  },
  getters: {
    getIsAdmin: (state) => state.isAdmin,
    getMenus: (state) => state.menus,
    getRouters: (state) => state.routers,
    getPermissions: (state) => state.permissions
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
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },
    setInfo(result: any) {
      const { data } = result
      this.setMenus(data.menus)
      this.setRouters(data.routers)
      this.setPermissions(data.permissions)
      this.setIsAdmin(data.isAdmin)
    }
  },
  persist: { key: 'PERMISSION' }
})
