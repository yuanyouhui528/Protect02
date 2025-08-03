// Pinia 状态管理配置
// 配置和注册 Pinia 状态管理插件

import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

/**
 * 创建 Pinia 实例
 */
function createPiniaInstance() {
  const pinia = createPinia()

  // 添加持久化插件
  pinia.use(
    createPersistedState({
      // 默认存储到 localStorage
      storage: localStorage,
      // 序列化函数
      serializer: {
        serialize: JSON.stringify,
        deserialize: JSON.parse,
      },
      // 默认不持久化，需要在 store 中显式配置
      auto: false,
      // 调试模式
      debug: import.meta.env.DEV,
    }),
  )

  return pinia
}

/**
 * 安装和配置 Pinia
 * @param app Vue应用实例
 */
export function setupPinia(app: App): void {
  const pinia = createPiniaInstance()

  // 安装 Pinia 插件
  app.use(pinia)

  console.log('✅ Pinia 状态管理插件已成功配置')
}

// 导出 Pinia 实例供其他模块使用
export const pinia = createPiniaInstance()

// 导出常用类型
export type {
  Store,
  StoreDefinition,
  StateTree,
  _GettersTree as GettersTree,
  _ActionsTree as ActionsTree,
} from 'pinia'
