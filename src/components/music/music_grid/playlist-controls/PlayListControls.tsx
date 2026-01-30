import { alpha, darken, lighten, Menu, TextInput } from '@mantine/core';
// import type { MenuProps } from '@mantine/core'; // No longer needed if using styled-components for Menu
import {
  IconMusicPlus,
  IconPlaylist,
  IconPlaylistAdd
} from '@tabler/icons-react';
import styled from 'styled-components';
import Render from '../../../render/Render';

interface IPlayListControls {
  // Assuming Song type is defined elsewhere
  song: Song;
  currentPlayList?: string;
  style: React.CSSProperties;
}

import { useState, useCallback } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

const ADD_SONG_TO_PLAYLIST = gql`
  mutation AddSongToPlaylist($playlistId: ID!, $songId: ID!) {
    addSongToPlaylist(playlistId: $playlistId, songId: $songId) {
      id
      name
      songs {
        id
        title
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

const REMOVE_SONG_FROM_PLAYLIST = gql`
  mutation RemoveSongFromPlaylist($playlistId: ID!, $songId: ID!) {
    removeSongFromPlaylist(playlistId: $playlistId, songId: $songId) {
      id
      name
      songs {
        id
        title
      }
    }
  }
`;

const GET_PLAYLISTS = gql`
  query GetPlaylists {
    playlists {
      playlists {
        id
        name
        songs {
          id
        }
      }
    }
  }
`;

const PlayListControls = ({
  song,
  currentPlayList,
  style
}: IPlayListControls) => {
  const { data, loading, error, refetch } = useQuery(GET_PLAYLISTS);

  const [addSongToPlaylist] = useMutation(ADD_SONG_TO_PLAYLIST);
  const [removeSongFromPlaylist] = useMutation(REMOVE_SONG_FROM_PLAYLIST);
  const [upsertPlaylist] = useMutation(UPSERT_PLAYLIST);

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  const playlists = data?.playlists?.playlists || [];

  const handleToggleCurrentPlaylist = useCallback(async () => {
    if (!currentPlayList) return;
    // Find the current playlist object
    const playlist = playlists.find(
      (pl: { id: string; songs: { id: string }[] }) =>
        String(pl.id) === String(currentPlayList)
    );
    const isInPlaylist = playlist?.songs?.some(
      (s: { id: string }) => String(s.id) === String(song.id)
    );
    try {
      if (isInPlaylist) {
        await removeSongFromPlaylist({
          variables: {
            playlistId: currentPlayList,
            songId: song.id
          }
        });
        console.log(`Removed song "${song.title}" from current playlist.`);
      } else {
        await addSongToPlaylist({
          variables: {
            playlistId: currentPlayList,
            songId: song.id
          }
        });
        console.log(`Added song "${song.title}" to current playlist.`);
      }
      await refetch();
    } catch (err) {
      console.error('Error toggling song in current playlist:', err);
    }
  }, [
    addSongToPlaylist,
    removeSongFromPlaylist,
    currentPlayList,
    playlists,
    song.id,
    song.title,
    refetch
  ]);

  const handleAddToSelectedPlaylist = useCallback(
    async (playlistId: string) => {
      try {
        await addSongToPlaylist({
          variables: {
            playlistId,
            songId: song.id
          }
        });
        await refetch();
        console.log(
          `Added song "${song.title}" to playlist with id ${playlistId}.`
        );
      } catch (err) {
        console.error('Error adding song to playlist:', err);
      }
    },
    [addSongToPlaylist, song.id, song.title, refetch]
  );

  const handleCreatePlaylist = useCallback(async () => {
    if (!newPlaylistName.trim()) return;
    setCreatingPlaylist(true);
    try {
      const { data } = await upsertPlaylist({
        variables: {
          input: {
            name: newPlaylistName.trim()
          }
        }
      });
      if (data?.upsertPlaylist?.id) {
        console.log(`Created new playlist: ${newPlaylistName}`);
        setNewPlaylistName('');
        refetch();
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
    } finally {
      setCreatingPlaylist(false);
    }
  }, [newPlaylistName, setCreatingPlaylist, upsertPlaylist, refetch]);

  return (
    <PlayListControlsContainer style={style}>
      <Render if={!!currentPlayList}>
        <ControlButton
          onClick={handleToggleCurrentPlaylist}
          title="Toggle in Current Playlist"
        >
          <IconMusicPlus />
        </ControlButton>
      </Render>
      <StyledMenu position="left" withArrow closeOnItemClick={false}>
        <Menu.Target>
          <ControlButton title="Add to Playlist">
            <IconPlaylistAdd />
          </ControlButton>
        </Menu.Target>
        <Menu.Dropdown>
          {loading && <Menu.Item disabled>Loading playlists...</Menu.Item>}
          {error && <Menu.Item disabled>Error loading playlists</Menu.Item>}
          {!loading && !error && playlists.length === 0 && (
            <Menu.Item disabled>No playlists available</Menu.Item>
          )}
          {!loading &&
            !error &&
            playlists.map(
              (playlist: {
                id: string;
                name: string;
                songs: { id: string }[];
              }) => {
                const isInPlaylist = playlist.songs?.some(
                  (s: { id: string }) => String(s.id) === String(song.id)
                );
                return (
                  <Menu.Item
                    key={playlist.id}
                    leftSection={<IconPlaylist />}
                    rightSection={
                      isInPlaylist ? (
                        <span
                          style={{
                            color: 'var(--mantine-color-green-7)',
                            fontWeight: 'bold',
                            fontSize: 22,
                            marginLeft: 8,
                            filter:
                              'drop-shadow(0 0 2px var(--mantine-color-green-3))'
                          }}
                          aria-label="Song is in this playlist"
                          title="Song is in this playlist"
                        >
                          ✔
                        </span>
                      ) : null
                    }
                    onClick={async () => {
                      if (isInPlaylist) {
                        await removeSongFromPlaylist({
                          variables: {
                            playlistId: playlist.id,
                            songId: song.id
                          }
                        });
                        await refetch();
                      } else {
                        await handleAddToSelectedPlaylist(playlist.id);
                      }
                    }}
                  >
                    {playlist.name}
                  </Menu.Item>
                );
              }
            )}
          <Menu.Divider />
          <Menu.Label>Create New Playlist</Menu.Label>
          <Menu.Item onClick={(e) => e.stopPropagation()}>
            <TextInput
              placeholder="New playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.currentTarget.value)}
              disabled={creatingPlaylist}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreatePlaylist();
                }
              }}
            />
          </Menu.Item>
          <Menu.Item
            onClick={(e) => {
              e.stopPropagation();
              handleCreatePlaylist();
            }}
            disabled={creatingPlaylist || !newPlaylistName.trim()}
          >
            Create
          </Menu.Item>
        </Menu.Dropdown>
      </StyledMenu>
    </PlayListControlsContainer>
  );
};

const PlayListControlsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: end;
  gap: 0.5rem;
  /* Glassmorphism effect */
  border-radius: 18px;
  padding: 0.15rem 0.3rem;
`;

