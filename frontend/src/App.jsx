import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ==================== OLD SYSTEM PAGES ====================
import Landing from './pages/Landing';
import Login from './pages/Login';
import GetStarted from './pages/GetStarted';
import InterestForm from './pages/InterestForm';
import ExitedForm from './pages/ExitedForm';
import AdminDashboard from './pages/admin/Dashboard';
import CandidatesList from './pages/admin/CandidatesList';
import CandidateDetail from './pages/admin/CandidateDetail';
import EmployeeDashboard from './pages/employee/Dashboard';
import PrivateRoute from './components/PrivateRoute';

// ==================== NEW SYSTEM PAGES ====================
import CADashboard from './pages/CADashboard';
import AccountantDashboard from './pages/AccountantDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ClientList from './pages/ClientList';
import Layout from './components/Layout';

// ==================== STORES ====================
import useAuthStore from './store/authStore';
import useDashboardStore from './store/dashboardStore';

// ==================== PROTECTED ROUTE COMPONENT ====================
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

// ==================== DASHBOARD WRAPPER COMPONENT ====================
const DashboardWrapper = ({ role }) => {
  const { fetchDashboard } = useDashboardStore();
  
  // Don't fetch dashboard for old system roles
  if (['admin', 'advisor', 'employee'].includes(role)) {
    return null;
  }
  
  const { useEffect } = React;
  
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

  const { useEffect } = React;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchCurrentUser();
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          <Route path="/" element={<Landing />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to={`/${user?.role?.toLowerCase()}`} replace /> : <Login />} 
          />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/interest-form" element={<InterestForm />} />
          <Route path="/exited-form" element={<ExitedForm />} />

          {/* ==================== OLD SYSTEM ROUTES (Admin/Employee) ==================== */}
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/candidates"
            element={
              <PrivateRoute allowedRoles={['admin', 'advisor']}>
                <CandidatesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/candidates/:id"
            element={
              <PrivateRoute allowedRoles={['admin', 'advisor']}>
                <CandidateDetail />
              </PrivateRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <PrivateRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />

          {/* ==================== NEW SYSTEM ROUTES (CA/Accountant/Client) ==================== */}
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

          {/* ==================== CATCH ALL ROUTE ==================== */}
          <Route 
            path="*" 
            element={
              isAuthenticated && user ? (
                <Navigate to={`/${user.role.toLowerCase()}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
