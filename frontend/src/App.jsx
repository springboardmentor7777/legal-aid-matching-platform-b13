import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Citizen Pages
import CitizenDashboardPage from './pages/citizen/DashboardPage';
import CaseSubmissionPage from './pages/citizen/CaseSubmissionPage';

// Directory
import DirectoryPage from './pages/directory/DirectoryPage';

// Lawyer
import LawyerDashboardPage from './pages/lawyer/DashboardPage';

// NGO
import NgoDashboardPage from './pages/ngo/DashboardPage';

// Admin
import AdminPanelPage from './pages/admin/AdminPanelPage';

// Shared
import ProfilePage from './pages/shared/ProfilePage';

// Smart redirect based on role
const DashboardRedirect = () => {
  const { user } = useAuth();
  const role = user?.role?.toUpperCase();

  switch (role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'LAWYER':
      return <Navigate to="/lawyer/dashboard" replace />;
    case 'NGO':
      return <Navigate to="/ngo/dashboard" replace />;
    case 'CITIZEN':
    default:
      return <Navigate to="/citizen/dashboard" replace />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes with Layout */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Dashboard redirect */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

<<<<<<< HEAD
            {/* Citizen Routes */}
            <Route
              path="/citizen/dashboard"
              element={
                <PrivateRoute allowedRoles={['CITIZEN']}>
                  <CitizenDashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/case-submission"
              element={
                <PrivateRoute allowedRoles={['CITIZEN']}>
                  <CaseSubmissionPage />
                </PrivateRoute>
              }
            />
=======
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
>>>>>>> 2fa9e5e72acd3a0f2939a75f13b07aa7080f5b88

            {/* Lawyer Routes */}
            <Route
              path="/lawyer/dashboard"
              element={
                <PrivateRoute allowedRoles={['LAWYER']}>
                  <LawyerDashboardPage />
                </PrivateRoute>
              }
            />

            {/* NGO Routes */}
            <Route
              path="/ngo/dashboard"
              element={
                <PrivateRoute allowedRoles={['NGO']}>
                  <NgoDashboardPage />
                </PrivateRoute>
              }
            />

            {/* Directory — all roles */}
            <Route path="/directory" element={<DirectoryPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={['ADMIN']}>
                  <AdminPanelPage />
                </PrivateRoute>
              }
            />

            {/* Profile — all roles */}
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
