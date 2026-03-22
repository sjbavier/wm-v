import styled from 'styled-components';
import Render from '../../render/Render';
import { Size } from '../../../hooks/useMediaQuery';
import { useMemo } from 'react';
import useMusicContext from '../../../providers/useMusicContext';
import { Layout } from '../../../constants/constants';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { alpha, darken, lighten } from '@mantine/core';
import PlayListControls from './playlist-controls/PlayListControls';

interface MusicGridProps {
  data: undefined | Song[];
  setSong: React.Dispatch<React.SetStateAction<Song | undefined>>;
}
interface SongRowProps {
  $col?: string;
  $coverArt?: string;
  $isSelected?: boolean;
  $isPlaying?: boolean;
}
interface DarkenProps {
  $coverArt?: string;
  $isSelected?: boolean;
  $isPlaying?: boolean;
}

interface SongPresentation {
  artist: string;
  title: string;
  album: string;
  genre: string;
  releaseYear: string;
  sourceLabel: string;
}

const getSongPresentation = (song: Song): SongPresentation => {
  const pathArray = song?.path?.split('/') || [];
  const pathLength = pathArray.length;
  const filename = pathArray.find((segment) => segment.includes('.'))?.split('.')[0];
  const artist =
    song?.artist || (pathLength > 3 ? pathArray[2] : '') || 'Unknown artist';
  const album =
    song?.album || (pathLength > 4 ? pathArray[pathLength - 2] : '') || 'Unknown album';
  const title = song?.title || filename || 'Untitled track';
  const genre = song?.genre || 'Genre unknown';
  const releaseYear = song?.release_year || 'Year unknown';
  const sourceExtension = song?.path?.split('.').pop()?.toUpperCase();
  const sourceLabel = sourceExtension ? `${sourceExtension} source` : 'Library file';

  return {
    artist,
    title,
    album,
    genre,
    releaseYear,
    sourceLabel
  };
};

