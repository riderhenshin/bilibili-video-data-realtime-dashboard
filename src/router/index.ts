import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Setting from '@/views/Setting.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Dashboard,
    },
    {
      path: '/setting',
      component: Setting
    },
  ],
})

export default router
