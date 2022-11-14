import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: (): any => {
    return {}
  },
  getters: {},
  actions: {},
  persist: { key: 'USER' }
})
