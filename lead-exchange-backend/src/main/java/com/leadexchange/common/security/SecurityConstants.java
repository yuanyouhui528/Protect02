package com.leadexchange.common.security;

/**
 * 安全常量配置类
 * 定义JWT认证、权限管理等安全相关的常量
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
public class SecurityConstants {

    /**
     * JWT相关常量
     */
    public static final class JWT {
        /** JWT令牌前缀 */
        public static final String TOKEN_PREFIX = "Bearer ";
        
        /** JWT请求头名称 */
        public static final String HEADER_STRING = "Authorization";
        
        /** JWT签名密钥 */
        public static final String SECRET = "lead-exchange-jwt-secret-key-2024";
        
        /** JWT令牌过期时间（毫秒）- 24小时 */
        public static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000L;
        
        /** 刷新令牌过期时间（毫秒）- 7天 */
        public static final long REFRESH_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000L;
        
        /** JWT令牌发行者 */
        public static final String ISSUER = "lead-exchange";
        
        /** JWT令牌受众 */
        public static final String AUDIENCE = "lead-exchange-users";
    }

    /**
     * 权限相关常量
     */
    public static final class AUTHORITY {
        /** 权限前缀 */
        public static final String PREFIX = "ROLE_";
        
        /** 管理员角色 */
        public static final String ADMIN = "ADMIN";
        
        /** 普通用户角色 */
        public static final String USER = "USER";
        
        /** 企业用户角色 */
        public static final String ENTERPRISE = "ENTERPRISE";
        
        /** 代理商角色 */
        public static final String AGENT = "AGENT";
    }

    /**
     * API路径相关常量
     */
    public static final class API {
        /** API基础路径 */
        public static final String BASE_PATH = "/api";
        
        /** 认证相关API路径 */
        public static final String AUTH_PATH = "/api/auth/**";
        
        /** 公开API路径 */
        public static final String PUBLIC_PATH = "/api/public/**";
        
        /** 登录API路径 */
        public static final String LOGIN_PATH = "/api/auth/login";
        
        /** 注册API路径 */
        public static final String REGISTER_PATH = "/api/auth/register";
        
        /** 刷新令牌API路径 */
        public static final String REFRESH_PATH = "/api/auth/refresh";
    }

    /**
     * 安全配置相关常量
     */
    public static final class SECURITY {
        /** 密码最小长度 */
        public static final int PASSWORD_MIN_LENGTH = 8;
        
        /** 密码最大长度 */
        public static final int PASSWORD_MAX_LENGTH = 32;
        
        /** 登录失败最大尝试次数 */
        public static final int MAX_LOGIN_ATTEMPTS = 5;
        
        /** 账户锁定时间（分钟） */
        public static final int ACCOUNT_LOCK_DURATION = 30;
        
        /** 会话超时时间（分钟） */
        public static final int SESSION_TIMEOUT = 30;
    }

    /**
     * 缓存相关常量
     */
    public static final class CACHE {
        /** 用户缓存前缀 */
        public static final String USER_PREFIX = "user:";
        
        /** 权限缓存前缀 */
        public static final String PERMISSION_PREFIX = "permission:";
        
        /** 登录失败次数缓存前缀 */
        public static final String LOGIN_ATTEMPTS_PREFIX = "login_attempts:";
        
        /** 黑名单令牌缓存前缀 */
        public static final String BLACKLIST_TOKEN_PREFIX = "blacklist_token:";
    }

    /**
     * 私有构造函数，防止实例化
     */
    private SecurityConstants() {
        throw new UnsupportedOperationException("常量类不能被实例化");
    }
}