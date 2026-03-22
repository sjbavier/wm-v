import {
  alpha,
  Button,
  Drawer,
  ScrollArea,
  Select,
  TextInput
} from '@mantine/core';
import {
  IconArrowsSort,
  IconCheck,
  IconExternalLink,
  IconPlaylist,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import type { PlaylistSummary } from '../../../hooks/usePlaylists';

type PlaylistSortMode = 'name-asc' | 'name-desc' | 'tracks-desc' | 'tracks-asc';

type PlaylistActionResult = {
  success: boolean;
  message: string;
};

const playlistSortOptions: { value: PlaylistSortMode; label: string }[] = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'tracks-desc', label: 'Most tracks' },
  { value: 'tracks-asc', label: 'Fewest tracks' }
];

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
  playlistSortMode?: PlaylistSortMode;
  onPlaylistSortModeChange?: (value: PlaylistSortMode) => void;
  onBrowsePlaylist?: (playlistId: string) => void;
  onRenamePlaylist?: (playlistId: string, nextName: string) => Promise<
    PlaylistActionResult | void
  > | PlaylistActionResult | void;
  onDeletePlaylist?: (playlistId: string) => Promise<
    PlaylistActionResult | void
  > | PlaylistActionResult | void;
}

const compareText = (left?: string, right?: string) =>
  (left || '').localeCompare(right || '', undefined, { sensitivity: 'base' });

