package com.leadexchange.common.service;

import com.leadexchange.common.utils.RedisUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * 缓存服务类
 * 提供统一的缓存操作接口，封装Redis缓存逻辑
 * 
 * @author Lead Exchange Team
 * @since 1.0.0
 */
@Service
public class CacheService {

    private static final Logger log = LoggerFactory.getLogger(CacheService.class);

    @Autowired
    private RedisUtils redisUtils;

    /**
     * 缓存用户信息
     * 
     * @param userId 用户ID
     * @param userInfo 用户信息
     */
    @CachePut(value = "user", key = "#userId")
    public Object cacheUserInfo(Long userId, Object userInfo) {
        log.info("缓存用户信息: userId={}", userId);
        return userInfo;
    }

    /**
     * 获取用户信息缓存
     * 
     * @param userId 用户ID
     * @return 用户信息
     */
    @Cacheable(value = "user", key = "#userId")
    public Object getUserInfo(Long userId) {
        log.info("从缓存获取用户信息: userId={}", userId);
        return null; // 实际业务中会从数据库查询
    }

    /**
     * 删除用户信息缓存
     * 
     * @param userId 用户ID
     */
    @CacheEvict(value = "user", key = "#userId")
    public void evictUserInfo(Long userId) {
        log.info("删除用户信息缓存: userId={}", userId);
    }

    /**
     * 缓存用户权限信息
     * 
     * @param userId 用户ID
     * @param permissions 权限信息
     */
    @CachePut(value = "user:permissions", key = "#userId")
    public Object cacheUserPermissions(Long userId, Object permissions) {
        log.info("缓存用户权限信息: userId={}", userId);
        return permissions;
    }

    /**
     * 获取用户权限缓存
     * 
     * @param userId 用户ID
     * @return 权限信息
     */
    @Cacheable(value = "user:permissions", key = "#userId")
    public Object getUserPermissions(Long userId) {
        log.info("从缓存获取用户权限信息: userId={}", userId);
        return null; // 实际业务中会从数据库查询
    }

    /**
     * 删除用户权限缓存
     * 
     * @param userId 用户ID
     */
    @CacheEvict(value = "user:permissions", key = "#userId")
    public void evictUserPermissions(Long userId) {
        log.info("删除用户权限缓存: userId={}", userId);
    }

    /**
     * 缓存线索详情
     * 
     * @param leadId 线索ID
     * @param leadDetail 线索详情
     */
    @CachePut(value = "lead:detail", key = "#leadId")
    public Object cacheLeadDetail(Long leadId, Object leadDetail) {
        log.info("缓存线索详情: leadId={}", leadId);
        return leadDetail;
    }

    /**
     * 获取线索详情缓存
     * 
     * @param leadId 线索ID
     * @return 线索详情
     */
    @Cacheable(value = "lead:detail", key = "#leadId")
    public Object getLeadDetail(Long leadId) {
        log.info("从缓存获取线索详情: leadId={}", leadId);
        return null; // 实际业务中会从数据库查询
    }

    /**
     * 删除线索详情缓存
     * 
     * @param leadId 线索ID
     */
    @CacheEvict(value = "lead:detail", key = "#leadId")
    public void evictLeadDetail(Long leadId) {
        log.info("删除线索详情缓存: leadId={}", leadId);
    }

    /**
     * 设置会话信息
     * 
     * @param sessionId 会话ID
     * @param sessionData 会话数据
     * @param expireSeconds 过期时间（秒）
     */
    public void setSessionData(String sessionId, Object sessionData, long expireSeconds) {
        String key = "user:session:" + sessionId;
        redisUtils.set(key, sessionData, expireSeconds);
        log.info("设置会话信息: sessionId={}, expireSeconds={}", sessionId, expireSeconds);
    }

    /**
     * 获取会话信息
     * 
     * @param sessionId 会话ID
     * @return 会话数据
     */
    public Object getSessionData(String sessionId) {
        String key = "user:session:" + sessionId;
        Object sessionData = redisUtils.get(key);
        log.info("获取会话信息: sessionId={}, exists={}", sessionId, sessionData != null);
        return sessionData;
    }

    /**
     * 删除会话信息
     * 
     * @param sessionId 会话ID
     */
    public void removeSessionData(String sessionId) {
        String key = "user:session:" + sessionId;
        redisUtils.del(key);
        log.info("删除会话信息: sessionId={}", sessionId);
    }

    /**
     * 设置分布式锁
     * 
     * @param lockKey 锁键
     * @param lockValue 锁值
     * @param expireSeconds 过期时间（秒）
     * @return 是否获取锁成功
     */
    public boolean tryLock(String lockKey, String lockValue, long expireSeconds) {
        String key = "lock:" + lockKey;
        boolean success = redisUtils.set(key, lockValue, expireSeconds);
        log.info("尝试获取分布式锁: lockKey={}, success={}", lockKey, success);
        return success;
    }

    /**
     * 释放分布式锁
     * 
     * @param lockKey 锁键
     */
    public void releaseLock(String lockKey) {
        String key = "lock:" + lockKey;
        redisUtils.del(key);
        log.info("释放分布式锁: lockKey={}", lockKey);
    }

    /**
     * 增加计数器
     * 
     * @param counterKey 计数器键
     * @param delta 增量
     * @return 增加后的值
     */
    public long incrementCounter(String counterKey, long delta) {
        String key = "counter:" + counterKey;
        long result = redisUtils.incr(key, delta);
        log.info("增加计数器: counterKey={}, delta={}, result={}", counterKey, delta, result);
        return result;
    }

    /**
     * 获取计数器值
     * 
     * @param counterKey 计数器键
     * @return 计数器值
     */
    public long getCounter(String counterKey) {
        String key = "counter:" + counterKey;
        Object value = redisUtils.get(key);
        long result = value != null ? Long.parseLong(value.toString()) : 0L;
        log.info("获取计数器值: counterKey={}, value={}", counterKey, result);
        return result;
    }
}