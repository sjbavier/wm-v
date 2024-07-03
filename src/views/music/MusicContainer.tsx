import styled from 'styled-components';
import useMusic from '../../hooks/useMusic';
import { Alert, Loader, Text } from '@mantine/core';
import Render from '../../components/render/Render';
import { useMemo, useState } from 'react';
import PaginationContainer from '../../components/pagination/Pagination';
import MusicGrid from '../../components/music_grid/MusicGrid';
import MusicPlayer from '../../components/music_player/MusicPlayer';
import { useDebouncedValue } from '@mantine/hooks';

interface AudioContainerProps {
  $coverArt?: string;
}
const MusicContainer = () => {
  const [song, setSong] = useState<Song | undefined>({ id: 1 });
  const [search, setSearch] = useState<string | undefined>(undefined);
  const baseUrl = import.meta.env.VITE_GO_API;
  const musicSrc = useMemo(() => {
    return `${baseUrl}music?id=${song?.id}`;
  }, [song]);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  const [searchText] = useDebouncedValue(search, 500);

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
  return (
    <AudioContainer $coverArt={song?.cover_art}>
      <BlurLayer>
        {/* audio player */}
        <MusicPlayer
          musicSrc={musicSrc}
          song={song}
          search={search}
          setSearch={setSearch}
        />
        {/* error  */}
        <Render
          if={
            Array.isArray(errors) &&
            errors.length > 0 &&
            errors?.[0] !== undefined
          }
        >
          <Alert variant="light" color="red" radius="lg" title="[Error:]">
            {errors.map((e) => (
              <Text key={crypto.randomUUID()} style={{ color: '#fff' }}>
                {e?.message}
              </Text>
            ))}
          </Alert>
        </Render>
        {/* loader  */}
        <Render if={loading}>
          <Loader />
        </Render>
        <PaginationContainer
          pageCount={pageCount || 1}
          setPageSize={setPageSize}
          pageSize={pageSize}
          totalItemsCount={totalItemsCount}
          page={page}
          setPage={setPage}
          clearSelected={() => {}}
        />
        {/* music list  */}
        <MusicGrid data={data} setSong={setSong} />
      </BlurLayer>
    </AudioContainer>
  );
};

const AudioContainer = styled.div<AudioContainerProps>`
  --shade-1: rgba(0, 0, 0, 0.23);
  --shade-2: rgba(0, 0, 0, 0.43);
  --shade-3: rgba(0, 0, 0, 0.53);
  /* background-image: linear-gradient(
    to right top,
    rgb(5 25 55 / 24%),
    rgb(0 77 122 / 32%),
    rgb(0 135 147 / 28%),
    rgb(0 191 114 / 31%),
    rgb(168 235 18 / 26%)
  );  */

  background: ${({ $coverArt }) =>
    $coverArt
      ? `url(data:image/jpeg;base64,${$coverArt}) no-repeat center center`
      : 'rgba(255, 255, 255, 0.1)'};
  background-size: cover;
  margin-left: 48px;
  min-height: 100%;
`;

const BlurLayer = styled.div`
  backdrop-filter: blur(15px);
  background-color: var(--shade-1);
  min-height: 100vh;
`;

export default MusicContainer;
