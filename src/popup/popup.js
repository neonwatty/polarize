document.getElementById('addOverlay').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.createOverlay && window.createOverlay()
  });
});

document.getElementById('removeOverlay').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.removeOverlay && window.removeOverlay()
  });
});

function updateOverlayFilter() {
  const theme = document.getElementById('contrastLevel').value;
  const invertValue = document.getElementById('invertSlider')?.value || 0;
  let filter = `invert(${invertValue}%) ${theme}`.trim();

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [filter],
      func: (filter) => {
        const overlay = document.getElementById('code-overlay');
        if (overlay) overlay.style.backdropFilter = filter;
      }
    });
  });


  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [filter],
      func: (filter) => {
        const overlay = document.getElementById('code-overlay');
        if (overlay) overlay.style.backdropFilter = filter;
      }
    });
  });
}

document.getElementById('contrastLevel').addEventListener('change', updateOverlayFilter);
document.getElementById('invertSlider').addEventListener('input', updateOverlayFilter);
