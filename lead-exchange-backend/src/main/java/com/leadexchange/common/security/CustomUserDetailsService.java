package com.leadexchange.common.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * 自定义用户详情服务
 * 实现Spring Security的UserDetailsService接口，提供用户认证信息
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class CustomUserDetailsService implements UserDetailsService {

    // TODO: 注入用户服务和权限服务
    // @Autowired
    // private UserService userService;
    // 
    // @Autowired
    // private RoleService roleService;

    /**
     * 根据用户名加载用户详情
     * 
     * @param username 用户名（可以是用户名、邮箱或手机号）
     * @return UserDetails用户详情对象
     * @throws UsernameNotFoundException 用户不存在异常
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("正在加载用户详情，用户名: {}", username);
        
        try {
            // TODO: 从数据库查询用户信息
            // 这里先使用模拟数据，后续需要替换为实际的数据库查询
            UserInfo userInfo = loadUserFromDatabase(username);
            
            if (userInfo == null) {
                log.warn("用户不存在: {}", username);
                throw new UsernameNotFoundException("用户不存在: " + username);
            }
            
            // 检查用户状态
            validateUserStatus(userInfo);
            
            // 获取用户权限
            Collection<? extends GrantedAuthority> authorities = getUserAuthorities(userInfo);
            
            // 创建UserDetails对象
            UserDetails userDetails = User.builder()
                    .username(userInfo.getUsername())
                    .password(userInfo.getPassword())
                    .authorities(authorities)
                    .accountExpired(!userInfo.isAccountNonExpired())
                    .accountLocked(!userInfo.isAccountNonLocked())
                    .credentialsExpired(!userInfo.isCredentialsNonExpired())
                    .disabled(!userInfo.isEnabled())
                    .build();
            
            log.debug("用户详情加载成功，用户名: {}, 权限数量: {}", username, authorities.size());
            return userDetails;
            
        } catch (UsernameNotFoundException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("加载用户详情失败，用户名: {}, 错误: {}", username, ex.getMessage());
            throw new UsernameNotFoundException("加载用户详情失败: " + ex.getMessage());
        }
    }

    /**
     * 从数据库加载用户信息
     * TODO: 实现实际的数据库查询逻辑
     * 
     * @param username 用户名
     * @return 用户信息对象
     */
    private UserInfo loadUserFromDatabase(String username) {
        // TODO: 实现数据库查询逻辑
        // 示例代码，需要替换为实际的数据库查询
        if ("admin".equals(username)) {
            return UserInfo.builder()
                    .id(1L)
                    .username("admin")
                    .password("$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG") // "password"
                    .email("admin@leadexchange.com")
                    .phone("13800138000")
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .roles(List.of("ADMIN", "USER"))
                    .build();
        } else if ("user".equals(username)) {
            return UserInfo.builder()
                    .id(2L)
                    .username("user")
                    .password("$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG") // "password"
                    .email("user@leadexchange.com")
                    .phone("13800138001")
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .roles(List.of("USER"))
                    .build();
        }
        
        return null;
    }

    /**
     * 验证用户状态
     * 
     * @param userInfo 用户信息
     * @throws UsernameNotFoundException 用户状态异常
     */
    private void validateUserStatus(UserInfo userInfo) throws UsernameNotFoundException {
        if (!userInfo.isEnabled()) {
            throw new UsernameNotFoundException("用户账户已被禁用");
        }
        
        if (!userInfo.isAccountNonLocked()) {
            throw new UsernameNotFoundException("用户账户已被锁定");
        }
        
        if (!userInfo.isAccountNonExpired()) {
            throw new UsernameNotFoundException("用户账户已过期");
        }
        
        if (!userInfo.isCredentialsNonExpired()) {
            throw new UsernameNotFoundException("用户凭证已过期");
        }
    }

    /**
     * 获取用户权限列表
     * 
     * @param userInfo 用户信息
     * @return 权限集合
     */
    private Collection<? extends GrantedAuthority> getUserAuthorities(UserInfo userInfo) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // 添加角色权限
        if (userInfo.getRoles() != null) {
            for (String role : userInfo.getRoles()) {
                authorities.add(new SimpleGrantedAuthority(SecurityConstants.AUTHORITY.PREFIX + role));
            }
        }
        
        // TODO: 添加具体的功能权限
        // 可以根据角色查询具体的功能权限
        
        log.debug("用户 '{}' 的权限: {}", userInfo.getUsername(), authorities);
        return authorities;
    }

    /**
     * 用户信息内部类
     * TODO: 后续可以替换为实际的用户实体类
     */
    @lombok.Data
    @lombok.Builder
    private static class UserInfo {
        private Long id;
        private String username;
        private String password;
        private String email;
        private String phone;
        private boolean enabled;
        private boolean accountNonExpired;
        private boolean accountNonLocked;
        private boolean credentialsNonExpired;
        private List<String> roles;
    }
}