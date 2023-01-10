import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import {
  getToken,
  getTokenTime,
  removeToken,
  removeTokenTime,
  setToken,
  setTokenTime
} from './auth'
import { refreshToken } from '../api/login'
import { useUserStore } from '../store/modules/user'
import { useRouter } from 'vue-router'

axios.create({
  baseURL: import.meta.env.VITE_BASIC_HTTP,
  timeout: 10 * 1000,
  withCredentials: true,
  timeoutErrorMessage: 'timeout',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

axios.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    if (getToken() && config.headers) {
      // 判断token是否快要过期
      // const currentTime = new Date().getTime()
      // const expireTime = getTokenTime()
      // console.log(`当前时间：${currentTime}`)
      // console.log(`存储的过期时间：${expireTime}`)
      // console.log(currentTime === expireTime)
      // if (expireTime) {
      //   const min = (expireTime - currentTime) / 1000 / 60
      //   console.log(`剩余分钟：${min}`)
      //   if (min < 29.7) {
      //     console.log('开始刷新token')
      //     await refreshToken()
      //       .then(({ data, status }) => {
      //         if (status === 200 && data.code === 200) {
      //           console.log(`old:${getToken()}`)
      //           setToken(data.data.token)
      //           setTokenTime(new Date().getTime() + data.data.expireTime)
      //           console.log(`new:${data.data.token}`)
      //         }
      //       })
      //       .catch((error) => {
      //         window.location.replace('/login')
      //         ElMessage.error({ message: error.message, duration: 5 * 1000 })
      //       })
      //   }
      // }
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
  async (response: AxiosResponse) => {
    const { data, status } = response
    if (status !== 200 && data.code !== 200) {
      ElMessage({
        message: data.message || 'Error',
        type: 'warning',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(data.message || 'Error'))
    }
    return response
  },
  async (error: any) => {
    const { message, response } = error
    if (response.status === 401 || response.data.code === 401) {
      ElMessageBox.confirm(
        '你已被登出，可以取消继续留在该页面，或者重新登录',
        '提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          useUserStore().systemLogout()
          window.location.replace('/login')
          window.location.reload()
        })
        .catch(() => {})
    }
    if (response.status === 400 || response.data.code === 400) {
      ElNotification({
        message: message || '请求异常',
        type: 'error',
        duration: 5 * 1000
      })
    }
    if (response.status === 500 || response.data.code === 500) {
      ElNotification({
        message: message || '服务器异常',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default axios
