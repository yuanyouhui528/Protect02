// 国际化配置
// 配置和注册 Vue I18n 国际化插件

import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

// 中文语言包
const zhCN = {
  // 通用
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    reset: '重置',
    submit: '提交',
    back: '返回',
    next: '下一步',
    prev: '上一步',
    finish: '完成',
    loading: '加载中...',
    noData: '暂无数据',
    operation: '操作',
    status: '状态',
    createTime: '创建时间',
    updateTime: '更新时间',
    remark: '备注',
    description: '描述',
    name: '名称',
    type: '类型',
    value: '值',
    enable: '启用',
    disable: '禁用',
    yes: '是',
    no: '否',
  },

  // 导航菜单
  menu: {
    dashboard: '仪表盘',
    leadManagement: '线索管理',
    leadList: '线索列表',
    leadCreate: '创建线索',
    leadExchange: '线索交换',
    exchangeHistory: '交换记录',
    userManagement: '用户管理',
    userList: '用户列表',
    roleManagement: '角色管理',
    permissionManagement: '权限管理',
    systemSettings: '系统设置',
    profile: '个人中心',
    logout: '退出登录',
  },

  // 用户相关
  user: {
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    email: '邮箱',
    phone: '手机号',
    realName: '真实姓名',
    avatar: '头像',
    role: '角色',
    department: '部门',
    position: '职位',
    lastLoginTime: '最后登录时间',
    loginCount: '登录次数',
    accountStatus: '账户状态',
    active: '激活',
    inactive: '未激活',
    locked: '锁定',
    expired: '过期',
  },

  // 线索相关
  lead: {
    title: '线索标题',
    content: '线索内容',
    source: '线索来源',
    industry: '所属行业',
    region: '所在地区',
    companyName: '公司名称',
    contactPerson: '联系人',
    contactPhone: '联系电话',
    contactEmail: '联系邮箱',
    budget: '预算范围',
    requirement: '需求描述',
    priority: '优先级',
    rating: '评级',
    score: '评分',
    tags: '标签',
    followUpTime: '跟进时间',
    deadline: '截止时间',
    progress: '进度',
    ratingA: 'A级',
    ratingB: 'B级',
    ratingC: 'C级',
    ratingD: 'D级',
    statusNew: '新建',
    statusReviewing: '审核中',
    statusExchanging: '交换中',
    statusCompleted: '已成交',
    statusOffline: '已下架',
  },

  // 交换相关
  exchange: {
    exchangeRequest: '交换申请',
    exchangeRecord: '交换记录',
    requestTime: '申请时间',
    approvalTime: '审批时间',
    exchangeTime: '交换时间',
    exchangeRatio: '交换比例',
    exchangeValue: '交换价值',
    applicant: '申请人',
    approver: '审批人',
    exchangeStatus: '交换状态',
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝',
    completed: '已完成',
    cancelled: '已取消',
  },

  // 表单验证
  validation: {
    required: '此字段为必填项',
    email: '请输入有效的邮箱地址',
    phone: '请输入有效的手机号码',
    minLength: '长度不能少于{min}个字符',
    maxLength: '长度不能超过{max}个字符',
    numeric: '请输入数字',
    positive: '请输入正数',
    range: '请输入{min}到{max}之间的数值',
    passwordMismatch: '两次输入的密码不一致',
    usernameExists: '用户名已存在',
    emailExists: '邮箱已存在',
    phoneExists: '手机号已存在',
  },

  // 消息提示
  message: {
    success: {
      save: '保存成功',
      delete: '删除成功',
      update: '更新成功',
      create: '创建成功',
      upload: '上传成功',
      login: '登录成功',
      logout: '退出成功',
      exchange: '交换成功',
      approve: '审批成功',
      reject: '拒绝成功',
    },
    error: {
      save: '保存失败',
      delete: '删除失败',
      update: '更新失败',
      create: '创建失败',
      upload: '上传失败',
      login: '登录失败',
      logout: '退出失败',
      exchange: '交换失败',
      approve: '审批失败',
      reject: '拒绝失败',
      network: '网络错误',
      server: '服务器错误',
      permission: '权限不足',
      notFound: '资源不存在',
      timeout: '请求超时',
    },
    warning: {
      unsaved: '有未保存的更改',
      deleteConfirm: '确定要删除吗？',
      logoutConfirm: '确定要退出登录吗？',
      dataLoss: '操作可能导致数据丢失',
      irreversible: '此操作不可逆',
    },
    info: {
      processing: '正在处理...',
      uploading: '正在上传...',
      downloading: '正在下载...',
      syncing: '正在同步...',
      connecting: '正在连接...',
    },
  },

  // 分页
  pagination: {
    total: '共 {total} 条',
    page: '第 {current} 页',
    pageSize: '每页 {size} 条',
    goto: '跳至',
    prev: '上一页',
    next: '下一页',
    first: '首页',
    last: '末页',
  },

  // 日期时间
  datetime: {
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    thisWeek: '本周',
    lastWeek: '上周',
    nextWeek: '下周',
    thisMonth: '本月',
    lastMonth: '上月',
    nextMonth: '下月',
    thisYear: '今年',
    lastYear: '去年',
    nextYear: '明年',
    selectDate: '选择日期',
    selectTime: '选择时间',
    selectDateTime: '选择日期时间',
    startDate: '开始日期',
    endDate: '结束日期',
    startTime: '开始时间',
    endTime: '结束时间',
  },
}

