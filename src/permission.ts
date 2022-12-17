import NProgress from './plugins/nProgress'
import { getToken } from './utils/auth'
import { useUserStore } from './store/modules/user'
import { setBrowserTitle } from './utils/common'
import { usePermissionStore } from './store/modules/permission'
import router from './router'
import { getUserInfo } from './api/login'

const REQUEST_WITHE_LIST: string[] = ['/login', '/register']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  if (getToken()) {
    if (to.path === '/login') {
      next('/')
    }
    // else if (
    //   userStore.roles.length === 0 ||
    //   !permissionStore.loadMenu ||
    //   !permissionStore.loadRouter
    // ) {
    //   getUserInfo().then(({ data }) => userStore.setUserInfo(data.data))
    //   next({ ...to, replace: true })
    // }
    else {
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
