import router, { addRouter, hasRouter } from './router'
import NProgress from './plugins/nProgress'
import { getToken } from './utils/auth'
import { ElMessage } from 'element-plus'
import { useUserStore } from './store/modules/user'
import { setBrowserTitle } from './utils/common'
import { usePermissionStore } from './store/modules/permission'

const REQUEST_WITHE_LIST: string[] = ['/login', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  hasRouter()
  if (getToken()) {
    if (to.path === '/login') {
      next('/')
    } else if (userStore.roles.length === 0) {
      userStore
        .getUserInfo()
        .then(() => {
          addRouter(permissionStore.routers)
          next({ ...to, replace: true })
        })
        .catch((err) => {
          userStore.systemLogout()
          ElMessage.error(err.message)
          next('/')
        })
    } else {
      next()
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

  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
  setBrowserTitle(router)
})