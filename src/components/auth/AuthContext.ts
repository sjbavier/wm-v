import React from 'react';
import { IAuthContext } from '../../global';

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);
