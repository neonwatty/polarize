function showCodeEditorModal(overlay, language, code) {
  // Create the modal container
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '60%',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: '10000',
    padding: '16px',
    overflow: 'hidden',
  });

  // Create a close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  Object.assign(closeButton.style, {
    position: 'absolute',
    top: '8px',
    right: '8px',
    cursor: 'pointer',
  });
  closeButton.addEventListener('click', () => modal.remove());

  // Create a textarea for CodeMirror
  const textarea = document.createElement('textarea');
  textarea.value = code;
  Object.assign(textarea.style, {
    width: '100%',
    height: '80%',
    marginBottom: '16px',
  });

  // Create the "Copy to Clipboard" button
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy to Clipboard';
  Object.assign(copyButton.style, {
    marginTop: '8px',
    cursor: 'pointer',
    padding: '8px 12px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
  });
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(editor.getValue()).then(() => {
      alert('Code copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy code:', err);
    });
  });

  // Append elements to the modal
  modal.appendChild(closeButton);
  modal.appendChild(textarea);
  modal.appendChild(copyButton);
  overlay.appendChild(modal);

  // Determine the language mode
  console.log("INFO: A")
  let mode;
  switch (language.toLowerCase()) {
    case 'python':
      mode = 'python';
      break;
    case 'javascript':
    default:
      mode = 'javascript';
      break;
  }
  console.log("INFO: B")
  console.log("mode", mode)

  // Initialize CodeMirror
  const editor = CodeMirror.fromTextArea(textarea, {
    lineNumbers: false,
    mode: mode,
    theme: 'default',
  });
}


export { showCodeEditorModal };