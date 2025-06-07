import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/DRAUGR-FrontEnd/' : '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    assetsDir: 'assets',
    assetsInlineLimit: 4096, // 4kb - files smaller than this will be inlined as base64
    cssCodeSplit: true,
    sourcemap: true,
  },
  css: {
    // This ensures CSS will be processed and included properly
    modules: {
      localsConvention: 'camelCase'
    }
  },
})
