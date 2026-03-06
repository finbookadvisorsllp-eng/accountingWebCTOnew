import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { 
  ArrowLeft, User, Shield, Briefcase, MapPin, Users, FileText, Phone, Camera, LogOut 
} from 'lucide-react';
import { candidateAPI } from "../../services/api";

import EditProfile from './profile/EditProfile';
import Security from "./profile/Security";
import SettingsView from './profile/SettingsView';

const ProfileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const currentPath = location.pathname;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user._id) {
        const res = await candidateAPI.getCandidate(user._id);
        setProfile(res.data.data);
      }
    } catch {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be less than 2MB");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const formData = new FormData();
      formData.append("profileAvatar", file);
      
      // Send only the avatar to preserve other fields
      const res = await candidateAPI.updateOwnProfile(user._id, formData);
      setProfile(res.data.data);
      setAvatarPreview(null);
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Failed to update profile picture");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getHeaderTitle = () => {
    if (currentPath.includes('basic')) return 'Basic Information';
    if (currentPath.includes('employment')) return 'Employment Details';
    if (currentPath.includes('contact')) return 'Contact & Address';
    if (currentPath.includes('family')) return 'Family Details';
    if (currentPath.includes('legal')) return 'Legal & Banking';
    if (currentPath.includes('emergency')) return 'Emergency Contact';
    if (currentPath.includes('security')) return 'Security Settings';
    return 'Profile';
  };

  const NavItem = ({ path, icon: Icon, label }) => {
    const isActive = currentPath.includes(path);
    return (
      <button 
        onClick={() => navigate(`/employee/profile/${path}`)}
        className={`w-full cursor-pointer flex items-center space-x-4 px-6 py-3.5 transition-colors ${isActive ? 'bg-[#3A565A]/5 border-r-4 border-[#3A565A]' : 'hover:bg-slate-50 border-r-4 border-transparent'}`}
      >
        <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-[#3A565A] text-white shadow-md' : 'bg-slate-100 text-[#3A565A]'}`}>
          <Icon size={18} />
        </div>
        <span className={`font-semibold text-sm ${isActive ? 'text-[#3A565A]' : 'text-slate-600'}`}>{label}</span>
      </button>
    );
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = API_URL.replace("/api", "");

  // Completion calculation (same as before to show the bar)
  const calcCompletion = (data) => {
    if (!data) return 0;
    const checks = [
      !!data.personalInfo?.firstName, !!data.personalInfo?.email,
      !!data.familyBackground?.fatherSpouseFirstName || !!data.familyBackground?.fatherOrSpouseName,
      !!data.familyBackground?.fatherSpouseContact,
      !!data.contactInfo?.permanentAddress?.address,
      data.detailedEducation?.length > 0, data.detailedWorkExperience?.length > 0,
      !!data.legalCompliance?.aadharNumber, !!data.legalCompliance?.panNumber,
      !!data.legalCompliance?.bankDetails?.accountNumber,
      !!data.contractInfo?.digitalSignature, !!data.contractInfo?.depositConfirmed,
      !!data.legalCompliance?.emergencyContact?.name, !!data.legalCompliance?.emergencyContact?.contact,
      !!data.adminInfo?.employeeId, !!data.adminInfo?.designation,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9FBFB]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3A565A]" />
      </div>
    );
  }

  const completion = calcCompletion(profile);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={24} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate('/employee/dashboard')} 
        />
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{getHeaderTitle()}</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Sidebar (Instagram Style) */}
          <div className={`lg:col-span-4 flex flex-col space-y-4 ${currentPath === '/employee/profile' ? 'block' : 'hidden lg:flex'} sticky top-28`}>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden relative">
              {/* Background Accent */}
              <div className="h-24 bg-gradient-to-br from-[#3A565A]/10 to-[#3A565A]/5 w-full absolute top-0 left-0" />
              
              {/* Profile Header in Sidebar */}
              <div className="pt-8 pb-6 px-6 relative z-10 flex flex-col items-center border-b border-slate-100">
                <div className="relative mb-4 group">
                  <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-[#3A565A] to-[#2c4245] p-1 shadow-lg">
                    <div className="w-full h-full rounded-[1.3rem] bg-white overflow-hidden flex items-center justify-center border-2 border-white">
                      {(avatarPreview || profile?.profileAvatar) ? (
                        <img 
                          src={avatarPreview || `${BASE_URL}${profile.profileAvatar}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-[#3A565A] opacity-50">
                          {profile?.personalInfo?.firstName?.[0] || "U"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center text-[#3A565A] hover:bg-slate-50 hover:scale-105 transition-all"
                  >
                    <Camera size={16} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                </div>

                <h2 className="text-xl font-black text-slate-800 tracking-tight text-center">
                  {profile?.personalInfo?.firstName} {profile?.personalInfo?.lastName}
                </h2>
                <p className="text-xs font-bold text-[#3A565A] uppercase tracking-widest mt-1 text-center">
                  {profile?.adminInfo?.designation || "Employee"}
                </p>

                {/* Completion Bar */}
                <div className="w-full mt-5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    <span>Profile Complete</span>
                    <span className={completion === 100 ? "text-green-500" : "text-[#3A565A]"}>{completion}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${completion === 100 ? 'bg-green-500' : 'bg-[#3A565A]'}`}
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="py-3 flex flex-col">
                <NavItem path="basic" icon={User} label="Basic Information" />
                <NavItem path="employment" icon={Briefcase} label="Employment Details" />
                <NavItem path="contact" icon={MapPin} label="Contact & Address" />
                <NavItem path="family" icon={Users} label="Family Details" />
                <NavItem path="legal" icon={FileText} label="Legal & Banking" />
                <NavItem path="emergency" icon={Phone} label="Emergency Contact" />
                
                <div className="my-2 mx-6 border-t border-slate-100" />
                
                <NavItem path="security" icon={Shield} label="Security & Settings" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full cursor-pointer flex items-center space-x-4 px-6 py-3.5 transition-colors hover:bg-red-50 mt-2"
                >
                  <div className="p-2 rounded-xl bg-red-100 text-red-500">
                    <LogOut size={18} />
                  </div>
                  <span className="font-bold text-sm text-red-600">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area (Forms) */}
          <div className={`lg:col-span-8 ${currentPath === '/employee/profile' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden min-h-[600px]">
              <Routes>
                {/* Redirect base profile to basic info */}
                <Route path="/" element={<Navigate to="basic" replace />} />
                
                {/* Security handled manually to avoid parameter collision */}
                <Route path="security/*" element={<Security />} />
                
                {/* All other forms will be handled by EditProfile which picks the active tab */}
                <Route path=":section" element={<EditProfile profileContext={{ profile, setProfile, fetchProfile }} />} />
              </Routes>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
