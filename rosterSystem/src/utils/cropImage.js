export const getCroppedImg = (imageSrc, pixelCrop, filters = {}) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        // Apply filters using canvas context
        const {
          brightness = 100,
          contrast = 100,
          saturation = 100,
        } = filters;
  
        ctx.filter = `
          brightness(${brightness}%)
          contrast(${contrast}%)
          saturate(${saturation}%)
        `;
  
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        canvas.toBlob((blob) => {
          const file = new File([blob], "cropped.jpeg", { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          resolve({ file, url });
        }, "image/jpeg");
      };
  
      image.onerror = reject;
    });
  };
  