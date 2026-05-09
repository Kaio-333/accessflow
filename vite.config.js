import { defineConfig } from 'vite'
export default defineConfig({
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': 'http://127.0.0.1:5174',
    },
  },
  build: { outDir: 'dist', sourcemap: true },
})
