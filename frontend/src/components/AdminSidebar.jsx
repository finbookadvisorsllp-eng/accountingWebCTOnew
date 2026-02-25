// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";

// /* ================= ICONS ================= */

// const Calculator = ({ size = 18 }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect width="16" height="20" x="4" y="2" rx="2" />
//     <line x1="8" x2="16" y1="6" y2="6" />
//     <line x1="16" x2="16" y1="14" y2="18" />
//     <path d="M16 10h.01" />
//     <path d="M12 10h.01" />
//     <path d="M8 10h.01" />
//     <path d="M12 14h.01" />
//     <path d="M8 14h.01" />
//     <path d="M12 18h.01" />
//     <path d="M8 18h.01" />
//   </svg>
// );

// const BarChart3 = ({ size = 18 }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M3 3v18h18" />
//     <path d="M18 17V9" />
//     <path d="M13 17V5" />
//     <path d="M8 17v-3" />
//   </svg>
// );

// const Users = ({ size = 18 }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );

// const Building2 = ({ size = 18 }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
//     <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
//     <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
//     <path d="M10 6h4" />
//     <path d="M10 10h4" />
//     <path d="M10 14h4" />
//     <path d="M10 18h4" />
//   </svg>
// );

// const ShieldCheck = ({ size = 18 }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
//     <path d="m9 12 2 2 4-4" />
//   </svg>
// );

// /* ================= SIDEBAR ================= */

// const AdminSidebar = ({ isOpen }) => {
//   const location = useLocation();
//   const [entitiesOpen, setEntitiesOpen] = useState(
//     location.pathname.startsWith("/admin/entities"),
//   );
//   const [natureOpen, setNatureOpen] = useState(
//     location.pathname.startsWith("/admin/nature-of-business"),
//   );
//   const [complianceOpen, setComplianceOpen] = useState(
//     location.pathname.startsWith("/admin/compliance-tasks"),
//   );
//   const [complianceMasterOpen, setComplianceMasterOpen] = useState(
//     location.pathname.startsWith("/admin/compliances"),
//   );
//   const isActive = (path) =>
//     location.pathname === path || location.pathname.startsWith(path + "/");

//   const linkClass = (path) =>
//     `flex items-center gap-3 px-3 py-2 rounded text-xs transition
//     ${
//       isActive(path)
//         ? "bg-blue-600 text-white font-semibold"
//         : "text-gray-300 hover:bg-gray-800 hover:text-white"
//     }`;

//   return (
//     <aside
//       className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-gray-200 z-50
//       transform transition-transform duration-300
//       ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
//     >
//       {/* Logo */}
//       <div className="h-14 flex items-center px-6 border-b border-gray-800">
//         <Link
//           to="/admin/dashboard"
//           className="flex items-center gap-2 font-bold text-sm"
//         >
//           <div className="bg-blue-600 w-7 h-7 rounded flex items-center justify-center">
//             <Calculator size={16} />
//           </div>
//           Accoun<span className="text-blue-500">Tech</span>
//         </Link>
//       </div>

//       {/* Menu */}
//       <div
//         className="h-[calc(100vh-56px)] overflow-y-auto p-3 space-y-6
//                       scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
//       >
//         {/* Overview */}
//         <div>
//           <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
//             Overview
//           </p>
//           <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
//             <BarChart3 /> Analytics
//           </Link>
//         </div>

//         {/* Management */}
//         <div>
//           <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
//             Management
//           </p>
//           <Link
//             to="/admin/candidates"
//             className={linkClass("/admin/candidates")}
//           >
//             <Users /> Candidates
//           </Link>
//           <Link to="/admin/employees" className={linkClass("/admin/employees")}>
//             <Users /> Employees
//           </Link>
//           <Link to="/api/clients" className={linkClass("/api/clients")}>
//             <Building2 /> Clients
//           </Link>
//         </div>

//         {/* Governance */}
//         <div>
//           <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
//             Governance
//           </p>

//           {/* Entities dropdown */}
//           <button
//             onClick={() => setEntitiesOpen(!entitiesOpen)}
//             className="w-full flex items-center justify-between px-3 py-2 text-xs
//             text-gray-300 hover:bg-gray-800 rounded"
//           >
//             <span className="flex items-center gap-3">
//               <Calculator /> Entities
//             </span>
//             {entitiesOpen ? "▲" : "▼"}
//           </button>

