package com.leadexchange.common.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * JWT令牌提供者
 * 负责JWT令牌的生成、验证、解析等操作
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    /** JWT签名密钥 */
    private final SecretKey secretKey;

    /** JWT令牌过期时间 */
    @Value("${app.jwt.expiration:86400000}")
    private long jwtExpiration;

    /** 刷新令牌过期时间 */
    @Value("${app.jwt.refresh-expiration:604800000}")
    private long refreshExpiration;

    /**
     * 构造函数，初始化JWT签名密钥
     */
    public JwtTokenProvider() {
        // 使用HMAC-SHA算法生成密钥
        this.secretKey = Keys.hmacShaKeyFor(SecurityConstants.JWT.SECRET.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 生成JWT访问令牌
     * 
     * @param authentication 认证信息
     * @return JWT令牌字符串
     */
    public String generateAccessToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpiration);

        // 获取用户权限列表
        List<String> authorities = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .setIssuer(SecurityConstants.JWT.ISSUER)
                .setAudience(SecurityConstants.JWT.AUDIENCE)
                .claim("authorities", authorities)
                .claim("type", "access")
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 生成JWT刷新令牌
     * 
     * @param username 用户名
     * @return 刷新令牌字符串
     */
    public String generateRefreshToken(String username) {
        Date expiryDate = new Date(System.currentTimeMillis() + refreshExpiration);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .setIssuer(SecurityConstants.JWT.ISSUER)
                .setAudience(SecurityConstants.JWT.AUDIENCE)
                .claim("type", "refresh")
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 从JWT令牌中获取用户名
     * 
     * @param token JWT令牌
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getSubject();
    }

    /**
     * 从JWT令牌中获取权限列表
     * 
     * @param token JWT令牌
     * @return 权限列表
     */
    @SuppressWarnings("unchecked")
    public List<String> getAuthoritiesFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return (List<String>) claims.get("authorities");
    }

    /**
     * 获取JWT令牌的过期时间
     * 
     * @param token JWT令牌
     * @return 过期时间
     */
    public Date getExpirationDateFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getExpiration();
    }

    /**
     * 验证JWT令牌是否有效
     * 
     * @param token JWT令牌
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException ex) {
            log.error("JWT令牌签名无效: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.error("JWT令牌格式错误: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("JWT令牌已过期: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("不支持的JWT令牌: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("JWT令牌参数为空: {}", ex.getMessage());
        }
        return false;
    }

    /**
     * 检查JWT令牌是否过期
     * 
     * @param token JWT令牌
     * @return 是否过期
     */
    public boolean isTokenExpired(String token) {
        Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     * 检查是否为刷新令牌
     * 
     * @param token JWT令牌
     * @return 是否为刷新令牌
     */
    public boolean isRefreshToken(String token) {
        Claims claims = getClaimsFromToken(token);
        String type = (String) claims.get("type");
        return "refresh".equals(type);
    }

    /**
     * 从JWT令牌中解析Claims
     * 
     * @param token JWT令牌
     * @return Claims对象
     */
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 获取JWT令牌过期时间（毫秒）
     * 
     * @return 过期时间
     */
    public long getJwtExpiration() {
        return jwtExpiration;
    }

    /**
     * 获取刷新令牌过期时间（毫秒）
     * 
     * @return 刷新令牌过期时间
     */
    public long getRefreshExpiration() {
        return refreshExpiration;
    }
}