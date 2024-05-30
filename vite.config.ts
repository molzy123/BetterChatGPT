import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait(),
    // electron({
    //   entry: 'electron/index.cjs',
    // }),
    // renderer({
    //   resolve: {
    //     // Ensure Node.js built-in modules are resolved correctly
    //     path: { type: 'cjs' },
    //     fs: { type: 'cjs' },
    //     // Add other built-in modules if necessary
    //   },
    // }),
  ],
  resolve: {
    alias: {
      '@icon/': new URL('./src/assets/icons/', import.meta.url).pathname,
      '@type/': new URL('./src/types/', import.meta.url).pathname,
      '@store/': new URL('./src/store/', import.meta.url).pathname,
      '@hooks/': new URL('./src/hooks/', import.meta.url).pathname,
      '@constants/': new URL('./src/constants/', import.meta.url).pathname,
      '@api/': new URL('./src/api/', import.meta.url).pathname,
      '@components/': new URL('./src/components/', import.meta.url).pathname,
      '@utils/': new URL('./src/utils/', import.meta.url).pathname,
      '@src/': new URL('./src/', import.meta.url).pathname,
    },
  },
  base: './',
});
