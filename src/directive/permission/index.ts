// export const permission = {
//   inserted(el: any, binding: any) {
//     const { value } = binding
//     const permissions = ['user:list', 'user:add']
//     // const permissions = ['user:list', 'user:add', 'user:del', 'user:update']
//     if (value && value.length > 0 && value instanceof Array) {
//       const needPermission = value
//       const hasPermission = permissions.some((permission) => {
//         return needPermission.includes(permission)
//       })
//       if (!hasPermission) {
//         // el.style.display = 'none'
//         el.parentNode.removeChild(el)
//       }
//     } else {
//       throw new Error('权限不足')
//     }
//   }
// }
