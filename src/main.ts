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

app.use(router).use(ElementPlus).use(pinia)

app.component('SvgIcon', SvgIcon)

app.mount('#app')
