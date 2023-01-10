import { useCookies } from '@vueuse/integrations/useCookies'

const cookies = useCookies()

/**
 * localStorage存储
 * @method get 获取
 * @method set 设置
 * @method remove 移除
 * @method clear 移除全部
 */

export const local = {
  get(key: string): any {
    return JSON.parse(localStorage.getItem(key) as any)
  },
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
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
    return JSON.parse(sessionStorage.getItem(key) as any)
  },
  set(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string) {
    sessionStorage.removeItem(key)
  },
  clear() {
    sessionStorage.clear()
  }
}

/**
 * cookie存储
 * @method get 获取
 * @method getAll 获取所有
 * @method set 设置
 * @method remove 移除
 */
export const cookie = {
  get(key: string): any {
    return JSON.parse(cookies.get(key))
  },
  getAll(): any {
    return JSON.parse(cookies.getAll())
  },
  set(key: string, value: any) {
    cookies.set(key, JSON.stringify(value))
  },
  remove(key: string) {
    cookies.remove(JSON.parse(key))
  }
}
