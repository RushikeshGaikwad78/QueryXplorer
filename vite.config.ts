import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({ 
      algorithm: 'brotliCompress', // Use 'gzip' if needed
      ext: '.br', // Use '.gz' for gzip
      threshold: 1024, // Compress files larger than 1KB
      deleteOriginFile: false, // Keep original files for fallback
    }),
  ],
  build: {
    minify: 'terser', // Use Terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Removes console logs
        drop_debugger: true, // Removes debugger statements
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui/material')) return 'mui';
            if (id.includes('@mui/icons-material')) return 'mui-icons';
            if (id.includes('react')) return 'react';
            return 'vendor'; // Default bucket
          }
        }
      }
    }
  }
});
