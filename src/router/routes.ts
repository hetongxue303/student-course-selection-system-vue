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
  {
    name: 'user',
    path: '/user',
    component: Layout,
    meta: { title: '用户管理', cache: false },
    children: [
      {
        name: 'admin',
        path: '/user/admin',
        meta: {
          title: '管理员',
          cache: false
        },
        component: () => import('@views/user/admin/Index.vue')
      },
      {
        name: 'teacher',
        path: '/user/teacher',
        meta: {
          title: '教师管理',
          cache: false
        },
        component: () => import('@views/user/teacher/Index.vue')
      },
      {
        name: 'student',
        path: '/user/student',
        meta: {
          title: '学生管理',
          cache: false
        },
        component: () => import('@views/user/student/Index.vue')
      }
    ]
  },
  {
    name: 'school',
    path: '/school',
    component: Layout,
    meta: { title: '学校管理', cache: false },
    children: [
      {
        name: 'college',
        path: '/school/college',
        meta: {
          title: '学院管理',
          cache: false
        },
        component: () => import('@views/school/college/Index.vue')
      },
      {
        name: 'major',
        path: '/school/major',
        meta: {
          title: '专业管理',
          cache: false
        },
        component: () => import('@views/school/major/Index.vue')
      },
      {
        name: 'course',
        path: '/school/course',
        meta: {
          title: '课程管理',
          cache: false
        },
        component: () => import('@views/school/course/Index.vue')
      },
      {
        name: 'choice',
        path: '/school/choice',
        meta: {
          title: '选课记录',
          cache: false
        },
        component: () => import('@views/school/choice/Index.vue')
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
  },
  {
    name: 'about',
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
