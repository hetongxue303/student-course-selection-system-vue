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
  actions: {},
  persist: { key: 'PERMISSION' }
})
