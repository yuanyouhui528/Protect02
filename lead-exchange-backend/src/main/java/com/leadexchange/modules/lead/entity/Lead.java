package com.leadexchange.modules.lead.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.leadexchange.common.entity.BaseEntity;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 线索实体类
 * 
 * @author 系统
 * @version 1.0.0
 * @since 2024-01-01
 */
@TableName("biz_lead")
public class Lead extends BaseEntity {

    /**
     * 线索标题
     */
    @NotBlank(message = "线索标题不能为空")
    @Size(max = 200, message = "线索标题长度不能超过200个字符")
    @TableField("title")
    private String title;

    /**
     * 线索描述
     */
    @Size(max = 2000, message = "线索描述长度不能超过2000个字符")
    @TableField("description")
    private String description;

    /**
     * 线索类型（1：投资需求，2：项目推荐，3：合作机会）
     */
    @NotNull(message = "线索类型不能为空")
    @TableField("lead_type")
    private Integer leadType;

    /**
     * 线索状态（1：新建，2：审核中，3：已审核，4：交换中，5：已成交，6：已下架）
     */
    @TableField("status")
    private Integer status;

    /**
     * 线索评级（A、B、C、D）
     */
    @TableField("rating")
    private String rating;

    /**
     * 评级分数
     */
    @TableField("rating_score")
    private Integer ratingScore;

    /**
     * 所属行业
     */
    @NotBlank(message = "所属行业不能为空")
    @TableField("industry")
    private String industry;

    /**
     * 所在地区
     */
    @NotBlank(message = "所在地区不能为空")
    @TableField("region")
    private String region;

    /**
     * 投资金额（万元）
     */
    @TableField("investment_amount")
    private BigDecimal investmentAmount;

    /**
     * 项目规模（1：小型，2：中型，3：大型）
     */
    @TableField("project_scale")
    private Integer projectScale;

    /**
     * 联系人姓名
     */
    @NotBlank(message = "联系人姓名不能为空")
    @TableField("contact_name")
    private String contactName;

    /**
     * 联系人职位
     */
    @TableField("contact_position")
    private String contactPosition;

    /**
     * 联系人电话
     */
    @NotBlank(message = "联系人电话不能为空")
    @TableField("contact_phone")
    private String contactPhone;

    /**
     * 联系人邮箱
     */
    @TableField("contact_email")
    private String contactEmail;

    /**
     * 企业名称
     */
    @NotBlank(message = "企业名称不能为空")
    @TableField("company_name")
    private String companyName;

    /**
     * 企业统一社会信用代码
     */
    @TableField("company_code")
    private String companyCode;

    /**
     * 企业规模（1：小微企业，2：中小企业，3：大型企业）
     */
    @TableField("company_scale")
    private Integer companyScale;

    /**
     * 企业性质（1：国有企业，2：民营企业，3：外资企业，4：合资企业）
     */
    @TableField("company_nature")
    private Integer companyNature;

    /**
     * 线索来源（1：自主发布，2：系统推荐，3：第三方导入）
     */
    @TableField("source")
    private Integer source;

    /**
     * 线索标签（JSON格式存储）
     */
    @TableField("tags")
    private String tags;

    /**
     * 附件文件路径（JSON格式存储）
     */
    @TableField("attachments")
    private String attachments;

    /**
     * 有效期
     */
    @TableField("expire_time")
    private LocalDateTime expireTime;

    /**
     * 发布时间
     */
    @TableField("publish_time")
    private LocalDateTime publishTime;

    /**
     * 审核时间
     */
    @TableField("audit_time")
    private LocalDateTime auditTime;

    /**
     * 审核人ID
     */
    @TableField("audit_by")
    private Long auditBy;

    /**
     * 审核意见
     */
    @TableField("audit_remark")
    private String auditRemark;

    /**
     * 浏览次数
     */
    @TableField("view_count")
    private Integer viewCount;

    /**
     * 收藏次数
     */
    @TableField("favorite_count")
    private Integer favoriteCount;

    /**
     * 交换次数
     */
    @TableField("exchange_count")
    private Integer exchangeCount;

    /**
     * 是否置顶（0：否，1：是）
     */
    @TableField("is_top")
    private Integer isTop;

    /**
     * 是否推荐（0：否，1：是）
     */
    @TableField("is_recommend")
    private Integer isRecommend;

    /**
     * 备注
     */
    @TableField("remark")
    private String remark;

    // Getter and Setter methods
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getLeadType() {
        return leadType;
    }

    public void setLeadType(Integer leadType) {
        this.leadType = leadType;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public Integer getRatingScore() {
        return ratingScore;
    }

    public void setRatingScore(Integer ratingScore) {
        this.ratingScore = ratingScore;
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

    public BigDecimal getInvestmentAmount() {
        return investmentAmount;
    }

    public void setInvestmentAmount(BigDecimal investmentAmount) {
        this.investmentAmount = investmentAmount;
    }

    public Integer getProjectScale() {
        return projectScale;
    }

    public void setProjectScale(Integer projectScale) {
        this.projectScale = projectScale;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactPosition() {
        return contactPosition;
    }

    public void setContactPosition(String contactPosition) {
        this.contactPosition = contactPosition;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
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

    public Integer getCompanyNature() {
        return companyNature;
    }

    public void setCompanyNature(Integer companyNature) {
        this.companyNature = companyNature;
    }

    public Integer getSource() {
        return source;
    }

    public void setSource(Integer source) {
        this.source = source;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getAttachments() {
        return attachments;
    }

    public void setAttachments(String attachments) {
        this.attachments = attachments;
    }

    public LocalDateTime getExpireTime() {
        return expireTime;
    }

    public void setExpireTime(LocalDateTime expireTime) {
        this.expireTime = expireTime;
    }

    public LocalDateTime getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(LocalDateTime publishTime) {
        this.publishTime = publishTime;
    }

    public LocalDateTime getAuditTime() {
        return auditTime;
    }

    public void setAuditTime(LocalDateTime auditTime) {
        this.auditTime = auditTime;
    }

    public Long getAuditBy() {
        return auditBy;
    }

    public void setAuditBy(Long auditBy) {
        this.auditBy = auditBy;
    }

    public String getAuditRemark() {
        return auditRemark;
    }

    public void setAuditRemark(String auditRemark) {
        this.auditRemark = auditRemark;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getFavoriteCount() {
        return favoriteCount;
    }

    public void setFavoriteCount(Integer favoriteCount) {
        this.favoriteCount = favoriteCount;
    }

    public Integer getExchangeCount() {
        return exchangeCount;
    }

    public void setExchangeCount(Integer exchangeCount) {
        this.exchangeCount = exchangeCount;
    }

    public Integer getIsTop() {
        return isTop;
    }

    public void setIsTop(Integer isTop) {
        this.isTop = isTop;
    }

    public Integer getIsRecommend() {
        return isRecommend;
    }

    public void setIsRecommend(Integer isRecommend) {
        this.isRecommend = isRecommend;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

}