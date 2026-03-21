import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import ClientSidebar from './ClientSidebar';
import ClientHeader from './ClientHeader';

const ClientLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine current active view for the sidebar highlight
  let currentView = 'dashboard';
  if (location.pathname.includes('/reschedule')) {
    currentView = 'reschedule';
  } else if (location.pathname.includes('/financials')) {
    currentView = 'financials';
  } else if (location.pathname.includes('/queries')) {
    currentView = 'queries';
  } else if (location.pathname.includes('/profile')) {
    currentView = 'profile';
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
        <ClientSidebar 
          className="w-64 h-full shrink-0 shadow-2xl md:shadow-lg border-r border-slate-200" 
          currentView={currentView}
          onNavClick={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Dashboard / Content Area */}
      <div className="flex-1 h-full overflow-hidden flex flex-col relative bg-[#F9FBFB] w-full">
        <ClientHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
