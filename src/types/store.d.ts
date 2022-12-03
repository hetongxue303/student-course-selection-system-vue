export type AppStore = {
  collapse: boolean
}

export type PermissionStore = {
  isAdmin: boolean
  menus: Array<any>
  routers: Array<any>
}

export type UserStore = {
  authorization: string
  username: string
  avatar: string
  roles: string[]
  permissions: string[]
}

export type TabStore = {
  tabs: Array<any>
  activeName: string
  currentTabName: string
  isContextMenu?: boolean
}