import axios from '../utils/request'
import { Course } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const getUserByType = (type: number) => {
  return axios({
    method: 'get',
    url: `${baseApi}/user/get/all/${type}`
  })
}
