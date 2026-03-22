import { Select, alpha, darken, lighten } from '@mantine/core';
import styled from 'styled-components';

export type MusicSortOption = 'default' | 'title' | 'artist' | 'album' | 'recent';

interface SortOptionsProps {
  className?: string;
  style?: React.CSSProperties;
  value: MusicSortOption;
  onChange: (value: MusicSortOption) => void;
}

const sortOptions = [
  { value: 'default', label: 'Library order' },
  { value: 'title', label: 'Title' },
  { value: 'artist', label: 'Artist' },
  { value: 'album', label: 'Album' },
  { value: 'recent', label: 'Recently updated' }
] as const;

const SortOptions = ({ className, style, value, onChange }: SortOptionsProps) => {
  return (
    <SortWrapper className={className} style={style}>
      <SortLabel>Sort filtered library</SortLabel>
      <SelectStyled
        aria-label="Sort filtered library"
        value={value}
        data={sortOptions.map((option) => ({
          value: option.value,
          label: option.label
        }))}
        checkIconPosition="right"
        allowDeselect={false}
        onChange={(nextValue) => onChange((nextValue as MusicSortOption) || 'default')}
      />
      <SortHint>Drives both the paginated grid and playback queue ordering.</SortHint>
    </SortWrapper>
  );
};

const SortWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 12rem;
`;

const SortLabel = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${lighten('var(--mantine-color-green-8)', 0.16)};
`;

const SortHint = styled.div`
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.58);
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

export default SortOptions;
