package com.leadexchange.modules.user.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.leadexchange.modules.user.entity.User;

import java.util.List;

/**
 * 用户服务接口
 * 继承MyBatis Plus的IService，提供基础服务方法
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
public interface UserService extends IService<User> {

    /**
     * 根据用户名查询用户
     * 
     * @param username 用户名
     * @return 用户信息
     */
    User findByUsername(String username);

    /**
     * 根据邮箱查询用户
     * 
     * @param email 邮箱
     * @return 用户信息
     */
    User findByEmail(String email);

    /**
     * 根据手机号查询用户
     * 
     * @param phone 手机号
     * @return 用户信息
     */
    User findByPhone(String phone);

    /**
     * 用户注册
     * 
     * @param user 用户信息
     * @return 注册结果
     */
    boolean register(User user);

    /**
     * 用户登录验证
     * 
     * @param username 用户名
     * @param password 密码
     * @return 用户信息（验证成功）或null（验证失败）
     */
    User login(String username, String password);

    /**
     * 修改密码
     * 
     * @param userId 用户ID
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 修改结果
     */
    boolean changePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 重置密码
     * 
     * @param userId 用户ID
     * @param newPassword 新密码
     * @return 重置结果
     */
    boolean resetPassword(Long userId, String newPassword);

    /**
     * 更新用户状态
     * 
     * @param userId 用户ID
     * @param status 状态（0：禁用，1：启用）
     * @return 更新结果
     */
    boolean updateStatus(Long userId, Integer status);

    /**
     * 分页查询用户列表
     * 
     * @param page 分页参数
     * @param userType 用户类型（可选）
     * @param status 用户状态（可选）
     * @param keyword 搜索关键词（可选）
     * @return 用户分页列表
     */
    IPage<User> getUserPage(Page<User> page, Integer userType, Integer status, String keyword);

    /**
     * 根据企业统一社会信用代码查询用户
     * 
     * @param companyCode 企业统一社会信用代码
     * @return 用户信息
     */
    User findByCompanyCode(String companyCode);

    /**
     * 查询指定行业的企业用户
     * 
     * @param industry 行业
     * @return 企业用户列表
     */
    List<User> findByIndustry(String industry);

    /**
     * 查询指定地区的用户
     * 
     * @param region 地区
     * @return 用户列表
     */
    List<User> findByRegion(String region);

    /**
     * 统计用户数量
     * 
     * @param userType 用户类型（可选）
     * @param status 用户状态（可选）
     * @return 用户数量
     */
    Long countUsers(Integer userType, Integer status);

    /**
     * 检查用户名是否存在
     * 
     * @param username 用户名
     * @return 是否存在
     */
    boolean existsByUsername(String username);

    /**
     * 检查邮箱是否存在
     * 
     * @param email 邮箱
     * @return 是否存在
     */
    boolean existsByEmail(String email);

    /**
     * 检查手机号是否存在
     * 
     * @param phone 手机号
     * @return 是否存在
     */
    boolean existsByPhone(String phone);

    /**
     * 更新最后登录信息
     * 
     * @param userId 用户ID
     * @param loginIp 登录IP
     * @return 更新结果
     */
    boolean updateLastLoginInfo(Long userId, String loginIp);

    /**
     * 增加登录失败次数
     * 
     * @param userId 用户ID
     * @return 更新结果
     */
    boolean incrementLoginFailCount(Long userId);

    /**
     * 重置登录失败次数
     * 
     * @param userId 用户ID
     * @return 更新结果
     */
    boolean resetLoginFailCount(Long userId);

    /**
     * 锁定用户账户
     * 
     * @param userId 用户ID
     * @param lockMinutes 锁定时长（分钟）
     * @return 锁定结果
     */
    boolean lockUser(Long userId, Integer lockMinutes);

    /**
     * 解锁用户账户
     * 
     * @param userId 用户ID
     * @return 解锁结果
     */
    boolean unlockUser(Long userId);

}