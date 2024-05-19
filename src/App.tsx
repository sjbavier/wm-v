import { FC, useContext, useState } from 'react';

import Nav from './components/nav/Nav';

import { AuthContext } from './components/auth/AuthContext';

import styled from 'styled-components';
import { useToggle } from './hooks/useToggle';
import classNames from 'classnames';

import { Loader } from '@mantine/core';
import NavButton from './components/button/NavButton';
import WMRoutes from './routes/wm_routes';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  $isOpen: boolean;
}
const App: FC = () => {
  const { loading } = useContext<IAuthContext>(AuthContext);
  const [isOpen, toggleIsOpen] = useToggle(true);
  const [color, setColor] = useState<string>(
    localStorage.getItem('customColor')?.toString() || ''
  );

  return (
    <PerspectiveWrapper
      color={color}
      className={classNames(
        `h-full w-full fixed perspective-9 ${color ? '' : 'bg-wm_dk_blue-700'}`
      )}
    >
      <NavButton isOpen={isOpen} toggleIsOpen={toggleIsOpen} />
      <Nav isOpen={isOpen} color={color} setColor={setColor} />
      <Container
        onClick={(_) => isOpen && toggleIsOpen()}
        $isOpen={isOpen}
        className={classNames(
          `absolute w-full h-full drop-shadow-sm filter bg-wm_dk_blue-700 ${
            isOpen ? 'brightness-50' : 'brightness-100'
          }`
        )}
      >
        {!loading && <WMRoutes />}
        {loading && <Loader />}
      </Container>
    </PerspectiveWrapper>
  );
};

const PerspectiveWrapper = styled.div`
  background: ${(props) => props.color};
  perspective: 1500px;
`;
const Container = styled.div<ContainerProps>`
  padding-left: 1.25rem;
  transition:
    transform 0.4s,
    background-size 0.4s,
    filter 1.4s;
  cursor: ${({ $isOpen }) => ($isOpen ? 'pointer' : '')};
  overflow: scroll;
  transform-origin: 50% 150%;
  transition-delay: ${({ $isOpen }) => ($isOpen ? '0.2s' : '0.4s')};
  transform: ${(props) =>
    props.$isOpen
      ? 'translateZ(-600px) rotateY(-50deg) translateX(10%)'
      : 'none'};
`;
export default App;
