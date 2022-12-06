import { College } from './entity'

interface Query {
  page?: number
  size?: number
}

export interface QueryCollege extends College, Query {
  name?: string
}

export interface Page {
  currentPage: number
  pageSize: number
  total: number
  pageSizes?: number[]
  small?: boolean
  disabled?: boolean
  background?: boolean
  layout?: string
}
