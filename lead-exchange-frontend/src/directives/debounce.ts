// 防抖指令
// 用于防止频繁触发事件，在指定时间内只执行最后一次

import type { Directive, DirectiveBinding } from 'vue'

/**
 * 防抖配置选项
 */
interface DebounceOptions {
  /** 防抖延迟时间（毫秒），默认300ms */
  delay?: number
  /** 是否立即执行第一次，默认false */
  immediate?: boolean
  /** 要防抖的事件类型，默认'click' */
  event?: string
}

/**
 * 事件处理函数类型
 */
type EventHandler = (event?: Event) => void

/**
 * 指令绑定的元素扩展接口
 */
interface DebounceElement extends HTMLElement {
  __debounceTimer__?: number
  __debounceHandler__?: EventHandler
  __originalHandler__?: EventHandler
  __debounceOptions__?: DebounceOptions
}

/**
 * 创建防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 */
function createDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300,
  immediate: boolean = false,
): (...args: Parameters<T>) => void {
  let timer: number | undefined
  let hasInvoked = false

  return function (this: any, ...args: Parameters<T>) {
    const callNow = immediate && !hasInvoked

    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer)
    }

    if (callNow) {
      // 立即执行
      func.apply(this, args)
      hasInvoked = true
    }

    // 设置新的定时器
    timer = window.setTimeout(() => {
      if (!immediate) {
        func.apply(this, args)
      }
      hasInvoked = false
      timer = undefined
    }, delay)
  }
}

/**
 * 解析指令绑定值
 * @param value 指令值
 * @returns 防抖选项和处理函数
 */
function parseDebounceValue(value: any): { options: DebounceOptions; handler: EventHandler } {
  // 如果值是函数，使用默认配置
  if (typeof value === 'function') {
    return {
      options: { delay: 300, immediate: false, event: 'click' },
      handler: value,
    }
  }

  // 如果值是对象，解析配置和处理函数
  if (typeof value === 'object' && value !== null) {
    const { handler, delay = 300, immediate = false, event = 'click' } = value

    if (typeof handler !== 'function') {
      throw new Error('[v-debounce] handler 必须是一个函数')
    }

    return {
      options: { delay, immediate, event },
      handler,
    }
  }

  throw new Error('[v-debounce] 指令值必须是函数或包含 handler 属性的对象')
}

/**
 * 创建防抖事件处理器
 * @param originalHandler 原始处理函数
 * @param options 防抖选项
 * @returns 防抖处理器
 */
function createDebounceHandler(
  originalHandler: EventHandler,
  options: DebounceOptions,
): EventHandler {
  const { delay = 300, immediate = false } = options

  return createDebounce(
    (event?: Event) => {
      originalHandler(event)
    },
    delay,
    immediate,
  )
}

/**
 * 绑定防抖事件
 * @param el 目标元素
 * @param handler 事件处理器
 * @param eventType 事件类型
 */
function bindDebounceEvent(
  el: DebounceElement,
  handler: (event: Event) => void,
  eventType: string,
): void {
  el.addEventListener(eventType, handler)
}

/**
 * 解绑防抖事件
 * @param el 目标元素
 * @param handler 事件处理器
 * @param eventType 事件类型
 */
function unbindDebounceEvent(
  el: DebounceElement,
  handler: (event: Event) => void,
  eventType: string,
): void {
  el.removeEventListener(eventType, handler)
}

/**
 * 清理防抖定时器
 * @param el 目标元素
 */
function clearDebounceTimer(el: DebounceElement): void {
  if (el.__debounceTimer__) {
    clearTimeout(el.__debounceTimer__)
    delete el.__debounceTimer__
  }
}

/**
 * 防抖指令实现
 */
