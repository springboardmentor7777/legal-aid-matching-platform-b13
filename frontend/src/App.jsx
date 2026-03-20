import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import LandingPage from "./pages/LandingPage";
import { Navigate } from "react-router-dom";

import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";

import CitizenDashboard from "./pages/dashboard/CitizenDashboard";
import LawyerDashboard from "./pages/dashboard/LawyerDashboard";
import NGODashboard from "./pages/dashboard/NGODashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import CaseSubmission from "./pages/cases/CaseSubmission";
import CaseList from "./pages/cases/CaseList";
import CaseDetail from "./pages/cases/CaseDetail";

import LawyerDirectory from "./pages/directory/LawyerDirectory";
import NgoDirectory from "./pages/directory/NgoDirectory";
import Matching from "./pages/matching/Matches";

import LawyerProfile from "./pages/profiles/LawyerProfile";
import AssignedCases from "./components/cases/AssignedCases";
import ChatPage from "./pages/chat/ChatPage";
import Profile from "./pages/profiles/Profile";

const Home = () => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");

  if (token && role) {
    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "LAWYER") return <Navigate to="/lawyer" replace />;
    if (role === "NGO") return <Navigate to="/ngo" replace />;
    return <Navigate to="/citizen" replace />;
  }

  return <LandingPage />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/case/:id" element={<CaseDetail />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashboardLayout role="admin" />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Lawyer */}
        <Route
          path="/lawyer"
          element={
            <PrivateRoute>
              <DashboardLayout role="lawyer" />
            </PrivateRoute>
          }
        >
          <Route index element={<LawyerDashboard />} />
          <Route path="directory" element={<LawyerDirectory />} />
        </Route>

        {/* Citizen */}
        <Route
          path="/citizen"
          element={
            <PrivateRoute>
              <DashboardLayout role="citizen" />
            </PrivateRoute>
          }
        >
          <Route index element={<CitizenDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="submit-case" element={<CaseSubmission />} />
          <Route path="cases" element={<CaseList />} />
          <Route path="case/:id" element={<CaseDetail />} />
          <Route path="lawyers" element={<LawyerDirectory />} />
          <Route path="ngos" element={<NgoDirectory />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="matches" element={<Matching />} />
        </Route>

        {/* NGO */}
        <Route
          path="/ngo"
          element={
            <PrivateRoute>
              <DashboardLayout role="ngo" />
            </PrivateRoute>
          }
        >
          <Route index element={<NGODashboard />} />
        </Route>

        {/* Other */}
        <Route path="/lawyer-profile/:id" element={<LawyerProfile />} />
        <Route path="/assigned-cases" element={<AssignedCases />} />

      </Routes>
    </Router>
  );
}

export default App;