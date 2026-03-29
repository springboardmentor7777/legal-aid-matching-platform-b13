// // src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CaseSubmissionForm from "./pages/CaseSubmissionForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LawyerDirectory from "./pages/LawyerDirectories";
import NgoDirectory from "./pages/NgoDirectories";
import EditProfile from "./pages/Editprofile";
import Mycase from "./pages/Mycase";
import AdminPanel from "./pages/AdminPanel";
import ChatPage from "./pages/ChatPage";
import MatchingResults from "./pages/MatchingResults";
import AppointmentScheduler from "./pages/AppointmentScheduler";
import SupportPage from "./pages/SupportPage";
import EditCase from "./pages/EditCase";
import ExternalDirectory from "./components/ExternalDirectory";
import CaseDetails from "./pages/CaseDetails";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      {/* Protected routes (must be logged in) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/directories/lawyers"
        element={
          <ProtectedRoute>
            <LawyerDirectory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/directories/ngos"
        element={
          <ProtectedRoute>
            <NgoDirectory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/directories/external"
        element={
          <ProtectedRoute>
            <ExternalDirectory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/case/:id"
        element={
          <ProtectedRoute>
            <CaseDetails/>
          </ProtectedRoute>
        }
      />

      {/* Optional: admin-only route */}
      <Route path="/admin" element={<Admin />} />

      <Route
        path="/submitcase"
        element={
          <ProtectedRoute>
            <CaseSubmissionForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mycases"
        element={
          <ProtectedRoute>
            <Mycase />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route
        path="/chatpage"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chatpage/:matchId"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/chatpage/:c.id" 
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/pages/MatchingResult" element={<MatchingResults />} />
      <Route path="/pages/AppointmentScheduler/:matchId" element={<ProtectedRoute><AppointmentScheduler /></ProtectedRoute>} />
      <Route path="/pages/appointments/:c.id" element={<ProtectedRoute><AppointmentScheduler /></ProtectedRoute>} />
      <Route path="/pages/SupportPage" element={<SupportPage />} />
      <Route path="/pages/EditCase/:caseId" element={<ProtectedRoute><EditCase /></ProtectedRoute>} />

    </Routes>
  );
}

export default App;
