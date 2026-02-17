import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaBuilding, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUserCircle,
  FaTachometerAlt
} from 'react-icons/fa';
import useAuthStore from '../store/authStore';

const Layout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Define navigation based on user role
  const getNavigation = () => {
    const commonNav = [
      { name: 'Dashboard', href: `/${user.role.toLowerCase()}`, icon: FaTachometerAlt, current: location.pathname === `/${user.role.toLowerCase()}` },
    ];

    switch (user.role) {
      case 'CA':
        return [
          ...commonNav,
          { name: 'Users', href: '/users', icon: FaUsers, current: location.pathname.startsWith('/users') },
          { name: 'Clients', href: '/clients', icon: FaBuilding, current: location.pathname.startsWith('/clients') },
          { name: 'Businesses', href: '/businesses', icon: FaBuilding, current: location.pathname.startsWith('/businesses') },
          { name: 'Audit Logs', href: '/audit', icon: FaCog, current: location.pathname.startsWith('/audit') },
        ];

      case 'ACCOUNTANT':
        return [
          ...commonNav,
          { name: 'My Team', href: '/team', icon: FaUsers, current: location.pathname.startsWith('/team') },
          { name: 'Clients', href: '/clients', icon: FaBuilding, current: location.pathname.startsWith('/clients') },
          { name: 'Businesses', href: '/businesses', icon: FaBuilding, current: location.pathname.startsWith('/businesses') },
        ];

      case 'CLIENT':
        return [
          ...commonNav,
          { name: 'Businesses', href: '/businesses', icon: FaBuilding, current: location.pathname.startsWith('/businesses') },
          { name: 'Profile', href: '/profile', icon: FaUser, current: location.pathname.startsWith('/profile') },
        ];

      default:
        return commonNav;
    }
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FaHome className="text-white text-sm" />
            </div>
            <span className="font-bold text-xl text-gray-800">CA Platform</span>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-white text-lg" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.role}</p>
              {user?.employeeId && (
                <p className="text-xs text-gray-500">{user.employeeId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md transition-colors ${
                  item.current
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars className="text-gray-500" />
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, {user?.name}
              </span>

              {/* User menu */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <FaUserCircle className="h-8 w-8 text-gray-400" />
                  <FaChevronDown className="h-4 w-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <a
                      href="/profile"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/profile');
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaUser className="mr-3 h-4 w-4" />
                      Profile
                    </a>
                    <a
                      href="/change-password"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/change-password');
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaCog className="mr-3 h-4 w-4" />
                      Change Password
                    </a>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;