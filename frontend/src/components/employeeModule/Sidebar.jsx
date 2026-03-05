import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Layers, 
  BarChart2, 
  MessageSquare, 
  Clock, 
  Settings 
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/employee' },
  { id: 'clients', label: 'Clients Management', icon: Users, path: '/employee/clients' },
  { id: 'team', label: 'Team Management', icon: UserPlus, path: '/employee/team' },
  { id: 'resources', label: 'Resources', icon: Layers, path: '/employee/resources' },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart2, path: '/employee/reports' },
  { id: 'communication', label: 'Communication', icon: MessageSquare, path: '/employee/communication' },
  { id: 'attendance', label: 'Attendance & Time Tracking', icon: Clock, path: '/employee/attendance' },
];

const Sidebar = ({ className = '', currentView = 'dashboard', onNavClick }) => {
  return (
    <div className={`bg-white h-full py-8 px-6 flex flex-col ${className}`}>
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden mb-4 border-2 border-white shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
            alt="User profile" 
            className="w-full h-full object-cover"
          />
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
          to="/employee/profile"
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

export default Sidebar;
