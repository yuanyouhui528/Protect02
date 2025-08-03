/**
 * 路由相关类型定义
 * 扩展Vue Router的meta类型，支持角色和权限配置
 */

import 'vue-router'

// 扩展Vue Router的RouteMeta接口
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 页面标题
     */
    title?: string
    
    /**
     * 是否需要认证
     */
    requiresAuth?: boolean
    
    /**
     * 需要的角色列表（用户必须拥有其中任一角色）
     */
    roles?: string[]
    
    /**
     * 需要的权限列表（用户必须拥有其中任一权限）
     */
    permissions?: string[]
    
    /**
     * 页面图标
     */
    icon?: string
    
    /**
     * 是否在菜单中隐藏
     */
    hidden?: boolean
    
    /**
     * 是否缓存页面
     */
    keepAlive?: boolean
    
    /**
     * 面包屑导航
     */
    breadcrumb?: boolean
    
    /**
     * 页面描述
     */
    description?: string
    
    /**
     * 页面关键词（用于SEO）
     */
    keywords?: string
    
    /**
     * 自定义样式类名
     */
    className?: string
    
    /**
     * 页面级别的加载状态
     */
    loading?: boolean
    
    /**
     * 页面访问级别（public: 公开, protected: 需要登录, private: 需要特定权限）
     */
    accessLevel?: 'public' | 'protected' | 'private'
    
    /**
     * 页面排序权重（用于菜单排序）
     */
    order?: number
    
    /**
     * 外部链接地址
     */
    externalLink?: string
    
    /**
     * 是否在新窗口打开
     */
    target?: '_blank' | '_self' | '_parent' | '_top'
    
    /**
     * 页面布局类型
     */
    layout?: 'default' | 'blank' | 'auth'
    
    /**
     * 页面过渡动画
     */
    transition?: string
    
    /**
     * 是否显示页面头部
     */
    showHeader?: boolean
    
    /**
     * 是否显示侧边栏
     */
    showSidebar?: boolean
    
    /**
     * 是否显示页脚
     */
    showFooter?: boolean
    
    /**
     * 页面特殊标记
     */
    tags?: string[]
    
    /**
     * 页面元数据（用于扩展）
     */
    metadata?: Record<string, any>
  }
}

/**
 * 路由权限配置接口
 */
export interface RoutePermissionConfig {
  /**
   * 路由路径
   */
  path: string
  
  /**
   * 需要的角色
   */
  roles?: string[]
  
  /**
   * 需要的权限
   */
  permissions?: string[]
  
  /**
   * 访问级别
   */
  accessLevel: 'public' | 'protected' | 'private'
  
  /**
   * 是否启用权限检查
   */
  enabled: boolean
}

/**
 * 路由守卫配置接口
 */
export interface RouteGuardConfig {
  /**
   * 是否启用认证检查
   */
  enableAuth: boolean
  
  /**
   * 是否启用权限检查
   */
  enablePermission: boolean
  
  /**
   * 是否启用角色检查
   */
  enableRole: boolean
  
  /**
   * 默认重定向路径
   */
  defaultRedirect: string
  
  /**
   * 登录页面路径
   */
  loginPath: string
  
  /**
   * 无权限页面路径
   */
  noPermissionPath: string
  
  /**
   * 是否记录访问日志
   */
  enableAccessLog: boolean
}

/**
 * 路由访问日志接口
 */
export interface RouteAccessLog {
  /**
   * 用户ID
   */
  userId?: string
  
  /**
   * 访问路径
   */
  path: string
  
  /**
   * 访问时间
   */
  timestamp: number
  
  /**
   * 访问结果
   */
  result: 'success' | 'denied' | 'error'
  
  /**
   * 错误信息
   */
  error?: string
  
  /**
   * 用户代理
   */
  userAgent?: string
  
  /**
   * IP地址
   */
  ip?: string
}

/**
 * 预定义的角色常量
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest'
} as const

/**
 * 预定义的权限常量
 */
export const PERMISSIONS = {
  // 线索管理权限
  LEAD_READ: 'lead:read',
  LEAD_WRITE: 'lead:write',
  LEAD_DELETE: 'lead:delete',
  LEAD_EXPORT: 'lead:export',
  
  // 交换管理权限
  EXCHANGE_READ: 'exchange:read',
  EXCHANGE_WRITE: 'exchange:write',
  EXCHANGE_APPROVE: 'exchange:approve',
  
  // 用户管理权限
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',
  
  // 系统管理权限
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_LOG: 'system:log',
  SYSTEM_MONITOR: 'system:monitor',
  
  // 数据分析权限
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_EXPORT: 'analytics:export'
} as const

/**
 * 角色类型
 */
export type RoleType = typeof ROLES[keyof typeof ROLES]

/**
 * 权限类型
 */
export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS]