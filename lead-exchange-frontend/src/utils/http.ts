import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { envConfig } from './env'

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
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('access_token')

    // 如果token存在，添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求时间戳，防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    console.log('发送请求:', config)
    return config
  },
  (error: AxiosError) => {
    console.error('请求拦截器错误:', error)
    ElMessage.error('请求配置错误')
    return Promise.reject(error)
  },
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('收到响应:', response)

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
      } else if (apiResponse.code === 401) {
        // token过期或无效
        ElMessage.error('登录已过期，请重新登录')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        router.push('/login')
        return Promise.reject(new Error('登录已过期'))
      } else {
        // 其他业务错误
        ElMessage.error(apiResponse.message || '请求失败')
        return Promise.reject(new Error(apiResponse.message || '请求失败'))
      }
    }

    return data
  },
  (error: AxiosError) => {
    console.error('响应拦截器错误:', error)

    // 网络错误处理
    if (!error.response) {
      ElMessage.error('网络连接失败，请检查网络设置')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // 根据HTTP状态码处理错误
    switch (status) {
      case 400:
        ElMessage.error('请求参数错误')
        break
      case 401:
        ElMessage.error('未授权，请重新登录')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        router.push('/login')
        break
      case 403:
        ElMessage.error('拒绝访问，权限不足')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 408:
        ElMessage.error('请求超时')
        break
      case 500:
        ElMessage.error('服务器内部错误')
        break
      case 502:
        ElMessage.error('网关错误')
        break
      case 503:
        ElMessage.error('服务不可用')
        break
      case 504:
        ElMessage.error('网关超时')
        break
      default:
        // 类型安全的错误消息处理
        const errorData = data as ErrorResponse
        const errorMessage = errorData?.message || errorData?.error || `请求失败 (${status})`
        ElMessage.error(errorMessage)
    }

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
