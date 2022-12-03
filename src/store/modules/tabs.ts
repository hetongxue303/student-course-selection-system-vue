import { defineStore } from 'pinia'
import { TabStore } from '../../types/store'

export const useTabStore = defineStore('tab', {
  state: (): TabStore => {
    return {
      tabs: [{ title: '首页', path: '/dashboard' }],
      activeName: '',
      currentTabName: '',
      isContextMenu: false
    }
  },
  getters: {
    getTabs: (state) => state.tabs,
    getActiveName: (state) => state.activeName,
    getCurrentTabName: (state) => state.currentTabName,
    getIsContextMenu: (state) => state.isContextMenu
  },
  actions: {
    setActiveName(value: string) {
      this.activeName = value
    },
    setCurrentTabName(value: string) {
      this.currentTabName = value
    },
    setIsContextMenu(value: boolean) {
      this.isContextMenu = value
    },
    setTabs(tabs: any) {
      this.tabs = tabs
    },
    addTab(tab: any) {
      if (this.tabs.some((item) => item.path === tab.path)) return
      this.tabs.push(tab)
    }
  },
  persist: { key: 'TAB' }
})
