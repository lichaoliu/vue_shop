import {
  createRouter,
  createWebHistory
} from 'vue-router'
import Login from './components/Login-Home.vue'
import Home from './components/Home-LLC.vue'
import Welcome from './components/Welcome-LLC.vue'
import Users from './components/user/Users-LLC.vue'

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
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }]
  }]
})
export default router
