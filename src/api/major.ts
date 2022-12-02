import axios from '../utils/request'

const baseApi = import.meta.env.VITE_BASIC_API
export const getMajorAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/major/getMajorAll`
  })
}
