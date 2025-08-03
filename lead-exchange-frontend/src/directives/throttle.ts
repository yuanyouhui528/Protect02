// 节流指令
// 用于限制事件触发频率，在指定时间内最多执行一次

import type { Directive, DirectiveBinding } from 'vue'

/**
 * 节流配置选项
 */
interface ThrottleOptions {
  /** 节流间隔时间（毫秒），默认300ms */
  delay?: number
  /** 是否在开始时立即执行，默认true */
  leading?: boolean
  /** 是否在结束时执行，默认false */
  trailing?: boolean
  /** 要节流的事件类型，默认'click' */
  event?: string
}

/**
 * 事件处理函数类型
 */
type EventHandler = (event: Event) => void

/**
 * 指令绑定的元素扩展接口
 */
interface ThrottleElement extends HTMLElement {
  __throttleTimer__?: number
  __throttleHandler__?: EventHandler
  __originalHandler__?: EventHandler
  __throttleOptions__?: ThrottleOptions
  __lastExecTime__?: number
  __lastArgs__?: any[]
}

/**
 * 创建节流函数
 * @param func 要节流的函数
 * @param delay 间隔时间
 * @param leading 是否在开始时执行
 * @param trailing 是否在结束时执行
 * @returns 节流后的函数
 */
function createThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300,
  leading: boolean = true,
  trailing: boolean = false,
): (...args: Parameters<T>) => void {
  let timer: number | undefined
  let lastExecTime = 0
  let lastArgs: Parameters<T>

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastExec = now - lastExecTime

    // 保存参数
    lastArgs = args

    // 如果是第一次调用且允许立即执行
    if (lastExecTime === 0 && leading) {
      lastExecTime = now
      return func.apply(this, args)
    }

    // 如果距离上次执行时间超过间隔
    if (timeSinceLastExec >= delay) {
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }

      lastExecTime = now
      return func.apply(this, args)
    }

    // 如果允许尾部执行且没有定时器
    if (trailing && !timer) {
      timer = window.setTimeout(() => {
        lastExecTime = leading ? Date.now() : 0
        timer = undefined
        func.apply(this, lastArgs)
      }, delay - timeSinceLastExec)
    }
  }
}

/**
 * 解析指令绑定值
 * @param value 指令值
 * @returns 节流选项和处理函数
 */
function parseThrottleValue(value: any): { options: ThrottleOptions; handler: EventHandler } {
  // 如果值是函数，使用默认配置
  if (typeof value === 'function') {
    return {
      options: { delay: 300, leading: true, trailing: false, event: 'click' },
      handler: value,
    }
  }

  // 如果值是对象，解析配置和处理函数
  if (typeof value === 'object' && value !== null) {
    const { handler, delay = 300, leading = true, trailing = false, event = 'click' } = value

    if (typeof handler !== 'function') {
      throw new Error('[v-throttle] handler 必须是一个函数')
    }

    return {
      options: { delay, leading, trailing, event },
      handler,
    }
  }

  throw new Error('[v-throttle] 指令值必须是函数或包含 handler 属性的对象')
}

/**
 * 创建节流事件处理器
 * @param originalHandler 原始处理函数
 * @param options 节流选项
 * @returns 节流处理器
 */
function createThrottleHandler(
  originalHandler: EventHandler,
  options: ThrottleOptions,
): EventHandler {
  const { delay = 300, leading = true, trailing = false } = options

  return createThrottle(
    (event: Event) => {
      originalHandler(event)
    },
    delay,
    leading,
    trailing,
  )
}

/**
 * 绑定节流事件
 * @param el 目标元素
 * @param handler 事件处理器
 * @param eventType 事件类型
 */
function bindThrottleEvent(el: ThrottleElement, handler: EventHandler, eventType: string): void {
  el.addEventListener(eventType, handler)
}

/**
 * 解绑节流事件
 * @param el 目标元素
 * @param handler 事件处理器
 * @param eventType 事件类型
 */
function unbindThrottleEvent(el: ThrottleElement, handler: EventHandler, eventType: string): void {
  el.removeEventListener(eventType, handler)
}

/**
 * 清理节流定时器
 * @param el 目标元素
 */
function clearThrottleTimer(el: ThrottleElement): void {
  if (el.__throttleTimer__) {
    clearTimeout(el.__throttleTimer__)
    delete el.__throttleTimer__
  }
}

/**
 * 节流指令实现
 */
