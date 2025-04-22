import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './test', // Directory for Playwright tests
  testMatch: '**/*.e2e.js',
  use: {
    headless: false, // Run in non-headless mode for debugging
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      args: [
        `--disable-extensions-except=${path.resolve('dist')}`,
        `--load-extension=${path.resolve('dist')}`,
      ],
    },
  },
});
