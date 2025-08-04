package com.leadexchange.modules.test.controller;

import com.leadexchange.common.service.CacheService;
import com.leadexchange.common.utils.RedisUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 缓存测试控制器
 * 用于测试Redis缓存和会话管理功能
 * 
 * @author Lead Exchange Team
 * @since 1.0.0
 */
@RestController
@RequestMapping("/api/test/cache")
public class CacheTestController {

    private static final Logger log = LoggerFactory.getLogger(CacheTestController.class);

    @Autowired
    private CacheService cacheService;

    @Autowired
    private RedisUtils redisUtils;

    /**
     * 测试基本缓存操作
     * 
     * @param key 缓存键
     * @param value 缓存值
     * @return 操作结果
     */
    @PostMapping("/basic")
    public Map<String, Object> testBasicCache(@RequestParam String key, @RequestParam String value) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 设置缓存
            boolean setResult = redisUtils.set(key, value, 300); // 5分钟过期
            result.put("setResult", setResult);
            
            // 获取缓存
            Object cachedValue = redisUtils.get(key);
            result.put("cachedValue", cachedValue);
            
            // 检查键是否存在
            boolean exists = redisUtils.hasKey(key);
            result.put("exists", exists);
            
            // 获取过期时间
            long expireTime = redisUtils.getExpire(key);
            result.put("expireTime", expireTime);
            
            result.put("success", true);
            result.put("message", "基本缓存操作测试成功");
            
        } catch (Exception e) {
            log.error("基本缓存操作测试失败", e);
            result.put("success", false);
            result.put("message", "基本缓存操作测试失败: " + e.getMessage());
        }
        
        return result;
    }

    /**
     * 测试用户信息缓存
     * 
     * @param userId 用户ID
     * @return 操作结果
     */
    @PostMapping("/user/{userId}")
    public Map<String, Object> testUserCache(@PathVariable Long userId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 模拟用户信息
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", userId);
            userInfo.put("username", "user_" + userId);
            userInfo.put("email", "user" + userId + "@example.com");
            userInfo.put("createTime", System.currentTimeMillis());
            
            // 缓存用户信息
            cacheService.cacheUserInfo(userId, userInfo);
            
            // 获取用户信息缓存
            Object cachedUserInfo = cacheService.getUserInfo(userId);
            result.put("cachedUserInfo", cachedUserInfo);
            
            result.put("success", true);
            result.put("message", "用户信息缓存测试成功");
            
        } catch (Exception e) {
            log.error("用户信息缓存测试失败", e);
            result.put("success", false);
            result.put("message", "用户信息缓存测试失败: " + e.getMessage());
        }
        
        return result;
    }

    /**
     * 测试会话管理
     * 
     * @param session HTTP会话
     * @return 操作结果
     */
    @PostMapping("/session")
    public Map<String, Object> testSession(HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 获取会话ID
            String sessionId = session.getId();
            result.put("sessionId", sessionId);
            
            // 设置会话属性
            session.setAttribute("userId", 12345L);
            session.setAttribute("username", "testuser");
            session.setAttribute("loginTime", System.currentTimeMillis());
            
            // 获取会话属性
            Object userId = session.getAttribute("userId");
            Object username = session.getAttribute("username");
            Object loginTime = session.getAttribute("loginTime");
            
            Map<String, Object> sessionData = new HashMap<>();
            sessionData.put("userId", userId);
            sessionData.put("username", username);
            sessionData.put("loginTime", loginTime);
            
            result.put("sessionData", sessionData);
            result.put("maxInactiveInterval", session.getMaxInactiveInterval());
            result.put("creationTime", session.getCreationTime());
            result.put("lastAccessedTime", session.getLastAccessedTime());
            
            result.put("success", true);
            result.put("message", "会话管理测试成功");
            
        } catch (Exception e) {
            log.error("会话管理测试失败", e);
            result.put("success", false);
            result.put("message", "会话管理测试失败: " + e.getMessage());
        }
        
        return result;
    }

    /**
     * 测试分布式锁
     * 
     * @param lockKey 锁键
     * @return 操作结果
     */
    @PostMapping("/lock")
    public Map<String, Object> testDistributedLock(@RequestParam String lockKey) {
        Map<String, Object> result = new HashMap<>();
        String lockValue = UUID.randomUUID().toString();
        
        try {
            // 尝试获取锁
            boolean lockAcquired = cacheService.tryLock(lockKey, lockValue, 60); // 60秒过期
            result.put("lockAcquired", lockAcquired);
            
            if (lockAcquired) {
                // 模拟业务处理
                Thread.sleep(1000);
                
                // 释放锁
                cacheService.releaseLock(lockKey);
                result.put("lockReleased", true);
            }
            
            result.put("success", true);
            result.put("message", "分布式锁测试成功");
            
        } catch (Exception e) {
            log.error("分布式锁测试失败", e);
            result.put("success", false);
            result.put("message", "分布式锁测试失败: " + e.getMessage());
        }
        
        return result;
    }

    /**
     * 测试计数器
     * 
     * @param counterKey 计数器键
     * @return 操作结果
     */
    @PostMapping("/counter")
    public Map<String, Object> testCounter(@RequestParam String counterKey) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 增加计数器
            long count1 = cacheService.incrementCounter(counterKey, 1);
            long count2 = cacheService.incrementCounter(counterKey, 5);
            long count3 = cacheService.incrementCounter(counterKey, 10);
            
            // 获取当前计数值
            long currentCount = cacheService.getCounter(counterKey);
            
            result.put("count1", count1);
            result.put("count2", count2);
            result.put("count3", count3);
            result.put("currentCount", currentCount);
            
            result.put("success", true);
            result.put("message", "计数器测试成功");
            
        } catch (Exception e) {
            log.error("计数器测试失败", e);
            result.put("success", false);
            result.put("message", "计数器测试失败: " + e.getMessage());
        }
        
        return result;
    }

    /**
     * 清理测试数据
     * 
     * @return 操作结果
     */
    @DeleteMapping("/cleanup")
    public Map<String, Object> cleanup() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 删除测试缓存
            redisUtils.del("test:*");
            
            // 删除用户缓存
            cacheService.evictUserInfo(12345L);
            
            result.put("success", true);
            result.put("message", "测试数据清理成功");
            
        } catch (Exception e) {
            log.error("测试数据清理失败", e);
            result.put("success", false);
            result.put("message", "测试数据清理失败: " + e.getMessage());
        }
        
        return result;
    }

    /**
     * 获取Redis连接状态
     * 
     * @return Redis状态信息
     */
    @GetMapping("/status")
    public Map<String, Object> getRedisStatus() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 测试Redis连接
            String testKey = "redis:health:check";
            String testValue = "ok";
            
            redisUtils.set(testKey, testValue, 10);
            Object retrievedValue = redisUtils.get(testKey);
            
            boolean isConnected = testValue.equals(retrievedValue);
            
            result.put("connected", isConnected);
            result.put("testKey", testKey);
            result.put("testValue", testValue);
            result.put("retrievedValue", retrievedValue);
            result.put("timestamp", System.currentTimeMillis());
            
            // 清理测试键
            redisUtils.del(testKey);
            
            result.put("success", true);
            result.put("message", "Redis状态检查完成");
            
        } catch (Exception e) {
            log.error("Redis状态检查失败", e);
            result.put("connected", false);
            result.put("success", false);
            result.put("message", "Redis状态检查失败: " + e.getMessage());
        }
        
        return result;
    }
}