export const throttle: Directive = {
  /**
   * 指令挂载时调用
   */
  mounted(el: ThrottleElement, binding: DirectiveBinding) {
    try {
      const { options, handler } = parseThrottleValue(binding.value)
      const { event = 'click' } = options

      // 创建节流处理器
      const throttleHandler = createThrottleHandler(handler, options)

      // 保存引用
      el.__throttleHandler__ = throttleHandler
      el.__originalHandler__ = handler
      el.__throttleOptions__ = options
      el.__lastExecTime__ = 0

      // 绑定事件
      bindThrottleEvent(el, throttleHandler, event)
    } catch (error) {
      console.error('[v-throttle] 指令初始化失败:', error)
    }
  },

  /**
   * 指令更新时调用
   */
  updated(el: ThrottleElement, binding: DirectiveBinding) {
    try {
      const { options: newOptions, handler: newHandler } = parseThrottleValue(binding.value)
      const oldOptions = el.__throttleOptions__
      const oldHandler = el.__throttleHandler__

      // 检查是否需要重新绑定
      const needsRebind =
        !oldOptions ||
        !oldHandler ||
        newOptions.event !== oldOptions.event ||
        newOptions.delay !== oldOptions.delay ||
        newOptions.leading !== oldOptions.leading ||
        newOptions.trailing !== oldOptions.trailing ||
        newHandler !== el.__originalHandler__

      if (needsRebind) {
        // 解绑旧事件
        if (oldHandler && oldOptions) {
          unbindThrottleEvent(el, oldHandler, oldOptions.event || 'click')
        }

        // 清理定时器
        clearThrottleTimer(el)

        // 创建新的节流处理器
        const newThrottleHandler = createThrottleHandler(newHandler, newOptions)

        // 更新引用
        el.__throttleHandler__ = newThrottleHandler
        el.__originalHandler__ = newHandler
        el.__throttleOptions__ = newOptions
        el.__lastExecTime__ = 0

        // 绑定新事件
        bindThrottleEvent(el, newThrottleHandler, newOptions.event || 'click')
      }
    } catch (error) {
      console.error('[v-throttle] 指令更新失败:', error)
    }
  },

  /**
   * 指令卸载时调用
   */
  unmounted(el: ThrottleElement) {
    // 解绑事件
    if (el.__throttleHandler__ && el.__throttleOptions__) {
      unbindThrottleEvent(el, el.__throttleHandler__, el.__throttleOptions__.event || 'click')
    }

    // 清理定时器
    clearThrottleTimer(el)

    // 清理引用
    delete el.__throttleHandler__
    delete el.__originalHandler__
    delete el.__throttleOptions__
    delete el.__lastExecTime__
    delete el.__lastArgs__
  },
}

/**
 * 使用示例：
 *
 * <template>
 *   <!-- 基础用法：节流点击事件 -->
 *   <button v-throttle="handleClick">点击按钮</button>
 *
 *   <!-- 自定义间隔时间 -->
 *   <button v-throttle="{
 *     handler: handleSave,
 *     delay: 1000
 *   }">
 *     保存数据
 *   </button>
 *
 *   <!-- 禁用立即执行，启用尾部执行 -->
 *   <button v-throttle="{
 *     handler: handleSubmit,
 *     delay: 2000,
 *     leading: false,
 *     trailing: true
 *   }">
 *     提交表单
 *   </button>
 *
 *   <!-- 节流滚动事件 -->
 *   <div v-throttle="{
 *     handler: handleScroll,
 *     delay: 100,
 *     event: 'scroll'
 *   }"
 *   class="scroll-container">
 *     滚动内容
 *   </div>
 *
 *   <!-- 节流鼠标移动事件 -->
 *   <div v-throttle="{
 *     handler: handleMouseMove,
 *     delay: 50,
 *     event: 'mousemove'
 *   }"
 *   class="mouse-area">
 *     鼠标移动区域
 *   </div>
 *
 *   <!-- 节流窗口大小调整事件 -->
 *   <div v-throttle="{
 *     handler: handleResize,
 *     delay: 200,
 *     event: 'resize'
 *   }">
 *     响应式内容
 *   </div>
 *
 *   <!-- 在表格中使用 -->
 *   <el-table>
 *     <el-table-column>
 *       <template #default="{ row }">
 *         <el-button
 *           v-throttle="{
 *             handler: () => handleEdit(row),
 *             delay: 500
 *           }"
 *           size="small"
 *         >
 *           编辑
 *         </el-button>
 *
 *         <el-button
 *           v-throttle="{
 *             handler: () => handleDelete(row),
 *             delay: 1000,
 *             leading: true,
 *             trailing: false
 *           }"
 *           size="small"
 *           type="danger"
 *         >
 *           删除
 *         </el-button>
 *       </template>
 *     </el-table-column>
 *   </el-table>
 *
 *   <!-- 在分页中使用 -->
 *   <el-pagination
 *     v-throttle="{
 *       handler: handlePageChange,
 *       delay: 300,
 *       event: 'click'
 *     }"
 *     :current-page="currentPage"
 *     :page-size="pageSize"
 *     :total="total"
 *   />
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue';
 *
 * const currentPage = ref(1);
 * const pageSize = ref(10);
 * const total = ref(100);
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
 * // 滚动处理
 * const handleScroll = (event: Event) => {
 *   const target = event.target as HTMLElement;
 *   console.log('滚动位置:', target.scrollTop);
 * };
 *
 * // 鼠标移动处理
 * const handleMouseMove = (event: Event) => {
 *   const mouseEvent = event as MouseEvent;
 *   console.log('鼠标位置:', mouseEvent.clientX, mouseEvent.clientY);
 * };
 *
 * // 窗口大小调整处理
 * const handleResize = () => {
 *   console.log('窗口大小:', window.innerWidth, window.innerHeight);
 * };
 *
 * // 编辑处理
 * const handleEdit = (row: any) => {
 *   console.log('编辑行:', row);
 * };
 *
 * // 删除处理
 * const handleDelete = (row: any) => {
 *   console.log('删除行:', row);
 * };
 *
 * // 分页变化处理
 * const handlePageChange = () => {
 *   console.log('分页变化');
 * };
 * </script>
 *
 * <style scoped>
 * .scroll-container {
 *   height: 300px;
 *   overflow-y: auto;
 *   border: 1px solid #ddd;
 *   padding: 20px;
 * }
 *
 * .mouse-area {
 *   width: 400px;
 *   height: 200px;
 *   border: 2px dashed #ccc;
 *   display: flex;
 *   align-items: center;
 *   justify-content: center;
 *   cursor: crosshair;
 * }
 * </style>
 */
