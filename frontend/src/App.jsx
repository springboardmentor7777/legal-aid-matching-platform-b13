import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import LawyerDashboard from "./pages/LawyerDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute role="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/lawyer"
        element={
          <PrivateRoute role="LAWYER">
            <LawyerDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/ngo"
        element={
          <PrivateRoute role="NGO">
            <NgoDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/citizen"
        element={
          <PrivateRoute role="CITIZEN">
            <CitizenDashboard />
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
