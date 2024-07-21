import { IconPlayerPlayFilled, IconPlayerPause } from '@tabler/icons-react';
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

interface MusicPlayerProps {
  musicSrc: string;
  song: Song | undefined;
  search: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

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
  const [currentTime, setCurrentTime] = useThrottledState(0, 300);
  const [duration, setDuration] = useState(0);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      requestAnimationFrame(handleTimeUpdate);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
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
          {isPlaying ? <IconPlayerPause /> : <IconPlayerPlayFilled />}
        </ControlButton>
        {/* <ControlButton>
          <IconPlayerSkipForward />
        </ControlButton>
        <ControlButton>
          <IconPlayerSkipForwardFilled />
        </ControlButton> */}
      </ControlsWrapper>
      <StyledSlider
        // style={{ width: '100%', marginTop: '1rem' }}
        size={7}
        min={0}
        max={duration}
        value={currentTime}
        onChange={(value) => {
          handleSliderChange(value);
        }}
      />
      <SearchWrapper>
        <Input
          placeholder="search"
          value={search}
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
    background-color: transparent !important;
    color: #fff;
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
    width: 75px;
    height: 75px;
    & > svg {
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
  margin-top: 1rem;
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
