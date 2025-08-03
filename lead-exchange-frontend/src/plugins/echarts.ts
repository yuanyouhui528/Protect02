// ECharts 图表库配置
// 配置和注册 ECharts 图表组件

import type { App } from 'vue'
import * as echarts from 'echarts/core'
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  SingleAxisComponent,
  BrushComponent,
  GeoComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

/**
 * 注册 ECharts 组件
 */
function registerEChartsComponents(): void {
  // 注册图表类型
  echarts.use([
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    RadarChart,
    MapChart,
    TreeChart,
    TreemapChart,
    GraphChart,
    GaugeChart,
    FunnelChart,
    ParallelChart,
    SankeyChart,
    BoxplotChart,
    CandlestickChart,
    EffectScatterChart,
    LinesChart,
    HeatmapChart,
    PictorialBarChart,
    ThemeRiverChart,
    SunburstChart,
    CustomChart,
  ])

  // 注册组件
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    PolarComponent,
    AriaComponent,
    ParallelComponent,
    LegendComponent,
    RadarComponent,
    ToolboxComponent,
    DataZoomComponent,
    VisualMapComponent,
    TimelineComponent,
    CalendarComponent,
    GraphicComponent,
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
    SingleAxisComponent,
    BrushComponent,
    GeoComponent,
    DatasetComponent,
    TransformComponent,
  ])

  // 注册功能
  echarts.use([LabelLayout, UniversalTransition])

  // 注册渲染器
  echarts.use([CanvasRenderer])
}

/**
 * 配置 ECharts 全局设置
 */
function configureECharts(): void {
  // 设置默认主题
  echarts.registerTheme('default', {
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
    backgroundColor: 'rgba(0,0,0,0)',
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
        color: '#fd1050',
        color0: '#0cf49b',
        borderColor: '#fd1050',
        borderColor0: '#0cf49b',
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
  })
}

/**
 * 安装和配置 ECharts
 * @param app Vue应用实例
 */
export function setupECharts(app: App): void {
  // 注册 ECharts 组件
  registerEChartsComponents()

  // 配置 ECharts
  configureECharts()

  // 将 echarts 实例挂载到全局属性
  app.config.globalProperties.$echarts = echarts

  console.log('✅ ECharts 图表库已成功配置')
}

// 导出 echarts 实例供其他模块使用
export { echarts }

// 导出常用类型
export type { EChartsOption, ECharts } from 'echarts'
