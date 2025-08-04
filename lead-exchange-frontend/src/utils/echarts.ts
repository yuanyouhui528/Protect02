/**
 * ECharts 配置文件
 * 用于全局配置 ECharts 主题、默认选项等
 */
// 按需导入 ECharts 核心模块
import * as echarts from 'echarts/core'

// 导入图表类型
import { BarChart, LineChart, PieChart } from 'echarts/charts'

// 导入组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GraphicComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components'

// 导入渲染器
import { CanvasRenderer } from 'echarts/renderers'

// 注册必要的组件
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GraphicComponent,
  DatasetComponent,
  TransformComponent,
  CanvasRenderer,
])

// 默认主题配置
const defaultTheme = {
  color: [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
  ],
  backgroundColor: 'transparent',
  textStyle: {},
  title: {
    textStyle: {
      color: '#333',
    },
    subtextStyle: {
      color: '#999',
    },
  },
  line: {
    itemStyle: {
      borderWidth: 1,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false,
  },
  radar: {
    itemStyle: {
      borderWidth: 1,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false,
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: '#ccc',
    },
  },
  pie: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
  },
  scatter: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
  },
  boxplot: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
  },
  parallel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
  },
  sankey: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
  },
  funnel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
  },
  candlestick: {
    itemStyle: {
      color: '#c23531',
      color0: '#314656',
      borderColor: '#c23531',
      borderColor0: '#314656',
      borderWidth: 1,
    },
  },
  graph: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc',
    },
    lineStyle: {
      width: 1,
      color: '#aaa',
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: false,
    color: [
      '#5470c6',
      '#91cc75',
      '#fac858',
      '#ee6666',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
      '#ea7ccc',
    ],
    label: {
      color: '#eee',
    },
  },
  map: {
    itemStyle: {
      areaColor: '#eee',
      borderColor: '#444',
      borderWidth: 0.5,
    },
    label: {
      color: '#000',
    },
    emphasis: {
      itemStyle: {
        areaColor: 'rgba(255,215,0,0.8)',
        borderColor: '#444',
        borderWidth: 1,
      },
      label: {
        color: 'rgb(100,0,0)',
      },
    },
  },
  geo: {
    itemStyle: {
      areaColor: '#eee',
      borderColor: '#444',
      borderWidth: 0.5,
    },
    label: {
      color: '#000',
    },
    emphasis: {
      itemStyle: {
        areaColor: 'rgba(255,215,0,0.8)',
        borderColor: '#444',
        borderWidth: 1,
      },
      label: {
        color: 'rgb(100,0,0)',
      },
    },
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisLabel: {
      show: true,
      color: '#6E7079',
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#E0E6F1'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisLabel: {
      show: true,
      color: '#6E7079',
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#E0E6F1'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
      },
    },
  },
  logAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisLabel: {
      show: true,
      color: '#6E7079',
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#E0E6F1'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
      },
    },
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#6E7079',
      },
    },
    axisLabel: {
      show: true,
      color: '#6E7079',
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['#E0E6F1'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.2)', 'rgba(210,219,238,0.2)'],
      },
    },
  },
  toolbox: {
    iconStyle: {
      borderColor: '#999',
    },
    emphasis: {
      iconStyle: {
        borderColor: '#666',
      },
    },
  },
  legend: {
    textStyle: {
      color: '#333',
    },
  },
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: '#ccc',
        width: 1,
      },
      crossStyle: {
        color: '#ccc',
        width: 1,
      },
    },
  },
  timeline: {
    lineStyle: {
      color: '#DAE1F5',
      width: 2,
    },
    itemStyle: {
      color: '#A4B1D7',
      borderWidth: 1,
    },
    controlStyle: {
      color: '#A4B1D7',
      borderColor: '#A4B1D7',
      borderWidth: 1,
    },
    checkpointStyle: {
      color: '#316bf3',
      borderColor: 'fff',
    },
    label: {
      color: '#A4B1D7',
    },
    emphasis: {
      itemStyle: {
        color: '#FFF',
      },
      controlStyle: {
        color: '#A4B1D7',
        borderColor: '#A4B1D7',
        borderWidth: 1,
      },
      label: {
        color: '#A4B1D7',
      },
    },
  },
  visualMap: {
    color: ['#bf444c', '#d88273', '#f6efa6'],
  },
  dataZoom: {
    handleSize: 'undefined%',
    textStyle: {},
  },
  markPoint: {
    label: {
      color: '#eee',
    },
    emphasis: {
      label: {
        color: '#eee',
      },
    },
  },
}

