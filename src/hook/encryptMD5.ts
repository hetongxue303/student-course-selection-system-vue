import md5 from 'js-md5'

/**
 * 密码加密后在发送请求
 * @param password 密码
 */
export const encryptMD5 = (password: string): string => {
  return md5(md5(password).split('').reverse().join(''))
}
