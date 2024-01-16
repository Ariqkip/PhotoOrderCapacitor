import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';

export const isHeicFile = (fileName) => {
  return fileName.endsWith('.heic');
};

const replaceFileName = (fileName) => {
  return fileName?.replace('.heic', '.jpg');
}

export const getFileDimensions = async (selectedFile) => {
  const isHeic = isHeicFile(selectedFile.name);

  if (isHeic) {
    try {
      const convertedBlob = await convertHeicToJpg(selectedFile);

      return await getDimensionsFromBlob(convertedBlob, selectedFile);
    } catch (error) {
      console.error('Error converting HEIC to JPEG:', error);
      throw new Error('Failed to convert HEIC to JPEG');
    }
  } else {
    return await getDimensionsFromBlob(selectedFile);
  }
};

const convertHeicToJpg = async (heicBlob) => {
  try {
    const jpgBlob = await heic2any({
      blob: heicBlob,
      toType: 'image/jpeg',
    });
    return jpgBlob;
  } catch (error) {
    console.error('Error converting HEIC to JPEG:', error);
    throw new Error('Failed to convert HEIC to JPEG');
  }
};

const getDimensionsFromBlob = (blob, selectedFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    const file = new File([blob], 
      replaceFileName(selectedFile?.name),
      { 
        type: "image/jpeg", 
      }
    );

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          convertedFile: file
        });
      };
      img.src = e.target.result;
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
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
