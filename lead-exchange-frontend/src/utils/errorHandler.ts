/**
 * 统一错误处理器
 * 提供统一的错误处理策略和可扩展的错误处理机制
 */

import { ElMessage, ElNotification } from 'element-plus'
import type { AxiosError } from 'axios'
import {
  ErrorType,
  ErrorLevel,
  type ErrorInfo,
  type ErrorConfig,
  type IErrorHandler,
  type ErrorHandleResult,
  HTTP_ERROR_MESSAGES,
  BUSINESS_ERROR_MESSAGES
} from '@/types/error'
import { handleAuthFailure, handleTokenExpired } from './authUtils'
import { isDev } from './env'

/**
 * 默认错误处理配置
 */
const DEFAULT_ERROR_CONFIG: ErrorConfig = {
  showMessage: true,
  logError: true,
  reportError: false,
  retryCount: 0,
  retryDelay: 1000,
  autoRetry: false
}

/**
 * 认证错误处理器
 */
class AuthErrorHandler implements IErrorHandler {
  priority = 100

  canHandle(error: ErrorInfo): boolean {
    return error.type === ErrorType.AUTH_ERROR || 
           error.code === 401 || 
           error.code === 'TOKEN_EXPIRED' ||
           error.code === 'INVALID_TOKEN'
  }

  async handle(error: ErrorInfo, config?: ErrorConfig): Promise<void> {
    const mergedConfig = { ...DEFAULT_ERROR_CONFIG, ...config }
    
    if (mergedConfig.logError) {
      console.error('认证错误:', error)
    }

    // 显示错误消息
    if (mergedConfig.showMessage) {
      const message = mergedConfig.customMessage || error.message || '登录已过期，请重新登录'
      ElMessage.error(message)
    }

    // 处理token过期
    if (error.code === 'TOKEN_EXPIRED') {
      await handleTokenExpired()
    } else {
      // 其他认证错误直接跳转登录
      await handleAuthFailure()
    }

    // 错误上报
    if (mergedConfig.reportError) {
      this.reportError(error)
    }
  }

  private reportError(error: ErrorInfo): void {
    // TODO: 实现错误上报逻辑
    console.log('上报认证错误:', error)
  }
}

/**
 * 网络错误处理器
 */
class NetworkErrorHandler implements IErrorHandler {
  priority = 90

  canHandle(error: ErrorInfo): boolean {
    return error.type === ErrorType.NETWORK_ERROR
  }

  async handle(error: ErrorInfo, config?: ErrorConfig): Promise<void> {
    const mergedConfig = { ...DEFAULT_ERROR_CONFIG, ...config }
    
    if (mergedConfig.logError) {
      console.error('网络错误:', error)
    }

    if (mergedConfig.showMessage) {
      const message = mergedConfig.customMessage || '网络连接失败，请检查网络设置'
      ElMessage.error(message)
    }

    if (mergedConfig.reportError) {
      this.reportError(error)
    }
  }

  private reportError(error: ErrorInfo): void {
    // TODO: 实现错误上报逻辑
    console.log('上报网络错误:', error)
  }
}

/**
 * 服务器错误处理器
 */
class ServerErrorHandler implements IErrorHandler {
  priority = 80

  canHandle(error: ErrorInfo): boolean {
    return error.type === ErrorType.SERVER_ERROR ||
           (typeof error.code === 'number' && error.code >= 500)
  }

  async handle(error: ErrorInfo, config?: ErrorConfig): Promise<void> {
    const mergedConfig = { ...DEFAULT_ERROR_CONFIG, ...config }
    
    if (mergedConfig.logError) {
      console.error('服务器错误:', error)
    }

    if (mergedConfig.showMessage) {
      const message = mergedConfig.customMessage || 
                     HTTP_ERROR_MESSAGES[error.code as number] || 
                     '服务器错误，请稍后重试'
      
      // 服务器错误使用通知形式，更显眼
      ElNotification.error({
        title: '服务器错误',
        message,
        duration: 5000
      })
    }

    if (mergedConfig.reportError) {
      this.reportError(error)
    }
  }

