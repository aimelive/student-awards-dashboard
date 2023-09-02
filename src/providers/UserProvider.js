import { createContext, useContext } from 'react';
import { getLocalStorage } from 'utils/api';
import PropTypes from 'prop-types';

const initialContext = { user: null, loading: false, error: null };
const UserContext = createContext(initialContext);

export const UserProvider = ({ children }) => {
  let state = initialContext;
  state = { ...state, loading: true };
  const { user, token, expiredAt } = getLocalStorage();
  if (token) {
    const isExpired = new Date(expiredAt) < new Date();
    state = {
      email: user?.email,
      user: isExpired ? null : user,
      error: !user
        ? 'Something went wrong while retrieving user data'
        : isExpired
        ? 'The current session has expired, please login again to continue.'
        : null,
      loading: false
    };
  } else {
    state = { ...state, loading: false };
  }
  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useUser = () => {
  return useContext(UserContext);
};
