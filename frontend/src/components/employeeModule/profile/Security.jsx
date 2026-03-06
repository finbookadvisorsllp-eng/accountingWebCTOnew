import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { EyeOff, ChevronRight, Shield, RefreshCcw, ArrowLeft, Globe, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { candidateAPI } from "../../../services/api";

const PasswordChange = () => {
  const navigate = useNavigate();
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match!");
    }

    setChangingPassword(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await candidateAPI.changePassword(user._id, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed securely!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      navigate("/employee/profile/security");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/employee/profile/security')} className="p-2 hover:bg-slate-50 text-slate-500 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Change Password</h2>
      </div>
      <p className="text-slate-500 text-sm mb-8 px-2 max-w-sm">Update your password to enhance security.</p>
      
      <form onSubmit={handleChangePassword} className="space-y-5 max-w-sm w-full">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-2">Current Password</label>
          <div className="relative">
            <input 
              type="password" 
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
              placeholder="Enter current password"
              className="w-full bg-slate-50 text-slate-800 font-medium rounded-xl px-4 py-3 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 focus:bg-white transition-all text-sm pr-12"
            />
            <EyeOff size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-2">New Password</label>
          <div className="relative">
            <input 
              type="password" 
              required
              minLength={6}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              placeholder="Enter new password"
              className="w-full bg-slate-50 text-slate-800 font-medium rounded-xl px-4 py-3 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 focus:bg-white transition-all text-sm pr-12"
            />
            <EyeOff size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-2">Confirm New Password</label>
          <div className="relative">
            <input 
              type="password" 
              required
              minLength={6}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              placeholder="Repeat new password"
              className="w-full bg-slate-50 text-slate-800 font-medium rounded-xl px-4 py-3 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 focus:bg-white transition-all text-sm pr-12"
            />
            <EyeOff size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={changingPassword}
            className="w-full bg-[#3A565A] text-white font-bold rounded-xl px-6 py-3.5 hover:bg-[#2c4245] transition-colors shadow-md disabled:opacity-70"
          >
           {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

const AccountRecovery = () => {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/employee/profile/security')} className="p-2 hover:bg-slate-50 text-slate-500 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Account Recovery</h2>
      </div>
      <p className="text-slate-500 text-sm mb-8 px-2 max-w-sm">Set up recovery options to regain access if you forget your password.</p>
      
      <form className="space-y-4 max-w-sm w-full">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-2">Recovery Email</label>
          <input 
            type="email" 
            placeholder="Add Recovery Email"
            className="w-full bg-slate-50 text-slate-800 font-medium rounded-xl px-4 py-3 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 focus:bg-white transition-all text-sm"
          />
        </div>

        <div>
           <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-2">Recovery Phone</label>
          <input 
            type="tel" 
            placeholder="Add Recovery Phone Number"
            className="w-full bg-slate-50 text-slate-800 font-medium rounded-xl px-4 py-3 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 focus:bg-white transition-all text-sm"
          />
        </div>

        <div className="pt-4">
          <button 
            type="button"
            className="w-full bg-[#3A565A] text-white font-bold rounded-xl px-6 py-3.5 hover:bg-[#2c4245] transition-colors shadow-md"
          >
            Save Recovery Options
          </button>
        </div>
      </form>
    </div>
  );
};

const LanguageSettings = () => {
  const navigate = useNavigate();
  // We can save this in a true global state or candidate profile later
  // For now, it's UI functionality
  const [selectedLang, setSelectedLang] = useState('en');

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'zh', name: 'Chinese', native: '中文' }
  ];

  const handleSelectLanguage = (code) => {
    setSelectedLang(code);
    toast.success("Language preference updated!");
    // Later we can integrate this into the backend if necessary
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/employee/profile/security')} className="p-2 hover:bg-slate-50 text-slate-500 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Language Preferences</h2>
      </div>
      <p className="text-slate-500 text-sm mb-8 px-2 max-w-sm">Select your preferred language for the application interface.</p>
      
      <div className="space-y-3 max-w-sm w-full">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleSelectLanguage(lang.code)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedLang === lang.code ? 'border-[#3A565A] bg-[#3A565A]/5' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
          >
            <div className="flex flex-col text-left">
              <span className={`font-bold ${selectedLang === lang.code ? 'text-[#3A565A]' : 'text-slate-700'}`}>{lang.name}</span>
              <span className="text-xs text-slate-400 mt-0.5">{lang.native}</span>
            </div>
            {selectedLang === lang.code && (
              <div className="bg-[#3A565A] text-white p-1 rounded-full">
                <Check size={14} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const SecurityMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col max-w-lg w-full pt-4 space-y-4">
      <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Security Settings</h2>
      <p className="text-sm text-slate-500 mb-4 px-1">Manage your password and secondary security options.</p>

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

      <button 
        onClick={() => navigate('/employee/profile/security/language')}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-colors group"
      >
        <div className="flex items-center space-x-4">
           <div className="bg-[#3A565A] text-white p-2.5 rounded-full shadow-sm">
             <Globe size={20} />
           </div>
           <span className="font-bold text-slate-700">Language Preferences</span>
        </div>
        <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
      </button>
    </div>
  )
}

const Security = () => {
  return (
    <div className="h-full p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-y-auto w-full">
      <Routes>
        <Route path="/" element={<SecurityMenu />} />
        <Route path="password" element={<PasswordChange />} />
        <Route path="recovery" element={<AccountRecovery />} />
        <Route path="language" element={<LanguageSettings />} />
      </Routes>
    </div>
  );
};

export default Security;
