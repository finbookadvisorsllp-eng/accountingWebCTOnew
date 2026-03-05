import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { EyeOff, ChevronRight, Shield, RefreshCcw } from 'lucide-react';

const PasswordChange = () => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">Change Password</h2>
      <p className="text-slate-500 text-sm mb-8 text-center px-4">Update your password to enhance security.</p>
      
      <form className="space-y-5 max-w-sm mx-auto w-full">
        <div className="relative">
          <input 
            type="password" 
            placeholder="Current password"
            className="w-full bg-white border border-slate-300 text-slate-800 font-medium rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-all text-sm pr-12"
          />
          <EyeOff size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>

        <div className="relative">
          <input 
            type="password" 
            placeholder="New Password"
            className="w-full bg-white border border-slate-300 text-slate-800 font-medium rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-all text-sm pr-12"
          />
          <EyeOff size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>

        <div className="relative">
          <input 
            type="password" 
            placeholder="Confirm New Password"
            className="w-full bg-white border border-slate-300 text-slate-800 font-medium rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-all text-sm pr-12"
          />
          <EyeOff size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>

        <div className="pt-6">
          <button 
            type="button"
            className="w-full bg-[#3A565A] text-white font-bold rounded-full px-6 py-4 hover:bg-[#2c4245] transition-colors shadow-sm"
          >
            Update password
          </button>
        </div>
      </form>
    </div>
  );
};

const AccountRecovery = () => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">Account Recovery</h2>
      <p className="text-slate-500 text-sm mb-8 text-center px-4">Set up recovery options to regain access if you forget your password.</p>
      
      <form className="space-y-5 max-w-sm mx-auto w-full">
        <div>
          <input 
            type="email" 
            placeholder="Add Recovery Email"
            className="w-full bg-white border border-slate-300 text-slate-800 font-medium rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-all text-sm"
          />
        </div>

        <div>
          <input 
            type="tel" 
            placeholder="Add Recovery Phone Number"
            className="w-full bg-white border border-slate-300 text-slate-800 font-medium rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-all text-sm"
          />
        </div>

        <div className="pt-6">
          <button 
            type="button"
            className="w-full bg-[#3A565A] text-white font-bold rounded-full px-6 py-4 hover:bg-[#2c4245] transition-colors shadow-sm"
          >
            Save Recovery Options
          </button>
        </div>
      </form>
    </div>
  );
};

const SecurityMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center max-w-sm mx-auto w-full pt-8 space-y-4">
      <button 
        onClick={() => navigate('/employee/profile/security/password')}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-colors group"
      >
        <div className="flex items-center space-x-4">
           <div className="bg-[#3A565A] text-white p-2.5 rounded-full shadow-sm">
             <Shield size={20} />
           </div>
           <span className="font-bold text-slate-700">Password Change</span>
        </div>
        <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
      </button>

      <button 
        onClick={() => navigate('/employee/profile/security/recovery')}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-colors group"
      >
        <div className="flex items-center space-x-4">
           <div className="bg-[#3A565A] text-white p-2.5 rounded-full shadow-sm">
             <RefreshCcw size={20} />
           </div>
           <span className="font-bold text-slate-700">Account Recovery Setup</span>
        </div>
        <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
      </button>
    </div>
  )
}

const Security = () => {
  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-6 md:p-8 h-full min-h-[500px]">
      <Routes>
        <Route path="/" element={<SecurityMenu />} />
        <Route path="password" element={<PasswordChange />} />
        <Route path="recovery" element={<AccountRecovery />} />
      </Routes>
    </div>
  );
};

export default Security;
