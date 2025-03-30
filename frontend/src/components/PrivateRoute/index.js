import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ element }) => {
  const { usuario } = useContext(AuthContext);

  return usuario ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
