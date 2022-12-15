import { DirectiveBinding, ObjectDirective } from 'vue'
import { ElNotification } from 'element-plus'

export const permission: ObjectDirective = {
  mounted(el: any, binding: DirectiveBinding) {
    const { value } = binding
    // 模拟权限
    const permissions = ['user:list', 'user:add', 'user:del', 'user:update']
    if (value && value.length > 0 && value instanceof Array) {
      const needPermission = value
      const hasPermission = permissions.some((permission) => {
        return needPermission.includes(permission)
      })
      if (!hasPermission) {
        el.parentNode.removeChild(el)
      }
    } else {
      ElNotification({
        message: '暂无权限',
        type: 'warning',
        duration: 5 * 1000
      })
    }
  }
}

export const role: ObjectDirective = {
  mounted(el: any, binding: DirectiveBinding) {
    const { value } = binding
    // 模拟角色
    const roles = ['admin']
    if (value && value.length > 0 && value instanceof Array) {
      const needRole = value
      const hasRole = roles.some((role) => {
        return needRole.includes(role)
      })
      if (!hasRole) {
        el.parentNode.removeChild(el)
      }
    } else {
      ElNotification({
        message: '暂无权限',
        type: 'warning',
        duration: 5 * 1000
      })
    }
  }
}
