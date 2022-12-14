import axios from '../utils/request'

const baseApi = import.meta.env.VITE_BASIC_API

export const studentChoiceCourse = (type: number, courseId: number) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/choice/course`,
    params: { type, courseId }
  })
}
