import { useCookies } from '@vueuse/integrations/useCookies'
import { Settings } from '../../Settings'
import { session } from './storage'

const cookies = useCookies()
/**
 * 获取token
 */
export const getToken = (): string => {
  return cookies.get(Settings.AUTHORIZATION_KEY)
}
/**
 * 清除token
 */
export const removeToken = () => {
  cookies.remove(Settings.AUTHORIZATION_KEY)
}
/**
 * 设置token
 * @param token
 */
export const setToken = (token: string) => {
  cookies.set(Settings.AUTHORIZATION_KEY, token)
}

/**
 * 设置token过期时间
 * @param time
 */
export const setTokenTime = (time: number) => {
  session.set(Settings.EXPIRE_TIME_KEY, time)
}

/**
 * 获取token过期时间
 */
export const getTokenTime = (): number => {
  return session.get(Settings.EXPIRE_TIME_KEY)
}

/**
 * 清除token过期时间
 */
export const removeTokenTime = () => {
  session.remove(Settings.EXPIRE_TIME_KEY)
}
