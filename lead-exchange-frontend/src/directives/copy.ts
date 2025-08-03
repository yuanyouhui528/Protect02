// 复制指令
// 用于一键复制文本内容到剪贴板

import type { Directive, DirectiveBinding } from 'vue'

/**
 * 复制配置选项
 */
interface CopyOptions {
  /** 要复制的文本内容 */
  text?: string
  /** 复制成功回调 */
  onSuccess?: (text: string) => void
  /** 复制失败回调 */
  onError?: (error: Error) => void
  /** 是否显示默认提示 */
  showMessage?: boolean
}

/**
 * 指令绑定的元素扩展接口
 */
interface CopyElement extends HTMLElement {
  __copyHandler__?: (event: Event) => void
  __copyOptions__?: CopyOptions
}

/**
 * 显示复制结果消息
 * @param success 是否成功
 * @param text 复制的文本
 */
function showCopyMessage(success: boolean, text: string): void {
  const message = success
    ? `复制成功: ${text.length > 20 ? text.substring(0, 20) + '...' : text}`
    : '复制失败，请手动复制'

  // 创建临时提示元素
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${success ? '#67c23a' : '#f56c6c'};
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: opacity 0.3s ease;
  `

  document.body.appendChild(toast)

  // 3秒后移除提示
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 2000)
}

/**
 * 使用现代 Clipboard API 复制文本
 * @param text 要复制的文本
 * @returns Promise<boolean>
 */
async function copyWithClipboardAPI(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.warn('Clipboard API 复制失败:', error)
    return false
  }
}

/**
 * 使用传统方法复制文本（兼容旧浏览器）
 * @param text 要复制的文本
 * @returns boolean
 */
function copyWithExecCommand(text: string): boolean {
  try {
    // 创建临时文本域
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.cssText = `
      position: fixed;
      top: -1000px;
      left: -1000px;
      opacity: 0;
      pointer-events: none;
    `

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    // 执行复制命令
    const success = document.execCommand('copy')

    // 清理临时元素
    document.body.removeChild(textArea)

    return success
  } catch (error) {
    console.warn('execCommand 复制失败:', error)
    return false
  }
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean>
 */
async function copyToClipboard(text: string): Promise<boolean> {
  // 优先使用现代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    return await copyWithClipboardAPI(text)
  }

  // 降级到传统方法
  return copyWithExecCommand(text)
}

/**
 * 获取要复制的文本内容
 * @param el 目标元素
 * @param options 复制选项
 * @returns 文本内容
 */
function getCopyText(el: HTMLElement, options: CopyOptions): string {
  // 优先使用配置中的文本
  if (options.text) {
    return options.text
  }

  // 从元素的 data-copy 属性获取
  const dataCopy = el.getAttribute('data-copy')
  if (dataCopy) {
    return dataCopy
  }

  // 从元素的文本内容获取
  return el.textContent?.trim() || ''
}

/**
 * 创建复制事件处理器
 * @param el 目标元素
 * @param options 复制选项
 * @returns 事件处理器
 */
function createCopyHandler(el: HTMLElement, options: CopyOptions) {
  return async (event: Event) => {
    event.preventDefault()

    const text = getCopyText(el, options)

    if (!text) {
      console.warn('[v-copy] 没有找到要复制的文本内容')
      return
    }

    try {
      const success = await copyToClipboard(text)

      if (success) {
        // 复制成功
        if (options.onSuccess) {
          options.onSuccess(text)
        }

        if (options.showMessage !== false) {
          showCopyMessage(true, text)
        }
      } else {
        throw new Error('复制操作失败')
      }
    } catch (error) {
      // 复制失败
      const copyError = error instanceof Error ? error : new Error('未知错误')

      if (options.onError) {
        options.onError(copyError)
      }

      if (options.showMessage !== false) {
        showCopyMessage(false, text)
      }

      console.error('[v-copy] 复制失败:', copyError)
    }
  }
}

/**
 * 解析指令绑定值
 * @param value 指令值
 * @returns 复制选项
 */
function parseCopyValue(value: any): CopyOptions {
  if (typeof value === 'string') {
    return { text: value }
  }

  if (typeof value === 'object' && value !== null) {
    return value as CopyOptions
  }

  return {}
}

/**
 * 复制指令实现
 */
export const copy: Directive = {
  /**
   * 指令挂载时调用
   */
  mounted(el: CopyElement, binding: DirectiveBinding) {
    const options = parseCopyValue(binding.value)

    // 创建事件处理器
    const handler = createCopyHandler(el, options)

    // 保存处理器和选项引用
    el.__copyHandler__ = handler
    el.__copyOptions__ = options

    // 绑定点击事件
    el.addEventListener('click', handler)

    // 添加视觉提示
    el.style.cursor = 'pointer'
    el.title = el.title || '点击复制'
  },

  /**
   * 指令更新时调用
   */
  updated(el: CopyElement, binding: DirectiveBinding) {
    const newOptions = parseCopyValue(binding.value)

    // 更新选项
    el.__copyOptions__ = newOptions

    // 如果处理器存在，重新创建
    if (el.__copyHandler__) {
      el.removeEventListener('click', el.__copyHandler__)

      const newHandler = createCopyHandler(el, newOptions)
      el.__copyHandler__ = newHandler
      el.addEventListener('click', newHandler)
    }
  },

  /**
   * 指令卸载时调用
   */
  unmounted(el: CopyElement) {
    // 移除事件监听器
    if (el.__copyHandler__) {
      el.removeEventListener('click', el.__copyHandler__)
      delete el.__copyHandler__
    }

    // 清理选项引用
    delete el.__copyOptions__
  },
}

/**
 * 使用示例：
 *
 * <template>
 *   <!-- 基础用法：复制元素文本内容 -->
 *   <span v-copy>这段文字可以被复制</span>
 *
 *   <!-- 复制指定文本 -->
 *   <button v-copy="'Hello World!'">复制问候语</button>
 *
 *   <!-- 复制变量内容 -->
 *   <div v-copy="userInfo.email">{{ userInfo.email }}</div>
 *
 *   <!-- 高级用法：自定义配置 -->
 *   <button v-copy="{
 *     text: shareUrl,
 *     onSuccess: handleCopySuccess,
 *     onError: handleCopyError,
 *     showMessage: false
 *   }">
 *     分享链接
 *   </button>
 *
 *   <!-- 使用 data-copy 属性 -->
 *   <code v-copy data-copy="npm install vue@next">安装命令</code>
 *
 *   <!-- 在表格中使用 -->
 *   <el-table :data="tableData">
 *     <el-table-column label="用户ID">
 *       <template #default="{ row }">
 *         <span v-copy="row.id" class="copy-text">{{ row.id }}</span>
 *       </template>
 *     </el-table-column>
 *   </el-table>
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { ElMessage } from 'element-plus';
 *
 * const userInfo = ref({
 *   email: 'user@example.com'
 * });
 *
 * const shareUrl = ref('https://example.com/share/123');
 *
 * const handleCopySuccess = (text: string) => {
 *   ElMessage.success(`已复制: ${text}`);
 * };
 *
 * const handleCopyError = (error: Error) => {
 *   ElMessage.error(`复制失败: ${error.message}`);
 * };
 * </script>
 *
 * <style scoped>
 * .copy-text {
 *   color: #409eff;
 *   cursor: pointer;
 * }
 *
 * .copy-text:hover {
 *   text-decoration: underline;
 * }
 * </style>
 */
