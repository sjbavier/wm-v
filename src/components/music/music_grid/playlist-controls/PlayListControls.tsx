import { alpha, darken, lighten, Menu } from '@mantine/core';
import { IconMusicPlus, IconPlaylistAdd } from '@tabler/icons-react';
import styled from 'styled-components';
import Render from '../../../render/Render';

interface IPlayListControls {
  song: Song;
  currentPlayList?: string;
  style: React.CSSProperties;
}
const PlayListControls = ({
  song,
  currentPlayList,
  style
}: IPlayListControls) => {
  return (
    <PlayListControlsContainer style={style}>
      <Render if={!!currentPlayList}>
        <ControlButton>
          <IconMusicPlus onClick={(_e) => console.log(_e)} />
        </ControlButton>
      </Render>
      <Menu>
        <Menu.Target>
          <ControlButton>
            <IconPlaylistAdd />
          </ControlButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconPlaylistAdd />}>
            Add to Current Playlist
          </Menu.Item>
          <Menu.Item>Add to Existing Playlist</Menu.Item>
          <Menu.Item>Create and Add to New Playlist</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </PlayListControlsContainer>
  );
};

const PlayListControlsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: end;
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

export default PlayListControls;