const MusicGrid = ({ data, setSong }: MusicGridProps) => {
  const {
    screenSize,
    layout,
    isPlaying,
    playPlayback,
    pausePlayback,
    resetPlayback,
    song,
    selectSong
  } = useMusicContext();

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
  const handleTrackSelect = (nextSong: Song) => {
    if (selectSong) {
      selectSong(nextSong);
      return;
    }

    setSong(nextSong);
  };

  const handleTrackPlay = (nextSong: Song) => {
    const isCurrentTrack = song?.id === nextSong.id;

    if (isCurrentTrack) {
      if (isPlaying) {
        pausePlayback?.();
        return;
      }

      playPlayback?.();
      return;
    }

    if (selectSong) {
      selectSong(nextSong, { autoplay: true });
      return;
    }

    setSong(nextSong);
    resetPlayback?.({ autoplay: true });
  };

  return (
    <Render if={Array.isArray(data) && data.length > 0}>
      <MusicGridContainer>
        {data?.map((s: Song) => {
          const isSelected = song?.id === s.id;
          const isCurrentTrack = isSelected && isPlaying;
          const { artist, title, album, genre, releaseYear, sourceLabel } =
            getSongPresentation(s);
          return (
            <SongEntry key={s?.id?.toString()}>
              <Render if={layout === Layout.GRID}>
                <SongRow
                  onClick={() => handleTrackSelect(s)}
                  $col={columnPercentage}
                  $coverArt={s?.cover_art}
                  $isSelected={isSelected}
                  $isPlaying={isCurrentTrack}
                >
                  <Darken
                    $coverArt={s?.cover_art}
                    $isSelected={isSelected}
                    $isPlaying={isCurrentTrack}
                  >
                    <SongInfoChunk>{artist}</SongInfoChunk>
                    <SongInfoChunk className="title">
                      <TitleRow>
                        <ControlButton
                          className="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleTrackPlay(s);
                          }}
                          aria-label={
                            isCurrentTrack
                              ? isPlaying
                                ? 'Pause selected track'
                                : 'Play selected track'
                              : 'Play this track'
                          }
                        >
                          {isCurrentTrack ? (
                            <IconPlayerPause stroke={`1`} />
                          ) : (
                            <IconPlayerPlay stroke={`1`} />
                          )}
                        </ControlButton>

                        <TitleText>{title}</TitleText>
                        <StateChip $isPlaying={isCurrentTrack}>
                          {isCurrentTrack
                            ? 'playing'
                            : isSelected
                            ? 'selected'
                            : ''}
                        </StateChip>
                      </TitleRow>
                    </SongInfoChunk>
                    <AlbumLine>{album}</AlbumLine>

                    <SongMetaData>
                      <SongMetaDetails>
                        <MetaChip>{genre}</MetaChip>
                        <MetaChip>{releaseYear}</MetaChip>
                        <MetaChip>{sourceLabel}</MetaChip>
                      </SongMetaDetails>
                      <PlayListControls compact song={s} style={{ marginLeft: 'auto' }} />
                    </SongMetaData>
                  </Darken>
                </SongRow>
              </Render>
              <Render if={layout === Layout.ROW}>
                <CompactRow
                  onClick={() => handleTrackSelect(s)}
                  $col={columnPercentage}
                  $coverArt={s?.cover_art}
                  $isSelected={isSelected}
                  $isPlaying={isCurrentTrack}
                >
                  <CompactDarken
                    $coverArt={s?.cover_art}
                    $isSelected={isSelected}
                    $isPlaying={isCurrentTrack}
                  >
                    <ControlButton
                      className="large"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleTrackPlay(s);
                      }}
                      aria-label={
                        isCurrentTrack
                          ? isPlaying
                            ? 'Pause selected track'
                            : 'Play selected track'
                          : 'Play this track'
                      }
                    >
                      {isCurrentTrack ? (
                        <IconPlayerPause stroke={`1`} />
                      ) : (
                        <IconPlayerPlay stroke={`1`} />
                      )}
                    </ControlButton>
                    <RowMeta>
                      <CompactSongInfo className="artist" $isPlaying={isCurrentTrack}>
                        {artist}
                      </CompactSongInfo>
                      <CompactSongInfo className="title" $isPlaying={isCurrentTrack}>
                        {title}
                      </CompactSongInfo>
                      <CompactSongInfo className="album" $isPlaying={isCurrentTrack}>
                        {album}
                      </CompactSongInfo>
                    </RowMeta>
                    <RowMetaTrail>
                      <MetaChip>{genre}</MetaChip>
                      <MetaChip>{releaseYear}</MetaChip>
                      <MetaChip>{sourceLabel}</MetaChip>
                    </RowMetaTrail>
                    <StateChip $isPlaying={isCurrentTrack}>
                      {isCurrentTrack
                        ? 'playing'
                        : isSelected
                          ? 'selected'
                          : ''}
                    </StateChip>
                    <PlaylistRail>
                      <PlayListControls compact style={{ marginLeft: 'auto' }} song={s} />
                    </PlaylistRail>
                  </CompactDarken>
                </CompactRow>
              </Render>
            </SongEntry>
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
  flex-wrap: wrap;
  width: 100%;
  margin-top: auto;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
`;
const SongMetaDetails = styled.div`
  display: inline-flex;
  gap: 0.2rem;
  flex-wrap: wrap;
`;
const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 0.25rem;
`;
const TitleText = styled.div`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const AlbumLine = styled.div`
  width: 100%;
  padding-inline: 0.9rem;
  padding-bottom: 0.55rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.72);
`;
const SongEntry = styled.div`
  width: 100%;
`;
const SongRow = styled.div<SongRowProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  cursor: pointer;
  background: ${({ $coverArt }) =>
    $coverArt
      ? `url(data:image/jpeg;base64,${$coverArt}) no-repeat center center`
      : 'var(--shade-1)'};
  background-size: cover;
  border: 1px solid
    ${({ $isPlaying, $isSelected }) =>
      $isPlaying
        ? alpha('var(--mantine-color-green-4)', 0.95)
        : $isSelected
        ? alpha('var(--mantine-color-green-6)', 0.6)
        : 'transparent'};
  color: rgba(255, 255, 255, 0.88);
  width: ${({ $col }) => `calc(${$col} - 2rem)`};
  margin: 1rem;
  border-radius: 0.6rem;
  box-shadow: ${({ $isPlaying, $isSelected }) =>
    $isPlaying
      ? `0 0 0 1px ${alpha('var(--mantine-color-green-4)', 0.5)}, 0 18px 32px rgba(0, 0, 0, 0.3)`
      : $isSelected
      ? `0 0 0 1px ${alpha('var(--mantine-color-green-7)', 0.25)}`
      : 'none'};
  transition:
    transform 150ms ease-in-out,
    box-shadow 150ms ease-in-out,
    border-color 150ms ease-in-out;
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
      min-width: 35px;
      min-height: 35px;
    }
    min-width: 45px;
    min-height: 45px;
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
  border: 1px solid
    ${({ $isPlaying, $isSelected }) =>
      $isPlaying
        ? alpha('var(--mantine-color-green-4)', 0.95)
        : $isSelected
        ? alpha('var(--mantine-color-green-6)', 0.6)
        : 'transparent'};
  width: 100%;
  min-height: 3rem;
  margin-block: 0.2rem;
  margin-inline: 0.2rem;
  border-radius: 0.4rem;
  box-shadow: ${({ $isPlaying, $isSelected }) =>
    $isPlaying
      ? `0 0 0 1px ${alpha('var(--mantine-color-green-4)', 0.45)}, 0 12px 24px rgba(0, 0, 0, 0.24)`
      : $isSelected
      ? `0 0 0 1px ${alpha('var(--mantine-color-green-7)', 0.25)}`
      : 'none'};
  transition: all 180ms ease-in-out;
  &:hover {
    background: ${({ $coverArt }) =>
      $coverArt
        ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(data:image/jpeg;base64,${$coverArt}) no-repeat center center`
        : 'var(--shade-2)'};
    background-size: cover;
    /* transform: scale(1.002); */
  }
