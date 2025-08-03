<template>
  <div class="lead-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>线索管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            新增线索
          </el-button>
        </div>
      </template>

      <!-- 搜索筛选区域 -->
      <div class="search-area">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索线索关键词"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="searchForm.status" placeholder="线索状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="新建" value="NEW" />
              <el-option label="审核中" value="REVIEWING" />
              <el-option label="交换中" value="EXCHANGING" />
              <el-option label="已成交" value="COMPLETED" />
              <el-option label="已下架" value="OFFLINE" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="searchForm.rating" placeholder="线索评级" clearable>
              <el-option label="全部" value="" />
              <el-option label="A级" value="A" />
              <el-option label="B级" value="B" />
              <el-option label="C级" value="C" />
              <el-option label="D级" value="D" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 线索列表 -->
      <el-table :data="leadList" v-loading="loading" style="width: 100%">
        <el-table-column prop="title" label="线索标题" min-width="200" />
        <el-table-column prop="company" label="目标企业" width="150" />
        <el-table-column prop="industry" label="行业" width="120" />
        <el-table-column prop="rating" label="评级" width="80">
          <template #default="{ row }">
            <el-tag :type="getRatingType(row.rating)">{{ row.rating }}级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewLead(row)">查看</el-button>
            <el-button size="small" type="primary" @click="editLead(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteLead(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑线索对话框 -->
    <el-dialog v-model="showAddDialog" :title="editingLead ? '编辑线索' : '新增线索'" width="600px">
      <!-- TODO: 线索表单组件 -->
      <div>线索表单待实现</div>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveLead">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const showAddDialog = ref(false)
const editingLead = ref(null)
const leadList = ref([])

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: '',
  rating: '',
})

// 分页信息
const pagination = reactive({
  page: 1,
  size: 10,
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

// 获取状态标签类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    NEW: 'info',
    REVIEWING: 'warning',
    EXCHANGING: 'primary',
    COMPLETED: 'success',
    OFFLINE: 'danger',
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    NEW: '新建',
    REVIEWING: '审核中',
    EXCHANGING: '交换中',
    COMPLETED: '已成交',
    OFFLINE: '已下架',
  }
  return texts[status] || status
}

// 搜索线索
const handleSearch = () => {
  pagination.page = 1
  loadLeads()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: '',
    rating: '',
  })
  handleSearch()
}

// 加载线索列表
const loadLeads = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取线索列表
    // 模拟数据
    setTimeout(() => {
      leadList.value = []
      pagination.total = 0
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('加载线索列表失败:', error)
    loading.value = false
  }
}

// 查看线索详情
const viewLead = (lead: any) => {
  // TODO: 跳转到线索详情页面
  console.log('查看线索:', lead)
}

// 编辑线索
const editLead = (lead: any) => {
  editingLead.value = lead
  showAddDialog.value = true
}

// 删除线索
const deleteLead = async (lead: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条线索吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // TODO: 调用删除API
    ElMessage.success('删除成功')
    loadLeads()
  } catch (error) {
    // 用户取消删除
  }
}

// 保存线索
const saveLead = () => {
  // TODO: 保存线索逻辑
  ElMessage.success('保存成功')
  showAddDialog.value = false
  editingLead.value = null
  loadLeads()
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
.lead-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-area {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
