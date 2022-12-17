import * as qs from 'qs'
import axios from '../utils/request'

const baseApi = import.meta.env.VITE_BASIC_API
// 获取验证码
export const getCaptcha = () => {
  return axios({
    method: 'get',
    url: `${baseApi}/auth/captchaImage`
  })
}

// 登录处理
export const login = (data: any) => {
  return axios({
    method: 'post',
    url: `${baseApi}/auth/login`,
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 注销处理
export const logout = () => {
  return axios({
    method: 'get',
    url: `${baseApi}/auth/logout`
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return axios({
    method: 'get',
    url: `${baseApi}/user/info`
  })
}

// 刷新token
export const refreshToken = () => {
  return axios({
    method: 'post',
    url: `${baseApi}/user/refreshToken`
  })
}
