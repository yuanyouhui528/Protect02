package com.leadexchange.common.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * Spring Security安全配置类
 * 配置HTTP安全、认证管理器、密码编码器等核心安全组件
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
    prePostEnabled = true,  // 启用@PreAuthorize和@PostAuthorize注解
    securedEnabled = true,  // 启用@Secured注解
    jsr250Enabled = true    // 启用@RolesAllowed注解
)
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * 密码编码器Bean
     * 使用BCrypt算法进行密码加密
     * 
     * @return BCryptPasswordEncoder实例
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // 使用强度为12的BCrypt
    }

    /**
     * 认证提供者Bean
     * 配置用户详情服务和密码编码器
     * 
     * @return DaoAuthenticationProvider实例
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setHideUserNotFoundExceptions(false); // 显示用户不存在异常
        return authProvider;
    }

    /**
     * 认证管理器Bean
     * 
     * @param authConfig 认证配置
     * @return AuthenticationManager实例
     * @throws Exception 配置异常
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * 安全过滤器链配置
     * 配置HTTP安全策略、CORS、CSRF、会话管理等
     * 
     * @param http HttpSecurity对象
     * @return SecurityFilterChain实例
     * @throws Exception 配置异常
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 禁用CSRF（使用JWT令牌，无需CSRF保护）
            .csrf().disable()
            
            // 配置CORS
            .cors().configurationSource(corsConfigurationSource())
            
            .and()
            
            // 配置会话管理（无状态）
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            
            .and()
            
            // 配置HTTP安全头
            .headers(headers -> headers
                .frameOptions().deny() // 禁用X-Frame-Options
                .contentTypeOptions().and() // 启用X-Content-Type-Options
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000) // HSTS最大年龄1年
                    .includeSubDomains(true) // 包含子域名
                )
                .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
            )
            
            // 配置授权规则
            .authorizeHttpRequests(authz -> authz
                // 公开访问的端点
                .antMatchers(
                    "/api/auth/**",
                    "/api/public/**",
                    "/actuator/health",
                    "/actuator/info",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/favicon.ico",
                    "/static/**"
                ).permitAll()
                
                // OPTIONS请求允许所有人访问（CORS预检请求）
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // 管理员专用端点
                .antMatchers("/api/admin/**")
                    .hasRole(SecurityConstants.AUTHORITY.ADMIN)
                
                // 用户管理相关端点
                .antMatchers(HttpMethod.GET, "/api/user/profile")
                    .hasAnyRole(SecurityConstants.AUTHORITY.USER, SecurityConstants.AUTHORITY.ADMIN)
                .antMatchers(HttpMethod.PUT, "/api/user/profile")
                    .hasAnyRole(SecurityConstants.AUTHORITY.USER, SecurityConstants.AUTHORITY.ADMIN)
                
                // 线索管理相关端点
                .antMatchers("/api/lead/**")
                    .hasAnyRole(SecurityConstants.AUTHORITY.USER, SecurityConstants.AUTHORITY.ENTERPRISE, SecurityConstants.AUTHORITY.ADMIN)
                
                // 评级引擎相关端点
                .antMatchers("/api/rating/**")
                    .hasAnyRole(SecurityConstants.AUTHORITY.USER, SecurityConstants.AUTHORITY.ADMIN)
                
                // 交换引擎相关端点
                .antMatchers("/api/exchange/**")
                    .hasAnyRole(SecurityConstants.AUTHORITY.USER, SecurityConstants.AUTHORITY.ENTERPRISE, SecurityConstants.AUTHORITY.ADMIN)
                
                // 数据分析相关端点
                .antMatchers("/api/analytics/**")
                    .hasAnyRole(SecurityConstants.AUTHORITY.ADMIN, SecurityConstants.AUTHORITY.ENTERPRISE)
                
                // 通知服务相关端点
                .antMatchers("/api/notification/**")
                    .hasAnyRole(SecurityConstants.AUTHORITY.USER, SecurityConstants.AUTHORITY.ADMIN)
                
                // 其他所有请求都需要认证
                .anyRequest().authenticated()
            )
            
            // 配置认证提供者
            .authenticationProvider(authenticationProvider())
            
            // 添加JWT认证过滤器
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS配置源
     * 配置跨域资源共享策略
     * 
     * @return CorsConfigurationSource实例
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 允许的源（生产环境应该配置具体的域名）
        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
        
        // 允许的HTTP方法
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // 允许的请求头
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // 暴露的响应头
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Authorization"
        ));
        
        // 允许发送凭证
        configuration.setAllowCredentials(true);
        
        // 预检请求缓存时间（秒）
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}