import { defineStore } from 'pinia'
import { UserStore } from '../../types/store'
import { getToken, removeToken, removeTokenTime } from '../../utils/auth'
import { local, session } from '../../utils/storage'
import { getUserInfo } from '../../api/login'
import { usePermissionStore } from './permission'
import { filterAsyncRouter } from '../../router'

export const useUserStore = defineStore('user', {
  state: (): UserStore => {
    return {
      authorization: getToken() || '',
      avatar: '',
      username: '',
      roles: [],
      permissions: []
    }
  },
  getters: {
    getAuthorization: (state) => state.authorization,
    getRoles: (state) => state.roles,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar,
    getPermissions: (state) => state.permissions
  },
  actions: {
    systemLogout() {
      this.$reset()
      removeToken()
      removeTokenTime()
      session.clear()
      local.clear()
    },
    fedLogOut() {
      this.authorization = ''
      removeToken()
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {
        const permissionStore = usePermissionStore()
        getUserInfo()
          .then((res) => {
            const { data } = res.data
            if (data.roles && data.roles.length > 0) {
              this.roles = data.roles
              this.permissions = data.permissions
            } else {
              this.roles = []
            }
            this.username = data.username
            this.avatar = data.avatar
            permissionStore.menus = data.menus
            permissionStore.routers = filterAsyncRouter(data.routers)
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  },
  persist: { key: 'USER' }
})
