/**
 * 错误处理配置
 * 提供可配置的错误处理选项和环境相关的错误处理策略
 */

import type { ErrorConfig } from '@/types/error'
import { envConfig, isDev, isProd, isTest } from './env'

/**
 * 开发环境错误处理配置
 */
const DEV_ERROR_CONFIG: ErrorConfig = {
  showMessage: true,
  logError: true,
  reportError: false, // 开发环境不上报错误
  retryCount: 0,
  retryDelay: 1000,
  autoRetry: false
}

/**
 * 生产环境错误处理配置
 */
const PROD_ERROR_CONFIG: ErrorConfig = {
  showMessage: true,
  logError: false, // 生产环境不在控制台输出错误日志
  reportError: true, // 生产环境上报错误
  retryCount: 1, // 生产环境支持重试
  retryDelay: 2000,
  autoRetry: false
}

/**
 * 测试环境错误处理配置
 */
const TEST_ERROR_CONFIG: ErrorConfig = {
  showMessage: false, // 测试环境不显示错误消息
  logError: true,
  reportError: false,
  retryCount: 0,
  retryDelay: 1000,
  autoRetry: false
}

/**
 * 获取当前环境的错误处理配置
 */
export function getErrorConfig(): ErrorConfig {
  if (isDev) {
    return DEV_ERROR_CONFIG
  } else if (isTest) {
    return TEST_ERROR_CONFIG
  } else {
    return PROD_ERROR_CONFIG
  }
}

/**
 * 特定错误类型的配置
 */
export const ERROR_TYPE_CONFIGS = {
  // 认证错误配置
  AUTH_ERROR: {
    showMessage: true,
    logError: true,
    reportError: !isDev,
    customMessage: '登录已过期，请重新登录'
  },
  
  // 网络错误配置
  NETWORK_ERROR: {
    showMessage: true,
    logError: true,
    reportError: !isDev,
    retryCount: 2,
    retryDelay: 3000,
    autoRetry: true,
    customMessage: '网络连接失败，请检查网络设置'
  },
  
  // 服务器错误配置
  SERVER_ERROR: {
    showMessage: true,
    logError: true,
    reportError: !isDev,
    retryCount: 1,
    retryDelay: 5000,
    autoRetry: false
  },
  
  // 业务错误配置
  BUSINESS_ERROR: {
    showMessage: true,
    logError: isDev,
    reportError: !isDev,
    retryCount: 0,
    autoRetry: false
  },
  
  // 参数验证错误配置
  VALIDATION_ERROR: {
    showMessage: true,
    logError: isDev,
    reportError: false,
    retryCount: 0,
    autoRetry: false
  }
} as const

/**
 * 错误消息国际化配置
 */
export const ERROR_MESSAGES_I18N = {
  'zh-CN': {
    NETWORK_ERROR: '网络连接失败，请检查网络设置',
    AUTH_ERROR: '登录已过期，请重新登录',
    SERVER_ERROR: '服务器错误，请稍后重试',
    BUSINESS_ERROR: '操作失败，请稍后重试',
    VALIDATION_ERROR: '请求参数错误，请检查输入',
    UNKNOWN_ERROR: '未知错误，请稍后重试',
    RETRY_BUTTON: '重试',
    REFRESH_BUTTON: '刷新页面',
    CONTACT_SUPPORT: '联系技术支持'
  },
  'en-US': {
    NETWORK_ERROR: 'Network connection failed, please check your network settings',
    AUTH_ERROR: 'Login expired, please log in again',
    SERVER_ERROR: 'Server error, please try again later',
    BUSINESS_ERROR: 'Operation failed, please try again later',
    VALIDATION_ERROR: 'Request parameter error, please check your input',
    UNKNOWN_ERROR: 'Unknown error, please try again later',
    RETRY_BUTTON: 'Retry',
    REFRESH_BUTTON: 'Refresh Page',
    CONTACT_SUPPORT: 'Contact Support'
  }
} as const

/**
 * 获取错误消息
 * @param errorType 错误类型
 * @param locale 语言环境，默认为中文
 */
export function getErrorMessage(
  errorType: keyof typeof ERROR_MESSAGES_I18N['zh-CN'],
  locale: 'zh-CN' | 'en-US' = 'zh-CN'
): string {
  return ERROR_MESSAGES_I18N[locale][errorType] || ERROR_MESSAGES_I18N['zh-CN'][errorType]
}

/**
 * 错误上报配置
 */
export const ERROR_REPORT_CONFIG = {
  // 上报URL
  reportUrl: envConfig.api.baseURL + '/api/errors/report',
  
  // 批量上报配置
  batchSize: 10, // 批量上报数量
  batchTimeout: 30000, // 批量上报超时时间（毫秒）
  
  // 上报频率限制
  maxReportsPerMinute: 20, // 每分钟最大上报次数
  
  // 需要上报的错误级别
  reportLevels: ['error', 'critical'],
  
  // 需要上报的错误类型
  reportTypes: ['SERVER_ERROR', 'NETWORK_ERROR', 'AUTH_ERROR'],
  
  // 上报的额外信息
  extraInfo: {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: Date.now(),
    version: envConfig.app.version
  }
}

/**
 * 错误重试配置
 */
export const ERROR_RETRY_CONFIG = {
  // 支持重试的错误类型
  retryableErrors: ['NETWORK_ERROR', 'SERVER_ERROR'],
  
  // 重试策略
  retryStrategies: {
    NETWORK_ERROR: {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffFactor: 2 // 指数退避
    },
    SERVER_ERROR: {
      maxRetries: 2,
      baseDelay: 2000,
      maxDelay: 8000,
      backoffFactor: 1.5
    }
  },
  
  // 重试条件判断
  shouldRetry: (error: any, retryCount: number): boolean => {
    // 超过最大重试次数
    if (retryCount >= 3) return false
    
    // 特定状态码不重试
    const nonRetryableStatus = [400, 401, 403, 404, 422]
    if (error.code && nonRetryableStatus.includes(error.code)) {
      return false
    }
    
    return true
  }
}