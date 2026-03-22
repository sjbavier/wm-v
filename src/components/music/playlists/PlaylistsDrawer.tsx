import { alpha, Button, Drawer, ScrollArea, TextInput } from '@mantine/core';
import { IconPlaylist, IconPlus, IconX } from '@tabler/icons-react';
import styled from 'styled-components';
import type { PlaylistSummary } from '../../../hooks/usePlaylists';

interface PlaylistsDrawerProps {
  opened: boolean;
  onClose: () => void;
  playlists: PlaylistSummary[];
  loading?: boolean;
  errorMessage?: string;
  feedback?: string;
  title?: string;
  subtitle?: string;
  selectedSongLabel?: string;
  selectedSongMembershipCount?: number;
  newPlaylistName?: string;
  onNewPlaylistNameChange?: (value: string) => void;
  onCreatePlaylist?: () => void;
  creatingPlaylist?: boolean;
  onTogglePlaylistMembership?: (playlistId: string) => void;
}

const PlaylistsDrawer = ({
  opened,
  onClose,
  playlists,
  loading = false,
  errorMessage,
  feedback,
  title = 'Playlists',
  subtitle = 'Manage playlist membership and create new collections.',
  selectedSongLabel,
  selectedSongMembershipCount,
  newPlaylistName = '',
  onNewPlaylistNameChange,
  onCreatePlaylist,
  creatingPlaylist = false,
  onTogglePlaylistMembership
}: PlaylistsDrawerProps) => {
  const hasSelectedSongActions = Boolean(onTogglePlaylistMembership);

  return (
    <StyledDrawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      padding="lg"
      overlayProps={{ blur: 2, opacity: 0.52 }}
      withinPortal
      styles={{
        content: {
          background:
            'linear-gradient(180deg, rgba(8, 12, 14, 0.98), rgba(8, 12, 14, 0.94))',
          color: 'rgba(255, 255, 255, 0.92)',
          borderLeft: '1px solid rgba(112, 255, 171, 0.18)'
        },
        header: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        },
        title: {
          fontSize: '1.15rem',
          fontWeight: 700,
          letterSpacing: '0.01em'
        }
      }}
      title={
        <HeaderStack>
          <HeaderEyebrow>Library surface</HeaderEyebrow>
          <HeaderTitle>{title}</HeaderTitle>
        </HeaderStack>
      }
    >
      <DrawerBody>
        <IntroCard>
          <IntroCopy>{subtitle}</IntroCopy>
          {selectedSongLabel ? (
            <SelectedSongLine>
              <IconPlaylist size={16} />
              <span>{selectedSongLabel}</span>
            </SelectedSongLine>
          ) : null}
          {selectedSongMembershipCount !== undefined ? (
            <SelectedSongCount>
              {selectedSongMembershipCount} playlist
              {selectedSongMembershipCount === 1 ? '' : 's'}
            </SelectedSongCount>
          ) : null}
        </IntroCard>

        {feedback ? <FeedbackPill>{feedback}</FeedbackPill> : null}
        {errorMessage ? <ErrorState>{errorMessage}</ErrorState> : null}

        <Section>
          <SectionLabel>Playlists</SectionLabel>
          <ScrollArea h={260} offsetScrollbars>
            <PlaylistList>
              {loading ? <MutedLine>Loading playlists...</MutedLine> : null}
              {!loading && playlists.length === 0 ? (
                <MutedLine>No playlists available yet.</MutedLine>
              ) : null}
              {!loading &&
                playlists.map((playlist) => {
                  const membershipLabel = playlist.hasSelectedSong
                    ? 'Saved'
                    : 'Add track';

                  return (
                    <PlaylistRow key={playlist.id}>
                      <PlaylistRowCopy>
                        <PlaylistName>{playlist.name}</PlaylistName>
                        <PlaylistMeta>{playlist.songCount} tracks</PlaylistMeta>
                      </PlaylistRowCopy>
                      {hasSelectedSongActions ? (
                        <PlaylistActionButton
                          type="button"
                          $active={playlist.hasSelectedSong}
                          onClick={() => onTogglePlaylistMembership?.(playlist.id)}
                        >
                          {playlist.hasSelectedSong ? (
                            <>
                              <IconX size={14} />
                              Remove
                            </>
                          ) : (
                            <>
                              <IconPlus size={14} />
                              {membershipLabel}
                            </>
                          )}
                        </PlaylistActionButton>
                      ) : null}
                    </PlaylistRow>
                  );
                })}
            </PlaylistList>
          </ScrollArea>
        </Section>

        <Section>
          <SectionLabel>Create Playlist</SectionLabel>
          <CreateRow>
            <StyledTextInput
              aria-label="New playlist name"
              placeholder="New playlist name"
              value={newPlaylistName}
              onChange={(event) => onNewPlaylistNameChange?.(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onCreatePlaylist?.();
                }
              }}
            />
            <CreateButton
              type="button"
              onClick={onCreatePlaylist}
              disabled={!onCreatePlaylist || creatingPlaylist || !newPlaylistName.trim()}
            >
              Create
            </CreateButton>
          </CreateRow>
        </Section>
      </DrawerBody>
    </StyledDrawer>
  );
};

