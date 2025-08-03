// 自定义指令入口文件
// 注册和导出所有自定义指令

import type { App } from 'vue'
import { permission } from './permission'
import { loading } from './loading'
import { clickOutside } from './clickOutside'
import { copy } from './copy'
import { debounce } from './debounce'
import { throttle } from './throttle'

/**
 * 注册所有自定义指令
 * @param app Vue应用实例
 */
export function setupDirectives(app: App): void {
  // 权限指令
  app.directive('permission', permission)

  // 加载指令
  app.directive('loading', loading)

  // 点击外部指令
  app.directive('click-outside', clickOutside)

  // 复制指令
  app.directive('copy', copy)

  // 防抖指令
  app.directive('debounce', debounce)

  // 节流指令
  app.directive('throttle', throttle)
}

// 导出所有指令
export { permission, loading, clickOutside, copy, debounce, throttle }
