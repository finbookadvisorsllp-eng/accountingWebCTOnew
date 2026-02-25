import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

// --- Inline Icons (No dependencies required) ---
const Menu = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const Search = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const Bell = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const User = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Settings = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LogOut = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  // Safe optional chaining in case useAuthStore is not ready or user is null
  const { user, logout } = useAuthStore
    ? useAuthStore()
    : { user: null, logout: () => {} };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
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

  return (
    <header className="h-14 bg-white border-b border-gray-100 sticky top-0 z-40 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center flex-1">
        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden mr-3 text-gray-500 p-1.5 hover:bg-gray-50 rounded-md transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-50 px-3 py-1.5 rounded-lg w-80 group border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
          <Search
            className="text-gray-400 group-focus-within:text-blue-500"
            size={14}
          />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:ring-0 text-xs ml-2.5 w-full placeholder-gray-400 text-gray-700 outline-none h-full"
          />
          <span className="text-[10px] font-semibold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100 shadow-sm">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative text-gray-400 hover:text-blue-600 transition-colors p-1">
          <Bell size={18} />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-[1px] bg-gray-100 mx-1"></div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-700 group-hover:text-blue-700 transition-colors leading-tight">
                {user?.name || "System Admin"}
              </p>
              <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide">
                {user?.role || "Admin"}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center shadow-sm group-hover:border-blue-200 transition-all">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=3B82F6&color=fff&size=64`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden ring-1 ring-black ring-opacity-5 z-50">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-50">
                <p className="text-xs font-bold text-gray-800 truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
              <div className="p-1">
                <button className="w-full flex items-center px-2 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                  <User className="mr-2 text-gray-400" size={14} /> Account
                </button>
                <button className="w-full flex items-center px-2 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors">
                  <Settings className="mr-2 text-gray-400" size={14} /> Settings
                </button>
                <div className="my-1 border-t border-gray-50"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors font-semibold"
                >
                  <LogOut className="mr-2" size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;