<template>
  <BaseChart
    :option="chartOption"
    :width="width"
    :height="height"
    :loading="loading"
    :auto-resize="autoResize"
    @click="handleClick"
    @ready="handleReady"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import BaseChart from './BaseChart.vue'
import { defaultOptions, colors } from '@/utils/echarts'

/**
 * 柱状图组件
 * 基于BaseChart封装的柱状图
 */

// 数据项接口定义
interface DataItem {
  name: string
  value: number
}

// 系列数据接口定义
interface SeriesData {
  name: string
  data: DataItem[]
  color?: string
}

// 组件属性定义
interface Props {
  /** 图表数据 */
  data: SeriesData[]
  /** X轴类别数据 */
  categories: string[]
  /** 图表标题 */
  title?: string
  /** 图表副标题 */
  subtitle?: string
  /** 图表宽度 */
  width?: string
  /** 图表高度 */
  height?: string
  /** 是否显示图例 */
  showLegend?: boolean
  /** 是否显示网格线 */
  showGrid?: boolean
  /** 是否堆叠显示 */
  stack?: boolean
  /** 柱子宽度 */
  barWidth?: string | number
  /** 是否自动调整大小 */
  autoResize?: boolean
  /** 加载状态 */
  loading?: boolean
  /** Y轴单位 */
  yAxisUnit?: string
  /** 是否显示数值标签 */
  showLabel?: boolean
}

// 定义属性默认值
const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '400px',
  showLegend: true,
  showGrid: true,
  stack: false,
  autoResize: true,
  loading: false,
  showLabel: false,
})

// 定义事件
const emit = defineEmits<{
  /** 柱子点击事件 */
  barClick: [params: any]
  /** 图表初始化完成事件 */
  ready: [chart: any]
}>()

// 计算图表配置
const chartOption = computed<EChartsOption>(() => {
  const option: EChartsOption = {
    ...defaultOptions,

    // 标题配置
    title: props.title
      ? {
          text: props.title,
          subtext: props.subtitle,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
          subtextStyle: {
            fontSize: 12,
            color: '#666',
          },
        }
      : undefined,

    // 图例配置
    legend: props.showLegend
      ? {
          top: props.title ? '10%' : '5%',
          data: props.data.map((item) => item.name),
        }
      : undefined,

    // 网格配置
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: props.title ? (props.showLegend ? '20%' : '15%') : props.showLegend ? '15%' : '10%',
      containLabel: true,
      show: props.showGrid,
      borderColor: '#E4E7ED',
    },

    // X轴配置
    xAxis: {
      type: 'category',
      data: props.categories,
      axisLine: {
        lineStyle: {
          color: '#E4E7ED',
        },
      },
      axisLabel: {
        color: '#606266',
        fontSize: 12,
      },
      axisTick: {
        show: false,
      },
    },

    // Y轴配置
    yAxis: {
      type: 'value',
      name: props.yAxisUnit,
      nameTextStyle: {
        color: '#606266',
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#606266',
        fontSize: 12,
        formatter: (value: number) => {
          if (props.yAxisUnit) {
            return `${value}${props.yAxisUnit}`
          }
          return value.toString()
        },
      },
      splitLine: {
        lineStyle: {
          color: '#F2F6FC',
          type: 'dashed',
        },
      },
    },

    // 系列数据配置
    series: props.data.map((item, index) => ({
      name: item.name,
      type: 'bar',
      data: item.data.map((d) => d.value),
      barWidth: props.barWidth,
      stack: props.stack ? 'total' : undefined,
      itemStyle: {
        color: item.color || colors.series[index % colors.series.length],
        borderRadius: [4, 4, 0, 0],
      },
      label: props.showLabel
        ? {
            show: true,
            position: 'top',
            fontSize: 12,
            color: '#606266',
            formatter: (params: any) => {
              if (props.yAxisUnit) {
                return `${params.value}${props.yAxisUnit}`
              }
              return params.value
            },
          }
        : undefined,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)',
        },
      },
    })),

    // 工具提示配置
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: 'rgba(50, 50, 50, 0.9)',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      formatter: (params: any) => {
        if (Array.isArray(params)) {
          let result = `${params[0].axisValue}<br/>`
          params.forEach((param: any) => {
            const unit = props.yAxisUnit || ''
            result += `${param.marker}${param.seriesName}: ${param.value}${unit}<br/>`
          })
          return result
        }
        return ''
      },
    },
  }

  return option
})

/**
 * 处理柱子点击事件
 */
const handleClick = (params: any) => {
  emit('barClick', params)
}

/**
 * 处理图表初始化完成事件
 */
const handleReady = (chart: any) => {
  emit('ready', chart)
}
</script>
