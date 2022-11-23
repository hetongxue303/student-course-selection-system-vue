import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElNotification } from 'element-plus'
import { getToken } from './auth'

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
  async (config: AxiosRequestConfig) => {
    if (getToken() && config.headers) {
      // 判断token是否快要过期
      // const currentTime = new Date().getTime()
      // const expireTime = getTokenTime()
      // console.log(`当前时间：${currentTime}`)
      // console.log(`存储的过期时间：${expireTime}`)
      // if (expireTime) {
      //   const min = (expireTime - currentTime) / 1000 / 60
      //   console.log(`剩余分钟：${min}`)
      //   if (min < 29.7) {
      //     console.log('开始刷新token')
      //     await refreshToken()
      //       .then((res) => {
      //         if (res.status === 200 || res.data.code === 200) {
      //           console.log(`old:${getToken()}`)
      //           setToken(res.data.data.token)
      //           setTokenTime(new Date().getTime() + res.data.data.expireTime)
      //           console.log(`new:${res.data.data.token}`)
      //         }
      //       })
      //       .catch((error) => {
      //         window.location.replace('/login')
      //         ElMessage.error({ message: error.message, duration: 5 * 1000 })
      //       })
      //   }
      // }
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
    // const { code } = response.data
    // const { status } = response
    // if (status === 200 && code === 200) return response
    // if (status === 401 || code === 401)
    //   return Promise.reject(new Error(response.data.message || 'Error'))
    // const userStore = useUserStore()
    // if (status === 401 || code === 401) {
    //   ElMessageBox.confirm(
    //     '你已被登出，可以取消继续留在该页面，或者重新登录',
    //     '确定登出',
    //     {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //   ).then(() => {
    //     userStore.systemLogout()
    //     window.location.reload()
    //   })
    // }
    // return Promise.reject(new Error(response.data.message || 'Error'))
    return response
  },
  (error: any) => {
    ElNotification.error(error.message || '响应错误！')
    return Promise.reject(error)
  }
)

export default axios
