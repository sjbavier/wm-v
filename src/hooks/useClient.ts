import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/auth/AuthContext';
import { useHandleNotifications } from './useNotifications';
import { IAuthContext, TRequest } from '../models/global';
import { AUTH_ACTION } from '../constants/constants';

// const apiErrors = {
//     401: 'Unauthorized',
//     403: 'Forbidden',
//     404: 'Does not exist',
//     409: 'Request did not succeed',
//     422: 'Token is malformed',
//     500: 'Server error'
// }

export default function useClient(verbosity?: string) {
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<Number>(0);

  const navigate = useNavigate();

  const { token, dispatchAuth } = useContext<IAuthContext>(AuthContext);
  const { handleResponse } = useHandleNotifications();

  const fetchMe = useCallback(
    async <T>(request: TRequest): Promise<T> => {
      setLoading(true);

      var headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      let authToken = request?.token ? request.token : token;

      if (authToken) headers.append('Authorization', `Bearer ${authToken}`);

      const reqOptions = {
        method: request.method,
        headers: headers,
        body: JSON.stringify(request.data) || undefined
      };

      return fetch(`${request.path}`, reqOptions).then((response) => {
        if (!response.ok) {
          //   Error Notifications
          if (statusCode === 401) {
            dispatchAuth({ type: AUTH_ACTION.LOGOUT });
            navigate('/login');
          }
          setError(true);
          setLoading(false);
          setStatusCode(response.status);
          handleResponse({ response, verbosity });
          return response.json() as Promise<T>;
        } else {
          // success notifications
          setSuccess(true);
          setLoading(false);
          handleResponse({ response, verbosity });

          return response.json() as Promise<T>;
        }
      });
    },
    [token, verbosity, handleResponse, dispatchAuth, navigate, statusCode]
  );

  return {
    fetchMe,
    loading,
    error,
    success,
    statusCode
  };
}
