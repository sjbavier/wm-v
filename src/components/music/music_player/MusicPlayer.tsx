import {
  IconArrowsShuffle,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconPlayerPause,
  IconPlayerPlay,
  IconRepeat,
  IconRepeatOnce,
  IconVolume,
  IconVolume2,
  IconVolumeOff
} from '@tabler/icons-react';
import styled from 'styled-components';
import { Slider, alpha, darken, lighten, AngleSlider } from '@mantine/core';
import { Size } from '../../../hooks/useMediaQuery';
import useMusicContext from '../../../providers/useMusicContext';
import { useEffect, useMemo, useRef, useState } from 'react';

const PLAYER_VOLUME_STORAGE_KEY = 'wm-player-volume';
const PLAYER_MUTED_STORAGE_KEY = 'wm-player-muted';

interface MusicPlayerProps {
  musicSrc: string;
  song: Song | undefined;
}

type RepeatMode = 'off' | 'all' | 'one';

const MusicPlayer = ({ musicSrc, song }: MusicPlayerProps) => {
  const musicContext = useMusicContext() as ReturnType<typeof useMusicContext> & {
    shuffleEnabled?: boolean;
    repeatMode?: RepeatMode;
    toggleShuffle?: () => void;
    cycleRepeatMode?: () => void;
  };
  const {
    screenSize,
    isPlaying,
    audioRef,
    playPlayback,
    pausePlayback,
    currentTime,
    duration,
    marks,
    handleTimeUpdate,
    handleEnded,
    handleLoadedMetadata,
    handleSliderChange,
    formatTime,
    playPreviousTrack,
    playNextTrack,
    hasPreviousTrack,
    hasNextTrack,
    shuffleEnabled,
    repeatMode = 'off',
    toggleShuffle,
    cycleRepeatMode
  } = musicContext;

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const lastAudibleVolumeRef = useRef(1);

  useEffect(() => {
    const storedVolume = window.localStorage.getItem(PLAYER_VOLUME_STORAGE_KEY);
    const storedMuted = window.localStorage.getItem(PLAYER_MUTED_STORAGE_KEY);

    if (storedVolume) {
      const parsedVolume = Number(storedVolume);
      if (!Number.isNaN(parsedVolume)) {
        const clampedVolume = Math.max(0, Math.min(1, parsedVolume));
        setVolume(clampedVolume);
        if (clampedVolume > 0) {
          lastAudibleVolumeRef.current = clampedVolume;
        }
      }
    }

    if (storedMuted) {
      setIsMuted(storedMuted === 'true');
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      audioRef.current.volume = clampedVolume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, audioRef]);

  useEffect(() => {
    window.localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, volume.toString());
  }, [volume]);

  useEffect(() => {
    window.localStorage.setItem(PLAYER_MUTED_STORAGE_KEY, isMuted.toString());
  }, [isMuted]);

  const handleVolumeChange = (angle: number) => {
    const newVolume = angle / 360;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (clampedVolume > 0) {
      lastAudibleVolumeRef.current = clampedVolume;
    }
    setIsMuted(clampedVolume === 0);
  };

  const handleMuteClick = () => {
    if (isMuted) {
      const nextVolume = Math.max(lastAudibleVolumeRef.current, 0.1);
      setVolume(nextVolume);
      setIsMuted(false);
      return;
    }

    if (volume > 0) {
      lastAudibleVolumeRef.current = volume;
    }
    setIsMuted(true);
  };

  const formatVolumeAsAngle = (vol: number) => vol * 360;
  const progressValue = duration > 0 ? Math.min(currentTime, duration) : 0;
  const progressMarks =
    screenSize === Size.SM || screenSize === Size.XS ? undefined : marks;
  const volumePercent = useMemo(
    () => Math.round((isMuted ? 0 : volume) * 100),
    [isMuted, volume]
  );
  const canGoPrevious = Boolean(playPreviousTrack) && hasPreviousTrack !== false;
  const canGoNext = Boolean(playNextTrack) && hasNextTrack !== false;
  const isMobile =
    screenSize === Size.XS || screenSize === Size.SM;
  const handlePrimaryPlaybackClick = () => {
    if (isPlaying) {
      pausePlayback?.();
      return;
    }

    playPlayback?.();
  };

  const pathLength = song?.path?.split('/')?.length;
  const pathArray = song?.path?.split('/') || [];
  const filename = pathArray?.find((p) => p.includes('.'))?.split('.')[0];
  const extension = pathArray
    ?.find((p) => p.includes('.'))
    ?.split('.')
    ?.pop()
    ?.toUpperCase();
  const artist = song?.artist
    ? song.artist
    : pathLength && pathLength > 3
      ? song?.path?.split('/')[2]
      : 'Unknown';
  const title = song?.title ? song.title : filename;
  const album =
    song?.album ||
    (pathArray.length > 1 ? pathArray[pathArray.length - 2] : '') ||
    'Unsorted release';
  const genre = song?.genre || 'Unknown genre';
  const releaseYear = song?.release_year || '----';
  const sourceLabel = extension ? `${extension} file` : 'Library track';

  return (
    <AudioPlayerContainer>
      <SongWrapper>
        <TrackMeta>
          <SongInfoChunk className="eyebrow">Now playing</SongInfoChunk>
          <SongInfoChunk className="title">{title || 'Select a track'}</SongInfoChunk>
          <SongInfoChunk className="artist">{artist}</SongInfoChunk>
          <MetadataStrip>
            <MetadataPill>
              <MetadataLabel>Album</MetadataLabel>
              <MetadataValue>{album}</MetadataValue>
            </MetadataPill>
            <MetadataPill>
              <MetadataLabel>Source</MetadataLabel>
              <MetadataValue>{sourceLabel}</MetadataValue>
            </MetadataPill>
          </MetadataStrip>
        </TrackMeta>
        <TrackFacts>
          <TrackFactCard>
            <TrackFactValue>{genre}</TrackFactValue>
            <TrackFactLabel>Genre</TrackFactLabel>
          </TrackFactCard>
          <TrackFactCard>
            <TrackFactValue>{releaseYear}</TrackFactValue>
            <TrackFactLabel>Year</TrackFactLabel>
          </TrackFactCard>
        </TrackFacts>
      </SongWrapper>

      <ControlsWrapper>
        <ControlsContainer>
          <TimelineWrapper>
            <TimelineHeader>
              <TimelineTime>{formatTime(progressValue)}</TimelineTime>
              <TimelineLabel>{isPlaying ? 'Playing' : 'Paused'}</TimelineLabel>
              <TimelineTime>{formatTime(duration)}</TimelineTime>
            </TimelineHeader>
            <StyledSlider
              min={0}
              max={duration || 0}
              value={progressValue}
              label={formatTime}
              size={2}
              marks={progressMarks}
              thumbSize={
                screenSize === Size.SM || screenSize === Size.XS ? 10 : 15
              }
              onChange={handleSliderChange}
            />
          </TimelineWrapper>
          <AudioPlayer
            src={musicSrc}
            ref={audioRef}
            onEnded={() => handleEnded?.()}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          >
            does not support audio playback
          </AudioPlayer>
        </ControlsContainer>
        <PlayerActions>
          <TransportControls>
            <ModeButton
              type="button"
              $active={Boolean(toggleShuffle) && Boolean(shuffleEnabled)}
              onClick={toggleShuffle}
              aria-label={
                shuffleEnabled ? 'Disable shuffle playback' : 'Enable shuffle playback'
              }
              disabled={!toggleShuffle}
            >
              <IconArrowsShuffle stroke="1" />
            </ModeButton>
            <ControlButton
              type="button"
              className="small"
              onClick={playPreviousTrack}
              aria-label="Play previous track"
              disabled={!canGoPrevious}
            >
              <IconPlayerSkipBack stroke="1" />
            </ControlButton>
            <ControlButton
              type="button"
              className="large"
              onClick={handlePrimaryPlaybackClick}
              aria-label={isPlaying ? 'Pause playback' : 'Play track'}
            >
              {isPlaying ? (
                <IconPlayerPause stroke="1" />
              ) : (
                <IconPlayerPlay stroke="1" />
              )}
            </ControlButton>
            <ControlButton
              type="button"
              className="small"
              onClick={playNextTrack}
              aria-label="Play next track"
              disabled={!canGoNext}
            >
              <IconPlayerSkipForward stroke="1" />
            </ControlButton>
            <ModeButton
              type="button"
              $active={repeatMode !== 'off'}
              onClick={cycleRepeatMode}
              aria-label={`Repeat mode: ${repeatMode}`}
              disabled={!cycleRepeatMode}
            >
              {repeatMode === 'one' ? (
                <IconRepeatOnce stroke="1" />
              ) : (
                <IconRepeat stroke="1" />
              )}
            </ModeButton>
          </TransportControls>
          <VolumeControls>
            <VolumeReadout>{volumePercent}%</VolumeReadout>
            <StyledAngleSlider
              step={1}
              size={isMobile ? 56 : 65}
              value={formatVolumeAsAngle(isMuted ? 0 : volume)}
              onChange={handleVolumeChange}
              formatLabel={(value) => `${Math.round(value / 3.6)}`}
              thumbSize={isMobile ? 13 : 15}
            />
            <ControlButton
              type="button"
              className="small"
              onClick={handleMuteClick}
              aria-label={isMuted || volume === 0 ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted || volume === 0 ? (
                <IconVolumeOff stroke="1" />
              ) : volume > 0.5 ? (
                <IconVolume stroke="1" />
              ) : (
                <IconVolume2 stroke="1" />
              )}
            </ControlButton>
          </VolumeControls>
        </PlayerActions>
      </ControlsWrapper>
    </AudioPlayerContainer>
  );
};

const AudioPlayerContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.9rem 1rem 1rem;
  align-items: center;
  backdrop-filter: blur(16px);

  @media screen and (max-width: 960px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.85rem;
    padding: 0.85rem 0.85rem 1rem;
    border-radius: 1.25rem;
    border: 1px solid ${alpha('var(--mantine-color-green-9)', 0.14)};
    background: linear-gradient(
      180deg,
      ${alpha('#000', 0.2)} 0%,
      ${alpha('#000', 0.38)} 100%
    );
    box-shadow:
      0 14px 40px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 ${alpha('#fff', 0.04)};
  }
`;

const SongWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex: 0 0 22rem;
  min-width: 0;

  @media screen and (max-width: 960px) {
    flex: 1;
  }

  @media screen and (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TrackMeta = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const TrackFacts = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 0.5rem;

  @media screen and (max-width: 640px) {
    align-items: flex-start;
  }
`;

const MetadataStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.15rem;
`;

const MetadataPill = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 0.12rem;
  min-width: 0;
  padding: 0.45rem 0.6rem;
  border-radius: 0.85rem;
  border: 1px solid ${alpha('var(--mantine-color-green-9)', 0.14)};
  background: linear-gradient(
    180deg,
    ${alpha('#000', 0.14)} 0%,
    ${alpha('#000', 0.24)} 100%
  );
  box-shadow: inset 0 1px 0 ${alpha('#fff', 0.04)};
`;

