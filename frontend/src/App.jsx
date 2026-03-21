// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Pages
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import GetStarted from "./pages/GetStarted";
// import InterestForm from "./pages/InterestForm";
// import ExitedForm from "./pages/ExitedForm";
// import AdminDashboard from "./pages/admin/Dashboard";
// import CandidatesList from "./pages/admin/CandidatesList";
// import CandidateDetail from "./pages/admin/CandidateDetail";
// import EmployeeDashboard from "./pages/employee/Dashboard";
// import PrivateRoute from "./components/PrivateRoute";
// import AdminUpdatePage from "./pages/admin/AdminEmployeeProfile";
// import EmployeesList from "./pages/admin/EmployeesList";

// // Entity pages
// import ViewEntities from "./pages/admin/entities/ViewEntities";
// import CreateEntity from "./pages/admin/entities/CreateEntity";
// import EditEntity from "./pages/admin/entities/EditEntity";
// import ViewNatureOfBusiness from "./pages/admin/natureOfbusiness/ViewNatureOfBusiness";
// import CreateNatureOfBusiness from "./pages/admin/natureOfbusiness/CreateNatureOfBusiness";
// import EditNatureOfBusiness from "./pages/admin/natureOfbusiness/EditNatureOfBusiness";
// import ViewComplianceTasks from "./pages/admin/complianceTasks/ViewComplianceTasks";
// import CreateComplianceTask from "./pages/admin/complianceTasks/CreateComplianceTask";
// import EditComplianceTask from "./pages/admin/complianceTasks/EditComplianceTask";
// import ViewCompliances from "./pages/admin/compliances/ViewCompliances";
// import CreateCompliance from "./pages/admin/compliances/CreateCompliance";
// import EditCompliance from "./pages/admin/compliances/EditCompliance";
// import CreateClient from "./pages/admin/clients/CreateClient";
// import ClientsList from "./pages/admin/clients/ClientsList";
// import SuccessPage from "./pages/SuccessPage";

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/get-started" element={<GetStarted />} />
//           <Route path="/interest-form" element={<InterestForm />} />
//           <Route path="/exited-form" element={<ExitedForm />} />
//           <Route path="/success" element={<SuccessPage />} />
//           {/* Admin Routes */}
//           <Route
//             path="/admin/dashboard"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <AdminDashboard />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/admin/candidates"
//             element={
//               <PrivateRoute allowedRoles={["admin", "advisor"]}>
//                 <CandidatesList />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/admin/candidates/:id"
//             element={
//               <PrivateRoute allowedRoles={["admin", "advisor"]}>
//                 <CandidateDetail />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/admin/employees/"
//             element={
//               <PrivateRoute allowedRoles={["admin", "advisor"]}>
//                 <EmployeesList />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin/candidates/:id/admin-edit"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <AdminUpdatePage />
//               </PrivateRoute>
//             }
//           />

//           {/* Entity Management Routes */}
//           <Route
//             path="/admin/entities"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <ViewEntities />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/admin/entities/create"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <CreateEntity />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/admin/entities/:id/edit"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <EditEntity />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin/nature-of-business"
//             element={<ViewNatureOfBusiness />}
//           />
//           <Route
//             path="/admin/nature-of-business/create"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <CreateNatureOfBusiness />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/admin/nature-of-business/:id/edit"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <EditNatureOfBusiness />
//               </PrivateRoute>
//             }
//           />

//           {/* Compliance Task Routes */}
//           <Route
//             path="/admin/compliance-tasks"
//             element={<ViewComplianceTasks />}
//           />
//           <Route
//             path="/admin/compliance-tasks/create"
//             element={<CreateComplianceTask />}
//           />
//           <Route
//             path="/admin/compliance-tasks/:id/edit"
//             element={<EditComplianceTask />}
//           />

//           <Route
//             path="/admin/compliances"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <ViewCompliances />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin/compliances/create"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <CreateCompliance />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin/compliances/edit/:id"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <EditCompliance />
//               </PrivateRoute>
//             }
//           />

//           {/* ================= CLIENT MANAGEMENT ROUTES ================= */}

//           <Route
//             path="/admin/clients"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <ClientsList />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin/clients/create"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <CreateClient />
//               </PrivateRoute>
//             }
//           />

//           {/* <Route
//             path="/admin/clients/:id/edit"
//             element={
//               <PrivateRoute allowedRoles={["admin"]}>
//                 <EditClient />
//               </PrivateRoute>
//             }
//           /> */}

//           {/* Employee Routes */}
//           <Route
//             path="/employee/dashboard"
//             element={
//               <PrivateRoute allowedRoles={["employee"]}>
//                 <EmployeeDashboard />
//               </PrivateRoute>
//             }
//           />
//         </Routes>

