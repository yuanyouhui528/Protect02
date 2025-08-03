// 用户认证相关的组合式API
// 提供登录、登出、权限检查等功能

import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { User, LoginForm, RegisterForm } from '@/types'
import { secureStorage } from '@/utils/secureStorage'
import { tokenValidator, type TokenValidationResult } from '@/utils/tokenValidator'
// import { userApi } from '@/api' // 待实际API接口完成后启用

/**
 * 认证状态管理
 */
const authState = reactive({
  user: null as User | null,
  token: '',
  isLoading: false,
  isAuthenticated: false,
})

/**
 * 用户认证组合式API
 */
export function useAuth() {
  // 安全获取router实例，避免在非Vue组件上下文中调用时出错
  let router: any = null
  try {
    router = useRouter()
  } catch (error) {
    console.warn('无法获取router实例，可能在非Vue组件上下文中调用useAuth')
  }

  // ==================== 计算属性 ====================

  /**
   * 是否已登录
   */
  const isLoggedIn = computed(() => {
    return !!authState.token && !!authState.user
  })

  /**
   * 当前用户信息
   */
  const currentUser = computed(() => authState.user)

  /**
   * 用户角色列表
   */
  const userRoles = computed(() => {
    return authState.user?.roles?.map((role) => role.code) || []
  })

  /**
   * 用户权限列表
   */
  const userPermissions = computed(() => {
    const permissions: string[] = []
    authState.user?.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        permissions.push(permission.code)
      })
    })
    return permissions
  })

  // ==================== 方法 ====================

  /**
   * 用户登录
   * @param loginForm 登录表单数据
   */
  const login = async (loginForm: LoginForm): Promise<boolean> => {
    try {
      authState.isLoading = true

      // TODO: 调用登录API
      // const response = await userApi.login({
      //   phone: loginForm.phone,
      //   password: loginForm.password
      // });

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟登录成功
      const mockToken = 'mock-jwt-token'
      const mockUser: User = {
        id: 1,
        username: loginForm.phone, // 统一使用手机号作为用户名，保持与登录表单一致
        email: 'user@example.com',
        phone: loginForm.phone,
        status: 'ACTIVE' as any,
        roles: [],
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }

      // 保存认证信息
      authState.token = mockToken
      authState.user = mockUser
      authState.isAuthenticated = true

      // 安全保存到本地存储
      await secureStorage.setItem('access_token', mockToken)
      await secureStorage.setItem('user', mockUser)

      return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    } finally {
      authState.isLoading = false
    }
  }

  /**
   * 用户注册
   * @param registerForm 注册表单数据
   */
  const register = async (_registerForm: RegisterForm): Promise<boolean> => {
    try {
      authState.isLoading = true

      // TODO: 调用注册API
      // const response = await authApi.register(registerForm);

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return true
    } catch (error) {
      console.error('注册失败:', error)
      return false
    } finally {
      authState.isLoading = false
    }
  }

  /**
   * 用户登出
   */
  const logout = async (): Promise<void> => {
    try {
      // TODO: 调用登出API
      // await authApi.logout();

      // 清除认证信息
      authState.token = ''
      authState.user = null
      authState.isAuthenticated = false

      // 清除本地存储
      secureStorage.removeItem('access_token')
      secureStorage.removeItem('user')

      // 跳转到登录页（检查router是否可用）
      if (router && typeof router.push === 'function') {
        router.push('/auth/login')
      } else {
        // 如果router不可用，使用window.location进行跳转
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
      }
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  /**
   * 刷新用户信息
   */
  const refreshUser = async (): Promise<void> => {
    try {
      if (!authState.token) return

      // TODO: 调用获取用户信息API
      // const response = await authApi.getUserInfo();
      // authState.user = response.data;
    } catch (error) {
      console.error('刷新用户信息失败:', error)
      // 如果token无效，清除认证信息
      logout()
    }
  }

  /**
   * 检查用户是否有指定角色
   * @param role 角色代码
   */
  const hasRole = (role: string): boolean => {
    return userRoles.value.includes(role)
  }

  /**
   * 检查用户是否有指定权限
   * @param permission 权限代码
   */
  const hasPermission = (permission: string): boolean => {
    return userPermissions.value.includes(permission)
  }

  /**
   * 检查用户是否有任一指定角色
   * @param roles 角色代码数组
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => hasRole(role))
  }

  /**
   * 检查用户是否有任一指定权限
   * @param permissions 权限代码数组
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission))
  }

  /**
   * 验证当前token的有效性
   */
  const validateCurrentToken = async (): Promise<TokenValidationResult> => {
    try {
      const token = await secureStorage.getItem<string>('access_token')
      
      if (!token) {
        return {
          isValid: false,
          error: 'Token不存在'
        }
      }

      return tokenValidator.validateToken(token)
    } catch (error) {
      console.error('Token验证失败:', error)
      return {
        isValid: false,
        error: 'Token验证异常'
      }
    }
  }

  /**
   * 检查认证状态（包含完整的安全验证）
   */
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const validation = await validateCurrentToken()
      
      if (!validation.isValid) {
        console.warn('认证状态检查失败:', validation.error)
        await logout()
        return false
      }

      // 检查是否需要刷新token
      const token = await secureStorage.getItem<string>('access_token')
      if (token && tokenValidator.shouldRefreshToken(token)) {
        console.info('Token即将过期，尝试刷新...')
        // TODO: 实现token刷新逻辑
        // await refreshToken()
      }

      return true
    } catch (error) {
      console.error('认证状态检查异常:', error)
      await logout()
      return false
    }
  }

  /**
   * 检查用户是否有访问指定路由的权限
   * @param requiredRoles 路由需要的角色
   * @param requiredPermissions 路由需要的权限
   */
  const checkRoutePermission = async (requiredRoles?: string[], requiredPermissions?: string[]): Promise<boolean> => {
    try {
      const token = await secureStorage.getItem<string>('access_token')
      
      if (!token) {
        return false
      }

      // 验证token有效性
      const validation = tokenValidator.validateToken(token)
      if (!validation.isValid) {
        return false
      }

      // 如果没有指定角色和权限要求，只需要登录即可
      if (!requiredRoles?.length && !requiredPermissions?.length) {
        return true
      }

      // 检查角色权限
      if (requiredRoles?.length) {
        const hasRole = tokenValidator.hasRequiredRoles(token, requiredRoles)
        if (!hasRole) {
          console.warn('用户缺少必要角色:', requiredRoles)
          return false
        }
      }

      // 检查功能权限
      if (requiredPermissions?.length) {
        const hasPermission = tokenValidator.hasRequiredPermissions(token, requiredPermissions)
        if (!hasPermission) {
          console.warn('用户缺少必要权限:', requiredPermissions)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('路由权限检查失败:', error)
      return false
    }
  }

  /**
   * 初始化认证状态
   */
  const initAuth = async (): Promise<void> => {
    try {
      const token = await secureStorage.getItem<string>('access_token')
      const user = await secureStorage.getItem<User>('user')

      if (token && user) {
        // 验证token有效性
        const validation = tokenValidator.validateToken(token)
        
        if (validation.isValid) {
          authState.token = token
          authState.user = user
          authState.isAuthenticated = true

          // 刷新用户信息
          await refreshUser()
        } else {
          console.warn('存储的token无效:', validation.error)
          await logout()
        }
      }
    } catch (error) {
      console.error('初始化认证状态失败:', error)
      await logout()
    }
  }

  // ==================== 返回值 ====================

  return {
    // 状态
    isLoggedIn,
    currentUser,
    user: currentUser, // 添加user别名，保持向后兼容
    userRoles,
    userPermissions,
    isLoading: computed(() => authState.isLoading),

    // 方法
    login,
    register,
    logout,
    refreshUser,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    initAuth,
    
    // 安全验证方法
    validateCurrentToken,
    checkAuthStatus,
    checkRoutePermission,
  }
}
