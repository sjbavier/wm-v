import React, { useContext } from 'react';
import { Size } from '../hooks/useMediaQuery';
import { Layout } from '../constants/constants';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MusicContextProps {
  screenSize?: Size;
  search?: string | undefined;
  setSearch?: React.Dispatch<React.SetStateAction<string | undefined>>;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  song?: Song | undefined;
  setSong?: React.Dispatch<React.SetStateAction<Song | undefined>>;
  layout?: Layout | undefined;
  setLayout?: React.Dispatch<React.SetStateAction<Layout | undefined>>;
  // useAudio
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  handlePlayClick: () => void;
  toggleIsPlaying: () => void;
  currentTime: number;
  setCurrentTime: (newValue: React.SetStateAction<number>) => void;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  marks:
    | {
        value: number;
        label?: React.ReactNode;
      }[]
    | undefined;
  setMarks: React.Dispatch<
    React.SetStateAction<
      { value: number; label?: React.ReactNode }[] | undefined
    >
  >;
  handleTimeUpdate: () => void;
  formatTime: (seconds: number) => string;
  handleLoadedMetadata: () => void;
  handleSliderChange: (value: number) => void;
}

const MusicContext = React.createContext<MusicContextProps>({});

export const MusicContextProvider = MusicContext.Provider;
export function useMusicContext() {
  return useContext(MusicContext);
}
export default useMusicContext;
