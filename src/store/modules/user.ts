import { defineStore } from 'pinia'
import { UserStore } from '../../types/store'
import { getToken, removeToken, removeTokenTime } from '../../utils/auth'
import { local, session } from '../../utils/storage'
import { usePermissionStore } from './permission'
import { filterMenu } from '../../filter/permission'
import { useTabStore } from './tabs'
import { useAppStore } from './app'

export const useUserStore = defineStore('user', {
  state: (): UserStore => {
    return {
      authorization: getToken() || '',
      avatar: '',
      username: '',
      roles: [],
      isAdmin: false
    }
  },
  getters: {
    getAuthorization: (state) => state.authorization,
    getRoles: (state) => state.roles,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar,
    getIsAdmin: (state) => state.isAdmin
  },
  actions: {
    setUserInfo(data: any) {
      this.authorization = data.data.token
      const {
        roles,
        menu,
        username,
        avatar,
        isAdmin,
        menus,
        routers,
        permissions
      } = data.data.user
      if (roles && roles.length > 0) {
        this.roles = roles
        this.username = username
        this.avatar = avatar
        this.isAdmin = isAdmin
      } else {
        this.roles = []
      }
      const permissionStore = usePermissionStore()
      if (!permissionStore.getLoadMenu) {
        permissionStore.menu.push(...filterMenu(menu, 0))
        permissionStore.loadMenu = true
      }
      permissionStore.menus = menus
      permissionStore.routers = routers
      permissionStore.permissions = permissions
    },
    systemLogout() {
      removeToken()
      removeTokenTime()
      usePermissionStore().$reset()
      useTabStore().$reset()
      useAppStore().$reset()
      session.clear()
      local.clear()
      this.$reset()
    },
    fedLogOut() {
      removeToken()
      removeTokenTime()
      this.$reset()
    }
  },
  persist: { key: 'USER' }
})
