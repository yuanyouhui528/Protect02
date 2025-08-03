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
 * 折线图组件
 * 基于BaseChart封装的折线图
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
  smooth?: boolean
  area?: boolean
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
  /** 是否平滑曲线 */
  smooth?: boolean
  /** 是否显示面积 */
  area?: boolean
  /** 是否自动调整大小 */
  autoResize?: boolean
  /** 加载状态 */
  loading?: boolean
  /** Y轴单位 */
  yAxisUnit?: string
  /** 是否显示数值标签 */
  showLabel?: boolean
  /** 是否显示数据点 */
  showSymbol?: boolean
}

// 定义属性默认值
const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '400px',
  showLegend: true,
  showGrid: true,
  smooth: false,
  area: false,
  autoResize: true,
  loading: false,
  showLabel: false,
  showSymbol: true,
})

// 定义事件
const emit = defineEmits<{
  /** 数据点击事件 */
  pointClick: [params: any]
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
      boundaryGap: false,
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
    series: props.data.map((item, index) => {
      const seriesColor = item.color || colors.series[index % colors.series.length]

      return {
        name: item.name,
        type: 'line',
        data: item.data.map((d) => d.value),
        smooth: item.smooth !== undefined ? item.smooth : props.smooth,
        symbol: props.showSymbol ? 'circle' : 'none',
        symbolSize: 6,
        lineStyle: {
          color: seriesColor,
          width: 2,
        },
        itemStyle: {
          color: seriesColor,
          borderColor: '#fff',
          borderWidth: 2,
        },
        areaStyle: (item.area !== undefined ? item.area : props.area)
          ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: seriesColor + '80' },
                  { offset: 1, color: seriesColor + '10' },
                ],
              },
            }
          : undefined,
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
          lineStyle: {
            width: 3,
          },
        },
      }
    }),

    // 工具提示配置
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
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
 * 处理数据点击事件
 */
const handleClick = (params: any) => {
  emit('pointClick', params)
}

/**
 * 处理图表初始化完成事件
 */
const handleReady = (chart: any) => {
  emit('ready', chart)
}
</script>
