package com.leadexchange.modules.lead.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leadexchange.modules.lead.entity.Lead;
import com.leadexchange.modules.lead.mapper.LeadMapper;
import com.leadexchange.modules.lead.service.LeadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 线索服务实现类
 * 提供线索管理的核心业务逻辑实现
 * 
 * @author leadexchange
 * @since 2024-01-01
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LeadServiceImpl extends ServiceImpl<LeadMapper, Lead> implements LeadService {

    private final LeadMapper leadMapper;

    @Override
    public IPage<Lead> getLeadPage(Integer page, Integer size, Integer leadType, Integer status,
                                  String rating, String industry, String region, String keyword) {
        Page<Lead> pageParam = new Page<>(page, size);
        return leadMapper.selectLeadPage(pageParam, leadType, status, rating, industry, region, keyword);
    }

    @Override
    public IPage<Lead> getLeadsByUserId(Long userId, Integer page, Integer size) {
        Page<Lead> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Lead> wrapper = new LambdaQueryWrapper<Lead>()
                .eq(Lead::getCreateBy, userId)
                .orderByDesc(Lead::getCreateTime);
        return this.page(pageParam, wrapper);
    }

    @Override
    public IPage<Lead> getLeadsByIndustry(String industry, Integer page, Integer size) {
        Page<Lead> pageParam = new Page<>(page, size);
        return leadMapper.findLeadsByIndustry(pageParam, industry);
    }

    @Override
    public IPage<Lead> getLeadsByRegion(String region, Integer page, Integer size) {
        Page<Lead> pageParam = new Page<>(page, size);
        return leadMapper.findLeadsByRegion(pageParam, region);
    }

    @Override
    public IPage<Lead> getLeadsByRating(String rating, Integer page, Integer size) {
        Page<Lead> pageParam = new Page<>(page, size);
        return leadMapper.findLeadsByRating(pageParam, rating);
    }

    @Override
    public List<Lead> getHotLeads(Integer limit) {
        return leadMapper.findHotLeads(limit);
    }

    @Override
    public List<Lead> getRecommendedLeads(Integer limit) {
        return leadMapper.findRecommendedLeads(limit);
    }

    @Override
    public List<Lead> getTopLeads(Integer limit) {
        return leadMapper.findTopLeads(limit);
    }

    @Override
    public List<Lead> getSmartRecommendations(Long userId, String userIndustry, String userRegion,
                                             BigDecimal minInvestment, BigDecimal maxInvestment, Integer limit) {
        return leadMapper.findRecommendedLeads(userId, userIndustry, userRegion, minInvestment, maxInvestment, limit);
    }

    @Override
    public List<Lead> findMatchingLeads(Long userId, String targetIndustry, String targetRegion,
                                       Integer targetScale, Integer targetCompanyScale, Integer minMatchScore,
                                       List<Long> excludeLeadIds, Integer limit) {
        return leadMapper.findMatchingLeads(userId, targetIndustry, targetRegion, targetScale,
                targetCompanyScale, minMatchScore, excludeLeadIds, limit);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean publishLead(Long leadId) {
        try {
            Lead lead = this.getById(leadId);
            if (lead == null) {
                log.warn("线索不存在: {}", leadId);
                return false;
            }

            if (!Objects.equals(lead.getStatus(), 1)) {
                log.warn("线索状态不正确，无法发布: leadId={}, status={}", leadId, lead.getStatus());
                return false;
            }

            // 更新状态为审核中
            LambdaUpdateWrapper<Lead> wrapper = new LambdaUpdateWrapper<Lead>()
                    .eq(Lead::getId, leadId)
                    .set(Lead::getStatus, 2)
                    .set(Lead::getPublishTime, LocalDateTime.now());

            boolean result = this.update(wrapper);
            if (result) {
                log.info("线索发布成功: {}", leadId);
            }
            return result;
        } catch (Exception e) {
            log.error("发布线索失败: leadId={}", leadId, e);
            throw e;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean auditLead(Long leadId, boolean auditResult, String rating, Integer ratingScore,
                            String auditRemark, Long auditBy) {
        try {
            Lead lead = this.getById(leadId);
            if (lead == null) {
                log.warn("线索不存在: {}", leadId);
                return false;
            }

            if (!Objects.equals(lead.getStatus(), 2)) {
                log.warn("线索状态不正确，无法审核: leadId={}, status={}", leadId, lead.getStatus());
                return false;
            }

            // 更新审核结果
            LambdaUpdateWrapper<Lead> wrapper = new LambdaUpdateWrapper<Lead>()
                    .eq(Lead::getId, leadId)
                    .set(Lead::getStatus, auditResult ? 3 : 6) // 通过=已发布, 拒绝=已下架
                    .set(Lead::getAuditTime, LocalDateTime.now())
                    .set(Lead::getAuditBy, auditBy)
                    .set(Lead::getAuditRemark, auditRemark);

            if (auditResult && StringUtils.hasText(rating)) {
                wrapper.set(Lead::getRating, rating)
                       .set(Lead::getRatingScore, ratingScore);
            }

            boolean result = this.update(wrapper);
            if (result) {
                log.info("线索审核完成: leadId={}, result={}, rating={}", leadId, auditResult, rating);
            }
            return result;
        } catch (Exception e) {
            log.error("审核线索失败: leadId={}", leadId, e);
            throw e;
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean offlineLead(Long leadId, String reason) {
        try {
            LambdaUpdateWrapper<Lead> wrapper = new LambdaUpdateWrapper<Lead>()
                    .eq(Lead::getId, leadId)
                    .set(Lead::getStatus, 6)
                    .set(Lead::getRemark, reason);

            boolean result = this.update(wrapper);
            if (result) {
                log.info("线索下架成功: leadId={}, reason={}", leadId, reason);
            }
            return result;
        } catch (Exception e) {
            log.error("下架线索失败: leadId={}", leadId, e);
            throw e;
        }
    }

    @Override
    public boolean setTopLead(Long leadId, boolean isTop) {
        LambdaUpdateWrapper<Lead> wrapper = new LambdaUpdateWrapper<Lead>()
                .eq(Lead::getId, leadId)
                .set(Lead::getIsTop, isTop ? 1 : 0);
        return this.update(wrapper);
    }

    @Override
    public boolean setRecommendLead(Long leadId, boolean isRecommend) {
        LambdaUpdateWrapper<Lead> wrapper = new LambdaUpdateWrapper<Lead>()
                .eq(Lead::getId, leadId)
                .set(Lead::getIsRecommend, isRecommend ? 1 : 0);
        return this.update(wrapper);
    }

    @Override
    public boolean incrementViewCount(Long leadId) {
        return leadMapper.incrementViewCount(leadId) > 0;
    }

    @Override
    public boolean incrementFavoriteCount(Long leadId) {
        return leadMapper.incrementFavoriteCount(leadId) > 0;
    }

    @Override
    public boolean incrementExchangeCount(Long leadId) {
        return leadMapper.incrementExchangeCount(leadId) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int batchUpdateStatus(List<Long> leadIds, Integer status, Long updateBy) {
        if (leadIds == null || leadIds.isEmpty()) {
            return 0;
        }
        return leadMapper.batchUpdateStatus(leadIds, status, updateBy);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int batchUpdateRating(List<Long> leadIds, String rating, Integer ratingScore, Long updateBy) {
        if (leadIds == null || leadIds.isEmpty()) {
            return 0;
        }
        return leadMapper.batchUpdateRating(leadIds, rating, ratingScore, updateBy);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int cleanExpiredLeads() {
        LocalDateTime currentTime = LocalDateTime.now();
        int count = leadMapper.cleanExpiredLeads(currentTime);
        if (count > 0) {
            log.info("清理过期线索完成，共清理{}条", count);
        }
        return count;
    }

    @Override
    public Map<String, Object> getUserLeadStats(Long userId) {
        return leadMapper.getUserLeadStats(userId);
    }

    @Override
    public List<Map<String, Object>> getLeadStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        return leadMapper.getLeadStatistics(startDate, endDate);
    }

    @Override
    public List<Map<String, Object>> getHotSearchKeywords(LocalDateTime startDate, LocalDateTime endDate, Integer limit) {
        return leadMapper.getHotSearchKeywords(startDate, endDate, limit);
    }

    @Override
    public Map<String, Long> countLeadsByRating() {
        return leadMapper.countLeadsByRating();
    }

    @Override
    public Map<String, Long> countLeadsByIndustry() {
        return leadMapper.countLeadsByIndustry();
    }

    @Override
    public Map<String, Long> countLeadsByRegion() {
        return leadMapper.countLeadsByRegion();
    }

    @Override
    public boolean existsById(Long leadId) {
        return this.getById(leadId) != null;
    }

    @Override
    public boolean hasPermission(Long leadId, Long userId) {
        Lead lead = this.getById(leadId);
        if (lead == null) {
            return false;
        }
        
        // 创建者有权限
        if (Objects.equals(lead.getCreateBy(), userId)) {
            return true;
        }
        
        // 已发布的线索所有人都可以查看
        return Objects.equals(lead.getStatus(), 3);
    }

    @Override
    public List<Lead> findDuplicateLeads(String title, String description, String companyName,
                                        String contactPhone, Long excludeId) {
        LambdaQueryWrapper<Lead> wrapper = new LambdaQueryWrapper<Lead>()
                .and(w -> w.like(Lead::getTitle, title)
                          .or().like(Lead::getDescription, description)
                          .or().eq(Lead::getCompanyName, companyName)
                          .or().eq(Lead::getContactPhone, contactPhone))
                .ne(excludeId != null, Lead::getId, excludeId)
                .eq(Lead::getDeleted, 0);
        
        List<Lead> candidates = this.list(wrapper);
        
        // 进一步计算相似度，过滤出真正重复的线索
        return candidates.stream()
                .filter(lead -> {
                    Lead targetLead = new Lead();
                    targetLead.setTitle(title);
                    targetLead.setDescription(description);
                    targetLead.setCompanyName(companyName);
                    targetLead.setContactPhone(contactPhone);
                    
                    double similarity = calculateSimilarity(lead, targetLead);
                    return similarity >= 80.0; // 相似度阈值80%
                })
                .collect(Collectors.toList());
    }

    @Override
    public double calculateSimilarity(Lead lead1, Lead lead2) {
        if (lead1 == null || lead2 == null) {
            return 0.0;
        }
        
        double totalScore = 0.0;
        int factors = 0;
        
        // 标题相似度 (权重: 30%)
        if (StringUtils.hasText(lead1.getTitle()) && StringUtils.hasText(lead2.getTitle())) {
            double titleSimilarity = calculateStringSimilarity(lead1.getTitle(), lead2.getTitle());
            totalScore += titleSimilarity * 0.3;
            factors++;
        }
        
        // 描述相似度 (权重: 25%)
        if (StringUtils.hasText(lead1.getDescription()) && StringUtils.hasText(lead2.getDescription())) {
            double descSimilarity = calculateStringSimilarity(lead1.getDescription(), lead2.getDescription());
            totalScore += descSimilarity * 0.25;
            factors++;
        }
        
        // 企业名称相似度 (权重: 20%)
        if (StringUtils.hasText(lead1.getCompanyName()) && StringUtils.hasText(lead2.getCompanyName())) {
            double companySimilarity = calculateStringSimilarity(lead1.getCompanyName(), lead2.getCompanyName());
            totalScore += companySimilarity * 0.2;
            factors++;
        }
        
        // 联系电话完全匹配 (权重: 15%)
        if (StringUtils.hasText(lead1.getContactPhone()) && StringUtils.hasText(lead2.getContactPhone())) {
            boolean phoneMatch = lead1.getContactPhone().equals(lead2.getContactPhone());
            totalScore += (phoneMatch ? 100.0 : 0.0) * 0.15;
            factors++;
        }
        
        // 行业匹配 (权重: 10%)
        if (StringUtils.hasText(lead1.getIndustry()) && StringUtils.hasText(lead2.getIndustry())) {
            boolean industryMatch = lead1.getIndustry().equals(lead2.getIndustry());
            totalScore += (industryMatch ? 100.0 : 0.0) * 0.1;
            factors++;
        }
        
        return factors > 0 ? totalScore : 0.0;
    }
    
    /**
     * 计算字符串相似度
     * 使用编辑距离算法
     * 
     * @param str1 字符串1
     * @param str2 字符串2
     * @return 相似度百分比 (0-100)
     */
    private double calculateStringSimilarity(String str1, String str2) {
        if (str1 == null || str2 == null) {
            return 0.0;
        }
        
        if (str1.equals(str2)) {
            return 100.0;
        }
        
        int maxLength = Math.max(str1.length(), str2.length());
        if (maxLength == 0) {
            return 100.0;
        }
        
        int editDistance = calculateEditDistance(str1, str2);
        return (1.0 - (double) editDistance / maxLength) * 100.0;
    }
    
    /**
     * 计算编辑距离
     * 
     * @param str1 字符串1
     * @param str2 字符串2
     * @return 编辑距离
     */
    private int calculateEditDistance(String str1, String str2) {
        int m = str1.length();
        int n = str2.length();
        
        int[][] dp = new int[m + 1][n + 1];
        
        // 初始化边界条件
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        
        // 动态规划计算编辑距离
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(Math.min(dp[i - 1][j], dp[i][j - 1]), dp[i - 1][j - 1]) + 1;
                }
            }
        }
        
        return dp[m][n];
    }

}