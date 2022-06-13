import {
  createRouter,
  createWebHistory
} from 'vue-router'
import Login from './components/Login-Home.vue'
import Home from './components/Home-LLC.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home
  }]
})
export default router
