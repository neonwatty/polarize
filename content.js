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
  } else {
    overlay.style.animation = 'none';
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

    document.body.appendChild(overlay);
  };

  window.removeOverlay = function () {
    const overlay = document.getElementById('code-overlay');
    if (overlay) overlay.remove();
  };
})();