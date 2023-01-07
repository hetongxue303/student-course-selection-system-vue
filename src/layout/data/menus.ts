export const menus: Array<any> = [
  {
    name: '首页',
    icon: 'index',
    path: '/dashboard'
  },
  {
    name: '我的课程',
    icon: 'course',
    path: '/my-course'
  },
  {
    name: '课程列表',
    icon: 'course',
    path: '/course'
  },
  {
    name: '选课记录',
    icon: 'choice',
    path: '/choice'
  },
  {
    name: '申请列表',
    icon: 'user',
    path: '/confirm'
  },
  {
    name: '教务管理',
    icon: 'user',
    path: '/educational',
    children: [
      {
        name: '学院列表',
        icon: 'college',
        path: '/educational/college'
      },
      {
        name: '专业列表',
        icon: 'major',
        path: '/educational/major'
      }
    ]
  },
  {
    name: '系统管理',
    icon: 'system',
    path: '/system',
    children: [
      {
        name: '用户管理',
        icon: 'userManager',
        path: '/system/user'
      },
      {
        name: '角色管理',
        icon: 'role',
        path: '/system/role'
      },
      {
        name: '菜单管理',
        icon: 'menu',
        path: '/system/menu'
      }
    ]
  },
  {
    name: '关于系统',
    icon: 'about',
    path: '/about'
  }
]
