const menus: Array<any> = [
  {
    name: '首页',
    icon: 'index',
    path: '/dashboard'
  },
  {
    name: '用户管理',
    icon: 'user',
    path: '/user',
    children: [
      {
        name: '管理员',
        icon: 'admin',
        path: '/user/admin'
      },
      {
        name: '教师管理',
        icon: 'teacher',
        path: '/user/teacher'
      },
      {
        name: '学生管理',
        icon: 'student',
        path: '/user/student'
      }
    ]
  },
  {
    name: '学校管理',
    icon: 'school',
    path: '/school',
    children: [
      {
        name: '学院管理',
        icon: 'college',
        path: '/school/college'
      },
      {
        name: '专业管理',
        icon: 'major',
        path: '/school/major'
      },
      {
        name: '课程管理',
        icon: 'course',
        path: '/school/course'
      },
      {
        name: '选课管理',
        icon: 'selection',
        path: '/school/selection'
      }
    ]
  },
  {
    name: '系统管理',
    icon: 'system',
    path: '/system',
    children: [
      {
        name: '账户管理',
        icon: 'account',
        path: '/system/account'
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
