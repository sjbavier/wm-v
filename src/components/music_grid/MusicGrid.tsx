import styled from 'styled-components';
import Render from '../render/Render';

interface MusicGridProps {
  data: undefined | Song[];
  setMusicId: React.Dispatch<React.SetStateAction<Number | undefined>>;
}
const MusicGrid = ({ data, setMusicId }: MusicGridProps) => {
  return (
    <Render if={Array.isArray(data) && data.length > 0}>
      {data?.map((s: Song) => {
        return (
          <SongRow onClick={() => setMusicId(s?.id)} key={crypto.randomUUID()}>
            <SongInfoChunk>
              {s?.title ? s.title : s?.path?.split('/')[2]}
            </SongInfoChunk>
            <SongInfoChunk>{s?.genre ? s.genre : 'None'}</SongInfoChunk>
          </SongRow>
        );
      })}
    </Render>
  );
};

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
export default MusicGrid;
