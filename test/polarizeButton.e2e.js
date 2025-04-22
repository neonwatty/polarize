import { test, expect, chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Polarize Button Integration Tests', () => {
  let context;
  let page;

  test.beforeAll(async () => {
    const extensionPath = path.resolve(__dirname, '../dist');

    context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });

    page = await context.newPage();

    await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.waitForTimeout(2000); // Let the extension inject content scripts
  });

  test.afterAll(async () => {
    if (context) {
      await context.close();
    }
  });

  test('should inject the Polarize button into YouTube controls', async () => {
    await page.waitForSelector('.ytp-left-controls');

    const polarizeButton = await page.$('#polarize-toggle');
    expect(polarizeButton).toBeTruthy();

    const title = await polarizeButton.getAttribute('title');
    expect(title).toBe('Toggle Polarize Controls');
  });

  test('should toggle the overlay when the button is clicked', async () => {
    const polarizeButton = await page.$('#polarize-toggle');

    await polarizeButton.click();
    const overlay = await page.$('#code-overlay');
    expect(overlay).toBeTruthy();

    await polarizeButton.click();
    const overlayRemoved = await page.$('#code-overlay');
    expect(overlayRemoved).toBeNull();
  });
});
