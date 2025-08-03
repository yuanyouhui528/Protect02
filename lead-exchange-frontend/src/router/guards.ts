/**
 * 路由守卫配置和工具函数
 * 提供集中的路由安全配置管理
 */

import type { RouteGuardConfig, RouteAccessLog } from '@/types/router'
import { useAuth } from '@/composables/useAuth'
import { tokenValidator } from '@/utils/tokenValidator'
import { secureStorage } from '@/utils/secureStorage'

/**
 * 路由守卫配置
 */
export const routeGuardConfig: RouteGuardConfig = {
  enableAuth: true,
  enablePermission: true,
  enableRole: true,
  defaultRedirect: '/home',
  loginPath: '/auth/login',
  noPermissionPath: '/403',
  enableAccessLog: true
}

/**
 * 路由访问日志记录器
 */
class RouteAccessLogger {
  private logs: RouteAccessLog[] = []
  private readonly MAX_LOGS = 1000 // 最大日志条数

  /**
   * 记录访问日志
   * @param log 访问日志信息
   */
  public log(log: RouteAccessLog): void {
    if (!routeGuardConfig.enableAccessLog) {
      return
    }

    this.logs.push({
      ...log,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    })

    // 保持日志数量在限制范围内
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS)
    }

    // 在开发环境下打印日志
    if (import.meta.env.DEV) {
      console.log('🛡️ 路由访问日志:', log)
    }
  }

  /**
   * 获取访问日志
   * @param limit 限制条数
   */
  public getLogs(limit?: number): RouteAccessLog[] {
    return limit ? this.logs.slice(-limit) : [...this.logs]
  }

  /**
   * 清空日志
   */
  public clearLogs(): void {
    this.logs = []
  }

  /**
   * 导出日志（用于调试）
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// 导出日志记录器实例
export const routeLogger = new RouteAccessLogger()

/**
 * 路由守卫工具类
 */
export class RouteGuardUtils {
  /**
   * 检查路由是否需要认证
   * @param requiresAuth 路由meta中的requiresAuth字段
   */
  static requiresAuthentication(requiresAuth?: boolean): boolean {
    return requiresAuth === true
  }

  /**
   * 检查路由是否需要特定角色
   * @param roles 路由meta中的roles字段
   */
  static requiresRoles(roles?: string[]): boolean {
    return Array.isArray(roles) && roles.length > 0
  }

  /**
   * 检查路由是否需要特定权限
   * @param permissions 路由meta中的permissions字段
   */
  static requiresPermissions(permissions?: string[]): boolean {
    return Array.isArray(permissions) && permissions.length > 0
  }

  /**
   * 获取用户当前token信息（用于调试）
   */
  static async getTokenInfo(): Promise<object | null> {
    try {
      const token = await secureStorage.getItem<string>('access_token')
      if (!token) {
        return null
      }
      return tokenValidator.getTokenInfo(token)
    } catch (error) {
      console.error('获取token信息失败:', error)
      return null
    }
  }

  /**
   * 生成重定向URL
   * @param targetPath 目标路径
   * @param currentPath 当前路径
   * @param error 错误信息
   */
  static generateRedirectUrl(targetPath: string, currentPath?: string, error?: string): object {
    const query: Record<string, string> = {}
    
    if (currentPath) {
      query.redirect = currentPath
    }
    
    if (error) {
      query.error = error
    }

    return {
      path: targetPath,
      query: Object.keys(query).length > 0 ? query : undefined
    }
  }

  /**
   * 记录认证失败日志
   * @param path 访问路径
   * @param reason 失败原因
   * @param userId 用户ID（可选）
   */
  static logAuthFailure(path: string, reason: string, userId?: string): void {
    routeLogger.log({
      userId,
      path,
      result: 'denied',
      error: reason,
      timestamp: Date.now()
    })
  }

  /**
   * 记录访问成功日志
   * @param path 访问路径
   * @param userId 用户ID（可选）
   */
  static logAccessSuccess(path: string, userId?: string): void {
    routeLogger.log({
      userId,
      path,
      result: 'success',
      timestamp: Date.now()
    })
  }

  /**
   * 记录访问错误日志
   * @param path 访问路径
   * @param error 错误信息
   * @param userId 用户ID（可选）
   */
  static logAccessError(path: string, error: string, userId?: string): void {
    routeLogger.log({
      userId,
      path,
      result: 'error',
      error,
      timestamp: Date.now()
    })
  }
}

/**
 * 路由守卫错误处理器
 */
export class RouteGuardErrorHandler {
  /**
   * 处理认证错误
   * @param error 错误信息
   * @param path 当前路径
   */
  static handleAuthError(error: string, path: string): object {
    console.error('🚫 认证错误:', error, '路径:', path)
    
    RouteGuardUtils.logAuthFailure(path, error)
    
    return RouteGuardUtils.generateRedirectUrl(
      routeGuardConfig.loginPath,
      path,
      'auth_error'
    )
  }

  /**
   * 处理权限错误
   * @param error 错误信息
   * @param path 当前路径
   * @param userId 用户ID
   */
  static handlePermissionError(error: string, path: string, userId?: string): object {
    console.error('🚫 权限错误:', error, '路径:', path, '用户:', userId)
    
    RouteGuardUtils.logAuthFailure(path, error, userId)
    
    return RouteGuardUtils.generateRedirectUrl(
      routeGuardConfig.defaultRedirect,
      undefined,
      'insufficient_permissions'
    )
  }

  /**
   * 处理系统错误
   * @param error 错误信息
   * @param path 当前路径
   * @param userId 用户ID
   */
  static handleSystemError(error: string, path: string, userId?: string): object {
    console.error('💥 系统错误:', error, '路径:', path, '用户:', userId)
    
    RouteGuardUtils.logAccessError(path, error, userId)
    
    return RouteGuardUtils.generateRedirectUrl(
      routeGuardConfig.loginPath,
      path,
      'system_error'
    )
  }
}

/**
 * 路由守卫性能监控
 */
export class RouteGuardPerformanceMonitor {
  private static timers: Map<string, number> = new Map()

  /**
   * 开始计时
   * @param key 计时键
   */
  static startTimer(key: string): void {
    this.timers.set(key, performance.now())
  }

  /**
   * 结束计时并记录
   * @param key 计时键
   * @param path 路径
   */
  static endTimer(key: string, path: string): void {
    const startTime = this.timers.get(key)
    if (startTime) {
      const duration = performance.now() - startTime
      this.timers.delete(key)
      
      if (import.meta.env.DEV) {
        console.log(`⏱️ 路由守卫执行时间 [${path}]: ${duration.toFixed(2)}ms`)
      }
      
      // 如果执行时间过长，记录警告
      if (duration > 1000) {
        console.warn(`⚠️ 路由守卫执行时间过长 [${path}]: ${duration.toFixed(2)}ms`)
      }
    }
  }

  /**
   * 清理所有计时器
   */
  static clearTimers(): void {
    this.timers.clear()
  }
}

/**
 * 导出路由守卫配置和工具
 */
export {
  routeGuardConfig as config,
  RouteGuardUtils as utils,
  RouteGuardErrorHandler as errorHandler,
  RouteGuardPerformanceMonitor as performanceMonitor
}