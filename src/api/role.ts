import axios from '../utils/request'
import { Role } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const getRoleAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/role/get/all`
  })
}

export const getRolePage = (params: any) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/role/get/page`,
    params
  })
}

export const addRole = (data: Role) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/role/insert`,
    data
  })
}
export const updateRole = (data: Role) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/role/update`,
    data
  })
}

export const delRole = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/role/delete/${id}`
  })
}

export const delBatchRole = (data: number[]) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/role/delete/batch`,
    data
  })
}
