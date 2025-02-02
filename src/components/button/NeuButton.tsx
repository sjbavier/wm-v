import classNames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';
interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  props?: React.ComponentPropsWithoutRef<'button'>;
  children?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
}
export const NeuButton = ({
  props,
  children,
  className,
  onClick
}: NeuButtonProps) => {
  return (
    <NeurButton
      className={classNames('text-zinc-50', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </NeurButton>
  );
};
const NeurButton = styled.button<NeuButtonProps>`
  font-size: 1.2em;
  padding: 0.4rem 0.8rem;
  border-radius: 0px;
  border: transparent;
  cursor: pointer;
  &:hover {
    background: linear-gradient(
      -45deg,
      hsla(0, 0%, 50%, 0.1) 0%,
      hsla(0, 0%, 50%, 0.1) 100%
    );
  }
  background: hsla(0, 0%, 50%, 0.05) 100%;
`;