//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="light"
//         />
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public / Admin Pages
import Landing from "./pages/mainIndexPage/Landing";
import Login from "./pages/mainIndexPage/Login";
import GetStarted from "./pages/mainIndexPage/GetStarted";
import InterestForm from "./pages/mainIndexPage/InterestForm";
import ExitedForm from "./pages/mainIndexPage/ExitedForm";
import SuccessPage from "./pages/mainIndexPage/SuccessPage";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import CandidatesList from "./pages/admin/CandidatesList";
import CandidateDetail from "./pages/admin/CandidateDetail";
import AdminUpdatePage from "./pages/admin/AdminEmployeeProfile";
import EmployeesList from "./pages/admin/EmployeesList";

// Admin - Entity pages
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
import ViewClient from "./pages/admin/clients/ViewClient";
import EditClient from "./pages/admin/clients/EditClient";

// Employee (top-level dashboard - legacy)
// import EmployeeDashboard from "./pages/employee/Dashboard";

// Employee module components (nested under /employee)
import EmployeeLayout from "./components/employeeModule/EmployeeLayout";
import DashboardMetrics from "./components/employeeModule/DashboardMetrics";
import ClientList from "./components/employeeModule/ClientList";
import ClientManagement from "./components/employeeModule/ClientManagement";
import ClientLayout from "./components/employeeModule/ClientLayout";
import ClientMaster from "./components/employeeModule/ClientMaster";
import KYCDetails from "./components/employeeModule/KYCDetails";
import ComplianceCalendar from "./components/employeeModule/ComplianceCalendar";
import ComplianceDetail from "./components/employeeModule/ComplianceDetail";
import TaskList from "./components/employeeModule/TaskList";
import CheckInCheckOut from "./components/employeeModule/CheckInCheckOut";
import HistoricalData from "./components/employeeModule/HistoricalData";
import CompanyKYC from "./components/employeeModule/CompanyKYC";
import OwnerKYC from "./components/employeeModule/OwnerKYC";
import IncomeTaxReturn from "./components/employeeModule/IncomeTaxReturn";
import AuditBalanceSheet from "./components/employeeModule/AuditBalanceSheet";
import GSTReturn from "./components/employeeModule/GSTReturn";
import FinancialData from "./components/employeeModule/FinancialData";
import RevenueFromBusiness from "./components/employeeModule/RevenueFromBusiness";
import GSTLiabilityCal from "./components/employeeModule/GSTLiabilityCal";
import PndLInputField from "./components/employeeModule/PndLInputField";
import BSInputField from "./components/employeeModule/BSInputField";
import DueDateReminder from "./components/employeeModule/DueDateReminder";
import DebtorsCreditors from "./components/employeeModule/DebtorsCreditors";
import PeriodicData from "./components/employeeModule/PeriodicData";
import TaskProgress from "./components/employeeModule/TaskProgress";
import DocumentsAndFiles from "./components/employeeModule/DocumentsAndFiles";
import FinancialDashboard from "./components/employeeModule/FinancialDashboard";
import ClientQueries from "./components/employeeModule/ClientQueries";
import Resources from "./components/employeeModule/Resources";
import AttendanceHistory from "./components/employeeModule/AttendanceHistory";
import ReportsAnalytics from "./components/employeeModule/ReportsAnalytics";
import Communication from "./components/employeeModule/Communication";
import TeamManagement from "./components/employeeModule/TeamManagement";
import ClientFinancialReport from "./components/employeeModule/ClientFinancialReport";
import MoMSalesAndPurchase from "./components/employeeModule/MoMSalesAndPurchase";
import GSTCalculation from "./components/employeeModule/GSTCalculation";
import PeriodicKeyFinancials from "./components/employeeModule/PeriodicKeyFinancials";
import PndLYoYComparision from "./components/employeeModule/PndLYoYComparision";
import BSYoYComparision from "./components/employeeModule/BSYoYComparision";
import KeyRatios from "./components/employeeModule/KeyRatios";
import ProfileLayout from "./components/employeeModule/ProfileLayout";
import RescheduleManagement from "./components/employeeModule/RescheduleManagement";

// Admin reschedule view
import ClientRescheduleView from "./pages/admin/clients/ClientRescheduleView";

// Client Module imports
import ClientLayoutPortal from "./components/clientModule/ClientLayout";
import ClientDashboard from "./components/clientModule/ClientDashboard";
import ClientFinancials from "./components/clientModule/ClientFinancials";
import ClientQueriesPortal from "./components/clientModule/ClientQueries";
import ClientReschedule from "./components/clientModule/ClientReschedule";

