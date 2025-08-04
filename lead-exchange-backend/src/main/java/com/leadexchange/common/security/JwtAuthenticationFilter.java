package com.leadexchange.common.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JWT认证过滤器
 * 拦截HTTP请求，验证JWT令牌并设置安全上下文
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * 执行过滤逻辑
     * 
     * @param request HTTP请求
     * @param response HTTP响应
     * @param filterChain 过滤器链
     * @throws ServletException Servlet异常
     * @throws IOException IO异常
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // 从请求中获取JWT令牌
            String jwt = getJwtFromRequest(request);
            
            // 验证JWT令牌并设置认证信息
            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                // 检查是否为访问令牌（非刷新令牌）
                if (!jwtTokenProvider.isRefreshToken(jwt)) {
                    setAuthenticationContext(jwt, request);
                } else {
                    log.warn("尝试使用刷新令牌进行API访问，请求路径: {}", request.getRequestURI());
                }
            }
        } catch (Exception ex) {
            log.error("无法设置用户认证信息: {}", ex.getMessage());
        }
        
        // 继续执行过滤器链
        filterChain.doFilter(request, response);
    }

    /**
     * 从HTTP请求中提取JWT令牌
     * 
     * @param request HTTP请求
     * @return JWT令牌字符串，如果不存在则返回null
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(SecurityConstants.JWT.HEADER_STRING);
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(SecurityConstants.JWT.TOKEN_PREFIX)) {
            return bearerToken.substring(SecurityConstants.JWT.TOKEN_PREFIX.length());
        }
        
        return null;
    }

    /**
     * 设置认证上下文
     * 
     * @param jwt JWT令牌
     * @param request HTTP请求
     */
    private void setAuthenticationContext(String jwt, HttpServletRequest request) {
        try {
            // 从JWT令牌中获取用户信息
            String username = jwtTokenProvider.getUsernameFromToken(jwt);
            List<String> authorities = jwtTokenProvider.getAuthoritiesFromToken(jwt);
            
            if (username != null && authorities != null) {
                // 创建用户详情对象
                UserDetails userDetails = createUserDetails(username, authorities);
                
                // 创建认证令牌
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, 
                        null, 
                        userDetails.getAuthorities()
                    );
                
                // 设置认证详情
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // 设置安全上下文
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                log.debug("用户 '{}' 认证成功，权限: {}", username, authorities);
            }
        } catch (Exception ex) {
            log.error("设置认证上下文失败: {}", ex.getMessage());
            SecurityContextHolder.clearContext();
        }
    }

    /**
     * 创建用户详情对象
     * 
     * @param username 用户名
     * @param authorities 权限列表
     * @return UserDetails对象
     */
    private UserDetails createUserDetails(String username, List<String> authorities) {
        List<SimpleGrantedAuthority> grantedAuthorities = authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        
        return User.builder()
                .username(username)
                .password("") // JWT认证不需要密码
                .authorities(grantedAuthorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }

    /**
     * 判断是否应该跳过过滤
     * 对于某些特定路径（如登录、注册等），可以跳过JWT验证
     * 
     * @param request HTTP请求
     * @return 是否跳过过滤
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        
        // 跳过认证相关的API路径
        return path.startsWith("/api/auth/login") ||
               path.startsWith("/api/auth/register") ||
               path.startsWith("/api/public/") ||
               path.startsWith("/actuator/") ||
               path.startsWith("/swagger-ui/") ||
               path.startsWith("/v3/api-docs/") ||
               path.equals("/favicon.ico") ||
               path.startsWith("/static/");
    }
}