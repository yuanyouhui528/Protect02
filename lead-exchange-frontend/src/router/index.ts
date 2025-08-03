import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { envConfig } from '@/utils/env'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: true,
    },
  },
  {
    path: '/auth',
    name: 'Auth',
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
        meta: {
          title: '用户登录',
          requiresAuth: false,
        },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue'),
        meta: {
          title: '用户注册',
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: '/leads',
    name: 'LeadManagement',
    component: () => import('@/views/leads/LeadManagement.vue'),
    meta: {
      title: '线索管理',
      requiresAuth: true,
    },
  },
  {
    path: '/exchange',
    name: 'ExchangeCenter',
    component: () => import('@/views/exchange/ExchangeCenter.vue'),
    meta: {
      title: '交换中心',
      requiresAuth: true,
    },
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/analytics/Analytics.vue'),
    meta: {
      title: '数据分析',
      requiresAuth: true,
    },
  },
  {
    path: '/notifications',
    name: 'NotificationCenter',
    component: () => import('@/views/notifications/NotificationCenter.vue'),
    meta: {
      title: '通知中心',
      requiresAuth: true,
    },
  },
  {
    path: '/chart-demo',
    name: 'ChartDemo',
    component: () => import('@/views/ChartDemo.vue'),
    meta: {
      title: 'ECharts图表示例',
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 在开发环境下打印路由信息
if (envConfig.app.debug) {
  console.log('🚀 Router initialized with', routes.length, 'routes')
}

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 招商线索流通平台`
  }

  // 检查是否需要认证
  if (to.meta?.requiresAuth) {
    // TODO: 检查用户是否已登录
    // 这里应该检查用户的登录状态，比如从 localStorage 或 Pinia store 中获取
    const isAuthenticated = localStorage.getItem('token') // 临时实现

    if (!isAuthenticated) {
      // 未登录，重定向到登录页
      next({
        name: 'Login',
        query: { redirect: to.fullPath }, // 保存原始路径，登录后可以重定向回来
      })
      return
    }
  }

  // 如果已登录用户访问登录或注册页，重定向到首页
  if (to.name === 'Login' || to.name === 'Register') {
    const isAuthenticated = localStorage.getItem('token')
    if (isAuthenticated) {
      next({ name: 'Home' })
      return
    }
  }

  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

export default router