`;
const CompactSongInfo = styled.div<{ $isPlaying?: boolean }>`
  width: 100%;
  color: ${({ $isPlaying }) =>
    $isPlaying ? 'var(--mantine-color-green-0)' : 'inherit'};

  &.artist {
    font-size: 0.78rem;
    color: ${({ $isPlaying }) =>
      $isPlaying ? 'var(--mantine-color-green-0)' : 'rgba(255, 255, 255, 0.72)'};
  }

  &.title {
    font-size: 0.98rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.96);
  }

  &.album {
    font-size: 0.76rem;
    color: rgba(255, 255, 255, 0.6);
  }
`;
const RowMeta = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
  flex: 1;

  @media screen and (max-width: 960px) {
    min-width: min(16rem, 100%);
  }
`;
const RowMetaTrail = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const PlaylistRail = styled.div`
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;

  @media screen and (max-width: 960px) {
    margin-left: 0;
  }
`;
const CompactDarken = styled.div<DarkenProps>`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0.3rem 0.5rem;
  gap: 0.6rem;
  background: ${({ $isPlaying, $isSelected }) =>
    $isPlaying
      ? 'linear-gradient(90deg, rgba(37, 186, 107, 0.22), rgba(0, 0, 0, 0.2))'
      : $isSelected
      ? 'linear-gradient(90deg, rgba(37, 186, 107, 0.12), rgba(0, 0, 0, 0.12))'
      : 'transparent'};

  @media screen and (max-width: 960px) {
    flex-wrap: wrap;
    align-items: flex-start;
  }
`;
const Darken = styled.div<DarkenProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background: ${({ $coverArt, $isPlaying, $isSelected }) => {
    if ($isPlaying) {
      return 'linear-gradient(180deg, rgba(37, 186, 107, 0.12), rgba(0, 0, 0, 0.42))';
    }
    if ($isSelected) {
      return 'linear-gradient(180deg, rgba(37, 186, 107, 0.08), rgba(0, 0, 0, 0.32))';
    }
    return $coverArt ? 'var(--shade-1)' : '';
  }};
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
const MetaChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.74);
  font-size: 0.66rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;
const StateChip = styled.div<{ $isPlaying?: boolean }>`
  margin-left: auto;
  margin-right: 0.4rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.62rem;
  color: ${({ $isPlaying }) =>
    $isPlaying ? 'var(--mantine-color-green-0)' : 'rgba(255, 255, 255, 0.76)'};
  background: ${({ $isPlaying }) =>
    $isPlaying
      ? alpha('var(--mantine-color-green-6)', 0.85)
      : 'rgba(255, 255, 255, 0.1)'};
`;
export default MusicGrid;
