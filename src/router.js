import {
  createRouter,
  createWebHistory
} from 'vue-router'
import Login from './components/Login-Home.vue'
import Home from './components/Home-LLC.vue'
import Welcome from './components/Welcome-LLC.vue'
import Users from './components/user/Users-LLC.vue'
import Rigths from './components/power/Rigths-LLC.vue'
import Roles from './components/power/Roles-LLC.vue'
import Cate from './components/goods/Cate-LLC.vue'
import Params from './components/goods/Params-LLC.vue'

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
    }, {
      path: '/rights',
      component: Rigths
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params
    }]
  }]
})
export default router
