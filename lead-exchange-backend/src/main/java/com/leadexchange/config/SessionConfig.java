package com.leadexchange.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

/**
 * 会话管理配置类
 * 配置Redis会话存储和Cookie设置
 * 
 * @author Lead Exchange Team
 * @since 1.0.0
 */
@Configuration
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 7200) // 会话超时时间2小时
public class SessionConfig {

    /**
     * 配置Cookie序列化器
     * 设置Cookie的安全属性和域名等配置
     * 
     * @return Cookie序列化器
     */
    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        
        // 设置Cookie名称
        serializer.setCookieName("LEAD_EXCHANGE_SESSION");
        
        // 设置Cookie路径
        serializer.setCookiePath("/");
        
        // 设置Cookie域名（生产环境需要设置为实际域名）
        // serializer.setDomainName(".leadexchange.com");
        
        // 设置HttpOnly属性，防止XSS攻击
        serializer.setUseHttpOnlyCookie(true);
        
        // 设置Secure属性（HTTPS环境下启用）
        // serializer.setUseSecureCookie(true);
        
        // 设置SameSite属性，防止CSRF攻击
        serializer.setSameSite("Lax");
        
        // 设置Cookie最大存活时间（-1表示浏览器关闭时删除）
        serializer.setCookieMaxAge(-1);
        
        return serializer;
    }
}