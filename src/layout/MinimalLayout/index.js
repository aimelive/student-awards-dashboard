import { useUser } from 'providers/UserProvider';
import { Outlet } from 'react-router-dom';
import Loader from 'ui-component/Loader';

const MinimalLayout = () => {
  const { user } = useUser();
  if (!user) {
    return <Outlet />;
  }
  return <Loader />;
};

export default MinimalLayout;
