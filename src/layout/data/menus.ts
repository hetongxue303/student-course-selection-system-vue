export const menus: Array<any> = [
  {
    name: '首页',
    icon: 'index',
    path: '/dashboard'
  },
  {
    name: '学院管理',
    icon: 'college',
    path: '/college'
  },
  {
    name: '专业管理',
    icon: 'major',
    path: '/major'
  },
  {
    name: '课程管理',
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
    icon: 'confirm',
    path: '/confirm'
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
