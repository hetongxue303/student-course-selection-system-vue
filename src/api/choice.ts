import axios from '../utils/request'
import { Choice } from '../types/entity'
import { cloneDeep } from 'lodash'

const baseApi = import.meta.env.VITE_BASIC_API

export const getChoiceAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/choice/get/all`
  })
}

export const getChoicePage = (data: Choice) => {
  const params = cloneDeep(data)
  if (params.status === undefined) {
    params.status = 0
  }
  return axios({
    method: 'GET',
    url: `${baseApi}/choice/get/page`,
    params
  })
}

export const addChoice = (data: Choice) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/choice/insert`,
    data
  })
}
export const updateChoice = (data: Choice) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/choice/update`,
    data
  })
}

export const delChoice = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/choice/delete/${id}`
  })
}

export const delBatchChoice = (data: number[]) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/choice/delete/batch`,
    data
  })
}

export const studentChoiceCourse = (type: number, courseId: number) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/choice/course`,
    params: { type, courseId }
  })
}