//           {entitiesOpen && (
//             <div className="ml-6 mt-2 space-y-1">
//               <Link
//                 to="/admin/entities/create"
//                 className={linkClass("/admin/entities/create")}
//               >
//                 Create Master Entity
//               </Link>
//               <Link
//                 to="/admin/entities"
//                 className={linkClass("/admin/entities")}
//               >
//                 View Entities
//               </Link>
//             </div>
//           )}

//           {/* Nature of Business dropdown */}
//           <button
//             onClick={() => setNatureOpen(!natureOpen)}
//             className="w-full flex items-center justify-between px-3 py-2 text-xs
//             text-gray-300 hover:bg-gray-800 rounded mt-2"
//           >
//             <span className="flex items-center gap-3">
//               <Building2 /> Nature of Business
//             </span>
//             {natureOpen ? "▲" : "▼"}
//           </button>

//           {natureOpen && (
//             <div className="ml-6 mt-2 space-y-1">
//               <Link
//                 to="/admin/nature-of-business/create"
//                 className={linkClass("/admin/nature-of-business/create")}
//               >
//                 Create Nature of Business
//               </Link>
//               <Link
//                 to="/admin/nature-of-business"
//                 className={linkClass("/admin/nature-of-business")}
//               >
//                 View Nature of Business
//               </Link>
//             </div>
//           )}

//           {/* Compliance Tasks dropdown */}
//           <button
//             onClick={() => setComplianceOpen(!complianceOpen)}
//             className="w-full flex items-center justify-between px-3 py-2 text-xs
//             text-gray-300 hover:bg-gray-800 rounded mt-2"
//           >
//             <span className="flex items-center gap-3">
//               <Calculator />
//               Tasks
//             </span>
//             {complianceOpen ? "▲" : "▼"}
//           </button>

//           {complianceOpen && (
//             <div className="ml-6 mt-2 space-y-1">
//               <Link
//                 to="/admin/compliance-tasks/create"
//                 className={linkClass("/admin/compliance-tasks/create")}
//               >
//                 Create Compliance Task
//               </Link>
//               <Link
//                 to="/admin/compliance-tasks"
//                 className={linkClass("/admin/compliance-tasks")}
//               >
//                 View Compliance Tasks
//               </Link>
//             </div>
//           )}

//           {/* Compliance Masters dropdown */}
//           <button
//             onClick={() => setComplianceMasterOpen(!complianceMasterOpen)}
//             className="w-full flex items-center justify-between px-3 py-2 text-xs
//             text-gray-300 hover:bg-gray-800 rounded mt-2"
//           >
//             <span className="flex items-center gap-3">
//               <ShieldCheck /> Compliance Masters
//             </span>
//             {complianceMasterOpen ? "▲" : "▼"}
//           </button>

//           {complianceMasterOpen && (
//             <div className="ml-6 mt-2 space-y-1">
//               <Link
//                 to="/admin/compliances/create"
//                 className={linkClass("/admin/compliances/create")}
//               >
//                 Create Compliance Master
//               </Link>
//               <Link
//                 to="/admin/compliances"
//                 className={linkClass("/admin/compliances")}
//               >
//                 View Compliance Masters
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default AdminSidebar;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Building2,
  ShieldCheck,
  Calculator,
  ChevronDown,
} from "lucide-react";

