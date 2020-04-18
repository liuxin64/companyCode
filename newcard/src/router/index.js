import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/index',
    name: 'Index',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../pages/Index/index')
  },
  {
    path:'/demo',
    name:'Demo',
    component:() => import('../pages/Index/demo')
  },
  {
    path:'/demo01',
    name:'Demo01',
    component:() => import('../pages/Index/demo01')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
