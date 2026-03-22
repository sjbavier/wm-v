import { Select, alpha, darken, lighten } from '@mantine/core';
import styled from 'styled-components';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterOptionsProps {
  className?: string;
  style?: React.CSSProperties;
  playlistValue: string;
  artistValue: string;
  albumValue: string;
  genreValue: string;
  playlistOptions: FilterOption[];
  artistOptions: FilterOption[];
  albumOptions: FilterOption[];
  genreOptions: FilterOption[];
  onPlaylistChange: (value: string) => void;
  onArtistChange: (value: string) => void;
  onAlbumChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

const allOption = { value: 'all', label: 'All' };

const FilterOptions = ({
  className,
  style,
  playlistValue,
  artistValue,
  albumValue,
  genreValue,
  playlistOptions,
  artistOptions,
  albumOptions,
  genreOptions,
  onPlaylistChange,
  onArtistChange,
  onAlbumChange,
  onGenreChange,
  onClear,
  disabled = false
}: FilterOptionsProps) => {
  const hasActiveFilters =
    playlistValue !== allOption.value ||
    artistValue !== allOption.value ||
    albumValue !== allOption.value ||
    genreValue !== allOption.value;

  return (
    <FilterWrapper className={className} style={style}>
      <FilterHeader>
        <FilterLabel>Refine library</FilterLabel>
        <ClearButton type="button" onClick={onClear} disabled={!hasActiveFilters}>
          Reset filters
        </ClearButton>
      </FilterHeader>
      <FilterGrid>
        <SelectStyled
          aria-label="Filter by playlist"
          value={playlistValue}
          data={[allOption, ...playlistOptions]}
          allowDeselect={false}
          disabled={disabled}
          checkIconPosition="right"
          onChange={(value) => onPlaylistChange(value || allOption.value)}
        />
        <SelectStyled
          aria-label="Filter by artist"
          value={artistValue}
          data={[allOption, ...artistOptions]}
          allowDeselect={false}
          disabled={disabled}
          checkIconPosition="right"
          onChange={(value) => onArtistChange(value || allOption.value)}
        />
        <SelectStyled
          aria-label="Filter by album"
          value={albumValue}
          data={[allOption, ...albumOptions]}
          allowDeselect={false}
          disabled={disabled}
          checkIconPosition="right"
          onChange={(value) => onAlbumChange(value || allOption.value)}
        />
        <SelectStyled
          aria-label="Filter by genre"
          value={genreValue}
          data={[allOption, ...genreOptions]}
          allowDeselect={false}
          disabled={disabled}
          checkIconPosition="right"
          onChange={(value) => onGenreChange(value || allOption.value)}
        />
      </FilterGrid>
      <FilterHint>
        Playlist, artist, album, and genre filters are applied client-side to
        the filtered library.
      </FilterHint>
    </FilterWrapper>
  );
};

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const FilterLabel = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${lighten('var(--mantine-color-green-8)', 0.16)};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.55rem;

  @media screen and (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media screen and (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const FilterHint = styled.div`
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.58);
`;

const ClearButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  font-size: 0.72rem;
  cursor: pointer;
  color: ${lighten('var(--mantine-color-green-5)', 0.1)};

  &:hover {
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
  }

  &:disabled {
    cursor: default;
    color: rgba(255, 255, 255, 0.32);
  }
`;

const SelectStyled = styled(Select)`
  .mantine-Select-input {
    min-height: 2.85rem;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.28));
    border-color: ${alpha('var(--mantine-color-green-6)', 0.35)};
    color: rgba(255, 255, 255, 0.94);
    box-shadow:
      inset 0 1px 0 ${alpha('#fff', 0.04)},
      0 10px 24px rgba(0, 0, 0, 0.18);

    &:hover {
      color: ${lighten('var(--mantine-color-green-5)', 0.3)};
      background: ${darken('var(--mantine-color-green-3)', 0.83)};
      border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    }

    &:focus {
      border-color: ${alpha('var(--mantine-color-green-5)', 0.92)};
      box-shadow:
        inset 0 1px 0 ${alpha('#fff', 0.04)},
        0 0 0 4px ${alpha('var(--mantine-color-green-9)', 0.14)};
    }
  }

  .mantine-Select-section {
    color: ${lighten('var(--mantine-color-green-5)', 0.1)};
  }

  .mantine-Select-dropdown {
    background: rgba(10, 16, 12, 0.92);
    border-color: ${alpha('var(--mantine-color-green-6)', 0.28)};
  }

  .mantine-Select-option {
    color: rgba(255, 255, 255, 0.88);
  }
`;

export default FilterOptions;
