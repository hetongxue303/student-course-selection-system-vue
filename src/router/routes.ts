import { RouteRecordRaw } from 'vue-router'
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
    name: '404',
    path: '/:pathMatch(.*)*',
    meta: {
      title: '404',
      cache: false
    },
    component: () => import('@views/error/404.vue')
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
  },
  // 以下是动态
  {
    path: '/',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'my-course',
        path: '/my-course',
        meta: {
          title: '我的课程',
          cache: false
        },
        component: () => import('@views/my-course/Index.vue')
      },
      {
        name: 'course',
        path: '/course',
        meta: {
          title: '课程列表',
          cache: false
        },
        component: () => import('@views/course/Index.vue')
      },
      {
        name: 'choice',
        path: '/choice',
        meta: {
          title: '选课列表',
          cache: false
        },
        component: () => import('@views/choice/Index.vue')
      },
      {
        name: 'confirm',
        path: '/confirm',
        meta: {
          title: '申请列表',
          cache: false
        },
        component: () => import('@views/confirm/Index.vue')
      },
      {
        name: 'about',
        path: '/about',
        meta: {
          title: '关于系统',
          cache: false
        },
        component: () => import('@views/about/Index.vue')
      },
      {
        name: 'center',
        path: '/user/center',
        meta: {
          title: '个人中心',
          cache: false
        },
        component: () => import('@views/center/Index.vue')
      }
    ]
  },
  {
    path: '/educational',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'grade',
        path: '/educational/grade',
        meta: {
          title: '班级管理',
          cache: false
        },
        component: () => import('@views/grade/Index.vue')
      },
      {
        name: 'college',
        path: '/educational/college',
        meta: {
          title: '学院管理',
          cache: false
        },
        component: () => import('@views/college/Index.vue')
      },
      {
        name: 'major',
        path: '/educational/major',
        meta: {
          title: '专业管理',
          cache: false
        },
        component: () => import('@views/major/Index.vue')
      }
    ]
  },
  {
    name: 'system',
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', cache: false },
    children: [
      {
        name: 'user',
        path: '/system/user',
        meta: {
          title: '用户管理',
          cache: false
        },
        component: () => import('@views/system/user/Index.vue')
      },
      {
        name: 'role',
        path: '/system/role',
        meta: {
          title: '角色管理',
          cache: false
        },
        component: () => import('@views/system/role/Index.vue')
      },
      {
        name: 'menu',
        path: '/system/menu',
        meta: {
          title: '菜单管理',
          cache: false
        },
        component: () => import('@views/system/menu/Index.vue')
      }
    ]
  }
]

export default routes
