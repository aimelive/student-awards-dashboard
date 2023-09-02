import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { AuthWrapper } from 'layout/AuthWrapper';
import NotFound from 'pages/NotFound';
import PerformanceDetails from 'pages/PerformanceDetails';
import ActivityDetails from 'pages/ActivityDetails';

// dashboard routing
const DashboardPage = Loadable(lazy(() => import('pages/DashboardPage')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('pages/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('pages/utilities/Color')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('pages/sample-page')));
const UsersPage = Loadable(lazy(() => import('pages/UsersPage')));
const ProfilesPage = Loadable(lazy(() => import('pages/ProfilesPage')));
const UserDetailsPage = Loadable(lazy(() => import('pages/UserDetailsPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthWrapper>
      <MainLayout />
    </AuthWrapper>
  ),
  children: [
    {
      path: '/',
      element: <DashboardPage />
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'performances/:id',
      element: <PerformanceDetails />
    },
    {
      path: 'activities/:id',
      element: <ActivityDetails />
    },
    {
      path: 'users',
      children: [
        {
          path: '',
          element: <UsersPage />
        },
        {
          path: ':id',
          element: <UserDetailsPage />
        }
      ]
    },
    {
      path: 'profiles',
      element: <ProfilesPage />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default MainRoutes;
