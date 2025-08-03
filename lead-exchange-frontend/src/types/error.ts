/**
 * 错误处理相关类型定义
 * 统一管理应用中的错误类型和处理接口
 */

// 错误类型枚举
export enum ErrorType {
  // 网络错误
  NETWORK_ERROR = 'NETWORK_ERROR',
  // 认证错误
  AUTH_ERROR = 'AUTH_ERROR', 
  // 业务错误
  BUSINESS_ERROR = 'BUSINESS_ERROR',
  // 服务器错误
  SERVER_ERROR = 'SERVER_ERROR',
  // 参数验证错误
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  // 未知错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 错误严重级别
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning', 
  ERROR = 'error',
  CRITICAL = 'critical'
}

// 错误信息接口
export interface ErrorInfo {
  // 错误类型
  type: ErrorType
  // 错误代码
  code: number | string
  // 错误消息
  message: string
  // 错误严重级别
  level: ErrorLevel
  // 额外数据
  data?: any
  // 错误堆栈
  stack?: string
  // 时间戳
  timestamp?: number
  // 请求URL
  url?: string
  // 请求方法
  method?: string
}

// 错误处理配置接口
export interface ErrorConfig {
  // 是否显示错误提示
  showMessage?: boolean
  // 是否记录错误日志
  logError?: boolean
  // 是否上报错误
  reportError?: boolean
  // 自定义错误消息
  customMessage?: string
  // 重试次数
  retryCount?: number
  // 重试延迟（毫秒）
  retryDelay?: number
  // 是否自动重试
  autoRetry?: boolean
}

// 错误处理器接口
export interface IErrorHandler {
  // 处理错误
  handle(error: ErrorInfo, config?: ErrorConfig): Promise<void> | void
  // 是否可以处理该错误
  canHandle(error: ErrorInfo): boolean
  // 处理器优先级
  priority: number
}

// 错误处理结果
export interface ErrorHandleResult {
  // 是否已处理
  handled: boolean
  // 是否需要重试
  shouldRetry: boolean
  // 重试延迟
  retryDelay?: number
  // 处理消息
  message?: string
}

// HTTP错误状态码映射
export const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '拒绝访问，权限不足',
  404: '请求的资源不存在',
  408: '请求超时',
  422: '请求参数验证失败',
  429: '请求过于频繁，请稍后再试',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
}

// 业务错误代码映射
export const BUSINESS_ERROR_MESSAGES: Record<string | number, string> = {
  'TOKEN_EXPIRED': '登录已过期，请重新登录',
  'INVALID_TOKEN': '无效的访问令牌',
  'PERMISSION_DENIED': '权限不足，无法访问',
  'RESOURCE_NOT_FOUND': '请求的资源不存在',
  'VALIDATION_FAILED': '数据验证失败',
  'OPERATION_FAILED': '操作失败，请稍后重试'
}