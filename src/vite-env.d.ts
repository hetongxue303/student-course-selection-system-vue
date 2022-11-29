/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'jsencrypt/bin/jsencrypt.min'

// 配置 ts 环境下 env智能提示
interface ImportMetaEnv {
  readonly VITE_MODE_NAME: string
  readonly VITE_PORT: number
  readonly VITE_APP_TITLE: string
  readonly VITE_BASIC_API: string
  readonly VITE_BASIC_HTTP: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
