import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useNilePay } from '../context/NilePayContext';

export default function ProtectedRoute({ role, loginPath, children }) {
  const { currentUser } = useNilePay();
  const location = useLocation();
  if (!currentUser || currentUser.role !== role) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }
  return children;
}