const StyledMenu = styled(Menu)`
  /* Glassmorphism for dropdown */
  .mantine-Menu-dropdown {
    background: rgba(30, 40, 50, 0.55);
    border: 1.5px solid rgba(80, 255, 180, 0.18);
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(8px);
    color: var(--mantine-color-green-4);
    padding: 0.5rem 0.25rem;
  }

  .mantine-Menu-item {
    color: var(--mantine-color-green-4);
    border-radius: 12px;
    font-weight: 500;
    transition:
      background 0.15s,
      color 0.15s;
    &[data-hovered='true'],
    &:hover {
      color: var(--mantine-color-green-2);
      background: rgba(80, 255, 180, 0.1);
    }
  }

  .mantine-Menu-divider {
    border-color: rgba(80, 255, 180, 0.18);
  }

  .mantine-Menu-label {
    color: var(--mantine-color-green-3);
    font-weight: 600;
    font-size: 0.95em;
    margin-bottom: 0.2em;
  }

  .mantine-Menu-arrow {
    border-color: rgba(80, 255, 180, 0.18);
    background: rgba(30, 40, 50, 0.55);
    backdrop-filter: blur(8px);
  }
`;

const ControlButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-weight: 700;
  border: 1.5px solid rgba(80, 255, 180, 0.18);
  background: rgba(30, 40, 50, 0.45);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.12);
  color: var(--mantine-color-green-4);
  transition:
    background 0.18s,
    color 0.18s,
    box-shadow 0.18s;
  & > svg {
    width: 1.2rem;
    height: 1.2rem;
    color: inherit;
  }
  &.large {
    @media screen and (max-width: 768px) {
      width: 55px;
      height: 55px;
    }
    width: 55px;
    height: 55px;
    & > svg {
      @media screen and (max-width: 768px) {
        width: 1.6rem;
        height: 1.6rem;
      }
      width: 1.4rem;
      height: 1.4rem;
    }
  }
  &.small {
    width: 35px;
    height: 35px;
    & > svg {
      width: 1.2rem;
      height: 1.2rem;
    }
  }
  &:hover,
  &:focus-visible {
    color: var(--mantine-color-green-2);
    background: rgba(80, 255, 180, 0.1);
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.22);
    border-color: rgba(80, 255, 180, 0.38);
    outline: none;
  }
`;

export default PlayListControls;
