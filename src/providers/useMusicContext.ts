import React, { useContext } from 'react';
import { Size } from '../hooks/useMediaQuery';
import { Layout } from '../constants/constants';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MusicContextProps {
  screenSize?: Size;
  search?: string | undefined;
  setSearch?: React.Dispatch<React.SetStateAction<string | undefined>>;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  song?: Song | undefined;
  setSong?: React.Dispatch<React.SetStateAction<Song | undefined>>;
  layout?: Layout | undefined;
  setLayout?: React.Dispatch<React.SetStateAction<Layout | undefined>>;
}

const MusicContext = React.createContext<MusicContextProps>({});

export const MusicContextProvider = MusicContext.Provider;
export function useMusicContext() {
  return useContext(MusicContext);
}
export default useMusicContext;
