import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Increase warning limit (fix your warning)
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries (better performance)
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },

  server: {
    port: 5173,
  },
})