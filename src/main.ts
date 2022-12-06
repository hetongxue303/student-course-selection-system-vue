import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import ElementPlus from './plugins/element-plus'
import pinia from './store'

import '@assets/styles/index.scss'
import 'virtual:windi.css'
import 'animate.css'

import '@/permission'

import 'virtual:svg-icons-register'
import SvgIcon from '@components/SvgIcon/Index.vue'

const app = createApp(App)

app.directive('permission', (el, binding) => {
  const { value } = binding
  const permissions = ['user:list', 'user:add']
  // const permissions = ['user:list', 'user:add', 'user:del', 'user:update']
  if (value && value.length > 0 && value instanceof Array) {
    const needPermission = value
    const hasPermission = permissions.some((permission) => {
      return needPermission.includes(permission)
    })
    if (!hasPermission) {
      el.parentNode.removeChild(el)
    }
  } else {
    throw new Error('权限不足')
  }
})

app.directive('focus', (el) => {
  el.focus()
})

app.use(router).use(ElementPlus).use(pinia)

app.component('SvgIcon', SvgIcon)

app.mount('#app')
