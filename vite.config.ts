import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { resolve } from 'path'
import WindiCSS from 'vite-plugin-windicss'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { fileURLToPath } from 'url'

export default defineConfig({
  mode: 'development',
  base: './',
  publicDir: 'public',
  logLevel: 'info',
  envDir: 'root',
  envPrefix: 'VITE_',
  plugins: [
    vue(),
    WindiCSS(),
    eslintPlugin({
      include: ['{**/*,*}.{js,ts,jsx,tsx,html,vue}'],
      cache: false
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons/svg')],
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ''
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@layout': fileURLToPath(new URL('./src/layout', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url))
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    cors: true,
    open: false,
    hmr: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    // css代码拆分
    cssCodeSplit: true,
    // 取消计算文件大小 加快打包速度
    reportCompressedSize: false,
    rollupOptions: {}
  }
})
