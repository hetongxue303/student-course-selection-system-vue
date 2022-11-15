import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { resolve } from 'path'
import WindiCSS from 'vite-plugin-windicss'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
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
    devSourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@views': resolve(__dirname, 'src/views'),
      '@layout': resolve(__dirname, 'src/layout'),
      '@components': resolve(__dirname, 'src/components')
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    cors: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  }
})
