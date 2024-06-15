import {
  IconPlayerPlayFilled,
  IconPlayerSkipForwardFilled,
  IconPlayerPause,
  IconPlayerSkipBack,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForward
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useToggle } from '../../hooks/useToggle';
import useAudio from '../../hooks/useAudio';
import { Slider } from '@mantine/core';

interface MusicPlayerProps {
  musicSrc: string;
  song: Song | undefined;
}

const MusicPlayer = ({ musicSrc, song }: MusicPlayerProps) => {
  const { isPlaying, toggleIsPlaying, audioRef, handlePlayClick } = useAudio({
    musicSrc
  });
  const [currentTime, setCurrentTime] = useState(0);
  console.log('audioRef', audioRef);
  console.log('currentTime', audioRef?.current?.currentTime);
  console.log('duration', audioRef?.current?.duration);
  useEffect(() => {
    if (audioRef?.current?.currentTime)
      audioRef.current.currentTime = currentTime;
  }, [audioRef, currentTime]);
  return (
    <AudioPlayerContainer>
      <SongWrapper>
        <div className="d-flex flex-col">
          <SongInfoChunk>
            {song?.artist ? song.artist : 'Unknown'}
          </SongInfoChunk>
          <SongInfoChunk className="title">
            {song?.title ? song.title : song?.path?.split('/')[2].split('.')[0]}
          </SongInfoChunk>
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
        defaultValue={audioRef?.current?.currentTime || 0}
        size={7}
        min={0}
        max={audioRef?.current?.duration}
        value={audioRef?.current?.currentTime}
        // value={
        //   audioRef?.current?.currentTime
        //     ? parseFloat(audioRef.current?.currentTime)
        //     : 0
        // }
        onChange={(value) => {
          console.log('input', value, audioRef?.current?.currentTime);
          setCurrentTime(value);
        }}
      />
      <AudioPlayer src={musicSrc} controls ref={audioRef}>
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
