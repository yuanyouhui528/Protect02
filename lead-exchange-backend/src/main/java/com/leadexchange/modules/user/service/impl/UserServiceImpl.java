package com.leadexchange.modules.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leadexchange.modules.user.entity.User;
import com.leadexchange.modules.user.mapper.UserMapper;
import com.leadexchange.modules.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户服务实现类
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User findByUsername(String username) {
        if (!StringUtils.hasText(username)) {
            return null;
        }
        return userMapper.findByUsername(username);
    }

    @Override
    public User findByEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return null;
        }
        return userMapper.findByEmail(email);
    }

    @Override
    public User findByPhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            return null;
        }
        return userMapper.findByPhone(phone);
    }

    @Override
    public boolean register(User user) {
        try {
            // 检查用户名是否已存在
            if (existsByUsername(user.getUsername())) {
                log.warn("用户注册失败：用户名已存在 - {}", user.getUsername());
                return false;
            }

            // 检查邮箱是否已存在
            if (StringUtils.hasText(user.getEmail()) && existsByEmail(user.getEmail())) {
                log.warn("用户注册失败：邮箱已存在 - {}", user.getEmail());
                return false;
            }

            // 检查手机号是否已存在
            if (StringUtils.hasText(user.getPhone()) && existsByPhone(user.getPhone())) {
                log.warn("用户注册失败：手机号已存在 - {}", user.getPhone());
                return false;
            }

            // 加密密码
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // 设置默认值
            user.setStatus(1); // 默认启用
            user.setLoginFailCount(0);
            
            // 保存用户
            boolean result = save(user);
            
            if (result) {
                log.info("用户注册成功：{}", user.getUsername());
            } else {
                log.error("用户注册失败：数据库保存失败 - {}", user.getUsername());
            }
            
            return result;
        } catch (Exception e) {
            log.error("用户注册异常：{}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public User login(String username, String password) {
        try {
            // 查询用户
            User user = findByUsername(username);
            if (user == null) {
                log.warn("用户登录失败：用户不存在 - {}", username);
                return null;
            }

            // 检查用户状态
            if (user.getStatus() == null || user.getStatus() != 1) {
                log.warn("用户登录失败：用户已禁用 - {}", username);
                return null;
            }

            // 检查账户是否被锁定
            if (user.getLockTime() != null && user.getLockTime().isAfter(LocalDateTime.now())) {
                log.warn("用户登录失败：账户已锁定 - {}", username);
                return null;
            }

            // 验证密码
            if (!passwordEncoder.matches(password, user.getPassword())) {
                log.warn("用户登录失败：密码错误 - {}", username);
                // 增加登录失败次数
                incrementLoginFailCount(user.getId());
                return null;
            }

            // 登录成功，重置登录失败次数
            resetLoginFailCount(user.getId());
            
            log.info("用户登录成功：{}", username);
            return user;
        } catch (Exception e) {
            log.error("用户登录异常：{}", e.getMessage(), e);
            return null;
        }
    }

    @Override
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        try {
            User user = getById(userId);
            if (user == null) {
                log.warn("修改密码失败：用户不存在 - {}", userId);
                return false;
            }

            // 验证旧密码
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                log.warn("修改密码失败：旧密码错误 - {}", userId);
                return false;
            }

            // 更新密码
            user.setPassword(passwordEncoder.encode(newPassword));
            boolean result = updateById(user);
            
            if (result) {
                log.info("用户密码修改成功：{}", userId);
            }
            
            return result;
        } catch (Exception e) {
            log.error("修改密码异常：{}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean resetPassword(Long userId, String newPassword) {
        try {
            LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(User::getId, userId)
                        .set(User::getPassword, passwordEncoder.encode(newPassword));
            
            boolean result = update(updateWrapper);
            
            if (result) {
                log.info("用户密码重置成功：{}", userId);
            }
            
            return result;
        } catch (Exception e) {
            log.error("重置密码异常：{}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean updateStatus(Long userId, Integer status) {
        try {
            LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(User::getId, userId)
                        .set(User::getStatus, status);
            
            boolean result = update(updateWrapper);
            
            if (result) {
                log.info("用户状态更新成功：{} - {}", userId, status);
            }
            
            return result;
        } catch (Exception e) {
            log.error("更新用户状态异常：{}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public IPage<User> getUserPage(Page<User> page, Integer userType, Integer status, String keyword) {
        return userMapper.selectUserPage(page, userType, status, keyword);
    }

    @Override
    public User findByCompanyCode(String companyCode) {
        if (!StringUtils.hasText(companyCode)) {
            return null;
        }
        return userMapper.findByCompanyCode(companyCode);
    }

    @Override
    public List<User> findByIndustry(String industry) {
        if (!StringUtils.hasText(industry)) {
            return List.of();
        }
        return userMapper.findByIndustry(industry);
    }

    @Override
    public List<User> findByRegion(String region) {
        if (!StringUtils.hasText(region)) {
            return List.of();
        }
        return userMapper.findByRegion(region);
    }

    @Override
    public Long countUsers(Integer userType, Integer status) {
        return userMapper.countUsers(userType, status);
    }

    @Override
    public boolean existsByUsername(String username) {
        if (!StringUtils.hasText(username)) {
            return false;
        }
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        return count(queryWrapper) > 0;
    }

    @Override
    public boolean existsByEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return false;
        }
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getEmail, email);
        return count(queryWrapper) > 0;
    }

    @Override
    public boolean existsByPhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            return false;
        }
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getPhone, phone);
        return count(queryWrapper) > 0;
    }

    @Override
    public boolean updateLastLoginInfo(Long userId, String loginIp) {
        try {
            LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(User::getId, userId)
                        .set(User::getLastLoginTime, LocalDateTime.now())
                        .set(User::getLastLoginIp, loginIp);
            
            return update(updateWrapper);
        } catch (Exception e) {
            log.error("更新最后登录信息异常：{}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean incrementLoginFailCount(Long userId) {
        try {
            User user = getById(userId);
            if (user == null) {
                return false;
            }
            
            int failCount = user.getLoginFailCount() == null ? 0 : user.getLoginFailCount();
            failCount++;
            
            LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(User::getId, userId)
                        .set(User::getLoginFailCount, failCount);
            
            // 如果失败次数达到5次，锁定账户30分钟
            if (failCount >= 5) {
                updateWrapper.set(User::getLockTime, LocalDateTime.now().plusMinutes(30));
                log.warn("用户账户已锁定30分钟：{}", userId);
            }
            
            return update(updateWrapper);
        } catch (Exception e) {
            log.error("增加登录失败次数异常：{}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean resetLoginFailCount(Long userId) {
        try {
            LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(User::getId, userId)
                        .set(User::getLoginFailCount, 0)
                        .set(User::getLockTime, null);
            
            return update(updateWrapper);
        } catch (Exception e) {
            log.error("重置登录失败次数异常：{}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean lockUser(Long userId, Integer lockMinutes) {
        try {
            LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(User::getId, userId)
                        .set(User::getLockTime, LocalDateTime.now().plusMinutes(lockMinutes));
            
            boolean result = update(updateWrapper);
            
            if (result) {
                log.info("用户账户已锁定{}分钟：{}", lockMinutes, userId);
            }
            
            return result;
        } catch (Exception e) {
            log.error("锁定用户账户异常：{}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean unlockUser(Long userId) {
        try {
            LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(User::getId, userId)
                        .set(User::getLockTime, null)
                        .set(User::getLoginFailCount, 0);
            
            boolean result = update(updateWrapper);
            
            if (result) {
                log.info("用户账户已解锁：{}", userId);
            }
            
            return result;
        } catch (Exception e) {
            log.error("解锁用户账户异常：{}", e.getMessage(), e);
            return false;
        }
    }

}