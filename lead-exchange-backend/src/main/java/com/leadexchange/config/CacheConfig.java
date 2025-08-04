package com.leadexchange.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * 缓存配置类
 * 配置Redis缓存管理器和缓存策略
 * 
 * @author Lead Exchange Team
 * @since 1.0.0
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * 配置Redis缓存管理器
     * 设置不同缓存区域的过期时间和序列化方式
     * 
     * @param connectionFactory Redis连接工厂
     * @return Redis缓存管理器
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // 默认缓存配置
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1)) // 默认缓存1小时
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues(); // 不缓存null值

        // 针对不同业务场景的缓存配置
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // 用户信息缓存 - 30分钟过期
        cacheConfigurations.put("user", defaultConfig.entryTtl(Duration.ofMinutes(30)));
        
        // 用户权限缓存 - 15分钟过期
        cacheConfigurations.put("user:permissions", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // 用户会话缓存 - 2小时过期
        cacheConfigurations.put("user:session", defaultConfig.entryTtl(Duration.ofHours(2)));
        
        // 线索详情缓存 - 10分钟过期
        cacheConfigurations.put("lead:detail", defaultConfig.entryTtl(Duration.ofMinutes(10)));
        
        // 线索列表缓存 - 5分钟过期
        cacheConfigurations.put("lead:list", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // 公开线索分页缓存 - 3分钟过期
        cacheConfigurations.put("lead:list:public", defaultConfig.entryTtl(Duration.ofMinutes(3)));
        
        // 评级统计缓存 - 1小时过期
        cacheConfigurations.put("lead:rating:stats", defaultConfig.entryTtl(Duration.ofHours(1)));
        
        // 交换申请缓存 - 5分钟过期
        cacheConfigurations.put("exchange:applications", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // 待处理交换申请缓存 - 2分钟过期
        cacheConfigurations.put("exchange:pending", defaultConfig.entryTtl(Duration.ofMinutes(2)));
        
        // 系统配置缓存 - 24小时过期
        cacheConfigurations.put("system:config", defaultConfig.entryTtl(Duration.ofHours(24)));
        
        // 字典数据缓存 - 12小时过期
        cacheConfigurations.put("system:dict", defaultConfig.entryTtl(Duration.ofHours(12)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}