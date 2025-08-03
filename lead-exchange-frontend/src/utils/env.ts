/**
 * 环境变量工具类
 * 提供类型安全的环境变量访问和转换方法
 */

/**
 * 获取字符串类型的环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 环境变量值或默认值
 */
export function getEnvString(key: keyof ImportMetaEnv, defaultValue = ''): string {
  return import.meta.env[key] || defaultValue
}

/**
 * 获取数字类型的环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 转换后的数字值或默认值
 */
export function getEnvNumber(key: keyof ImportMetaEnv, defaultValue = 0): number {
  const value = import.meta.env[key]
  if (!value) return defaultValue
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * 获取布尔类型的环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 转换后的布尔值或默认值
 */
export function getEnvBoolean(key: keyof ImportMetaEnv, defaultValue = false): boolean {
  const value = import.meta.env[key]
  if (!value) return defaultValue
  return value.toLowerCase() === 'true'
}

/**
 * 获取数组类型的环境变量（以逗号分隔）
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 转换后的数组或默认值
 */
export function getEnvArray(key: keyof ImportMetaEnv, defaultValue: string[] = []): string[] {
  const value = import.meta.env[key]
  if (!value) return defaultValue
  return value.split(',').map((item: string) => item.trim()).filter(Boolean)
}

/**
 * 环境变量配置对象
 * 集中管理所有环境变量的访问
 */
export const envConfig = {
  // 应用基础配置
  app: {
    title: getEnvString('VITE_APP_TITLE', '招商线索流通平台'),
    version: getEnvString('VITE_APP_VERSION', '1.0.0'),
    description: getEnvString('VITE_APP_DESCRIPTION', '企业招商线索流通与交换平台'),
    env: getEnvString('VITE_APP_ENV', 'development') as 'development' | 'production' | 'test',
    debug: getEnvBoolean('VITE_APP_DEBUG', false),
    logLevel: getEnvString('VITE_APP_LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error'
  },

  // API配置
  api: {
    baseURL: getEnvString('VITE_API_BASE_URL', '/api'),
    timeout: getEnvNumber('VITE_API_TIMEOUT', 10000)
  },

  // 功能开关
  features: {
    mockApi: getEnvBoolean('VITE_FEATURE_MOCK_API', false),
    devtools: getEnvBoolean('VITE_FEATURE_DEVTOOLS', true),
    analytics: getEnvBoolean('VITE_FEATURE_ANALYTICS', false)
  },

  // 开发配置
  dev: {
    hotReload: getEnvBoolean('VITE_DEV_HOT_RELOAD', true),
    overlay: getEnvBoolean('VITE_DEV_OVERLAY', true)
  },

  // 生产配置
  prod: {
    sourceMap: getEnvBoolean('VITE_PROD_SOURCE_MAP', false),
    minify: getEnvBoolean('VITE_PROD_MINIFY', true),
    gzip: getEnvBoolean('VITE_PROD_GZIP', true)
  },

  // 测试配置
  test: {
    userEmail: getEnvString('VITE_TEST_USER_EMAIL', 'test@example.com'),
    userPassword: getEnvString('VITE_TEST_USER_PASSWORD', 'test123456'),
    companyName: getEnvString('VITE_TEST_COMPANY_NAME', '测试公司'),
    dbReset: getEnvBoolean('VITE_TEST_DB_RESET', true),
    seedData: getEnvBoolean('VITE_TEST_SEED_DATA', true)
  },

  // 第三方服务配置
  thirdParty: {
    echartsCdn: getEnvString('VITE_ECHARTS_CDN', 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js'),
    mapApiKey: getEnvString('VITE_MAP_API_KEY', '')
  },

  // 文件上传配置
  upload: {
    maxSize: getEnvNumber('VITE_UPLOAD_MAX_SIZE', 10485760), // 10MB
    allowedTypes: getEnvArray('VITE_UPLOAD_ALLOWED_TYPES', [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ])
  },

  // 分页配置
  pagination: {
    defaultPageSize: getEnvNumber('VITE_DEFAULT_PAGE_SIZE', 20),
    maxPageSize: getEnvNumber('VITE_MAX_PAGE_SIZE', 100)
  },

  // 缓存配置
  cache: {
    expireTime: getEnvNumber('VITE_CACHE_EXPIRE_TIME', 3600000) // 1小时
  },

  // 安全配置
  security: {
    tokenExpireTime: getEnvNumber('VITE_TOKEN_EXPIRE_TIME', 7200000), // 2小时
    refreshTokenExpireTime: getEnvNumber('VITE_REFRESH_TOKEN_EXPIRE_TIME', 604800000) // 7天
  },

  // 性能监控配置
  monitor: {
    performance: getEnvBoolean('VITE_PERFORMANCE_MONITOR', false),
    errorReporting: getEnvBoolean('VITE_ERROR_REPORTING', false)
  },

  // CDN配置
  cdn: {
    static: getEnvString('VITE_STATIC_CDN', ''),
    assets: getEnvString('VITE_ASSETS_CDN', '')
  }
} as const

/**
 * 检查是否为开发环境
 */
export const isDev = envConfig.app.env === 'development'

/**
 * 检查是否为生产环境
 */
export const isProd = envConfig.app.env === 'production'

/**
 * 检查是否为测试环境
 */
export const isTest = envConfig.app.env === 'test'

/**
 * 获取当前环境信息
 */
export function getEnvironmentInfo() {
  return {
    mode: envConfig.app.env,
    isDev,
    isProd,
    isTest,
    debug: envConfig.app.debug,
    version: envConfig.app.version,
    buildTime: (globalThis as any).__BUILD_TIME__ || 'unknown'
  }
}

/**
 * 打印环境信息到控制台（仅在开发环境）
 */
export function logEnvironmentInfo() {
  if (isDev && envConfig.app.debug) {
    console.group('🌍 Environment Information')
    console.table(getEnvironmentInfo())
    console.groupEnd()
  }
}