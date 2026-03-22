import styled from 'styled-components';
import useMusic from '../../hooks/useMusic';
import { Alert, Skeleton, alpha, darken, lighten, Loader, Text } from '@mantine/core';
import Render from '../../components/render/Render';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PaginationContainer from '../../components/pagination/Pagination';
import MusicGrid from '../../components/music/music_grid/MusicGrid';
import MusicPlayer from '../../components/music/music_player/MusicPlayer';
import MusicLibraryHeader from '../../components/music/library_header/MusicLibraryHeader';
import MusicSearch from '../../components/music/music_player/MusicSearch';
import LayoutOptions from '../../components/music/music_grid/LayoutOptions';
import PlaylistsDrawer from '../../components/music/playlists/PlaylistsDrawer';
import FilterOptions from '../../components/music/library_header/FilterOptions';
import SortOptions, {
  MusicSortOption
} from '../../components/music/library_header/SortOptions';
import { useDebouncedValue } from '@mantine/hooks';
import {
  MusicContextProvider,
  RepeatMode
} from '../../providers/useMusicContext';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Size } from '../../hooks/useMediaQuery';
import { extractColors } from 'extract-colors';
import { useBase64ToImage } from '../../hooks/useBase64ToImage';
import { Layout } from '../../constants/constants';
import useAudio from '../../hooks/useAudio';
import useCoverart from '../../hooks/useCoverart';
import usePlaylists from '../../hooks/usePlaylists';
import { IconPlaylist } from '@tabler/icons-react';

interface AudioContainerProps {
  $coverArt?: string;
  $gradient?: string;
}

const LAST_TRACK_STORAGE_KEY = 'music:last-track';
const LAYOUT_STORAGE_KEY = 'music:layout';
const SHUFFLE_STORAGE_KEY = 'music:shuffle';
const REPEAT_STORAGE_KEY = 'music:repeat';

const getSongKey = (value: Song | undefined) => String(value?.id ?? '');
type PlaylistSortMode = 'name-asc' | 'name-desc' | 'tracks-desc' | 'tracks-asc';

const compareText = (left?: string, right?: string) => {
  return (left || '').localeCompare(right || '', undefined, {
    sensitivity: 'base'
  });
};

const sortSongs = (songs: Song[], sortOption: MusicSortOption) => {
  const nextSongs = [...songs];

  switch (sortOption) {
    case 'title':
      return nextSongs.sort((left, right) =>
        compareText(left.title || left.path, right.title || right.path)
      );
    case 'artist':
      return nextSongs.sort((left, right) => {
        const primaryComparison = compareText(left.artist, right.artist);
        return primaryComparison !== 0
          ? primaryComparison
          : compareText(left.title || left.path, right.title || right.path);
      });
    case 'album':
      return nextSongs.sort((left, right) => {
        const primaryComparison = compareText(left.album, right.album);
        return primaryComparison !== 0
          ? primaryComparison
          : compareText(left.title || left.path, right.title || right.path);
      });
    case 'recent':
      return nextSongs.sort((left, right) => {
        const leftTime = left.lastUpdate ? new Date(left.lastUpdate).getTime() : 0;
        const rightTime = right.lastUpdate ? new Date(right.lastUpdate).getTime() : 0;
        return rightTime - leftTime;
      });
    default:
      return nextSongs;
  }
};

const getFilterValue = (value?: string, fallback = 'Unknown') => {
  const trimmedValue = value?.trim();
  return trimmedValue || fallback;
};

const buildFilterOptions = (songs: Song[], getValue: (song: Song) => string) => {
  return Array.from(new Set(songs.map(getValue)))
    .sort((left, right) =>
      left.localeCompare(right, undefined, { sensitivity: 'base' })
    )
    .map((value) => ({
      value,
      label: value
    }));
};

const shuffleIds = (ids: string[]) => {
  const nextIds = [...ids];

  for (let index = nextIds.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = nextIds[index];
    nextIds[index] = nextIds[randomIndex];
    nextIds[randomIndex] = current;
  }

  return nextIds;
};

const getStoredSong = (): Song | undefined => {
  const storedSong = localStorage.getItem(LAST_TRACK_STORAGE_KEY);

  if (!storedSong) {
    return { id: 1 };
  }

  try {
    return JSON.parse(storedSong) as Song;
  } catch (_error) {
    return { id: 1 };
  }
};

const getStoredLayout = (): Layout => {
  const storedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);

  return storedLayout === Layout.GRID ? Layout.GRID : Layout.ROW;
};

const getStoredShuffle = () => localStorage.getItem(SHUFFLE_STORAGE_KEY) === 'true';

const getStoredRepeatMode = (): RepeatMode => {
  const storedRepeatMode = localStorage.getItem(REPEAT_STORAGE_KEY);

  if (
    storedRepeatMode === 'off' ||
    storedRepeatMode === 'all' ||
    storedRepeatMode === 'one'
  ) {
    return storedRepeatMode;
  }

  return 'off';
};

