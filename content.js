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
    overlay.style.background = 'rgba(255, 255, 255, 0)';
    overlay.style.backdropFilter = 'brightness(100%)';
    overlay.style.zIndex = 10000;
    overlay.style.resize = 'both';
    overlay.style.overflow = 'auto';
    overlay.style.border = '4px solid transparent';
overlay.style.borderImage = 'linear-gradient(45deg, #ff6ec4, #7873f5, #1fd1f9, #c3f584) 1';
overlay.style.animation = 'borderPulse 4s linear infinite';
    overlay.style.cursor = 'default';

    let isDragging = false;

    overlay.addEventListener('dblclick', function () {
      isDragging = !isDragging;
      overlay.style.cursor = isDragging ? 'move' : 'default';
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
  @keyframes borderPulse {
    0% { border-image-slice: 1; }
    50% { border-image-slice: 1; transform: scale(1.01); }
    100% { border-image-slice: 1; }
  }
`;
document.head.appendChild(style);

    document.body.appendChild(overlay);
  };

  window.removeOverlay = function () {
    const overlay = document.getElementById('code-overlay');
    if (overlay) overlay.remove();
  };
})();