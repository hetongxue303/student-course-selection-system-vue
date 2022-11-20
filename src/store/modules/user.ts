import { defineStore } from 'pinia'
import { UserStore } from '../../types/StoreTypes'
import { getToken, removeToken, removeTokenTime } from '../../utils/auth'
import { local, session } from '../../utils/storage'
import { settings } from '../../settings'

export const useUserStore = defineStore('user', {
  state: (): UserStore => {
    return {
      Authorization: getToken() || '',
      avatar: '',
      username: '',
      roles: []
    }
  },
  getters: {
    getAuthorization: (state) => state.Authorization,
    getRoles: (state) => state.roles,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar
  },
  actions: {
    setAuthorization(Authorization: string) {
      this.Authorization = Authorization
    },
    setRole(roles: string[]) {
      this.roles = roles
    },
    setUsername(username: string) {
      this.username = username
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    },
    systemLogout() {
      this.$reset()
      removeToken()
      removeTokenTime()
      session.clear()
      local.clear()
    },
    setInfo(result: any) {
      const { data } = result
      this.setUsername(data.username)
      this.setAvatar(data.avatar)
      this.setRole(data.role)
    }
  },
  persist: { key: 'USER' }
})
