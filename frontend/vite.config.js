import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Run frontend on port 3000
    proxy: {
      // Proxy API requests to the backend
      '/api': {
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true,
      },
    },
  },
})
