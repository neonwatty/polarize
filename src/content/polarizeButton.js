export function injectPolarizeButton() {
  const container = document.querySelector('.ytp-left-controls');
  if (!container || document.getElementById('polarize-toggle')) {return;}

  const btn = document.createElement('button');
  btn.id = 'polarize-toggle';
  btn.className = 'ytp-button';
  btn.title = 'Toggle Polarize Controls';
  btn.innerHTML = `
    <span style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; font-weight: bold; font-size: 16px; color: white; margin-top: 12px; margin-right: 9px">
      <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="border-radius: 50%; flex-shrink: 0;">
        <defs>
          <linearGradient id="lensGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00BFFF"/>
            <stop offset="25%" stop-color="#8A2BE2"/>
            <stop offset="50%" stop-color="#FF1493"/>
            <stop offset="75%" stop-color="#FFA500"/>
            <stop offset="100%" stop-color="#FFFF00"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#lensGradient)" stroke="black" stroke-width="10"/>
      </svg>
    </span>
  `;



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
  panel.style.background = 'rgba(31, 41, 55, 0.95)'; // Slightly warmer dark tone
  panel.style.padding = '16px';
  panel.style.borderRadius = '10px';
  panel.style.border = '1px solid #4b5563';
  panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  panel.style.color = 'white';
  panel.style.fontFamily = 'Segoe UI, Tahoma, sans-serif';
  panel.style.fontSize = '14px';
  panel.style.zIndex = '10001';

  panel.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <button id="polarize-add" style="
        background-color: #3b82f6;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      ">Add Overlay</button>

      <button id="polarize-remove" style="
        background-color: #ef4444;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      ">Remove Overlay</button>

      <label style="display: flex; flex-direction: column; font-weight: 500;">
        Theme:
        <select id="polarize-theme" style="
          margin-top: 4px;
          padding: 6px;
          border-radius: 4px;
          border: 1px solid #6b7280;
          background-color: #1f2937;
          color: white;
          font-size: 14px;
        ">
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

      <label style="display: flex; flex-direction: column; font-weight: 500;">
        Invert:
        <input type="range" id="polarize-invert" min="0" max="100" value="0" style="
          margin-top: 4px;
          accent-color: #3b82f6;
        " />
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