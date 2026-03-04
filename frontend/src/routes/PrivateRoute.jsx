import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p className="p-6">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}