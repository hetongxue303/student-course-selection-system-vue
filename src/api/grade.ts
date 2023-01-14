import axios from '../utils/request'
import { QueryGrade } from '../types/query'
import { Grade } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const getGradeAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/grade/get/all`
  })
}
export const getGradePage = (params: QueryGrade) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/grade/get/page`,
    params
  })
}

export const addGrade = (data: Grade) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/grade/insert`,
    data
  })
}
export const updateGrade = (data: Grade) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/grade/update`,
    data
  })
}

export const delGrade = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/grade/delete/${id}`
  })
}

export const delBatchGrade = (data: number[]) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/grade/delete/batch`,
    data
  })
}
