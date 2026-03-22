import { alpha, darken, lighten } from '@mantine/core';
import { IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';
import styled from 'styled-components';
import useMusicContext from '../../../providers/useMusicContext';
import { Layout } from '../../../constants/constants';

interface LayoutOptionsProps {
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
  value?: Layout;
  onChange?: (layout: Layout) => void;
}

const LayoutOptions = ({
  className,
  style,
  compact = false,
  value,
  onChange
}: LayoutOptionsProps) => {
  const { layout, setLayout } = useMusicContext();
  const activeLayout = value ?? layout;

  const handleLayoutChange = (nextLayout: Layout) => {
    if (onChange) {
      onChange(nextLayout);
      return;
    }

    setLayout && setLayout(nextLayout);
  };

  return (
    <LayoutOptionsContainer className={className} style={style} $compact={compact}>
      <LayoutToggle
        type="button"
        $active={activeLayout === Layout.GRID}
        onClick={() => handleLayoutChange(Layout.GRID)}
        aria-label="Switch to grid layout"
        aria-pressed={activeLayout === Layout.GRID}
      >
        <IconLayoutGrid stroke={`1`} />
      </LayoutToggle>
      <LayoutToggle
        type="button"
        $active={activeLayout === Layout.ROW}
        onClick={() => handleLayoutChange(Layout.ROW)}
        aria-label="Switch to row layout"
        aria-pressed={activeLayout === Layout.ROW}
      >
        <IconLayoutList stroke={`1`} />
      </LayoutToggle>
    </LayoutOptionsContainer>
  );
};

const LayoutOptionsContainer = styled.div<{ $compact?: boolean }>`
  display: inline-flex;
  position: relative;
  margin-left: 0;
  gap: 0.35rem;
  align-items: center;
  justify-content: flex-end;
`;

const LayoutToggle = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${({ $active }) =>
    $active
      ? darken('var(--mantine-color-green-3)', 0.82)
      : 'var(--shade-1)'};
  border: 1px solid
    ${({ $active }) =>
      $active
        ? alpha('var(--mantine-color-green-5)', 0.9)
        : alpha('var(--mantine-color-green-6)', 0.5)};
  color: ${({ $active }) =>
    $active
      ? lighten('var(--mantine-color-green-4)', 0.15)
      : lighten('var(--mantine-color-green-5)', 0.1)};
  padding: 0.38rem;
  border-radius: 999px;
  box-shadow: ${({ $active }) =>
    $active ? `0 0 0 4px ${alpha('var(--mantine-color-green-9)', 0.14)}` : 'none'};
  transition:
    color 150ms ease,
    background-color 150ms ease,
    border-color 150ms ease,
    transform 150ms ease,
    box-shadow 150ms ease;

  &:hover {
    color: ${lighten('var(--mantine-color-green-5)', 0.3)};
    background: ${darken('var(--mantine-color-green-3)', 0.83)};
    border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    transform: translateY(-1px);
  }

  @media screen and (max-width: 768px) {
    & > svg {
      height: 20px;
      width: 20px;
    }
  }
`;

export default LayoutOptions;
