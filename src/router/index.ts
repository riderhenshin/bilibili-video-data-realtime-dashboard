import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Setting from '@/views/Setting.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/404.vue'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Dashboard,
      meta: { requiresAuth: false } // 标记无需登录
    },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: false } // 标记无需登录
    },
    {
      path: '/setting',
      component: Setting,
      meta: { requiresAuth: true } // 标记无需登录
    },
    {
      path:'/login',
      component:Login,
      meta: { requiresAuth: false } // 标记无需登录
    },
    // 404页面
  {
    path: '/:pathMatch(.*)*', // 匹配所有未定义的路由
    name: 'NotFound',
    component: NotFound, // 指向404组件
    meta: { requiresAuth: false } // 404页无需登录
  }
  ],
})

// 路由导航守卫（权限控制核心）
router.beforeEach((to, from, next) => {
  // 1. 判断目标路由是否需要登录
  const requiresAuth = to.meta.requiresAuth;
  // 2. 获取本地登录态
  const hasToken = localStorage.getItem('dashboard_token');

  if (requiresAuth) {
    // 需登录：有token→放行，无token→跳登录页
    hasToken ? next() : next('/login');
  } else {
    // 无需登录（登录页）：有token→跳首页，无token→放行
    hasToken ? next('/') : next();
  }
});


export default router
