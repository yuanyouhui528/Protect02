/// <reference types="vite/client" />

/**
 * Vue模块类型声明
 * 让TypeScript识别.vue文件
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * 环境变量类型定义
 * 为自定义环境变量提供TypeScript类型支持
 */
interface ImportMetaEnv {
  // 应用基础配置
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  readonly VITE_APP_DEBUG: string
  readonly VITE_APP_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'

  // API配置
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string

  // 功能开关
  readonly VITE_FEATURE_MOCK_API: string
  readonly VITE_FEATURE_DEVTOOLS: string
  readonly VITE_FEATURE_ANALYTICS: string

  // 开发专用配置
  readonly VITE_DEV_HOT_RELOAD?: string
  readonly VITE_DEV_OVERLAY?: string

  // 生产专用配置
  readonly VITE_PROD_SOURCE_MAP?: string
  readonly VITE_PROD_MINIFY?: string
  readonly VITE_PROD_GZIP?: string

  // 测试专用配置
  readonly VITE_TEST_USER_EMAIL?: string
  readonly VITE_TEST_USER_PASSWORD?: string
  readonly VITE_TEST_COMPANY_NAME?: string
  readonly VITE_TEST_DB_RESET?: string
  readonly VITE_TEST_SEED_DATA?: string

  // 第三方服务配置
  readonly VITE_ECHARTS_CDN: string
  readonly VITE_MAP_API_KEY: string

  // 文件上传配置
  readonly VITE_UPLOAD_MAX_SIZE: string
  readonly VITE_UPLOAD_ALLOWED_TYPES: string

  // 分页配置
  readonly VITE_DEFAULT_PAGE_SIZE: string
  readonly VITE_MAX_PAGE_SIZE: string

  // 缓存配置
  readonly VITE_CACHE_EXPIRE_TIME: string

  // 安全配置
  readonly VITE_TOKEN_EXPIRE_TIME: string
  readonly VITE_REFRESH_TOKEN_EXPIRE_TIME: string

  // 性能监控配置
  readonly VITE_PERFORMANCE_MONITOR?: string
  readonly VITE_ERROR_REPORTING?: string

  // CDN配置
  readonly VITE_STATIC_CDN?: string
  readonly VITE_ASSETS_CDN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}