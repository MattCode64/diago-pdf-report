import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<string> => {
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.82,
  });
  return await imageCompression.getDataUrlFromFile(compressed);
};
