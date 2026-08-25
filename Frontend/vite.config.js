import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
