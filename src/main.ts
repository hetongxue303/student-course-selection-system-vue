import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import ElementPlus from './plugins/element-plus'
import pinia from './store'

import './assets/styles/index.scss'
import 'virtual:windi.css'
import 'animate.css'

const app = createApp(App)

app.use(router).use(ElementPlus).use(pinia).mount('#app')
