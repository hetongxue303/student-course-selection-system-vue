import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@layout/Index.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '用户登录',
      cache: false
    },
    component: () => import('@views/Login.vue')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { cache: false },
    children: [
      {
        name: 'dashboard',
        path: '/dashboard',
        meta: {
          title: '首页',
          cache: false
        },
        component: () => import('@views/dashboard/Index.vue')
      },
      {
        name: '401',
        path: '/401',
        meta: {
          title: '401',
          cache: false
        },
        component: () => import('@views/error/401.vue')
      },
      {
        name: '404',
        path: '/:pathMatch(.*)*',
        meta: {
          title: '404',
          cache: false
        },
        component: () => import('@views/error/404.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export const hasRouter = () => {
  console.log(router.getRoutes())
}

/**
 * 动态添加路由
 * @param asyncRouter
 */
export const addRouter = (asyncRouter: Array<any>) => {
  asyncRouter.forEach((item) => router.addRoute(item))
}

/**
 * 过滤后台路由
 * @param routers
 */
export const filterAsyncRouter = (routers: Array<any>) => {
  // 解决vite不能使用vue2+router动态导入问题
  const modules = import.meta.glob('@views/*/*.vue')
  const router: Array<any> = []
  routers.forEach((item) => {
    router.push({
      name: item.name,
      path: item.path,
      component:
        item.component === 'Layout'
          ? Layout
          : modules[`@views${item.component}`],
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        show: item.meta.show,
        cache: item.meta.cache,
        permission: item.meta.permission
      },
      children: item.children.length > 0 ? filterAsyncRouter(item.children) : []
    })
  })
  return router
}

export default router
