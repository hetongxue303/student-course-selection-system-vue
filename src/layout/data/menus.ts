export const menus: Array<any> = [
  {
    name: '首页',
    icon: 'document',
    path: '/dashboard'
  },
  {
    name: '用户管理',
    icon: 'document',
    path: '/user',
    children: [
      {
        name: '管理员',
        icon: 'user',
        path: '/user/admin'
      },
      {
        name: '教师管理',
        icon: 'user',
        path: '/user/teacher'
      },
      {
        name: '学生管理',
        icon: 'user',
        path: '/user/student'
      }
    ]
  },
  {
    name: '学校管理',
    icon: 'document',
    path: '/school',
    children: [
      {
        name: '学院管理',
        icon: 'document',
        path: '/school/college'
      },
      {
        name: '专业管理',
        icon: 'document',
        path: '/school/major'
      },
      {
        name: '课程管理',
        icon: 'document',
        path: '/school/course'
      },
      {
        name: '选课管理',
        icon: 'document',
        path: '/school/selection'
      }
    ]
  },
  {
    name: '系统管理',
    icon: 'document',
    path: '/system',
    children: [
      {
        name: '账户管理',
        icon: 'document',
        path: '/system/account'
      },
      {
        name: '角色管理',
        icon: 'document',
        path: '/system/role'
      },
      {
        name: '菜单管理',
        icon: 'document',
        path: '/system/menu'
      }
    ]
  },
  {
    name: '关于系统',
    icon: 'document',
    path: '/about'
  }
]
