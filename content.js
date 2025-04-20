(() => {
  function injectPolarizeButton() {
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
            <option value=\"none\">Normal</option>
            <option value=\"brightness(160%)\">Bright</option>
            <option value=\"contrast(200%)\">High Contrast</option>
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

  function updateOverlayTheme(value) {
    const overlay = document.getElementById('code-overlay');
    if (overlay) overlay.style.backdropFilter = value;
  }

  window.updateOverlayTheme = updateOverlayTheme;

  const ytReady = setInterval(() => {
    if (document.querySelector('.ytp-left-controls')) {
      injectPolarizeButton();
      clearInterval(ytReady);
    }
  }, 500);

  window.createOverlay = function () {
    if (document.getElementById('code-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'code-overlay';

    const dragHandle = document.createElement('div');
    dragHandle.style.position = 'absolute';
    dragHandle.style.top = '0';
    dragHandle.style.left = '0';
    dragHandle.style.right = '0';
    dragHandle.style.height = '30px';
    dragHandle.style.cursor = 'move';
    dragHandle.style.background = 'linear-gradient(to right, #ff6ec4, #7873f5, #1fd1f9)';
    dragHandle.style.zIndex = '10002';
    overlay.appendChild(dragHandle);
    overlay.style.position = 'fixed';
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const overlayWidth = 1000;
    const overlayHeight = 450;
    overlay.style.left = `${(viewportWidth - overlayWidth) / 2}px`;
    overlay.style.top = `${(viewportHeight - overlayHeight) / 2}px`;
    overlay.style.width = '1000px';
    overlay.style.height = '450px';
    overlay.style.background = 'rgba(255, 255, 255, 0.4)';
    overlay.style.backdropFilter = 'brightness(160%)';
    overlay.style.zIndex = 10000;
    overlay.style.resize = 'both';
    overlay.style.overflow = 'auto';
    overlay.style.border = '4px solid transparent';
    overlay.style.borderImage = 'linear-gradient(45deg, #ff6ec4, #7873f5, #1fd1f9, #c3f584) 1';
    overlay.style.cursor = 'default';

    let isDragging = true;
    overlay.style.animation = 'borderPulseFlashy 1.5s infinite linear';

    overlay.addEventListener('dblclick', function () {
      isDragging = !isDragging;
      overlay.style.cursor = isDragging ? 'move' : 'default';
      
      if (isDragging) {
        overlay.style.animation = 'borderPulseFlashy 1.5s infinite linear';
        overlay._extractBtn.style.display = 'none';
        dragHandle.classList.remove('hidden');

      } else {
        overlay.style.animation = 'none';
        overlay._extractBtn.style.display = 'block';
        dragHandle.classList.add('hidden');
      }
    });

    dragHandle.addEventListener('mousedown', function (e) {
      if (!isDragging) return;
      const offsetX = e.clientX - overlay.getBoundingClientRect().left;
      const offsetY = e.clientY - overlay.getBoundingClientRect().top;

      function onMouseMove(e) {
        overlay.style.left = `${e.clientX - offsetX}px`;
        overlay.style.top = `${e.clientY - offsetY}px`;
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes borderPulseFlashy {
        0% {
          border-image-source: linear-gradient(45deg, #ff6ec4, #7873f5, #1fd1f9, #c3f584);
          border-image-slice: 1;
          transform: scale(1);
        }
        25% {
          border-image-source: linear-gradient(90deg, #c3f584, #ff6ec4, #1fd1f9, #7873f5);
          transform: scale(1.02);
        }
        50% {
          border-image-source: linear-gradient(135deg, #7873f5, #1fd1f9, #c3f584, #ff6ec4);
          transform: scale(1.04);
        }
        75% {
          border-image-source: linear-gradient(180deg, #1fd1f9, #c3f584, #ff6ec4, #7873f5);
          transform: scale(1.02);
        }
        100% {
          border-image-source: linear-gradient(225deg, #ff6ec4, #7873f5, #1fd1f9, #c3f584);
          transform: scale(1);
        }
      }
    `;
    document.head.appendChild(style);

    const extractBtn = document.createElement('button');
    extractBtn.textContent = 'Extract Code';
    extractBtn.style.position = 'absolute';
    extractBtn.style.bottom = '4px';
    extractBtn.style.left = '50%';
    extractBtn.style.transform = 'translateX(-50%)';
    extractBtn.style.padding = '5px 10px';
    extractBtn.style.fontSize = '14px';
    extractBtn.style.fontWeight = '600';
    extractBtn.style.backgroundImage = 'linear-gradient(135deg, #ff6ec4, #7873f5)';
    extractBtn.style.transition = 'all 0.2s ease';
    extractBtn.style.color = '#fff';
    extractBtn.style.border = '1px solid #888';
    extractBtn.style.borderRadius = '4px';
    extractBtn.style.display = isDragging ? 'none' : 'block';
    extractBtn.style.zIndex = '10001';

    extractBtn.addEventListener('mouseenter', () => {
      extractBtn.style.backgroundImage = 'linear-gradient(135deg, #c3f584, #1fd1f9)';
      extractBtn.style.transform = 'scale(1.1)';
    });
    extractBtn.addEventListener('mouseleave', () => {
      extractBtn.style.backgroundImage = 'linear-gradient(135deg, #ff6ec4, #7873f5)';
      extractBtn.style.transform = 'scale(1)';
    });
    extractBtn.addEventListener('mousedown', () => {
      extractBtn.style.transform = 'scale(0.95)';
    });
    extractBtn.addEventListener('mouseup', () => {
      extractBtn.style.transform = 'scale(1.05)';
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '4px';
    closeBtn.style.right = '6px';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.color = '#fff';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '10002';

    closeBtn.addEventListener('click', () => {
      overlay.remove();
    });

    overlay.appendChild(closeBtn);
    overlay.appendChild(extractBtn);
    overlay._extractBtn = extractBtn;

    document.body.appendChild(overlay);
  };

  window.removeOverlay = function () {
    const overlay = document.getElementById('code-overlay');
    if (overlay) overlay.remove();

    const extractBtn = document.querySelector('button');
    if (extractBtn && extractBtn.textContent === 'Extract Code') {
      extractBtn.remove();
    }
  };
})();