const MetadataLabel = styled.div`
  font-size: 0.64rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
`;

const MetadataValue = styled.div`
  max-width: 14rem;
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.84);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackFactCard = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
  min-width: 5.2rem;
  padding: 0.55rem 0.7rem;
  border-radius: 0.95rem;
  border: 1px solid ${alpha('var(--mantine-color-green-9)', 0.14)};
  background: linear-gradient(
    180deg,
    ${alpha('#000', 0.14)} 0%,
    ${alpha('#000', 0.28)} 100%
  );
  box-shadow: inset 0 1px 0 ${alpha('#fff', 0.04)};

  @media screen and (max-width: 640px) {
    align-items: flex-start;
  }
`;

const TrackFactValue = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

const TrackFactLabel = styled.div`
  font-size: 0.64rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.46);
`;

const SongInfoChunk = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.66);

  &.eyebrow {
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${lighten('var(--mantine-color-green-8)', 0.2)};
  }

  &.title {
    font-size: 1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.94);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.artist {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ControlsWrapper = styled.div`
  display: inline-flex;
  justify-content: center;
  flex: 1;
  align-items: center;
  gap: 1rem;

  @media screen and (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
`;

const PlayerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-left: 1rem;

  @media screen and (max-width: 960px) {
    margin-left: 0;
    justify-content: space-between;
  }

  @media screen and (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.65rem;
  }
`;

const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
  padding: 0.75rem 1rem;
  border: 1px solid ${alpha('var(--mantine-color-green-6)', 0.25)};
  border-radius: 1rem;
  background: linear-gradient(
    180deg,
    ${alpha('#000', 0.16)} 0%,
    ${alpha('#000', 0.32)} 100%
  );
  box-shadow: inset 0 1px 0 ${alpha('#fff', 0.04)};

  @media screen and (max-width: 640px) {
    padding: 0.8rem 0.9rem;
    border-radius: 1.1rem;
  }
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
`;

const TimelineTime = styled.div`
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.76rem;
  min-width: 2.5rem;
`;

const TimelineLabel = styled.div`
  color: ${lighten('var(--mantine-color-green-8)', 0.18)};
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-weight: 700;
  border-width: 1px;
  border-style: solid;
  background: var(--shade-1);
  border-color: ${alpha('var(--mantine-color-green-6)', 0.5)};
  color: ${lighten('var(--mantine-color-green-5)', 0.1)};
  transition:
    transform 150ms ease,
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    opacity 150ms ease;

  & > svg {
    width: 1.2rem;
    height: 1.2rem;
  }

  &.large {
    width: 55px;
    height: 55px;

    @media screen and (max-width: 768px) {
      width: 52px;
      height: 52px;
    }

    & > svg {
      width: 1.4rem;
      height: 1.4rem;

      @media screen and (max-width: 768px) {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }

  &.small {
    width: 35px;
    height: 35px;
  }

  &:hover {
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
    background: ${darken('var(--mantine-color-green-3)', 0.83)};
    border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    transform: none;
  }
`;

const ModeButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active }) =>
      $active
        ? alpha('var(--mantine-color-green-5)', 0.88)
        : alpha('var(--mantine-color-green-6)', 0.35)};
  background: ${({ $active }) =>
    $active
      ? darken('var(--mantine-color-green-3)', 0.82)
      : 'var(--shade-1)'};
  color: ${({ $active }) =>
    $active
      ? lighten('var(--mantine-color-green-4)', 0.16)
      : lighten('var(--mantine-color-green-5)', 0.1)};
  cursor: pointer;
  transition:
    transform 150ms ease,
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    opacity 150ms ease;

  &:hover {
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
    background: ${darken('var(--mantine-color-green-3)', 0.83)};
    border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.35;
    transform: none;
  }

  & > svg {
    width: 1rem;
    height: 1rem;
  }