// Route protection
import PrivateRoute from "./components/PrivateRoute"; // adjust path if needed

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* ------------------ Public Routes ------------------ */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/interest-form" element={<InterestForm />} />
          <Route path="/exited-form" element={<ExitedForm />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* ------------------ Admin Routes ------------------ */}
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
            path="/admin/employees"
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

          {/* Entity Management */}
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

          {/* Admin - Client management */}
          <Route
            path="/admin/clients/create"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <CreateClient />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/clients"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ClientsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/clients/:id"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ViewClient />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/clients/edit/:id"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <EditClient />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/clients/:id/reschedule"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ClientRescheduleView />
              </PrivateRoute>
            }
          />

          {/* ------------------ Client Module (nested at /client) ------------------ */}
          <Route
            path="/client/*"
            element={
              <PrivateRoute allowedRoles={["client"]}>
                <ClientLayoutPortal />
              </PrivateRoute>
            }
          >
            <Route index element={<ClientDashboard />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="financials" element={<ClientFinancials />} />
            <Route path="queries" element={<ClientQueriesPortal />} />
            {/* Reschedule actions happen inside Dashboard banner directly */}
            <Route path="reschedule" element={<ClientReschedule />} />
            <Route path="*" element={<ClientDashboard />} />
          </Route>

          {/* ------------------ Employee (legacy top-level) ------------------
              Keep legacy route if other parts of app link to /employee/dashboard
          */}
          {/* <Route
            path="/employee"
            element={
              <PrivateRoute allowedRoles={["employee"]}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          /> */}

          {/* ------------------ Employee Module (nested at /employee) ------------------
              EmployeeLayout must render <Outlet /> so nested routes show.
              /employee        -> DashboardMetrics (index)
              /employee/*      -> all other employee routes (relative paths)
          */}
          <Route
            path="/employee/*"
            element={
              <PrivateRoute allowedRoles={["employee"]}>
                <EmployeeLayout />
              </PrivateRoute>
            }
          >
            {/* index -> /employee */}
            <Route index element={<DashboardMetrics />} />

            {/* Clients */}
            <Route path="clients" element={<ClientList />} />

            <Route path="clients/:id" element={<ClientLayout />}>
              <Route index element={<ClientManagement />} />
              <Route path="master" element={<ClientMaster />} />
              <Route path="master/kyc" element={<KYCDetails />} />
              <Route path="master/compliance" element={<ComplianceCalendar />} />
              <Route path="master/compliance/detail" element={<ComplianceDetail />} />
              <Route path="master/tasks" element={<TaskList />} />
              <Route path="checkin" element={<CheckInCheckOut />} />

              {/* Historical */}
              <Route path="history" element={<HistoricalData />} />
              <Route path="history/company-kyc" element={<CompanyKYC />} />
              <Route path="history/owner-kyc" element={<OwnerKYC />} />
              <Route path="history/itr" element={<IncomeTaxReturn />} />
              <Route path="history/audit" element={<AuditBalanceSheet />} />
              <Route path="history/gst" element={<GSTReturn />} />

              {/* Financial */}
              <Route path="financial" element={<FinancialData />} />
              <Route path="financial/revenue" element={<RevenueFromBusiness />} />
              <Route path="financial/gst-liability" element={<GSTLiabilityCal />} />
              <Route path="financial/pndl" element={<PndLInputField />} />
              <Route path="financial/bs" element={<BSInputField />} />
              <Route path="financial/due-date" element={<DueDateReminder />} />
              <Route path="financial/debtors" element={<DebtorsCreditors />} />
              <Route path="financial/periodic" element={<PeriodicData />} />
              <Route path="financial/task-progress" element={<TaskProgress />} />

              {/* Reports */}
              <Route path="reports" element={<ClientFinancialReport />} />
              <Route path="reports/mom-sales" element={<MoMSalesAndPurchase />} />
              <Route path="reports/gst" element={<GSTCalculation />} />
              <Route path="reports/periodic" element={<PeriodicKeyFinancials />} />
              <Route path="reports/pndl-yoy" element={<PndLYoYComparision />} />
              <Route path="reports/bs-yoy" element={<BSYoYComparision />} />
              <Route path="reports/key-ratios" element={<KeyRatios />} />

              {/* Standalone client routes */}
              <Route path="documents" element={<DocumentsAndFiles />} />
              <Route path="reports/dashboard" element={<FinancialDashboard />} />
              <Route path="queries" element={<ClientQueries />} />
            </Route>


            {/* Profile */}
            <Route path="profile/*" element={<ProfileLayout />} />

            {/* Sidebar/global */}
            <Route path="resources" element={<Resources />} />
            <Route path="attendance" element={<AttendanceHistory />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="communication" element={<Communication />} />

            {/* Team */}
            <Route path="team" element={<TeamManagement />} />

            {/* Reschedule */}
            <Route path="reschedule" element={<RescheduleManagement />} />

            {/* Fallback for /employee/* */}
            <Route path="*" element={<DashboardMetrics />} />
          </Route>
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
