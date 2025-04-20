import html2canvas from 'html2canvas';
import { uploadSnapshot } from './utils/api.js';

export function createOverlay() {
  if (document.getElementById('code-overlay')) return;

  const videoPlayer = document.querySelector('.html5-video-player');
  if (!videoPlayer) {
    console.error('YouTube video player not found.');
    return;
  }

  const videoRect = videoPlayer.getBoundingClientRect();
  const controlsHeight = 70; // Approximate height of YouTube controls

  // create overlay window
  const overlay = document.createElement('div');
  overlay.id = 'code-overlay';
  overlay.style.position = 'absolute';
  overlay.style.left = `${videoRect.left}px`;
  overlay.style.top = `${videoRect.top}px`;
  overlay.style.width = `${videoRect.width}px`;
  overlay.style.height = `${videoRect.height - controlsHeight}px`;
  overlay.style.background = 'rgba(255, 255, 255, 0)';
  overlay.style.backdropFilter = 'brightness(160%)';
  overlay.style.zIndex = 10000;
  overlay.style.resize = 'both';
  overlay.style.overflow = 'auto';
  overlay.style.border = '4px solid transparent';
  overlay.style.borderImage = 'linear-gradient(45deg, #ff6ec4, #7873f5, #1fd1f9, #c3f584) 1';
  overlay.style.cursor = 'default';
  
  // create draggable handle
  const dragHandle = document.createElement('div');
  dragHandle.style.position = 'absolute';
  dragHandle.style.top = '0';
  dragHandle.style.left = '0';
  dragHandle.style.right = '0';
  dragHandle.style.height = '30px';
  dragHandle.style.cursor = 'move';
  dragHandle.style.background = 'linear-gradient(to right, #ff6ec4, #7873f5, #1fd1f9)';
  dragHandle.style.zIndex = '10002';
  dragHandle.style.color = 'white';
  dragHandle.style.fontSize = '20px';
  dragHandle.style.fontWeight = 'bold';
  dragHandle.style.textAlign = 'center';
  dragHandle.textContent = 'Drag me!';
  overlay.appendChild(dragHandle);

// create drag ability and visuals
let isDragging = true;
overlay.style.animation = 'borderPulseFlashy 1.5s infinite linear';

  // create extract button
  const extractBtn = document.createElement('button');
  extractBtn.textContent = 'Extract Code';
  extractBtn.style.position = 'absolute';
  extractBtn.style.bottom = '4px';
  extractBtn.style.left = '50%';
  extractBtn.style.padding = '5px 10px';
  extractBtn.style.fontSize = '14px';
  extractBtn.style.fontWeight = '600';
  extractBtn.style.backgroundImage = 'linear-gradient(135deg, #ff6ec4, #7873f5)';
  extractBtn.style.transition = 'all 0.2s ease';
  extractBtn.style.color = '#fff';
  extractBtn.style.border = '1px solid #888';
  extractBtn.style.borderRadius = '4px';
  extractBtn.style.display = "none"
  extractBtn.style.zIndex = '10001';
  extractBtn.style.cursor = "pointer";

// add "move mode"
overlay.addEventListener('dblclick', function () {
    isDragging = !isDragging;

    if (isDragging) {
    overlay.style.animation = 'borderPulseFlashy 1.5s infinite linear';
    overlay._extractBtn.style.display = 'none';
    dragHandle.classList.remove('hidden');
    dragHandle.style.cursor = 'move';
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


    // add some flair to the export button
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

  // add click event listener to export button - trigger api call
  extractBtn.addEventListener('click', async () => {
    const canvas = await html2canvas(overlay);
    canvas.toBlob(async (blob) => {
      await uploadSnapshot(blob);
    });
  });

  overlay.appendChild(extractBtn);

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



}

export function removeOverlay() {
  const overlay = document.getElementById('code-overlay');
  if (overlay) overlay.remove();
}