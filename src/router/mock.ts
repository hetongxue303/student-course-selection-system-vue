const modules = import.meta.glob('../views/**/**.vue')

export const mockData = [
  {
    name: 'college',
    path: '/',
    component: () => modules['../layout/Index.vue'],
    meta: { cache: false },
    children: [
      {
        name: 'college',
        path: '/college',
        meta: {
          title: '学院管理',
          cache: false
        },
        component: () => modules['../view/college/Index.vue']
      }
    ]
  },
  {
    name: 'major',
    path: '/',
    component: () => modules['../layout/Index.vue'],
    meta: { cache: false },
    children: [
      {
        name: 'major',
        path: '/major',
        meta: {
          title: '专业管理',
          cache: false
        },
        component: () => modules['../view/major/Index.vue']
      }
    ]
  },
  {
    name: 'course',
    path: '/',
    component: () => modules['../layout/Index.vue'],
    meta: { cache: false },
    children: [
      {
        name: 'course',
        path: '/course',
        meta: {
          title: '课程管理',
          cache: false
        },
        component: () => modules['../views/course/Index.vue']
      }
    ]
  },
  {
    name: 'choice',
    path: '/',
    component: () => modules['../layout/Index.vue'],
    meta: { cache: false },
    children: [
      {
        name: 'choice',
        path: '/choice',
        meta: {
          title: '选课记录',
          cache: false
        },
        component: () => modules['../views/choice/Index.vue']
      }
    ]
  },
  {
    name: 'about',
    path: '/',
    component: () => modules['../layout/Index.vue'],
    meta: { cache: false },
    children: [
      {
        name: 'about',
        path: '/about',
        meta: {
          title: '关于系统',
          cache: false
        },
        component: () => modules['../views/about/Index.vue']
      }
    ]
  },
  {
    name: 'system',
    path: '/system',
    component: () => modules['../layout/Index.vue'],
    meta: {
      title: '系统管理',
      cache: false
    },
    children: [
      {
        name: 'user',
        path: '/system/user',
        meta: {
          title: '用户管理',
          cache: false
        },
        component: () => modules['../views/system/user/Index.vue']
      },
      {
        name: 'role',
        path: '/system/role',
        meta: {
          title: '角色管理',
          cache: false
        },
        component: () => modules['../views/system/role/Index.vue']
      },
      {
        name: 'menu',
        path: '/system/menu',
        meta: {
          title: '菜单管理',
          cache: false
        },
        component: () => modules['../views/system/menu/Index.vue']
      }
    ]
  }
]
