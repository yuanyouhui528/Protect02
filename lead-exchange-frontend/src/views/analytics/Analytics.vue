<template>
  <div class="analytics">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="总线索数" :value="stats.totalLeads" />
          <div class="stat-extra">
            <el-icon class="stat-icon"><Document /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="交换次数" :value="stats.totalExchanges" />
          <div class="stat-extra">
            <el-icon class="stat-icon"><Switch /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="成交率" :value="stats.successRate" suffix="%" />
          <div class="stat-extra">
            <el-icon class="stat-icon"><TrendCharts /></el-icon>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="活跃用户" :value="stats.activeUsers" />
          <div class="stat-extra">
            <el-icon class="stat-icon"><User /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-area">
      <!-- 线索趋势图 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>线索发布趋势</span>
              <el-select v-model="trendPeriod" size="small" style="width: 120px">
                <el-option label="最近7天" value="7d" />
                <el-option label="最近30天" value="30d" />
                <el-option label="最近90天" value="90d" />
              </el-select>
            </div>
          </template>
          <div ref="trendChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <!-- 评级分布图 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>线索评级分布</span>
          </template>
          <div ref="ratingChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-area">
      <!-- 行业分布图 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>行业分布</span>
          </template>
          <div ref="industryChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <!-- 交换成功率 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>交换成功率趋势</span>
          </template>
          <div ref="successChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-card class="data-table">
      <template #header>
        <div class="card-header">
          <span>详细数据</span>
          <el-button type="primary" @click="exportData">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="newLeads" label="新增线索" width="100" />
        <el-table-column prop="exchanges" label="交换次数" width="100" />
        <el-table-column prop="successCount" label="成功交换" width="100" />
        <el-table-column prop="successRate" label="成功率" width="100">
          <template #default="{ row }"> {{ row.successRate }}% </template>
        </el-table-column>
        <el-table-column prop="activeUsers" label="活跃用户" width="100" />
        <el-table-column prop="revenue" label="平台收益" />
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="tablePagination.page"
          v-model:page-size="tablePagination.size"
          :page-sizes="[10, 20, 50]"
          :total="tablePagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleTableSizeChange"
          @current-change="handleTableCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Switch, TrendCharts, User, Download } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 图表引用
const trendChartRef = ref<HTMLDivElement>()
const ratingChartRef = ref<HTMLDivElement>()
const industryChartRef = ref<HTMLDivElement>()
const successChartRef = ref<HTMLDivElement>()

// 图表实例
let trendChart: echarts.ECharts | null = null
let ratingChart: echarts.ECharts | null = null
let industryChart: echarts.ECharts | null = null
let successChart: echarts.ECharts | null = null

// 响应式数据
const trendPeriod = ref('30d')
const tableLoading = ref(false)
const tableData = ref([])

// 统计数据
const stats = reactive({
  totalLeads: 0,
  totalExchanges: 0,
  successRate: 0,
  activeUsers: 0,
})

// 表格分页
const tablePagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)
  const option = {
    title: {
      text: '线索发布趋势',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: [], // TODO: 从API获取数据
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '线索数量',
        type: 'line',
        data: [], // TODO: 从API获取数据
        smooth: true,
        areaStyle: {},
      },
    ],
  }
  trendChart.setOption(option)
}

// 初始化评级分布图
const initRatingChart = () => {
  if (!ratingChartRef.value) return

  ratingChart = echarts.init(ratingChartRef.value)
  const option = {
    title: {
      text: '线索评级分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: '评级分布',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 0, name: 'A级' },
          { value: 0, name: 'B级' },
          { value: 0, name: 'C级' },
          { value: 0, name: 'D级' },
        ], // TODO: 从API获取数据
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  ratingChart.setOption(option)
}

// 初始化行业分布图
const initIndustryChart = () => {
  if (!industryChartRef.value) return

  industryChart = echarts.init(industryChartRef.value)
  const option = {
    title: {
      text: '行业分布',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: [], // TODO: 从API获取数据
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '线索数量',
        type: 'bar',
        data: [], // TODO: 从API获取数据
      },
    ],
  }
  industryChart.setOption(option)
}

// 初始化成功率图
const initSuccessChart = () => {
  if (!successChartRef.value) return

  successChart = echarts.init(successChartRef.value)
  const option = {
    title: {
      text: '交换成功率趋势',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: [], // TODO: 从API获取数据
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: '成功率',
        type: 'line',
        data: [], // TODO: 从API获取数据
        smooth: true,
      },
    ],
  }
  successChart.setOption(option)
}

// 加载统计数据
const loadStats = async () => {
  try {
    // TODO: 调用API获取统计数据
    // 模拟数据
    Object.assign(stats, {
      totalLeads: 1234,
      totalExchanges: 567,
      successRate: 78.5,
      activeUsers: 89,
    })
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载表格数据
const loadTableData = async () => {
  tableLoading.value = true
  try {
    // TODO: 调用API获取表格数据
    // 模拟数据
    setTimeout(() => {
      tableData.value = []
      tablePagination.total = 0
      tableLoading.value = false
    }, 500)
  } catch (error) {
    console.error('加载表格数据失败:', error)
    tableLoading.value = false
  }
}

// 导出数据
const exportData = () => {
  // TODO: 实现数据导出功能
  ElMessage.success('数据导出功能开发中')
}

// 表格分页处理
const handleTableSizeChange = (size: number) => {
  tablePagination.size = size
  loadTableData()
}

const handleTableCurrentChange = (page: number) => {
  tablePagination.page = page
  loadTableData()
}

// 监听趋势周期变化
watch(trendPeriod, () => {
  // TODO: 重新加载趋势数据
  console.log('趋势周期变化:', trendPeriod.value)
})

// 窗口大小变化时重新调整图表
const handleResize = () => {
  trendChart?.resize()
  ratingChart?.resize()
  industryChart?.resize()
  successChart?.resize()
}

// 组件挂载
onMounted(() => {
  loadStats()
  loadTableData()

  // 延迟初始化图表，确保DOM已渲染
  setTimeout(() => {
    initTrendChart()
    initRatingChart()
    initIndustryChart()
    initSuccessChart()
  }, 100)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 组件卸载
onUnmounted(() => {
  // 销毁图表实例
  trendChart?.dispose()
  ratingChart?.dispose()
  industryChart?.dispose()
  successChart?.dispose()

  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.analytics {
  padding: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-extra {
  position: absolute;
  top: 20px;
  right: 20px;
}

.stat-icon {
  font-size: 32px;
  color: #409eff;
  opacity: 0.3;
}

.charts-area {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-table {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
