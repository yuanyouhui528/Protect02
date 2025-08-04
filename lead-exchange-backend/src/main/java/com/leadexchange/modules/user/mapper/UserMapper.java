package com.leadexchange.modules.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leadexchange.modules.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 用户Mapper接口
 * 继承MyBatis Plus的BaseMapper，提供基础CRUD操作
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

    /**
     * 根据用户名查询用户
     * 
     * @param username 用户名
     * @return 用户信息
     */
    @Select("SELECT * FROM sys_user WHERE username = #{username} AND deleted = 0")
    User findByUsername(@Param("username") String username);

    /**
     * 根据邮箱查询用户
     * 
     * @param email 邮箱
     * @return 用户信息
     */
    @Select("SELECT * FROM sys_user WHERE email = #{email} AND deleted = 0")
    User findByEmail(@Param("email") String email);

    /**
     * 根据手机号查询用户
     * 
     * @param phone 手机号
     * @return 用户信息
     */
    @Select("SELECT * FROM sys_user WHERE phone = #{phone} AND deleted = 0")
    User findByPhone(@Param("phone") String phone);

    /**
     * 分页查询用户列表
     * 
     * @param page 分页参数
     * @param userType 用户类型（可选）
     * @param status 用户状态（可选）
     * @param keyword 搜索关键词（可选）
     * @return 用户分页列表
     */
    IPage<User> selectUserPage(Page<User> page, 
                              @Param("userType") Integer userType,
                              @Param("status") Integer status,
                              @Param("keyword") String keyword);

    /**
     * 根据企业统一社会信用代码查询用户
     * 
     * @param companyCode 企业统一社会信用代码
     * @return 用户信息
     */
    @Select("SELECT * FROM sys_user WHERE company_code = #{companyCode} AND deleted = 0")
    User findByCompanyCode(@Param("companyCode") String companyCode);

    /**
     * 查询指定行业的企业用户
     * 
     * @param industry 行业
     * @return 企业用户列表
     */
    @Select("SELECT * FROM sys_user WHERE industry = #{industry} AND user_type = 2 AND deleted = 0")
    List<User> findByIndustry(@Param("industry") String industry);

    /**
     * 查询指定地区的用户
     * 
     * @param region 地区
     * @return 用户列表
     */
    @Select("SELECT * FROM sys_user WHERE region = #{region} AND deleted = 0")
    List<User> findByRegion(@Param("region") String region);

    /**
     * 统计用户数量
     * 
     * @param userType 用户类型（可选）
     * @param status 用户状态（可选）
     * @return 用户数量
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM sys_user WHERE deleted = 0" +
            "<if test='userType != null'> AND user_type = #{userType}</if>" +
            "<if test='status != null'> AND status = #{status}</if>" +
            "</script>")
    Long countUsers(@Param("userType") Integer userType, @Param("status") Integer status);

}