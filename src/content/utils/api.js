




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


import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function uploadSnapshot(blob, overlay) {
  try {
    // package file for upload
    const uploaded = await ai.files.upload({
      file: blob,
      config: { mimeType: 'image/png' },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: createUserContent([
        createPartFromUri(uploaded.uri, uploaded.mimeType),
        'Extract and return all source code shown in this image. Only output the code.',  //'Describe this image' 
      ]),
    });

    overlay.style.animation = ''; // Stop the animation
    overlay.style.display = 'block';
    overlay._extractBtn.style.display = 'block';
    overlay._extractBanner.style.display = 'none';

    console.log('Gemini response:', response.text);
    alert(response.text);
  } catch (err) {
    console.error('Gemini OCR error:', err);
    alert('Failed to extract code. See console for details.');
  }
}
