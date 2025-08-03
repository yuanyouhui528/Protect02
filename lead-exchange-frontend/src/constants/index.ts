// 常量定义入口文件
// 导出项目中使用的所有常量

import { envConfig } from '@/utils/env'

// ==================== API相关常量 ====================

/**
 * API基础路径
 */
export const API_BASE_URL = envConfig.api.baseURL

/**
 * API版本
 */
export const API_VERSION = 'v1'

/**
 * 完整API路径
 */
export const API_URL = `${API_BASE_URL}/${API_VERSION}`

/**
 * 请求超时时间（毫秒）
 */
export const REQUEST_TIMEOUT = envConfig.api.timeout

/**
 * 应用信息
 */
export const APP_NAME = envConfig.app.title
export const APP_VERSION = envConfig.app.version
export const APP_DESCRIPTION = envConfig.app.description

/**
 * 功能开关
 */
export const FEATURES = envConfig.features

/**
 * 文件上传配置
 */
export const UPLOAD_CONFIG = envConfig.upload

/**
 * 分页配置
 */
export const PAGINATION_CONFIG = envConfig.pagination

/**
 * 缓存配置
 */
export const CACHE_CONFIG = envConfig.cache

/**
 * 安全配置
 */
export const SECURITY_CONFIG = envConfig.security

/**
 * 文件上传大小限制（字节）
 */
export const UPLOAD_FILE_SIZE_LIMIT = 10 * 1024 * 1024 // 10MB

/**
 * 支持的文件类型
 */
export const SUPPORTED_FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
}

// ==================== 存储相关常量 ====================

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  LANGUAGE: 'language',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  TABLE_SETTINGS: 'table_settings',
  RECENT_SEARCHES: 'recent_searches',
} as const

/**
 * 会话存储键名
 */
export const SESSION_KEYS = {
  FORM_DATA: 'form_data',
  SEARCH_PARAMS: 'search_params',
  SCROLL_POSITION: 'scroll_position',
} as const

// ==================== 路由相关常量 ====================

/**
 * 路由路径
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  LEADS: '/leads',
  LEAD_DETAIL: '/leads/:id',
  EXCHANGE: '/exchange',
  ANALYTICS: '/analytics',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
} as const

/**
 * 不需要认证的路由
 */
export const PUBLIC_ROUTES: string[] = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.NOT_FOUND]

// ==================== 业务相关常量 ====================

/**
 * 线索状态
 */
export const LEAD_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXCHANGING: 'EXCHANGING',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
} as const

/**
 * 线索状态标签
 */
export const LEAD_STATUS_LABELS = {
  [LEAD_STATUS.DRAFT]: '草稿',
  [LEAD_STATUS.PENDING]: '待审核',
  [LEAD_STATUS.APPROVED]: '已通过',
  [LEAD_STATUS.REJECTED]: '已拒绝',
  [LEAD_STATUS.EXCHANGING]: '交换中',
  [LEAD_STATUS.COMPLETED]: '已完成',
  [LEAD_STATUS.ARCHIVED]: '已归档',
} as const

/**
 * 线索状态颜色
 */
export const LEAD_STATUS_COLORS = {
  [LEAD_STATUS.DRAFT]: '#909399',
  [LEAD_STATUS.PENDING]: '#e6a23c',
  [LEAD_STATUS.APPROVED]: '#67c23a',
  [LEAD_STATUS.REJECTED]: '#f56c6c',
  [LEAD_STATUS.EXCHANGING]: '#409eff',
  [LEAD_STATUS.COMPLETED]: '#67c23a',
  [LEAD_STATUS.ARCHIVED]: '#c0c4cc',
} as const

/**
 * 线索评级
 */
export const LEAD_RATING = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
} as const

/**
 * 线索评级标签
 */
export const LEAD_RATING_LABELS = {
  [LEAD_RATING.A]: 'A级（优质）',
  [LEAD_RATING.B]: 'B级（良好）',
  [LEAD_RATING.C]: 'C级（一般）',
  [LEAD_RATING.D]: 'D级（基础）',
} as const

