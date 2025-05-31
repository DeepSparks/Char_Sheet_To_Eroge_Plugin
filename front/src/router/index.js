import { createRouter, createWebHistory } from 'vue-router'
import Settings from '@/views/Settings.vue'
import Resources from '@/views/Resources.vue'

const routes = [
  {
    path: '/',
    redirect: '/settings'
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/resources',
    name: 'Resources',
    component: Resources
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 