import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import NotFound from 'pages/NotFound';
import { AuthWrapper } from 'layout/AuthWrapper';

// login option 3 routing
const LoginPage = Loadable(lazy(() => import('pages/LoginPage')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: (
    <AuthWrapper nonAuth={true}>
      <MinimalLayout />
    </AuthWrapper>
  ),
  children: [
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default AuthenticationRoutes;
