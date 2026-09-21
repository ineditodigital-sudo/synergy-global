import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// `npm run dev` expects the PHP API running on 8787 (`npm run dev:api`).
const api = 'http://127.0.0.1:8787';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: '/',
  server: {
    proxy: {
      '/api.php': api,
      '/uploads': api,
      '/robots.txt': api,
      '/sitemap.xml': api,
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
  },
});
