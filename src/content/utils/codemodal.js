import { CodeJar } from 'codejar';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import ruby from 'highlight.js/lib/languages/ruby';
// import 'highlight.js/styles/default.css';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('ruby', ruby);


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
    display: 'flex',
    flexDirection: 'column',
  });

  // Create a close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  Object.assign(closeButton.style, {
    alignSelf: 'flex-end',
    cursor: 'pointer',
    marginBottom: '8px',
  });
  closeButton.addEventListener('click', () => modal.remove());

  // Create the editor container
  const editor = document.createElement('div');
  editor.contentEditable = 'true';
  Object.assign(editor.style, {
    flex: '1',
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px',
    backgroundColor: '#f5f5f5',
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
    alignSelf: 'flex-start',
  });

  // Append elements to the modal
  modal.appendChild(closeButton);
  modal.appendChild(editor);
  modal.appendChild(copyButton);
  overlay.appendChild(modal);

  // Define the highlight function
  const highlight = (editorElement) => {
    const codeContent = editorElement.textContent;
    const result = hljs.highlight(codeContent, { language }).value;
    editorElement.innerHTML = result;
    };

  // Initialize CodeJar
  const jar = CodeJar(editor, highlight);
  
  jar.updateCode(code);

  // Copy to clipboard functionality
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(jar.toString()).then(() => {
      alert('Code copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy code:', err);
    });
  });
}

export { showCodeEditorModal };