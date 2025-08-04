package com.leadexchange.modules.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.leadexchange.common.entity.BaseEntity;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * 用户实体类
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@TableName("sys_user")
public class User extends BaseEntity {

    /**
     * 用户名
     */
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20个字符之间")
    @TableField("username")
    private String username;

    /**
     * 密码（加密后）
     */
    @NotBlank(message = "密码不能为空")
    @TableField("password")
    private String password;

    /**
     * 真实姓名
     */
    @NotBlank(message = "真实姓名不能为空")
    @Size(max = 50, message = "真实姓名长度不能超过50个字符")
    @TableField("real_name")
    private String realName;

    /**
     * 邮箱
     */
    @Email(message = "邮箱格式不正确")
    @TableField("email")
    private String email;

    /**
     * 手机号
     */
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @TableField("phone")
    private String phone;

    /**
     * 用户状态（0：禁用，1：启用）
     */
    @TableField("status")
    private Integer status;

    /**
     * 用户类型（1：个人用户，2：企业用户，3：管理员）
     */
    @TableField("user_type")
    private Integer userType;

    /**
     * 企业名称（企业用户专用）
     */
    @TableField("company_name")
    private String companyName;

    /**
     * 企业统一社会信用代码（企业用户专用）
     */
    @TableField("company_code")
    private String companyCode;

    /**
     * 企业规模（1：小微企业，2：中小企业，3：大型企业）
     */
    @TableField("company_scale")
    private Integer companyScale;

    /**
     * 所属行业
     */
    @TableField("industry")
    private String industry;

    /**
     * 所在地区
     */
    @TableField("region")
    private String region;

    /**
     * 用户头像URL
     */
    @TableField("avatar")
    private String avatar;

    /**
     * 最后登录时间
     */
    @TableField("last_login_time")
    private java.time.LocalDateTime lastLoginTime;

    /**
     * 最后登录IP
     */
    @TableField("last_login_ip")
    private String lastLoginIp;

    /**
     * 登录失败次数
     */
    @TableField("login_fail_count")
    private Integer loginFailCount;

    /**
     * 账户锁定时间
     */
    @TableField("lock_time")
    private java.time.LocalDateTime lockTime;

    /**
     * 备注
     */
    @TableField("remark")
    private String remark;

    // Getter和Setter方法
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getUserType() {
        return userType;
    }

    public void setUserType(Integer userType) {
        this.userType = userType;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public Integer getCompanyScale() {
        return companyScale;
    }

    public void setCompanyScale(Integer companyScale) {
        this.companyScale = companyScale;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public java.time.LocalDateTime getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(java.time.LocalDateTime lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public String getLastLoginIp() {
        return lastLoginIp;
    }

    public void setLastLoginIp(String lastLoginIp) {
        this.lastLoginIp = lastLoginIp;
    }

    public Integer getLoginFailCount() {
        return loginFailCount;
    }

    public void setLoginFailCount(Integer loginFailCount) {
        this.loginFailCount = loginFailCount;
    }

    public java.time.LocalDateTime getLockTime() {
        return lockTime;
    }

    public void setLockTime(java.time.LocalDateTime lockTime) {
        this.lockTime = lockTime;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}