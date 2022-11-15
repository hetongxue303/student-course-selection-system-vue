import { useCookies } from '@vueuse/integrations/useCookies'
import { settings } from '../settings'
import { session } from './storage'

const cookies = useCookies()
/**
 * 获取token
 */
export const getToken = (): string => {
  return cookies.get(settings.AUTHORIZATION_KEY)
}
/**
 * 清除token
 */
export const removeToken = () => {
  cookies.remove(settings.AUTHORIZATION_KEY)
}
/**
 * 设置token
 * @param token
 */
export const setToken = (token: string) => {
  cookies.set(settings.AUTHORIZATION_KEY, token)
}

/**
 * 设置token过期时间
 * @param time
 */
export const setTokenTime = (time: number) => {
  session.set(settings.EXPIRE_TIME_KEY, time)
}

/**
 * 获取token过期时间
 */
export const getTokenTime = (): number => {
  return session.get(settings.EXPIRE_TIME_KEY)
}

/**
 * 清除token过期时间
 */
export const removeTokenTime = () => {
  session.remove(settings.EXPIRE_TIME_KEY)
}
