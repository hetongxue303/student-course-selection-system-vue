import { DirectiveBinding, ObjectDirective } from 'vue'
import { usePermissionStore } from '../../store/modules/permission'
import { useUserStore } from '../../store/modules/user'

export const permission: ObjectDirective = {
  mounted(el: any, binding: DirectiveBinding) {
    const { value } = binding
    const permissionStore = usePermissionStore()
    const permissions: string[] = permissionStore.getPermissions
    if (value && value.length > 0 && value instanceof Array) {
      const needPermission = value
      const hasPermission = permissions.some((permission) => {
        return needPermission.includes(permission)
      })
      if (!hasPermission) {
        el.parentNode.removeChild(el)
      }
    } else {
      console.log('权限不足')
    }
  }
}

export const role: ObjectDirective = {
  mounted(el: any, binding: DirectiveBinding) {
    const { value } = binding
    const userStore = useUserStore()
    const roles: string[] = userStore.getRoles
    if (value && value.length > 0 && value instanceof Array) {
      const needRole = value
      const hasRole = roles.some((role) => {
        return needRole.includes(role)
      })
      if (!hasRole) {
        el.parentNode.removeChild(el)
      }
    } else {
      console.log('权限不足')
    }
  }
}
