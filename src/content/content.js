import { injectPolarizeButton } from './polarizeButton.js';
import { createOverlay, removeOverlay } from './overlay.js';

(() => {
  window.createOverlay = createOverlay;
  window.removeOverlay = removeOverlay;

  const ytReady = setInterval(() => {
    if (document.querySelector('.ytp-left-controls')) {
      injectPolarizeButton();
      clearInterval(ytReady);
    }
  }, 500);
})();