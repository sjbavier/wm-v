import styled from 'styled-components';
import useMusic from '../../hooks/useMusic';
import { Alert, Skeleton, alpha, darken, Loader, Text } from '@mantine/core';
import Render from '../../components/render/Render';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PaginationContainer from '../../components/pagination/Pagination';
import MusicGrid from '../../components/music/music_grid/MusicGrid';
import MusicPlayer from '../../components/music/music_player/MusicPlayer';
import MusicLibraryHeader from '../../components/music/library_header/MusicLibraryHeader';
import MusicSearch from '../../components/music/music_player/MusicSearch';
import LayoutOptions from '../../components/music/music_grid/LayoutOptions';
import PlaylistsDrawer from '../../components/music/playlists/PlaylistsDrawer';
import { useDebouncedValue } from '@mantine/hooks';
import {
  MusicContextProvider,
  RepeatMode
} from '../../providers/useMusicContext';
import useMediaQuery from '../../hooks/useMediaQuery';
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
  const [shuffleEnabled, setShuffleEnabled] = useState(() => getStoredShuffle());
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(() =>
    getStoredRepeatMode()
  );
  const [shuffleOrder, setShuffleOrder] = useState<string[]>([]);

  const {
    data,
    errors,
    loading,
    totalItemsCount,
    totalPageCount: pageCount
  } = useMusic({
    pageSize,
    pageNumber: page,
    searchText,
    skip: false
  });
  const hasErrors =
    Array.isArray(errors) && errors.length > 0 && errors[0] !== undefined;
  const hasSongs = Array.isArray(data) && data.length > 0;
  const hasSearchQuery = !!searchText?.trim();
  const showNoResults = !loading && !hasErrors && !hasSongs && hasSearchQuery;
  const showEmptyLibrary = !loading && !hasErrors && !hasSongs && !hasSearchQuery;
  const showMusicGrid = !loading && !hasErrors && hasSongs;

  const queue = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);
  const {
    playlists,
    playlistTotalCount,
    loading: playlistsLoading,
    errorMessage: playlistsError,
    getSongPlaylistCount,
    toggleSongInPlaylist,
    createPlaylist
  } = usePlaylists({
    selectedSongId: song?.id
  });
  const selectedSongLabel = useMemo(() => {
    return song?.title || song?.path || 'Selected track';
  }, [song?.path, song?.title]);
  const selectedSongMembershipCount = getSongPlaylistCount(song?.id);
  const summaryText =
    queue.length === 1
      ? '1 track on this page'
      : `${queue.length} tracks on this page`;
  const layoutLabel = layout === Layout.GRID ? 'Grid' : 'Row';

  const queueSongIds = useMemo(
    () => queue.map((queueSong) => getSongKey(queueSong)),
    [queue]
  );

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

  const selectSong = useCallback(
    (nextSong: Song, options?: { autoplay?: boolean }) => {
      const isSameSong = song?.id === nextSong.id;

      if (isSameSong) {
        if (options?.autoplay) {
          playPlayback?.();
        }
        return;
      }

      resetPlayback?.({ autoplay: options?.autoplay });
      setSong(nextSong);
    },
    [playPlayback, resetPlayback, song?.id]
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
    if (!newPlaylistName.trim()) {
      return;
    }

    setCreatingPlaylist(true);
    const result = await createPlaylist(newPlaylistName, { songId: song?.id });
    setPlaylistFeedback(result.message);

    if (result.success) {
      setNewPlaylistName('');
    }

    setCreatingPlaylist(false);
  }, [createPlaylist, newPlaylistName, song?.id]);

  const handleTogglePlaylistMembership = useCallback(
    async (playlistId: string) => {
      const result = await toggleSongInPlaylist(playlistId, song?.id);
      setPlaylistFeedback(result.message);
    },
    [song?.id, toggleSongInPlaylist]
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
            />
            <LibraryHeaderWrap>
              <MusicLibraryHeader
                title="Browse the current page"
                description="Search the filtered library, switch layout, and manage playlists from one place."
                search={<MusicSearch />}
                layoutToggle={<LayoutOptions />}
                summary={
                  <HeaderSummary>
                    <SummaryChip>{summaryText}</SummaryChip>
                    <SummaryChip>{totalItemsCount || 0} tracks in library</SummaryChip>
                    <SummaryChip>{layoutLabel} layout</SummaryChip>
                    <SummaryChip>Queue follows filtered page</SummaryChip>
                    {hasSearchQuery ? (
                      <SummaryChip>Search: {searchText?.trim()}</SummaryChip>
                    ) : null}
                    {song ? (
                      <SummaryChip>
                        Selected: {song.title || song.path || 'track'}
                      </SummaryChip>
                    ) : null}
                  </HeaderSummary>
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
              pageCount={pageCount || 1}
              setPageSize={setPageSize}
              pageSize={pageSize}
              totalItemsCount={totalItemsCount}
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
          <Render if={loading}>
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
                  Nothing matched “{searchText?.trim()}”
                </StateHeading>
                <StateText>
                  Try a broader artist, album, title, or genre search. The
                  current queue is derived from the filtered results on this
                  page.
                </StateText>
                <StateButton
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setPage(0);
                  }}
                >
                  Clear search
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
              <MusicGrid data={data} setSong={setSong} />
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
          onCreatePlaylist={handleCreatePlaylist}
          creatingPlaylist={creatingPlaylist}
          onTogglePlaylistMembership={song ? handleTogglePlaylistMembership : undefined}
        />
      </AudioContainer>
    </MusicContextProvider>
  );
};

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%; /* Ensure it takes full width */
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  backdrop-filter: brightness(0.05%);
  z-index: 100;
  background-color: var(--shade-1);
  padding-bottom: 0.85rem;
`;

const AudioContainer = styled.div<AudioContainerProps>`
  --shade-1: rgba(0, 0, 0, 0.15);
  --shade-2: rgba(0, 0, 0, 0.43);
  --shade-3: rgba(0, 0, 0, 0.53);
  --shade-4: rgba(0, 0, 0, 0.86);

  margin-left: 48px;
  min-height: 100vh; /* Use viewport height for full-screen */
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* Wrap in a pseudo-element to allow rotation */

  &:before {
    content: '';
    /* Make the pseudo-element bigger than the container */
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

    /* The rotation animation */
    animation: rotateGradient 300s ease-in-out infinite;
    /* The rotation animation */
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
  /* background-color: var(--shade-1); */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Enable vertical scrolling */
`;

const LibraryHeaderWrap = styled.div`
  padding-inline: 1rem;

  @media screen and (max-width: 960px) {
    padding-inline: 0.85rem;
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
