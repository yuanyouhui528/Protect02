/**
 * 安全存储工具类
 * 提供加密的本地存储功能，保护敏感数据如token、用户信息等
 */

// 存储数据的接口定义
interface SecureStorageData {
  data: string // 加密后的数据
  salt: string // 盐值
  iv: string // 初始化向量
  timestamp: number // 存储时间戳
  version: string // 数据版本
}

// 配置选项
interface SecureStorageOptions {
  keyDerivationIterations?: number // 密钥派生迭代次数
  expirationDays?: number // 过期天数
  storageType?: 'localStorage' | 'sessionStorage' // 存储类型
}

class SecureStorage {
  private readonly ALGORITHM = 'AES-GCM'
  private readonly KEY_LENGTH = 256
  private readonly IV_LENGTH = 12
  private readonly SALT_LENGTH = 16
  private readonly VERSION = '1.0.0'
  
  private options: Required<SecureStorageOptions>
  private storage: Storage

  constructor(options: SecureStorageOptions = {}) {
    this.options = {
      keyDerivationIterations: 100000,
      expirationDays: 7,
      storageType: 'localStorage',
      ...options
    }
    
    this.storage = this.options.storageType === 'sessionStorage' 
      ? sessionStorage 
      : localStorage

    // 检查Web Crypto API支持
    if (!window.crypto || !window.crypto.subtle) {
      console.warn('Web Crypto API不支持，将使用降级方案')
    }
  }

  /**
   * 生成随机字节数组
   * @param length 字节长度
   */
  private generateRandomBytes(length: number): Uint8Array {
    return window.crypto.getRandomValues(new Uint8Array(length))
  }

  /**
   * 将字节数组转换为Base64字符串
   * @param bytes 字节数组
   */
  private bytesToBase64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes))
  }

  /**
   * 将Base64字符串转换为字节数组
   * @param base64 Base64字符串
   */
  private base64ToBytes(base64: string): Uint8Array {
    return new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)))
  }

  /**
   * 生成用户指纹（基于浏览器特征）
   */
  private generateUserFingerprint(): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx?.fillText('fingerprint', 10, 10)
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|')
    
    return fingerprint
  }

  /**
   * 派生加密密钥
   * @param password 密码（用户指纹）
   * @param salt 盐值
   */
  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)
    
    // 导入密码作为密钥材料
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    )
    
    // 派生AES密钥
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: this.options.keyDerivationIterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH
      },
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * 加密数据
   * @param data 要加密的数据
   */
  private async encryptData(data: string): Promise<SecureStorageData> {
    if (!window.crypto?.subtle) {
      throw new Error('Web Crypto API不可用')
    }

    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    
    // 生成随机盐值和初始化向量
    const salt = this.generateRandomBytes(this.SALT_LENGTH)
    const iv = this.generateRandomBytes(this.IV_LENGTH)
    
    // 派生密钥
    const userFingerprint = this.generateUserFingerprint()
    const key = await this.deriveKey(userFingerprint, salt)
    
    // 加密数据
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv: iv
      },
      key,
      dataBuffer
    )
    
    return {
      data: this.bytesToBase64(new Uint8Array(encryptedBuffer)),
      salt: this.bytesToBase64(salt),
      iv: this.bytesToBase64(iv),
      timestamp: Date.now(),
      version: this.VERSION
    }
  }

  /**
   * 解密数据
   * @param secureData 加密的存储数据
   */
  private async decryptData(secureData: SecureStorageData): Promise<string> {
    if (!window.crypto?.subtle) {
      throw new Error('Web Crypto API不可用')
    }

    const salt = this.base64ToBytes(secureData.salt)
    const iv = this.base64ToBytes(secureData.iv)
    const encryptedData = this.base64ToBytes(secureData.data)
    
    // 派生密钥
    const userFingerprint = this.generateUserFingerprint()
    const key = await this.deriveKey(userFingerprint, salt)
    
    // 解密数据
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv: iv
      },
      key,
      encryptedData
    )
    
    const decoder = new TextDecoder()
    return decoder.decode(decryptedBuffer)
  }

  /**
   * 检查数据是否过期
   * @param timestamp 存储时间戳
   */
  private isExpired(timestamp: number): boolean {
    const expirationTime = this.options.expirationDays * 24 * 60 * 60 * 1000
    return Date.now() - timestamp > expirationTime
  }

  /**
   * 安全存储数据
   * @param key 存储键名
   * @param value 要存储的值
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonData = JSON.stringify(value)
      const secureData = await this.encryptData(jsonData)
      const secureDataString = JSON.stringify(secureData)
      
      this.storage.setItem(key, secureDataString)
    } catch (error) {
      console.error('安全存储失败:', error)
      // 降级到普通存储（在生产环境中应该抛出错误）
      console.warn('降级到非加密存储')
      this.storage.setItem(key, JSON.stringify(value))
    }
  }

  /**
   * 安全获取数据
   * @param key 存储键名
   */
  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const storedData = this.storage.getItem(key)
      if (!storedData) {
        return null
      }

      // 尝试解析为安全存储格式
      let secureData: SecureStorageData
      try {
        secureData = JSON.parse(storedData)
      } catch {
        // 可能是旧的非加密数据，尝试直接解析
        console.warn('检测到非加密数据，建议重新登录以启用加密存储')
        return JSON.parse(storedData)
      }

      // 检查是否为安全存储格式
      if (!secureData.data || !secureData.salt || !secureData.iv) {
        // 旧的非加密数据
        return JSON.parse(storedData)
      }

      // 检查是否过期
      if (this.isExpired(secureData.timestamp)) {
        this.removeItem(key)
        return null
      }

      // 解密数据
      const decryptedData = await this.decryptData(secureData)
      return JSON.parse(decryptedData)
    } catch (error) {
      console.error('安全获取数据失败:', error)
      // 清除可能损坏的数据
      this.removeItem(key)
      return null
    }
  }

  /**
   * 移除存储的数据
   * @param key 存储键名
   */
  removeItem(key: string): void {
    this.storage.removeItem(key)
  }

  /**
   * 清除所有存储的数据
   */
  clear(): void {
    this.storage.clear()
  }

  /**
   * 清除过期的数据
   */
  async cleanExpiredData(): Promise<void> {
    const keys = Object.keys(this.storage)
    
    for (const key of keys) {
      try {
        const storedData = this.storage.getItem(key)
        if (!storedData) continue

        const secureData = JSON.parse(storedData)
        if (secureData.timestamp && this.isExpired(secureData.timestamp)) {
          this.removeItem(key)
        }
      } catch {
        // 忽略解析错误，可能不是我们的数据
      }
    }
  }
}

// 创建默认实例
export const secureStorage = new SecureStorage()

// 导出类以便自定义配置
export { SecureStorage }
export type { SecureStorageOptions }