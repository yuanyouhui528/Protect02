import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { envConfig } from '@/utils/env'
import { useAuth } from '@/composables/useAuth'
import '@/types/router' // 导入路由类型扩展
import { ROLES, PERMISSIONS } from '@/types/router'
import { 
  config as guardConfig,
  utils as guardUtils,
  errorHandler,
  performanceMonitor
} from '@/router/guards'

// 导入环境配置
const devEnvConfig = {
  dev: {
    simplifiedGuards: import.meta.env.VITE_DEV_SIMPLIFIED_GUARDS === 'true'
  }
}

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
      permissions: [PERMISSIONS.LEAD_READ], // 需要线索读取权限
      accessLevel: 'protected',
      description: '管理和查看招商线索信息',
      icon: 'Document',
    },
  },
  {
    path: '/exchange',
    name: 'ExchangeCenter',
    component: () => import('@/views/exchange/ExchangeCenter.vue'),
    meta: {
      title: '交换中心',
      requiresAuth: true,
      permissions: [PERMISSIONS.EXCHANGE_READ], // 需要交换读取权限
      accessLevel: 'protected',
      description: '线索交换和匹配中心',
      icon: 'Switch',
    },
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/analytics/Analytics.vue'),
    meta: {
      title: '数据分析',
      requiresAuth: true,
      roles: [ROLES.ADMIN, ROLES.MANAGER], // 需要管理员或经理角色
      permissions: [PERMISSIONS.ANALYTICS_READ], // 需要数据分析权限
      accessLevel: 'private',
      description: '数据统计和分析报表',
      icon: 'DataAnalysis',
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
    path: '/test-auth',
    name: 'TestAuth',
    component: () => import('@/views/TestAuth.vue'),
    meta: {
      title: '路由守卫测试',
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

// 路由守卫 - 开发环境优化版本
router.beforeEach(async (to, from, next) => {
  try {
    // 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - 招商线索流通平台`
    }

    // 检查是否启用开发环境简化模式
    const isDevSimplified = devEnvConfig.dev.simplifiedGuards
    
    if (isDevSimplified) {
      // 开发环境简化模式：跳过复杂的认证和权限检查
      console.log('🚀 开发环境简化模式：跳过复杂验证')
      
      // 只对需要认证的页面进行基本检查
      if (guardUtils.requiresAuthentication(to.meta?.requiresAuth)) {
        const { isLoggedIn } = useAuth()
        
        if (!isLoggedIn.value) {
          // 简单检查本地存储是否有token
          const token = localStorage.getItem('lead_exchange_access_token')
          if (!token) {
            console.warn('🚫 开发模式：未找到token，重定向到登录页')
            next({ path: '/auth/login', query: { redirect: to.fullPath } })
            return
          }
        }
      }
      
      // 处理已登录用户访问认证页面
      if (to.name === 'Login' || to.name === 'Register') {
        const token = localStorage.getItem('lead_exchange_access_token')
        if (token) {
          console.info('✅ 开发模式：用户已登录，重定向到首页')
          next({ path: '/home' })
          return
        }
      }
      
      console.log('✅ 开发模式：路由访问验证通过:', to.fullPath)
      next()
      return
    }

    // 生产环境完整验证逻辑
    const timerId = `guard-${Date.now()}`
    performanceMonitor.startTimer(timerId)

    // 获取认证实例
    const { checkAuthStatus, checkRoutePermission, currentUser } = useAuth()
    const userId = currentUser.value?.id?.toString()

    // 1. 检查是否需要认证
    if (guardUtils.requiresAuthentication(to.meta?.requiresAuth)) {
      if (!guardConfig.enableAuth) {
        console.warn('⚠️ 认证检查已禁用，跳过认证验证')
      } else {
        const isAuthenticated = await checkAuthStatus()
        if (!isAuthenticated) {
          const error = '用户未认证或token无效'
          console.warn('🚫', error)
          const redirectInfo = errorHandler.handleAuthError(error, to.fullPath)
          next(redirectInfo)
          return
        }
      }
    }

    // 2. 检查角色权限
    if (guardUtils.requiresRoles(to.meta?.roles) && guardConfig.enableRole) {
      const requiredRoles = to.meta?.roles as string[]
      const hasRolePermission = await checkRoutePermission(requiredRoles, undefined)
      
      if (!hasRolePermission) {
        const error = `用户缺少必要角色: ${requiredRoles.join(', ')}`
        console.warn('🚫', error)
        const redirectInfo = errorHandler.handlePermissionError(error, to.fullPath, userId)
        next(redirectInfo)
        return
      }
    }

    // 3. 检查功能权限
    if (guardUtils.requiresPermissions(to.meta?.permissions) && guardConfig.enablePermission) {
      const requiredPermissions = to.meta?.permissions as string[]
      const hasPermission = await checkRoutePermission(undefined, requiredPermissions)
      
      if (!hasPermission) {
        const error = `用户缺少必要权限: ${requiredPermissions.join(', ')}`
        console.warn('🚫', error)
        const redirectInfo = errorHandler.handlePermissionError(error, to.fullPath, userId)
        next(redirectInfo)
        return
      }
    }

    // 4. 处理已登录用户访问认证页面的情况
    if (to.name === 'Login' || to.name === 'Register') {
      const isAuthenticated = await checkAuthStatus()
      if (isAuthenticated) {
        console.info('✅ 用户已登录，重定向到首页')
        guardUtils.logAccessSuccess(to.fullPath, userId)
        next({ path: guardConfig.defaultRedirect })
        return
      }
    }

    // 5. 记录访问成功日志
    guardUtils.logAccessSuccess(to.fullPath, userId)
    
    // 6. 所有检查通过，允许访问
    console.log('✅ 路由访问验证通过:', to.fullPath)
    next()
    
    // 结束性能监控
    performanceMonitor.endTimer(timerId, to.fullPath)
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('💥 路由守卫执行异常:', errorMessage)
    
    // 发生异常时的降级处理
    if (guardUtils.requiresAuthentication(to.meta?.requiresAuth)) {
      next({ path: '/auth/login', query: { redirect: to.fullPath, error: 'system_error' } })
    } else {
      next()
    }
  }
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

export default router
