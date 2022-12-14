import {
  College,
  Course,
  Major,
  MenuTable,
  MenuTree,
  Role,
  User
} from './entity'

interface Query {
  currentPage?: number
  pageSize?: number
}

export interface QueryVO {
  page?: number
  size?: number
  total: number
  pages?: number
  records?: object
}
export interface QueryCollege extends College, Query {}

export interface QueryMajor extends Major, Query {}

export interface QueryCourse extends Course, Query {}
export interface QueryUser extends User, Query {}
export interface QueryMenuTree extends MenuTree, Query {}
export interface QueryRole extends Role, Query {}
