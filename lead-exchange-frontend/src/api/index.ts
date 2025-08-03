import http, { get, post, put, del } from '@/utils/http'

// 用户相关API
export const userApi = {
  // 用户登录
  login: (data: { username: string; password: string }) => {
    return post('/auth/login', data)
  },

  // 用户注册
  register: (data: { username: string; password: string; email: string; phone: string }) => {
    return post('/auth/register', data)
  },

  // 获取用户信息
  getUserInfo: () => {
    return get('/user/info')
  },

  // 更新用户信息
  updateUserInfo: (data: any) => {
    return put('/user/info', data)
  },

  // 用户登出
  logout: () => {
    return post('/auth/logout')
  },
}

// 线索相关API
export const leadApi = {
  // 获取线索列表
  getLeadList: (params: { page: number; size: number; keyword?: string; status?: string }) => {
    return get('/leads', params)
  },

  // 获取线索详情
  getLeadDetail: (id: number) => {
    return get(`/leads/${id}`)
  },

  // 创建线索
  createLead: (data: any) => {
    return post('/leads', data)
  },

  // 更新线索
  updateLead: (id: number, data: any) => {
    return put(`/leads/${id}`, data)
  },

  // 删除线索
  deleteLead: (id: number) => {
    return del(`/leads/${id}`)
  },

  // 线索评级
  rateLead: (id: number, rating: string) => {
    return post(`/leads/${id}/rate`, { rating })
  },
}

// 交换相关API
export const exchangeApi = {
  // 获取交换列表
  getExchangeList: (params: { page: number; size: number; status?: string }) => {
    return get('/exchanges', params)
  },

  // 创建交换申请
  createExchange: (data: { offerLeadIds: number[]; requestLeadIds: number[] }) => {
    return post('/exchanges', data)
  },

  // 处理交换申请
  handleExchange: (id: number, action: 'approve' | 'reject', reason?: string) => {
    return post(`/exchanges/${id}/${action}`, { reason })
  },

  // 获取交换详情
  getExchangeDetail: (id: number) => {
    return get(`/exchanges/${id}`)
  },
}

// 数据分析相关API
export const analyticsApi = {
  // 获取仪表板数据
  getDashboardData: () => {
    return get('/analytics/dashboard')
  },

  // 获取线索统计
  getLeadStats: (params: { startDate: string; endDate: string }) => {
    return get('/analytics/leads', params)
  },

  // 获取交换统计
  getExchangeStats: (params: { startDate: string; endDate: string }) => {
    return get('/analytics/exchanges', params)
  },

  // 获取用户活跃度统计
  getUserActivityStats: (params: { startDate: string; endDate: string }) => {
    return get('/analytics/user-activity', params)
  },
}

// 通知相关API
export const notificationApi = {
  // 获取通知列表
  getNotificationList: (params: { page: number; size: number; type?: string; read?: boolean }) => {
    return get('/notifications', params)
  },

  // 标记通知为已读
  markAsRead: (id: number) => {
    return put(`/notifications/${id}/read`)
  },

  // 批量标记为已读
  markAllAsRead: () => {
    return put('/notifications/read-all')
  },

  // 删除通知
  deleteNotification: (id: number) => {
    return del(`/notifications/${id}`)
  },

  // 获取未读通知数量
  getUnreadCount: () => {
    return get('/notifications/unread-count')
  },
}

// 文件上传相关API
export const fileApi = {
  // 上传文件
  uploadFile: (file: File, type: 'avatar' | 'document' | 'image') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return http.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 删除文件
  deleteFile: (fileId: string) => {
    return del(`/files/${fileId}`)
  },
}

// 导出默认的http实例，供特殊情况使用
export default http
