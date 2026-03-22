import {
  alpha,
  CloseButton,
  darken,
  Input,
  lighten
} from '@mantine/core';
import styled from 'styled-components';
import useMusicContext from '../../../providers/useMusicContext';
import { IconSearch } from '@tabler/icons-react';

interface MusicSearchProps {
  style?: React.CSSProperties;
  className?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  value?: string;
  hasSearch?: boolean;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

const MusicSearch = ({
  style,
  className,
  label = 'Library search',
  placeholder = 'Search title, artist, album, or genre',
  hint,
  value,
  hasSearch,
  onChange,
  onClear
}: MusicSearchProps) => {
  const { search, setSearch: setSearchText, setPage } = useMusicContext();
  const searchValue = value ?? search ?? '';
  const activeSearch = hasSearch ?? Boolean(searchValue.trim());

  const setSearch = (searchText: string) => {
    if (onChange) {
      onChange(searchText);
      return;
    }

    setSearchText && setSearchText(searchText);
    setPage && setPage(0);
  };

  const clearSearch = () => {
    if (onClear) {
      onClear();
      return;
    }

    setSearch('');
  };

  return (
    <SearchWrapper className={className} style={style}>
      <SearchLabel>{label}</SearchLabel>
      <SearchFrame $active={activeSearch}>
        <Input
          aria-label="Search music library"
          placeholder={placeholder}
          value={searchValue}
          variant="unstyled"
          leftSection={<StyledIconSearch stroke="1" />}
          leftSectionPointerEvents="none"
          onChange={(event) => setSearch(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              clearSearch();
              event.currentTarget.blur();
            }
          }}
          rightSectionPointerEvents="all"
          rightSection={
            activeSearch ? (
              <StyledCloseButton
                aria-label="Clear music search"
                onClick={clearSearch}
              />
            ) : undefined
          }
        />
      </SearchFrame>
      <SearchMeta>
        <SearchHint>
          {hint ||
            (activeSearch
              ? 'Filtering the library grid and playback queue'
              : 'Live search across the filtered library')}
        </SearchHint>
        <ClearAction type="button" onClick={clearSearch} disabled={!activeSearch}>
          Reset
        </ClearAction>
      </SearchMeta>
    </SearchWrapper>
  );
};

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: min(24rem, 100%);

  @media screen and (max-width: 640px) {
    width: 100%;
  }
`;

const SearchLabel = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${lighten('var(--mantine-color-green-8)', 0.16)};
`;

const SearchFrame = styled.div<{ $active: boolean }>`
  border-radius: 1rem;
  border: 1px solid
    ${({ $active }) =>
      $active
        ? alpha('var(--mantine-color-green-5)', 0.72)
        : alpha('var(--mantine-color-green-6)', 0.35)};
  background: ${({ $active }) =>
    $active
      ? 'linear-gradient(180deg, rgba(37, 186, 107, 0.08), rgba(0, 0, 0, 0.26))'
      : 'linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.28))'};
  box-shadow:
    inset 0 1px 0 ${alpha('#fff', 0.04)},
    0 10px 24px rgba(0, 0, 0, 0.18);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    background-color 150ms ease;

  &:focus-within {
    border-color: ${alpha('var(--mantine-color-green-5)', 0.92)};
    box-shadow:
      inset 0 1px 0 ${alpha('#fff', 0.04)},
      0 0 0 4px ${alpha('var(--mantine-color-green-9)', 0.14)};
  }

  & input {
    width: 100%;
    height: 2.85rem;
    padding: 0.85rem 0.95rem;
    color: rgba(255, 255, 255, 0.94);
  }

  & input::placeholder {
    color: rgba(255, 255, 255, 0.44);
  }
`;

const SearchMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const SearchHint = styled.div`
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.58);
`;

const ClearAction = styled.button`
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

const StyledIconSearch = styled(IconSearch)`
  color: ${lighten('var(--mantine-color-green-5)', 0.1)};
  width: 1rem;
  height: 1rem;
`;

const StyledCloseButton = styled(CloseButton)`
  background: transparent;
  color: ${lighten('var(--mantine-color-green-5)', 0.1)};

  &:hover {
    background: ${darken('var(--mantine-color-green-3)', 0.88)};
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
  }
`;

export default MusicSearch;
