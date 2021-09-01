import { join, resolve } from 'path'
import { defineConfig } from 'vite'
const root = join(__dirname, 'src')
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  resolve: {
    alias: {
      '@': root
    },
  },
  base: './',
  plugins: [
    vue()
  ],
  proxy: {}
})