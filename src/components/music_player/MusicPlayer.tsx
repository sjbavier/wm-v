import {
  IconPlayerPause,
  IconPlayerPlay,
  IconVolume,
  IconVolume2,
  IconVolumeOff
} from '@tabler/icons-react';
import styled from 'styled-components';
import { Slider, alpha, darken, lighten, AngleSlider } from '@mantine/core';
import MusicSearch from './MusicSearch';
import { Size } from '../../hooks/useMediaQuery';
import useMusicContext from '../../providers/useMusicContext';
import { useEffect, useState } from 'react';

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

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      audioRef.current.volume = clampedVolume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, audioRef]);

  const handleVolumeChange = (angle: number) => {
    // Convert the angle (0-360) to a volume (0-1)
    const newVolume = angle / 360;
    // Ensure the value is within the valid range [0, 1]
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (clampedVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleMuteClick = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  // Function to format the volume as an angle for the AngleSlider
  const formatVolumeAsAngle = (vol: number) => {
    return vol * 360;
  };

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
            size={2}
            marks={marks}
            thumbSize={
              screenSize === Size.SM || screenSize === Size.XS ? '10' : '15'
            }
            onChange={(value) => {
              handleSliderChange(value);
            }}
          />
          <AudioPlayer
            src={musicSrc}
            controls
            ref={audioRef}
            // only needed to trigger state update
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          >
            doesn't work
          </AudioPlayer>
        </ControlsContainer>
        <VolumeControls>
          <StyledAngleSlider
            step={1} // Adjust step as needed for finer control
            size={65}
            value={formatVolumeAsAngle(volume)}
            onChange={handleVolumeChange}
            formatLabel={(value) => `${Math.round(value / 3.6)}`}
            thumbSize={15}
          />
          <ControlButton className="small" onClick={handleMuteClick}>
            {isMuted || volume === 0 ? (
              <IconVolumeOff stroke={`1`} />
            ) : volume > 0.5 ? (
              <IconVolume stroke={`1`} />
            ) : (
              <IconVolume2 stroke={`1`} />
            )}
          </ControlButton>
          <ControlButton className="large" onClick={handlePlayClick}>
            {isPlaying ? (
              <IconPlayerPause stroke={`1`} />
            ) : (
              <IconPlayerPlay stroke={`1`} />
            )}
          </ControlButton>
        </VolumeControls>
      </ControlsWrapper>
    </AudioPlayerContainer>
  );
};
const AudioPlayerContainer = styled.div`
  width: 100%;
  display: flex;
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
  &.small {
    width: 35px;
    height: 35px;
    & > svg {
      width: 1.2rem;
      height: 1.2rem;
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

const VolumeControls = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  gap: 0.5rem;
`;

const StyledAngleSlider = styled(AngleSlider)`
  cursor: pointer;
  background: var(--shade-1);
  border-width: 1px;
  border-color: ${alpha('var(--mantine-color-green-6)', 0.5)};
  color: ${lighten('var(--mantine-color-green-5)', 0.1)};
  &:hover {
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
    background: ${darken('var(--mantine-color-green-3)', 0.83)};
    border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    .mantine-AngleSlider-thumb {
      &::before {
        background-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
      }
    }
  }
  /* .mantine-AngleSlider-track {
    background-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
  } */
  .mantine-AngleSlider-thumb {
    &::before {
      background-color: ${alpha('var(--mantine-color-green-6)', 0.66)};
    }
  }
`;

export default MusicPlayer;
