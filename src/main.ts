import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import ElementPlus from './plugins/element-plus'
import pinia from './store'
import directive from './directive/Index'
import * as echarts from 'echarts'

import '@assets/styles/index.scss'
import 'virtual:windi.css'
import 'animate.css'

import 'virtual:svg-icons-register'
import SvgIcon from '@components/SvgIcon/Index.vue'

import '@/permission'

const app = createApp(App)

app.config.globalProperties.$echarts = echarts

app.use(router).use(ElementPlus).use(pinia).use(directive)

app.component('SvgIcon', SvgIcon)

app.mount('#app')
