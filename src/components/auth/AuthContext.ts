import React from 'react';
import { IAuthContext } from '../../models/global';

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);
