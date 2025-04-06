import { useCallback, useEffect, useRef, useState } from 'react';
import { useToggle } from './useToggle';
import { useThrottledState } from '@mantine/hooks';

interface UseAudioProps {
  musicSrc: string;
}
export default function useAudio({ musicSrc }: UseAudioProps) {
  const [isPlaying, toggleIsPlaying] = useToggle(false);
  const [currentTime, setCurrentTime] = useThrottledState(0, 1000);
  const [duration, setDuration] = useState(0);
  const [marks, setMarks] = useState<
    | {
        value: number;
        label?: React.ReactNode;
      }[]
    | undefined
  >(undefined);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayClick = () => {
    if (!audioRef.current) return;

    console.log('audioref', audioRef);
    toggleIsPlaying();
  };

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
      console.log('audio ref pausing');
    } else {
      console.log('audio ref play');
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      console.log('time update', audioRef.current.currentTime);
      setCurrentTime(audioRef.current.currentTime);
      requestAnimationFrame(handleTimeUpdate);
    }
  };

  // Helper function to format time in seconds to mm:ss
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setMarks([
        {
          value: Math.floor(audioRef.current.duration / 4),
          label: `${formatTime(Math.floor(audioRef.current.duration / 4))}`
        },
        {
          value: Math.floor(audioRef.current.duration / 2),
          label: `${formatTime(Math.floor(audioRef.current.duration / 2))}`
        },
        {
          value: Math.floor((audioRef.current.duration / 4) * 3),
          label: `${formatTime(
            Math.floor((audioRef.current.duration / 4) * 3)
          )}`
        },
        {
          value: audioRef.current.duration,
          label: `${formatTime(audioRef.current.duration)}`
        }
      ]);
    }
  }, [formatTime]);

  const handleSliderChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  return {
    isPlaying,
    toggleIsPlaying,
    audioRef,
    handlePlayClick,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    marks,
    setMarks,
    handleTimeUpdate,
    formatTime,
    handleLoadedMetadata,
    handleSliderChange
  };
}
