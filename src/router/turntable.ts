

export default [
  {
    path: '/turntable', 
    name: 'turntable',
    component: () => import('@/view/turntable/turntable.vue'),
    
  },
  {
    path: '/turntableSelect', 
    name: 'turntableSelect',
    component: () => import('@/view/turntable/turntableSelect.vue'),
  },
]