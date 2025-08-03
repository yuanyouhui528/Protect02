/**
 * 认证相关工具函数
 * 提供token管理、登录状态处理等公共功能
 */

import router from '@/router'
import { secureStorage } from './secureStorage'

/**
 * 清理所有认证相关的存储数据
 */
export async function clearAuthData(): Promise<void> {
  try {
    await Promise.all([
      secureStorage.removeItem('access_token'),
      secureStorage.removeItem('refresh_token'),
      secureStorage.removeItem('user')
    ])
  } catch (error) {
    console.error('清理认证数据失败:', error)
  }
}

/**
 * 跳转到登录页面
 * @param returnUrl 登录成功后的返回地址
 */
export function redirectToLogin(returnUrl?: string): void {
  const currentRoute = router.currentRoute.value
  const redirect = returnUrl || currentRoute.fullPath
  
  // 避免在登录页面重复跳转
  if (currentRoute.path !== '/login') {
    router.push({
      path: '/login',
      query: redirect !== '/login' ? { redirect } : undefined
    })
  }
}

/**
 * 处理认证失败
 * 清理认证数据并跳转到登录页面
 * @param returnUrl 登录成功后的返回地址
 */
export async function handleAuthFailure(returnUrl?: string): Promise<void> {
  await clearAuthData()
  redirectToLogin(returnUrl)
}

/**
 * 检查是否已登录
 * @returns 是否已登录
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await secureStorage.getItem<string>('access_token')
    return !!token
  } catch (error) {
    console.error('检查登录状态失败:', error)
    return false
  }
}

/**
 * 获取当前用户信息
 * @returns 用户信息或null
 */
export async function getCurrentUser(): Promise<any | null> {
  try {
    return await secureStorage.getItem('user')
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 获取访问令牌
 * @returns 访问令牌或null
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return await secureStorage.getItem<string>('access_token')
  } catch (error) {
    console.error('获取访问令牌失败:', error)
    return null
  }
}

/**
 * 刷新令牌
 * @returns 是否刷新成功
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const refreshToken = await secureStorage.getItem<string>('refresh_token')
    if (!refreshToken) {
      return false
    }
    
    // TODO: 实现token刷新逻辑
    // 这里应该调用刷新token的API
    console.log('Token刷新功能待实现')
    return false
  } catch (error) {
    console.error('刷新令牌失败:', error)
    return false
  }
}

/**
 * 处理token过期
 * 尝试刷新token，失败则清理认证数据并跳转登录
 */
export async function handleTokenExpired(): Promise<void> {
  const refreshSuccess = await refreshToken()
  
  if (!refreshSuccess) {
    await handleAuthFailure()
  }
}