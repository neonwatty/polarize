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

document.getElementById('contrastLevel').addEventListener('change', async (e) => {
  const filter = e.target.value;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [filter],
    func: (filter) => {
      const overlay = document.getElementById('code-overlay');
      if (overlay) overlay.style.backdropFilter = filter;
    }
  });
});