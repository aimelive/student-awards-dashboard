// assets
import { IconKey } from '@tabler/icons';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Users',
  caption: 'Award winnners',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Members',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          url: '/users'
          // target: true
        },
        {
          id: 'profile',
          title: 'Profiles',
          type: 'item',
          url: '/profiles'
          // target: true
        }
      ]
    }
  ]
};

export default pages;
