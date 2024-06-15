import { useEffect, useRef } from 'react';
import { useToggle } from './useToggle';

interface UseAudioProps {
  musicSrc: string;
}
export default function useAudio({ musicSrc }: UseAudioProps) {
  const [isPlaying, toggleIsPlaying] = useToggle(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayClick = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    toggleIsPlaying();
  };

  useEffect(() => {
    if (isPlaying) {
      toggleIsPlaying();
    }
  }, [musicSrc]);

  return {
    isPlaying,
    toggleIsPlaying,
    audioRef,
    handlePlayClick
  };
}
