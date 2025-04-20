




export async function uploadSnapshot(blob) {
  const formData = new FormData();
  formData.append('file', blob, 'overlay.png');

  //// for debugging - Save a local copy of the file /////
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'overlay.png';
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
  //// for debugging - Save a local copy of the file /////

  try {
    const response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('API call failed:', response.statusText);
      return;
    }

    const result = await response.json();
    console.log('API Response:', result);
  } catch (error) {
    console.error('Error uploading snapshot:', error);
  }
}