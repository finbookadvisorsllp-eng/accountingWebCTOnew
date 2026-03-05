import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ChevronRight, Languages, BellRing } from 'lucide-react';

const supportedLangs = [
  { id: 'en_us', label: 'English (US)' },
  { id: 'en_uk', label: 'English (UK)' }
];

const otherLangs = [
  { id: 'mandarin', label: 'Mandarin' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'spanish', label: 'Spanish' },
  { id: 'french', label: 'French' },
  { id: 'arabic', label: 'Arabic' },
  { id: 'bengali', label: 'Bengali' },
  { id: 'russian', label: 'Russian' },
  { id: 'portuguese', label: 'Portuguese' }
];

const LanguageSelection = () => {
  const [selectedLang, setSelectedLang] = useState('en_us');

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-sm mx-auto w-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Language</h2>
      
      <div className="space-y-6">
        <div>
           <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Supported</h3>
           <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             {supportedLangs.map((lang, idx) => (
                <label 
                  key={lang.id} 
                  className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${idx !== supportedLangs.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <span className="text-sm font-medium text-slate-700">{lang.label}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedLang === lang.id ? 'border-[#3A565A]' : 'border-slate-300'}`}>
                     {selectedLang === lang.id && <div className="w-2.5 h-2.5 bg-[#3A565A] rounded-full"></div>}
                  </div>
                  <input 
                    type="radio" 
                    name="language" 
                    value={lang.id} 
                    checked={selectedLang === lang.id}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="hidden" 
                  />
                </label>
             ))}
           </div>
        </div>

        <div>
           <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Others</h3>
           <div className="bg-white flex flex-col rounded-xl border border-slate-200 shadow-sm overflow-hidden h-64 overflow-y-auto scrollbar-hide">
             {otherLangs.map((lang, idx) => (
                <label 
                  key={lang.id} 
                  className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${idx !== otherLangs.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <span className="text-sm font-medium text-slate-700">{lang.label}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedLang === lang.id ? 'border-[#3A565A]' : 'border-slate-300'}`}>
                     {selectedLang === lang.id && <div className="w-2.5 h-2.5 bg-[#3A565A] rounded-full"></div>}
                  </div>
                  <input 
                    type="radio" 
                    name="language" 
                    value={lang.id} 
                    checked={selectedLang === lang.id}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="hidden" 
                  />
                </label>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};


const SettingsSubMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center max-w-sm mx-auto w-full pt-4 space-y-4">
      <p className="text-slate-500 text-sm mb-4 text-center px-4">Customize your app experience to match your workflow and preferences.</p>

      <button 
        onClick={() => navigate('/employee/profile/settings/language')}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-colors group"
      >
        <div className="flex items-center space-x-4">
           <div className="bg-[#3A565A] text-white p-2.5 rounded-full shadow-sm">
             <Languages size={20} />
           </div>
           <span className="font-bold text-slate-700">Language Selection</span>
        </div>
        <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
      </button>

      <button 
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-colors group"
      >
        <div className="flex items-center space-x-4">
           <div className="bg-[#3A565A] text-white p-2.5 rounded-full shadow-sm">
             <BellRing size={20} />
           </div>
           <span className="font-bold text-slate-700">Notification Preferences</span>
        </div>
        <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
      </button>
    </div>
  )
}

const SettingsView = () => {
  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-6 md:p-8 h-full min-h-[500px]">
      <Routes>
        <Route path="/" element={<SettingsSubMenu />} />
        <Route path="language" element={<LanguageSelection />} />
      </Routes>
    </div>
  );
};

export default SettingsView;
