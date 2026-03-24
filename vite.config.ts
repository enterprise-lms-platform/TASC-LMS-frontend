import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // HLS/DASH are large media libs only needed by course player
            if (id.includes('hls.js')) return 'vendor-hls';
            if (id.includes('dash.js')) return 'vendor-dash';
            return 'vendor';
          }
          if (id.includes('src/pages/learner')) return 'learner-pages';
          if (id.includes('src/pages/instructor')) return 'instructor-pages';
          if (id.includes('src/pages/manager')) return 'manager-pages';
          if (id.includes('src/pages/finance')) return 'finance-pages';
          if (id.includes('src/pages/superadmin')) return 'superadmin-pages';
          if (id.includes('src/pages/public')) return 'public-pages';
        },
      },
    },
  },
})
