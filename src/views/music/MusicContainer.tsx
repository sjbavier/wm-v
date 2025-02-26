import styled from 'styled-components';
import useMusic from '../../hooks/useMusic';
import { Alert, darken, Loader, Text } from '@mantine/core';
import Render from '../../components/render/Render';
import { useEffect, useMemo, useState } from 'react';
import PaginationContainer from '../../components/pagination/Pagination';
import MusicGrid from '../../components/music_grid/MusicGrid';
import MusicPlayer from '../../components/music_player/MusicPlayer';
import { useDebouncedValue } from '@mantine/hooks';
import { MusicContextProvider } from '../../providers/useMusicContext';
import useMediaQuery from '../../hooks/useMediaQuery';
import { extractColors } from 'extract-colors';
import { useBase64ToImage } from '../../hooks/useBase64ToImage';

interface AudioContainerProps {
  $coverArt?: string;
  $gradient?: string;
}
const MusicContainer = () => {
  const { screenSize } = useMediaQuery();
  const [song, setSong] = useState<Song | undefined>({ id: 1 });
  const { imageUrl, convertBase64ToImage } = useBase64ToImage();
  const [gradient, setGradient] = useState<string>('');
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

  useEffect(() => {
    if (song?.cover_art) {
      convertBase64ToImage(song.cover_art, 'image/jpeg');
    }
  }, [song]);
  useEffect(() => {
    const options = {
      pixels: 64000,
      distance: 0.22,
      // colorValidator: (red, green, blue, alpha = 255) => alpha > 250,
      saturationDistance: 0.2,
      lightnessDistance: 0.2,
      hueDistance: 0.083333333
    };

    if (imageUrl) {
      extractColors(imageUrl, options)
        .then((data) => {
          console.log('extract', data);
          // const steps = 100 / (data.length - 1);
          const gradient = data
            .map((color, _index) => {
              // return `${darken(color.hex, 0.7)} ${steps * index}%`;
              return `${darken(color.hex, 0.1)}`;
            })
            .join(', ');

          setGradient(gradient);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [imageUrl]);

  console.log('gradient', gradient)

  return (
    <MusicContextProvider
      value={{ screenSize, search, setSearch, song, setSong, page, setPage }}
    >
      <AudioContainer $coverArt={song?.cover_art} $gradient={gradient}>
        <BlurLayer>
          <StickyContainer>
            {/* audio player */}
            <MusicPlayer
              musicSrc={musicSrc}
              song={song}
              search={search}
              setSearch={setSearch}
              setPage={setPage}
            />
            <PaginationContainer
              pageCount={pageCount || 1}
              setPageSize={setPageSize}
              pageSize={pageSize}
              totalItemsCount={totalItemsCount}
              page={page}
              setPage={setPage}
              clearSelected={() => {}}
            />
          </StickyContainer>
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
            <div className="flex items-center w-100 justify-center min-h-screen">
              <Loader />
            </div>
          </Render>
          {/* music list  */}
          <MusicGrid data={data} setSong={setSong} />
        </BlurLayer>
      </AudioContainer>
    </MusicContextProvider>
  );
};

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  backdrop-filter: brightness(0.05%);
  z-index: 100;
`;

const AudioContainer = styled.div<AudioContainerProps>`
  --shade-1: rgba(0, 0, 0, 0.15);
  --shade-2: rgba(0, 0, 0, 0.43);
  --shade-3: rgba(0, 0, 0, 0.53);
  --shade-4: rgba(0, 0, 0, 0.86);

  margin-left: 48px;
  min-height: 100%;

  /* Wrap in a pseudo-element to allow rotation */
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    /* Make the pseudo-element bigger than the container */
    position: absolute;
    top: 10%;
    left: 10%;
    --size: 80%;
    width: var(--size);
    height: var(--size);

    /* background: ${({ $gradient }) =>
      $gradient
        ? `linear-gradient(0deg, ${$gradient})`
        : 'linear-gradient(0deg, rgba(40, 48, 3, 1) 0%, rgba(64, 59, 52, 1) 20%, rgba(34, 39, 43, 1) 40%, rgba(20, 21, 14, 1) 60%, rgba(76, 76, 76, 1) 80%, rgba(0, 0, 0, 1) 100%);'}; */


    filter: blur(calc(var(--size) / 5));
    background-image: ${({$gradient}) => $gradient ? `linear-gradient(${$gradient});` : 'linear-gradient(#4377ef, #7befd0)'};
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform-origin: center center;

    /* The rotation animation */
    animation: rotateGradient 300s ease-in-out infinite;    
    /* The rotation animation */
    z-index: -1;
  }

  @keyframes rotateGradient {
    0% {
      transform: rotate(0deg);
      /* transform-origin: -5% 5% -5% 5%; */
      transform-origin: -15% 15% -15% 15%;
    }
    25% {
      transform: rotate(360deg);
      /* transform-origin: 5% -5% 5% -5%; */
      transform-origin: 15% -15% 15% -15%;
    }
    50% {
      transform: rotate(0deg);
      /* transform-origin: -5% 5% -5% 5%; */
      transform-origin: -15% 15% -15% 15%;
    }
    75% {
      transform: rotate(360deg);
      /* transform-origin: 5% -5% 5% -5%; */
      transform-origin: 15% -15% 15% -15%;
    }
    100% {
      transform: rotate(0deg);
      /* transform-origin: -5% 5% -5% 5%; */
      transform-origin: -15% 15% -15% 15%;
    }
  }
`;

const BlurLayer = styled.div`
  backdrop-filter: blur(200px);
  /* background-color: var(--shade-1); */
  min-height: 100vh;
`;

export default MusicContainer;
