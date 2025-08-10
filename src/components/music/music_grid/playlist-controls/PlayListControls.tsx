import { alpha, darken, lighten, Menu } from '@mantine/core';
// import type { MenuProps } from '@mantine/core'; // No longer needed if using styled-components for Menu
import {
  IconMusicPlus,
  IconPlaylist,
  IconPlaylistAdd
} from '@tabler/icons-react';
import styled from 'styled-components';
import Render from '../../../render/Render';

interface IPlayListControls {
  // Assuming Song type is defined elsewhere
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
      <StyledMenu position="left" withArrow>
        <Menu.Target>
          <ControlButton>
            <IconPlaylistAdd />
          </ControlButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconPlaylistAdd />}>
            Add to Current Playlist
          </Menu.Item>
          <Menu.Item
            leftSection={<IconPlaylist />}
            onClick={() =>
              console.log(`Add to Playlist clicked for song: ${song.title}`)
            } // Example handler
          >
            Add to Playlist
          </Menu.Item>
        </Menu.Dropdown>
      </StyledMenu>
    </PlayListControlsContainer>
  );
};

const PlayListControlsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: end;
`;

const StyledMenu = styled(Menu)`
  /*
    IMPORTANT NOTE ON COLOR FUNCTIONS (alpha, lighten, darken):
    Mantine's JS color functions (alpha, lighten, darken) expect actual color values
    (e.g., hex codes, rgb strings) as input, not CSS variable strings like 'var(--mantine-color-green-5)'.
    When used in styled-components like this: \`color: \${lighten('var(--mantine-color-green-5)', 0.1)};\`,
    they will NOT produce the intended color modifications.
    The styles below use CSS variables directly. For effects like opacity or specific shades,
    you'd typically rely on pre-defined CSS variables for those states or use CSS-native properties.
  */

  // Styles for the dropdown panel itself
  .mantine-Menu-dropdown {
    border-width: 1px;
    border-style: solid;
    background: var(--shade-1); // Matches ControlButton background
    // For border-color with opacity, you'd ideally have a CSS var like var(--mantine-color-green-6-alpha-50)
    // or apply opacity to the whole element if that's acceptable.
    // Using the direct color variable here:
    border-color: var(--mantine-color-green-6);
    color: var(
      --mantine-color-green-5
    ); // This will be the direct color, not lightened by JS
  }

  // Styles for individual menu items
  .mantine-Menu-item {
    color: var(--mantine-color-green-5); // Direct color

    // Hover and focus states (Mantine uses data-hovered for keyboard nav)
    &[data-hovered='true'],
    &:hover {
      // These will use the direct CSS variables, attempting to mirror ControlButton's variable choices
      // The actual visual effect of lighten/darken from ControlButton's JS calls won't apply here.
      color: var(
        --mantine-color-green-5
      ); // To make it lighter, you might use var(--mantine-color-green-4)
      background-color: var(
        --mantine-color-green-3
      ); // This is green[3], not a darkened version of it.
      // ControlButton's darken('var(--mantine-color-green-3)', 0.83)
      // aims for a very dark color. To achieve that here, you'd
      // need a CSS variable for that specific dark shade.
    }
  }

  // Styles for the arrow
  .mantine-Menu-arrow {
    // Similar to dropdown border, opacity is tricky with direct CSS vars for borders.
    border-color: var(--mantine-color-green-6);
    background: var(--shade-1); // Match dropdown background
  }
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
