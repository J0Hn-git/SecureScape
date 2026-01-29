import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // Proxy all API calls to the Spring Boot backend.
        // The backend will in turn talk to the ML model service.
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
