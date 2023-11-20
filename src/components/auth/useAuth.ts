import { useCallback, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useClient from '../../hooks/useClient';
import { useSetNotifications } from '../../hooks/useNotifications';
import { PERMISSION } from '../../lib/Permissions';
import {
  IAuthAction,
  IAuthContext,
  IAuthState,
  TAuthResponse,
  TRequest
} from '../../global';
import { AUTH_ACTION, VERBOSITY } from '../../constants/constants';
// export type TAuthResponse = {
//   userId: number;
//   user: string;
//   role: string;
//   message: string;
//   msg?: string;
// };

// export interface IAuthState {
//   userId?: string;
//   user?: string;
//   scopes?: string[];
//   token?: string;
//   error?: string;
//   loading?: boolean;
// }

// export interface IAuthAction {
//   type: string;
//   payload?: IAuthState;
// }

// export const enum AUTH_ACTION {
//   LOGIN = 'LOGIN',
//   LOGOUT = 'LOGOUT',
//   FETCHING = 'FETCHING',
//   ERROR = 'ERROR'
// }

// export interface IAuthContext extends IAuthState {
//   fetchUser: any;
//   dispatchAuth: any;
// }

export const initialState: IAuthState = {
  userId: undefined,
  user: undefined,
  scopes: undefined,
  token: localStorage.getItem('token')?.toString() || '',
  error: undefined,
  loading: false
};

const authReducer = (state: IAuthState, action: IAuthAction) => {
  switch (action.type) {
    case AUTH_ACTION.LOGIN:
      return {
        error: undefined,
        loading: false,
        user: action?.payload?.user,
        userId: action?.payload?.userId,
        token: action?.payload?.token,
        scopes: action?.payload?.scopes
      };
    case AUTH_ACTION.LOGOUT:
      return {
        error: undefined,
        loading: false,
        user: undefined,
        userId: undefined,
        token: '',
        scopes: undefined
      };
    case AUTH_ACTION.FETCHING:
      return {
        ...state,
        loading: true,
        error: undefined
      };
    case AUTH_ACTION.ERROR:
      return {
        ...state,
        loading: false,
        error: action?.payload?.error
      };
    default:
      return {
        ...state
      };
  }
};

export const useAuth = () => {
  const [authState, dispatchAuth] = useReducer(authReducer, initialState);
  const {
    user,
    userId,
    scopes,
    token,
    loading: authLoading,
    error: authError
  } = authState;
  const { setNotification } = useSetNotifications();
  const { fetchMe, statusCode } = useClient(VERBOSITY.NORMAL);
  const navigate = useNavigate();

  // syncs redux token state to localstorage
  useEffect(() => {
    let mounted = true;
    const setLocalToken = (token: string) => {
      localStorage.setItem('token', token);
    };

    if (mounted) {
      setLocalToken(token || '');
    }
    return () => {
      mounted = false;
    };
  }, [token]);

  const fetchUser = useCallback(async () => {
    if (!!token) {
      const request: TRequest = {
        method: 'GET',
        path: '/auth/authorize',
        token
      };

      dispatchAuth({ type: AUTH_ACTION.FETCHING });

      fetchMe<TAuthResponse>(request)
        .then((response: TAuthResponse) => {
          if (statusCode === 401) {
            dispatchAuth({ type: AUTH_ACTION.LOGOUT });
            navigate('/login');
          }
          if (response.user) {
            dispatchAuth({
              type: AUTH_ACTION.LOGIN,
              payload: {
                user: response.user,
                userId: response.userId.toString(),
                scopes: PERMISSION[response.role.toUpperCase()],
                token
              }
            });
          } else {
            dispatchAuth({
              type: AUTH_ACTION.LOGOUT
            });

            setNotification({
              message: 'Error',
              description: `${response.msg}`
            });
          }
        })
        .catch((err) => {
          dispatchAuth({ type: AUTH_ACTION.ERROR });
          setNotification({
            message: 'Error',
            description: `${err}`
          });
        });
    }
  }, [token, setNotification, fetchMe, statusCode, navigate]);

  useEffect(() => {
    let mounted = true;
    if (!!token && !user && mounted) {
      fetchUser();
    }
    return () => {
      mounted = false;
    };
  }, [user, token, fetchUser]);

  const auth: IAuthContext = {
    dispatchAuth,
    userId,
    user,
    scopes,
    token,
    error: authError,
    loading: authLoading,
    fetchUser
  };

  return auth;
};
