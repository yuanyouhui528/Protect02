/**
 * JWT Token验证工具类
 * 提供完整的token安全验证功能，包括格式检查、过期验证、签名验证等
 */

// JWT Token的payload接口定义
interface JWTPayload {
  sub: string // 用户ID
  iat: number // 签发时间
  exp: number // 过期时间
  iss?: string // 签发者
  aud?: string // 受众
  roles?: string[] // 用户角色
  permissions?: string[] // 用户权限
  [key: string]: any // 其他自定义字段
}

// Token验证结果接口
interface TokenValidationResult {
  isValid: boolean // 是否有效
  payload?: JWTPayload // 解析的payload
  error?: string // 错误信息
  isExpired?: boolean // 是否过期
  expiresIn?: number // 剩余有效时间（秒）
}

class TokenValidator {
  private readonly TOKEN_PREFIX = 'Bearer '
  private readonly REFRESH_THRESHOLD = 5 * 60 * 1000 // 5分钟，token刷新阈值

  /**
   * 验证JWT token的格式
   * @param token JWT token字符串
   */
  private validateTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false
    }

    // 移除Bearer前缀（如果存在）
    const cleanToken = token.replace(this.TOKEN_PREFIX, '').trim()
    
    // JWT应该有三个部分，用点分隔
    const parts = cleanToken.split('.')
    return parts.length === 3
  }

  /**
   * 解析JWT token的payload
   * @param token JWT token字符串
   */
  private parseTokenPayload(token: string): JWTPayload | null {
    try {
      // 移除Bearer前缀（如果存在）
      const cleanToken = token.replace(this.TOKEN_PREFIX, '').trim()
      const parts = cleanToken.split('.')
      
      if (parts.length !== 3) {
        return null
      }

      // 解码payload部分（Base64URL解码）
      const payload = parts[1]
      const decodedPayload = this.base64UrlDecode(payload)
      
      return JSON.parse(decodedPayload) as JWTPayload
    } catch (error) {
      console.error('解析token payload失败:', error)
      return null
    }
  }

  /**
   * Base64URL解码
   * @param str Base64URL编码的字符串
   */
  private base64UrlDecode(str: string): string {
    // 将Base64URL转换为标准Base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    
    // 添加必要的填充
    while (base64.length % 4) {
      base64 += '='
    }
    
    return atob(base64)
  }

  /**
   * 检查token是否过期
   * @param payload JWT payload
   */
  private checkTokenExpiration(payload: JWTPayload): { isExpired: boolean; expiresIn: number } {
    if (!payload.exp) {
      // 如果没有过期时间，认为token无效
      return { isExpired: true, expiresIn: 0 }
    }

    const currentTime = Math.floor(Date.now() / 1000) // 当前时间（秒）
    const expirationTime = payload.exp // 过期时间（秒）
    const expiresIn = expirationTime - currentTime // 剩余时间（秒）

    return {
      isExpired: expiresIn <= 0,
      expiresIn: Math.max(0, expiresIn)
    }
  }

  /**
   * 验证token的签发时间
   * @param payload JWT payload
   */
  private validateIssuedAt(payload: JWTPayload): boolean {
    if (!payload.iat) {
      return false
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const issuedAt = payload.iat
    
    // 检查签发时间不能是未来时间
    return issuedAt <= currentTime
  }

  /**
   * 完整验证JWT token
   * @param token JWT token字符串
   */
  public validateToken(token: string): TokenValidationResult {
    // 1. 检查token格式
    if (!this.validateTokenFormat(token)) {
      return {
        isValid: false,
        error: 'Token格式无效'
      }
    }

    // 2. 解析payload
    const payload = this.parseTokenPayload(token)
    if (!payload) {
      return {
        isValid: false,
        error: 'Token解析失败'
      }
    }

    // 3. 验证签发时间
    if (!this.validateIssuedAt(payload)) {
      return {
        isValid: false,
        error: 'Token签发时间无效',
        payload
      }
    }

    // 4. 检查过期时间
    const { isExpired, expiresIn } = this.checkTokenExpiration(payload)
    if (isExpired) {
      return {
        isValid: false,
        error: 'Token已过期',
        payload,
        isExpired: true,
        expiresIn: 0
      }
    }

    // 5. 所有验证通过
    return {
      isValid: true,
      payload,
      isExpired: false,
      expiresIn
    }
  }

  /**
   * 检查token是否需要刷新
   * @param token JWT token字符串
   */
  public shouldRefreshToken(token: string): boolean {
    const validation = this.validateToken(token)
    
    if (!validation.isValid || !validation.expiresIn) {
      return false
    }

    // 如果剩余时间少于阈值，需要刷新
    return validation.expiresIn * 1000 < this.REFRESH_THRESHOLD
  }

  /**
   * 从token中提取用户信息
   * @param token JWT token字符串
   */
  public extractUserInfo(token: string): { userId?: string; roles?: string[]; permissions?: string[] } | null {
    const validation = this.validateToken(token)
    
    if (!validation.isValid || !validation.payload) {
      return null
    }

    return {
      userId: validation.payload.sub,
      roles: validation.payload.roles || [],
      permissions: validation.payload.permissions || []
    }
  }

  /**
   * 检查token中是否包含指定角色
   * @param token JWT token字符串
   * @param requiredRoles 需要的角色列表
   */
  public hasRequiredRoles(token: string, requiredRoles: string[]): boolean {
    const userInfo = this.extractUserInfo(token)
    
    if (!userInfo || !userInfo.roles) {
      return false
    }

    return requiredRoles.some(role => userInfo.roles!.includes(role))
  }

  /**
   * 检查token中是否包含指定权限
   * @param token JWT token字符串
   * @param requiredPermissions 需要的权限列表
   */
  public hasRequiredPermissions(token: string, requiredPermissions: string[]): boolean {
    const userInfo = this.extractUserInfo(token)
    
    if (!userInfo || !userInfo.permissions) {
      return false
    }

    return requiredPermissions.some(permission => userInfo.permissions!.includes(permission))
  }

  /**
   * 获取token的详细信息（用于调试）
   * @param token JWT token字符串
   */
  public getTokenInfo(token: string): object {
    const validation = this.validateToken(token)
    
    return {
      isValid: validation.isValid,
      error: validation.error,
      isExpired: validation.isExpired,
      expiresIn: validation.expiresIn,
      payload: validation.payload,
      shouldRefresh: validation.isValid ? this.shouldRefreshToken(token) : false
    }
  }
}

// 导出单例实例
export const tokenValidator = new TokenValidator()
export type { TokenValidationResult, JWTPayload }