const MusicContainer = () => {
  const { screenSize } = useMediaQuery();
  const [song, setSong] = useState<Song | undefined>(() => getStoredSong());
  const { imageUrl, convertBase64ToImage } = useBase64ToImage();
  const [gradient, setGradient] = useState<string>('');
  const [search, setSearch] = useState<string | undefined>(undefined);
  const baseUrl = import.meta.env.VITE_GO_API;
  const musicSrc = useMemo(() => {
    return `${baseUrl}music?id=${song?.id}`;
  }, [baseUrl, song]);

  const {
    isPlaying,
    handlePlayClick,
    toggleIsPlaying,
    setIsPlaying,
    audioRef,
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
  } = useAudio();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  const [searchText] = useDebouncedValue(search, 500);
  const [layout, setLayout] = useState<Layout | undefined>(() =>
    getStoredLayout()
  );
  const [playlistsOpen, setPlaylistsOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [playlistFeedback, setPlaylistFeedback] = useState('');
  const [playlistSortMode, setPlaylistSortMode] =
    useState<PlaylistSortMode>('name-asc');
  const [playlistActionBusy, setPlaylistActionBusy] = useState(false);
  const [isPlayerCompact, setIsPlayerCompact] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(() => getStoredShuffle());
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(() =>
    getStoredRepeatMode()
  );
  const [sortOption, setSortOption] = useState<MusicSortOption>('default');
  const [playlistFilter, setPlaylistFilter] = useState('all');
  const [artistFilter, setArtistFilter] = useState('all');
  const [albumFilter, setAlbumFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [mobileFiltersExpanded, setMobileFiltersExpanded] = useState(false);
  const [mobileSummaryExpanded, setMobileSummaryExpanded] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<string[]>([]);

  const {
    data,
    errors,
    loading,
    totalItemsCount
  } = useMusic({
    pageSize,
    pageNumber: page,
    searchText,
    skip: false
  });
  const hasErrors =
    Array.isArray(errors) && errors.length > 0 && errors[0] !== undefined;
  const normalizedSearchKey = searchText?.trim() || '';
  const canTreatCurrentPageAsFullQueue =
    !loading && !hasErrors && (totalItemsCount || 0) <= pageSize;
  const shouldFetchLibraryQueue =
    !loading && !hasErrors && (totalItemsCount || 0) > pageSize;
  const {
    data: libraryQueueData,
    errors: libraryQueueErrors,
    loading: libraryQueueLoading
  } = useMusic({
    pageSize: Math.max(totalItemsCount || 0, pageSize),
    pageNumber: 0,
    searchText,
    skip: !shouldFetchLibraryQueue
  });
  const [hydratedLibraryQueueKey, setHydratedLibraryQueueKey] = useState('');
  const hasLibraryQueueErrors =
    Array.isArray(libraryQueueErrors) &&
    libraryQueueErrors.length > 0 &&
    libraryQueueErrors[0] !== undefined;
  const hasSearchQuery = !!searchText?.trim();
  const isCompactScreen = screenSize === Size.XS || screenSize === Size.SM;
  const currentPageSongs = useMemo(() => {
    const pageSongs = Array.isArray(data) ? data : [];
    return sortSongs(pageSongs, sortOption);
  }, [data, sortOption]);
  const hasHydratedLibraryQueue =
    hydratedLibraryQueueKey === normalizedSearchKey &&
    Array.isArray(libraryQueueData);
  const isLibraryQueueReady =
    hydratedLibraryQueueKey === normalizedSearchKey &&
    (canTreatCurrentPageAsFullQueue || hasHydratedLibraryQueue);
  const queueSourceSongs = useMemo(() => {
    if (hasHydratedLibraryQueue) {
      return libraryQueueData;
    }

    return currentPageSongs;
  }, [currentPageSongs, hasHydratedLibraryQueue, libraryQueueData]);
  const {
    playlists,
    playlistTotalCount,
    loading: playlistsLoading,
    errorMessage: playlistsError,
    getSongPlaylistCount,
    toggleSongInPlaylist,
    createPlaylist,
    renamePlaylist,
    deletePlaylist
  } = usePlaylists({
    selectedSongId: song?.id
  });
  const playlistOptions = useMemo(() => {
    return playlists.map((playlist) => ({
      value: String(playlist.id),
      label: `${playlist.name} (${playlist.songCount})`
    }));
  }, [playlists]);
  const playlistSongIds = useMemo(() => {
    return new Set(
      playlists
        .find((playlist) => String(playlist.id) === playlistFilter)
        ?.songs?.map((playlistSong) => String(playlistSong.id)) || []
    );
  }, [playlistFilter, playlists]);
  const artistOptions = useMemo(
    () => buildFilterOptions(queueSourceSongs, (queueSong) => getFilterValue(queueSong.artist, 'Unknown artist')),
    [queueSourceSongs]
  );
  const albumOptions = useMemo(
    () => buildFilterOptions(queueSourceSongs, (queueSong) => getFilterValue(queueSong.album, 'Unknown album')),
    [queueSourceSongs]
  );
  const genreOptions = useMemo(
    () => buildFilterOptions(queueSourceSongs, (queueSong) => getFilterValue(queueSong.genre, 'Unknown genre')),
    [queueSourceSongs]
  );
  const hasActiveFacetFilters =
    playlistFilter !== 'all' ||
    artistFilter !== 'all' ||
    albumFilter !== 'all' ||
    genreFilter !== 'all';
  const filteredSongs = useMemo(() => {
    return queueSourceSongs.filter((queueSong) => {
      const matchesPlaylist =
        playlistFilter === 'all' || playlistSongIds.has(getSongKey(queueSong));
      const matchesArtist =
        artistFilter === 'all' ||
        getFilterValue(queueSong.artist, 'Unknown artist') === artistFilter;
      const matchesAlbum =
        albumFilter === 'all' ||
        getFilterValue(queueSong.album, 'Unknown album') === albumFilter;
      const matchesGenre =
        genreFilter === 'all' ||
        getFilterValue(queueSong.genre, 'Unknown genre') === genreFilter;

      return matchesPlaylist && matchesArtist && matchesAlbum && matchesGenre;
    });
  }, [
    albumFilter,
    artistFilter,
    genreFilter,
    playlistFilter,
    playlistSongIds,
    queueSourceSongs
  ]);
  const queue = useMemo(() => {
    return sortSongs(filteredSongs, sortOption);
  }, [filteredSongs, sortOption]);
  const visibleSongs = useMemo(() => {
    if (!isLibraryQueueReady) {
      return sortSongs(filteredSongs, sortOption);
    }

    const startIndex = page * pageSize;
    return queue.slice(startIndex, startIndex + pageSize);
  }, [filteredSongs, isLibraryQueueReady, page, pageSize, queue, sortOption]);
  const hasVisibleSongs = visibleSongs.length > 0;
  const showLoadingState = loading && !hasVisibleSongs;
  const showNoResults =
    !showLoadingState &&
    !hasErrors &&
    !hasVisibleSongs &&
    (hasSearchQuery || hasActiveFacetFilters);
  const showEmptyLibrary =
    !showLoadingState &&
    !hasErrors &&
    !hasVisibleSongs &&
    !hasSearchQuery &&
    !hasActiveFacetFilters;
  const showMusicGrid = !hasErrors && hasVisibleSongs;
  const selectedSongLabel = useMemo(() => {
    return song?.title || song?.path || 'Selected track';
  }, [song?.path, song?.title]);
  const selectedSongMembershipCount = getSongPlaylistCount(song?.id);
  const summaryText =
    visibleSongs.length === 1
      ? '1 track on this page'
      : `${visibleSongs.length} tracks on this page`;
  const filteredSummaryText =
    queue.length === 1 ? '1 track after filters' : `${queue.length} tracks after filters`;
  const layoutLabel = layout === Layout.GRID ? 'Grid' : 'Row';
  const sortLabel = useMemo(() => {
    switch (sortOption) {
      case 'title':
        return 'Title';
      case 'artist':
        return 'Artist';
      case 'album':
        return 'Album';
      case 'recent':
        return 'Recently updated';
      default:
        return 'Library order';
    }
  }, [sortOption]);
  const queueScopeLabel = isLibraryQueueReady
    ? 'Queue: filtered library'
    : hasLibraryQueueErrors
      ? 'Queue fallback: current page'
      : 'Queue syncing: filtered library';
  const showQueueStatusNotice =
    shouldFetchLibraryQueue && (!isLibraryQueueReady || hasLibraryQueueErrors);
  const queueStatusTone = hasLibraryQueueErrors ? 'warning' : 'info';
  const queueStatusTitle = hasLibraryQueueErrors
    ? 'Playback queue fallback'
    : 'Syncing filtered-library queue';
  const queueStatusText = hasLibraryQueueErrors
    ? 'Playback is temporarily limited to the visible page because the filtered-library queue could not be refreshed.'
    : 'The page is ready to browse, but previous, next, shuffle, repeat, and client-side playlist or library filters are still syncing to the full filtered library.';
  const effectivePageCount = Math.max(1, Math.ceil(queue.length / pageSize));
  useEffect(() => {
    setPage(0);
  }, [playlistFilter, artistFilter, albumFilter, genreFilter, setPage]);

  useEffect(() => {
    if (
      playlistFilter !== 'all' &&
      !playlists.some((playlist) => String(playlist.id) === playlistFilter)
    ) {
      setPlaylistFilter('all');
    }
  }, [playlistFilter, playlists]);

  useEffect(() => {
    if (!isCompactScreen) {
      setMobileFiltersExpanded(false);
      setMobileSummaryExpanded(false);
    }
  }, [isCompactScreen]);

  useEffect(() => {
    if (page > effectivePageCount - 1) {
      setPage(Math.max(effectivePageCount - 1, 0));
    }
  }, [effectivePageCount, page, setPage]);

  const queueSongIds = useMemo(
    () => queue.map((queueSong) => getSongKey(queueSong)),
    [queue]
  );

  useEffect(() => {
    if (canTreatCurrentPageAsFullQueue) {
      setHydratedLibraryQueueKey(normalizedSearchKey);
      return;
    }

    if (!libraryQueueLoading && !hasLibraryQueueErrors && Array.isArray(libraryQueueData)) {
      setHydratedLibraryQueueKey(normalizedSearchKey);
    }
  }, [
    hasLibraryQueueErrors,
    canTreatCurrentPageAsFullQueue,
    libraryQueueData,
    libraryQueueLoading,
    normalizedSearchKey,
    shouldFetchLibraryQueue
  ]);

  useEffect(() => {
    if (!shuffleEnabled) {
      setShuffleOrder([]);
      return;
    }

    setShuffleOrder((previousOrder) => {
      const queueSongSet = new Set(queueSongIds);
      const currentSongId = getSongKey(song);
      const preservedIds = previousOrder.filter(
        (id) => queueSongSet.has(id) && id !== currentSongId
      );
      const missingIds = queueSongIds.filter(
        (id) => !preservedIds.includes(id) && id !== currentSongId
      );
      const shuffledMissingIds = shuffleIds(missingIds);

      if (currentSongId && queueSongSet.has(currentSongId)) {
        return [currentSongId, ...preservedIds, ...shuffledMissingIds];
      }

      return [...preservedIds, ...shuffledMissingIds];
    });
  }, [queueSongIds, shuffleEnabled, song]);

  const playbackQueue = useMemo(() => {
    if (!shuffleEnabled) {
      return queue;
    }

    const songsById = new Map(
      queue.map((queueSong) => [getSongKey(queueSong), queueSong] as const)
    );
    const orderedSongs = shuffleOrder
      .map((id) => songsById.get(id))
      .filter((value): value is Song => value !== undefined);

    if (orderedSongs.length === queue.length) {
      return orderedSongs;
    }

    const orderedIds = new Set(orderedSongs.map((queueSong) => getSongKey(queueSong)));
    const missingSongs = queue.filter(
      (queueSong) => !orderedIds.has(getSongKey(queueSong))
    );

    return [...orderedSongs, ...missingSongs];
  }, [queue, shuffleEnabled, shuffleOrder]);

  const queueIndex = useMemo(() => {
    return playbackQueue.findIndex(
      (queueSong) => getSongKey(queueSong) === getSongKey(song)
    );
  }, [playbackQueue, song]);

  const hasPreviousTrack =
    queueIndex > 0 ||
    (repeatMode === 'all' && playbackQueue.length > 1 && queueIndex === 0);
  const hasNextTrack =
    queueIndex > -1 &&
    (queueIndex < playbackQueue.length - 1 ||
      (repeatMode === 'all' && playbackQueue.length > 1));
  const summaryChips = useMemo(() => {
    const chips: React.ReactNode[] = [
      <SummaryChip key="page-summary">{summaryText}</SummaryChip>,
      <SummaryChip key="library-count">{totalItemsCount || 0} tracks in library</SummaryChip>,
      <SummaryChip key="filtered-summary">{filteredSummaryText}</SummaryChip>,
      <SummaryChip key="queue-count">{queue.length} tracks in queue</SummaryChip>,
      <SummaryChip key="page-count">Viewing page {page + 1} of {effectivePageCount}</SummaryChip>,
      <SummaryChip key="sort">Grid sorted by {sortLabel}</SummaryChip>,
      <SummaryChip key="layout">{layoutLabel} layout</SummaryChip>,
      <SummaryChip key="queue-scope">{queueScopeLabel}</SummaryChip>
    ];

    if (hasSearchQuery) {
      chips.push(<SummaryChip key="search">Search: {searchText?.trim()}</SummaryChip>);
    }

    if (playlistFilter !== 'all') {
      chips.push(
        <SummaryChip key="playlist-filter">
          Playlist:{' '}
          {playlists.find((playlist) => String(playlist.id) === playlistFilter)?.name ||
            'Selected'}
        </SummaryChip>
      );
    }

    if (artistFilter !== 'all') {
      chips.push(<SummaryChip key="artist-filter">Artist: {artistFilter}</SummaryChip>);
    }

    if (albumFilter !== 'all') {
      chips.push(<SummaryChip key="album-filter">Album: {albumFilter}</SummaryChip>);
    }

    if (genreFilter !== 'all') {
      chips.push(<SummaryChip key="genre-filter">Genre: {genreFilter}</SummaryChip>);
    }

    if (song && queueIndex > -1) {
      chips.push(
        <SummaryChip key="queue-position">
          Queue position {queueIndex + 1} of {playbackQueue.length}
        </SummaryChip>
      );
    }

    if (song && queueIndex === -1) {
      chips.push(
        <SummaryChip key="queue-missing">
          Current track is outside the filtered queue
        </SummaryChip>
      );
    }

    if (song) {
      chips.push(
        <SummaryChip key="selected-track">
          Selected: {song.title || song.path || 'track'}
        </SummaryChip>
      );
    }

    return chips;
  }, [
    albumFilter,
    artistFilter,
    effectivePageCount,
    filteredSummaryText,
    genreFilter,
    hasSearchQuery,
    layoutLabel,
    page,
    playbackQueue.length,
    playlistFilter,
    playlists,
    queue.length,
    queueIndex,
    queueScopeLabel,
    searchText,
    song,
    sortLabel,
    summaryText,
    totalItemsCount
  ]);
  const visibleSummaryChips =
    isCompactScreen && !mobileSummaryExpanded ? summaryChips.slice(0, 6) : summaryChips;

  const selectSong = useCallback(
    (nextSong: Song, options?: { autoplay?: boolean }) => {
      const isSameSong = song?.id === nextSong.id;

      if (isSameSong) {
        if (options?.autoplay) {
          restartPlayback?.({ autoplay: true });
        }
        return;
      }

      resetPlayback?.({ autoplay: options?.autoplay });
      setSong(nextSong);
    },
    [resetPlayback, restartPlayback, song?.id]
  );

  const playPreviousTrack = useCallback(() => {
    if (!hasPreviousTrack || playbackQueue.length === 0) {
      return;
    }

    const previousIndex =
      queueIndex > 0 ? queueIndex - 1 : playbackQueue.length - 1;
    const previousSong = playbackQueue[previousIndex];

    if (previousSong) {
      selectSong(previousSong, { autoplay: true });
    }
  }, [hasPreviousTrack, playbackQueue, queueIndex, selectSong]);

  const playNextTrack = useCallback(() => {
    if (!hasNextTrack || playbackQueue.length === 0) {
      return;
    }

    const nextIndex =
      queueIndex < playbackQueue.length - 1 ? queueIndex + 1 : 0;
    const nextSong = playbackQueue[nextIndex];

    if (nextSong) {
      selectSong(nextSong, { autoplay: true });
    }
  }, [hasNextTrack, playbackQueue, queueIndex, selectSong]);

  const toggleShuffle = useCallback(() => {
    setShuffleEnabled((previous) => !previous);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((previousMode) => {
      switch (previousMode) {
        case 'off':
          return 'all';
        case 'all':
          return 'one';
        default:
          return 'off';
      }
    });
  }, []);

  const handleTrackEnded = useCallback(() => {
    if (repeatMode === 'one') {
      restartPlayback?.({ autoplay: true });
      return;
    }

    if (hasNextTrack) {
      playNextTrack();
      return;
    }

    handleEnded?.();
  }, [handleEnded, hasNextTrack, playNextTrack, repeatMode, restartPlayback]);

  useEffect(() => {
    if (song) {
      localStorage.setItem(LAST_TRACK_STORAGE_KEY, JSON.stringify(song));
    }
  }, [song]);

  useEffect(() => {
    if (layout) {
      localStorage.setItem(LAYOUT_STORAGE_KEY, layout);
    }
  }, [layout]);

  useEffect(() => {
    localStorage.setItem(SHUFFLE_STORAGE_KEY, String(shuffleEnabled));
  }, [shuffleEnabled]);

  useEffect(() => {
    localStorage.setItem(REPEAT_STORAGE_KEY, repeatMode);
  }, [repeatMode]);

  useEffect(() => {
    if (!playlistFeedback) {
      return;
    }

    const timeout = window.setTimeout(() => setPlaylistFeedback(''), 2200);

    return () => window.clearTimeout(timeout);
  }, [playlistFeedback]);

  useEffect(() => {
    if (isCompactScreen) {
      setIsPlayerCompact(false);
      return;
    }

    const handleScroll = () => {
      setIsPlayerCompact(window.scrollY > 96);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCompactScreen]);

  useCoverart({ song, convertBase64ToImage });
  useEffect(() => {
    const options = {
      pixels: 64000,
      distance: 0.22,
      // colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
      saturationDistance: 0.2,
      lightnessDistance: 0.2,
      hueDistance: 0.083333333
    };

    if (imageUrl) {
      extractColors(imageUrl, options)
        .then((data) => {
          const gradient = data.map((color) => `${darken(color.hex, 0.1)}`).join(', ');

          setGradient(gradient);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [imageUrl]);

  const handleCreatePlaylist = useCallback(async () => {
    if (!newPlaylistName.trim() || playlistActionBusy) {
      return;
    }

    setPlaylistActionBusy(true);
    setCreatingPlaylist(true);
    try {
      const result = await createPlaylist(newPlaylistName, { songId: song?.id });
      setPlaylistFeedback(result.message);

      if (result.success) {
        setNewPlaylistName('');
      }
    } finally {
      setCreatingPlaylist(false);
      setPlaylistActionBusy(false);
    }
  }, [createPlaylist, newPlaylistName, playlistActionBusy, song?.id]);

  const handleTogglePlaylistMembership = useCallback(
    async (playlistId: string) => {
      if (playlistActionBusy) {
        return;
      }

      const result = await toggleSongInPlaylist(playlistId, song?.id);
      setPlaylistFeedback(result.message);
    },
    [playlistActionBusy, song?.id, toggleSongInPlaylist]
  );

  const handleRenamePlaylist = useCallback(
    async (playlistId: string, nextName: string) => {
      if (playlistActionBusy) {
        return {
          success: false,
          message: 'Playlist action already in progress'
        };
      }

      setPlaylistActionBusy(true);
      try {
        const result = await renamePlaylist(playlistId, nextName);
        setPlaylistFeedback(result.message);
        return result;
      } finally {
        setPlaylistActionBusy(false);
      }
    },
    [playlistActionBusy, renamePlaylist]
  );

  const handleDeletePlaylist = useCallback(
    async (playlistId: string) => {
      if (playlistActionBusy) {
        return {
          success: false,
          message: 'Playlist action already in progress'
        };
      }

      setPlaylistActionBusy(true);
      try {
        const result = await deletePlaylist(playlistId);
        if (result.success && playlistFilter === playlistId) {
          setPlaylistFilter('all');
        }
        setPlaylistFeedback(result.message);
        return result;
      } finally {
        setPlaylistActionBusy(false);
      }
    },
    [deletePlaylist, playlistActionBusy, playlistFilter]
  );

  const handleBrowsePlaylist = useCallback(
    (playlistId: string) => {
      const selectedPlaylist = playlists.find(
        (playlist) => String(playlist.id) === String(playlistId)
      );

      setPlaylistFilter(String(playlistId));
      setPage(0);
      setPlaylistsOpen(false);
      setMobileFiltersExpanded(false);
      setMobileSummaryExpanded(false);
      setPlaylistFeedback(
        selectedPlaylist?.name
          ? `Browsing ${selectedPlaylist.name}`
          : 'Browsing playlist'
      );
    },
    [playlists]
  );

  return (
    <MusicContextProvider
      value={{
        screenSize,
        search,
        setSearch,
        queue,
        queueIndex,
        hasPreviousTrack,
        hasNextTrack,
        shuffleEnabled,
        repeatMode,
        song,
        setSong,
        selectSong,
        playPreviousTrack,
        playNextTrack,
        toggleShuffle,
        cycleRepeatMode,
        playlists,
        playlistTotalCount,
        playlistsLoading,
        playlistsError,
        openPlaylistDrawer: () => setPlaylistsOpen(true),
        getSongPlaylistCount,
        toggleSongInPlaylist,
        createPlaylist,
        page,
        setPage,
        layout,
        setLayout,
        isPlaying,
        toggleIsPlaying,
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
        handleEnded: handleTrackEnded,
        formatTime,
        handleLoadedMetadata,
        handleSliderChange
      }}
    >
      <AudioContainer $coverArt={song?.cover_art} $gradient={gradient}>
        <BlurLayer>
          <StickyContainer>
            <MusicPlayer
              musicSrc={musicSrc}
              song={song}
              compact={isPlayerCompact}
            />
            <LibraryHeaderWrap>
              <MusicLibraryHeader
                title="Browse the filtered library"
                description="Browse a paginated grid, sort the filtered library, and control playback from the filtered-library queue."
                search={<MusicSearch />}
                filtersControl={
                  <FilterPanel>
                    {isCompactScreen ? (
                      <MobileControlButton
                        type="button"
                        onClick={() => setMobileFiltersExpanded((value) => !value)}
                        aria-expanded={mobileFiltersExpanded}
                      >
                        {mobileFiltersExpanded ? 'Hide filters' : 'Refine library'}
                      </MobileControlButton>
                    ) : null}
                    {(!isCompactScreen || mobileFiltersExpanded) && (
                      <FilterOptions
                        playlistValue={playlistFilter}
                        artistValue={artistFilter}
                        albumValue={albumFilter}
                        genreValue={genreFilter}
                        playlistOptions={playlistOptions}
                        artistOptions={artistOptions}
                        albumOptions={albumOptions}
                        genreOptions={genreOptions}
                        onPlaylistChange={setPlaylistFilter}
                        onArtistChange={setArtistFilter}
                        onAlbumChange={setAlbumFilter}
                        onGenreChange={setGenreFilter}
                        onClear={() => {
                          setPlaylistFilter('all');
                          setArtistFilter('all');
                          setAlbumFilter('all');
                          setGenreFilter('all');
                        }}
                      />
                    )}
                  </FilterPanel>
                }
                sortControl={
                  <SortOptions value={sortOption} onChange={setSortOption} />
                }
                layoutToggle={<LayoutOptions />}
                statusNotice={
                  showQueueStatusNotice ? (
                    <QueueStatusNotice $tone={queueStatusTone}>
                      <QueueStatusEyebrow>
                        {queueStatusTitle}
                      </QueueStatusEyebrow>
                      <QueueStatusText>{queueStatusText}</QueueStatusText>
                    </QueueStatusNotice>
                  ) : null
                }
                summary={
                  <SummaryPanel>
                    <HeaderSummary>{visibleSummaryChips}</HeaderSummary>
                    {isCompactScreen && summaryChips.length > 6 ? (
                      <SummaryToggleButton
                        type="button"
                        onClick={() => setMobileSummaryExpanded((value) => !value)}
                        aria-expanded={mobileSummaryExpanded}
                      >
                        {mobileSummaryExpanded ? 'Show less' : 'Show more details'}
                      </SummaryToggleButton>
                    ) : null}
                  </SummaryPanel>
                }
                playlistsAction={
                  <LibraryPlaylistButton
                    type="button"
                    onClick={() => setPlaylistsOpen(true)}
                    aria-label="Open playlist library drawer"
                  >
                    <IconPlaylist size={16} />
                    <span>Playlists</span>
                    <PlaylistCountBadge>{playlistTotalCount}</PlaylistCountBadge>
                  </LibraryPlaylistButton>
                }
              />
            </LibraryHeaderWrap>
            <PaginationContainer
              pageCount={effectivePageCount}
              setPageSize={setPageSize}
              pageSize={pageSize}
              totalItemsCount={queue.length}
              page={page}
              setPage={setPage}
              clearSelected={() => {}}
            />
          </StickyContainer>
          <Render if={hasErrors}>
            <StateContainer>
              <StateAlert
                variant="light"
                color="red"
                radius="xl"
                title="Could not load the music library"
              >
                <StateText>
                  The player reached the backend, but the library response was
                  not usable.
                </StateText>
                <StateList>
                  {errors.map((e) => (
                    <Text key={crypto.randomUUID()} style={{ color: '#fff' }}>
                      {e?.message}
                    </Text>
                  ))}
                </StateList>
              </StateAlert>
            </StateContainer>
          </Render>
          <Render if={showLoadingState}>
            <LoadingStateContainer>
              <LoadingHeader>
                <div>
                  <LoadingTitle>Loading your music library</LoadingTitle>
                  <LoadingCaption>
                    Pulling tracks, artwork, and queue state from the API.
                  </LoadingCaption>
                </div>
                <Loader color="green" />
              </LoadingHeader>
              <LoadingSkeletonGrid>
                {Array.from({ length: 6 }).map((_, index) => (
                  <LoadingSkeletonCard key={`loading-card-${index}`}>
                    <Skeleton
                      height={140}
                      radius="lg"
                    />
                    <Skeleton
                      mt="md"
                      height={16}
                      width="65%"
                      radius="xl"
                    />
                    <Skeleton
                      mt="sm"
                      height={12}
                      width="45%"
                      radius="xl"
                    />
                  </LoadingSkeletonCard>
                ))}
              </LoadingSkeletonGrid>
            </LoadingStateContainer>
          </Render>
          <Render if={showNoResults}>
            <StateContainer>
              <EmptyStateCard>
                <StateEyebrow>No matches</StateEyebrow>
                <StateHeading>
                  {hasSearchQuery
                    ? `Nothing matched “${searchText?.trim()}”`
                    : 'No tracks match the current filters'}
                </StateHeading>
                <StateText>
                  Try broader artist, album, title, genre, or client-side filter
                  choices. Playback follows the filtered library once the queue
                  sync completes.
                </StateText>
                <StateButton
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setPlaylistFilter('all');
                    setArtistFilter('all');
                    setAlbumFilter('all');
                    setGenreFilter('all');
                    setPage(0);
                  }}
                >
                  Clear filters
                </StateButton>
              </EmptyStateCard>
            </StateContainer>
          </Render>
          <Render if={showEmptyLibrary}>
            <StateContainer>
              <EmptyStateCard>
                <StateEyebrow>Library empty</StateEyebrow>
                <StateHeading>No tracks are available yet</StateHeading>
                <StateText>
                  Once the Go API returns indexed music, the queue, search, and
                  player controls will populate here.
                </StateText>
              </EmptyStateCard>
            </StateContainer>
          </Render>
          <Render if={showMusicGrid}>
            <MusicGridContainer>
              <MusicGrid data={visibleSongs} setSong={setSong} />
            </MusicGridContainer>
          </Render>
        </BlurLayer>
        <PlaylistsDrawer
          opened={playlistsOpen}
          onClose={() => setPlaylistsOpen(false)}
          playlists={playlists}
          loading={playlistsLoading}
          errorMessage={playlistsError}
          feedback={playlistFeedback}
          selectedSongLabel={selectedSongLabel}
          selectedSongMembershipCount={selectedSongMembershipCount}
          newPlaylistName={newPlaylistName}
          onNewPlaylistNameChange={setNewPlaylistName}
          playlistSortMode={playlistSortMode}
          onPlaylistSortModeChange={setPlaylistSortMode}
          onCreatePlaylist={handleCreatePlaylist}
          creatingPlaylist={creatingPlaylist}
          onTogglePlaylistMembership={song ? handleTogglePlaylistMembership : undefined}
          onBrowsePlaylist={handleBrowsePlaylist}
          onRenamePlaylist={handleRenamePlaylist}
          onDeletePlaylist={handleDeletePlaylist}
        />
      </AudioContainer>
    </MusicContextProvider>
  );
};

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  backdrop-filter: brightness(0.05%);
  z-index: 100;
  background: linear-gradient(180deg, rgba(10, 14, 18, 0.96), rgba(10, 14, 18, 0.82));
  padding-bottom: 0.85rem;

  @media screen and (max-width: 960px) {
    padding-bottom: 0.7rem;
  }

  @media screen and (max-width: 768px) {
    position: static;
  }
`;

const AudioContainer = styled.div<AudioContainerProps>`
  --shade-1: rgba(0, 0, 0, 0.15);
  --shade-2: rgba(0, 0, 0, 0.43);
  --shade-3: rgba(0, 0, 0, 0.53);
  --shade-4: rgba(0, 0, 0, 0.86);

  margin-left: 48px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 960px) {
    margin-left: 0;
  }

  &:before {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    --size: 80%;
    width: var(--size);
    height: var(--size);

    /* background: ${({ $gradient }) =>
      $gradient
        ? `linear-gradient(0deg, ${$gradient})`
        : 'linear-gradient(0deg, rgba(40, 48, 3, 1) 0%, rgba(64, 59, 52, 1) 20%, rgba(34, 39, 43, 1) 40%, rgba(20, 21, 14, 1) 60%, rgba(76, 76, 76, 1) 80%, rgba(0, 0, 0, 1) 100%);'}; */

    filter: blur(calc(var(--size) / 5));
    background-image: ${({ $gradient }) =>
      $gradient
        ? `linear-gradient(${$gradient});`
        : 'linear-gradient(#4377ef, #7befd0)'};
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform-origin: center center;

    animation: rotateGradient 300s ease-in-out infinite;
    z-index: -1;
  }

  @keyframes rotateGradient {
    0% {
      transform: rotate(0deg);
      /* transform-origin: -5% 5% -5% 5%; */
      transform-origin: -15% 15% -15% 15%;
    }
    25% {
      transform: rotate(360deg);
      /* transform-origin: 5% -5% 5% -5%; */
      transform-origin: 15% -15% 15% -15%;
    }
    50% {
      transform: rotate(0deg);
      /* transform-origin: -5% 5% -5% 5%; */
      transform-origin: -15% 15% -15% 15%;
    }
    75% {
      transform: rotate(360deg);
      /* transform-origin: 5% -5% 5% -5%; */
      transform-origin: 15% -15% 15% -15%;
    }
    100% {
      transform: rotate(0deg);
      /* transform-origin: -5% 5% -5% 5%; */
      transform-origin: -15% 15% -15% 15%;
    }
  }
`;

const BlurLayer = styled.div`
  backdrop-filter: blur(200px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: clip;
`;

const LibraryHeaderWrap = styled.div`
  padding-inline: 1rem;

  @media screen and (max-width: 960px) {
    padding-inline: 0.85rem;
  }

  @media screen and (max-width: 640px) {
    padding-inline: 0.7rem;
  }
`;

const HeaderSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SummaryChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const QueueStatusNotice = styled.div<{ $tone: 'info' | 'warning' }>`
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  width: 100%;
  padding: 0.72rem 0.85rem;
  border-radius: 0.95rem;
  border: 1px solid
    ${({ $tone }) =>
      $tone === 'warning'
        ? 'rgba(255, 164, 91, 0.26)'
        : alpha('var(--mantine-color-green-7)', 0.22)};
  background: ${({ $tone }) =>
    $tone === 'warning'
      ? 'linear-gradient(180deg, rgba(110, 59, 22, 0.28), rgba(29, 16, 9, 0.32))'
      : 'linear-gradient(180deg, rgba(25, 82, 54, 0.2), rgba(8, 18, 13, 0.3))'};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

const QueueStatusEyebrow = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.74);
`;

const QueueStatusText = styled.div`
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.8rem;
  line-height: 1.5;
`;

const FilterPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
`;

const SummaryPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  width: 100%;
`;

const MobileControlButton = styled.button`
  width: 100%;
  min-height: 2.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.95rem;
  border: 1px solid ${alpha('var(--mantine-color-green-6)', 0.3)};
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.3));
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    border-color: ${alpha('var(--mantine-color-green-6)', 0.55)};
    color: ${lighten('var(--mantine-color-green-4)', 0.12)};
  }
`;

const SummaryToggleButton = styled.button`
  align-self: flex-start;
  border: none;
  background: transparent;
  padding: 0;
  color: ${lighten('var(--mantine-color-green-5)', 0.12)};
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    color: ${lighten('var(--mantine-color-green-4)', 0.22)};
  }
