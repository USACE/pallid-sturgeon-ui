import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import { checker } from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));
  const basePath = process.env.VITE_URL_BASE_PATH;

  return defineConfig({
    base: basePath === '' ? '/' : basePath,
    plugins: [
      react({ include: ['**/*.jsx'] }),
      VitePWA({
        registerType: 'prompt',
        injectRegister: 'auto',
        manifest: {
          name: 'Pallid Sturgeon Population Assessment',
          short_name: 'Pallid Sturgeon',
          description: 'Pallid Sturgeon Population Assessment Application',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#ffffff',
          start_url: basePath === '' ? '/' : basePath,
          scope: basePath === '' ? '/' : basePath,
        },
        workbox: {
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'],
          navigateFallback: 'index.html',
        },
        devOptions: {
          enabled: true,
        },
      }),
      svgrPlugin(),
      visualizer({
        filename: 'rollup-analyze.json',
        template: 'raw-data',
        gzipSize: true,
        brotliSize: true,
      }),
      checker({
        overlay: {
          initialIsOpen: false,
          position: 'br',
        },
      }),
    ],
    css: {
      devSourcemap: false,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
    },
    server: {
      open: true,
      port: 3000,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      css: true,
      setupFiles: './src/test/setup.ts',
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    resolve: {
      alias: {
        '@src': '/src',
        '@components': '/src/app-components',
        '@pages': '/src/app-pages',
        '@styles': '/src/css',
        '@common': '/src/common',
        '@hooks': '/src/customHooks',
      },
    },
  });
};
