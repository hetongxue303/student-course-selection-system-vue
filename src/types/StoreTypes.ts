export type AppStore = {
  collapse: boolean
}

export type PermissionStore = {
  isAdmin: boolean
  menus: any[]
  routers: any[]
  permissions: string[]
}

export type UserStore = {
  Authorization: string
  username: string
  avatar: string
  roles: string[]
}

export type TabStore = {
  tabs: Array<any>
  activeName: string
  currentTabName: string
  isContextMenu?: boolean
}
