import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import turntable from './turntable'
import Home from '@/view/home.vue'
import Test from '@/view/test.vue'
import HeaderFixedList from '@/view/headerFixedList.vue'
const routes: Array<RouteRecordRaw> = [
  ...turntable,
  {
    path: '/', 
    name: 'home',
    component: Home,
  },
  {
    path: '/test', 
    name: 'test',
    component: Test
  },
  {
    path: '/headerFixedList', 
    name: 'headerFixedList',
    component: HeaderFixedList
  },
]

const router = createRouter({
  history:createWebHashHistory(),
  routes, 
})

export default router