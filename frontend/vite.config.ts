import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touc-icon.png'],
      filename: 'service-worker.js',
      workbox: {
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Bunny Bill',
        short_name: 'Bunny Bill',
        start_url: './book',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'logo/icon-android-72.png',
            sizes: '16x16 24x24 32x32 64x64 72x72',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'logo/icon-android-96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'logo/icon-android-128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'logo/icon-android-144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'logo/icon-android-152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'logo/icon-android-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'logo/icon-android-384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'logo/icon-android-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
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
