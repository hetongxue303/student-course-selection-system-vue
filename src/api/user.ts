import axios from '../utils/request'
import { User } from '../types/entity'
import { encryptMD5 } from '../hook/encryptMD5'

const baseApi = import.meta.env.VITE_BASIC_API

export const getUserByType = (type: number) => {
  return axios({
    method: 'get',
    url: `${baseApi}/user/get/all/${type}`
  })
}

export const getUserPage = (params: any) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/user/get/page`,
    params
  })
}

export const addUser = (data: User) => {
  if (data.remark?.length === 0) data.remark = '空'
  data.password = encryptMD5('123456') // 设置默认密码
  console.log(data)
  return axios({
    method: 'POST',
    url: `${baseApi}/user/insert`,
    data
  })
}
export const updateUser = (data: User) => {
  if (data.remark?.length === 0) data.remark = '空'
  return axios({
    method: 'PUT',
    url: `${baseApi}/user/update`,
    data
  })
}

export const delUser = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/user/delete/${id}`
  })
}

export const delBatchUser = (data: number[]) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/user/delete/batch`,
    data
  })
}

export const getUserCenter = (username: string) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/user/center`,
    params: { username }
  })
}
