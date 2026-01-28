// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend will run on port 3000
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080', // Proxy API requests to backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      // Setup aliases for cleaner imports
      '@api': '/src/api',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@pages': '/src/pages',
      '@services': '/src/services',
      '@types': '/src/types',
      '@routes': '/src/routes',
    },
  },
});
