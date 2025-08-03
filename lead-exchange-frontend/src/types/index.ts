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
  phone: string
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

// ==================== 认证授权相关类型 ====================

/**
 * 认证状态
 */
export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  permissions: string[]
  roles: string[]
  loginTime?: string
  expiresAt?: string
}

/**
 * Token信息
 */
export interface TokenInfo {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  scope?: string
}

/**
 * 刷新Token请求
 */
export interface RefreshTokenRequest {
  refreshToken: string
}

/**
 * 忘记密码表单
 */
export interface ForgotPasswordForm {
  phone: string
  captcha: string
}

/**
 * 重置密码表单
 */
export interface ResetPasswordForm {
  phone: string
  code: string
  newPassword: string
  confirmPassword: string
}

/**
 * 修改密码表单
 */
export interface ChangePasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// ==================== 用户管理扩展类型 ====================

/**
 * 用户创建表单
 */
export interface UserCreateForm {
  username: string
  email: string
  phone: string
  password: string
  roleIds: number[]
  profile?: Partial<UserProfile>
}

/**
 * 用户更新表单
 */
export interface UserUpdateForm {
  username?: string
  email?: string
  phone?: string
  avatar?: string
  status?: UserStatus
  roleIds?: number[]
  profile?: Partial<UserProfile>
}

/**
 * 用户搜索参数
 */
export interface UserSearchParams extends PaginationParams {
  keyword?: string
  status?: UserStatus
  roleId?: number
  dateRange?: [string, string]
  company?: string
  industry?: string
}

/**
 * 用户批量操作
 */
export interface UserBatchOperation {
  userIds: number[]
  operation: 'activate' | 'deactivate' | 'lock' | 'unlock' | 'delete'
  reason?: string
}

// ==================== 线索管理扩展类型 ====================

/**
 * 线索更新表单
 */
export interface LeadUpdateForm {
  title?: string
  description?: string
  industry?: string
  location?: string
  budget?: number
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  tags?: string[]
  status?: LeadStatus
}

/**
 * 线索过滤参数
 */
export interface LeadFilterParams extends LeadSearchParams {
  ownerId?: number
  excludeOwn?: boolean
  hasExchanged?: boolean
  isFavorite?: boolean
  createdBy?: number
}

/**
 * 线索批量操作
 */
export interface LeadBatchOperation {
  leadIds: number[]
  operation: 'approve' | 'reject' | 'archive' | 'delete' | 'updateRating'
  reason?: string
  newRating?: LeadRating
}

/**
 * 线索统计信息
 */
export interface LeadStatistics {
  totalCount: number
  byStatus: Record<LeadStatus, number>
  byRating: Record<LeadRating, number>
  byIndustry: Record<string, number>
  byLocation: Record<string, number>
  averageBudget: number
  totalBudget: number
}

// ==================== 交换引擎扩展类型 ====================

/**
 * 交换历史记录
 */
export interface ExchangeHistory extends BaseEntity {
  exchangeId: number
  userId: number
  action: ExchangeAction
  description: string
  metadata?: Record<string, any>
}

/**
 * 交换操作类型
 */
export enum ExchangeAction {
  CREATE = 'CREATE',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  CANCEL = 'CANCEL',
  COMPLETE = 'COMPLETE',
  MODIFY = 'MODIFY',
}

/**
 * 交换规则
 */
export interface ExchangeRule {
  id: number
  name: string
  description: string
  ratingMatrix: Record<LeadRating, Record<LeadRating, number>>
  minExchangeRatio: number
  maxExchangeRatio: number
  isActive: boolean
}

/**
 * 交换统计信息
 */
export interface ExchangeStatistics {
  totalExchanges: number
  successfulExchanges: number
  pendingExchanges: number
  rejectedExchanges: number
  averageCompletionTime: number
  exchangesByRating: Record<LeadRating, number>
  monthlyTrend: Array<{
    month: string
    count: number
    successRate: number
  }>
}

/**
 * 交换建议
 */
export interface ExchangeSuggestion {
  targetLead: Lead
  suggestedLeads: Lead[]
  matchScore: number
  reason: string
}

// ==================== 评级引擎类型 ====================

/**
 * 评级标准
 */
export interface RatingCriteria {
  id: number
  name: string
  description: string
  weight: number
  rules: RatingRule[]
  isActive: boolean
}

