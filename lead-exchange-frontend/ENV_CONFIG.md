# 环境变量配置文档

## 概述

本项目使用 Vite 的环境变量系统来管理不同环境下的配置。环境变量文件按照环境分类，支持开发、测试、生产三种环境的配置管理。

## 环境变量文件结构

```
├── .env                 # 通用环境变量（默认配置）
├── .env.development     # 开发环境配置
├── .env.test           # 测试环境配置
├── .env.production     # 生产环境配置
└── env.d.ts            # TypeScript 类型定义
```

## 加载优先级

Vite 按照以下优先级加载环境变量：

1. `.env.[mode].local` （最高优先级，git忽略）
2. `.env.local` （git忽略）
3. `.env.[mode]` （环境特定配置）
4. `.env` （通用默认配置）

## 环境变量分类

### 应用基础配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_APP_TITLE` | string | 招商线索流通平台 | 应用标题 |
| `VITE_APP_VERSION` | string | 1.0.0 | 应用版本 |
| `VITE_APP_DESCRIPTION` | string | 企业招商线索流通与交换平台 | 应用描述 |
| `VITE_APP_ENV` | string | development | 环境标识 |
| `VITE_APP_DEBUG` | boolean | false | 调试模式 |
| `VITE_APP_LOG_LEVEL` | string | info | 日志级别 |

### API配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_API_BASE_URL` | string | /api | API基础URL |
| `VITE_API_TIMEOUT` | number | 10000 | 请求超时时间（毫秒） |

### 功能开关

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_FEATURE_MOCK_API` | boolean | false | 是否启用Mock API |
| `VITE_FEATURE_DEVTOOLS` | boolean | true | 是否启用开发工具 |
| `VITE_FEATURE_ANALYTICS` | boolean | false | 是否启用数据分析 |

### 开发环境专用

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_DEV_HOT_RELOAD` | boolean | true | 热重载 |
| `VITE_DEV_OVERLAY` | boolean | true | 错误覆盖层 |

### 生产环境专用

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_PROD_SOURCE_MAP` | boolean | false | 是否生成源码映射 |
| `VITE_PROD_MINIFY` | boolean | true | 是否压缩代码 |
| `VITE_PROD_GZIP` | boolean | true | 是否启用Gzip压缩 |

### 测试环境专用

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_TEST_USER_EMAIL` | string | test@example.com | 测试用户邮箱 |
| `VITE_TEST_USER_PASSWORD` | string | test123456 | 测试用户密码 |
| `VITE_TEST_COMPANY_NAME` | string | 测试公司 | 测试公司名称 |
| `VITE_TEST_DB_RESET` | boolean | true | 是否重置测试数据库 |
| `VITE_TEST_SEED_DATA` | boolean | true | 是否填充种子数据 |

### 第三方服务配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_ECHARTS_CDN` | string | https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js | ECharts CDN地址 |
| `VITE_MAP_API_KEY` | string | - | 地图API密钥 |

### 文件上传配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_UPLOAD_MAX_SIZE` | number | 10485760 | 最大上传文件大小（字节） |
| `VITE_UPLOAD_ALLOWED_TYPES` | string | image/jpeg,image/png,image/gif,application/pdf | 允许的文件类型 |

### 分页配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_DEFAULT_PAGE_SIZE` | number | 20 | 默认分页大小 |
| `VITE_MAX_PAGE_SIZE` | number | 100 | 最大分页大小 |

### 缓存配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_CACHE_EXPIRE_TIME` | number | 3600000 | 缓存过期时间（毫秒） |

### 安全配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_TOKEN_EXPIRE_TIME` | number | 7200000 | Token过期时间（毫秒） |
| `VITE_REFRESH_TOKEN_EXPIRE_TIME` | number | 604800000 | 刷新Token过期时间（毫秒） |

### 性能监控配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_PERFORMANCE_MONITOR` | boolean | false | 是否启用性能监控 |
| `VITE_ERROR_REPORTING` | boolean | false | 是否启用错误上报 |

### CDN配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_STATIC_CDN` | string | - | 静态资源CDN地址 |
| `VITE_ASSETS_CDN` | string | - | 资源文件CDN地址 |

