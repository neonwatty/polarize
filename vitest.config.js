import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // or 'node' if no DOM needed
    globals: true,
    exclude: [...configDefaults.exclude, 'dist/**'],
  },
});
