import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import { getToken, getTokenTime, setToken, setTokenTime } from './auth'
import { refreshToken } from '../api/auth'

axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10 * 1000,
  withCredentials: true,
  timeoutErrorMessage: 'timeout',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (getToken() && config.headers) {
      // 判断token是否快要过期
      const currentTime = new Date().getTime()
      const expireTime = getTokenTime()
      if (expireTime) {
        const min = (expireTime - currentTime) / 1000 / 60
        if (min < 10) {
          refreshToken()
            .then((res) => {
              if (res.status === 200 || res.data.code === 200) {
                setToken(res.data.data.token)
                setTokenTime(new Date().getTime() + res.data.data.expireTime)
              }
            })
            .catch((error) => {
              ElMessage.error({ message: error.message, duration: 5 * 1000 })
            })
        }
      }
      // 每个请求头都带上token
      config.headers.authorization = getToken()
    }
    return config
  },
  (error: any) => {
    ElNotification.error('请求错误！')
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: any) => {
    ElNotification.error('响应错误！')
    return Promise.reject(error)
  }
)

export default axios
