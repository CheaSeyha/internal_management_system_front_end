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

      const {
        brightness = 100,
        contrast = 100,
        saturation = 100,
        addWhiteSpace = false,
      } = filters;

      // If addWhiteSpace is true, we fill the background with white.
      // This covers any area that is outside the image bounds.
      if (addWhiteSpace) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.filter = `
          brightness(${brightness}%)
          contrast(${contrast}%)
          saturate(${saturation}%)
        `;

      // Draw the image offset by the crop position.
      // If crop.x is negative (crop starts outside image left), drawing at -x moves image right.
      // This correctly handles both inside and outside crops.
      ctx.drawImage(
        image,
        -pixelCrop.x,
        -pixelCrop.y,
        image.width,
        image.height
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