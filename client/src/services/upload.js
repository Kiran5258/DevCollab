import API from './api';

/**
 * Uploads an image by converting it to Base64 and sending it to our OWN backend.
 * This bypasses the need for "Unsigned Upload Presets" in Cloudinary.
 * This is the most reliable way as it uses the Private API Key on the server.
 */
export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
      try {
        const base64Image = reader.result;
        
        // Send to OUR backend instead of Cloudinary directly
        const res = await API.post('/upload', { image: base64Image });
        
        if (res.data.success) {
          resolve(res.data.url);
        } else {
          reject(new Error('Upload failed'));
        }
      } catch (err) {
        console.error('Upload Error:', err);
        reject(new Error(err.response?.data?.message || 'Image upload failed'));
      }
    };
    
    reader.onerror = (error) => reject(error);
  });
};
