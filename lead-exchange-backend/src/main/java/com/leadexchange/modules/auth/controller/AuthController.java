package com.leadexchange.modules.auth.controller;

import com.leadexchange.common.result.Result;
import com.leadexchange.common.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 * 提供用户登录、注册、令牌刷新等认证相关的API接口
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // TODO: 注入用户服务
    // @Autowired
    // private UserService userService;

    /**
     * 用户登录
     * 
     * @param loginRequest 登录请求
     * @return 登录响应，包含JWT令牌
     */
    @PostMapping("/login")
    public ResponseEntity<Result<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            log.info("用户登录请求，用户名: {}", loginRequest.getUsername());
            
            // 执行认证
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            // 生成JWT令牌
            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication.getName());
            
            // 构建响应
            LoginResponse response = LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpiration() / 1000) // 转换为秒
                .username(authentication.getName())
                .build();
            
            log.info("用户登录成功，用户名: {}", loginRequest.getUsername());
            return ResponseEntity.ok(Result.success(response, "登录成功"));
            
        } catch (AuthenticationException ex) {
            log.warn("用户登录失败，用户名: {}, 原因: {}", loginRequest.getUsername(), ex.getMessage());
            return ResponseEntity.badRequest().body(Result.error("用户名或密码错误"));
        } catch (Exception ex) {
            log.error("用户登录异常，用户名: {}, 错误: {}", loginRequest.getUsername(), ex.getMessage());
            return ResponseEntity.internalServerError().body(Result.error("登录失败，请稍后重试"));
        }
    }

    /**
     * 用户注册
     * TODO: 实现用户注册逻辑
     * 
     * @param registerRequest 注册请求
     * @return 注册响应
     */
    @PostMapping("/register")
    public ResponseEntity<Result<RegisterResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            log.info("用户注册请求，用户名: {}, 邮箱: {}", registerRequest.getUsername(), registerRequest.getEmail());
            
            // TODO: 实现用户注册逻辑
            // 1. 验证用户名和邮箱是否已存在
            // 2. 加密密码
            // 3. 保存用户信息
            // 4. 发送验证邮件（可选）
            
            String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
            log.debug("密码加密完成，用户名: {}", registerRequest.getUsername());
            
            // 模拟注册成功响应
            RegisterResponse response = RegisterResponse.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .message("注册成功，请登录")
                .build();
            
            log.info("用户注册成功，用户名: {}", registerRequest.getUsername());
            return ResponseEntity.ok(Result.success(response, "注册成功"));
            
        } catch (Exception ex) {
            log.error("用户注册异常，用户名: {}, 错误: {}", registerRequest.getUsername(), ex.getMessage());
            return ResponseEntity.internalServerError().body(Result.error("注册失败，请稍后重试"));
        }
    }

    /**
     * 刷新访问令牌
     * 
     * @param refreshRequest 刷新令牌请求
     * @return 新的访问令牌
     */
    @PostMapping("/refresh")
    public ResponseEntity<Result<RefreshResponse>> refresh(@Valid @RequestBody RefreshRequest refreshRequest) {
        try {
            String refreshToken = refreshRequest.getRefreshToken();
            
            // 验证刷新令牌
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                return ResponseEntity.badRequest().body(Result.error("刷新令牌无效"));
            }
            
            // 检查是否为刷新令牌
            if (!jwtTokenProvider.isRefreshToken(refreshToken)) {
                return ResponseEntity.badRequest().body(Result.error("令牌类型错误"));
            }
            
            // 从刷新令牌中获取用户名
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            
            // TODO: 验证用户是否仍然有效
            // 可以检查用户是否被禁用、删除等
            
            // 生成新的访问令牌
            // 注意：这里需要重新构建Authentication对象
            // 为了简化，这里直接使用用户名生成令牌
            // 实际项目中应该重新加载用户信息和权限
            
            RefreshResponse response = RefreshResponse.builder()
                .accessToken("new-access-token") // TODO: 生成新的访问令牌
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpiration() / 1000)
                .build();
            
            log.info("令牌刷新成功，用户名: {}", username);
            return ResponseEntity.ok(Result.success(response, "令牌刷新成功"));
            
        } catch (Exception ex) {
            log.error("令牌刷新异常，错误: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(Result.error("令牌刷新失败"));
        }
    }

    /**
     * 用户登出
     * 
     * @param logoutRequest 登出请求
     * @return 登出响应
     */
    @PostMapping("/logout")
    public ResponseEntity<Result<String>> logout(@Valid @RequestBody LogoutRequest logoutRequest) {
        try {
            // TODO: 实现登出逻辑
            // 1. 将令牌加入黑名单
            // 2. 清除相关缓存
            
            log.info("用户登出成功");
            return ResponseEntity.ok(Result.success("登出成功"));
            
        } catch (Exception ex) {
            log.error("用户登出异常，错误: {}", ex.getMessage());
            return ResponseEntity.internalServerError().body(Result.error("登出失败"));
        }
    }

    /**
     * 获取当前用户信息
     * 
     * @return 当前用户信息
     */
    @GetMapping("/me")
    public ResponseEntity<Result<UserInfo>> getCurrentUser() {
        try {
            // TODO: 从SecurityContext获取当前用户信息
            
            UserInfo userInfo = UserInfo.builder()
                .username("current-user")
                .email("user@example.com")
                .roles(java.util.List.of("USER"))
                .build();
            
            return ResponseEntity.ok(Result.success(userInfo, "获取用户信息成功"));
            
        } catch (Exception ex) {
            log.error("获取用户信息异常，错误: {}", ex.getMessage());
            return ResponseEntity.internalServerError().body(Result.error("获取用户信息失败"));
        }
    }

    // ==================== 请求和响应DTO类 ====================

    /**
     * 登录请求DTO
     */
    @lombok.Data
    public static class LoginRequest {
        @NotBlank(message = "用户名不能为空")
        private String username;
        
        @NotBlank(message = "密码不能为空")
        private String password;
        
        private Boolean rememberMe = false;
    }

    /**
     * 登录响应DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType;
        private Long expiresIn;
        private String username;
    }

    /**
     * 注册请求DTO
     */
    @lombok.Data
    public static class RegisterRequest {
        @NotBlank(message = "用户名不能为空")
        private String username;
        
        @NotBlank(message = "密码不能为空")
        private String password;
        
        @NotBlank(message = "邮箱不能为空")
        private String email;
        
        private String phone;
    }

    /**
     * 注册响应DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class RegisterResponse {
        private String username;
        private String email;
        private String message;
    }

    /**
     * 刷新令牌请求DTO
     */
    @lombok.Data
    public static class RefreshRequest {
        @NotBlank(message = "刷新令牌不能为空")
        private String refreshToken;
    }

    /**
     * 刷新令牌响应DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class RefreshResponse {
        private String accessToken;
        private String tokenType;
        private Long expiresIn;
    }

    /**
     * 登出请求DTO
     */
    @lombok.Data
    public static class LogoutRequest {
        private String accessToken;
    }

    /**
     * 用户信息DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class UserInfo {
        private String username;
        private String email;
        private java.util.List<String> roles;
    }
}