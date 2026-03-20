import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import Sidebar from "./components/Sidebar";

import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import CitizenDashboard from "./pages/citizen/DashboardPage";
import CaseSubmission from "./pages/citizen/CaseSubmissionPage";
import Directory from "./pages/directory/DirectoryPage";
import MatchingResults from "./pages/MatchingResults";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
        path="/profile/:id"
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