const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();

  const [entitiesOpen, setEntitiesOpen] = useState(
    location.pathname.startsWith("/admin/entities"),
  );
  const [natureOpen, setNatureOpen] = useState(
    location.pathname.startsWith("/admin/nature-of-business"),
  );
  const [complianceOpen, setComplianceOpen] = useState(
    location.pathname.startsWith("/admin/compliance-tasks"),
  );
  const [complianceMasterOpen, setComplianceMasterOpen] = useState(
    location.pathname.startsWith("/admin/compliances"),
  );

  const [clientsOpen, setClientsOpen] = useState(
    location.pathname.startsWith("/admin/clients"),
  );
  // FIXED: Only exact path match gets active blue background
  // No more "startsWith" for children → Create and View will never both be active
  const isActive = (path) => location.pathname === path;

  // Parent dropdown style (subtle highlight when open, never full blue)
  const parentClass = (isOpenState) =>
    `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200
    ${
      isOpenState
        ? "bg-gray-800 text-white font-medium"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  // Child links - ONLY exact match gets full blue
  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-200
    ${
      isActive(path)
        ? "bg-blue-600 text-white font-semibold shadow-sm"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-gray-950 text-gray-200 z-50 border-r border-gray-800
        transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Logo - modern */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-3 font-bold text-lg tracking-tight"
        >
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-8 h-8 rounded-2xl flex items-center justify-center shadow">
            <Calculator size={18} className="text-white" />
          </div>
          Accoun<span className="text-blue-400">Tech</span>
        </Link>
      </div>

      {/* Menu */}
      <div className="h-[calc(100vh-64px)] overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-950">
        {/* Overview */}
        <div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">
            Overview
          </p>
          <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
            <BarChart3 size={18} />
            Analytics
          </Link>
        </div>

        {/* Management */}
        {/* Management */}
        <div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">
            Management
          </p>

          <div className="space-y-1">
            <Link
              to="/admin/candidates"
              className={linkClass("/admin/candidates")}
            >
              <Users size={18} />
              Candidates
            </Link>

            <Link
              to="/admin/employees"
              className={linkClass("/admin/employees")}
            >
              <Users size={18} />
              Employees
            </Link>

            {/* CLIENTS DROPDOWN */}
            <div className="mb-1">
              <button
                onClick={() => setClientsOpen(!clientsOpen)}
                className={parentClass(clientsOpen)}
              >
                <span className="flex items-center gap-3">
                  <Building2 size={18} />
                  Clients
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    clientsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {clientsOpen && (
                <div className="ml-7 mt-1 space-y-1 border-l border-gray-800 pl-4">
                  <Link
                    to="/admin/clients"
                    className={linkClass("/admin/clients")}
                  >
                    View Clients
                  </Link>

                  <Link
                    to="/admin/clients/create"
                    className={linkClass("/admin/clients/create")}
                  >
                    Create Client
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Governance */}
        <div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">
            Governance
          </p>

          {/* Entities */}
          <div className="mb-1">
            <button
              onClick={() => setEntitiesOpen(!entitiesOpen)}
              className={parentClass(entitiesOpen)}
            >
              <span className="flex items-center gap-3">
                <Building2 size={18} />
                Entities
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${entitiesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {entitiesOpen && (
              <div className="ml-7 mt-1 space-y-1 border-l border-gray-800 pl-4">
                <Link
                  to="/admin/entities/create"
                  className={linkClass("/admin/entities/create")}
                >
                  Create Master Entity
                </Link>
                <Link
                  to="/admin/entities"
                  className={linkClass("/admin/entities")}
                >
                  View Entities
                </Link>
              </div>
            )}
          </div>

          {/* Nature of Business */}
          <div className="mb-1">
            <button
              onClick={() => setNatureOpen(!natureOpen)}
              className={parentClass(natureOpen)}
            >
              <span className="flex items-center gap-3">
                <Building2 size={18} />
                Nature of Business
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${natureOpen ? "rotate-180" : ""}`}
              />
            </button>

            {natureOpen && (
              <div className="ml-7 mt-1 space-y-1 border-l border-gray-800 pl-4">
                <Link
                  to="/admin/nature-of-business/create"
                  className={linkClass("/admin/nature-of-business/create")}
                >
                  Create Nature of Business
                </Link>
                <Link
                  to="/admin/nature-of-business"
                  className={linkClass("/admin/nature-of-business")}
                >
                  View Nature of Business
                </Link>
              </div>
            )}
          </div>

          {/* Compliance Tasks */}
          <div className="mb-1">
            <button
              onClick={() => setComplianceOpen(!complianceOpen)}
              className={parentClass(complianceOpen)}
            >
              <span className="flex items-center gap-3">
                <Calculator size={18} />
                Tasks Master
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${complianceOpen ? "rotate-180" : ""}`}
              />
            </button>

            {complianceOpen && (
              <div className="ml-7 mt-1 space-y-1 border-l border-gray-800 pl-4">
                <Link
                  to="/admin/compliance-tasks/create"
                  className={linkClass("/admin/compliance-tasks/create")}
                >
                  Create Compliance Task
                </Link>
                <Link
                  to="/admin/compliance-tasks"
                  className={linkClass("/admin/compliance-tasks")}
                >
                  View Compliance Tasks
                </Link>
              </div>
            )}
          </div>

          {/* Compliance Masters */}
          <div className="mb-1">
            <button
              onClick={() => setComplianceMasterOpen(!complianceMasterOpen)}
              className={parentClass(complianceMasterOpen)}
            >
              <span className="flex items-center gap-3">
                <ShieldCheck size={18} />
                Compliance Masters
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${complianceMasterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {complianceMasterOpen && (
              <div className="ml-7 mt-1 space-y-1 border-l border-gray-800 pl-4">
                <Link
                  to="/admin/compliances/create"
                  className={linkClass("/admin/compliances/create")}
                >
                  Create Compliance Master
                </Link>
                <Link
                  to="/admin/compliances"
                  className={linkClass("/admin/compliances")}
                >
                  View Compliance Masters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
