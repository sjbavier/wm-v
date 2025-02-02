import { useState, useCallback } from 'react';

type UseBase64ToImageReturn = {
  imageUrl: string | null;
  convertBase64ToImage: (base64: string, contentType?: string) => string | void;
  clearImageUrl: () => void;
};

export const useBase64ToImage = (): UseBase64ToImageReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const convertBase64ToImage = useCallback(
    (base64: string, contentType: string = ''): string | void => {
      if (!base64) {
        console.error('Base64 string is required');
        return;
      }

      try {
        // Decode the Base64 string (strip data URI prefix if present)
        const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
        const byteCharacters = atob(base64Data);
        const byteArrays: Uint8Array[] = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        // Create a Blob
        const blob = new Blob(byteArrays, { type: contentType });

        // Generate an Object URL and update state
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);

        // Return the Object URL if needed immediately
        return objectUrl;
      } catch (error) {
        console.error('Error converting Base64 to Blob:', error);
      }
    },
    []
  );

  const clearImageUrl = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl); // Clean up Object URL
      setImageUrl(null);
    }
  }, [imageUrl]);

  return { imageUrl, convertBase64ToImage, clearImageUrl };
};
