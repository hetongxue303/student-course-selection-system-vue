/**
 * cookie过期时间(单位：毫秒)
 */
export const COOKIE_EXPIRE_TIME = 10 * 60 * 1000 // 10分钟

export enum Settings {
  AUTHORIZATION_KEY = 'Authorization',
  EXPIRE_TIME_KEY = 'ExpireTime',
  USER_INFO_KEY = 'userinfo'
}
