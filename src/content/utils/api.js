export async function uploadSnapshot(blob) {
  const formData = new FormData();
  formData.append('file', blob, 'overlay.png');

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