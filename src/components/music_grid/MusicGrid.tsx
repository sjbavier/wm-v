import styled from 'styled-components';
import Render from '../render/Render';
import { Size } from '../../hooks/useMediaQuery';
import { useMemo } from 'react';
import useMusicContext from '../../providers/useMusicContext';
import LayoutOptions from './LayoutOptions';

interface MusicGridProps {
  data: undefined | Song[];
  setSong: React.Dispatch<React.SetStateAction<Song | undefined>>;
}
interface SongRowProps {
  $col: string;
  $coverArt?: string;
}
interface DarkenProps {
  $coverArt?: string;
}
const MusicGrid = ({ data, setSong }: MusicGridProps) => {
  const { screenSize } = useMusicContext();

  const columnPercentage = useMemo(() => {
    switch (screenSize) {
      case Size.XS:
        return '100%';
      case Size.SM:
        return '50%';
      case Size.MD:
        return '33%';
      case Size.LG:
        return '25%';
      case Size.XL:
        return '20%';
      default:
        return '25%';
    }
  }, [screenSize]);

  return (
    <Render if={Array.isArray(data) && data.length > 0}>
      <LayoutOptions />
      <MusicGridContainer>
        {data?.map((s: Song) => {
          const pathLength = s?.path?.split('/')?.length;
          const pathArray = s?.path?.split('/');
          const filename = pathArray
            ?.find((p) => p.includes('.'))
            ?.split('.')[0];
          const artist = s?.artist
            ? s.artist
            : pathLength && pathLength > 3
            ? s?.path?.split('/')[2]
            : 'Unknown';
          const title = s?.title ? s.title : filename;
          return (
            <SongRow
              onClick={() => setSong(s)}
              key={crypto.randomUUID()}
              $col={columnPercentage}
              $coverArt={s?.cover_art}
            >
              <Darken $coverArt={s?.cover_art}>
                <SongInfoChunk>{artist}</SongInfoChunk>
                <SongInfoChunk className="title">{title}</SongInfoChunk>

                <SongMetaData>
                  <SongInfoChunk>{s?.genre ? s.genre : 'None'}</SongInfoChunk>
                  <SongInfoChunk>
                    {s?.release_year ? s.release_year : '----'}
                  </SongInfoChunk>
                </SongMetaData>
              </Darken>
            </SongRow>
          );
        })}
      </MusicGridContainer>
    </Render>
  );
};

const MusicGridContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  /* height: calc(25vh - 200px); */
`;
const SongMetaData = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  margin-top: auto;
  align-items: center;
  justify-content: space-between;
`;
const SongRow = styled.div<SongRowProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  cursor: pointer;
  border: 1px solid #fff;
  background: ${({ $coverArt }) =>
    $coverArt
      ? `url(data:image/jpeg;base64,${$coverArt}) no-repeat center center`
      : 'var(--shade-1)'};
  background-size: cover;
  /* border: 1px solid rgba(255, 255, 255, 0.3); */
  border: none;
  color: rgba(255, 255, 255, 0.88);
  width: ${({ $col }) => `calc(${$col} - 2rem)`};
  margin: 1rem;
  border-radius: 0.2rem;
  transition: transform 150ms ease-in-out;
  &:hover {
    background: ${({ $coverArt }) =>
      $coverArt
        ? `url(data:image/jpeg;base64,${$coverArt}) no-repeat center center`
        : 'var(--shade-2)'};
    background-size: cover;
    transform: scale(1.02);
  }
`;
const Darken = styled.div<DarkenProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: ${({ $coverArt }) => ($coverArt ? 'var(--shade-1)' : '')};
  border-radius: 0.4rem;
  width: 100%;
`;
const SongInfoChunk = styled.div`
  padding: 0.8rem;
  word-break: break-all;
  /* background-color: var(--shade-3); */
  &.title {
    font-size: 0.95rem;
    width: 100%;
    background-color: var(--shade-3);
  }
`;
export default MusicGrid;
