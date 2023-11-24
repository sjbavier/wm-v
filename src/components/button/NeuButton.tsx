import classNames from 'classnames';
import { FC } from 'react';
import styled from 'styled-components';

// export const NeuButton: FC<DivWrapper> = ({ props, children, className }) => {
//   return (
//     <NeurButton className={classNames('text-zinc-50', className)} {...props}>
//       {children}
//     </NeurButton>
//   );
// };
export const NeuButton = styled.div`
  font-size: 1.4em;
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
