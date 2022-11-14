import { RouteRecordRaw } from 'vue-router'
import Layout from '@layout/Index.vue'

const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '用户登录',
      isShow: false,
      requireAuth: false
    },
    component: () => import('@views/Login.vue')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      isShow: false
    },
    children: [
      {
        name: 'dashboard',
        path: '/dashboard',
        component: () => import('@views/dashboard/Index.vue'),
        meta: {
          title: '首页',
          icon: null,
          roles: ['any'],
          isShow: true,
          requireAuth: true
        }
      }
    ]
  }
]

export default routes
