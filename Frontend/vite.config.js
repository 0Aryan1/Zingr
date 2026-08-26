import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Mirrors the /api rewrite in vercel.json so dev is same-origin too.
    // Without this, dev ran cross-origin 5173 -> 3000 and exercised a
    // different cookie path than production.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Consumer and partner routes are already separate chunks via the
        // React.lazy() boundaries in AppRoutes. This only splits the heavy
        // third-party libs out so they cache independently of app code.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react-virtuoso')) return 'vendor-virtuoso'
          if (id.includes('framer-motion') || /node_modules\/motion/.test(id)) {
            return 'vendor-motion'
          }
          if (id.includes('react-router')) return 'vendor-router'
          return undefined
        },
      },
    },
  },
})
