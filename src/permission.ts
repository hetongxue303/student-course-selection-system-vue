import router from './router'
import { usePermissionStore } from './store/modules/permission'
import NProgress from './plugins/nProgress'
import { getToken, removeToken, removeTokenTime } from './utils/auth'
import { getUserInfo } from './api/auth'
import { ElMessage } from 'element-plus'
import { useUserStore } from './store/modules/user'
import { setBrowserTitle } from './utils/common'

const REQUEST_WITHE_LIST: string[] = ['/login', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
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
          // permissionStore.dynamicGenerationRouter()
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
  setBrowserTitle(router)
})
