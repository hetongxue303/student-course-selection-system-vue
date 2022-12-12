import { College, Course, Major, MenuTable, MenuTree, User } from './entity'

interface Query {
  currentPage?: number
  pageSize?: number
}

export interface QueryCollege extends College, Query {}

export interface QueryMajor extends Major, Query {}

export interface QueryCourse extends Course, Query {}
export interface QueryUser extends User, Query {}
export interface QueryMenuTree extends MenuTree, Query {}
