import { College } from './entity'

interface Query {
  currentPage?: number
  pageSize?: number
}

export interface QueryCollege extends College, Query {
  name?: string
}
