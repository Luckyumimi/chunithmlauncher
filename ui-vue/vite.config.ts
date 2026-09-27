import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    outDir: fileURLToPath(new URL('../ui-dist', import.meta.url)),
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: { host: '127.0.0.1' },
});
