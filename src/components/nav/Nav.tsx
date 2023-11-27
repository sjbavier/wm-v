import { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import webmaneLogo from '../../assets/LionHeadLOGO.svg';

import styled from 'styled-components';
import classNames from 'classnames';
import { AUTH_ACTION } from '../../constants/constants';
import { Color } from '../color/Color';
import { NeuButton } from '../button/NeuButton';
import {
  IconAdjustmentsFilled,
  IconBook2,
  IconBooks,
  IconHomeHeart,
  IconSlideshow,
  IconUserCancel,
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

  const logout = () => {
    dispatchAuth({ type: AUTH_ACTION.LOGOUT });
    navigate('');
  };

  const handleAvatarClick = (): void => {
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
              className="w-full pt-1 pb-1"
              src={webmaneLogo}
              alt="Webmane logo"
              style={{ maxWidth: 'calc(200px / 3)' }}
            />
          </div>
          <h1 className="text-zinc-50 text-center tracking-widest text-xs uppercase -mt-10 mb-8 ">
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
                  className="mt-5 w-full flex items-center justify-end"
                >
                  bookmarks
                  <IconBook2 className="ml-4" />
                </NeuButton>{' '}
                <NeuButton
                  onClick={() => navigate('/reference')}
                  className="mt-5 w-full flex items-center justify-end"
                >
                  reference
                  <IconBooks className="ml-4" />
                </NeuButton>
                <NeuButton
                  onClick={() => navigate('/graphics')}
                  className="mt-5 w-full flex items-center justify-end"
                >
                  Graphics
                  <IconSlideshow className="ml-4" />
                </NeuButton>
              </>
            )}
          </div>

          <UserBox>
            <UserPopUpWrapper
              className={classNames(popUp ? '' : 'invisible collapsed hidden')}
            >
              {!!user && (
                <>
                  <Color
                    className={settings ? '' : 'invisible collapsed hidden'}
                    color={color}
                    setColor={setColor}
                  />
                  <UserItem onClick={logout}>
                    <IconUserCancel />
                    <div>Logout</div>
                  </UserItem>
                  <UserItem onClick={handleSettingsClick}>
                    <div onClick={handleSettingsClick}>
                      <IconAdjustmentsFilled />
                    </div>

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
            <NeuButton
              className=" w-full items-center inline-flex justify-center"
              onClick={handleAvatarClick}
            >
              <UserAvatar />
              {user ? (
                <IconUserFilled className="mr-4" />
              ) : (
                <IconUserQuestion className="mr-4" />
              )}
              {user ? user : 'unknown'}
            </NeuButton>
          </UserBox>
        </NavContainer>
      </NavWrapper>
    </header>
  );
};

const UserAvatar = styled.div``;

const UserItem = styled.div`
  min-width: 50%;
  align-self: center;
  padding: 1.4rem 0;
  justify-self: stretch;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.2s ease-in;
  cursor: pointer;
  &:hover {
    background-color: hsla(0, 0%, 55%, 0.04);
  }
  > div {
    align-self: center;
    align-items: center;
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
  cursor: pointer;
`;

const UserPopUp: FC<DivWrapper> = ({ callback, children, ...rest }) => {
  return <div {...rest}>{children}</div>;
};
const UserPopUpWrapper = styled(UserPopUp)`
  position: absolute;
  justify-content: center;
  bottom: 95px;
  color: #fff;
  width: calc(100% - 64px);
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
  font-size: 145%;
  padding: 2rem;
  background: linear-gradient(
    -45deg,
    hsla(0, 0%, 10%, 0.05) 0%,
    hsla(0, 0%, 30%, 0.08) 100%
  );
  transition: transform 0.4s;
  transition-delay: ${({ isOpen }) => (isOpen ? '0.4s' : '0.2s')};
  transform-origin: 50% 150%;
  transform: ${(props) =>
    props.isOpen
      ? 'translateZ(-400px) rotateY(10deg) translateX(15%)'
      : 'translateZ(-1500px)'};
`;

export default Nav;
