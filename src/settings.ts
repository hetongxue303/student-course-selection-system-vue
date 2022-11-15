/**
 * cookie过期时间(单位：毫秒)
 */
export const COOKIE_EXPIRE_TIME = 10 * 60 * 1000 // 10分钟

export enum settings {
  AUTHORIZATION_KEY = 'authorization',
  EXPIRE_TIME_KEY = 'expireTime',
  USER_INFO_KEY = 'userinfo',
  TABS_INFO_KEY = 'tabsInfo'
}
