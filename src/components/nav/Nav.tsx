import { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';
import { AuthContext } from '../auth/AuthContext';
import webmaneLogo from '../../assets/LionHeadLOGO.svg';

import styled from 'styled-components';
import classNames from 'classnames';
import { AUTH_ACTION } from '../../constants/constants';
import { Color } from '../color/Color';
import { NeuButton } from '../button/NeuButton';
import {
  IconHomeHeart,
  IconUserCircle,
  IconUserFilled,
  IconUserQuestion
} from '@tabler/icons-react';
import { IconUserPlus } from '@tabler/icons-react';

interface NavProps {
  isOpen: boolean | (() => void);
  // toggleIsOpen: React.MouseEventHandler<HTMLDivElement> | undefined;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

interface NavContainerProps {
  isOpen: boolean | (() => void);
}
const Nav: FC<NavProps> = ({
  // toggleIsOpen,
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

  return (
    <header>
      <NavWrapper
        className={classNames(
          'flex h-screen flex-col flex-wrap transition-all duration-150 fixed w-[33%]'
        )}
      >
        <NavContainer isOpen={isOpen} className="flex flex-col h-full">
          <div
            className="flex justify-center items-center cursor-pointer"
            onClick={() => navigate('')}
          >
            <img
              className="w-full pt-6 pb-1"
              src={webmaneLogo}
              alt="Webmane logo"
              style={{ maxWidth: 'calc(200px / 3)' }}
            />
          </div>
          <h1 className="text-zinc-50 text-center tracking-widest text-xs uppercase ">
            webmane
          </h1>
          <div className="grow ">
            <NeuButton
              onClick={() => navigate('')}
              className="mt-5 w-full flex items-center justify-end"
            >
              home
              <IconHomeHeart className="ml-4" />
            </NeuButton>
            {!!user && (
              <>
                <NeuButton
                  onClick={() => navigate('/bookmarks/page/1/page_size/10')}
                  className="w-full flex items-center "
                >
                  bookmarks
                </NeuButton>{' '}
                <NeuButton
                  onClick={() => navigate('/reference')}
                  className="w-full flex items-center "
                >
                  reference
                </NeuButton>
                <NeuButton
                  onClick={() => navigate('/graphics')}
                  className="w-full flex items-center "
                >
                  Graphics
                </NeuButton>
              </>
            )}
          </div>

          <UserBox>
            <UserPopUpWrapper
              className={classNames(
                'w-full',
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
                    <IconUserCircle />
                    <div>Login</div>
                  </UserItem>
                  <UserItem onClick={() => navigate('/Signup')}>
                    <IconUserPlus />
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
              <UserText className="inline-flex">
                {user ? user : 'unknown'}
                {user ? (
                  <IconUserFilled className="ml-4" />
                ) : (
                  <IconUserQuestion className="ml-4" />
                )}
              </UserText>
              <UserButton />
            </div>
          </UserBox>
        </NavContainer>
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
  font-size: 1.3rem;
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

const NavWrapper = styled.div`
  perspective: 1500px;
`;
const NavContainer = styled.div<NavContainerProps>`
  transition: transform 0.4s;
  transition-delay: ${({ isOpen }) => (isOpen ? '0.2s' : '50ms')};
  transform-origin: 50% 150%;
  transform: ${(props) =>
    props.isOpen ? 'translateZ(-150px) rotateY(30deg)' : 'none'};
`;

export default Nav;
