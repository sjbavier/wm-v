import { useCallback, useEffect, useRef, useState } from 'react';
import { useToggle } from './useToggle';
import { useThrottledState } from '@mantine/hooks';

export default function useAudio() {
  const [isPlaying, toggleIsPlaying] = useToggle(false);
  const [currentTime, setCurrentTime] = useThrottledState(0, 500);
  const [duration, setDuration] = useState(0);
  const [marks, setMarks] = useState<
    | {
        value: number;
        label?: React.ReactNode;
      }[]
    | undefined
  >(undefined);

  const audioRef = useRef<HTMLAudioElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handlePlayClick = () => {
    if (!audioRef.current) return;
    toggleIsPlaying();
  };

  const updateCurrentTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
    }
  };

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
      // start animation loop
      animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
    } else {
      audioRef.current.pause();
      if (animationFrameRef.current) {
        // stop animation frame running during pausing
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    // This function is now only responsible for updating the state
    // The actual time update is handled by the onTimeUpdate event
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

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