// 注册默认主题
echarts.registerTheme('default', defaultTheme)

// 默认配置选项（开发环境优化版本）
export const defaultOptions = {
  // 全局配置 - 开发环境性能优化
  animation: import.meta.env.VITE_DEV_DISABLE_CHART_ANIMATION !== 'true',
  animationDuration: import.meta.env.VITE_DEV_DISABLE_CHART_ANIMATION === 'true' ? 0 : 1000,
  animationEasing: 'cubicOut' as const,

  // 响应式配置
  responsive: true,

  // 工具提示配置
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    borderColor: 'rgba(50, 50, 50, 0.8)',
    textStyle: {
      color: '#fff',
    },
    // 开发环境下简化tooltip渲染
    renderMode: import.meta.env.VITE_DEV_SIMPLIFIED_CHARTS === 'true' ? 'html' : 'richText',
  },

  // 图例配置
  legend: {
    top: '5%',
    textStyle: {
      fontSize: 12,
    },
  },

  // 网格配置
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },

  // 开发环境性能优化配置
  ...(import.meta.env.VITE_DEV_SIMPLIFIED_CHARTS === 'true' && {
    // 禁用不必要的视觉效果
    emphasis: {
      disabled: true
    },
    // 简化渲染
    progressive: 0,
    progressiveThreshold: 1000,
    // 减少重绘
    hoverLayerThreshold: 3000,
  })
}

// 常用颜色配置
export const colors = {
  primary: '#409EFF',
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  info: '#909399',

  // 图表颜色系列
  series: [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
  ],

  // 渐变色配置
  gradients: {
    blue: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: 'rgba(84, 112, 198, 0.8)' },
        { offset: 1, color: 'rgba(84, 112, 198, 0.1)' },
      ],
    },
    green: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: 'rgba(145, 204, 117, 0.8)' },
        { offset: 1, color: 'rgba(145, 204, 117, 0.1)' },
      ],
    },
  },
}

// 图表尺寸配置
export const chartSizes = {
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 800, height: 500 },
  xlarge: { width: 1200, height: 600 },
}

// 开发环境优化的ECharts初始化函数
export const initChart = (container: HTMLElement, theme?: string) => {
  const isDevSimplified = import.meta.env.VITE_DEV_SIMPLIFIED_CHARTS === 'true'
  
  const chartOptions = {
    renderer: 'canvas' as const,
    useDirtyRect: !isDevSimplified, // 开发环境禁用脏矩形优化，减少计算开销
    useCoarsePointer: isDevSimplified, // 开发环境启用粗糙指针，提升触摸性能
    pointerSize: isDevSimplified ? 20 : 10, // 开发环境增大指针大小
    ssr: false,
    width: 'auto',
    height: 'auto',
    locale: 'ZH'
  }
  
  const chart = echarts.init(container, theme || 'default', chartOptions)
  
  // 开发环境性能优化
  if (isDevSimplified) {
    console.log('🚀 ECharts开发模式：启用性能优化配置')
    
    // 禁用部分事件监听，减少性能开销
    chart.getZr().off('click')
    chart.getZr().off('dblclick')
    chart.getZr().off('mousewheel')
  }
  
  return chart
}

// 开发环境优化的图表配置合并函数
export const mergeChartOptions = (userOptions: any) => {
  const isDevSimplified = import.meta.env.VITE_DEV_SIMPLIFIED_CHARTS === 'true'
  
  if (isDevSimplified) {
    // 开发环境下简化配置
    const simplifiedOptions = {
      ...defaultOptions,
      ...userOptions,
      // 强制禁用动画
      animation: false,
      animationDuration: 0,
      // 简化数据处理
      lazyUpdate: true,
      // 减少渲染频率
      silent: true
    }
    
    console.log('🚀 ECharts开发模式：应用简化配置')
    return simplifiedOptions
  }
  
  // 生产环境完整配置
  return {
    ...defaultOptions,
    ...userOptions
  }
}

// 导出 echarts 实例
export default echarts
