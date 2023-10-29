import { useAuth } from './useAuth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { ...auth } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        ...auth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
