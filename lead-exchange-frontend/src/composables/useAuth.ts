// 用户认证相关的组合式API
// 提供登录、登出、权限检查等功能

import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { User, LoginForm, RegisterForm } from '@/types'

/**
 * 认证状态管理
 */
const authState = reactive({
  user: null as User | null,
  token: localStorage.getItem('token') || '',
  isLoading: false,
  isAuthenticated: false,
})

/**
 * 用户认证组合式API
 */
export function useAuth() {
  const router = useRouter()

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
      // const response = await authApi.login(loginForm);

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟登录成功
      const mockToken = 'mock-jwt-token'
      const mockUser: User = {
        id: 1,
        username: loginForm.username,
        email: 'user@example.com',
        phone: '13800138000',
        status: 'ACTIVE' as any,
        roles: [],
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }

      // 保存认证信息
      authState.token = mockToken
      authState.user = mockUser
      authState.isAuthenticated = true

      // 保存到本地存储
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))

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
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // 跳转到登录页
      router.push('/login')
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
   * 初始化认证状态
   */
  const initAuth = (): void => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        authState.token = token
        authState.user = JSON.parse(userStr)
        authState.isAuthenticated = true

        // 刷新用户信息
        refreshUser()
      } catch (error) {
        console.error('初始化认证状态失败:', error)
        logout()
      }
    }
  }

  // ==================== 返回值 ====================

  return {
    // 状态
    isLoggedIn,
    currentUser,
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
  }
}
