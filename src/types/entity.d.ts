/**
 * 公共属性
 */
interface common {
  createTime?: Date
  updateTime?: Date
  isDelete?: boolean
}

/**
 * 菜单属性
 */
export interface Menu extends common {
  menuId?: number
  menuName?: string
  menuTitle?: string
  menuType?: number
  parentId?: number
  path?: string
  component?: string
  sort?: number
  icon?: string
  perKey?: string
  isDisplay?: boolean
  isFrame?: boolean
  isCache?: boolean
  remark?: string
}

export interface MenuTree extends Menu {
  hasChildren?: boolean
  children?: MenuTree[]
}

/**
 * 用户属性
 */
export interface User extends common {
  userId?: number
  username?: string
  password?: string
  nickName?: string
  realName?: string
  avatar?: string
  gender?: number
  email?: string
  phone?: string
  type?: number
  isEnable?: boolean
  isAdmin?: boolean
  remark?: string
  lastLoginIp?: string
  lastLoginTime?: string
}

/**
 * 角色属性
 */
export interface Role extends common {
  roleId?: number
  roleName?: string
  roleKey?: string
  level?: number
  dataScope?: string
  description?: string
  isEnable?: boolean
  menus?: Menu[]
}

/**
 * 学院属性
 */
export interface College extends common {
  collegeId?: number
  collegeName?: string
  remark?: string
}

/**
 * 专业属性
 */
export interface Major extends common {
  majorId?: number
  majorName?: string
  remark?: string
}

/**
 * 课程属性
 */
export interface Course extends common {
  courseId?: number
  userId?: number
  courseName?: string
  count?: number
  choice?: number
  remark?: string
}

export interface Choice extends common {
  choiceId?: number
  userId?: number
  courseId?: number
  score?: number
  isQuit?: boolean
  isEnd?: boolean
  username?: string
  courseName?: string
}
