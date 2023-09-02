import { IconHome2, IconKey } from '@tabler/icons';

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  caption: 'Award Winners',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Home',
      type: 'item',
      url: '/',
      icon: IconHome2,
      breadcrumbs: false
    },
    {
      id: 'members',
      title: 'Members',
      type: 'item',
      url: '/users',
      icon: IconKey,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
