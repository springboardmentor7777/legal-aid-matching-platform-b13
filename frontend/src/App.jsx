import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CaseSubmission from "./pages/CaseSubmission";
import DashboardLayout from "./components/DashboardLayout";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <Routes>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/case-submission"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <CaseSubmission />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}