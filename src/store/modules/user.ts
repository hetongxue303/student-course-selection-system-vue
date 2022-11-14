import { defineStore } from 'pinia'
import { UserStore } from '../../types/StoreTypes'
import { getToken } from '../../utils/auth'

export const useUserStore = defineStore('user', {
  state: (): UserStore => {
    return {
      Authorization: getToken() || '',
      avatar: '',
      permissions: [],
      roles: '',
      username: ''
    }
  },
  getters: {
    getAuthorization: (state) => state.Authorization,
    getRoles: (state) => state.roles,
    getUsername: (state) => state.username,
    getPermissions: (state) => state.permissions,
    getAvatar: (state) => state.avatar
  },
  actions: {
    setAuthorization(Authorization: string) {
      this.Authorization = Authorization
    },
    setRoles(roles: string) {
      this.roles = roles
    },
    setUsername(username: string) {
      this.username = username
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },
    setAvatar(avatar: string) {
      this.avatar = avatar
    }
  },
  persist: { key: 'USER' }
})
