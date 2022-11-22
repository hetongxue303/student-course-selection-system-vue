import { defineStore } from 'pinia'
import { UserStore } from '../../types/StoreTypes'
import { getToken, removeToken, removeTokenTime } from '../../utils/auth'
import { local, session } from '../../utils/storage'
import { getUserInfo } from '../../api/auth'
import { ElMessage } from 'element-plus'

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
    getAvatar: (state) => state.avatar
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
    getUser() {
      return new Promise((resolve, reject) => {
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
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    generateRoutes() {
      return new Promise((resolve, reject) => {})
    }
  },
  persist: { key: 'USER' }
})
