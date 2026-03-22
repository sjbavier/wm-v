import { useCallback, useEffect, useRef, useState } from 'react';
import { useThrottledState } from '@mantine/hooks';

type PlaybackIntent = 'play' | 'pause' | 'toggle';

export default function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
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
  const pendingPlayRef = useRef(false);

  const setPlaybackState = useCallback((intent: PlaybackIntent) => {
    if (intent === 'toggle') {
      setIsPlaying((previous) => !previous);
      return;
    }

    setIsPlaying(intent === 'play');
  }, []);

  const togglePlayback = useCallback(() => {
    setPlaybackState('toggle');
  }, [setPlaybackState]);

  const handlePlayClick = useCallback(() => {
    togglePlayback();
  }, [togglePlayback]);

  const playPlayback = useCallback(() => {
    pendingPlayRef.current = false;
    setPlaybackState('play');
  }, [setPlaybackState]);

  const pausePlayback = useCallback(() => {
    pendingPlayRef.current = false;
    setPlaybackState('pause');
  }, [setPlaybackState]);

  const resetPlayback = useCallback(
    ({ autoplay = false }: { autoplay?: boolean } = {}) => {
      pendingPlayRef.current = autoplay;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setMarks(undefined);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    },
    [setCurrentTime]
  );

  const restartPlayback = useCallback(
    ({ autoplay = true }: { autoplay?: boolean } = {}) => {
      pendingPlayRef.current = false;
      setCurrentTime(0);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        if (!autoplay) {
          audioRef.current.pause();
        }
      }

      if (autoplay) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    },
    [setCurrentTime]
  );

  const syncPlaybackState = useCallback(() => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  }, [setCurrentTime]);

  const handleEnded = useCallback(() => {
    pendingPlayRef.current = false;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setMarks(undefined);
  }, [setCurrentTime, setDuration, setMarks]);

  const clearPendingPlay = useCallback(() => {
    pendingPlayRef.current = false;
  }, []);

  const queuePlayOnLoad = useCallback(() => {
    pendingPlayRef.current = true;
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    syncPlaybackState();
  };

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      const nextDuration = audioRef.current.duration;
      const hasValidDuration =
        Number.isFinite(nextDuration) && nextDuration > 0;

      setDuration(hasValidDuration ? nextDuration : 0);
      setMarks(
        hasValidDuration
          ? [
              {
                value: Math.floor(nextDuration / 4),
                label: `${formatTime(Math.floor(nextDuration / 4))}`
              },
              {
                value: Math.floor(nextDuration / 2),
                label: `${formatTime(Math.floor(nextDuration / 2))}`
              },
              {
                value: Math.floor((nextDuration / 4) * 3),
                label: `${formatTime(Math.floor((nextDuration / 4) * 3))}`
              },
              {
                value: nextDuration,
                label: `${formatTime(nextDuration)}`
              }
            ]
          : undefined
      );

      if (pendingPlayRef.current) {
        pendingPlayRef.current = false;
        setIsPlaying(true);
      }
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
    togglePlayback,
    toggleIsPlaying: togglePlayback,
    setIsPlaying,
    audioRef,
    handlePlayClick,
    playPlayback,
    pausePlayback,
    resetPlayback,
    restartPlayback,
    queuePlayOnLoad,
    clearPendingPlay,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    marks,
    setMarks,
    handleTimeUpdate,
    syncPlaybackState,
    handleEnded,
    formatTime,
    handleLoadedMetadata,
    handleSliderChange
  };
}
