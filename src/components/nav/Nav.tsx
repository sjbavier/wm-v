import { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { AuthContext } from '../auth/AuthContext';
// import webmaneLogo from '../../img/LionHeadLOGO.svg';

import styled from 'styled-components';
import classNames from 'classnames';
import { AUTH_ACTION } from '../../constants/constants';
import { DivWrapper, IAuthContext } from '../../models/global';
import { Color } from '../color/Color';

interface NavProps {
  isOpen: boolean | (() => void);
  toggleIsOpen: React.MouseEventHandler<HTMLButtonElement> | undefined;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

const Nav: FC<NavProps> = ({
  toggleIsOpen,
  isOpen,
  color,
  setColor
}: NavProps) => {
  const navigate = useNavigate();
  const { user, dispatchAuth } = useContext<IAuthContext>(AuthContext);
  const [popUp, setPopUp] = useState<boolean>(false);
  const [settings, setSettings] = useState<boolean>(false);

  const logout = (_ev: React.MouseEvent<HTMLDivElement>) => {
    dispatchAuth({ type: AUTH_ACTION.LOGOUT });
    navigate('');
  };

  const handleAvatarClick = (_ev: React.MouseEvent<HTMLDivElement>): void => {
    setPopUp(!popUp);
  };

  const handleSettingsClick = (_ev: React.MouseEvent<HTMLDivElement>): void => {
    setSettings(!settings);
  };

  const hamburgLine =
    'h-0.5 w-6 my-1 rounded-full bg-white transition-all duration-150 delay-200';

  return (
    <header>
      <Button
        onClick={toggleIsOpen}
        className={classNames(
          'fixed top-7 z-10 flex flex-col h-12 w-12 justify-center items-center group transition-all duration-150',
          isOpen ? 'left-[172px]' : 'left-1'
        )}
      >
        <div
          className={classNames(
            hamburgLine,
            isOpen
              ? 'rotate-45 translate-y-[10px] opacity-50 group-hover:opacity-100'
              : 'opacity-50 group-hover:opacity-100'
          )}
        ></div>
        <div
          className={classNames(
            hamburgLine,
            isOpen ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'
          )}
        ></div>
        <div
          className={classNames(
            hamburgLine,
            isOpen
              ? '-rotate-45 -translate-y-[10px] opacity-50 group-hover:opacity-100'
              : 'opacity-50 group-hover:opacity-100'
          )}
        ></div>
      </Button>
      <NavWrapper
        className={classNames(
          'flex h-screen flex-col flex-wrap transition-all duration-150 fixed w-[220px]',
          isOpen ? 'ml-0' : '-ml-[230px]'
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className="flex justify-center items-center cursor-pointer"
            onClick={() => navigate('')}
          >
            <img
              className="w-full pt-6 pb-3"
              // src={webmaneLogo}
              alt="Webmane logo"
              style={{ maxWidth: 'calc(200px / 4)' }}
            />
          </div>
          <h1 className="text-zinc-50 text-center tracking-widest text-xs">
            webmane
          </h1>
          <div className="grow ">
            <Button
              onClick={() => navigate('')}
              className="mt-5 w-full flex items-center "
            >
              home
            </Button>
            {!!user && (
              <>
                <Button
                  onClick={() => navigate('/bookmarks/page/1/page_size/10')}
                  className="w-full flex items-center "
                >
                  bookmarks
                </Button>{' '}
                <Button
                  onClick={() => navigate('/reference')}
                  className="w-full flex items-center "
                >
                  reference
                </Button>
                <Button
                  onClick={() => navigate('/graphics')}
                  className="w-full flex items-center "
                >
                  Graphics
                </Button>
              </>
            )}
          </div>

          <UserBox>
            <UserPopUpWrapper
              className={classNames(
                'w-[220px]',
                popUp ? '' : 'invisible collapsed hidden'
              )}
            >
              {!!user && (
                <>
                  <Color
                    className={settings ? '' : 'invisible collapsed hidden'}
                    color={color}
                    setColor={setColor}
                  />
                  <UserItem onClick={logout}>
                    <div>user</div>
                    <div>Logout</div>
                  </UserItem>
                  <UserItem onClick={handleSettingsClick}>
                    <div onClick={handleSettingsClick}>settings</div>
                    <div>Settings</div>
                  </UserItem>
                </>
              )}
              {!user && (
                <>
                  <UserItem onClick={() => navigate('/login')}>
                    <div>user avatar</div>
                    <div>Login</div>
                  </UserItem>
                  <UserItem onClick={() => navigate('/Signup')}>
                    <div>add user</div>
                    <div>Signup</div>
                  </UserItem>
                </>
              )}
            </UserPopUpWrapper>
            <div
              className="flex items-center justify-between w-full p-2"
              onClick={handleAvatarClick}
            >
              <UserAvatar />
              <UserText>{user ? user : 'unknown'}</UserText>
              <UserButton />
            </div>
          </UserBox>
        </div>
      </NavWrapper>
    </header>
  );
};

const UserAvatar = styled.div``;

const UserText = styled.div`
  color: #fff;
`;

const UserButton = styled(Button)`
  background: none;
  color: #fff;
  border: none;
  align-self: center;
  /* margin-left: auto; */
`;

const UserItem = styled.div`
  min-width: 50%;
  align-self: center;
  justify-self: stretch;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.2s ease-in;
  height: 3.31rem;
  cursor: pointer;
  &:hover {
    background-color: hsla(0, 0%, 55%, 0.04);
  }
  > div {
    align-self: center;
    align-items: center;
    font-size: 0.9em;
    color: #fff;
  }
`;

const UserBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  user-select: none;
  border-radius: 0px;
  border: transparent;
  background: linear-gradient(
    -45deg,
    hsla(0, 0%, 0%, 0.1) 0%,
    hsla(0, 0%, 50%, 0.1) 100%
  );
  box-shadow: 6px 6px 7px hsla(0, 0%, 0%, 0.3);
  cursor: pointer;
  &:hover {
    background-color: hsla(0, 0%, 55%, 0.04);
  }
`;

const UserPopUp: FC<DivWrapper> = ({ callback, children, ...rest }) => {
  return <div {...rest}>{children}</div>;
};
const UserPopUpWrapper = styled(UserPopUp)`
  position: absolute;
  justify-content: center;
  bottom: 53px;
  color: #fff;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  transition: opacity 0.2s ease-in;

  &.collapsed {
    opacity: 0;
  }
  &:nth-child(odd) .user_item {
    border-right: 1px solid hsla(0, 0%, 55%, 0.1);
  }
`;

const NavWrapper = styled.div``;

export default Nav;
