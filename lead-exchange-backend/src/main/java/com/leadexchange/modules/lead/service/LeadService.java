package com.leadexchange.modules.lead.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.leadexchange.modules.lead.entity.Lead;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 线索服务接口
 * 提供线索管理的核心业务逻辑
 * 
 * @author leadexchange
 * @since 2024-01-01
 */
public interface LeadService extends IService<Lead> {

    /**
     * 分页查询线索列表
     * 支持多条件筛选和关键词搜索
     * 
     * @param page 页码
     * @param size 每页大小
     * @param leadType 线索类型 (1-投资需求, 2-项目推介, 3-合作机会)
     * @param status 状态 (1-草稿, 2-审核中, 3-已发布, 4-交换中, 5-已成交, 6-已下架)
     * @param rating 评级 (A/B/C/D)
     * @param industry 行业
     * @param region 地区
     * @param keyword 搜索关键词
     * @return 分页结果
     */
    IPage<Lead> getLeadPage(Integer page, Integer size, Integer leadType, Integer status, 
                           String rating, String industry, String region, String keyword);

    /**
     * 根据用户ID查询线索列表
     * 
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页大小
     * @return 分页结果
     */
    IPage<Lead> getLeadsByUserId(Long userId, Integer page, Integer size);

    /**
     * 根据行业查询线索列表
     * 
     * @param industry 行业
     * @param page 页码
     * @param size 每页大小
     * @return 分页结果
     */
    IPage<Lead> getLeadsByIndustry(String industry, Integer page, Integer size);

    /**
     * 根据地区查询线索列表
     * 
     * @param region 地区
     * @param page 页码
     * @param size 每页大小
     * @return 分页结果
     */
    IPage<Lead> getLeadsByRegion(String region, Integer page, Integer size);

    /**
     * 根据评级查询线索列表
     * 
     * @param rating 评级
     * @param page 页码
     * @param size 每页大小
     * @return 分页结果
     */
    IPage<Lead> getLeadsByRating(String rating, Integer page, Integer size);

    /**
     * 获取热门线索
     * 基于浏览量、收藏量、交换量等指标排序
     * 
     * @param limit 数量限制
     * @return 热门线索列表
     */
    List<Lead> getHotLeads(Integer limit);

    /**
     * 获取推荐线索
     * 基于置顶和推荐标识
     * 
     * @param limit 数量限制
     * @return 推荐线索列表
     */
    List<Lead> getRecommendedLeads(Integer limit);

    /**
     * 获取置顶线索
     * 
     * @param limit 数量限制
     * @return 置顶线索列表
     */
    List<Lead> getTopLeads(Integer limit);

    /**
     * 智能推荐线索
     * 基于用户画像和偏好进行个性化推荐
     * 
     * @param userId 用户ID
     * @param userIndustry 用户所在行业
     * @param userRegion 用户所在地区
     * @param minInvestment 最小投资金额
     * @param maxInvestment 最大投资金额
     * @param limit 推荐数量
     * @return 推荐线索列表
     */
    List<Lead> getSmartRecommendations(Long userId, String userIndustry, String userRegion,
                                      BigDecimal minInvestment, BigDecimal maxInvestment, Integer limit);

    /**
     * 线索匹配查询
     * 根据目标条件查找匹配度高的线索
     * 
     * @param userId 用户ID
     * @param targetIndustry 目标行业
     * @param targetRegion 目标地区
     * @param targetScale 目标项目规模
     * @param targetCompanyScale 目标企业规模
     * @param minMatchScore 最小匹配分数
     * @param excludeLeadIds 排除的线索ID列表
     * @param limit 返回数量
     * @return 匹配线索列表
     */
    List<Lead> findMatchingLeads(Long userId, String targetIndustry, String targetRegion,
                                Integer targetScale, Integer targetCompanyScale, Integer minMatchScore,
                                List<Long> excludeLeadIds, Integer limit);

    /**
     * 发布线索
     * 将草稿状态的线索提交审核
     * 
     * @param leadId 线索ID
     * @return 是否成功
     */
    boolean publishLead(Long leadId);

