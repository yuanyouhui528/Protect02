package com.leadexchange.modules.lead.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leadexchange.modules.lead.entity.Lead;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 线索Mapper接口
 * 继承MyBatis Plus的BaseMapper，提供基础CRUD操作
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@Mapper
public interface LeadMapper extends BaseMapper<Lead> {

    /**
     * 分页查询线索列表
     * 
     * @param page 分页参数
     * @param leadType 线索类型（可选）
     * @param status 线索状态（可选）
     * @param rating 线索评级（可选）
     * @param industry 所属行业（可选）
     * @param region 所在地区（可选）
     * @param keyword 搜索关键词（可选）
     * @return 线索分页列表
     */
    IPage<Lead> selectLeadPage(Page<Lead> page,
                              @Param("leadType") Integer leadType,
                              @Param("status") Integer status,
                              @Param("rating") String rating,
                              @Param("industry") String industry,
                              @Param("region") String region,
                              @Param("keyword") String keyword);

    /**
     * 根据用户ID查询线索列表
     * 
     * @param userId 用户ID
     * @param status 线索状态（可选）
     * @return 线索列表
     */
    @Select("<script>" +
            "SELECT * FROM biz_lead WHERE create_by = #{userId} AND deleted = 0" +
            "<if test='status != null'> AND status = #{status}</if>" +
            " ORDER BY create_time DESC" +
            "</script>")
    List<Lead> findByUserId(@Param("userId") Long userId, @Param("status") Integer status);

    /**
     * 根据行业查询线索
     * 
     * @param industry 行业
     * @param status 状态（可选）
     * @return 线索列表
     */
    @Select("<script>" +
            "SELECT * FROM biz_lead WHERE industry = #{industry} AND deleted = 0" +
            "<if test='status != null'> AND status = #{status}</if>" +
            " ORDER BY rating_score DESC, create_time DESC" +
            "</script>")
    List<Lead> findByIndustry(@Param("industry") String industry, @Param("status") Integer status);

    /**
     * 根据地区查询线索
     * 
     * @param region 地区
     * @param status 状态（可选）
     * @return 线索列表
     */
    @Select("<script>" +
            "SELECT * FROM biz_lead WHERE region = #{region} AND deleted = 0" +
            "<if test='status != null'> AND status = #{status}</if>" +
            " ORDER BY rating_score DESC, create_time DESC" +
            "</script>")
    List<Lead> findByRegion(@Param("region") String region, @Param("status") Integer status);

    /**
     * 根据评级查询线索
     * 
     * @param rating 评级
     * @param status 状态（可选）
     * @return 线索列表
     */
    @Select("<script>" +
            "SELECT * FROM biz_lead WHERE rating = #{rating} AND deleted = 0" +
            "<if test='status != null'> AND status = #{status}</if>" +
            " ORDER BY create_time DESC" +
            "</script>")
    List<Lead> findByRating(@Param("rating") String rating, @Param("status") Integer status);

    /**
     * 查询热门线索（按浏览次数排序）
     * 
     * @param limit 限制数量
     * @return 热门线索列表
     */
    @Select("SELECT * FROM biz_lead WHERE status = 3 AND deleted = 0 " +
            "ORDER BY view_count DESC, favorite_count DESC LIMIT #{limit}")
    List<Lead> findHotLeads(@Param("limit") Integer limit);

    /**
     * 查询推荐线索
     * 
     * @param limit 限制数量
     * @return 推荐线索列表
     */
    @Select("SELECT * FROM biz_lead WHERE is_recommend = 1 AND status = 3 AND deleted = 0 " +
            "ORDER BY rating_score DESC, create_time DESC LIMIT #{limit}")
    List<Lead> findRecommendLeads(@Param("limit") Integer limit);

    /**
     * 查询置顶线索
     * 
     * @return 置顶线索列表
     */
    @Select("SELECT * FROM biz_lead WHERE is_top = 1 AND status = 3 AND deleted = 0 " +
            "ORDER BY create_time DESC")
    List<Lead> findTopLeads();

