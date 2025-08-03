<template>
  <div class="chart-demo">
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>ECharts 图表组件示例</span>
        </div>
      </template>

      <!-- 柱状图示例 -->
      <div class="chart-section">
        <h3>柱状图示例</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>基础柱状图</span>
              </template>
              <BarChart
                :data="barChartData"
                :categories="categories"
                title="月度销售数据"
                subtitle="2024年数据统计"
                y-axis-unit="万元"
                :show-label="true"
                height="300px"
                @bar-click="handleBarClick"
              />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>堆叠柱状图</span>
              </template>
              <BarChart
                :data="stackBarChartData"
                :categories="categories"
                title="产品销售对比"
                y-axis-unit="件"
                :stack="true"
                height="300px"
              />
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 折线图示例 -->
      <div class="chart-section">
        <h3>折线图示例</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>基础折线图</span>
              </template>
              <LineChart
                :data="lineChartData"
                :categories="categories"
                title="用户增长趋势"
                subtitle="2024年用户数据"
                y-axis-unit="人"
                :smooth="true"
                height="300px"
                @point-click="handlePointClick"
              />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>面积折线图</span>
              </template>
              <LineChart
                :data="areaLineChartData"
                :categories="categories"
                title="收入趋势分析"
                y-axis-unit="万元"
                :smooth="true"
                :area="true"
                height="300px"
              />
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 饼图示例 -->
      <div class="chart-section">
        <h3>饼图示例</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>基础饼图</span>
              </template>
              <PieChart
                :data="pieChartData"
                title="市场份额分布"
                subtitle="2024年Q1数据"
                unit="%"
                height="350px"
                @sector-click="handleSectorClick"
              />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <span>环形图</span>
              </template>
              <PieChart
                :data="donutChartData"
                title="用户来源分析"
                :donut="true"
                inner-radius="40%"
                radius="70%"
                unit="人"
                height="350px"
              />
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 加载状态示例 -->
      <div class="chart-section">
        <h3>加载状态示例</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>
                <span>加载中的图表</span>
                <el-button type="primary" size="small" @click="toggleLoading" style="float: right">
                  {{ isLoading ? '停止加载' : '开始加载' }}
                </el-button>
              </template>
              <BarChart
                :data="barChartData"
                :categories="categories"
                title="加载状态演示"
                :loading="isLoading"
                loading-text="数据加载中..."
                height="300px"
              />
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card shadow="hover">
              <template #header>
                <span>动态数据更新</span>
                <el-button type="success" size="small" @click="updateData" style="float: right">
                  更新数据
                </el-button>
              </template>
              <LineChart
                :data="dynamicLineData"
                :categories="dynamicCategories"
                title="实时数据监控"
                y-axis-unit="次"
                :smooth="true"
                :area="true"
                height="300px"
              />
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { BarChart, LineChart, PieChart } from '@/components/charts'
import type { ChartSeriesData, PieChartDataItem } from '@/components/charts'

/**
 * ECharts 图表组件示例页面
 * 展示各种图表组件的使用方法和效果
 */

// 响应式数据
const isLoading = ref(false)

// 基础数据
const categories = ['1月', '2月', '3月', '4月', '5月', '6月']

// 柱状图数据
const barChartData: ChartSeriesData[] = [
  {
    name: '销售额',
    data: [
      { name: '1月', value: 120 },
      { name: '2月', value: 200 },
      { name: '3月', value: 150 },
      { name: '4月', value: 80 },
      { name: '5月', value: 70 },
      { name: '6月', value: 110 },
    ],
  },
]

// 堆叠柱状图数据
const stackBarChartData: ChartSeriesData[] = [
  {
    name: '产品A',
    data: [
      { name: '1月', value: 320 },
      { name: '2月', value: 302 },
      { name: '3月', value: 301 },
      { name: '4月', value: 334 },
      { name: '5月', value: 390 },
      { name: '6月', value: 330 },
    ],
  },
  {
    name: '产品B',
    data: [
      { name: '1月', value: 120 },
      { name: '2月', value: 132 },
      { name: '3月', value: 101 },
      { name: '4月', value: 134 },
      { name: '5月', value: 90 },
      { name: '6月', value: 230 },
    ],
  },
]

