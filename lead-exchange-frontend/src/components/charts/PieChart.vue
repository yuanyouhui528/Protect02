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
 * 饼图组件
 * 基于BaseChart封装的饼图
 */

// 数据项接口定义
interface DataItem {
  name: string
  value: number
  color?: string
}

// 组件属性定义
interface Props {
  /** 图表数据 */
  data: DataItem[]
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
  /** 图例位置 */
  legendPosition?: 'top' | 'bottom' | 'left' | 'right'
  /** 是否显示为环形图 */
  donut?: boolean
  /** 环形图内径比例 */
  innerRadius?: string
  /** 饼图半径 */
  radius?: string | [string, string]
  /** 是否自动调整大小 */
  autoResize?: boolean
  /** 加载状态 */
  loading?: boolean
  /** 是否显示数值标签 */
  showLabel?: boolean
  /** 是否显示百分比 */
  showPercent?: boolean
  /** 是否显示引导线 */
  showLabelLine?: boolean
  /** 数值单位 */
  unit?: string
}

// 定义属性默认值
const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '400px',
  showLegend: true,
  legendPosition: 'right',
  donut: false,
  innerRadius: '50%',
  radius: '70%',
  autoResize: true,
  loading: false,
  showLabel: true,
  showPercent: true,
  showLabelLine: true,
})

// 定义事件
const emit = defineEmits<{
  /** 扇形点击事件 */
  sectorClick: [params: any]
  /** 图表初始化完成事件 */
  ready: [chart: any]
}>()

// 计算总值
const totalValue = computed(() => {
  return props.data.reduce((sum, item) => sum + item.value, 0)
})

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
          top: '5%',
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
          orient: ['left', 'right'].includes(props.legendPosition) ? 'vertical' : 'horizontal',
          [props.legendPosition]:
            props.legendPosition === 'right'
              ? '5%'
              : props.legendPosition === 'left'
                ? '5%'
                : props.legendPosition === 'bottom'
                  ? '5%'
                  : '15%',
          data: props.data.map((item) => item.name),
          textStyle: {
            fontSize: 12,
            color: '#606266',
          },
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 10,
          formatter: (name: string) => {
            const item = props.data.find((d) => d.name === name)
            if (item && props.showPercent) {
              const percent = ((item.value / totalValue.value) * 100).toFixed(1)
              return `${name} (${percent}%)`
            }
            return name
          },
        }
      : undefined,

    // 系列数据配置
    series: [
      {
        type: 'pie',
        radius: props.donut 
          ? [props.innerRadius, typeof props.radius === 'string' ? props.radius : props.radius[1]] 
          : typeof props.radius === 'string' ? props.radius : props.radius[0],
        center: ['50%', '50%'],
        data: props.data.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.color || colors.series[index % colors.series.length],
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              scale: true,
              scaleSize: 5,
            },
          },
        })),
        label: props.showLabel
          ? {
              show: true,
              position: 'outside',
              fontSize: 12,
              color: '#606266',
              formatter: (params: any) => {
                const percent = ((params.value / totalValue.value) * 100).toFixed(1)
                let label = params.name

                if (props.showPercent) {
                  label += `\n${percent}%`
                }

                if (props.unit) {
                  label += `\n${params.value}${props.unit}`
                } else {
                  label += `\n${params.value}`
                }

                return label
              },
              rich: {
                name: {
                  fontSize: 12,
                  color: '#606266',
                },
                percent: {
                  fontSize: 11,
                  color: '#909399',
                },
                value: {
                  fontSize: 11,
                  color: '#909399',
                },
              },
            }
          : {
              show: false,
            },
        labelLine:
          props.showLabelLine && props.showLabel
            ? {
                show: true,
                length: 15,
                length2: 10,
                lineStyle: {
                  color: '#C0C4CC',
                },
              }
            : {
                show: false,
              },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (idx: number) => Math.random() * 200,
      },
    ],

    // 工具提示配置
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: 'rgba(50, 50, 50, 0.9)',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
      formatter: (params: any) => {
        const percent = ((params.value / totalValue.value) * 100).toFixed(1)
        const unit = props.unit || ''
        return `${params.marker}${params.name}<br/>数值: ${params.value}${unit}<br/>占比: ${percent}%`
      },
    },
  }

  // 如果是环形图且显示标题，在中心显示总计
  if (props.donut && props.title) {
    option.graphic = [
      {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: `总计\n${totalValue.value}${props.unit || ''}`,
          fill: '#606266',
          fontSize: 14,
          fontWeight: 'bold',
        } as any,
      },
    ]
  }

  return option
})

/**
 * 处理扇形点击事件
 */
const handleClick = (params: any) => {
  emit('sectorClick', params)
}

/**
 * 处理图表初始化完成事件
 */
const handleReady = (chart: any) => {
  emit('ready', chart)
}
</script>
