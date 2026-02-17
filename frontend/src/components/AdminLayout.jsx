import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaCalculator,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaUserCircle,
  FaCog,
  FaBell,
  FaSearch,
  FaChartBar,
  FaShieldAlt,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import useAuthStore from "../store/authStore";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuGroups = [
    {
      group: "Overview",
      items: [
        { path: "/admin/dashboard", icon: <FaChartBar />, label: "Analytics" },
      ],
    },
    {
      group: "Management",
      items: [
        { path: "/admin/candidates", icon: <FaUsers />, label: "Candidates" },
        {
          path: "/admin/candidates?status=ACTIVE",
          icon: <FaUsers />,
          label: "Employees",
        },
        { path: "#", icon: <FaUsers />, label: "Clients" },
      ],
    },
    {
      group: "Governance",
      items: [
        {
          path: "#",
          icon: <FaShieldAlt />,
          label: "Compliance",
        },
        { path: "#", icon: <FaCalculator />, label: "Entities" },
      ],
    },
  ];

  // 🔥 FIXED ACTIVE CHECK
  const isActiveLink = (path) => {
    return location.pathname + location.search === path;
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans antialiased text-slate-900">
      <aside
        className={`fixed inset-y-0 left-0 bg-[#0F172A] w-64 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FaCalculator className="text-white text-sm" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white uppercase">
              Accoun<span className="text-blue-400">Tech</span>
            </span>
          </Link>
        </div>

        <div className="py-6 px-4 space-y-8 overflow-y-auto h-[calc(100vh-64px)]">
          {menuGroups.map((group, i) => (
            <div key={i}>
              <h4 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-3">
                {group.group}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActiveLink(item.path)
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-6">
          <div className="flex items-center flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mr-4 text-slate-500 p-2 hover:bg-slate-100 rounded-md"
            >
              <FaBars size={20} />
            </button>

            <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-xl w-96 group border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
              <FaSearch className="text-slate-400 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search candidates, clients, or files..."
                className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full placeholder-slate-400 outline-none"
              />
              <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                ⌘K
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
              <FaBell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">
                    System Admin
                  </p>
                  <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-wider">
                    {user?.role}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`}
                    alt="Admin"
                  />
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-1 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm font-bold truncate text-slate-900">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {user?.email || "admin@core.tech"}
                    </p>
                  </div>
                  <div className="p-1">
                    <button className="w-full flex items-center px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                      <FaUserCircle className="mr-3 text-slate-400" /> Account
                      Details
                    </button>
                    <button className="w-full flex items-center px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                      <FaCog className="mr-3 text-slate-400" /> Settings
                    </button>
                    <div className="my-1 border-t border-slate-100"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold"
                    >
                      <FaSignOutAlt className="mr-3" /> Terminate Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
