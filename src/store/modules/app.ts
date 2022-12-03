import { defineStore } from 'pinia'
import { AppStore } from '../../types/store'

export const useAppStore = defineStore('app', {
  state: (): AppStore => {
    return {
      collapse: false
    }
  },
  getters: {
    getCollapse: (state) => state.collapse
  },
  actions: {
    setCollapse(status: boolean) {
      this.collapse = status
    }
  },
  persist: { key: 'APP' }
})
