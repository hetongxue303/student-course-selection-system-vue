import axios from '../utils/request'

const baseApi = import.meta.env.VITE_BASIC_API

export const getIndexInfo = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/index/info`
  })
}