    /**
     * 查询即将过期的线索
     * 
     * @param expireTime 过期时间阈值
     * @return 即将过期的线索列表
     */
    @Select("SELECT * FROM biz_lead WHERE expire_time <= #{expireTime} AND status IN (1,2,3,4) AND deleted = 0 " +
            "ORDER BY expire_time ASC")
    List<Lead> findExpiringLeads(@Param("expireTime") LocalDateTime expireTime);

    /**
     * 统计线索数量
     * 
     * @param leadType 线索类型（可选）
     * @param status 线索状态（可选）
     * @param rating 线索评级（可选）
     * @return 线索数量
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM biz_lead WHERE deleted = 0" +
            "<if test='leadType != null'> AND lead_type = #{leadType}</if>" +
            "<if test='status != null'> AND status = #{status}</if>" +
            "<if test='rating != null and rating != \\'\\''> AND rating = #{rating}</if>" +
            "</script>")
    Long countLeads(@Param("leadType") Integer leadType, 
                   @Param("status") Integer status, 
                   @Param("rating") String rating);

    /**
     * 统计各评级线索数量
     * 
     * @return 评级统计结果
     */
    @Select("SELECT rating, COUNT(*) as count FROM biz_lead " +
            "WHERE deleted = 0 AND status = 3 GROUP BY rating")
    List<Map<String, Object>> countByRating();

    /**
     * 统计各行业线索数量
     * 
     * @return 行业统计结果
     */
    @Select("SELECT industry, COUNT(*) as count FROM biz_lead " +
            "WHERE deleted = 0 AND status = 3 GROUP BY industry ORDER BY count DESC")
    List<Map<String, Object>> countByIndustry();

    /**
     * 统计各地区线索数量
     * 
     * @return 地区统计结果
     */
    @Select("SELECT region, COUNT(*) as count FROM biz_lead " +
            "WHERE deleted = 0 AND status = 3 GROUP BY region ORDER BY count DESC")
    List<Map<String, Object>> countByRegion();

    /**
     * 增加浏览次数
     * 
     * @param leadId 线索ID
     * @return 更新结果
     */
    @Update("UPDATE biz_lead SET view_count = view_count + 1, update_time = NOW() " +
            "WHERE id = #{leadId} AND deleted = 0")
    int incrementViewCount(@Param("leadId") Long leadId);

    /**
     * 增加收藏次数
     * 
     * @param leadId 线索ID
     * @return 更新结果
     */
    @Update("UPDATE biz_lead SET favorite_count = favorite_count + 1, update_time = NOW() " +
            "WHERE id = #{leadId} AND deleted = 0")
    int incrementFavoriteCount(@Param("leadId") Long leadId);

    /**
     * 减少收藏次数
     * 
     * @param leadId 线索ID
     * @return 更新结果
     */
    @Update("UPDATE biz_lead SET favorite_count = GREATEST(favorite_count - 1, 0), update_time = NOW() " +
            "WHERE id = #{leadId} AND deleted = 0")
    int decrementFavoriteCount(@Param("leadId") Long leadId);

    /**
     * 增加交换次数
     * 
     * @param leadId 线索ID
     * @return 更新结果
     */
    @Update("UPDATE biz_lead SET exchange_count = exchange_count + 1, update_time = NOW() " +
            "WHERE id = #{leadId} AND deleted = 0")
    int incrementExchangeCount(@Param("leadId") Long leadId);

    /**
     * 批量更新线索状态
     * 
     * @param leadIds 线索ID列表
     * @param status 新状态
     * @param updateBy 更新人
     * @return 更新数量
     */
    int batchUpdateStatus(@Param("leadIds") List<Long> leadIds, 
                         @Param("status") Integer status, 
                         @Param("updateBy") Long updateBy);

    /**
     * 清理过期线索
     * 
     * @param currentTime 当前时间
     * @return 清理数量
     */
    int cleanExpiredLeads(@Param("currentTime") LocalDateTime currentTime);

}