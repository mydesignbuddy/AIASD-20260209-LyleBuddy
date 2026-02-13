import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    
    // Bundle size limits (50KB gzipped target)
    chunkSizeWarningLimit: 50,
    
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          // Separate Decimal.js into its own chunk for analysis
          'decimal': ['decimal.js']
        }
      }
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for now, remove in production
        drop_debugger: true,
        pure_funcs: ['console.log'] // Remove console.log in production
      }
    }
  },
  
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  preview: {
    port: 4173,
    open: true
  },
  
  // Optimizations
  optimizeDeps: {
    include: ['decimal.js']
  }
});
