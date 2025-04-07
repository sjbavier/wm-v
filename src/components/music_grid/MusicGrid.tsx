import styled from 'styled-components';
import Render from '../render/Render';
import { Size } from '../../hooks/useMediaQuery';
import { useMemo } from 'react';
import useMusicContext from '../../providers/useMusicContext';
import LayoutOptions from './LayoutOptions';
import { Layout } from '../../constants/constants';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { alpha, darken, lighten } from '@mantine/core';

interface MusicGridProps {
  data: undefined | Song[];
  setSong: React.Dispatch<React.SetStateAction<Song | undefined>>;
}
interface SongRowProps {
  $col?: string;
  $coverArt?: string;
}
interface DarkenProps {
  $coverArt?: string;
}
const MusicGrid = ({ data, setSong }: MusicGridProps) => {
  const { screenSize, layout, handlePlayClick, isPlaying, song } =
    useMusicContext();

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
            <>
              <Render if={layout === Layout.GRID}>
                <SongRow
                  onClick={() => setSong(s)}
                  key={crypto.randomUUID()}
                  $col={columnPercentage}
                  $coverArt={s?.cover_art}
                >
                  <Darken $coverArt={s?.cover_art}>
                    <SongInfoChunk>{artist}</SongInfoChunk>
                    <SongInfoChunk className="title">
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <ControlButton
                          className="small"
                          onClick={handlePlayClick}
                        >
                          {isPlaying && song?.id === s.id ? (
                            <IconPlayerPause stroke={`1`} />
                          ) : (
                            <IconPlayerPlay stroke={`1`} />
                          )}
                        </ControlButton>

                        {title}
                      </div>
                    </SongInfoChunk>

                    <SongMetaData>
                      <SongInfoChunk>
                        {s?.genre ? s.genre : 'None'}
                      </SongInfoChunk>
                      <SongInfoChunk>
                        {s?.release_year ? s.release_year : '----'}
                      </SongInfoChunk>
                    </SongMetaData>
                  </Darken>
                </SongRow>
              </Render>
              <Render if={layout === Layout.ROW}>
                <CompactRow
                  onClick={() => setSong(s)}
                  key={crypto.randomUUID()}
                  $coverArt={s?.cover_art}
                >
                  <CompactDarken $coverArt={s?.cover_art}>
                    <ControlButton className="large" onClick={handlePlayClick}>
                      {isPlaying && song?.id === s.id ? (
                        <IconPlayerPause stroke={`1`} />
                      ) : (
                        <IconPlayerPlay stroke={`1`} />
                      )}
                    </ControlButton>
                    <div>
                      <CompactSongInfo>{artist}</CompactSongInfo>
                      <CompactSongInfo>{title}</CompactSongInfo>
                    </div>
                  </CompactDarken>
                </CompactRow>
              </Render>
            </>
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
const ControlButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* width: 50px;
  height: 50px; */
  /* margin-left: 1.4rem; */
  margin-block: 0.2rem;
  margin-right: 0.6rem;
  border-radius: 50%;
  font-weight: 700;
  border-width: 1px;
  background: transparent;
  background: var(--shade-1);
  border-color: ${alpha('var(--mantine-color-green-6)', 0.5)};
  color: ${lighten('var(--mantine-color-green-5)', 0.1)};
  & > svg {
    width: 1.2rem;
    height: 1.2rem;
  }
  &.small {
    min-width: 35px;
    min-height: 35px;
    width: 35px;
    height: 35px;
    & > svg {
      width: 1.2rem;
      height: 1.2rem;
    }
  }
  &.large {
    @media screen and (max-width: 768px) {
      width: 35px;
      height: 35px;
    }
    width: 45px;
    height: 45px;
    & > svg {
      @media screen and (max-width: 768px) {
        width: 1.4rem;
        height: 1.4rem;
      }
      width: 1.6rem;
      height: 1.6rem;
    }
  }
  &:hover {
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
    background: ${darken('var(--mantine-color-green-3)', 0.83)};
    border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
  }
`;

const CompactRow = styled.div<SongRowProps>`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: start;
  align-items: center;
  color: rgba(255, 255, 255, 0.88);
  cursor: pointer;
  background: ${({ $coverArt }) =>
    $coverArt
      ? `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(data:image/jpeg;base64,${$coverArt}) no-repeat center center`
      : 'var(--shade-1)'};
  background-size: cover;
  width: 100%;
  min-height: 3rem;
  margin-block: 0.2rem;
  margin-inline: 0.2rem;
  border-radius: 0.4rem;
  transition: all 500ms ease-in-out;
  &:hover {
    background: ${({ $coverArt }) =>
      $coverArt
        ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(data:image/jpeg;base64,${$coverArt}) no-repeat center center`
        : 'var(--shade-2)'};
    background-size: cover;
    /* transform: scale(1.002); */
  }
`;
const CompactSongInfo = styled.div`
  width: 100%;
`;
const CompactDarken = styled.div<DarkenProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding: 0.3rem 0.5rem;
  /* background-color: ${({ $coverArt }) =>
    $coverArt ? 'var(--shade-1)' : ''}; */
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
  padding: 0.6rem;
  word-break: break-all;
  display: inline-flex;
  align-items: center;
  justify-content: start;
  &.title {
    font-size: 0.95rem;
    width: 100%;
    background-color: var(--shade-3);
  }
`;
export default MusicGrid;
