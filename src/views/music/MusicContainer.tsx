import styled from 'styled-components';
import useMusic from '../../hooks/useMusic';
import { Alert, Loader, Text } from '@mantine/core';
import Render from '../../components/render/Render';
import { useMemo, useState } from 'react';

const MusicContainer = () => {
  const [musicId, setMusicId] = useState<Number | undefined>(1);
  const baseUrl = import.meta.env.VITE_GO_API;
  const musicSrc = useMemo(() => {
    return `${baseUrl}music?id=${musicId}`;
  }, [musicId]);
  console.log('musicSrc', musicSrc);

  const { data, errors, loading } = useMusic({ skip: false });
  return (
    <AudioContainer>
      <audio src={musicSrc} controls>
        doesn't work
      </audio>
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
      </Render>
    </AudioContainer>
  );
};

const AudioContainer = styled.div``;
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
