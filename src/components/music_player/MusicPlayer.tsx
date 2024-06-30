import {
  IconPlayerPlayFilled,
  IconPlayerSkipForwardFilled,
  IconPlayerPause,
  IconPlayerSkipBack,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForward
} from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useToggle } from '../../hooks/useToggle';
import useAudio from '../../hooks/useAudio';
import { CloseButton, Input, Slider, TextInput } from '@mantine/core';
import { useThrottledState } from '@mantine/hooks';

interface MusicPlayerProps {
  musicSrc: string;
  song: Song | undefined;
  search: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const MusicPlayer = ({
  musicSrc,
  song,
  search,
  setSearch
}: MusicPlayerProps) => {
  const { isPlaying, toggleIsPlaying, audioRef, handlePlayClick } = useAudio({
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

  const pathLength = song?.path?.split('/')?.length;
  const pathArray = song?.path?.split('/');
  const filename = pathArray?.find((p) => p.includes('.'))?.split('.')[0];
  const artist = song?.artist
    ? song.artist
    : pathLength && pathLength > 3
    ? song?.path?.split('/')[2]
    : 'Unknown';
  const title = song?.title ? song.title : filename;

  // console.log('song', song);
  // console.log('audioRef', audioRef);
  // console.log('currentTime', audioRef?.current?.currentTime);
  // console.log('duration', audioRef?.current?.duration);
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
        <ControlButton>
          <IconPlayerSkipBackFilled />
        </ControlButton>
        <ControlButton>
          <IconPlayerSkipBack />
        </ControlButton>
        <ControlButton className="large" onClick={handlePlayClick}>
          {isPlaying ? <IconPlayerPause /> : <IconPlayerPlayFilled />}
        </ControlButton>
        <ControlButton>
          <IconPlayerSkipForward />
        </ControlButton>
        <ControlButton>
          <IconPlayerSkipForwardFilled />
        </ControlButton>
      </ControlsWrapper>
      <Slider
        style={{ width: '100%', marginTop: '1rem' }}
        size={7}
        min={0}
        max={duration}
        value={currentTime}
        onChange={(value) => {
          console.log('input', value, audioRef?.current?.currentTime);
          handleSliderChange(value);
        }}
      />
      <div style={{ marginTop: '1rem' }}>
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
      </div>
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
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* background: rgba(255, 255, 255, 0.1); */
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.4rem;
  align-items: center;
  z-index: 100;
`;

const SongWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
  color: rgba(255, 255, 255, 0.66);
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.3);
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
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.88);
  }
`;

const AudioPlayer = styled.audio`
  display: none;
`;

export default MusicPlayer;
