// 权限控制指令
// 根据用户权限显示或隐藏元素

import type { Directive, DirectiveBinding } from 'vue'
import { useAuth } from '@/composables/useAuth'

/**
 * 权限指令值类型
 */
type PermissionValue = string | string[]

/**
 * 检查权限
 * @param permissions 权限列表
 * @param type 检查类型：role 或 permission
 * @param requireAny 是否满足任一权限即可
 */
function checkPermission(
  permissions: string | string[],
  type: 'role' | 'permission' = 'permission',
  requireAny: boolean = false,
): boolean {
  const { hasRole, hasPermission, hasAnyRole, hasAnyPermission } = useAuth()

  const permissionList = Array.isArray(permissions) ? permissions : [permissions]

  if (type === 'role') {
    return requireAny ? hasAnyRole(permissionList) : permissionList.every((role) => hasRole(role))
  } else {
    return requireAny
      ? hasAnyPermission(permissionList)
      : permissionList.every((permission) => hasPermission(permission))
  }
}

/**
 * 权限指令实现
 */
export const permission: Directive = {
  /**
   * 元素挂载时执行
   */
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionValue>) {
    const { value, arg = 'permission', modifiers = {} } = binding
    const { any = false, hide = false } = modifiers

    if (!value) {
      console.warn('v-permission指令需要提供权限值')
      return
    }

    const hasAuth = checkPermission(value, arg as 'role' | 'permission', any)

    if (!hasAuth) {
      if (hide) {
        // 隐藏元素
        el.style.display = 'none'
      } else {
        // 移除元素
        el.parentNode?.removeChild(el)
      }
    }
  },

  /**
   * 指令值更新时执行
   */
  updated(el: HTMLElement, binding: DirectiveBinding<PermissionValue>) {
    const { value, arg = 'permission', modifiers = {} } = binding
    const { any = false, hide = false } = modifiers

    if (!value) {
      return
    }

    const hasAuth = checkPermission(value, arg as 'role' | 'permission', any)

    if (hide) {
      // 控制显示/隐藏
      el.style.display = hasAuth ? '' : 'none'
    } else {
      // 控制元素存在性
      if (!hasAuth && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  },
}

/**
 * 使用示例：
 *
 * <!-- 检查单个权限 -->
 * <button v-permission="'user:create'">创建用户</button>
 *
 * <!-- 检查多个权限（需要全部满足） -->
 * <button v-permission="['user:create', 'user:edit']">编辑用户</button>
 *
 * <!-- 检查多个权限（满足任一即可） -->
 * <button v-permission.any="['user:create', 'user:edit']">操作用户</button>
 *
 * <!-- 检查角色 -->
 * <button v-permission:role="'admin'">管理员功能</button>
 *
 * <!-- 隐藏而不是移除元素 -->
 * <button v-permission.hide="'user:delete'">删除用户</button>
 *
 * <!-- 组合使用 -->
 * <button v-permission:role.any.hide="['admin', 'manager']">高级功能</button>
 */
