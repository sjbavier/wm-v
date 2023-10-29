// import { notification } from 'antd';
import { useCallback } from 'react';
import { VERBOSITY } from '../constants/constants';

interface INotifications {
  message: string;
  description?: string;
  duration?: number;
}

export function useSetNotifications() {
  const setNotification = useCallback(
    ({ message, description = '', duration = 1.4 }: INotifications) => {
      // notification.open({ message, description, duration });
      console.log('notification: ', { message, description, duration });
    },
    []
  );
  return { setNotification };
}

export const prettyError = (err: Error): string => {
  return err.toString().replace('Error:', '');
};

export function useHandleNotifications() {
  const { setNotification } = useSetNotifications();

  const handleResponse = useCallback(
    ({ response, verbosity }: { response: Response; verbosity?: string }) => {
      const type = !response.ok ? 'Error' : 'Success';
      switch (verbosity) {
        case VERBOSITY.SILENT:
          break;
        case VERBOSITY.NORMAL:
          setNotification({
            message: `${type}: ${response.status}`,
            description: response.statusText.toString()
          });
          break;
        case VERBOSITY.VERBOSE:
          setNotification({
            message: `${type}: ${response.status} ${response.statusText}`,
            description: !response.ok
              ? undefined
              : response.statusText.toString(),
            duration: 10
          });
          break;
        default:
          setNotification({
            message: `${type}: ${response.status}`,
            description: !response.ok
              ? undefined
              : response.statusText.toString()
          });
      }
    },
    [setNotification]
  );
  return {
    handleResponse
  };
}
