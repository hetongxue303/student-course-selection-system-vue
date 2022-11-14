import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
  state: (): any => {
    return {}
  },
  getters: {},
  actions: {},
  persist: { key: 'PERMISSION' }
})
