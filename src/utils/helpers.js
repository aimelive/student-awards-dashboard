import { Alert } from '@mui/material';
import { toast } from 'react-hot-toast';

export function getGreeting() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    return 'Good Afternoon';
  } else if (currentHour >= 17 && currentHour < 20) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
}

export const toastMessage = (message, { isError, isWarning } = {}) => {
  return toast(() => (
    <Alert variant="filled" severity={isError ? 'error' : isWarning ? 'info' : 'success'}>
      <div dangerouslySetInnerHTML={{ __html: message }}></div>
    </Alert>
  ));
};

export function compareObj(obj1, obj2) {
  return Object.entries(obj2).reduce((acc, [key, value]) => {
    if (obj1[key] !== value) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export const seasons = [
  {
    value: 'SEASON_1',
    label: 'Season 1'
  },
  {
    value: 'SEASON_2',
    label: 'Season 2'
  },
  {
    value: 'SEASON_3',
    label: 'Season 3'
  }
];

export const talents = ['Traditional', 'Singer', 'Dance', 'Fashion'].map((item) => ({
  value: item,
  label: item
}));
