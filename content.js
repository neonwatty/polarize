(() => {
  window.createOverlay = function () {
    if (document.getElementById('code-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'code-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '100px';
    overlay.style.left = '100px';
    overlay.style.width = '600px';
    overlay.style.height = '400px';
    overlay.style.background = 'rgba(255, 255, 255, 0.4)';
    overlay.style.backdropFilter = 'brightness(160%)';
    overlay.style.zIndex = 10000;
    overlay.style.resize = 'both';
    overlay.style.overflow = 'auto';
    overlay.style.border = '4px solid transparent';
overlay.style.borderImage = 'linear-gradient(45deg, #ff6ec4, #7873f5, #1fd1f9, #c3f584) 1';
// Animation will be toggled during drag mode
    overlay.style.cursor = 'default';

    let isDragging = true;
  overlay.style.cursor = 'move';
  overlay.style.animation = 'borderPulseFlashy 1.5s infinite linear';

    overlay.addEventListener('dblclick', function () {
  isDragging = !isDragging;
  overlay.style.cursor = isDragging ? 'move' : 'default';

  if (isDragging) {
    overlay.style.animation = 'borderPulseFlashy 1.5s infinite linear';
    overlay._extractBtn.style.display = 'none';
  } else {
    overlay.style.animation = 'none';
    overlay._extractBtn.style.display = 'block';
  }
});

    overlay.addEventListener('mousedown', function (e) {
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

    // Create extract button
    const extractBtn = document.createElement('button');
    extractBtn.textContent = 'Extract Code';
    extractBtn.style.position = 'fixed';
    const overlayRect = overlay.getBoundingClientRect();
    extractBtn.style.top = `${overlayRect.bottom + 4}px`;
    extractBtn.style.left = `${overlayRect.right - 120}px`;
    extractBtn.style.right = '10px';
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

    // Defer button positioning until overlay is rendered
    const positionExtractButton = () => {
  const rect = overlay.getBoundingClientRect();
  extractBtn.style.top = `${rect.bottom + 4}px`;
  extractBtn.style.left = `${rect.left + rect.width / 2 - 45}px`;
};

requestAnimationFrame(positionExtractButton);

// Reposition the extract button when the overlay is moved or resized
const observer = new ResizeObserver(positionExtractButton);
observer.observe(overlay);

overlay.addEventListener('mousemove', () => {
  if (isDragging) positionExtractButton();
});

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

    document.body.appendChild(extractBtn);

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