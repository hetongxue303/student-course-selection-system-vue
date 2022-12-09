import { College, Course, Major } from './entity'

interface Query {
  currentPage?: number
  pageSize?: number
}

export interface QueryCollege extends College, Query {
  name?: string
}

export interface QueryMajor extends Major, Query {
  name?: string
}

export interface QueryCourse extends Course, Query {
  name?: string
}