const StyledDrawer = styled(Drawer)`
  .mantine-Drawer-close {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const DrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
`;

const HeaderEyebrow = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${alpha('var(--mantine-color-green-5)', 0.88)};
`;

const HeaderTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
`;

const IntroCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid ${alpha('var(--mantine-color-green-9)', 0.12)};
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
`;

const IntroCopy = styled.div`
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.5;
`;

const SelectedSongLine = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.88rem;
`;

const SelectedSongCount = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${alpha('var(--mantine-color-green-4)', 0.9)};
`;

const FeedbackPill = styled.div`
  padding: 0.65rem 0.8rem;
  border-radius: 0.85rem;
  background: rgba(80, 255, 180, 0.08);
  border: 1px solid rgba(80, 255, 180, 0.16);
  color: rgba(233, 255, 244, 0.92);
  font-size: 0.84rem;
`;

const ErrorState = styled.div`
  padding: 0.65rem 0.8rem;
  border-radius: 0.85rem;
  background: rgba(255, 90, 90, 0.08);
  border: 1px solid rgba(255, 90, 90, 0.18);
  color: rgba(255, 220, 220, 0.92);
  font-size: 0.84rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const SectionLabel = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.56);
`;

const PlaylistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding-right: 0.5rem;
`;

const PlaylistRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.85rem 0.95rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.15));
`;

const PlaylistRowCopy = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const PlaylistName = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
`;

const PlaylistMeta = styled.div`
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.58);
`;

const PlaylistActionButton = styled.button<{ $active?: boolean }>`
  min-width: 6.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.55rem 0.85rem;
  border-radius: 0.75rem;
  background: ${({ $active }) =>
    $active ? 'rgba(80, 255, 180, 0.18)' : 'rgba(255, 255, 255, 0.04)'};
  color: ${({ $active }) =>
    $active ? 'var(--mantine-color-green-1)' : 'rgba(255, 255, 255, 0.82)'};
  border: 1px solid
    ${({ $active }) =>
      $active ? 'rgba(80, 255, 180, 0.32)' : 'rgba(255, 255, 255, 0.12)'};
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(80, 255, 180, 0.24)' : 'rgba(255, 255, 255, 0.08)'};
  }
`;

const MutedLine = styled.div`
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.84rem;
  padding: 0.2rem 0;
`;

const CreateRow = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;

  @media screen and (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const StyledTextInput = styled(TextInput)`
  flex: 1;

  .mantine-Input-input {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.92);
  }
`;

const CreateButton = styled(Button)`
  background: linear-gradient(
    180deg,
    rgba(80, 255, 180, 0.9),
    rgba(37, 186, 107, 0.95)
  );
  color: #04120a;
  font-weight: 700;

  &:disabled {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.42);
  }
`;

export default PlaylistsDrawer;
