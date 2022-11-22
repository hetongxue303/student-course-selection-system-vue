import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@layout/Index.vue'

const constantRoutes: RouteRecordRaw[] = [
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
  routes: constantRoutes
})

export default router
