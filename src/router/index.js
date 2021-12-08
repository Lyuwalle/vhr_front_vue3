import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    hidden: true
  },
]

const router = new Router({
  routes
})

export default router
