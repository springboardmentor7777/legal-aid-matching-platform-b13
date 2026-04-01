import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";

import Admin from "./pages/admin/Admin";
import Users from "./pages/admin/Users";
import Lawyers from "./pages/admin/Lawyers";
import Ngos from "./pages/admin/Ngos";
import Analytics from "./pages/admin/Analytics";
import Verification from "./pages/admin/Verification";
import SystemLogs from "./pages/admin/SystemLogs";

import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleBasedDashboard from "./components/common/RoleBasedDashboard";

import SubmitCase from "./pages/user/SubmitCase";
import MyCases from "./pages/user/MyCases";
import Profile from "./pages/user/Profile";
import FindLawyers from "./pages/user/FindLawyers";
import Matches from "./pages/user/Matches";

import Chat from "./pages/shared/Chat";
import Appointments from "./pages/shared/Appointments";
import Notifications from "./pages/shared/Notifications";

import LawyerDashboard from "./pages/dashboards/LawyerDashboard";
import NgoDashboard from "./pages/dashboards/NgoDashboard";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "Georgia, serif", fontSize: "13px" } }} />
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Role-based dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><RoleBasedDashboard /></ProtectedRoute>} />

        {/* User pages */}
        <Route path="/submit-case" element={<ProtectedRoute><SubmitCase /></ProtectedRoute>} />
        <Route path="/my-cases" element={<ProtectedRoute><MyCases /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/lawyers" element={<ProtectedRoute><FindLawyers /></ProtectedRoute>} />

        {/* Milestone 3 */}
        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        {/* Lawyer pages */}
        <Route path="/lawyer/cases" element={<ProtectedRoute><LawyerDashboard /></ProtectedRoute>} />
        <Route path="/lawyer/schedule" element={<ProtectedRoute><LawyerDashboard /></ProtectedRoute>} />

        {/* NGO pages */}
        <Route path="/ngo/cases" element={<ProtectedRoute><NgoDashboard /></ProtectedRoute>} />
        <Route path="/ngo/lawyers" element={<ProtectedRoute><NgoDashboard /></ProtectedRoute>} />

        {/* Admin pages */}
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><Admin /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><Users /></ProtectedRoute>} />
        <Route path="/admin/lawyers" element={<ProtectedRoute role="ADMIN"><Lawyers /></ProtectedRoute>} />
        <Route path="/admin/ngos" element={<ProtectedRoute role="ADMIN"><Ngos /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute role="ADMIN"><Analytics /></ProtectedRoute>} />
        <Route path="/admin/verification" element={<ProtectedRoute role="ADMIN"><Verification /></ProtectedRoute>} />
        <Route path="/admin/system-logs" element={<ProtectedRoute role="ADMIN"><SystemLogs /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;