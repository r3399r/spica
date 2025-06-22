import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bunnybill-test.celestialstudio.net',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      src: '/src',
    },
  },
})

