import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  RefreshCcw, 
  Clock, 
  Settings,
  FileText,
  MessageSquare
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/client/dashboard' },
  { id: 'reschedule', label: 'Reschedule Requests', icon: RefreshCcw, path: '/client/reschedule' },
  { id: 'financials', label: 'Financials', icon: FileText, path: '/client/financials' },
  { id: 'queries', label: 'Queries', icon: MessageSquare, path: '/client/queries' },
];

const ClientSidebar = ({ className = '', currentView = 'dashboard', onNavClick }) => {
  return (
    <div className={`bg-white h-full py-8 px-6 flex flex-col ${className}`}>
      {/* Brand logo frame or profile can fit here */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3A565A] to-[#6DA4A4] flex items-center justify-center text-white text-xl font-bold shadow-md">
          C
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = item.id === currentView;
          const Icon = item.icon;
          return (
            <Link 
              key={item.id}
              to={item.path}
              onClick={onNavClick}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors cursor-pointer text-sm font-medium ${
                isActive 
                  ? 'bg-[#3A565A] text-white shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings at the bottom */}
      <div className="mt-auto">
        <Link 
          to="/client/profile"
          onClick={onNavClick}
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors cursor-pointer text-sm font-medium ${
            currentView === 'profile' 
              ? 'bg-[#3A565A] text-white shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings size={20} className={currentView === 'profile' ? 'text-white' : 'text-slate-400'} />
          <span>Setting</span>
        </Link>
      </div>
    </div>
  );
};

export default ClientSidebar;
