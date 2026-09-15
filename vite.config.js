import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // o chunk do Three.js (~145 kB gzip) é carregado sob demanda pelo cartão 3D
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        // Three.js fica em um chunk próprio, carregado sob demanda pelo cartão 3D
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/gsap')) return 'gsap'
        }
      }
    }
  }
})
