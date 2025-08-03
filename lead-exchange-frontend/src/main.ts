import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 导入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入Element Plus中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 导入HTTP客户端配置
import '@/utils/http'
// 导入ECharts配置
import '@/utils/echarts'

import App from './App.vue'
import router from './router'

// 引入环境变量工具
import { logEnvironmentInfo, envConfig } from './utils/env'
// 引入认证组合式API
import { useAuth } from './composables/useAuth'

// 打印环境信息（仅在开发环境）
logEnvironmentInfo()

const app = createApp(App)

// 全局属性：环境配置
app.config.globalProperties.$env = envConfig

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
  if (envConfig.monitor.errorReporting) {
    // 这里可以集成错误上报服务
    console.log('Error would be reported to monitoring service')
  }
}

// 注册Pinia状态管理
app.use(createPinia())
// 注册Vue Router路由
app.use(router)
// 注册Element Plus UI组件库，配置中文语言
app.use(ElementPlus, {
  locale: zhCn,
})

// 注册Element Plus图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 初始化认证状态
const { initAuth } = useAuth()
initAuth().then(() => {
  // 认证状态初始化完成后挂载应用
  app.mount('#app')
}).catch((error) => {
  console.error('认证初始化失败:', error)
  // 即使认证初始化失败也要挂载应用
  app.mount('#app')
})

// 在开发环境下暴露一些调试信息到全局
if (envConfig.app.debug) {
  ;(window as any).__APP__ = {
    version: envConfig.app.version,
    env: envConfig.app.env,
    config: envConfig
  }
}
