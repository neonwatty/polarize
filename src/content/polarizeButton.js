export function injectPolarizeButton() {
  const container = document.querySelector('.ytp-left-controls');
  if (!container || document.getElementById('polarize-toggle')) return;

  const btn = document.createElement('button');
  btn.id = 'polarize-toggle';
  btn.className = 'ytp-button';
  btn.title = 'Toggle Polarize Controls';
  btn.innerHTML = '<span style="font-weight: bold; font-size: 16px; color: white;">&lt;/&gt;</span>';

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.altKey) {
      window.createOverlay();
      return;
    }
    const existingOverlay = document.getElementById('code-overlay');
    if (existingOverlay) {
      window.removeOverlay();
    } else {
      window.createOverlay();
    }
  });

  container.appendChild(btn);
}