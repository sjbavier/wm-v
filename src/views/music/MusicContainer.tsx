import styled from 'styled-components';
import useMusic from '../../hooks/useMusic';
import { Alert, Loader, Text } from '@mantine/core';
import Render from '../../components/render/Render';
import { useMemo, useState } from 'react';
import PaginationContainer from '../../components/pagination/Pagination';
import MusicGrid from '../../components/music_grid/MusicGrid';

const MusicContainer = () => {
  const [musicId, setMusicId] = useState<Number | undefined>(1);
  const baseUrl = import.meta.env.VITE_GO_API;
  const musicSrc = useMemo(() => {
    return `${baseUrl}music?id=${musicId}`;
  }, [musicId]);
  console.log('musicSrc', musicSrc);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  const {
    data,
    errors,
    loading,
    totalItemsCount,
    totalPageCount: pageCount
  } = useMusic({
    pageSize,
    pageNumber: page,
    skip: false
  });
  return (
    <AudioContainer>
      {/* audio player */}
      <AudioPlayerContainer>
        <AudioPlayer src={musicSrc} controls>
          doesn't work
        </AudioPlayer>
      </AudioPlayerContainer>
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
      <MusicGrid data={data} setMusicId={setMusicId} />
    </AudioContainer>
  );
};

const AudioContainer = styled.div`
  background-image: linear-gradient(
    to right top,
    rgb(5 25 55 / 24%),
    rgb(0 77 122 / 32%),
    rgb(0 135 147 / 28%),
    rgb(0 191 114 / 31%),
    rgb(168 235 18 / 26%)
  );
  margin-left: 48px;
  min-height: 100%;
`;

const AudioPlayerContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  /* height: 20rem; */
`;

const AudioPlayer = styled.audio``;
export default MusicContainer;
