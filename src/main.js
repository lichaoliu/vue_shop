import {
  createApp
} from 'vue'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('tree-table', ZkTable)
app.config.globalProperties.$http = axios
app.use(router)
// app.use(ZkTable)
app.use(ElementPlus, {
  locale
})
app.mount('#app')
