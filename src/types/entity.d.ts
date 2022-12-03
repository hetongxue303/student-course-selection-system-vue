/**
 * 公共属性
 */
interface common {
  createTime: string
  updateTime: string
}

/**
 * 菜单属性
 */
export interface menu extends common {
  menuId: number
  menuName: string
  menuTitle: string
  menuType: number
  parentId: number
  path: string
  component: string
  sort: number
  icon: string
  perKey: string
  display: boolean
  frame: boolean
  cache: boolean
  delete: boolean
  remark: string
}

/**
 * 账户属性
 */
export interface Account extends common {
  accountId: number
  username: string
  password: string
  status: boolean
  delete: boolean
  lastLoginIp: string
  lastLoginTime: string
}

/**
 * 角色属性
 */
export interface Role extends common {
  roleId: number
  status: boolean
  delete: boolean
}

/**
 * 学院属性
 */
export interface College extends common {
  collegeId: number
  collegeName: string
  remark: string
  delete: boolean
}

/**
 * 专业属性
 */
export interface Major extends common {
  majorId: number
  majorName: string
  remark: string
  delete: boolean
}
