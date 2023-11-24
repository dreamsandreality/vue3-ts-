import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { prismjsPlugin } from 'vite-plugin-prismjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    prismjsPlugin({
      languages: 'all',
    }),
    vue()
  ],
  server:{
    proxy:{
      '/api':{
        target: 'http://localhost:5854/',
        changeOrigin: true,
        ws: true,
        secure: true,
        rewrite: path => path.replace(/^\/api/,'')
      }
    }
  }
})
