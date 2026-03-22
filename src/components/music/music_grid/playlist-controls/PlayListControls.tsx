import { Menu } from '@mantine/core';
import {
  IconExternalLink,
  IconMusicPlus,
  IconPlaylist,
  IconPlaylistAdd
} from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Render from '../../../render/Render';
import useMusicContext from '../../../../providers/useMusicContext';

interface IPlayListControls {
  song: Song;
  currentPlayList?: string;
  style: React.CSSProperties;
  compact?: boolean;
}

const PlayListControls = ({
  song,
  currentPlayList,
  style,
  compact = false
}: IPlayListControls) => {
  const {
    playlists,
    playlistsLoading,
    playlistsError,
    isSongInPlaylist,
    getSongPlaylistCount,
    toggleSongInPlaylist,
    openPlaylistDrawer
  } = useMusicContext();
  const [feedback, setFeedback] = useState('');
  const playlistCount = getSongPlaylistCount?.(song.id) || 0;
  const membershipLabel =
    playlistCount > 0
      ? `Saved in ${playlistCount} playlist${playlistCount === 1 ? '' : 's'}`
      : 'Not saved to a playlist yet';
  const currentPlaylist = useMemo(() => {
    return (playlists || []).find(
      (playlist) => String(playlist.id) === String(currentPlayList)
    );
  }, [currentPlayList, playlists]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => setFeedback(''), 2200);

    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const handleToggleSong = async (playlistId: string) => {
    if (!toggleSongInPlaylist) {
      return;
    }

    const result = await toggleSongInPlaylist(playlistId, song.id);
    setFeedback(result.message);
  };

  return (
    <PlayListControlsContainer style={style} $compact={compact}>
      <Render if={!!currentPlayList && !!currentPlaylist}>
        <ControlButton
          type="button"
          onClick={() => handleToggleSong(String(currentPlayList))}
          title="Toggle in current playlist"
          aria-label="Toggle song in current playlist"
        >
          <IconMusicPlus />
        </ControlButton>
      </Render>
      <StyledMenu position="left" withArrow closeOnItemClick={false}>
        <Menu.Target>
          <PlaylistTrigger
            type="button"
            title="Manage playlists for this track"
            aria-label="Manage playlists for this track"
            $compact={compact}
          >
            <IconPlaylistAdd />
            <TriggerLabel>
              <span>Playlists</span>
              <span>{playlistCount}</span>
            </TriggerLabel>
          </PlaylistTrigger>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{membershipLabel}</Menu.Label>
          <Render if={!!feedback}>
            <FeedbackMessage>{feedback}</FeedbackMessage>
          </Render>
          {playlistsLoading && <Menu.Item disabled>Loading playlists...</Menu.Item>}
          {playlistsError && <Menu.Item disabled>{playlistsError}</Menu.Item>}
          {!playlistsLoading && !playlistsError && (playlists || []).length === 0 && (
            <Menu.Item disabled>No playlists available</Menu.Item>
          )}
          {!playlistsLoading &&
            !playlistsError &&
            (playlists || []).map((playlist) => {
              const isInPlaylist = isSongInPlaylist?.(playlist.id, song.id) || false;

              return (
                <Menu.Item
                  key={playlist.id}
                  leftSection={<IconPlaylist />}
                  rightSection={
                    isInPlaylist ? (
                      <MembershipCheck
                        aria-label="Song is in this playlist"
                        title="Song is in this playlist"
                      >
                        ✓
                      </MembershipCheck>
                    ) : null
                  }
                  onClick={() => handleToggleSong(playlist.id)}
                >
                  {playlist.name}
                </Menu.Item>
              );
            })}
          <Menu.Divider />
          <Menu.Item leftSection={<IconExternalLink />} onClick={openPlaylistDrawer}>
            Open playlist library
          </Menu.Item>
        </Menu.Dropdown>
      </StyledMenu>
    </PlayListControlsContainer>
  );
};

const PlayListControlsContainer = styled.div<{ $compact?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  gap: 0.35rem;
  border-radius: 18px;
  padding: ${({ $compact }) => ($compact ? '0' : '0.15rem 0.3rem')};
`;

const StyledMenu = styled(Menu)`
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

  .mantine-Menu-itemSection[data-position='right'] {
    min-width: 1.3rem;
    justify-content: center;
  }

  .mantine-Menu-arrow {
    border-color: rgba(80, 255, 180, 0.18);
    background: rgba(30, 40, 50, 0.55);
    backdrop-filter: blur(8px);
  }
`;

const ControlButton = styled.button`
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

  &:hover,
  &:focus-visible {
    color: var(--mantine-color-green-2);
    background: rgba(80, 255, 180, 0.1);
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.22);
    border-color: rgba(80, 255, 180, 0.38);
    outline: none;
  }
`;

const PlaylistTrigger = styled.button<{ $compact?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-height: ${({ $compact }) => ($compact ? '2.35rem' : '2.65rem')};
  padding: ${({ $compact }) => ($compact ? '0.35rem 0.7rem' : '0.45rem 0.9rem')};
  border-radius: 999px;
  border: 1px solid rgba(80, 255, 180, 0.24);
  background: linear-gradient(
    180deg,
    rgba(30, 40, 50, 0.62),
    rgba(12, 16, 22, 0.62)
  );
  color: var(--mantine-color-green-3);
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
    color: var(--mantine-color-green-1);
    border-color: rgba(80, 255, 180, 0.45);
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 16px 32px rgba(0, 0, 0, 0.22);
  }

  & > svg {
    width: 1rem;
    height: 1rem;
  }
`;

const TriggerLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  white-space: nowrap;

  & > span:last-child {
    min-width: 1.35rem;
    padding: 0.15rem 0.35rem;
    border-radius: 999px;
    background: rgba(80, 255, 180, 0.12);
    color: var(--mantine-color-green-1);
    text-align: center;
  }
`;

const MembershipCheck = styled.span`
  color: var(--mantine-color-green-7);
  font-weight: 700;
  font-size: 1.1rem;
  filter: drop-shadow(0 0 2px var(--mantine-color-green-3));
`;

const FeedbackMessage = styled.div`
  margin: 0.25rem 0.35rem 0.55rem;
  padding: 0.45rem 0.65rem;
  border-radius: 0.8rem;
  background: rgba(80, 255, 180, 0.08);
  color: var(--mantine-color-green-1);
  font-size: 0.75rem;
  line-height: 1.35;
`;

export default PlayListControls;
