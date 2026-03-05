import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import CaseSubmission from "./pages/CaseSubmission";
import FilterableDirectory from "./pages/FilterableDirectory";
import DirectoryIngestion from "./pages/DirectoryIngestion";

export default function App() {
  return (
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
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
        path="/dashboard/citizen"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <CitizenDashboard />
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

      <Route
        path="/directory"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <FilterableDirectory />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/directory-ingestion"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <DirectoryIngestion />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}