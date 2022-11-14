import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: (): any => {
    return {}
  },
  getters: {},
  actions: {},
  persist: { key: 'SETTINGS' }
})
