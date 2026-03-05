import React from 'react';

const EditProfile = () => {
  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-slate-200 p-6 md:p-8 h-full min-h-[500px] flex flex-col">
      <div className="flex flex-col items-center mb-8 lg:hidden">
        <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-md mb-2">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
            alt="User profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <form className="flex-1 space-y-5 max-w-md mx-auto w-full mt-4 lg:mt-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-2">Full Name</label>
          <input 
            type="text" 
            defaultValue="Rajat Rawat"
            className="w-full bg-white border border-slate-300 text-slate-800 font-medium rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-all text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-2">Email</label>
          <input 
            type="email" 
            defaultValue="abcf@gmail.com"
            className="w-full bg-white border border-slate-300 text-slate-800 font-medium rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-all text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-2">Phone number</label>
          <input 
            type="tel" 
            defaultValue="+91 8057235545"
            className="w-full bg-white border border-slate-300 text-slate-800 font-medium rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-all text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-2">Date of birth</label>
          <input 
            type="text" 
            defaultValue="30/12/2000"
            className="w-full bg-white border border-slate-300 text-slate-800 font-medium rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-all text-sm"
          />
        </div>

        <div className="pt-6">
          <button 
            type="button"
            className="w-full bg-[#3A565A] text-white font-bold rounded-full px-6 py-4 hover:bg-[#2c4245] transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
