import { darken, lighten } from '@mantine/core';
import { IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import styled from 'styled-components';
import useElementHeight from '../../hooks/useElementHeight';

interface LayoutOptionsProps {
  $height?: number;
}
const LayoutOptions = () => {
  const [ref, height] = useElementHeight();
  return (
    <LayoutOptionsContainer ref={ref} $height={height}>
      <div>
        <IconLayoutGrid stroke={`1`} />
      </div>
      <div>
        <IconLayoutList stroke={`1`} />
      </div>
    </LayoutOptionsContainer>
  );
};
const LayoutOptionsContainer = styled.div<LayoutOptionsProps>`
  display: inline-flex;
  position: absolute;
  bottom: ${({ $height }) => `-${$height ? Math.floor($height) : '0'}px`};
  left: 0;
  & > div {
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
    background: ${darken('var(--mantine-color-green-3)', 0.83)};
    padding: 0.3rem;
    @media screen and (max-width: 768px) {
      & > svg {
        height: 20px;
        width: 20px;
      }
    }
  }
`;

export default LayoutOptions;
