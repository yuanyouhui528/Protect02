// TypeScript类型定义入口文件
// 导出项目中使用的所有类型定义

// ==================== 基础类型 ====================

/**
 * API响应基础结构
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  timestamp: number
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page: number
  size: number
  sort?: string
  order?: 'asc' | 'desc'
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

/**
 * 基础实体接口
 */
export interface BaseEntity {
  id: number
  createTime: string
  updateTime: string
  createBy?: string
  updateBy?: string
}

// ==================== 用户相关类型 ====================

/**
 * 用户信息
 */
export interface User extends BaseEntity {
  username: string
  email: string
  phone: string
  avatar?: string
  status: UserStatus
  roles: Role[]
  lastLoginTime?: string
  profile?: UserProfile
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  PENDING = 'PENDING',
}

/**
 * 用户角色
 */
export interface Role {
  id: number
  name: string
  code: string
  description?: string
  permissions: Permission[]
}

/**
 * 权限
 */
export interface Permission {
  id: number
  name: string
  code: string
  resource: string
  action: string
}

/**
 * 用户档案
 */
export interface UserProfile {
  realName?: string
  company?: string
  position?: string
  industry?: string
  location?: string
  bio?: string
}

// ==================== 线索相关类型 ====================

/**
 * 线索信息
 */
export interface Lead extends BaseEntity {
  title: string
  description: string
  industry: string
  location: string
  budget: number
  contactPerson: string
  contactPhone: string
  contactEmail: string
  status: LeadStatus
  rating: LeadRating
  tags: string[]
  ownerId: number
  ownerName: string
  viewCount: number
  favoriteCount: number
  exchangeCount: number
}

/**
 * 线索状态枚举
 */
export enum LeadStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXCHANGING = 'EXCHANGING',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * 线索评级枚举
 */
export enum LeadRating {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

/**
 * 线索搜索条件
 */
export interface LeadSearchParams extends PaginationParams {
  keyword?: string
  industry?: string
  location?: string
  rating?: LeadRating
  status?: LeadStatus
  minBudget?: number
  maxBudget?: number
  tags?: string[]
  dateRange?: [string, string]
}

// ==================== 交换相关类型 ====================

/**
 * 交换记录
 */
export interface Exchange extends BaseEntity {
  fromUserId: number
  toUserId: number
  fromLeadId: number
  toLeadId: number
  status: ExchangeStatus
  fromLeadRating: LeadRating
  toLeadRating: LeadRating
  exchangeRatio: number
  message?: string
  completedTime?: string
}

/**
 * 交换状态枚举
 */
export enum ExchangeStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * 交换申请
 */
export interface ExchangeRequest {
  targetLeadId: number
  offerLeadIds: number[]
  message?: string
}

// ==================== 通知相关类型 ====================

/**
 * 通知信息
 */
export interface Notification extends BaseEntity {
  userId: number
  title: string
  content: string
  type: NotificationType
  status: NotificationStatus
  readTime?: string
  relatedId?: number
  relatedType?: string
}

/**
 * 通知类型枚举
 */
export enum NotificationType {
  SYSTEM = 'SYSTEM',
  EXCHANGE = 'EXCHANGE',
  LEAD = 'LEAD',
  USER = 'USER',
}

/**
 * 通知状态枚举
 */
export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

// ==================== 统计分析类型 ====================

/**
 * 统计数据
 */
export interface Statistics {
  totalLeads: number
  totalExchanges: number
  totalUsers: number
  activeUsers: number
  leadsByRating: Record<LeadRating, number>
  exchangesByStatus: Record<ExchangeStatus, number>
  trendsData: TrendData[]
}

/**
 * 趋势数据
 */
export interface TrendData {
  date: string
  leads: number
  exchanges: number
  users: number
}

// ==================== 表单相关类型 ====================

/**
 * 登录表单
 */
export interface LoginForm {
  username: string
  password: string
  remember?: boolean
  captcha?: string
}

/**
 * 注册表单
 */
export interface RegisterForm {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreement: boolean
  captcha: string
}

/**
 * 线索表单
 */
export interface LeadForm {
  title: string
  description: string
  industry: string
  location: string
  budget: number
  contactPerson: string
  contactPhone: string
  contactEmail: string
  tags: string[]
}

// ==================== 组件相关类型 ====================

/**
 * 表格列配置
 */
export interface TableColumn {
  key: string
  title: string
  width?: number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: any, index: number) => any
}

/**
 * 选项接口
 */
export interface Option {
  label: string
  value: any
  disabled?: boolean
  children?: Option[]
}

/**
 * 菜单项接口
 */
export interface MenuItem {
  key: string
  title: string
  icon?: string
  path?: string
  children?: MenuItem[]
  permission?: string
  hidden?: boolean
}

// ==================== 工具类型 ====================

/**
 * 深度可选
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * 深度必需
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

/**
 * 选择性必需
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * 选择性可选
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
