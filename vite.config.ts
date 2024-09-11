/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

// Dynamic import to reduce initial bundle size
const tsconfigPaths = () => import('vite-tsconfig-paths');
const createHtmlPlugin = () =>
  import('vite-plugin-html').then((mod) => mod.createHtmlPlugin);
const ViteMinifyPlugin = () =>
  import('vite-plugin-minify').then((mod) => mod.ViteMinifyPlugin);

export default defineConfig({
  plugins: [
    react(),
    (await tsconfigPaths()).default(),
    (await createHtmlPlugin())({
      minify: true
    }),
    (await ViteMinifyPlugin())(),
    visualizer({
      filename: 'stats.html',
      template: 'treemap'
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2, // Increase passes for better compression
        pure_funcs: ['console.log'] // Drop console logs
      },
      mangle: true
    },
    css: {
      postcss: './postcss.config.cjs' // Ensure this points to the PostCSS config
    },
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleMapping = {
            node_modules: 'vendor',
            'src/assets': 'assets',
            'src/components': 'components',
            'src/pages': 'pages',
            'src/utils': 'utils',
            'src/hooks': 'hooks',
            'src/stores': 'stores',
            'src/types': 'types',
            'src/routes': 'routes',
            'src/app': 'app',
            'src/tests': 'tests'
          };

          for (const [directory, chunkName] of Object.entries(moduleMapping)) {
            if (id.includes(directory)) {
              return chunkName;
            }
          }

          // Scinder chaque paquet de node_modules en chunks distincts
          if (id.includes('node_modules')) {
            const dirs = id.split('node_modules/')[1].split('/');
            return `vendor-${dirs[0]}`;
          }
        }
      }
    },
    chunkSizeWarningLimit: 500
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      minify: true
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/*.test.{ts,tsx}']
  },
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      overlay: true
    }
  }
});
