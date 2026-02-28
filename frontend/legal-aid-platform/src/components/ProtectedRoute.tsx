// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { JSX } from 'react';

type Props = {
  children: JSX.Element;
};

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, initializing } = useAuth();

  // While we are restoring from localStorage, show a loader
  if (initializing) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // not logged in -> send to login
    return <Navigate to="/login" replace />;
  }

  return children;
};
