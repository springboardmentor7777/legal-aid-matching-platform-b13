import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import LawyerDashboard from "./pages/LawyerDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/citizen"
        element={
          <PrivateRoute>
            <CitizenDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/lawyer"
        element={
          <PrivateRoute>
            <LawyerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/ngo"
        element={
          <PrivateRoute>
            <NgoDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
