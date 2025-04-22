import { test, expect } from '@playwright/test';

test.describe('Polarize Button Integration Tests', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); // Example YouTube video
  });

  test('should inject the Polarize button into YouTube controls', async () => {
    // Wait for the YouTube controls to load
    await page.waitForSelector('.ytp-left-controls');

    // Check if the Polarize button is injected
    const polarizeButton = await page.$('#polarize-toggle');
    expect(polarizeButton).toBeTruthy();

    // Verify button attributes
    const title = await polarizeButton.getAttribute('title');
    expect(title).toBe('Toggle Polarize Controls');
  });

  test('should toggle the overlay when the button is clicked', async () => {
    const polarizeButton = await page.$('#polarize-toggle');

    // Click the button to create the overlay
    await polarizeButton.click();
    const overlay = await page.$('#code-overlay');
    expect(overlay).toBeTruthy();

    // Click the button again to remove the overlay
    await polarizeButton.click();
    const overlayRemoved = await page.$('#code-overlay');
    expect(overlayRemoved).toBeNull();
  });

  test('should capture a snapshot and display extracted code', async () => {
    const polarizeButton = await page.$('#polarize-toggle');

    // Click the button to create the overlay
    await polarizeButton.click();

    // Mock the API response
    await page.route('https://api.example.com/extract', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          language: 'javascript',
          code: 'console.log("Hello, world!");',
        }),
      })
    );

    // Simulate capturing a snapshot
    const extractButton = await page.$('#extract-btn');
    await extractButton.click();

    // Wait for the modal to appear
    const modal = await page.waitForSelector('.code-modal');
    expect(modal).toBeTruthy();

    // Verify the extracted code
    const codeContent = await modal.textContent();
    expect(codeContent).toContain('console.log("Hello, world!");');
  });
});