export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext('2d');
  
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
  
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas is empty'));
          const url = URL.createObjectURL(blob);
          const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
          resolve({ file, url });
        }, 'image/jpeg', 1);
      };
      image.onerror = (err) => reject(err);
    });
  };
  