    /**
     * 审核线索
     * 管理员审核线索并设置评级
     * 
     * @param leadId 线索ID
     * @param auditResult 审核结果 (true-通过, false-拒绝)
     * @param rating 评级 (A/B/C/D)
     * @param ratingScore 评级分数
     * @param auditRemark 审核备注
     * @param auditBy 审核人ID
     * @return 是否成功
     */
    boolean auditLead(Long leadId, boolean auditResult, String rating, Integer ratingScore,
                     String auditRemark, Long auditBy);

    /**
     * 下架线索
     * 将已发布的线索下架
     * 
     * @param leadId 线索ID
     * @param reason 下架原因
     * @return 是否成功
     */
    boolean offlineLead(Long leadId, String reason);

    /**
     * 置顶线索
     * 
     * @param leadId 线索ID
     * @param isTop 是否置顶
     * @return 是否成功
     */
    boolean setTopLead(Long leadId, boolean isTop);

    /**
     * 推荐线索
     * 
     * @param leadId 线索ID
     * @param isRecommend 是否推荐
     * @return 是否成功
     */
    boolean setRecommendLead(Long leadId, boolean isRecommend);

    /**
     * 增加浏览量
     * 
     * @param leadId 线索ID
     * @return 是否成功
     */
    boolean incrementViewCount(Long leadId);

    /**
     * 增加收藏量
     * 
     * @param leadId 线索ID
     * @return 是否成功
     */
    boolean incrementFavoriteCount(Long leadId);

    /**
     * 增加交换量
     * 
     * @param leadId 线索ID
     * @return 是否成功
     */
    boolean incrementExchangeCount(Long leadId);

    /**
     * 批量更新线索状态
     * 
     * @param leadIds 线索ID列表
     * @param status 新状态
     * @param updateBy 更新人ID
     * @return 更新数量
     */
    int batchUpdateStatus(List<Long> leadIds, Integer status, Long updateBy);

    /**
     * 批量更新线索评级
     * 
     * @param leadIds 线索ID列表
     * @param rating 新评级
     * @param ratingScore 新评级分数
     * @param updateBy 更新人ID
     * @return 更新数量
     */
    int batchUpdateRating(List<Long> leadIds, String rating, Integer ratingScore, Long updateBy);

    /**
     * 清理过期线索
     * 将过期的线索自动下架
     * 
     * @return 清理数量
     */
    int cleanExpiredLeads();

    /**
     * 获取用户线索统计数据
     * 
     * @param userId 用户ID
     * @return 统计数据
     */
    Map<String, Object> getUserLeadStats(Long userId);

    /**
     * 获取线索统计报表
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 统计数据列表
     */
    List<Map<String, Object>> getLeadStatistics(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * 获取热门搜索关键词
     * 
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param limit 数量限制
     * @return 热门关键词列表
     */
    List<Map<String, Object>> getHotSearchKeywords(LocalDateTime startDate, LocalDateTime endDate, Integer limit);

    /**
     * 统计各评级线索数量
     * 
     * @return 评级统计数据
     */
    Map<String, Long> countLeadsByRating();

    /**
     * 统计各行业线索数量
     * 
     * @return 行业统计数据
     */
    Map<String, Long> countLeadsByIndustry();

    /**
     * 统计各地区线索数量
     * 
     * @return 地区统计数据
     */
    Map<String, Long> countLeadsByRegion();

    /**
     * 检查线索是否存在
     * 
     * @param leadId 线索ID
     * @return 是否存在
     */
    boolean existsById(Long leadId);

    /**
     * 检查用户是否有权限访问线索
     * 
     * @param leadId 线索ID
     * @param userId 用户ID
     * @return 是否有权限
     */
    boolean hasPermission(Long leadId, Long userId);

    /**
     * 线索重复检测
     * 基于标题、描述、企业等信息检测重复线索
     * 
     * @param title 标题
     * @param description 描述
     * @param companyName 企业名称
     * @param contactPhone 联系电话
     * @param excludeId 排除的线索ID
     * @return 重复线索列表
     */
    List<Lead> findDuplicateLeads(String title, String description, String companyName, 
                                 String contactPhone, Long excludeId);

    /**
     * 计算线索相似度
     * 
     * @param lead1 线索1
     * @param lead2 线索2
     * @return 相似度分数 (0-100)
     */
    double calculateSimilarity(Lead lead1, Lead lead2);

}