// 折线图数据
const lineChartData: ChartSeriesData[] = [
  {
    name: '新增用户',
    data: [
      { name: '1月', value: 820 },
      { name: '2月', value: 932 },
      { name: '3月', value: 901 },
      { name: '4月', value: 934 },
      { name: '5月', value: 1290 },
      { name: '6月', value: 1330 },
    ],
  },
  {
    name: '活跃用户',
    data: [
      { name: '1月', value: 620 },
      { name: '2月', value: 732 },
      { name: '3月', value: 701 },
      { name: '4月', value: 734 },
      { name: '5月', value: 1090 },
      { name: '6月', value: 1130 },
    ],
  },
]

// 面积折线图数据
const areaLineChartData: ChartSeriesData[] = [
  {
    name: '总收入',
    data: [
      { name: '1月', value: 150 },
      { name: '2月', value: 230 },
      { name: '3月', value: 224 },
      { name: '4月', value: 218 },
      { name: '5月', value: 135 },
      { name: '6月', value: 147 },
    ],
  },
]

// 饼图数据
const pieChartData: PieChartDataItem[] = [
  { name: '移动端', value: 35.2 },
  { name: 'PC端', value: 28.8 },
  { name: '平板端', value: 18.5 },
  { name: '其他', value: 17.5 },
]

// 环形图数据
const donutChartData: PieChartDataItem[] = [
  { name: '直接访问', value: 335 },
  { name: '邮件营销', value: 310 },
  { name: '联盟广告', value: 234 },
  { name: '视频广告', value: 135 },
  { name: '搜索引擎', value: 1548 },
]

// 动态数据
const dynamicLineData = reactive<ChartSeriesData[]>([
  {
    name: '访问量',
    data: [
      { name: '00:00', value: 120 },
      { name: '04:00', value: 200 },
      { name: '08:00', value: 150 },
      { name: '12:00', value: 80 },
      { name: '16:00', value: 70 },
      { name: '20:00', value: 110 },
    ],
  },
])

const dynamicCategories = ref(['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'])

/**
 * 切换加载状态
 */
const toggleLoading = () => {
  isLoading.value = !isLoading.value

  if (isLoading.value) {
    ElMessage.info('开始加载数据...')
    // 模拟3秒后自动停止加载
    setTimeout(() => {
      isLoading.value = false
      ElMessage.success('数据加载完成！')
    }, 3000)
  } else {
    ElMessage.warning('停止加载数据')
  }
}

/**
 * 更新动态数据
 */
const updateData = () => {
  // 生成随机数据
  dynamicLineData[0].data = dynamicLineData[0].data.map((item) => ({
    ...item,
    value: Math.floor(Math.random() * 300) + 50,
  }))

  ElMessage.success('数据已更新！')
}

/**
 * 处理柱状图点击事件
 */
const handleBarClick = (params: any) => {
  ElMessage.info(`点击了柱状图: ${params.name} - ${params.value}`)
}

/**
 * 处理折线图点击事件
 */
const handlePointClick = (params: any) => {
  ElMessage.info(`点击了数据点: ${params.name} - ${params.value}`)
}

/**
 * 处理饼图点击事件
 */
const handleSectorClick = (params: any) => {
  ElMessage.info(`点击了扇形: ${params.name} - ${params.value}%`)
}
</script>

<style scoped>
.chart-demo {
  padding: 20px;
}

.demo-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.chart-section {
  margin-bottom: 40px;
}

.chart-section h3 {
  margin-bottom: 20px;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}

.chart-section:last-child {
  margin-bottom: 0;
}

:deep(.el-card__header) {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
