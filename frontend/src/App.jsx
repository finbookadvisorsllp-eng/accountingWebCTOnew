import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import CADashboard from './pages/CADashboard';
import AccountantDashboard from './pages/AccountantDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ClientList from './pages/ClientList';

// Store
import useAuthStore from './store/authStore';
import useDashboardStore from './store/dashboardStore';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={`/${user?.role?.toLowerCase()}`} replace />;
  }

  return children;
};

// Dashboard Wrapper Component
const DashboardWrapper = ({ role }) => {
  const { fetchDashboard } = useDashboardStore();
  
  useEffect(() => {
    fetchDashboard();
  }, [role]);

  switch (role) {
    case 'CA':
      return <CADashboard />;
    case 'ACCOUNTANT':
      return <AccountantDashboard />;
    case 'CLIENT':
      return <ClientDashboard />;
    default:
      return <CADashboard />;
  }
};

function App() {
  const { isAuthenticated, user, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in and fetch current user
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchCurrentUser();
    }
  }, []);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to={`/${user?.role?.toLowerCase()}`} replace /> : <Login />} 
        />

        {/* Protected Routes */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* CA Routes */}
          <Route path="/ca" element={
            <DashboardWrapper role="CA" />
          } />
          <Route path="/clients" element={<ClientList />} />
          
          {/* Accountant Routes */}
          <Route path="/accountant" element={
            <DashboardWrapper role="ACCOUNTANT" />
          } />
          
          {/* Client Routes */}
          <Route path="/client" element={
            <DashboardWrapper role="CLIENT" />
          } />

          {/* Default redirect based on role */}
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={`/${user.role.toLowerCase()}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Route>

        {/* Catch all - redirect to login or role-based dashboard */}
        <Route 
          path="*" 
          element={
            user ? (
              <Navigate to={`/${user.role.toLowerCase()}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;