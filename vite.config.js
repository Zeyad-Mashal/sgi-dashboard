import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  ],
  server: {
    proxy: {
      // في التطوير: الطلبات لـ /api/odoo تذهب لـ Odoo (تجنب CORS)
      '/api/odoo': {
        target: 'https://sgicompany.odoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/odoo/, '/api'),
        secure: true,
      },
    },
  },
})
