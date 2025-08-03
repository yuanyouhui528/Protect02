// 点击外部指令
// 用于检测点击元素外部的事件

import type { Directive, DirectiveBinding } from 'vue'

/**
 * 点击外部事件处理器类型
 */
type ClickOutsideHandler = (event: Event) => void

/**
 * 指令绑定的元素扩展接口
 */
interface ClickOutsideElement extends HTMLElement {
  __clickOutsideHandler__?: ClickOutsideHandler
}

/**
 * 检查点击事件是否在元素外部
 * @param el 目标元素
 * @param event 点击事件
 * @returns 是否在外部点击
 */
function isClickOutside(el: HTMLElement, event: Event): boolean {
  const target = event.target as Node

  // 检查点击目标是否在元素内部
  return !el.contains(target)
}

/**
 * 创建点击外部事件处理器
 * @param el 目标元素
 * @param callback 回调函数
 * @returns 事件处理器
 */
function createClickOutsideHandler(
  el: HTMLElement,
  callback: ClickOutsideHandler,
): ClickOutsideHandler {
  return (event: Event) => {
    // 检查是否点击在元素外部
    if (isClickOutside(el, event)) {
      callback(event)
    }
  }
}

/**
 * 绑定点击外部事件
 * @param el 目标元素
 * @param handler 事件处理器
 */
function bindClickOutside(el: ClickOutsideElement, handler: ClickOutsideHandler): void {
  // 延迟绑定，避免立即触发
  setTimeout(() => {
    document.addEventListener('click', handler, true)
    document.addEventListener('touchstart', handler, true)
  }, 0)
}

/**
 * 解绑点击外部事件
 * @param handler 事件处理器
 */
function unbindClickOutside(handler: ClickOutsideHandler): void {
  document.removeEventListener('click', handler, true)
  document.removeEventListener('touchstart', handler, true)
}

/**
 * 点击外部指令实现
 */
export const clickOutside: Directive = {
  /**
   * 指令挂载时调用
   */
  mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
    const { value } = binding

    if (typeof value !== 'function') {
      console.warn('[v-click-outside] 指令值必须是一个函数')
      return
    }

    // 创建事件处理器
    const handler = createClickOutsideHandler(el, value)

    // 保存处理器引用
    el.__clickOutsideHandler__ = handler

    // 绑定事件
    bindClickOutside(el, handler)
  },

  /**
   * 指令更新时调用
   */
  updated(el: ClickOutsideElement, binding: DirectiveBinding) {
    const { value, oldValue } = binding

    // 如果回调函数发生变化，重新绑定
    if (value !== oldValue) {
      // 解绑旧的事件处理器
      if (el.__clickOutsideHandler__) {
        unbindClickOutside(el.__clickOutsideHandler__)
      }

      if (typeof value !== 'function') {
        console.warn('[v-click-outside] 指令值必须是一个函数')
        return
      }

      // 创建新的事件处理器
      const handler = createClickOutsideHandler(el, value)

      // 保存处理器引用
      el.__clickOutsideHandler__ = handler

      // 绑定新的事件
      bindClickOutside(el, handler)
    }
  },

  /**
   * 指令卸载时调用
   */
  unmounted(el: ClickOutsideElement) {
    // 解绑事件处理器
    if (el.__clickOutsideHandler__) {
      unbindClickOutside(el.__clickOutsideHandler__)
      delete el.__clickOutsideHandler__
    }
  },
}

/**
 * 使用示例：
 *
 * <template>
 *   <!-- 基础用法 -->
 *   <div v-click-outside="handleClickOutside">
 *     <button @click="showDropdown = true">显示下拉菜单</button>
 *     <div v-if="showDropdown" class="dropdown">
 *       下拉菜单内容
 *     </div>
 *   </div>
 *
 *   <!-- 在模态框中使用 -->
 *   <div v-if="showModal" class="modal-overlay">
 *     <div v-click-outside="closeModal" class="modal">
 *       <h3>模态框标题</h3>
 *       <p>模态框内容</p>
 *       <button @click="closeModal">关闭</button>
 *     </div>
 *   </div>
 *
 *   <!-- 在下拉选择器中使用 -->
 *   <div class="select-wrapper">
 *     <input
 *       v-model="selectedValue"
 *       @focus="showOptions = true"
 *       readonly
 *       placeholder="请选择"
 *     >
 *     <div
 *       v-if="showOptions"
 *       v-click-outside="() => showOptions = false"
 *       class="options"
 *     >
 *       <div
 *         v-for="option in options"
 *         :key="option.value"
 *         @click="selectOption(option)"
 *         class="option"
 *       >
 *         {{ option.label }}
 *       </div>
 *     </div>
 *   </div>
 * </template>
 *
 * <script setup lang="ts">
 * import { ref } from 'vue';
 *
 * const showDropdown = ref(false);
 * const showModal = ref(false);
 * const showOptions = ref(false);
 * const selectedValue = ref('');
 *
 * const options = [
 *   { label: '选项1', value: '1' },
 *   { label: '选项2', value: '2' },
 *   { label: '选项3', value: '3' }
 * ];
 *
 * const handleClickOutside = () => {
 *   showDropdown.value = false;
 * };
 *
 * const closeModal = () => {
 *   showModal.value = false;
 * };
 *
 * const selectOption = (option: any) => {
 *   selectedValue.value = option.label;
 *   showOptions.value = false;
 * };
 * </script>
 */