/**
 * 评级规则
 */
export interface RatingRule {
  id: number
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
  value: any
  score: number
  description: string
}

/**
 * 评级历史
 */
export interface RatingHistory extends BaseEntity {
  leadId: number
  oldRating: LeadRating
  newRating: LeadRating
  reason: string
  score: number
  criteria: string[]
  isAutomatic: boolean
}

/**
 * 评级计算结果
 */
export interface RatingCalculation {
  leadId: number
  totalScore: number
  rating: LeadRating
  criteriaScores: Array<{
    criteriaId: number
    name: string
    score: number
    maxScore: number
  }>
  suggestions: string[]
}

// ==================== 审核流程类型 ====================

/**
 * 审核记录
 */
export interface AuditRecord extends BaseEntity {
  targetId: number
  targetType: 'lead' | 'user' | 'exchange'
  status: AuditStatus
  auditorId: number
  auditorName: string
  reason?: string
  comments?: string
  attachments?: string[]
}

/**
 * 审核状态枚举
 */
export enum AuditStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
}

/**
 * 审核表单
 */
export interface AuditForm {
  targetId: number
  targetType: 'lead' | 'user' | 'exchange'
  status: AuditStatus
  reason?: string
  comments?: string
  attachments?: File[]
}

/**
 * 审核统计
 */
export interface AuditStatistics {
  totalAudits: number
  pendingAudits: number
  approvedAudits: number
  rejectedAudits: number
  averageAuditTime: number
  auditsByType: Record<string, number>
}

// ==================== 文件处理类型 ====================

/**
 * 文件上传信息
 */
export interface FileUpload {
  id: string
  name: string
  size: number
  type: string
  url: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

/**
 * 图片上传信息
 */
export interface ImageUpload extends FileUpload {
  width: number
  height: number
  thumbnail?: string
}

/**
 * 文件上传配置
 */
export interface UploadConfig {
  maxSize: number
  allowedTypes: string[]
  maxCount: number
  autoUpload: boolean
}

// ==================== 错误处理类型 ====================

/**
 * 错误信息
 */
export interface ErrorInfo {
  code: string
  message: string
  details?: any
  timestamp: number
  path?: string
  method?: string
}

/**
 * 验证错误
 */
export interface ValidationError {
  field: string
  message: string
  value?: any
}

/**
 * API错误响应
 */
export interface ApiError {
  code: number
  message: string
  errors?: ValidationError[]
  timestamp: number
  path: string
}

// ==================== 系统配置类型 ====================

/**
 * 系统配置
 */
export interface SystemConfig {
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
  contactEmail: string
  contactPhone: string
  address: string
  icp: string
  copyright: string
}

/**
 * 应用配置
 */
export interface AppConfig {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  pageSize: number
  autoSave: boolean
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

// ==================== 地区相关类型 ====================

/**
 * 地区信息
 */
export interface Region {
  code: string
  name: string
  level: number
  parentCode?: string
  children?: Region[]
}

/**
 * 城市信息
 */
export interface City {
  code: string
  name: string
  provinceCode: string
  provinceName: string
}

// ==================== 标签系统类型 ====================

/**
 * 标签信息
 */
export interface Tag {
  id: number
  name: string
  color: string
  category: string
  usageCount: number
  isSystem: boolean
}

/**
 * 标签分类
 */
export interface TagCategory {
  id: number
  name: string
  description: string
  color: string
  tags: Tag[]
}

// ==================== 企业信息类型 ====================

/**
 * 企业信息
 */
export interface Company {
  id: number
  name: string
  code: string
  type: CompanyType
  industry: string
  scale: CompanyScale
  address: string
  website?: string
  description?: string
  logo?: string
  status: CompanyStatus
}

/**
 * 企业类型枚举
 */
export enum CompanyType {
  ENTERPRISE = 'ENTERPRISE',
  SME = 'SME',
  STARTUP = 'STARTUP',
  INDIVIDUAL = 'INDIVIDUAL',
}

/**
 * 企业规模枚举
 */
export enum CompanyScale {
  LARGE = 'LARGE',
  MEDIUM = 'MEDIUM',
  SMALL = 'SMALL',
  MICRO = 'MICRO',
}

/**
 * 企业状态枚举
 */
export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}
