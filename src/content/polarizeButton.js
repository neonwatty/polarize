export function injectPolarizeButton() {
  const container = document.querySelector('.ytp-left-controls');
  if (!container || document.getElementById('polarize-toggle')) {return;}

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

  btn.addEventListener('contextmenu', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const existing = document.getElementById('polarize-panel');
    if (existing) {
      existing.remove();
      return;
    }

    const panel = document.createElement('div');
    panel.id = 'polarize-panel';
    const iconRect = btn.getBoundingClientRect();
    panel.style.position = 'absolute';
    panel.style.top = `${iconRect.bottom - 18}px`;
    panel.style.left = `${iconRect.left}px`;
    panel.style.background = 'rgba(30, 30, 30, 0.95)';
    panel.style.padding = '12px 16px';
    panel.style.borderRadius = '12px';
    panel.style.border = '1px solid #555';
    panel.style.color = 'white';
    panel.style.zIndex = '10001';
    panel.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <button id="polarize-add">Add Overlay</button>
        <button id="polarize-remove">Remove Overlay</button>
        <label>Theme:
          <select id="polarize-theme">
            <option value="brightness(100%)">Normal</option>
            <option value="brightness(160%)">Bright</option>
            <option value="contrast(200%)">High Contrast</option>
            <option value="grayscale(100%)">Monokai Style</option>
            <option value="saturate(200%) hue-rotate(300deg)">Solarized Dark</option>
            <option value="hue-rotate(180deg) contrast(150%)">Dracula Style</option>
            <option value="brightness(110%) contrast(120%) saturate(120%)">Solarized Light</option>
            <option value="sepia(10%) brightness(115%) contrast(105%)">GitHub Light</option>
            <option value="brightness(130%) hue-rotate(20deg) saturate(110%)">VS Code Light</option>
          </select>
        </label>
        <label>Invert:
          <input type="range" id="polarize-invert" min="0" max="100" value="0" />
        </label>
      </div>
    `;

    setTimeout(() => {
      document.getElementById('polarize-add')?.addEventListener('click', window.createOverlay);
      document.getElementById('polarize-remove')?.addEventListener('click', window.removeOverlay);
      document.getElementById('polarize-theme')?.addEventListener('change', (e) => {
        window.updateOverlayTheme(e.target.value);
      });
      document.getElementById('polarize-invert')?.addEventListener('input', (e) => {
        const overlay = document.getElementById('code-overlay');
        if (overlay) {
          const theme = document.getElementById('polarize-theme')?.value || '';
          overlay.style.backdropFilter = `invert(${e.target.value}%) ${theme}`.trim();
        }
      });
    }, { capture: true });

    document.body.appendChild(panel);

    function closePanelOnOutsideClick(e) {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.remove();
        document.removeEventListener('click', closePanelOnOutsideClick);
      }
    }
    setTimeout(() => {
      document.addEventListener('click', closePanelOnOutsideClick);
    }, 0);
  });

  container.appendChild(btn);
}