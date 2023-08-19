import { useUser } from 'providers/UserProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const AuthWrapper = ({ children, nonAuth = false }) => {
  const nav = useNavigate();
  const { user, error, loading } = useUser();

  useEffect(() => {
    if (!user && !loading && !error && !nonAuth) {
      nav('/login');
    } else if (user && nonAuth) {
      nav('/');
    } else if (error) {
      nav('/login');
    }
  }, []);

  // if (error) {
  //   return <p>{error}</p>;
  // }

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};
