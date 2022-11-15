import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import ElementPlus from './plugins/element-plus'
import pinia from './store'

import './assets/styles/index.scss'
import 'virtual:windi.css'
import 'animate.css'

import 'virtual:svg-icons-register'
import SvgIcon from '@components/SvgIcon/Index.vue'
import { Import } from 'windicss/types/lang/tokens'

const app = createApp(App)

app
  .use(router)
  .use(ElementPlus)
  .use(pinia)
  .component('SvgIcon', SvgIcon)
  .mount('#app')
