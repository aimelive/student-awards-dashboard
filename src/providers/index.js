import React from 'react';
import PropTypes from 'prop-types';
import { UserProvider } from './UserProvider';

/**
 * A component that wraps its children with certain providers.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children to be wrapped.
 * @returns {JSX.Element} The wrapped children.
 */
export const Providers = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

Providers.propTypes = {
  children: PropTypes.node.isRequired
};

export default Providers;
