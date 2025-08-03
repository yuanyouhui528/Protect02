// 认证中间件
// 检查用户登录状态和权限

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { PUBLIC_ROUTES } from '@/constants'

/**
 * 认证中间件
 * @param to 目标路由
 * @param from 来源路由
 * @param next 导航守卫回调
 */
export function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const { isLoggedIn, currentUser } = useAuth()

  // 检查是否为公开路由
  const isPublicRoute = PUBLIC_ROUTES.includes(to.path)

  // 如果是公开路由，直接通过
  if (isPublicRoute) {
    // 如果已登录用户访问登录页，重定向到首页
    if (isLoggedIn.value && (to.path === '/login' || to.path === '/register')) {
      next({ path: '/' })
      return
    }
    next()
    return
  }

  // 检查用户是否已登录
  if (!isLoggedIn.value) {
    // 未登录，重定向到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // 检查用户状态
  if (currentUser.value?.status !== 'ACTIVE') {
    // 用户状态异常，重定向到登录页
    next({
      path: '/login',
      query: { message: '账户状态异常，请重新登录' },
    })
    return
  }

  // 通过认证检查
  next()
}

/**
 * 权限中间件
 * @param requiredPermissions 需要的权限列表
 * @param requireAll 是否需要全部权限（默认false，满足任一即可）
 */
export function permissionMiddleware(
  requiredPermissions: string | string[],
  requireAll: boolean = false,
) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ): void => {
    const { hasPermission, hasAnyPermission } = useAuth()

    const permissions = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions]

    let hasAuth: boolean

    if (requireAll) {
      // 需要全部权限
      hasAuth = permissions.every((permission) => hasPermission(permission))
    } else {
      // 满足任一权限即可
      hasAuth = hasAnyPermission(permissions)
    }

    if (!hasAuth) {
      // 权限不足，重定向到403页面
      next({ path: '/403' })
      return
    }

    next()
  }
}

/**
 * 角色中间件
 * @param requiredRoles 需要的角色列表
 * @param requireAll 是否需要全部角色（默认false，满足任一即可）
 */
export function roleMiddleware(requiredRoles: string | string[], requireAll: boolean = false) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ): void => {
    const { hasRole, hasAnyRole } = useAuth()

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]

    let hasAuth: boolean

    if (requireAll) {
      // 需要全部角色
      hasAuth = roles.every((role) => hasRole(role))
    } else {
      // 满足任一角色即可
      hasAuth = hasAnyRole(roles)
    }

    if (!hasAuth) {
      // 角色不足，重定向到403页面
      next({ path: '/403' })
      return
    }

    next()
  }
}

/**
 * 游客中间件（仅允许未登录用户访问）
 */
export function guestMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn.value) {
    // 已登录用户不能访问，重定向到首页
    next({ path: '/' })
    return
  }

  next()
}

/**
 * 验证中间件（检查用户是否已验证邮箱/手机）
 */
export function verifiedMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const { currentUser } = useAuth()

  // 检查用户是否已验证
  const isVerified = currentUser.value?.status === 'ACTIVE'

  if (!isVerified) {
    // 未验证，重定向到验证页面
    next({
      path: '/verify',
      query: { redirect: to.fullPath },
    })
    return
  }

  next()
}

/**
 * 组合中间件
 * @param middlewares 中间件函数数组
 */
export function combineMiddlewares(
  ...middlewares: Array<
    (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => void
  >
) {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ): void => {
    let index = 0

    function runNext(): void {
      if (index >= middlewares.length) {
        next()
        return
      }

      const middleware = middlewares[index++]
      middleware(to, from, (guard?: any) => {
        if (guard) {
          next(guard)
        } else {
          runNext()
        }
      })
    }

    runNext()
  }
}

/**
 * 中间件使用示例：
 *
 * // 在路由配置中使用
 * {
 *   path: '/admin',
 *   component: AdminPage,
 *   beforeEnter: combineMiddlewares(
 *     authMiddleware,
 *     roleMiddleware(['admin']),
 *     verifiedMiddleware
 *   )
 * }
 *
 * // 或者单独使用
 * {
 *   path: '/profile',
 *   component: ProfilePage,
 *   beforeEnter: authMiddleware
 * }
 *
 * {
 *   path: '/login',
 *   component: LoginPage,
 *   beforeEnter: guestMiddleware
 * }
 */
