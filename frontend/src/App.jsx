import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";

import MatchingResults from "./pages/MatchingResults";
import Chat from "./pages/Chat";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import CaseSubmission from "./pages/CaseSubmission";
import FilterableDirectory from "./pages/FilterableDirectory";
import DirectoryIngestion from "./pages/DirectoryIngestion";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Dashboard */}
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

      {/* Citizen Dashboard */}
      <Route
        path="/dashboard/citizen"
        element={
            <DashboardLayout>
              <CitizenDashboard />
            </DashboardLayout>
        }
      />

      {/* Case Submission */}
      <Route
        path="/case-submission"
        element={
            <DashboardLayout>
              <CaseSubmission />
            </DashboardLayout>
        }
      />

      {/* Directory */}
      <Route
        path="/directory"
        element={
            <DashboardLayout>
              <FilterableDirectory />
            </DashboardLayout>
        }
      />

      {/* Directory Ingestion */}
      <Route
        path="/directory-ingestion"
        element={
            <DashboardLayout>
              <DirectoryIngestion />
            </DashboardLayout>
        }
      />

      {/* Matching Results */}
      <Route
        path="/matches"
        element={
            <DashboardLayout>
              <MatchingResults />
            </DashboardLayout>
        }
      />

      {/* Chat */}
      <Route
        path="/chat/:matchId"
        element={
            <DashboardLayout>
              <Chat />
            </DashboardLayout>
        }
      />

      <Route
        path="/profile"
        element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}