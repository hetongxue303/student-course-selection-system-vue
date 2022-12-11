import axios from '../utils/request'
import { Menu } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const getMenuToTable = (pid: number) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/menu/table/${pid}`
  })
}
