import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import InterestForm from "./pages/InterestForm";
import ExitedForm from "./pages/ExitedForm";
import AdminDashboard from "./pages/admin/Dashboard";
import CandidatesList from "./pages/admin/CandidatesList";
import CandidateDetail from "./pages/admin/CandidateDetail";
import EmployeeDashboard from "./pages/employee/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AdminUpdatePage from "./pages/admin/AdminEmployeeProfile";
import EmployeesList from "./pages/admin/EmployeesList";

// Entity pages
import ViewEntities from "./pages/admin/entities/ViewEntities";
import CreateEntity from "./pages/admin/entities/CreateEntity";
import EditEntity from "./pages/admin/entities/EditEntity";
import ViewNatureOfBusiness from "./pages/admin/natureOfbusiness/ViewNatureOfBusiness";
import CreateNatureOfBusiness from "./pages/admin/natureOfbusiness/CreateNatureOfBusiness";
import EditNatureOfBusiness from "./pages/admin/natureOfbusiness/EditNatureOfBusiness";
import ViewComplianceTasks from "./pages/admin/complianceTasks/ViewComplianceTasks";
import CreateComplianceTask from "./pages/admin/complianceTasks/CreateComplianceTask";
import EditComplianceTask from "./pages/admin/complianceTasks/EditComplianceTask";
import ViewCompliances from "./pages/admin/compliances/ViewCompliances";
import CreateCompliance from "./pages/admin/compliances/CreateCompliance";
import EditCompliance from "./pages/admin/compliances/EditCompliance";
import CreateClient from "./pages/admin/clients/CreateClient";
import ClientsList from "./pages/admin/clients/ClientsList";
import SuccessPage from "./pages/SuccessPage";

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
          <Route path="/success" element={<SuccessPage />} />
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/candidates"
            element={
              <PrivateRoute allowedRoles={["admin", "advisor"]}>
                <CandidatesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/candidates/:id"
            element={
              <PrivateRoute allowedRoles={["admin", "advisor"]}>
                <CandidateDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/employees/"
            element={
              <PrivateRoute allowedRoles={["admin", "advisor"]}>
                <EmployeesList />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/candidates/:id/admin-edit"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminUpdatePage />
              </PrivateRoute>
            }
          />

          {/* Entity Management Routes */}
          <Route
            path="/admin/entities"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ViewEntities />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/entities/create"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <CreateEntity />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/entities/:id/edit"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <EditEntity />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/nature-of-business"
            element={<ViewNatureOfBusiness />}
          />
          <Route
            path="/admin/nature-of-business/create"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <CreateNatureOfBusiness />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/nature-of-business/:id/edit"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <EditNatureOfBusiness />
              </PrivateRoute>
            }
          />

          {/* Compliance Task Routes */}
          <Route
            path="/admin/compliance-tasks"
            element={<ViewComplianceTasks />}
          />
          <Route
            path="/admin/compliance-tasks/create"
            element={<CreateComplianceTask />}
          />
          <Route
            path="/admin/compliance-tasks/:id/edit"
            element={<EditComplianceTask />}
          />

          <Route
            path="/admin/compliances"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ViewCompliances />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/compliances/create"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <CreateCompliance />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/compliances/edit/:id"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <EditCompliance />
              </PrivateRoute>
            }
          />

          {/* ================= CLIENT MANAGEMENT ROUTES ================= */}

          <Route
            path="/admin/clients"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ClientsList />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/clients/create"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <CreateClient />
              </PrivateRoute>
            }
          />

          {/* <Route
            path="/admin/clients/:id/edit"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <EditClient />
              </PrivateRoute>
            }
          /> */}

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <PrivateRoute allowedRoles={["employee"]}>
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
