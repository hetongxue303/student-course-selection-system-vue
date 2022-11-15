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
    path: '/',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: '401',
        path: '/401',
        meta: {
          title: '404',
          cache: false
        },
        component: () => import('@views/error/401.vue')
      },
      {
        name: '404',
        path: '/:pathMatch(.*)*',
        meta: {
          title: '页面不存在',
          cache: false
        },
        component: () => import('@views/error/404.vue')
      }
    ]
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
      }
    ]
  },
  {
    name: '用户管理',
    path: '/user',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'admin',
        path: '/user/admin',
        meta: {
          title: '管理员',
          cache: false
        },
        component: () => import('@views/user/Admin.vue')
      },
      {
        name: 'teacher',
        path: '/user/teacher',
        meta: {
          title: '教师管理',
          cache: false
        },
        component: () => import('@views/user/Teacher.vue')
      },
      {
        name: 'student',
        path: '/user/student',
        meta: {
          title: '学生管理',
          cache: false
        },
        component: () => import('@views/user/Student.vue')
      }
    ]
  },
  {
    name: '学校管理',
    path: '/school',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'college',
        path: '/school/college',
        meta: {
          title: '学院管理',
          cache: false
        },
        component: () => import('@views/school/College.vue')
      },
      {
        name: 'major',
        path: '/school/major',
        meta: {
          title: '专业管理',
          cache: false
        },
        component: () => import('@views/school/Major.vue')
      },
      {
        name: 'course',
        path: '/school/course',
        meta: {
          title: '课程管理',
          cache: false
        },
        component: () => import('@views/school/Course.vue')
      },
      {
        name: 'selection',
        path: '/school/selection',
        meta: {
          title: '选课管理',
          cache: false
        },
        component: () => import('@views/school/Selection.vue')
      }
    ]
  },
  {
    name: '系统管理',
    path: '/system',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'account',
        path: '/system/account',
        meta: {
          title: '账户管理',
          cache: false
        },
        component: () => import('@views/system/Account.vue')
      },
      {
        name: 'role',
        path: '/system/role',
        meta: {
          title: '角色管理',
          cache: false
        },
        component: () => import('@views/system/Role.vue')
      },
      {
        name: 'menu',
        path: '/system/menu',
        meta: {
          title: '菜单管理',
          cache: false
        },
        component: () => import('@views/system/Menu.vue')
      }
    ]
  },
  {
    name: '关于系统',
    path: '/',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'about',
        path: '/about',
        meta: {
          title: '关于系统',
          cache: false
        },
        component: () => import('@views/about/Index.vue')
      }
    ]
  }
]

export default routes
