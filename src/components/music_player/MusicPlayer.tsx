import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { useState } from 'react';
import styled from 'styled-components';
import useAudio from '../../hooks/useAudio';
import {
  CloseButton,
  Input,
  Slider,
  alpha,
  darken,
  lighten
} from '@mantine/core';
import { useThrottledState } from '@mantine/hooks';
import LayoutOptions from '../music_grid/LayoutOptions';

interface MusicPlayerProps {
  musicSrc: string;
  song: Song | undefined;
  search: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

// Helper function to format time in seconds to mm:ss
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Helper function to parse mm:ss to seconds
// const parseTime = (time: string): number => {
//   const [minutes, seconds] = time.split(':').map(Number);
//   return minutes * 60 + seconds;
// };

const MusicPlayer = ({
  musicSrc,
  song,
  search,
  setSearch: setSearchText,
  setPage
}: MusicPlayerProps) => {
  const { isPlaying, audioRef, handlePlayClick } = useAudio({
    musicSrc
  });
  const [currentTime, setCurrentTime] = useThrottledState(0, 1000);
  const [duration, setDuration] = useState(0);
  const [marks, setMarks] = useState<
    | {
        value: number;
        label?: React.ReactNode;
      }[]
    | undefined
  >(undefined);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      requestAnimationFrame(handleTimeUpdate);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setMarks([
        {
          value: Math.floor(audioRef.current.duration / 4),
          label: `${formatTime(Math.floor(audioRef.current.duration / 4))}`
        },
        {
          value: Math.floor(audioRef.current.duration / 2),
          label: `${formatTime(Math.floor(audioRef.current.duration / 2))}`
        },
        {
          value: Math.floor((audioRef.current.duration / 4) * 3),
          label: `${formatTime(
            Math.floor((audioRef.current.duration / 4) * 3)
          )}`
        },
        {
          value: audioRef.current.duration,
          label: `${formatTime(audioRef.current.duration)}`
        }
      ]);
    }
  };

  const handleSliderChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const setSearch = (searchText: string) => {
    setSearchText(searchText);
    setPage(0);
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
        <div className="d-flex flex-col">
          <SongInfoChunk className="artist">{artist}</SongInfoChunk>
          <SongInfoChunk className="title">{title}</SongInfoChunk>
        </div>
        <div className="d-flex flex-col">
          <SongInfoChunk>{song?.genre ? song.genre : 'None'}</SongInfoChunk>
          <SongInfoChunk>
            {song?.release_year ? song.release_year : '----'}
          </SongInfoChunk>
        </div>
      </SongWrapper>

      <ControlsWrapper>
        {/* <ControlButton>
          <IconPlayerSkipBackFilled />
        </ControlButton>
        <ControlButton>
          <IconPlayerSkipBack />
        </ControlButton> */}
        <ControlButton className="large" onClick={handlePlayClick}>
          {isPlaying ? (
            <IconPlayerPause stroke={`1`} />
          ) : (
            <IconPlayerPlay stroke={`1`} />
          )}
        </ControlButton>
        {/* <ControlButton>
          <IconPlayerSkipForward />
        </ControlButton>
        <ControlButton>
          <IconPlayerSkipForwardFilled />
        </ControlButton> */}
      </ControlsWrapper>
      <StyledSlider
        min={0}
        max={duration}
        value={currentTime}
        label={formatTime}
        labelAlwaysOn
        size={2}
        marks={marks}
        thumbSize={25}
        onChange={(value) => {
          handleSliderChange(value);
        }}
      />
      <SearchWrapper>
        <Input
          placeholder="search"
          value={search}
          variant="unstyled"
          onChange={(event) => setSearch(event.currentTarget.value)}
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => setSearch('')}
              style={{ display: search ? undefined : 'none' }}
            />
          }
        />
      </SearchWrapper>
      <AudioPlayer
        src={musicSrc}
        controls
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      >
        doesn't work
      </AudioPlayer>
      <LayoutOptions />
    </AudioPlayerContainer>
  );
};
const AudioPlayerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.4rem;
  align-items: center;
`;

const SongWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const SearchWrapper = styled.div`
  margin-top: 1rem;
  & input {
    /* background-color: var(--shade-1) !important; */
    /* background-color: transparent !important; */
    /* color: #fff; */
    padding: 0.7rem;
    border-radius: 1rem;
    background: ${darken('var(--mantine-color-green-3)', 0.88)};
    border-width: 1px;
    border-color: ${alpha('var(--mantine-color-green-6)', 0.5)};
    color: ${lighten('var(--mantine-color-green-5)', 0.1)};
  }
`;
const SongInfoChunk = styled.div`
  color: rgba(255, 255, 255, 0.66);
  &.title {
    font-size: 1.4rem;
    font-weight: 500;
  }
`;

const ControlsWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;

const ControlButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  margin-inline: 0.4rem;
  border-radius: 50%;
  font-weight: 700;
  border-width: 1px;
  background: ${darken('var(--mantine-color-green-3)', 0.88)};
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
    width: 75px;
    height: 75px;
    & > svg {
      @media screen and (max-width: 768px) {
        width: 1.6rem;
        height: 1.6rem;
      }
      width: 2rem;
      height: 2rem;
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
