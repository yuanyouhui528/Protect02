import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { ElMessage } from 'element-plus'
import { envConfig } from './env'
import { getAccessToken } from './authUtils'
import { processError } from './errorHandler'

// 定义API响应数据类型
interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

// 定义错误响应数据类型
interface ErrorResponse {
  message?: string
  error?: string
  [key: string]: any
}

// 创建axios实例
const http: AxiosInstance = axios.create({
  baseURL: envConfig.api.baseURL, // API基础URL
  timeout: envConfig.api.timeout, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 从安全存储获取token
    try {
      const token = await getAccessToken()
      
      // 如果token存在，添加到请求头
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('获取token失败:', error)
    }

    // 添加请求时间戳，防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    return config
  },
  (error: AxiosError) => {
    // 使用统一错误处理
    processError(error, { customMessage: '请求配置错误' })
    return Promise.reject(error)
  },
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 统一处理响应数据格式
    const { data } = response

    // 如果是文件下载等特殊情况，直接返回response
    if (response.config.responseType === 'blob') {
      return response
    }

    // 处理业务状态码
    if (data && typeof data === 'object') {
      const apiResponse = data as ApiResponse
      // 假设后端返回格式为 { code: number, message: string, data: any }
      if (apiResponse.code === 200 || apiResponse.code === 0) {
        return apiResponse.data || apiResponse
      } else {
        // 业务错误，使用统一错误处理
        const businessError = {
          type: apiResponse.code === 401 ? 'AUTH_ERROR' : 'BUSINESS_ERROR',
          code: apiResponse.code,
          message: apiResponse.message || '请求失败',
          level: 'error',
          timestamp: Date.now(),
          url: response.config?.url,
          method: response.config?.method?.toUpperCase()
        } as any
        
        processError(businessError)
        return Promise.reject(new Error(apiResponse.message || '请求失败'))
      }
    }

    return data
  },
  async (error: AxiosError) => {
    // 使用统一错误处理
    await processError(error)
    return Promise.reject(error)
  },
)

// 导出http实例
export default http

// 导出常用的请求方法
export const get = (url: string, params?: any, config?: AxiosRequestConfig) => {
  return http.get(url, { params, ...config })
}

export const post = (url: string, data?: any, config?: AxiosRequestConfig) => {
  return http.post(url, data, config)
}

export const put = (url: string, data?: any, config?: AxiosRequestConfig) => {
  return http.put(url, data, config)
}

export const del = (url: string, config?: AxiosRequestConfig) => {
  return http.delete(url, config)
}

export const patch = (url: string, data?: any, config?: AxiosRequestConfig) => {
  return http.patch(url, data, config)
}

// 文件上传方法
export const upload = (url: string, formData: FormData, config?: AxiosRequestConfig) => {
  return http.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  })
}

// 文件下载方法
export const download = (url: string, params?: any, filename?: string) => {
  return http
    .get(url, {
      params,
      responseType: 'blob',
    })
    .then((response: AxiosResponse) => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
}
