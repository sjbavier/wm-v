import { alpha, darken, lighten } from '@mantine/core';
import { IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import styled from 'styled-components';
import useElementHeight from '../../hooks/useElementHeight';
import useMusicContext from '../../providers/useMusicContext';
import { Layout } from '../../constants/constants';

interface LayoutOptionsProps {
  $height?: number;
}
const LayoutOptions = () => {
  const [ref, height] = useElementHeight();
  const { setLayout } = useMusicContext();
  return (
    <LayoutOptionsContainer ref={ref} $height={height}>
      <div onClick={() => setLayout && setLayout(Layout.GRID)}>
        <IconLayoutGrid stroke={`1`} />
      </div>
      <div onClick={() => setLayout && setLayout(Layout.ROW)}>
        <IconLayoutList stroke={`1`} />
      </div>
    </LayoutOptionsContainer>
  );
};
const LayoutOptionsContainer = styled.div<LayoutOptionsProps>`
  display: inline-flex;
  position: relative;
  cursor: pointer;
  margin-left: 1rem;
  & > div {
    background: var(--shade-1);
    border-color: ${alpha('var(--mantine-color-green-6)', 0.5)};
    color: ${lighten('var(--mantine-color-green-5)', 0.1)};
    padding: 0.3rem;
    &:hover {
      color: ${lighten('var(--mantine-color-green-5)', 0.3)};
      background: ${darken('var(--mantine-color-green-3)', 0.83)};
      border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    }
    @media screen and (max-width: 768px) {
      & > svg {
        height: 20px;
        width: 20px;
      }
    }
  }
`;

export default LayoutOptions;
