import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

function PrivateRoute({ element }) {
  return isAuthenticated() ? element : <Navigate to="/" />;
}

export default PrivateRoute;
