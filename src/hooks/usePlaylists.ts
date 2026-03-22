import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';

export interface PlaylistSongRef {
  id: string;
}

export interface PlaylistSummary {
  id: string;
  name: string;
  songs: PlaylistSongRef[];
  songCount: number;
  hasSelectedSong: boolean;
}

interface PlaylistMutationResult {
  success: boolean;
  message: string;
}

interface CreatePlaylistResult extends PlaylistMutationResult {
  playlistId?: string;
}

type SongIdLike = Song['id'] | string | number;

export const GET_PLAYLISTS = gql`
  query GetPlaylists {
    playlists {
      playlists {
        id
        name
        songs {
          id
        }
      }
      totalItemsCount
    }
  }
`;

const ADD_SONG_TO_PLAYLIST = gql`
  mutation AddSongToPlaylist($playlistId: ID!, $songId: ID!) {
    addSongToPlaylist(playlistId: $playlistId, songId: $songId) {
      id
      name
      songs {
        id
      }
    }
  }
`;

const REMOVE_SONG_FROM_PLAYLIST = gql`
  mutation RemoveSongFromPlaylist($playlistId: ID!, $songId: ID!) {
    removeSongFromPlaylist(playlistId: $playlistId, songId: $songId) {
      id
      name
      songs {
        id
      }
    }
  }
`;

const UPSERT_PLAYLIST = gql`
  mutation UpsertPlaylist($input: PlaylistInput!) {
    upsertPlaylist(input: $input) {
      id
      name
    }
  }
`;

const normalizeSongId = (songId?: SongIdLike) =>
  songId === undefined || songId === null ? '' : String(songId);

interface UsePlaylistsOptions {
  selectedSongId?: SongIdLike;
}

export default function usePlaylists({
  selectedSongId
}: UsePlaylistsOptions = {}) {
  const { data, loading, error, refetch } = useQuery(GET_PLAYLISTS);
  const [addSongToPlaylistMutation] = useMutation(ADD_SONG_TO_PLAYLIST);
  const [removeSongFromPlaylistMutation] = useMutation(REMOVE_SONG_FROM_PLAYLIST);
  const [upsertPlaylistMutation] = useMutation(UPSERT_PLAYLIST);

  const playlists = useMemo<PlaylistSummary[]>(() => {
    const normalizedSelectedSongId = normalizeSongId(selectedSongId);

    return (data?.playlists?.playlists || []).map(
      (playlist: { id: string; name: string; songs: PlaylistSongRef[] }) => ({
        ...playlist,
        songCount: playlist.songs?.length || 0,
        hasSelectedSong: normalizedSelectedSongId
          ? playlist.songs?.some(
              (playlistSong) => String(playlistSong.id) === normalizedSelectedSongId
            ) || false
          : false
      })
    );
  }, [data?.playlists?.playlists, selectedSongId]);

  const playlistTotalCount = data?.playlists?.totalItemsCount || playlists.length;

  const isSongInPlaylist = useCallback(
    (playlistId: string, songId?: SongIdLike) => {
      const normalizedSongId = normalizeSongId(songId);

      if (!normalizedSongId) {
        return false;
      }

      return Boolean(
        playlists
          .find((playlist) => String(playlist.id) === String(playlistId))
          ?.songs?.some((playlistSong) => String(playlistSong.id) === normalizedSongId)
      );
    },
    [playlists]
  );

  const getSongPlaylistCount = useCallback(
    (songId?: SongIdLike) => {
      const normalizedSongId = normalizeSongId(songId);

      if (!normalizedSongId) {
        return 0;
      }

      return playlists.filter((playlist) =>
        playlist.songs?.some(
          (playlistSong) => String(playlistSong.id) === normalizedSongId
        )
      ).length;
    },
    [playlists]
  );

  const addSongToPlaylist = useCallback(
    async (playlistId: string, songId?: SongIdLike): Promise<PlaylistMutationResult> => {
      const normalizedSongId = normalizeSongId(songId);

      if (!playlistId || !normalizedSongId) {
        return {
          success: false,
          message: 'Track or playlist is missing'
        };
      }

      try {
        await addSongToPlaylistMutation({
          variables: {
            playlistId,
            songId: normalizedSongId
          }
        });
        await refetch();

        const playlistName =
          playlists.find((playlist) => String(playlist.id) === String(playlistId))?.name ||
          'playlist';

        return {
          success: true,
          message: `Added to ${playlistName}`
        };
      } catch (_error) {
        return {
          success: false,
          message: 'Playlist update failed'
        };
      }
    },
    [addSongToPlaylistMutation, playlists, refetch]
  );

  const removeSongFromPlaylist = useCallback(
    async (playlistId: string, songId?: SongIdLike): Promise<PlaylistMutationResult> => {
      const normalizedSongId = normalizeSongId(songId);

      if (!playlistId || !normalizedSongId) {
        return {
          success: false,
          message: 'Track or playlist is missing'
        };
      }

      try {
        await removeSongFromPlaylistMutation({
          variables: {
            playlistId,
            songId: normalizedSongId
          }
        });
        await refetch();

        const playlistName =
          playlists.find((playlist) => String(playlist.id) === String(playlistId))?.name ||
          'playlist';

        return {
          success: true,
          message: `Removed from ${playlistName}`
        };
      } catch (_error) {
        return {
          success: false,
          message: 'Playlist update failed'
        };
      }
    },
    [playlists, refetch, removeSongFromPlaylistMutation]
  );

  const toggleSongInPlaylist = useCallback(
    async (playlistId: string, songId?: SongIdLike) => {
      if (isSongInPlaylist(playlistId, songId)) {
        return removeSongFromPlaylist(playlistId, songId);
      }

      return addSongToPlaylist(playlistId, songId);
    },
    [addSongToPlaylist, isSongInPlaylist, removeSongFromPlaylist]
  );

  const createPlaylist = useCallback(
    async (
      playlistName: string,
      options?: { songId?: SongIdLike }
    ): Promise<CreatePlaylistResult> => {
      const nextName = playlistName.trim();

      if (!nextName) {
        return {
          success: false,
          message: 'Enter a playlist name'
        };
      }

      try {
        const { data: playlistData } = await upsertPlaylistMutation({
          variables: {
            input: {
              name: nextName
            }
          }
        });

        const playlistId = playlistData?.upsertPlaylist?.id as string | undefined;

        if (!playlistId) {
          return {
            success: false,
            message: 'Could not create playlist'
          };
        }

        if (options?.songId) {
          const toggleResult = await addSongToPlaylist(playlistId, options.songId);

          if (!toggleResult.success) {
            return toggleResult;
          }
        } else {
          await refetch();
        }

        return {
          success: true,
          playlistId,
          message: options?.songId
            ? `Created ${nextName} and added this track`
            : `Created ${nextName}`
        };
      } catch (_error) {
        return {
          success: false,
          message: 'Could not create playlist'
        };
      }
    },
    [addSongToPlaylist, refetch, upsertPlaylistMutation]
  );

  return {
    playlists,
    playlistTotalCount,
    loading,
    errorMessage: error?.message,
    playlistsLoading: loading,
    playlistsError: error?.message,
    refetchPlaylists: refetch,
    isSongInPlaylist,
    getSongPlaylistCount,
    addSongToPlaylist,
    removeSongFromPlaylist,
    toggleSongInPlaylist,
    createPlaylist
  };
}
