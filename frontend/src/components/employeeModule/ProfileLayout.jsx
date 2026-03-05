import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Shield, Settings as SettingsIcon, LogOut } from 'lucide-react';
import EditProfile from './profile/EditProfile';
import Security from './profile/Security';
import SettingsView from './profile/SettingsView';

const ProfileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // The base path is just /profile for the layout, but the content renders the tabs
  const currentPath = location.pathname ;

  const navigateTo = (path) => {
    navigate(path);
  };

  const getHeaderTitle = () => {
    if (currentPath.includes('/profile/security')) return 'Security & Privacy';
    if (currentPath.includes('/profile/settings')) return 'Settings';
    return 'Edit profile';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(-1)} 
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{getHeaderTitle()}</h1>
      </header>

      {/* Main Content Area - Split view on Desktop, Stacked on Mobile */}
      <div className="p-4 md:p-8 w-full max-w-6xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Sidebar Menu (Matches Figma screen #1 for root /profile view) */}
          <div className={`lg:col-span-4 flex flex-col space-y-4 ${currentPath === '/employee/profile' ? 'block' : 'hidden lg:flex'}`}>
            
            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center mb-2">
              <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-md mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                  alt="User profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 overflow-hidden py-2">
              <button 
                onClick={() => navigateTo('/employee/profile/edit')}
                className={`w-full cursor-pointer flex items-center space-x-4 px-6 py-4 transition-colors ${currentPath === '/employee/profile' || currentPath === '/employee/profile/edit' ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
              >
                <div className={`p-2 rounded-full ${currentPath === '/employee/profile' || currentPath === '/employee/profile/edit' ? 'bg-[#3A565A] text-white' : 'bg-slate-100 text-[#3A565A]'}`}>
                  <User size={20} />
                </div>
                <span className={`font-semibold text-base ${currentPath === '/employee/profile' || currentPath === '/employee/profile/edit' ? 'text-slate-900' : 'text-slate-600'}`}>Edit Profile</span>
              </button>

              <button 
                onClick={() => navigateTo('/employee/profile/security')}
                className={`w-full cursor-pointer flex items-center space-x-4 px-6 py-4 transition-colors ${currentPath.includes('/employee/profile/security') ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
              >
                <div className={`p-2 rounded-full ${currentPath.includes('/employee/profile/security') ? 'bg-[#3A565A] text-white' : 'bg-slate-100 text-[#3A565A]'}`}>
                  <Shield size={20} />
                </div>
                <span className={`font-semibold text-base ${currentPath.includes('/employee/profile/security') ? 'text-slate-900' : 'text-slate-600'}`}>Security</span>
              </button>

              <button 
                onClick={() => navigateTo('/employee/profile/settings')}
                className={`w-full cursor-pointer flex items-center space-x-4 px-6 py-4 transition-colors ${currentPath.includes('/employee/profile/settings') ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
              >
                <div className={`p-2 rounded-full ${currentPath.includes('/employee/profile/settings') ? 'bg-[#3A565A] text-white' : 'bg-slate-100 text-[#3A565A]'}`}>
                  <SettingsIcon size={20} />
                </div>
                <span className={`font-semibold text-base ${currentPath.includes('/employee/profile/settings') ? 'text-slate-900' : 'text-slate-600'}`}>Setting</span>
              </button>
              
              <button 
                className="w-full cursor-pointer flex items-center space-x-4 px-6 py-4 transition-colors hover:bg-red-50"
              >
                <div className="p-2 rounded-full bg-slate-100 text-red-500">
                  <LogOut size={20} />
                </div>
                <span className="font-semibold text-base text-red-500">Logout</span>
              </button>
            </div>
          </div>

          <div className={`lg:col-span-8 ${currentPath === '/employee/profile' ? 'hidden lg:block' : 'block'}`}>
            <Routes>
              <Route path="/" element={<EditProfile />} />
              <Route path="edit" element={<EditProfile />} />
              <Route path="security/*" element={<Security />} />
              <Route path="settings/*" element={<SettingsView />} />
            </Routes>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProfileLayout;
