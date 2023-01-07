import { Menu } from './entity'
import { RouteRecordRaw } from 'vue-router'

export type AppStore = {
  collapse: boolean
}

export type PermissionStore = {
  menus: Menu[]
  menu: any[]
  loadMenu: boolean
  routers: RouteRecordRaw[]
  loadRouter: boolean
  permissions: string[]
}

export type UserStore = {
  authorization: string
  username: string
  avatar: string
  roles: string[]
  isAdmin: boolean
}

export type TabStore = {
  tabs: Array<any>
  activeName: string
  currentTabName: string
  isContextMenu?: boolean
}
