import styled from 'styled-components';
import Render from '../render/Render';
import useMediaQuery, { Size } from '../../hooks/useMediaQuery';
import { useMemo } from 'react';

interface MusicGridProps {
  data: undefined | Song[];
  setSong: React.Dispatch<React.SetStateAction<Song | undefined>>;
}
interface SongRowProps {
  $col: string;
}
const MusicGrid = ({ data, setSong }: MusicGridProps) => {
  const { screenSize } = useMediaQuery();

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
      <MusicGridContainer>
        {data?.map((s: Song) => {
          return (
            <SongRow
              onClick={() => setSong(s)}
              key={crypto.randomUUID()}
              $col={columnPercentage}
            >
              <SongInfoChunk>{s?.artist ? s.artist : 'Unknown'}</SongInfoChunk>
              <SongInfoChunk className="title">
                {s?.title ? s.title : s?.path?.split('/')[2].split('.')[0]}
              </SongInfoChunk>

              <SongMetaData>
                <SongInfoChunk>{s?.genre ? s.genre : 'None'}</SongInfoChunk>
                <SongInfoChunk>
                  {s?.release_year ? s.release_year : '----'}
                </SongInfoChunk>
              </SongMetaData>
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
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.88);
  width: ${({ $col }) => `calc(${$col} - 2rem)`};
  margin: 1rem;
  border-radius: 0.4rem;
  transition: transform 150ms ease-in-out;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
  }
`;
const SongInfoChunk = styled.div`
  padding: 1rem;
  word-break: break-all;
  &.title {
    font-size: 1.3rem;
    width: 100%;
  }
`;
export default MusicGrid;
