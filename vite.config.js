import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base:'/3dbuilding',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ex1: resolve(__dirname, 'ex1.html'),
        ex2: resolve(__dirname, 'ex2.html'),
        ex3: resolve(__dirname, 'ex3.html'),
        ex4: resolve(__dirname, 'ex4.html')
      }
    }
  }
})
