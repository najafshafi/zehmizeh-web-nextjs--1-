import { useAuth } from '@/helpers/contexts/auth-context';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

export const useIsLoginAsUser = () => {
  const { token: loginAsUsertoken } = queryString.parse(window.location.search);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  const signOutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    auth.setUser(null);
  };

  const loginHandler = async () => {
    if (!loginAsUsertoken) return setLoading(false);
    try {
      signOutUser();
      await auth.signin(loginAsUsertoken);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loginHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading };
};
