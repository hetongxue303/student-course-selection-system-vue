import { defineStore } from 'pinia'

export const userAppStore = defineStore('app', {
  state: (): any => {
    return {}
  },
  getters: {},
  actions: {},
  persist: { key: 'APP' }
})
