import 'element-plus'

declare module 'element-plus' {
  interface Menu {
    name: string
    path: string
    icon: string
    children?: Menu[]
  }
}
