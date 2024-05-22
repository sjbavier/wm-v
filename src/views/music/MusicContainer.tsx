import styled from 'styled-components';
import useMusic from '../../hooks/useMusic';
import { Alert, Loader, Text } from '@mantine/core';
import Render from '../../components/render/Render';
import { useMemo, useState } from 'react';
import PaginationContainer from '../../components/pagination/Pagination';

const MusicContainer = () => {
  const [musicId, setMusicId] = useState<Number | undefined>(1);
  const baseUrl = import.meta.env.VITE_GO_API;
  const musicSrc = useMemo(() => {
    return `${baseUrl}music?id=${musicId}`;
  }, [musicId]);
  console.log('musicSrc', musicSrc);
  const [pageSize, setPageSize] = useState(20);
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
      <AudioPlayerContainer>
        <AudioPlayer src={musicSrc} controls>
          doesn't work
        </AudioPlayer>
      </AudioPlayerContainer>
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
      <Render if={loading}>
        <Loader />
      </Render>
      <Render if={Array.isArray(data) && data.length > 0}>
        {data?.map((s: Song) => {
          return (
            <SongRow
              onClick={() => setMusicId(s?.id)}
              key={crypto.randomUUID()}
            >
              <SongInfoChunk>
                {s?.title ? s.title : s?.path?.split('/')[2]}
              </SongInfoChunk>
              <SongInfoChunk>{s?.genre ? s.genre : 'None'}</SongInfoChunk>
            </SongRow>
          );
        })}
        <PaginationContainer
          pageCount={pageCount}
          setPageSize={setPageSize}
          pageSize={pageSize}
          totalItemsCount={totalItemsCount}
          page={page}
          setPage={setPage}
          clearSelected={() => {}}
        />
      </Render>
    </AudioContainer>
  );
};

const AudioContainer = styled.div`
  background-image: linear-gradient(
    to right top,
    #051937,
    #004d7a,
    #008793,
    #00bf72,
    #a8eb12
  );
`;

const AudioPlayerContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 20rem;
`;

const AudioPlayer = styled.audio``;
const SongRow = styled.div`
  display: flex;
  direction: row;
  flex-wrap: nowrap;
  width: 100%;
  cursor: pointer;
`;
const SongInfoChunk = styled.div`
  border: 1px solid #fff;
  color: #fff;
  padding: 1rem;
`;
export default MusicContainer;