`;

const LibraryPlaylistButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 2.65rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid ${alpha('var(--mantine-color-green-5)', 0.24)};
  background: linear-gradient(
    180deg,
    rgba(30, 40, 50, 0.62),
    rgba(12, 16, 22, 0.62)
  );
  color: rgba(236, 255, 244, 0.92);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 28px rgba(0, 0, 0, 0.16);
  transition:
    border-color 150ms ease,
    color 150ms ease,
    transform 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    border-color: ${alpha('var(--mantine-color-green-5)', 0.45)};
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 16px 32px rgba(0, 0, 0, 0.22);
  }

  @media screen and (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const PlaylistCountBadge = styled.span`
  min-width: 1.35rem;
  padding: 0.15rem 0.35rem;
  border-radius: 999px;
  background: rgba(80, 255, 180, 0.12);
  color: var(--mantine-color-green-1);
  text-align: center;
`;

const StateContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
`;

const StateAlert = styled(Alert)`
  width: min(48rem, 100%);
  border: 1px solid rgba(255, 107, 107, 0.24);
  background: linear-gradient(
    180deg,
    rgba(56, 15, 15, 0.72) 0%,
    rgba(23, 6, 6, 0.9) 100%
  );
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.22);
`;

const StateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0.9rem;
`;

const StateText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.6;
`;

const LoadingStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem 1rem 2rem;
`;

const LoadingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.24) 0%,
    rgba(0, 0, 0, 0.42) 100%
  );
`;

const LoadingTitle = styled.div`
  color: rgba(255, 255, 255, 0.92);
  font-size: 1rem;
  font-weight: 600;
`;

const LoadingCaption = styled.div`
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.85rem;
  margin-top: 0.2rem;
`;

const LoadingSkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

const LoadingSkeletonCard = styled.div`
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
`;

const EmptyStateCard = styled.div`
  width: min(38rem, 100%);
  padding: 1.6rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.22) 0%,
    rgba(0, 0, 0, 0.48) 100%
  );
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
`;

const StateEyebrow = styled.div`
  color: rgba(142, 255, 193, 0.82);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const StateHeading = styled.h2`
  margin: 0;
  color: rgba(255, 255, 255, 0.94);
  font-size: 1.25rem;
`;

const StateButton = styled.button`
  margin-top: 1rem;
  border: 1px solid rgba(112, 255, 171, 0.45);
  background: rgba(37, 186, 107, 0.12);
  color: rgba(235, 255, 244, 0.92);
  border-radius: 999px;
  padding: 0.65rem 1rem;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    transform 150ms ease,
    border-color 150ms ease;

  &:hover {
    background: rgba(37, 186, 107, 0.2);
    border-color: rgba(112, 255, 171, 0.75);
    transform: translateY(-1px);
  }
`;

const MusicGridContainer = styled.div`
  flex-grow: 1; /* Allow MusicGrid to take up remaining space */
  overflow-y: auto; /* Enable scrolling within MusicGrid */
`;

export default MusicContainer;