// 英文语言包
const enUS = {
  // 通用
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    prev: 'Previous',
    finish: 'Finish',
    loading: 'Loading...',
    noData: 'No Data',
    operation: 'Operation',
    status: 'Status',
    createTime: 'Create Time',
    updateTime: 'Update Time',
    remark: 'Remark',
    description: 'Description',
    name: 'Name',
    type: 'Type',
    value: 'Value',
    enable: 'Enable',
    disable: 'Disable',
    yes: 'Yes',
    no: 'No',
  },

  // 导航菜单
  menu: {
    dashboard: 'Dashboard',
    leadManagement: 'Lead Management',
    leadList: 'Lead List',
    leadCreate: 'Create Lead',
    leadExchange: 'Lead Exchange',
    exchangeHistory: 'Exchange History',
    userManagement: 'User Management',
    userList: 'User List',
    roleManagement: 'Role Management',
    permissionManagement: 'Permission Management',
    systemSettings: 'System Settings',
    profile: 'Profile',
    logout: 'Logout',
  },

  // 用户相关
  user: {
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    email: 'Email',
    phone: 'Phone',
    realName: 'Real Name',
    avatar: 'Avatar',
    role: 'Role',
    department: 'Department',
    position: 'Position',
    lastLoginTime: 'Last Login Time',
    loginCount: 'Login Count',
    accountStatus: 'Account Status',
    active: 'Active',
    inactive: 'Inactive',
    locked: 'Locked',
    expired: 'Expired',
  },

  // 线索相关
  lead: {
    title: 'Lead Title',
    content: 'Lead Content',
    source: 'Lead Source',
    industry: 'Industry',
    region: 'Region',
    companyName: 'Company Name',
    contactPerson: 'Contact Person',
    contactPhone: 'Contact Phone',
    contactEmail: 'Contact Email',
    budget: 'Budget Range',
    requirement: 'Requirement',
    priority: 'Priority',
    rating: 'Rating',
    score: 'Score',
    tags: 'Tags',
    followUpTime: 'Follow Up Time',
    deadline: 'Deadline',
    progress: 'Progress',
    ratingA: 'A Grade',
    ratingB: 'B Grade',
    ratingC: 'C Grade',
    ratingD: 'D Grade',
    statusNew: 'New',
    statusReviewing: 'Reviewing',
    statusExchanging: 'Exchanging',
    statusCompleted: 'Completed',
    statusOffline: 'Offline',
  },

  // 交换相关
  exchange: {
    exchangeRequest: 'Exchange Request',
    exchangeRecord: 'Exchange Record',
    requestTime: 'Request Time',
    approvalTime: 'Approval Time',
    exchangeTime: 'Exchange Time',
    exchangeRatio: 'Exchange Ratio',
    exchangeValue: 'Exchange Value',
    applicant: 'Applicant',
    approver: 'Approver',
    exchangeStatus: 'Exchange Status',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },

  // 表单验证
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    minLength: 'Length cannot be less than {min} characters',
    maxLength: 'Length cannot exceed {max} characters',
    numeric: 'Please enter a number',
    positive: 'Please enter a positive number',
    range: 'Please enter a value between {min} and {max}',
    passwordMismatch: 'The two passwords do not match',
    usernameExists: 'Username already exists',
    emailExists: 'Email already exists',
    phoneExists: 'Phone number already exists',
  },

  // 消息提示
  message: {
    success: {
      save: 'Save successful',
      delete: 'Delete successful',
      update: 'Update successful',
      create: 'Create successful',
      upload: 'Upload successful',
      login: 'Login successful',
      logout: 'Logout successful',
      exchange: 'Exchange successful',
      approve: 'Approve successful',
      reject: 'Reject successful',
    },
    error: {
      save: 'Save failed',
      delete: 'Delete failed',
      update: 'Update failed',
      create: 'Create failed',
      upload: 'Upload failed',
      login: 'Login failed',
      logout: 'Logout failed',
      exchange: 'Exchange failed',
      approve: 'Approve failed',
      reject: 'Reject failed',
      network: 'Network error',
      server: 'Server error',
      permission: 'Insufficient permissions',
      notFound: 'Resource not found',
      timeout: 'Request timeout',
    },
    warning: {
      unsaved: 'There are unsaved changes',
      deleteConfirm: 'Are you sure you want to delete?',
      logoutConfirm: 'Are you sure you want to logout?',
      dataLoss: 'Operation may cause data loss',
      irreversible: 'This operation is irreversible',
    },
    info: {
      processing: 'Processing...',
      uploading: 'Uploading...',
      downloading: 'Downloading...',
      syncing: 'Syncing...',
      connecting: 'Connecting...',
    },
  },

  // 分页
  pagination: {
    total: 'Total {total} items',
    page: 'Page {current}',
    pageSize: '{size} items per page',
    goto: 'Go to',
    prev: 'Previous',
    next: 'Next',
    first: 'First',
    last: 'Last',
  },

  // 日期时间
  datetime: {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    nextWeek: 'Next Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    nextMonth: 'Next Month',
    thisYear: 'This Year',
    lastYear: 'Last Year',
    nextYear: 'Next Year',
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    selectDateTime: 'Select Date Time',
    startDate: 'Start Date',
    endDate: 'End Date',
    startTime: 'Start Time',
    endTime: 'End Time',
  },
}

