import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.js'],
    rules: {
      semi: 'error',
      quotes: ['error', 'single'],
    },
  },
]);
