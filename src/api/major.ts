import axios from '../utils/request'
import { Major } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const getMajorAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/major/get/all`
  })
}

export const getMajorPage = (params: any) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/major/get/page`,
    params
  })
}

export const addMajor = (data: Major) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/major/insert`,
    data
  })
}
export const updateMajor = (data: Major) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/major/update`,
    data
  })
}

export const delMajor = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/major/delete/${id}`
  })
}

export const delBatchMajor = (data: number[]) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/major/delete/batch`,
    data
  })
}
