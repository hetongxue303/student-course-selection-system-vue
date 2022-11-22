import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import NProgress from '../plugins/nProgress'
import { getToken, removeToken, removeTokenTime } from '../utils/auth'
import { useUserStore } from '../store/modules/user'
import pinia from '../store/index'
import { getUserInfo } from '../api/auth'
import { ElMessage } from 'element-plus'
import { usePermissionStore } from '../store/modules/permission'
import { local } from '../utils/storage'

const router = createRouter({
  history: createWebHistory(),
  routes
})

const userStore = useUserStore(pinia)
const permissionStore = usePermissionStore(pinia)
const REQUEST_WITHE_LIST: string[] = ['/login', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next('/')
    } else {
      getUserInfo()
        .then((res) => {
          const { data } = res
          userStore.setInfo(data)
          permissionStore.setInfo(data)
          // TODO 动态生成路由
          permissionStore.dynamicGenerationRouter()
          next()
          // next({ ...to, replace: true })
        })
        .catch((error) => {
          ElMessage.error(error.response.data.message)
          removeToken()
          removeTokenTime()
          next('/login')
        })
    }
  } else if (REQUEST_WITHE_LIST.indexOf(to.path) !== -1) {
    // 每次清空一下本地存储
    userStore.systemLogout()
    next()
  } else {
    userStore.systemLogout()
    next(
      to.fullPath === '/dashboard' ? '/login' : `/login?redirect=${to.fullPath}`
    )
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