export const debounce: Directive = {
  /**
   * 指令挂载时调用
   */
  mounted(el: DebounceElement, binding: DirectiveBinding) {
    try {
      const { options, handler } = parseDebounceValue(binding.value)
      const { event = 'click' } = options

      // 创建防抖处理器
      const debounceHandler = createDebounceHandler(handler, options)

      // 保存引用
      el.__debounceHandler__ = debounceHandler
      el.__originalHandler__ = handler
      el.__debounceOptions__ = options

      // 绑定事件
      bindDebounceEvent(el, debounceHandler, event)
    } catch (error) {
      console.error('[v-debounce] 指令初始化失败:', error)
    }
  },

  /**
   * 指令更新时调用
   */
  updated(el: DebounceElement, binding: DirectiveBinding) {
    try {
      const { options: newOptions, handler: newHandler } = parseDebounceValue(binding.value)
      const oldOptions = el.__debounceOptions__
      const oldHandler = el.__debounceHandler__

      // 检查是否需要重新绑定
      const needsRebind =
        !oldOptions ||
        !oldHandler ||
        newOptions.event !== oldOptions.event ||
        newOptions.delay !== oldOptions.delay ||
        newOptions.immediate !== oldOptions.immediate ||
        newHandler !== el.__originalHandler__

      if (needsRebind) {
        // 解绑旧事件
        if (oldHandler && oldOptions) {
          unbindDebounceEvent(el, oldHandler, oldOptions.event || 'click')
        }

        // 清理定时器
        clearDebounceTimer(el)

        // 创建新的防抖处理器
        const newDebounceHandler = createDebounceHandler(newHandler, newOptions)

        // 更新引用
        el.__debounceHandler__ = newDebounceHandler
        el.__originalHandler__ = newHandler
        el.__debounceOptions__ = newOptions

        // 绑定新事件
        bindDebounceEvent(el, newDebounceHandler, newOptions.event || 'click')
      }
    } catch (error) {
      console.error('[v-debounce] 指令更新失败:', error)
    }
  },

  /**
   * 指令卸载时调用
   */
  unmounted(el: DebounceElement) {
    // 解绑事件
    if (el.__debounceHandler__ && el.__debounceOptions__) {
      unbindDebounceEvent(el, el.__debounceHandler__, el.__debounceOptions__.event || 'click')
    }

    // 清理定时器
    clearDebounceTimer(el)

    // 清理引用
    delete el.__debounceHandler__
    delete el.__originalHandler__
    delete el.__debounceOptions__
  },
}

/**
 * 使用示例：
 *
 * <template>
 *   <!-- 基础用法：防抖点击事件 -->
 *   <button v-debounce="handleClick">点击按钮</button>
 *
 *   <!-- 自定义延迟时间 -->
 *   <button v-debounce="{
 *     handler: handleSave,
 *     delay: 500
 *   }">
 *     保存数据
 *   </button>
 *
 *   <!-- 立即执行第一次 -->
 *   <button v-debounce="{
 *     handler: handleSubmit,
 *     delay: 1000,
 *     immediate: true
 *   }">
 *     提交表单
 *   </button>
 *
 *   <!-- 防抖输入事件 -->
 *   <input v-debounce="{
 *     handler: handleSearch,
 *     delay: 300,
 *     event: 'input'
 *   }"
 *   placeholder="搜索..." />
 *
 *   <!-- 防抖滚动事件 -->
 *   <div v-debounce="{
 *     handler: handleScroll,
 *     delay: 100,
 *     event: 'scroll'
 *   }"
 *   class="scroll-container">
 *     滚动内容
 *   </div>
 *
 *   <!-- 在表单中使用 -->
 *   <el-form>
 *     <el-form-item>
 *       <el-input
 *         v-model="searchKeyword"
 *         v-debounce="{
 *           handler: performSearch,
 *           delay: 500,
 *           event: 'input'
 *         }"
 *         placeholder="输入关键词搜索"
 *       />
 *     </el-form-item>
 *
 *     <el-form-item>
 *       <el-button
 *         v-debounce="{
 *           handler: submitForm,
 *           delay: 1000,
 *           immediate: true
 *         }"
 *         type="primary"
 *       >
 *         提交
 *       </el-button>
 *     </el-form-item>
 *   </el-form>
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue';
 *
 * const searchKeyword = ref('');
 *
 * // 基础点击处理
 * const handleClick = () => {
 *   console.log('按钮被点击');
 * };
 *
 * // 保存数据
 * const handleSave = () => {
 *   console.log('保存数据');
 * };
 *
 * // 提交表单
 * const handleSubmit = () => {
 *   console.log('提交表单');
 * };
 *
 * // 搜索处理
 * const handleSearch = (event: Event) => {
 *   const target = event.target as HTMLInputElement;
 *   console.log('搜索:', target.value);
 * };
 *
 * // 滚动处理
 * const handleScroll = (event: Event) => {
 *   console.log('滚动事件');
 * };
 *
 * // 执行搜索
 * const performSearch = () => {
 *   if (searchKeyword.value.trim()) {
 *     console.log('执行搜索:', searchKeyword.value);
 *   }
 * };
 *
 * // 提交表单
 * const submitForm = () => {
 *   console.log('表单提交');
 * };
 * </script>
 */
