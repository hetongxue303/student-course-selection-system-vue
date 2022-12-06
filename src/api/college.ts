import axios from '../utils/request'
import { College } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const getCollegeAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/college/getCollegeAll`
  })
}

export const getCollegePage = (params: any) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/college/getCollegePage`,
    params
  })
}

export const addCollege = (data: College) => {
  if (data.remark?.length === 0) data.remark = '空'
  return axios({
    method: 'POST',
    url: `${baseApi}/college/add`,
    data
  })
}

export const delCollege = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/college/del/${id}`
  })
}
