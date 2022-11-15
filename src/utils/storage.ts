/**
 * localStorage存储
 * @method get 获取
 * @method set 设置
 * @method remove 移除
 * @method clear 移除全部
 */
import { decrypt, encrypt } from './jsencrypt'

export const local = {
  get(key: string): any {
    return JSON.parse(decrypt(localStorage.getItem(key) as any))
  },
  set(key: string, value: any) {
    localStorage.setItem(key, encrypt(JSON.stringify(value)))
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}

/**
 * sessionStorage存储
 * @method get 获取
 * @method set 设置
 * @method remove 移除
 * @method clear 移除全部
 */
export const session = {
  get(key: string): any {
    return JSON.parse(decrypt(sessionStorage.getItem(key) as any))
  },
  getNoDecrypt(key: string): any {
    return JSON.parse(sessionStorage.getItem(key) as any)
  },
  set(key: string, value: any) {
    sessionStorage.setItem(key, encrypt(JSON.stringify(value)))
  },
  setNoEncrypt(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string) {
    sessionStorage.removeItem(key)
  },
  clear() {
    sessionStorage.clear()
  }
}
