import { FC, useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Nav from './components/nav/Nav';
// import PrivateRoute from './components/auth/PrivateRoute';

import { AuthContext } from './components/auth/AuthContext';

import styled from 'styled-components';
import { useToggle } from './hooks/useToggle';
import classNames from 'classnames';

// import LoginForm from './views/LoginForm';
// import SignupForm from './views/SignupForm';
// import Bookmarks from './views/Bookmarks';
// import GraphicsContainer from './views/GraphicsContainer';
// import Reference from './views/Reference';
import { Loader } from '@mantine/core';
import NavButton from './components/button/NavButton';
import { LoginContainer } from './views';
import PrivateRoute from './components/auth/PrivateRoute';
import ReferenceContainer from './views/ReferenceContainer';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
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
      <Nav
        // toggleIsOpen={toggleIsOpen}
        isOpen={isOpen}
        color={color}
        setColor={setColor}
      />
      <Container
        isOpen={isOpen}
        className={classNames(
          `absolute w-full h-full drop-shadow-sm filter bg-wm_dk_blue-700 ${
            isOpen ? 'brightness-50' : 'brightness-100'
          }`
        )}
      >
        {!loading && (
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/login" element={<LoginContainer />} />
            {/* <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/bookmarks/page/:page/page_size/:pageSize"
              element={
                <PrivateRoute>
                  <div className="flex flex-wrap flex-row h-full overflow-y-auto">
                    <Bookmarks />
                  </div>
                </PrivateRoute>
              }
            />
            */}

            {/* <Route
              path="/reference"
              element={
                <PrivateRoute>
                  <ReferenceContainer />
                </PrivateRoute>
              }
            /> */}
            {/*
            <Route
              path="/graphics"
              element={
                <PrivateRoute>
                  <GraphicsContainer />
                </PrivateRoute>
              }
            /> */}
            <Route path="*" element={<div>404 nothing here</div>} />
          </Routes>
        )}
        {loading && <Loader />}
      </Container>
    </PerspectiveWrapper>
    // <div id="app_wrapper" className="h-screen overflow-hidden">
    //   <LayoutWrapper color={color}>
    //     <Nav
    //       toggleIsOpen={toggleIsOpen}
    //       isOpen={isOpen}
    //       color={color}
    //       setColor={setColor}
    //     />
    //     <div
    //       className={classNames(
    //         'transition-all duration-150 h-screen w-full pl-16 justify-between bg-black/10',
    //         isOpen ? 'ml-[240px]' : 'ml-0'
    //       )}
    //     >
    //       {!loading && (
    //         <Routes>
    //           <Route path="/" element={<div>Home</div>} />
    //           <Route path="/login" element={<LoginForm />} />
    //           <Route path="/signup" element={<SignupForm />} />
    //           <Route
    //             path="/bookmarks/page/:page/page_size/:pageSize"
    //             element={
    //               <PrivateRoute>
    //                 <div className="flex flex-wrap flex-row h-full overflow-y-auto">
    //                   <Bookmarks />
    //                 </div>
    //               </PrivateRoute>
    //             }
    //           />
    //           <Route
    //             path="/reference"
    //             element={
    //               <PrivateRoute>
    //                 <Reference />
    //               </PrivateRoute>
    //             }
    //           />

    //           <Route
    //             path="/graphics"
    //             element={
    //               <PrivateRoute>
    //                 <GraphicsContainer />
    //               </PrivateRoute>
    //             }
    //           />
    //           <Route path="*" element={<div>404 nothing here</div>} />
    //         </Routes>
    //       )}
    //       {loading && <Loader />}
    //     </div>
    //   </LayoutWrapper>
    // </div>
  );
};

// const LayoutWrapper = styled.div`
//   display: flex;
//   flex: auto;
//   flex-direction: row;
//   box-sizing: border-box;
//   min-height: 0;
//   background: ${(props) => props.color};
// `;
const PerspectiveWrapper = styled.div`
  background: ${(props) => props.color};
  perspective: 1500px;
`;
const Container = styled.div<ContainerProps>`
  /* background: linear-gradient(
    -45deg,
    hsla(0, 0%, 30%, 0.08) 0%,
    hsla(0, 0%, 10%, 0.08) 100%
  ); */
  transition:
    transform 0.4s,
    background-size 0.4s,
    filter 1.4s;
  transform-origin: 50% 150%;
  transition-delay: ${({ isOpen }) => (isOpen ? '0.2s' : '0.4s')};
  transform: ${(props) =>
    props.isOpen
      ? 'translateZ(-600px) rotateY(-50deg) translateX(10%)'
      : 'none'};
`;
export default App;
