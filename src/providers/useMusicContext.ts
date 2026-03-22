import React, { useContext } from 'react';
import { Size } from '../hooks/useMediaQuery';
import { Layout } from '../constants/constants';
import { PlaylistSummary } from '../hooks/usePlaylists';

export type RepeatMode = 'off' | 'all' | 'one';
export type PlaybackIntent = 'play' | 'pause' | 'toggle';
type SongIdValue = Song['id'] | string | number;

export interface MusicContextProps {
  screenSize?: Size;
  search?: string | undefined;
  setSearch?: React.Dispatch<React.SetStateAction<string | undefined>>;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  queue?: Song[];
  queueIndex?: number;
  hasPreviousTrack?: boolean;
  hasNextTrack?: boolean;
  shuffleEnabled?: boolean;
  repeatMode?: RepeatMode;
  song?: Song | undefined;
  setSong?: React.Dispatch<React.SetStateAction<Song | undefined>>;
  selectSong?: (nextSong: Song, options?: { autoplay?: boolean }) => void;
  playPreviousTrack?: () => void;
  playNextTrack?: () => void;
  toggleShuffle?: () => void;
  cycleRepeatMode?: () => void;
  playlists?: PlaylistSummary[];
  playlistTotalCount?: number;
  playlistsLoading?: boolean;
  playlistsError?: string;
  openPlaylistDrawer?: () => void;
  getSongPlaylistCount?: (songId?: SongIdValue) => number;
  isSongInPlaylist?: (playlistId: string, songId?: SongIdValue) => boolean;
  addSongToPlaylist?: (
    playlistId: string,
    songId?: SongIdValue
  ) => Promise<{ success: boolean; message: string }>;
  removeSongFromPlaylist?: (
    playlistId: string,
    songId?: SongIdValue
  ) => Promise<{ success: boolean; message: string }>;
  toggleSongInPlaylist?: (
    playlistId: string,
    songId?: SongIdValue
  ) => Promise<{ success: boolean; message: string }>;
  createPlaylist?: (
    playlistName: string,
    options?: { songId?: SongIdValue }
  ) => Promise<{ success: boolean; message: string; playlistId?: string }>;
  layout?: Layout | undefined;
  setLayout?: React.Dispatch<React.SetStateAction<Layout | undefined>>;
  // useAudio
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  handlePlayClick: () => void;
  togglePlayback?: () => void;
  toggleIsPlaying: () => void;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  playPlayback?: () => void;
  pausePlayback?: () => void;
  resetPlayback?: (options?: { autoplay?: boolean }) => void;
  restartPlayback?: (options?: { autoplay?: boolean }) => void;
  queuePlayOnLoad?: () => void;
  clearPendingPlay?: () => void;
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
  syncPlaybackState?: () => void;
  handleEnded?: () => void;
  formatTime: (seconds: number) => string;
  handleLoadedMetadata: () => void;
  handleSliderChange: (value: number) => void;
}

const MusicContext = React.createContext<MusicContextProps>(
  {} as MusicContextProps
);

export const MusicContextProvider = MusicContext.Provider;
export function useMusicContext() {
  return useContext(MusicContext);
}
export default useMusicContext;
