import { College } from './entity'

interface Query {
  page?: number
  size?: number
}

export interface QueryCollege extends College, Query {
  name?: string
}
