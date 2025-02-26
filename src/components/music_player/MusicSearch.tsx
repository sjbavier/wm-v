import {
  alpha,
  CloseButton,
  darken,
  FocusTrap,
  Input,
  lighten
} from '@mantine/core';
import styled from 'styled-components';
import useMusicContext from '../../providers/useMusicContext';
import { useToggle } from '../../hooks/useToggle';
import Render from '../render/Render';
import { IconSearch } from '@tabler/icons-react';

interface MusicSearchProps {
  style?: React.CSSProperties;
}

interface SearchWrapperProps {
  $searchOpen?: boolean;
}

const MusicSearch = ({ style }: MusicSearchProps) => {
  const { search, setSearch: setSearchText, setPage } = useMusicContext();
  const [searchOpen, toggleSearch] = useToggle(false);
  const setSearch = (searchText: string) => {
    setSearchText && setSearchText(searchText);
    setPage && setPage(0);
  };
  return (
    <SearchWrapper style={style} $searchOpen={searchOpen}>
      <FocusTrap active={searchOpen}>
        <Input
          data-autofocus
          placeholder={`${searchOpen ? 'Search' : ''}`}
          value={search}
          variant="unstyled"
          onChange={(event) => setSearch(event.currentTarget.value)}
          rightSectionPointerEvents="all"
          rightSection={
            <>
              <Render if={!searchOpen}>
                <StyledIconSearch onClick={toggleSearch} stroke={`1`} />
              </Render>

              <Render if={searchOpen}>
                <StyledCloseButton
                  aria-label="Clear input"
                  onClick={() => {
                    setSearch('');
                    toggleSearch();
                  }}
                />
              </Render>
            </>
          }
        />
      </FocusTrap>
    </SearchWrapper>
  );
};
const SearchWrapper = styled.div<SearchWrapperProps>`
  /* width: ${({ $searchOpen }) => ($searchOpen ? '22rem' : '38px')}; */
  & input {
    transition: width 100ms;
    width: ${({ $searchOpen }) => ($searchOpen ? '15rem' : '2.4rem')};
    height: 2.4rem;
    padding: 0.7rem;
    border-radius: 1.2rem;

    /* background: ${darken('var(--mantine-color-green-3)', 0.88)}; */
    background: var(--shade-1);
    border-width: 1px;
    border-color: ${alpha('var(--mantine-color-green-6)', 0.5)};
    /* color: ${({ $searchOpen }) => ($searchOpen ? '22rem' : '2.4rem')}; */
    color: ${lighten('var(--mantine-color-green-5)', 0.1)};
  }
`;
const StyledIconSearch = styled(IconSearch)`
  cursor: pointer;
  /* background: ${darken('var(--mantine-color-green-3)', 0.88)}; */
  background: transparent;
  border-color: ${alpha('var(--mantine-color-green-6)', 0.5)};
  color: ${lighten('var(--mantine-color-green-5)', 0.1)};
  &:hover {
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
    background: transparent;
    /* background: ${darken('var(--mantine-color-green-3)', 0.88)}; */
    border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
  }
  width: 20px;
`;

const StyledCloseButton = styled(CloseButton)`
  background: transparent;
  /* background: ${darken('var(--mantine-color-green-3)', 0.88)}; */
  border-color: ${alpha('var(--mantine-color-green-6)', 0.5)};
  color: ${lighten('var(--mantine-color-green-5)', 0.1)};
  &:hover {
    background: transparent;
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
    /* background: ${darken('var(--mantine-color-green-3)', 0.88)}; */
    border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
  }
`;

export default MusicSearch;
