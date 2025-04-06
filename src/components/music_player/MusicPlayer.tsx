import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import styled from 'styled-components';
import { Slider, alpha, darken, lighten } from '@mantine/core';
import MusicSearch from './MusicSearch';
import { Size } from '../../hooks/useMediaQuery';
import useMusicContext from '../../providers/useMusicContext';

interface MusicPlayerProps {
  musicSrc: string;
  song: Song | undefined;
  search: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const MusicPlayer = ({ musicSrc, song }: MusicPlayerProps) => {
  const {
    screenSize,
    isPlaying,
    audioRef,
    handlePlayClick,
    currentTime,
    duration,
    marks,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSliderChange,
    formatTime
  } = useMusicContext();

  const pathLength = song?.path?.split('/')?.length;
  const pathArray = song?.path?.split('/');
  const filename = pathArray?.find((p) => p.includes('.'))?.split('.')[0];
  const artist = song?.artist
    ? song.artist
    : pathLength && pathLength > 3
    ? song?.path?.split('/')[2]
    : 'Unknown';
  const title = song?.title ? song.title : filename;

  return (
    <AudioPlayerContainer>
      <SongWrapper>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="d-flex flex-col">
            <SongInfoChunk className="artist">{artist}</SongInfoChunk>
            <SongInfoChunk className="title">{title}</SongInfoChunk>
          </div>
        </div>
        <div className="d-flex flex-col">
          <SongInfoChunk>{song?.genre ? song.genre : 'None'}</SongInfoChunk>
          <SongInfoChunk>
            {song?.release_year ? song.release_year : '----'}
          </SongInfoChunk>
        </div>
      </SongWrapper>

      <ControlsWrapper>
        <ControlsContainer>
          {/* <ControlButton>
          <IconPlayerSkipBackFilled />
        </ControlButton>
        <ControlButton>
          <IconPlayerSkipBack />
        </ControlButton> */}
          {/* <ControlButton>
          <IconPlayerSkipForward />
        </ControlButton>
        <ControlButton>
          <IconPlayerSkipForwardFilled />
        </ControlButton> */}
          <MusicSearch />
          <StyledSlider
            min={0}
            max={duration}
            value={currentTime}
            label={formatTime}
            labelAlwaysOn
            size={2}
            marks={marks}
            thumbSize={
              screenSize === Size.SM || screenSize === Size.XS ? '20' : '10'
            }
            onChange={(value) => {
              handleSliderChange(value);
            }}
          />
          <AudioPlayer
            src={musicSrc}
            controls
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          >
            doesn't work
          </AudioPlayer>
        </ControlsContainer>
        <ControlButton className="large" onClick={handlePlayClick}>
          {isPlaying ? (
            <IconPlayerPause stroke={`1`} />
          ) : (
            <IconPlayerPlay stroke={`1`} />
          )}
        </ControlButton>
      </ControlsWrapper>
    </AudioPlayerContainer>
  );
};
const AudioPlayerContainer = styled.div`
  width: 100%;
  display: flex;
  /* flex-direction: column; */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1rem;
  align-items: center;
`;

const SongWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  width: 100%;
  margin-right: 2.4rem;
`;
const SongInfoChunk = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.66);
  &.title {
    font-size: 1rem;
    font-weight: 500;
  }
`;

const ControlsWrapper = styled.div`
  display: inline-flex;
  justify-content: center;
  flex: 1;
  /* flex-direction: column; */
  align-items: center;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: end;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const ControlButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  margin-left: 1.4rem;
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
  &.large {
    @media screen and (max-width: 768px) {
      width: 55px;
      height: 55px;
    }
    width: 55px;
    height: 55px;
    & > svg {
      @media screen and (max-width: 768px) {
        width: 1.6rem;
        height: 1.6rem;
      }
      width: 1.4rem;
      height: 1.4rem;
    }
  }
  &:hover {
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
    background: ${darken('var(--mantine-color-green-3)', 0.83)};
    border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
  }
`;

const StyledSlider = styled(Slider)`
  width: 100%;
  margin-block: 1rem;
  .mantine-Slider-bar {
    background-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    &:hover {
      background-color: ${alpha('var(--mantine-color-green-6)', 0.66)};
    }
  }
  .mantine-Slider-thumb {
    border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
  }
`;

const AudioPlayer = styled.audio`
  display: none;
`;

export default MusicPlayer;
