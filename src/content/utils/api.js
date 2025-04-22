// export async function uploadSnapshot(blob) {
//   const formData = new FormData();
//   formData.append('file', blob, 'overlay.png');

//   //// for debugging - Save a local copy of the file /////
//   const url = URL.createObjectURL(blob);
//   const downloadLink = document.createElement('a');
//   downloadLink.href = url;
//   downloadLink.download = 'overlay.png';
//   downloadLink.style.display = 'none';
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);
//   URL.revokeObjectURL(url);
//   //// for debugging - Save a local copy of the file /////

//   try {
//     const response = await fetch('https://httpbin.org/post', {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       console.error('API call failed:', response.statusText);
//       return;
//     }

//     const result = await response.json();
//     console.log('API Response:', result);
//   } catch (error) {
//     console.error('Error uploading snapshot:', error);
//   }
// }

import { showCodeEditorModal } from './codemodal.js';
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';

// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});


let ai = null;

// Initialize GoogleGenAI dynamically with the user's API key
function initializeGoogleGenAI(apiKey) {
  if (!ai || ai.apiKey !== apiKey) {
    ai = new GoogleGenAI({ apiKey });
    ai.apiKey = apiKey; // store for future checks
  }
}

async function getGeminiApiKey(overlay) {
  if (!chrome.storage || !chrome.storage.sync) {
    console.error('chrome.storage.sync is not available in this context.');
    alert('Storage is not available. Please check your extension permissions.');
    return null;
  }

  try {
    const result = await new Promise((resolve, reject) =>
      chrome.storage.sync.get('geminiApiKey', (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(data);
        }
      })
    );

    if (!result.geminiApiKey) {
      console.warn('API key is not set.');
      if (overlay && overlay._extractBanner) {
        alert('⚠️ API key is not set. Please set it in the extension settings.');
        overlay.style.animation = ''; // Stop the animation
        overlay.style.display = 'block';
        overlay._extractBtn.style.display = 'block';
        overlay._extractBanner.style.display = 'none';
      }
      return null;
    }

    return result.geminiApiKey;
  } catch (error) {
    console.error('Failed to retrieve API key from storage:', error);
    alert('❌ Failed to retrieve API key. Please check your extension settings.');
    overlay.style.animation = ''; // Stop the animation
    overlay.style.display = 'block';
    overlay._extractBtn.style.display = 'block';
    overlay._extractBanner.style.display = 'none';
    return null;
  }
}


function extractJsonFromPossibleMarkdown(raw) {
  const trimmed = raw.trim();

  // Check if it's wrapped in a Markdown code block
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const jsonStr = match ? match[1] : trimmed;

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('❌ Failed to parse JSON:', e);
    overlay.style.animation = ''; // Stop the animation
    overlay.style.display = 'block';
    overlay._extractBtn.style.display = 'block';
    overlay._extractBanner.style.display = 'none';
    return null;
  }
}

export async function uploadSnapshot(blob, overlay) {
  try {
    // get the API key from storage
    const geminiApiKey = await getGeminiApiKey(overlay);
    if (!geminiApiKey) return;

    // initialize GoogleGenAI with the API key
    initializeGoogleGenAI(geminiApiKey);

    // package file for upload
    const uploaded = await ai.files.upload({
      file: blob,
      config: { mimeType: 'image/png' },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: createUserContent([
        createPartFromUri(uploaded.uri, uploaded.mimeType),
        `
        Extract all source code visible in this image. The image may contain multiple code blocks, multiline snippets, or non-code text — ignore everything except the raw source code.  Do not return line numbers.
        Identify the programming language, and return the result in the following JSON format:

        {
          "language": "<coding language>",
          "code": "<detected code>"
        }

        If no source code is found, return:

        {
          "language": null,
          "code": ""
        }

        Do not include explanations, markdown formatting, or additional text.  Return only the raw JSON — do not wrap it in a code block or use markdown formatting.
        `
      ]),
    });

    overlay.style.animation = ''; // Stop the animation
    overlay.style.display = 'block';
    overlay._extractBtn.style.display = 'block';
    overlay._extractBanner.style.display = 'none';

    const raw = response.text;
    const parsed = extractJsonFromPossibleMarkdown(raw);

    if (parsed && parsed.language && typeof parsed.code === 'string') {
      console.log('✅ Parsed VLM result:', parsed);
      showCodeEditorModal(overlay, parsed.language.toLowerCase(), parsed.code);
    } else {
      console.warn('⚠️ No source code detected:', raw);
      alert('⚠️ No source code detected: ' + raw);
    }
    

  } catch (err) {
    console.error('Gemini OCR error:', err);
    alert('❌ Failed to upload snapshot. Please check your API key and try again.');
  }
}
