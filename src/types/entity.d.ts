import { constants } from 'fs'
import S_IRWXG = module

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
export interface Menu {
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
  isSub?: boolean | string
  isDisplay?: boolean | string
  isFrame?: boolean | string
  isCache?: boolean | string
  remark?: string
  createTime?: Date
  updateTime?: Date
  isDelete?: boolean
}

export interface MenuTree extends Menu {
  hasChildren?: boolean
  children?: MenuTree[]
}

/**
 * 用户属性
 */
export interface User {
  userId?: number
  username?: string
  password?: string
  nickName?: string
  realName?: string
  avatar?: string
  gender?: number | string
  email?: string
  phone?: string
  type?: number
  isEnable?: boolean
  isAdmin?: boolean
  remark?: string
  lastLoginIp?: string
  lastLoginTime?: string
  createTime?: Date
  updateTime?: Date
  isDelete?: boolean
}

/**
 * 角色属性
 */
export interface Role {
  roleId?: number
  roleName?: string
  roleKey?: string
  level?: number
  dataScope?: string
  description?: string
  isEnable?: boolean
  menus?: Menu[]
  createTime?: Date
  updateTime?: Date
  isDelete?: boolean
}

/**
 * 学院属性
 */
export interface College {
  collegeId?: number
  collegeName?: string
  remark?: string
  createTime?: Date
  updateTime?: Date
  isDelete?: boolean
}

/**
 * 专业属性
 */
export interface Major {
  majorId?: number
  majorName?: string
  remark?: string
  createTime?: Date
  updateTime?: Date
  isDelete?: boolean
}

/**
 * 课程属性
 */
export interface Course {
  courseId?: number
  userId?: number
  courseName?: string
  count?: number
  choice?: number
  remark?: string
  createTime?: Date
  updateTime?: Date
  isDelete?: boolean
  isChoice?: boolean
  isConfirm?: boolean
  teacherName?: string
}

export interface Choice {
  choiceId?: number
  userId?: number
  user?: User
  courseId?: number
  course?: Course
  score?: number
  isQuit?: boolean
  isEnd?: boolean
  status?: number
  createTime?: Date
  updateTime?: Date
  isDelete?: boolean
  realName?: string
  courseName?: string
  teacherName?: string
}

export interface ILogin {
  username: string
  password: string
  code: string
  rememberMe: boolean
}

export interface IndexVo {
  studentCount?: number
  teacherCount?: number
  majorCount?: number
  courseCount?: number
}

export interface Grade {
  gradeId?: number
  gradeName?: string
  collegeId?: number
  college?: College
  majorId?: number
  major?: Major
  gradeCount?: number
  isDelete?: boolean
  createTime?: Date
  updateTime?: Date
}
