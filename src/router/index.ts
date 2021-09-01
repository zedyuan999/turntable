import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import turntable from './turntable'
import Home from '@/view/home.vue'
const routes: Array<RouteRecordRaw> = [
  ...turntable,
  {
    path: '/', 
    name: 'home',
    component: Home,
  },
]

const router = createRouter({
  history:createWebHashHistory(),
  routes, 
})

export default router