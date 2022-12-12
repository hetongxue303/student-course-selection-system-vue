import axios from '../utils/request'
import { Menu } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const getMenuTableTree = (params: Menu) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/menu/tree`,
    params
  })
}

export const addMenu = (data: Menu) => {
  if (data.remark?.length === 0) data.remark = '空'
  return axios({
    method: 'POST',
    url: `${baseApi}/menu/insert`,
    data
  })
}
export const updateMenu = (data: Menu) => {
  if (data.remark?.length === 0) data.remark = '空'
  return axios({
    method: 'PUT',
    url: `${baseApi}/menu/update`,
    data
  })
}

export const delMenu = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/menu/delete/${id}`
  })
}

export const delBatchMenu = (data: number[]) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/menu/delete/batch`,
    data
  })
}
