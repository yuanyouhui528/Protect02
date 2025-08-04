package com.leadexchange.modules.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.leadexchange.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

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
@Data
@EqualsAndHashCode(callSuper = true)
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

}