import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 导入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入Element Plus中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'

const app = createApp(App)

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

app.mount('#app')
