<template>
  <div class="exchange-center">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>交换中心</span>
          <el-button type="primary" @click="showExchangeDialog = true">
            <el-icon><Switch /></el-icon>
            发起交换
          </el-button>
        </div>
      </template>

      <!-- 筛选区域 -->
      <div class="filter-area">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="filterForm.keyword"
              placeholder="搜索线索关键词"
              clearable
              @keyup.enter="handleFilter"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="filterForm.industry" placeholder="行业" clearable>
              <el-option label="全部" value="" />
              <el-option label="制造业" value="MANUFACTURING" />
              <el-option label="服务业" value="SERVICE" />
              <el-option label="科技" value="TECHNOLOGY" />
              <el-option label="金融" value="FINANCE" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="filterForm.rating" placeholder="评级" clearable>
              <el-option label="全部" value="" />
              <el-option label="A级" value="A" />
              <el-option label="B级" value="B" />
              <el-option label="C级" value="C" />
              <el-option label="D级" value="D" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleFilter">
              <el-icon><Search /></el-icon>
              筛选
            </el-button>
            <el-button @click="resetFilter">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 线索卡片列表 -->
      <div class="lead-cards" v-loading="loading">
        <el-row :gutter="20">
          <el-col :span="8" v-for="lead in leadList" :key="lead.id">
            <el-card class="lead-card" shadow="hover">
              <template #header>
                <div class="lead-header">
                  <span class="lead-title">{{ lead.title }}</span>
                  <el-tag :type="getRatingType(lead.rating)">{{ lead.rating }}级</el-tag>
                </div>
              </template>

              <div class="lead-content">
                <p><strong>目标企业：</strong>{{ lead.company }}</p>
                <p><strong>行业：</strong>{{ lead.industry }}</p>
                <p><strong>规模：</strong>{{ lead.scale }}</p>
                <p><strong>投资金额：</strong>{{ lead.investment }}</p>
                <p><strong>联系方式：</strong>{{ lead.contact }}</p>
                <p><strong>发布时间：</strong>{{ lead.createTime }}</p>
              </div>

              <template #footer>
                <div class="lead-actions">
                  <el-button size="small" @click="viewLeadDetail(lead)">查看详情</el-button>
                  <el-button size="small" type="primary" @click="requestExchange(lead)">
                    申请交换
                  </el-button>
                  <el-button size="small" @click="collectLead(lead)">
                    <el-icon><Star /></el-icon>
                    收藏
                  </el-button>
                </div>
              </template>
            </el-card>
          </el-col>
        </el-row>

        <!-- 空状态 -->
        <el-empty v-if="!loading && leadList.length === 0" description="暂无可交换的线索" />
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="leadList.length > 0">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[12, 24, 48]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 发起交换对话框 -->
    <el-dialog v-model="showExchangeDialog" title="发起交换申请" width="600px">
      <!-- TODO: 交换申请表单 -->
      <div>交换申请表单待实现</div>
      <template #footer>
        <el-button @click="showExchangeDialog = false">取消</el-button>
        <el-button type="primary" @click="submitExchange">提交申请</el-button>
      </template>
    </el-dialog>

    <!-- 线索详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="线索详情" width="800px">
      <div v-if="selectedLead">
        <!-- TODO: 线索详情组件 -->
        <div>线索详情待实现</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Switch, Search, Refresh, Star } from '@element-plus/icons-vue'

// 线索接口定义
interface Lead {
  id: number
  title: string
  company: string
  industry: string
  scale: string
  investment: string
  contact: string
  rating: 'A' | 'B' | 'C' | 'D'
  createTime: string
  description?: string
}

// 响应式数据
const loading = ref(false)
const showExchangeDialog = ref(false)
const showDetailDialog = ref(false)
const selectedLead = ref<Lead | null>(null)
const leadList = ref<Lead[]>([])

// 筛选表单
const filterForm = reactive({
  keyword: '',
  industry: '',
  rating: '',
})

// 分页信息
const pagination = reactive({
  page: 1,
  size: 12,
  total: 0,
})

// 获取评级标签类型
const getRatingType = (rating: string) => {
  const types: Record<string, string> = {
    A: 'danger',
    B: 'warning',
    C: 'info',
    D: 'success',
  }
  return types[rating] || 'info'
}

// 筛选线索
const handleFilter = () => {
  pagination.page = 1
  loadLeads()
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterForm, {
    keyword: '',
    industry: '',
    rating: '',
  })
  handleFilter()
}

// 加载线索列表
const loadLeads = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取可交换线索列表
    // 模拟数据
    setTimeout(() => {
      const mockLeads: Lead[] = [
        {
          id: 1,
          title: '某科技园区招商项目',
          company: '科技创新企业',
          industry: '人工智能',
          scale: '100-500人',
          investment: '1000-5000万',
          contact: '张经理 138****1234',
          rating: 'A',
          createTime: '2024-01-15',
          description: '优质AI企业招商项目',
        },
        {
          id: 2,
          title: '新能源产业园招商',
          company: '绿色能源公司',
          industry: '新能源',
          scale: '50-100人',
          investment: '500-1000万',
          contact: '李总监 139****5678',
          rating: 'B',
          createTime: '2024-01-14',
          description: '新能源领域投资机会',
        },
      ]
      leadList.value = mockLeads
      pagination.total = mockLeads.length
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('加载线索列表失败:', error)
    loading.value = false
  }
}

// 查看线索详情
const viewLeadDetail = (lead: Lead) => {
  selectedLead.value = lead
  showDetailDialog.value = true
}

// 申请交换
const requestExchange = async (lead: Lead) => {
  try {
    await ElMessageBox.confirm(`确定要申请交换线索"${lead.title}"吗？`, '交换确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    })

    // TODO: 调用交换申请API
    ElMessage.success('交换申请已提交，等待对方确认')
  } catch (error) {
    // 用户取消
  }
}

// 收藏线索
const collectLead = async (lead: Lead) => {
  try {
    // TODO: 调用收藏API
    ElMessage.success('收藏成功')
  } catch (error) {
    console.error('收藏失败:', error)
    ElMessage.error('收藏失败')
  }
}

// 提交交换申请
const submitExchange = () => {
  // TODO: 提交交换申请逻辑
  ElMessage.success('交换申请已提交')
  showExchangeDialog.value = false
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.size = size
  loadLeads()
}

// 当前页改变
const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadLeads()
}

// 组件挂载时加载数据
onMounted(() => {
  loadLeads()
})
</script>

<style scoped>
.exchange-center {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-area {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.lead-cards {
  min-height: 400px;
}

.lead-card {
  margin-bottom: 20px;
  height: 320px;
}

.lead-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lead-title {
  font-weight: bold;
  font-size: 16px;
}

.lead-content {
  height: 160px;
  overflow: hidden;
}

.lead-content p {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.4;
}

.lead-actions {
  display: flex;
  justify-content: space-between;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
