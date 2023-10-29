import { FC, useContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Nav from './components/nav/Nav';
// import PrivateRoute from './components/auth/PrivateRoute';

import { AuthContext } from './components/auth/AuthContext';

import styled from 'styled-components';
import { useToggle } from './hooks/useToggle';
import classNames from 'classnames';
import { IAuthContext } from './models/global';

import LoginForm from './views/LoginForm';
// import SignupForm from './views/SignupForm';
// import Bookmarks from './views/Bookmarks';
// import GraphicsContainer from './views/GraphicsContainer';
// import Reference from './views/Reference';
import { Loader } from '@mantine/core';

const App: FC = () => {
  const { loading } = useContext<IAuthContext>(AuthContext);
  const [isOpen, toggleIsOpen] = useToggle(true);
  const [color, setColor] = useState<string>(
    localStorage.getItem('customColor')?.toString() || '#191b22'
  );

  return (
    <div id="app_wrapper" className="h-screen overflow-hidden">
      <LayoutWrapper color={color}>
        <Nav
          toggleIsOpen={toggleIsOpen}
          isOpen={isOpen}
          color={color}
          setColor={setColor}
        />
        <div
          className={classNames(
            'transition-all duration-150 h-screen w-full pl-16 justify-between bg-black/10',
            isOpen ? 'ml-[240px]' : 'ml-0'
          )}
        >
          {!loading && (
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              {/* <Route path="/login" element={<LoginForm />} /> */}
              {/* <Route path="/signup" element={<SignupForm />} /> */}
              {/* <Route
                path="/bookmarks/page/:page/page_size/:pageSize"
                element={
                  <PrivateRoute>
                    <div className="flex flex-wrap flex-row h-full overflow-y-auto">
                      <Bookmarks />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/reference"
                element={
                  <PrivateRoute>
                    <Reference />
                  </PrivateRoute>
                }
              />

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
        </div>
      </LayoutWrapper>
    </div>
  );
};

const LayoutWrapper = styled.div`
  display: flex;
  flex: auto;
  flex-direction: row;
  box-sizing: border-box;
  min-height: 0;
  background: ${(props) => props.color};
`;
export default App;
