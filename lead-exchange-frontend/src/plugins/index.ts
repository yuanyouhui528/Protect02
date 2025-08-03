// 插件配置入口文件
// 注册和配置所有第三方插件

import type { App } from 'vue';
import { setupElementPlus } from './element-plus';
import { setupECharts } from './echarts';
import { setupI18n } from './i18n';
import { setupPinia } from './pinia';

/**
 * 安装所有插件
 * @param app Vue应用实例
 */
export function setupPlugins(app: App): void {
  // 安装Pinia状态管理
  setupPinia(app);
  
  // 安装Element Plus UI组件库
  setupElementPlus(app);
  
  // 安装ECharts图表库
  setupECharts(app);
  
  // 安装国际化插件
  setupI18n(app);
}

// 导出各个插件配置
export {
  setupElementPlus,
  setupECharts,
  setupI18n,
  setupPinia
};