import { useEffect } from 'react';

interface UseCoverartProps {
  song?: Song;
  convertBase64ToImage: (base64: string, type: string) => void;
}
export default function useCoverart({
  song,
  convertBase64ToImage
}: UseCoverartProps) {
  useEffect(() => {
    if (song?.cover_art) {
      convertBase64ToImage(song.cover_art, 'image/jpeg');
    }
  }, [song, convertBase64ToImage]);
}
