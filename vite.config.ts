/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import { visualizer } from 'rollup-plugin-visualizer'; // Optional: For analyzing bundle size

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    // HTML minification
    createHtmlPlugin({
      minify: true
    }),
    // Minify the build
    ViteMinifyPlugin(),
    // Optional: Analyze the build output
    visualizer({
      filename: 'stats.html',
      template: 'treemap' // You can use 'sunburst' or 'network' as well
    })
  ],
  build: {
    target: 'es2015', // Target modern browsers
    minify: 'esbuild', // Use esbuild for minification
    sourcemap: false, // Disable sourcemaps in production
    rollupOptions: {
      output: {
        manualChunks: {
          // Split out vendor code into separate chunks
          vendor: ['react', 'react-dom', 'react-router-dom']
          // You can add more chunks if necessary
        }
      }
    },
    chunkSizeWarningLimit: 500 // Set the size limit for chunks (in KB) to avoid large bundles
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  }
});
