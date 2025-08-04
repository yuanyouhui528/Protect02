package com.leadexchange.common.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * MyBatis Plus字段自动填充处理器
 * 自动填充创建时间、更新时间、创建者、更新者等字段
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@Slf4j
@Component
public class MyBatisMetaObjectHandler implements MetaObjectHandler {

    /**
     * 插入时自动填充
     * 
     * @param metaObject 元对象
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        log.debug("开始插入填充...");
        
        // 填充创建时间
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        
        // 填充更新时间
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
        
        // 填充创建者（暂时使用默认值，后续可以从SecurityContext中获取当前用户ID）
        this.strictInsertFill(metaObject, "createBy", Long.class, getCurrentUserId());
        
        // 填充更新者
        this.strictInsertFill(metaObject, "updateBy", Long.class, getCurrentUserId());
        
        // 填充版本号
        this.strictInsertFill(metaObject, "version", Integer.class, 1);
        
        log.debug("插入填充完成");
    }

    /**
     * 更新时自动填充
     * 
     * @param metaObject 元对象
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        log.debug("开始更新填充...");
        
        // 填充更新时间
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
        
        // 填充更新者（暂时使用默认值，后续可以从SecurityContext中获取当前用户ID）
        this.strictUpdateFill(metaObject, "updateBy", Long.class, getCurrentUserId());
        
        log.debug("更新填充完成");
    }

    /**
     * 获取当前用户ID
     * TODO: 后续集成Spring Security后，从SecurityContext中获取当前登录用户ID
     * 
     * @return 当前用户ID
     */
    private Long getCurrentUserId() {
        // 暂时返回默认值，后续可以通过以下方式获取：
        // Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // if (authentication != null && authentication.isAuthenticated()) {
        //     UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        //     // 从userDetails中获取用户ID
        //     return userId;
        // }
        return 1L; // 默认系统用户ID
    }

}