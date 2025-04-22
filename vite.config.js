import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        content: resolve(__dirname, 'src/content/content.js'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  },
  test: {
    include: ['src/**/*.test.{js,mjs,ts}'],
  },
});
