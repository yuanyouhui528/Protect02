/**
 * 图表组件统一导出文件
 * 提供所有图表组件的统一入口
 */

// 基础图表组件
export { default as BaseChart } from './BaseChart.vue'

// 具体图表组件
export { default as BarChart } from './BarChart.vue'
export { default as LineChart } from './LineChart.vue'
export { default as PieChart } from './PieChart.vue'

// 图表相关类型定义
export interface ChartDataItem {
  name: string
  value: number
}

export interface ChartSeriesData {
  name: string
  data: ChartDataItem[]
  color?: string
  // 折线图特有属性
  smooth?: boolean
  area?: boolean
}

export interface PieChartDataItem {
  name: string
  value: number
  color?: string
}

// 图表配置选项类型
export interface BaseChartProps {
  width?: string
  height?: string
  title?: string
  subtitle?: string
  showLegend?: boolean
  autoResize?: boolean
  loading?: boolean
}

export interface BarChartProps extends BaseChartProps {
  data: ChartSeriesData[]
  categories: string[]
  showGrid?: boolean
  stack?: boolean
  barWidth?: string | number
  yAxisUnit?: string
  showLabel?: boolean
}

export interface LineChartProps extends BaseChartProps {
  data: ChartSeriesData[]
  categories: string[]
  showGrid?: boolean
  smooth?: boolean
  area?: boolean
  yAxisUnit?: string
  showLabel?: boolean
  showSymbol?: boolean
}

export interface PieChartProps extends BaseChartProps {
  data: PieChartDataItem[]
  legendPosition?: 'top' | 'bottom' | 'left' | 'right'
  donut?: boolean
  innerRadius?: string
  radius?: string | [string, string]
  showLabel?: boolean
  showPercent?: boolean
  showLabelLine?: boolean
  unit?: string
}
