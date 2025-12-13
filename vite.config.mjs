import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import { checker } from 'vite-plugin-checker';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));
  const basePath = process.env.VITE_URL_BASE_PATH;

  return defineConfig({
    base: basePath === '' ? '/' : basePath,
    plugins: [
      react({ include: ['**/*.jsx'] }),
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
    server: {
      proxy: {
        '/psapi': {
          target: 'http://localhost:701',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  });
};
