import imageCompression from 'browser-image-compression';

export const getFileDimensions = async (selectedFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.src = e.target.result;
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(selectedFile);
  });
};

const getScaleFactor = (maxSize, maxDimension) => {
  const maxFinalSize = 3500;
  const baseScaleFactor = 1;

  if (maxSize !== 0) {
    if (maxSize < maxDimension) {
      return maxSize / maxDimension;
    }
  } else if (maxDimension > maxFinalSize) {
    return  maxFinalSize / maxDimension;
  }

  return baseScaleFactor;
}

export const getCompressedImage = async ({ width, height, maxSize = 0, file }) => {
  const maxDimension = Math.max(width, height);

  const scaleFactor = getScaleFactor(maxSize, maxDimension);

  const newWidth = Math.round(width * scaleFactor);
  const newHeight = Math.round(height * scaleFactor);
  
  const options = {
    maxSizeMB: 3,
    maxWidthOrHeight: Math.max(newWidth, newHeight),
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
};