  private reportError(error: ErrorInfo): void {
    // TODO: 实现错误上报逻辑
    console.log('上报服务器错误:', error)
  }
}

/**
 * 业务错误处理器
 */
class BusinessErrorHandler implements IErrorHandler {
  priority = 70

  canHandle(error: ErrorInfo): boolean {
    return error.type === ErrorType.BUSINESS_ERROR
  }

  async handle(error: ErrorInfo, config?: ErrorConfig): Promise<void> {
    const mergedConfig = { ...DEFAULT_ERROR_CONFIG, ...config }
    
    if (mergedConfig.logError) {
      console.error('业务错误:', error)
    }

    if (mergedConfig.showMessage) {
      const message = mergedConfig.customMessage || 
                     BUSINESS_ERROR_MESSAGES[error.code] || 
                     error.message || 
                     '操作失败，请稍后重试'
      ElMessage.error(message)
    }

    if (mergedConfig.reportError) {
      this.reportError(error)
    }
  }

  private reportError(error: ErrorInfo): void {
    // TODO: 实现错误上报逻辑
    console.log('上报业务错误:', error)
  }
}

/**
 * 参数验证错误处理器
 */
class ValidationErrorHandler implements IErrorHandler {
  priority = 60

  canHandle(error: ErrorInfo): boolean {
    return error.type === ErrorType.VALIDATION_ERROR ||
           error.code === 400 ||
           error.code === 422
  }

  async handle(error: ErrorInfo, config?: ErrorConfig): Promise<void> {
    const mergedConfig = { ...DEFAULT_ERROR_CONFIG, ...config }
    
    if (mergedConfig.logError) {
      console.error('参数验证错误:', error)
    }

    if (mergedConfig.showMessage) {
      const message = mergedConfig.customMessage || 
                     error.message || 
                     '请求参数错误，请检查输入'
      ElMessage.warning(message)
    }

    if (mergedConfig.reportError) {
      this.reportError(error)
    }
  }

  private reportError(error: ErrorInfo): void {
    // TODO: 实现错误上报逻辑
    console.log('上报参数验证错误:', error)
  }
}

/**
 * 默认错误处理器
 */
class DefaultErrorHandler implements IErrorHandler {
  priority = 0

  canHandle(): boolean {
    return true // 默认处理器处理所有错误
  }

  async handle(error: ErrorInfo, config?: ErrorConfig): Promise<void> {
    const mergedConfig = { ...DEFAULT_ERROR_CONFIG, ...config }
    
    if (mergedConfig.logError) {
      console.error('未知错误:', error)
    }

    if (mergedConfig.showMessage) {
      const message = mergedConfig.customMessage || 
                     error.message || 
                     '操作失败，请稍后重试'
      ElMessage.error(message)
    }

    if (mergedConfig.reportError) {
      this.reportError(error)
    }
  }

  private reportError(error: ErrorInfo): void {
    // TODO: 实现错误上报逻辑
    console.log('上报未知错误:', error)
  }
}

/**
 * 错误处理管理器
 */
class ErrorHandlerManager {
  private handlers: IErrorHandler[] = []

  constructor() {
    // 注册默认错误处理器
    this.registerHandler(new AuthErrorHandler())
    this.registerHandler(new NetworkErrorHandler())
    this.registerHandler(new ServerErrorHandler())
    this.registerHandler(new BusinessErrorHandler())
    this.registerHandler(new ValidationErrorHandler())
    this.registerHandler(new DefaultErrorHandler())
  }

  /**
   * 注册错误处理器
   */
  registerHandler(handler: IErrorHandler): void {
    this.handlers.push(handler)
    // 按优先级排序
    this.handlers.sort((a, b) => b.priority - a.priority)
  }

