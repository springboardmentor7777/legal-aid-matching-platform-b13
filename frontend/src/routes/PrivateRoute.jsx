import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { user, token } = useAuth();

  if (!token) return <Navigate to="/login" />;

  if (role && user.role !== role)
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} />;

  return children;
}
