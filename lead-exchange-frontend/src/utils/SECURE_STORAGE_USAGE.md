# 安全存储使用指南

## 概述

本项目实现了基于Web Crypto API的安全存储解决方案，用于保护敏感数据如用户token、个人信息等。相比直接使用localStorage，安全存储提供了以下保护：

- **数据加密**: 使用AES-GCM算法加密存储数据
- **密钥派生**: 基于PBKDF2算法和用户指纹生成加密密钥
- **完整性保护**: 防止数据被篡改
- **自动过期**: 支持数据自动过期清理
- **向后兼容**: 兼容已存在的明文数据

## 安全特性

### 1. 加密算法
- **对称加密**: AES-GCM (256位密钥)
- **密钥派生**: PBKDF2 (100,000次迭代)
- **随机性**: 每次存储使用不同的盐值和初始化向量

### 2. 用户指纹
基于以下浏览器特征生成用户指纹：
- User Agent
- 语言设置
- 屏幕分辨率
- 时区偏移
- Canvas指纹

### 3. 数据格式
```typescript
interface SecureStorageData {
  data: string      // 加密后的数据 (Base64)
  salt: string      // 盐值 (Base64)
  iv: string        // 初始化向量 (Base64)
  timestamp: number // 存储时间戳
  version: string   // 数据版本
}
```

## 使用方法

### 基本用法

```typescript
import { secureStorage } from '@/utils/secureStorage'

// 存储数据
await secureStorage.setItem('user_token', 'your-jwt-token')
await secureStorage.setItem('user_info', { id: 1, name: 'John' })

// 获取数据
const token = await secureStorage.getItem<string>('user_token')
const userInfo = await secureStorage.getItem<User>('user_info')

// 删除数据
secureStorage.removeItem('user_token')

// 清除所有数据
secureStorage.clear()
```

### 自定义配置

```typescript
import { SecureStorage } from '@/utils/secureStorage'

// 创建自定义配置的实例
const customStorage = new SecureStorage({
  keyDerivationIterations: 150000,  // 更高的安全性
  expirationDays: 30,               // 30天过期
  storageType: 'sessionStorage'     // 使用sessionStorage
})

// 使用自定义实例
await customStorage.setItem('sensitive_data', data)
```

### 清理过期数据

```typescript
// 手动清理过期数据
await secureStorage.cleanExpiredData()

// 建议在应用启动时执行清理
// 已在useAuth的initAuth方法中自动执行
```

## 在认证系统中的应用

### useAuth组合式API

认证系统已经集成了安全存储：

```typescript
// 登录时自动使用安全存储
const { login } = useAuth()
await login({ username: 'user', password: 'pass' })
// token和用户信息会被加密存储

// 获取当前用户（自动解密）
const { currentUser, isLoggedIn } = useAuth()

// 登出时自动清理
const { logout } = useAuth()
await logout()
```

### HTTP拦截器

HTTP请求拦截器已更新为使用安全存储：

```typescript
// 请求时自动从安全存储获取token
// 无需手动处理，拦截器会自动处理
```

## 错误处理

### 降级策略

当Web Crypto API不可用时，系统会：
1. 输出警告信息
2. 降级到普通localStorage存储
3. 提示用户升级浏览器

### 数据迁移

系统会自动处理已存在的明文数据：
1. 检测数据格式
2. 兼容读取明文数据
3. 建议用户重新登录以启用加密

### 异常处理

```typescript
try {
  const data = await secureStorage.getItem('key')
  // 处理数据
} catch (error) {
  console.error('安全存储操作失败:', error)
  // 降级处理或用户提示
}
```

## 安全建议

### 1. 定期清理
- 设置合理的过期时间
- 定期执行cleanExpiredData()
- 用户登出时清理所有数据

### 2. 敏感数据处理
- 仅存储必要的敏感信息
- 避免存储明文密码
- 定期轮换token

### 3. 浏览器兼容性
- 检查Web Crypto API支持
- 提供降级方案
- 引导用户使用现代浏览器

### 4. 监控和审计
- 记录加密失败事件
- 监控异常访问模式
- 定期安全审计

## 性能考虑

### 1. 异步操作
- 所有存储操作都是异步的
- 避免在同步代码中使用
- 合理使用Promise和async/await

### 2. 缓存策略
- 避免频繁的加密/解密操作
- 在内存中缓存常用数据
- 合理设置过期时间

### 3. 批量操作
- 避免大量小数据的频繁存储
- 考虑批量存储策略
- 优化数据结构

## 浏览器支持

### 支持的浏览器
- Chrome 37+
- Firefox 34+
- Safari 7+
- Edge 12+

### 不支持的环境
- IE浏览器
- 某些移动端WebView
- 禁用JavaScript的环境

在不支持的环境中，系统会自动降级到普通存储并给出警告。

## 故障排除

### 常见问题

1. **加密失败**
   - 检查Web Crypto API支持
   - 确认浏览器版本
   - 查看控制台错误信息

2. **数据无法读取**
   - 检查数据格式
   - 确认用户指纹一致性
   - 检查数据是否过期

3. **性能问题**
   - 减少加密操作频率
   - 优化数据大小
   - 使用适当的缓存策略

### 调试模式

在开发环境中，可以启用详细日志：

```typescript
// 在浏览器控制台中查看详细信息
console.log('SecureStorage debug info:', {
  cryptoSupported: !!window.crypto?.subtle,
  storageType: secureStorage.options.storageType,
  version: secureStorage.VERSION
})
```