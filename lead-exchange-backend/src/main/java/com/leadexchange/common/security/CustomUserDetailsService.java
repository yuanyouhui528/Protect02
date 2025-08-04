package com.leadexchange.common.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@Service
@Transactional(readOnly = true)
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

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

        // Getters
        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getPassword() { return password; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public boolean isEnabled() { return enabled; }
        public boolean isAccountNonExpired() { return accountNonExpired; }
        public boolean isAccountNonLocked() { return accountNonLocked; }
        public boolean isCredentialsNonExpired() { return credentialsNonExpired; }
        public List<String> getRoles() { return roles; }

        // Setters
        public void setId(Long id) { this.id = id; }
        public void setUsername(String username) { this.username = username; }
        public void setPassword(String password) { this.password = password; }
        public void setEmail(String email) { this.email = email; }
        public void setPhone(String phone) { this.phone = phone; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public void setAccountNonExpired(boolean accountNonExpired) { this.accountNonExpired = accountNonExpired; }
        public void setAccountNonLocked(boolean accountNonLocked) { this.accountNonLocked = accountNonLocked; }
        public void setCredentialsNonExpired(boolean credentialsNonExpired) { this.credentialsNonExpired = credentialsNonExpired; }
        public void setRoles(List<String> roles) { this.roles = roles; }

        // Builder pattern
        public static UserInfoBuilder builder() {
            return new UserInfoBuilder();
        }

        public static class UserInfoBuilder {
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

            public UserInfoBuilder id(Long id) { this.id = id; return this; }
            public UserInfoBuilder username(String username) { this.username = username; return this; }
            public UserInfoBuilder password(String password) { this.password = password; return this; }
            public UserInfoBuilder email(String email) { this.email = email; return this; }
            public UserInfoBuilder phone(String phone) { this.phone = phone; return this; }
            public UserInfoBuilder enabled(boolean enabled) { this.enabled = enabled; return this; }
            public UserInfoBuilder accountNonExpired(boolean accountNonExpired) { this.accountNonExpired = accountNonExpired; return this; }
            public UserInfoBuilder accountNonLocked(boolean accountNonLocked) { this.accountNonLocked = accountNonLocked; return this; }
            public UserInfoBuilder credentialsNonExpired(boolean credentialsNonExpired) { this.credentialsNonExpired = credentialsNonExpired; return this; }
            public UserInfoBuilder roles(List<String> roles) { this.roles = roles; return this; }

            public UserInfo build() {
                UserInfo userInfo = new UserInfo();
                userInfo.setId(this.id);
                userInfo.setUsername(this.username);
                userInfo.setPassword(this.password);
                userInfo.setEmail(this.email);
                userInfo.setPhone(this.phone);
                userInfo.setEnabled(this.enabled);
                userInfo.setAccountNonExpired(this.accountNonExpired);
                userInfo.setAccountNonLocked(this.accountNonLocked);
                userInfo.setCredentialsNonExpired(this.credentialsNonExpired);
                userInfo.setRoles(this.roles);
                return userInfo;
            }
        }
    }
}