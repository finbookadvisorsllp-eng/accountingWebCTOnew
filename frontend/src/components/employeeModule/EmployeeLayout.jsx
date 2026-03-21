import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ContractAcceptanceWall from './ContractAcceptanceWall';

const EmployeeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contractAccepted, setContractAccepted] = useState(true); // default true to avoid flash
  const location = useLocation();

  useEffect(() => {
    // Check contract acceptance status from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role === "employee") {
      setContractAccepted(user.contractAccepted === true);
    }
  }, []);

  // Determine current active view for the sidebar highlight
  let currentView = 'dashboard';
  if (location.pathname.includes('/clients')) {
    currentView = 'clients';
  } else if (location.pathname.includes('/team')) {
    currentView = 'team';
  } else if (location.pathname.includes('/resources')) {
    currentView = 'resources';
  } else if (location.pathname.includes('/attendance')) {
    currentView = 'attendance';
  } else if (location.pathname.includes('/reports')) {
    currentView = 'reports';
  } else if (location.pathname.includes('/communication')) {
    currentView = 'communication';
  } else if (location.pathname.includes('/reschedule')) {
    currentView = 'reschedule';
  }

  // Get user ID for contract acceptance
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ─── Contract Gate ───
  if (user.role === "employee" && !contractAccepted) {
    return (
      <ContractAcceptanceWall
        userId={user._id}
        onAccepted={() => setContractAccepted(true)}
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          className="w-72 h-full shrink-0 shadow-2xl md:shadow-lg border-r border-slate-200" 
          currentView={currentView}
          onNavClick={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Dashboard / Content Area */}
      <div className="flex-1 h-full overflow-hidden flex flex-col relative bg-[#F9FBFB] w-full">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;
