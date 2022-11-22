export type AppStore = {
  collapse: boolean
}

export type PermissionStore = {
  isAdmin: boolean
  menus: any[]
  routers: any[]
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
