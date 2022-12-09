import axios from '../utils/request'
import { Course } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const getCourseAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/course/get/all`
  })
}

export const getCoursePage = (params: any) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/course/get/page`,
    params
  })
}

export const addCourse = (data: Course) => {
  if (data.remark?.length === 0) data.remark = '空'
  return axios({
    method: 'POST',
    url: `${baseApi}/course/insert`,
    data
  })
}
export const updateCourse = (data: Course) => {
  if (data.remark?.length === 0) data.remark = '空'
  return axios({
    method: 'PUT',
    url: `${baseApi}/course/update`,
    data
  })
}

export const delCourse = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/course/delete/${id}`
  })
}

export const delBatchCourse = (data: number[]) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/course/delete/batch`,
    data
  })
}