  /**
   * 处理错误
   */
  async handleError(error: ErrorInfo, config?: ErrorConfig): Promise<ErrorHandleResult> {
    for (const handler of this.handlers) {
      if (handler.canHandle(error)) {
        try {
          await handler.handle(error, config)
          return {
            handled: true,
            shouldRetry: false
          }
        } catch (handlerError) {
          console.error('错误处理器执行失败:', handlerError)
        }
      }
    }

    return {
      handled: false,
      shouldRetry: false
    }
  }
}

// 创建全局错误处理管理器实例
const errorHandlerManager = new ErrorHandlerManager()

/**
 * 从Axios错误创建ErrorInfo
 */
export function createErrorInfoFromAxiosError(axiosError: AxiosError): ErrorInfo {
  const { response, request, message, code } = axiosError
  
  let errorType: ErrorType
  let errorCode: number | string
  let errorMessage: string
  let errorLevel: ErrorLevel

  if (!response && !request) {
    // 请求配置错误
    errorType = ErrorType.VALIDATION_ERROR
    errorCode = code || 'CONFIG_ERROR'
    errorMessage = message || '请求配置错误'
    errorLevel = ErrorLevel.ERROR
  } else if (!response) {
    // 网络错误
    errorType = ErrorType.NETWORK_ERROR
    errorCode = code || 'NETWORK_ERROR'
    errorMessage = '网络连接失败，请检查网络设置'
    errorLevel = ErrorLevel.ERROR
  } else {
    // HTTP错误
    const { status, data } = response
    errorCode = status
    
    if (status === 401) {
      errorType = ErrorType.AUTH_ERROR
      errorMessage = '未授权，请重新登录'
      errorLevel = ErrorLevel.WARNING
    } else if (status >= 400 && status < 500) {
      errorType = status === 422 ? ErrorType.VALIDATION_ERROR : ErrorType.BUSINESS_ERROR
      errorMessage = HTTP_ERROR_MESSAGES[status] || (data as any)?.message || message
      errorLevel = ErrorLevel.WARNING
    } else if (status >= 500) {
      errorType = ErrorType.SERVER_ERROR
      errorMessage = HTTP_ERROR_MESSAGES[status] || '服务器错误'
      errorLevel = ErrorLevel.ERROR
    } else {
      errorType = ErrorType.UNKNOWN_ERROR
      errorMessage = message || '未知错误'
      errorLevel = ErrorLevel.ERROR
    }
  }

  return {
    type: errorType,
    code: errorCode,
    message: errorMessage,
    level: errorLevel,
    data: response?.data,
    stack: axiosError.stack,
    timestamp: Date.now(),
    url: response?.config?.url || request?.responseURL,
    method: response?.config?.method?.toUpperCase() || 'UNKNOWN'
  }
}

/**
 * 处理错误的统一入口
 */
export async function processError(
  error: AxiosError | ErrorInfo, 
  config?: ErrorConfig
): Promise<ErrorHandleResult> {
  let errorInfo: ErrorInfo
  
  if ('isAxiosError' in error) {
    errorInfo = createErrorInfoFromAxiosError(error as AxiosError)
  } else {
    errorInfo = error as ErrorInfo
  }

  // 在开发环境输出详细错误信息
  if (isDev) {
    console.group('🚨 错误详情')
    console.error('错误类型:', errorInfo.type)
    console.error('错误代码:', errorInfo.code)
    console.error('错误消息:', errorInfo.message)
    console.error('请求URL:', errorInfo.url)
    console.error('请求方法:', errorInfo.method)
    console.error('错误数据:', errorInfo.data)
    console.error('错误堆栈:', errorInfo.stack)
    console.groupEnd()
  }

  return await errorHandlerManager.handleError(errorInfo, config)
}

/**
 * 注册自定义错误处理器
 */
export function registerErrorHandler(handler: IErrorHandler): void {
  errorHandlerManager.registerHandler(handler)
}

export { ErrorHandlerManager }