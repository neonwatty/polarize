document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const status = document.getElementById('status');
  const toggleButton = document.getElementById('toggleVisibility');
  const saveButton = document.getElementById('saveApiKey');
  const deleteButton = document.getElementById('deleteApiKey');

  // Ensure button icon starts correctly
  toggleButton.textContent = '👁️';

  // Load saved API key
  chrome.storage.sync.get('geminiApiKey', (data) => {
    if (data.geminiApiKey) {
      apiKeyInput.value = data.geminiApiKey;
    }
  });

  // Toggle visibility
  toggleButton.addEventListener('click', () => {
    const isHidden = apiKeyInput.type === 'password';
    apiKeyInput.type = isHidden ? 'text' : 'password';
    toggleButton.textContent = isHidden ? '🙈' : '👁️';
  });

  // Save key
  // Save API key
saveButton.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    status.textContent = '❌ Please enter a valid API key.';
    return;
  }

  chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
    if (chrome.runtime.lastError) {
      status.textContent = '❌ Failed to save API key.';
      return;
    }

    status.textContent = '✅ API key saved!';
    deleteButton.disabled = false; // ✅ Enable delete button
    setTimeout(() => (status.textContent = ''), 2000);
  });
});




  // Delete API key
deleteButton.addEventListener('click', async () => {
  // Double-check that a key is actually stored
  chrome.storage.sync.get('geminiApiKey', (data) => {
    if (!data.geminiApiKey) {
      status.textContent = '⚠️ No API key to delete.';
      deleteButton.disabled = true;
      setTimeout(() => (status.textContent = ''), 2000);
      return;
    }

    const confirmed = confirm('Are you sure you want to delete your Gemini API key?');
    if (!confirmed) return;

    chrome.storage.sync.remove('geminiApiKey', () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to delete API key:', chrome.runtime.lastError);
        alert('❌ Failed to delete API key.');
        return;
      }

      apiKeyInput.value = '';
      deleteButton.disabled = true;
      status.textContent = '🗑️ API key deleted.';
      setTimeout(() => (status.textContent = ''), 2000);
    });
  });
});

  


  });




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
        if (overlay) {overlay.style.backdropFilter = filter;}
      }
    });
  });


  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [filter],
      func: (filter) => {
        const overlay = document.getElementById('code-overlay');
        if (overlay) {overlay.style.backdropFilter = filter;}
      }
    });
  });
}

document.getElementById('contrastLevel').addEventListener('change', updateOverlayFilter);
document.getElementById('invertSlider').addEventListener('input', updateOverlayFilter);
