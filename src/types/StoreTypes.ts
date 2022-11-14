export type AppStore = {
  collapse: boolean
}

export type PermissionStore = {
  menus: Array<any[]>
  routers: Array<any[]>
}

export type UserStore = {
  Authorization: string
  username: string
  avatar: string
  roles: string
  permissions: string[]
}
