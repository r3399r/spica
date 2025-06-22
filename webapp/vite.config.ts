import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
});