/**
 * 线索评级颜色
 */
export const LEAD_RATING_COLORS = {
  [LEAD_RATING.A]: '#f56c6c',
  [LEAD_RATING.B]: '#e6a23c',
  [LEAD_RATING.C]: '#409eff',
  [LEAD_RATING.D]: '#67c23a',
} as const

/**
 * 线索评级分值
 */
export const LEAD_RATING_SCORES = {
  [LEAD_RATING.A]: 8,
  [LEAD_RATING.B]: 4,
  [LEAD_RATING.C]: 2,
  [LEAD_RATING.D]: 1,
} as const

/**
 * 交换状态
 */
export const EXCHANGE_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

/**
 * 交换状态标签
 */
export const EXCHANGE_STATUS_LABELS = {
  [EXCHANGE_STATUS.PENDING]: '待处理',
  [EXCHANGE_STATUS.ACCEPTED]: '已接受',
  [EXCHANGE_STATUS.REJECTED]: '已拒绝',
  [EXCHANGE_STATUS.COMPLETED]: '已完成',
  [EXCHANGE_STATUS.CANCELLED]: '已取消',
} as const

/**
 * 用户状态
 */
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  LOCKED: 'LOCKED',
  PENDING: 'PENDING',
} as const

/**
 * 通知类型
 */
export const NOTIFICATION_TYPE = {
  SYSTEM: 'SYSTEM',
  EXCHANGE: 'EXCHANGE',
  LEAD: 'LEAD',
  USER: 'USER',
} as const

/**
 * 通知类型标签
 */
export const NOTIFICATION_TYPE_LABELS = {
  [NOTIFICATION_TYPE.SYSTEM]: '系统通知',
  [NOTIFICATION_TYPE.EXCHANGE]: '交换通知',
  [NOTIFICATION_TYPE.LEAD]: '线索通知',
  [NOTIFICATION_TYPE.USER]: '用户通知',
} as const

// ==================== UI相关常量 ====================

/**
 * 分页配置
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 20,
  SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_SIZE: 100,
} as const

/**
 * 表格配置
 */
export const TABLE = {
  DEFAULT_HEIGHT: 400,
  ROW_HEIGHT: 48,
  HEADER_HEIGHT: 56,
} as const

/**
 * 主题配置
 */
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const

/**
 * 语言配置
 */
export const LANGUAGE = {
  ZH_CN: 'zh-cn',
  EN: 'en',
} as const

/**
 * 语言标签
 */
export const LANGUAGE_LABELS = {
  [LANGUAGE.ZH_CN]: '简体中文',
  [LANGUAGE.EN]: 'English',
} as const

// ==================== 正则表达式常量 ====================

/**
 * 常用正则表达式
 */
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  IP: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  CHINESE: /[\u4e00-\u9fa5]/,
  NUMBER: /^\d+$/,
  DECIMAL: /^\d+(\.\d+)?$/,
} as const

// ==================== 错误码常量 ====================

/**
 * HTTP状态码
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

/**
 * 业务错误码
 */
export const ERROR_CODE = {
  SUCCESS: 0,
  UNKNOWN_ERROR: 1000,
  VALIDATION_ERROR: 1001,
  AUTHENTICATION_ERROR: 1002,
  AUTHORIZATION_ERROR: 1003,
  RESOURCE_NOT_FOUND: 1004,
  RESOURCE_CONFLICT: 1005,
  RATE_LIMIT_EXCEEDED: 1006,
  SERVICE_UNAVAILABLE: 1007,
} as const

// ==================== 时间相关常量 ====================

/**
 * 时间格式
 */
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIMESTAMP: 'YYYY-MM-DD HH:mm:ss.SSS',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
} as const

/**
 * 时间间隔（毫秒）
 */
export const TIME_INTERVAL = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const
