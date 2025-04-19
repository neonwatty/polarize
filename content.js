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
    overlay.style.border = '1px dashed #888';
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

    document.body.appendChild(overlay);
  };

  window.removeOverlay = function () {
    const overlay = document.getElementById('code-overlay');
    if (overlay) overlay.remove();
  };
})();
