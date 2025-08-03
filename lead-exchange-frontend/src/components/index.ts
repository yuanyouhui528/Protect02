// 组件统一导出文件
// 提供所有组件的统一入口

// UI组件导出
export * from './ui'

// 业务组件导出
export * from './business'

// 图表组件导出
export * from './charts'

/**
 * 组件使用说明：
 *
 * 1. UI组件：通用的界面组件，不包含业务逻辑
 *    import { Button, Input, Table } from '@/components';
 *
 * 2. 业务组件：包含特定业务逻辑的组件
 *    import { LeadCard, UserProfile, ExchangeList } from '@/components';
 *
 * 3. 图表组件：基于ECharts的图表组件
 *    import { LineChart, BarChart, PieChart } from '@/components';
 *
 * 4. 按需导入：
 *    import { Button } from '@/components/ui';
 *    import { LeadCard } from '@/components/business';
 *    import { LineChart } from '@/components/charts';
 */
