import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { IAuthContext } from '../../global';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token, error, user, loading } = useContext<IAuthContext>(AuthContext);
  let location = useLocation();

  if (!token && loading) {
    return <div>Loading</div>;
  } else if (!token && !user && !loading) {
    return (
      <Navigate
        to={`/login?redirectTo=${location.pathname}`}
        state={{ from: location, error }}
      />
    );
  } else {
    return children;
  }
};

export default PrivateRoute;
