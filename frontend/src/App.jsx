import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/interest-form" element={<InterestForm />} />
          <Route path="/exited-form" element={<ExitedForm />} />

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
