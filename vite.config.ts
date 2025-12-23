import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'LingoLens',
        short_name: 'LingoLens',
        description: 'Snap a photo, learn the language.',
        theme_color: '#f0f0f0',
        background_color: '#f0f0f0',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'https://cdn.jsdelivr.net/npm/lucide-static@0.344.0/icons/camera.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'https://cdn.jsdelivr.net/npm/lucide-static@0.344.0/icons/camera.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext'
  }
});