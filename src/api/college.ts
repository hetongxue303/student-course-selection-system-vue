import axios from '../utils/request'
import { College } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const getCollegeAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/college/get/all`
  })
}

export const getCollegePage = (params: any) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/college/get/page`,
    params
  })
}

export const addCollege = (data: College) => {
  if (data.remark?.length === 0) data.remark = '空'
  return axios({
    method: 'POST',
    url: `${baseApi}/college/insert`,
    data
  })
}
export const updateCollege = (data: College) => {
  if (data.remark?.length === 0) data.remark = '空'
  return axios({
    method: 'PUT',
    url: `${baseApi}/college/update`,
    data
  })
}

export const delCollege = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/college/delete/${id}`
  })
}