`;

const StyledSlider = styled(Slider)`
  width: 100%;

  .mantine-Slider-track {
    background-color: ${alpha('#fff', 0.08)};
  }

  .mantine-Slider-bar {
    background-color: ${alpha('var(--mantine-color-green-6)', 0.88)};

    &:hover {
      background-color: ${alpha('var(--mantine-color-green-6)', 0.66)};
    }
  }

  .mantine-Slider-thumb {
    border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    box-shadow: 0 0 0 4px ${alpha('var(--mantine-color-green-9)', 0.15)};
  }

  .mantine-Slider-markLabel {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.65rem;
  }
`;

const AudioPlayer = styled.audio`
  display: none;
`;

const VolumeControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  border: 1px solid ${alpha('var(--mantine-color-green-9)', 0.14)};
  background: linear-gradient(
    180deg,
    ${alpha('#000', 0.14)} 0%,
    ${alpha('#000', 0.28)} 100%
  );

  @media screen and (max-width: 640px) {
    justify-content: space-between;
  }
`;

const TransportControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  border: 1px solid ${alpha('var(--mantine-color-green-9)', 0.14)};
  background: linear-gradient(
    180deg,
    ${alpha('#000', 0.14)} 0%,
    ${alpha('#000', 0.28)} 100%
  );

  @media screen and (max-width: 640px) {
    justify-content: space-between;
  }
`;

const VolumeReadout = styled.div`
  min-width: 2.6rem;
  text-align: right;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
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

  .mantine-AngleSlider-thumb {
    &::before {
      background-color: ${alpha('var(--mantine-color-green-6)', 0.66)};
    }
  }
`;

export default MusicPlayer;
