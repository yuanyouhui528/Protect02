<template>
  <div ref="chartRef" :style="{ width: width, height: height }" class="base-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import type { EChartsOption } from 'echarts'
import echarts from '@/utils/echarts'

/**
 * 基础图表组件
 * 封装ECharts，提供响应式和Vue集成支持
 */

// 组件属性定义
interface Props {
  /** 图表配置选项 */
  option: EChartsOption
  /** 图表宽度 */
  width?: string
  /** 图表高度 */
  height?: string
  /** 主题名称 */
  theme?: string
  /** 是否自动调整大小 */
  autoResize?: boolean
  /** 加载状态 */
  loading?: boolean
  /** 加载文本 */
  loadingText?: string
}

// 定义属性默认值
const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '400px',
  theme: 'default',
  autoResize: true,
  loading: false,
  loadingText: '加载中...',
})

// 定义事件
const emit = defineEmits<{
  /** 图表点击事件 */
  click: [params: any]
  /** 图表双击事件 */
  dblclick: [params: any]
  /** 图表鼠标悬停事件 */
  mouseover: [params: any]
  /** 图表鼠标离开事件 */
  mouseout: [params: any]
  /** 图表初始化完成事件 */
  ready: [chart: echarts.ECharts]
}>()

// 响应式数据
const chartRef = ref<HTMLDivElement>()
const chartInstance = ref<echarts.ECharts>()

/**
 * 初始化图表
 */
const initChart = async () => {
  if (!chartRef.value) return

  await nextTick()

  // 创建图表实例
  chartInstance.value = echarts.init(chartRef.value, props.theme)

  // 设置图表配置
  chartInstance.value.setOption(props.option)

  // 绑定事件
  bindEvents()

  // 触发初始化完成事件
  emit('ready', chartInstance.value)
}

/**
 * 绑定图表事件
 */
const bindEvents = () => {
  if (!chartInstance.value) return

  // 点击事件
  chartInstance.value.on('click', (params) => {
    emit('click', params)
  })

  // 双击事件
  chartInstance.value.on('dblclick', (params) => {
    emit('dblclick', params)
  })

  // 鼠标悬停事件
  chartInstance.value.on('mouseover', (params) => {
    emit('mouseover', params)
  })

  // 鼠标离开事件
  chartInstance.value.on('mouseout', (params) => {
    emit('mouseout', params)
  })
}

/**
 * 更新图表配置
 */
const updateChart = () => {
  if (!chartInstance.value) return

  chartInstance.value.setOption(props.option, true)
}

/**
 * 调整图表大小
 */
const resizeChart = () => {
  if (!chartInstance.value) return

  chartInstance.value.resize()
}

/**
 * 显示加载状态
 */
const showLoading = () => {
  if (!chartInstance.value) return

  chartInstance.value.showLoading('default', {
    text: props.loadingText,
    color: '#409EFF',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0,
    fontSize: 12,
    showSpinner: true,
    spinnerRadius: 10,
    lineWidth: 5,
  })
}

/**
 * 隐藏加载状态
 */
const hideLoading = () => {
  if (!chartInstance.value) return

  chartInstance.value.hideLoading()
}

/**
 * 销毁图表
 */
const disposeChart = () => {
  if (!chartInstance.value) return

  chartInstance.value.dispose()
  chartInstance.value = undefined
}

// 监听配置变化
watch(
  () => props.option,
  () => {
    updateChart()
  },
  { deep: true },
)

// 监听加载状态变化
watch(
  () => props.loading,
  (loading) => {
    if (loading) {
      showLoading()
    } else {
      hideLoading()
    }
  },
)

// 监听窗口大小变化
let resizeObserver: ResizeObserver | null = null

// 组件挂载
onMounted(() => {
  initChart()

  // 如果启用自动调整大小，监听容器大小变化
  if (props.autoResize && chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      resizeChart()
    })
    resizeObserver.observe(chartRef.value)
  }
})

// 组件卸载
onBeforeUnmount(() => {
  // 清理资源
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  disposeChart()
})

// 暴露方法给父组件
defineExpose({
  /** 获取图表实例 */
  getChart: () => chartInstance.value,
  /** 更新图表 */
  updateChart,
  /** 调整图表大小 */
  resizeChart,
  /** 显示加载状态 */
  showLoading,
  /** 隐藏加载状态 */
  hideLoading,
})
</script>

<style scoped>
.base-chart {
  position: relative;
  overflow: hidden;
}
</style>
