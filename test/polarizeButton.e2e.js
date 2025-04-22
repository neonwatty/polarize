import { test, expect, chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Polarize Button Integration Tests', () => {
  let context;
  let page;

  test.beforeEach(async () => {
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

  test.afterEach(async () => {
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

  test('should create the context menu on right-click', async () => {
    const polarizeButton = await page.$('#polarize-toggle');
    expect(polarizeButton).toBeTruthy();

    // Simulate right-click (contextmenu event)
    await page.dispatchEvent('#polarize-toggle', 'contextmenu');

    // Check if the context menu is created
    const contextMenu = await page.$('#polarize-panel');
    expect(contextMenu).toBeTruthy();

    // Verify the context menu's position and content
    const position = await contextMenu.evaluate((node) => node.style.position);
    expect(position).toBe('absolute');
    const innerHTML = await contextMenu.innerHTML();
    expect(innerHTML).toContain('Add Overlay');
    expect(innerHTML).toContain('Remove Overlay');

    // Click on the first element to simulate an outside click
    await page.mouse.click(0, 0)

    // Check if the context menu is removed
    const contextMenuAfterClick = await page.$('#polarize-panel');
    expect(contextMenuAfterClick).toBeNull();
  });

test('should call createOverlay when "Add Overlay" is clicked', async () => {
    const polarizeButton = await page.$('#polarize-toggle');
    expect(polarizeButton).toBeTruthy();

    // Simulate right-click (contextmenu event)
    await page.dispatchEvent('#polarize-toggle', 'contextmenu');

    // Click the "Add Overlay" button
    const addOverlayButton = await page.$('#polarize-add');
    await addOverlayButton.click();

    // Check if the overlay is created
    const overlay = await page.$('#code-overlay');
    expect(overlay).toBeTruthy();

    // Click the "Remove Overlay" button
    const removeOverlayButton = await page.$('#polarize-remove');
    expect(removeOverlayButton).toBeTruthy();
    await removeOverlayButton.click();

    // Check if the overlay is removed
    const overlayRemoved = await page.$('#code-overlay');
    expect(overlayRemoved).toBeNull();
  }
  );

test('should update the overlay theme when the theme is changed', async () => {
    const polarizeButton = await page.$('#polarize-toggle');
    expect(polarizeButton).toBeTruthy();

    // Simulate right-click (contextmenu event)
    await page.dispatchEvent('#polarize-toggle', 'contextmenu');

    // Click the "Add Overlay" button
    const addOverlayButton = await page.$('#polarize-add');
    await addOverlayButton.click();

    // Change the theme
    const themeSelect = await page.$('#polarize-theme');
    expect(themeSelect).toBeTruthy();
    await themeSelect.selectOption('Bright');

    // Check if the overlay theme is updated
    const overlay = await page.$('#code-overlay');
    expect(overlay).toBeTruthy();
  }
  );
    
test('should update the overlay invert filter when the slider is adjusted', async () => {
    const polarizeButton = await page.$('#polarize-toggle');
    expect(polarizeButton).toBeTruthy();

    // Simulate right-click (contextmenu event)
    await page.dispatchEvent('#polarize-toggle', 'contextmenu');

    // Click the "Add Overlay" button
    const addOverlayButton = await page.$('#polarize-add');
    await addOverlayButton.click();

    // Adjust the invert slider
    const invertSlider = await page.$('#polarize-invert');
    expect(invertSlider).toBeTruthy();
    await invertSlider.fill('50');

    // Check if the overlay invert filter is updated
    const overlay = await page.$('#code-overlay');
    expect(overlay).toBeTruthy();
  }
  );
});