/**
 * 创建 i18n 实例
 */
function createI18nInstance() {
  return createI18n({
    // 设置默认语言
    locale: 'zh-CN',
    // 设置备用语言
    fallbackLocale: 'en-US',
    // 启用传统模式
    legacy: false,
    // 全局注入 $t 函数
    globalInjection: true,
    // 语言包
    messages: {
      'zh-CN': zhCN,
      'en-US': enUS,
    },
    // 数字格式化
    numberFormats: {
      'zh-CN': {
        currency: {
          style: 'currency',
          currency: 'CNY',
          notation: 'standard',
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
        percent: {
          style: 'percent',
          useGrouping: false,
        },
      },
      'en-US': {
        currency: {
          style: 'currency',
          currency: 'USD',
          notation: 'standard',
        },
        decimal: {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
        percent: {
          style: 'percent',
          useGrouping: false,
        },
      },
    },
    // 日期时间格式化
    datetimeFormats: {
      'zh-CN': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
        long: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
        },
      },
      'en-US': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
        long: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        },
      },
    },
  })
}

/**
 * 安装和配置 Vue I18n
 * @param app Vue应用实例
 */
export function setupI18n(app: App): void {
  const i18n = createI18nInstance()

  // 安装 i18n 插件
  app.use(i18n)

  console.log('✅ Vue I18n 国际化插件已成功配置')
}

// 导出 i18n 实例供其他模块使用
export const i18n = createI18nInstance()

// 导出语言包
export { zhCN, enUS }

// 导出常用类型
export type { I18n, Locale } from 'vue-i18n'
