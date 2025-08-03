// 加载指令
// 用于显示和隐藏加载状态

import type { Directive, DirectiveBinding } from 'vue'

/**
 * 创建加载遮罩元素
 * @param text 加载文本
 * @returns 遮罩元素
 */
function createLoadingElement(text: string = '加载中...'): HTMLElement {
  const loadingEl = document.createElement('div')
  loadingEl.className = 'v-loading-mask'
  loadingEl.innerHTML = `
    <div class="v-loading-spinner">
      <div class="v-loading-icon"></div>
      <div class="v-loading-text">${text}</div>
    </div>
  `

  // 添加样式
  const style = document.createElement('style')
  style.textContent = `
    .v-loading-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(2px);
    }
    
    .v-loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    
    .v-loading-icon {
      width: 32px;
      height: 32px;
      border: 3px solid #e4e7ed;
      border-top: 3px solid #409eff;
      border-radius: 50%;
      animation: v-loading-rotate 1s linear infinite;
    }
    
    .v-loading-text {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
    }
    
    @keyframes v-loading-rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `

  if (!document.head.querySelector('style[data-loading-directive]')) {
    style.setAttribute('data-loading-directive', 'true')
    document.head.appendChild(style)
  }

  return loadingEl
}

/**
 * 显示加载状态
 * @param el 目标元素
 * @param text 加载文本
 */
function showLoading(el: HTMLElement, text: string): void {
  // 确保元素有相对定位
  const position = window.getComputedStyle(el).position
  if (position === 'static') {
    el.style.position = 'relative'
  }

  // 移除已存在的加载遮罩
  hideLoading(el)

  // 创建并添加加载遮罩
  const loadingEl = createLoadingElement(text)
  loadingEl.setAttribute('data-loading-directive', 'true')
  el.appendChild(loadingEl)
}

/**
 * 隐藏加载状态
 * @param el 目标元素
 */
function hideLoading(el: HTMLElement): void {
  const loadingEl = el.querySelector('[data-loading-directive]')
  if (loadingEl) {
    loadingEl.remove()
  }
}

/**
 * 加载指令实现
 */
export const loading: Directive = {
  /**
   * 指令挂载时调用
   */
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, arg } = binding
    const text = arg || '加载中...'

    if (value) {
      showLoading(el, text)
    }
  },

  /**
   * 指令更新时调用
   */
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const { value, oldValue, arg } = binding
    const text = arg || '加载中...'

    if (value !== oldValue) {
      if (value) {
        showLoading(el, text)
      } else {
        hideLoading(el)
      }
    }
  },

  /**
   * 指令卸载时调用
   */
  unmounted(el: HTMLElement) {
    hideLoading(el)
  },
}

/**
 * 使用示例：
 *
 * <!-- 基础用法 -->
 * <div v-loading="isLoading">内容</div>
 *
 * <!-- 自定义加载文本 -->
 * <div v-loading:"正在保存..."="isSaving">内容</div>
 *
 * <!-- 在表格中使用 -->
 * <el-table v-loading="tableLoading" :data="tableData">
 *   <!-- 表格列 -->
 * </el-table>
 *
 * <!-- 在卡片中使用 -->
 * <el-card v-loading="cardLoading">
 *   <div>卡片内容</div>
 * </el-card>
 */