const isPlaylistActionResult = (
  value: PlaylistActionResult | void
): value is PlaylistActionResult => {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'message' in value &&
      'success' in value
  );
};

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
  onTogglePlaylistMembership,
  playlistSortMode,
  onPlaylistSortModeChange,
  onBrowsePlaylist,
  onRenamePlaylist,
  onDeletePlaylist
}: PlaylistsDrawerProps) => {
  const [localSortMode, setLocalSortMode] = useState<PlaylistSortMode>('name-asc');
  const [activeRenamePlaylistId, setActiveRenamePlaylistId] = useState<string | null>(
    null
  );
  const [renameDraft, setRenameDraft] = useState('');
  const [deleteTargetPlaylistId, setDeleteTargetPlaylistId] = useState<string | null>(
    null
  );
  const [actionFeedback, setActionFeedback] = useState('');

  const hasSelectedSongActions = Boolean(onTogglePlaylistMembership);
  const hasBrowsePlaylistAction = Boolean(onBrowsePlaylist);
  const hasPlaylistManagementActions = Boolean(onRenamePlaylist || onDeletePlaylist);
  const effectiveSortMode = playlistSortMode || localSortMode;
  const displayFeedback = actionFeedback || feedback;

  useEffect(() => {
    if (!opened) {
      setActiveRenamePlaylistId(null);
      setRenameDraft('');
      setDeleteTargetPlaylistId(null);
      setActionFeedback('');
    }
  }, [opened]);

  useEffect(() => {
    if (
      activeRenamePlaylistId &&
      !playlists.some((playlist) => playlist.id === activeRenamePlaylistId)
    ) {
      setActiveRenamePlaylistId(null);
      setRenameDraft('');
    }
  }, [activeRenamePlaylistId, playlists]);

  useEffect(() => {
    if (
      deleteTargetPlaylistId &&
      !playlists.some((playlist) => playlist.id === deleteTargetPlaylistId)
    ) {
      setDeleteTargetPlaylistId(null);
    }
  }, [deleteTargetPlaylistId, playlists]);

  useEffect(() => {
    if (!actionFeedback) {
      return;
    }

    const timeout = window.setTimeout(() => setActionFeedback(''), 2400);

    return () => window.clearTimeout(timeout);
  }, [actionFeedback]);

  const sortedPlaylists = useMemo(() => {
    const nextPlaylists = [...playlists];

    switch (effectiveSortMode) {
      case 'name-desc':
        return nextPlaylists.sort((left, right) =>
          compareText(right.name, left.name) || left.songCount - right.songCount
        );
      case 'tracks-desc':
        return nextPlaylists.sort(
          (left, right) =>
            right.songCount - left.songCount ||
            compareText(left.name, right.name)
        );
      case 'tracks-asc':
        return nextPlaylists.sort(
          (left, right) =>
            left.songCount - right.songCount ||
            compareText(left.name, right.name)
        );
      case 'name-asc':
      default:
        return nextPlaylists.sort((left, right) =>
          compareText(left.name, right.name) || left.songCount - right.songCount
        );
    }
  }, [effectiveSortMode, playlists]);

  const handleSortChange = (nextValue: string | null) => {
    const nextSortMode = (nextValue as PlaylistSortMode) || 'name-asc';

    if (onPlaylistSortModeChange) {
      onPlaylistSortModeChange(nextSortMode);
      return;
    }

    setLocalSortMode(nextSortMode);
  };

  const beginRename = (playlist: PlaylistSummary) => {
    if (!onRenamePlaylist) {
      return;
    }

    setDeleteTargetPlaylistId(null);
    setActiveRenamePlaylistId(playlist.id);
    setRenameDraft(playlist.name);
  };

  const cancelRename = () => {
    setActiveRenamePlaylistId(null);
    setRenameDraft('');
  };

  const beginDelete = (playlistId: string) => {
    if (!onDeletePlaylist) {
      return;
    }

    setActiveRenamePlaylistId(null);
    setRenameDraft('');
    setDeleteTargetPlaylistId(playlistId);
  };

  const cancelDelete = () => {
    setDeleteTargetPlaylistId(null);
  };

  const submitRename = async (playlistId: string) => {
    const nextName = renameDraft.trim();

    if (!nextName || !onRenamePlaylist) {
      return;
    }

    const result = await onRenamePlaylist(playlistId, nextName);

    if (isPlaylistActionResult(result)) {
      setActionFeedback(result.message);

      if (!result.success) {
        return;
      }
    }

    cancelRename();
  };

  const submitDelete = async (playlistId: string) => {
    if (!onDeletePlaylist) {
      return;
    }

    const result = await onDeletePlaylist(playlistId);

    if (isPlaylistActionResult(result)) {
      setActionFeedback(result.message);

      if (!result.success) {
        return;
      }
    }

    cancelDelete();
  };

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

        {displayFeedback ? <FeedbackPill>{displayFeedback}</FeedbackPill> : null}
        {errorMessage ? <ErrorState>{errorMessage}</ErrorState> : null}

        <Section>
          <SectionHeader>
            <SectionLabel>Playlists</SectionLabel>
            <SortControl>
              <SortLabel>
                <IconArrowsSort size={12} />
                Sort
              </SortLabel>
              <SortSelect
                aria-label="Sort playlists"
                value={effectiveSortMode}
                data={playlistSortOptions}
                checkIconPosition="right"
                allowDeselect={false}
                onChange={handleSortChange}
              />
            </SortControl>
          </SectionHeader>
          <ScrollArea h={260} offsetScrollbars>
            <PlaylistList>
              {loading ? <MutedLine>Loading playlists...</MutedLine> : null}
              {!loading && sortedPlaylists.length === 0 ? (
                <MutedLine>No playlists available yet.</MutedLine>
              ) : null}
              {!loading &&
                sortedPlaylists.map((playlist) => {
                  const membershipLabel = playlist.hasSelectedSong
                    ? 'Saved'
                    : 'Add track';
                  const isRenaming = activeRenamePlaylistId === playlist.id;
                  const isDeleteConfirmOpen = deleteTargetPlaylistId === playlist.id;

                  return (
                    <PlaylistRow key={playlist.id}>
                      <PlaylistRowTop>
                        <PlaylistRowCopy>
                          <PlaylistName>{playlist.name}</PlaylistName>
                          <PlaylistMeta>{playlist.songCount} tracks</PlaylistMeta>
                        </PlaylistRowCopy>

                        {hasPlaylistManagementActions ? (
                          <ManagementRail>
                            {onRenamePlaylist ? (
                              <RowActionButton
                                type="button"
                                onClick={() =>
                                  isRenaming ? cancelRename() : beginRename(playlist)
                                }
                              >
                                {isRenaming ? (
                                  <>
                                    <IconX size={14} />
                                    Cancel
                                  </>
                                ) : (
                                  <>
                                    <IconPencil size={14} />
                                    Rename
                                  </>
                                )}
                              </RowActionButton>
                            ) : null}

                            {onDeletePlaylist ? (
                              <DangerActionButton
                                type="button"
                                onClick={() =>
                                  isDeleteConfirmOpen
                                    ? cancelDelete()
                                    : beginDelete(playlist.id)
                                }
                              >
                                {isDeleteConfirmOpen ? (
                                  <>
                                    <IconX size={14} />
                                    Cancel
                                  </>
                                ) : (
                                  <>
                                    <IconTrash size={14} />
                                    Delete
                                  </>
                                )}
                              </DangerActionButton>
                            ) : null}
                          </ManagementRail>
                        ) : null}
                      </PlaylistRowTop>

                      {hasBrowsePlaylistAction ? (
                        <BrowseRow>
                          <BrowseButton
                            type="button"
                            onClick={() => onBrowsePlaylist?.(playlist.id)}
                          >
                            <IconExternalLink size={14} />
                            Browse playlist
                          </BrowseButton>
                        </BrowseRow>
                      ) : null}

                      {isRenaming ? (
                        <InlineEditor>
                          <StyledTextInput
                            aria-label={`Rename ${playlist.name}`}
                            value={renameDraft}
                            onChange={(event) => setRenameDraft(event.currentTarget.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault();
                                void submitRename(playlist.id);
                              }

                              if (event.key === 'Escape') {
                                event.preventDefault();
                                cancelRename();
                              }
                            }}
                            autoFocus
                          />
                          <EditorButtons>
                            <SaveButton
                              type="button"
                              onClick={() => void submitRename(playlist.id)}
                              disabled={!renameDraft.trim()}
                            >
                              <IconCheck size={14} />
                              Save
                            </SaveButton>
                            <CancelButton type="button" onClick={cancelRename}>
                              Cancel
                            </CancelButton>
                          </EditorButtons>
                        </InlineEditor>
                      ) : null}

                      {isDeleteConfirmOpen ? (
                        <DeleteConfirmCard>
                          <DeleteConfirmText>
                            Delete this playlist? This cannot be undone.
                          </DeleteConfirmText>
                          <DeleteConfirmActions>
                            <DangerActionButton
                              type="button"
                              onClick={() => void submitDelete(playlist.id)}
                            >
                              <IconTrash size={14} />
                              Confirm delete
                            </DangerActionButton>
                            <CancelButton type="button" onClick={cancelDelete}>
                              Keep it
                            </CancelButton>
                          </DeleteConfirmActions>
                        </DeleteConfirmCard>
                      ) : null}

                      {hasSelectedSongActions ? (
                        <MembershipRow>
                          <PlaylistActionButton
                            type="button"
                            $active={playlist.hasSelectedSong}
                            onClick={() => onTogglePlaylistMembership?.(playlist.id)}
                          >
                            {playlist.hasSelectedSong ? (
                              <>
                                <IconX size={14} />
                                Remove track
                              </>
                            ) : (
                              <>
                                <IconPlus size={14} />
                                {membershipLabel}
                              </>
                            )}
                          </PlaylistActionButton>
                        </MembershipRow>
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
    color: rgba(255, 255, 255, 0.78);
  }
`;

const DrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const HeaderStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.16rem;
`;

const HeaderEyebrow = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${alpha('var(--mantine-color-green-5)', 0.88)};
`;

const HeaderTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
`;

const IntroCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.92rem 0.95rem;
  border-radius: 1rem;
  border: 1px solid ${alpha('var(--mantine-color-green-9)', 0.15)};
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.02));
  box-shadow: inset 0 1px 0 ${alpha('#fff', 0.04)};
`;

const IntroCopy = styled.div`
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.5;
`;

const SelectedSongLine = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
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
  padding: 0.6rem 0.75rem;
  border-radius: 0.85rem;
  background: rgba(80, 255, 180, 0.07);
  border: 1px solid rgba(80, 255, 180, 0.15);
  color: rgba(233, 255, 244, 0.92);
  font-size: 0.84rem;
`;

const ErrorState = styled.div`
  padding: 0.6rem 0.75rem;
  border-radius: 0.85rem;
  background: rgba(255, 90, 90, 0.075);
  border: 1px solid rgba(255, 90, 90, 0.16);
  color: rgba(255, 220, 220, 0.92);
  font-size: 0.84rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;

  @media screen and (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SectionLabel = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.54);
`;

const SortControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 11.5rem;

  @media screen and (max-width: 640px) {
    min-width: 0;
  }
`;

const SortLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${alpha('var(--mantine-color-green-8)', 0.18)};
`;

const PlaylistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.35rem;
`;

const PlaylistRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.62rem;
  padding: 0.8rem 0.9rem;
  border-radius: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.028), rgba(0, 0, 0, 0.16));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
`;

const PlaylistRowTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.7rem;

  @media screen and (max-width: 640px) {
    flex-direction: column;
  }
`;

const BrowseRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const PlaylistRowCopy = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const PlaylistName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
`;

const PlaylistMeta = styled.div`
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.58);
`;

const ManagementRail = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
`;

const MembershipRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PlaylistActionButton = styled.button<{ $active?: boolean }>`
  min-width: 6.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.5rem 0.8rem;
  border-radius: 0.7rem;
  background: ${({ $active }) =>
    $active ? 'rgba(80, 255, 180, 0.18)' : 'rgba(255, 255, 255, 0.04)'};
  color: ${({ $active }) =>
    $active ? 'var(--mantine-color-green-1)' : 'rgba(255, 255, 255, 0.82)'};
  border: 1px solid
    ${({ $active }) =>
      $active ? 'rgba(80, 255, 180, 0.28)' : 'rgba(255, 255, 255, 0.12)'};
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(80, 255, 180, 0.22)' : 'rgba(255, 255, 255, 0.07)'};
  }
`;

const RowActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.46rem 0.72rem;
  border-radius: 0.68rem;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  font-size: 0.76rem;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const BrowseButton = styled(RowActionButton)`
  gap: 0.45rem;
  padding-inline: 0.85rem;
  background: linear-gradient(
    180deg,
    rgba(80, 255, 180, 0.14),
    rgba(37, 186, 107, 0.08)
  );
  color: var(--mantine-color-green-2);
  border-color: rgba(80, 255, 180, 0.22);

  &:hover {
    background: linear-gradient(
      180deg,
      rgba(80, 255, 180, 0.2),
      rgba(37, 186, 107, 0.12)
    );
  }
`;

const DangerActionButton = styled(RowActionButton)`
  background: rgba(255, 90, 90, 0.08);
  color: rgba(255, 228, 228, 0.94);
  border-color: rgba(255, 90, 90, 0.18);

  &:hover {
    background: rgba(255, 90, 90, 0.14);
  }
`;

const InlineEditor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EditorButtons = styled.div`
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
`;

const SaveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.48rem 0.82rem;
  border-radius: 0.68rem;
  background: linear-gradient(
    180deg,
    rgba(80, 255, 180, 0.9),
    rgba(37, 186, 107, 0.95)
  );
  color: #04120a;
  border: 0;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 700;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.48rem 0.82rem;
  border-radius: 0.68rem;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const DeleteConfirmCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.72rem 0.78rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(255, 90, 90, 0.16);
  background: rgba(255, 90, 90, 0.075);
`;

const DeleteConfirmText = styled.div`
  color: rgba(255, 228, 228, 0.92);
  font-size: 0.84rem;
  line-height: 1.45;
`;

const DeleteConfirmActions = styled.div`
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
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
    min-height: 2.7rem;
    background: rgba(255, 255, 255, 0.035);
    border-color: rgba(255, 255, 255, 0.11);
    color: rgba(255, 255, 255, 0.92);
    border-radius: 0.75rem;
  }
`;

const SortSelect = styled(Select)`
  .mantine-Select-input {
    min-height: 2.7rem;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.26));
    border-color: ${alpha('var(--mantine-color-green-6)', 0.32)};
    color: rgba(255, 255, 255, 0.94);
    border-radius: 0.75rem;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: ${alpha('var(--mantine-color-green-6)', 0.82)};
    }

    &:focus {
      border-color: ${alpha('var(--mantine-color-green-5)', 0.88)};
      box-shadow: 0 0 0 4px ${alpha('var(--mantine-color-green-9)', 0.14)};
    }
  }

  .mantine-Select-section {
    color: ${alpha('var(--mantine-color-green-5)', 0.4)};
  }

  .mantine-Select-dropdown {
    background: rgba(10, 16, 12, 0.92);
    border-color: ${alpha('var(--mantine-color-green-6)', 0.24)};
  }

  .mantine-Select-option {
    color: rgba(255, 255, 255, 0.88);
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
