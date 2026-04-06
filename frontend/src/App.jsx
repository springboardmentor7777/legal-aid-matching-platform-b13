import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import Sidebar from "./components/Sidebar";

import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import OnboardingPage from "./pages/auth/OnboardingPage";
import CitizenDashboard from "./pages/citizen/DashboardPage";
import CaseSubmission from "./pages/citizen/CaseSubmissionPage";
import Directory from "./pages/directory/DirectoryPage";
import MatchingResults from "./pages/MatchingResults";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import AppointmentsPage from "./pages/AppointmentsPage";
import NotificationsPage from "./pages/NotificationsPage";

// Admin Pages (Milestone 4)
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCasesPage from "./pages/admin/AdminCasesPage";
import AdminVerificationPage from "./pages/admin/AdminVerificationPage";
import SystemMonitoringPage from "./pages/admin/SystemMonitoringPage";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Onboarding — no sidebar, protected */}
      <Route
        path="/onboarding"
        element={
          <PrivateRoute>
            <OnboardingPage />
          </PrivateRoute>
        }
      />

      {/* ═══════════════════════════════════ */}
      {/* ADMIN ROUTES (Milestone 4)         */}
      {/* ═══════════════════════════════════ */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Sidebar>
              <AdminDashboardPage />
            </Sidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/cases"
        element={
          <PrivateRoute>
            <Sidebar>
              <AdminCasesPage />
            </Sidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/verifications"
        element={
          <PrivateRoute>
            <Sidebar>
              <AdminVerificationPage />
            </Sidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/system"
        element={
          <PrivateRoute>
            <Sidebar>
              <SystemMonitoringPage />
            </Sidebar>
          </PrivateRoute>
        }
      />

      {/* ═══════════════════════════════════ */}
      {/* STANDARD USER ROUTES               */}
      {/* ═══════════════════════════════════ */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Sidebar>
              <CitizenDashboard />
            </Sidebar>
          </PrivateRoute>
        }
      />

      <Route
        path="/case-submission"
        element={
          <PrivateRoute>
            <Sidebar>
              <CaseSubmission />
            </Sidebar>
          </PrivateRoute>
        }
      />

      <Route
        path="/directory"
        element={
          <PrivateRoute>
            <Sidebar>
              <Directory />
            </Sidebar>
          </PrivateRoute>
        }
      />

      <Route
        path="/matches"
        element={
          <PrivateRoute>
            <Sidebar>
              <MatchingResults />
            </Sidebar>
          </PrivateRoute>
        }
      />

      <Route
        path="/chat/:matchId"
        element={
          <PrivateRoute>
            <Sidebar>
              <Chat />
            </Sidebar>
          </PrivateRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <Sidebar>
              <AppointmentsPage />
            </Sidebar>
          </PrivateRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <Sidebar>
              <NotificationsPage />
            </Sidebar>
          </PrivateRoute>
        }
      />

      <Route
        path="/profile/:id"
        element={
          <PrivateRoute>
            <Sidebar>
              <Profile />
            </Sidebar>
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Sidebar>
              <Profile />
            </Sidebar>
          </PrivateRoute>
        }
      />

    </Routes>
  );
}