## 使用方法

### 1. 直接访问环境变量

```typescript
// 直接使用 import.meta.env
const apiUrl = import.meta.env.VITE_API_BASE_URL
const isDebug = import.meta.env.VITE_APP_DEBUG === 'true'
```

### 2. 使用环境变量工具类（推荐）

```typescript
import { envConfig, getEnvString, getEnvBoolean, getEnvNumber } from '@/utils/env'

// 使用配置对象
const apiUrl = envConfig.api.baseURL
const isDebug = envConfig.app.debug

// 使用工具函数
const customVar = getEnvString('VITE_CUSTOM_VAR', 'default')
const enableFeature = getEnvBoolean('VITE_ENABLE_FEATURE', false)
const maxRetries = getEnvNumber('VITE_MAX_RETRIES', 3)
```

### 3. 在组件中使用

```vue
<template>
  <div>
    <h1>{{ $env.app.title }}</h1>
    <p>Version: {{ $env.app.version }}</p>
    <p>Environment: {{ $env.app.env }}</p>
  </div>
</template>

<script setup lang="ts">
import { envConfig } from '@/utils/env'

// 在 setup 中使用
console.log('API URL:', envConfig.api.baseURL)
</script>
```

## 环境切换

### 开发环境

```bash
# 启动开发服务器（默认使用 .env.development）
npm run dev

# 或者显式指定模式
npm run dev -- --mode development
```

### 测试环境

```bash
# 使用测试环境配置
npm run build -- --mode test
npm run preview -- --mode test
```

### 生产环境

```bash
# 构建生产版本（默认使用 .env.production）
npm run build

# 或者显式指定模式
npm run build -- --mode production
```

## 安全注意事项

1. **敏感信息保护**：
   - 不要在环境变量中存储敏感信息（如密码、私钥等）
   - 使用 `.env.local` 文件存储本地敏感配置（已在 .gitignore 中排除）

2. **变量命名规范**：
   - 所有自定义环境变量必须以 `VITE_` 开头
   - 使用大写字母和下划线命名

3. **类型安全**：
   - 在 `env.d.ts` 中定义所有环境变量的类型
   - 使用环境变量工具类进行类型转换

## 调试和验证

### 查看当前环境配置

在浏览器控制台中：

```javascript
// 查看完整配置（仅开发环境）
console.table(window.__APP__.config)

// 查看环境信息
console.log(window.__APP__.env)
```

### 验证环境变量加载

```typescript
import { getEnvironmentInfo, logEnvironmentInfo } from '@/utils/env'

// 打印环境信息
logEnvironmentInfo()

// 获取环境信息对象
const envInfo = getEnvironmentInfo()
console.log(envInfo)
```

## 最佳实践

1. **配置分层**：
   - `.env` 存放通用默认配置
   - `.env.[mode]` 存放环境特定配置
   - `.env.local` 存放本地个人配置

2. **类型安全**：
   - 始终使用 TypeScript 类型定义
   - 使用环境变量工具类进行类型转换

3. **文档维护**：
   - 及时更新环境变量文档
   - 为新增变量添加类型定义

4. **版本控制**：
   - 提交 `.env` 和 `.env.[mode]` 文件
   - 不提交 `.env.local` 和 `.env.[mode].local` 文件

5. **部署配置**：
   - 在 CI/CD 中设置环境变量
   - 使用配置管理工具管理生产环境变量

## 故障排除

### 常见问题

1. **环境变量未生效**：
   - 检查变量名是否以 `VITE_` 开头
   - 确认文件名和模式匹配
   - 重启开发服务器

2. **类型错误**：
   - 更新 `env.d.ts` 中的类型定义
   - 使用环境变量工具类进行类型转换

3. **构建问题**：
   - 检查生产环境配置
   - 验证环境变量在构建时是否正确替换

### 调试命令

```bash
# 查看当前环境变量
echo $NODE_ENV

# 查看 Vite 模式
npm run dev -- --mode development --debug

# 构建时显示详细信息
npm run build -- --debug
```