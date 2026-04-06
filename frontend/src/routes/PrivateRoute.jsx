import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const { user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ADMIN is NEVER subject to onboarding check
  if (user && user.role === "ADMIN") {
    return children;
  }

  // Redirect LAWYER/NGO to onboarding if not completed
  if (user && (user.role === "LAWYER" || user.role === "NGO") && !user.onboardingComplete) {
    // Allow access to onboarding page itself
    if (window.location.pathname === "/onboarding") {
      return children;
    }
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}