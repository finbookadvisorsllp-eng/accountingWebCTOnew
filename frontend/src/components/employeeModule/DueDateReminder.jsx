import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud } from 'lucide-react';

const DueDateReminder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-24">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/financial`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Due Date Reminder</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-xl mx-auto space-y-4 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        <div className="bg-white rounded-2xl p-6 md:p-8 space-y-6 shadow-sm border border-slate-200">
           
           <InputField label="Name of Owner" />
           <InputField label="Document No." />
           <InputField label="Due Date" />
           <InputField label="Frequency" />
           <InputField label="Amount Due" />

           {/* Upload Area */}
           <div className="flex justify-between items-start pt-2">
              <span className="text-slate-600 text-sm md:text-base font-medium w-1/3 pt-3">Document</span>
              <div className="w-2/3">
                 <div className="border border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center py-6 cursor-pointer transition-colors group">
                    <UploadCloud size={28} className="text-slate-400 group-hover:text-[#3A565A] mb-2 transition-colors" />
                    <span className="text-xs md:text-sm font-medium text-slate-500 group-hover:text-[#3A565A] transition-colors">Click Here to Upload Files</span>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:px-10 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] mx-auto md:ml-[16.666667%] lg:ml-[20%]">
         <div className="max-w-xl mx-auto flex justify-center w-full">
            <button className="bg-[#3A565A] text-white w-full max-w-[280px] py-3.5 rounded-full font-bold shadow-lg shadow-[#3A565A]/30 hover:bg-[#2a3e41] hover:-translate-y-0.5 transition-all text-lg">
              Save
            </button>
         </div>
      </div>

    </div>
  );
};

const InputField = ({ label }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600 text-sm md:text-base font-medium w-1/3">{label}</span>
    <input 
      type="text" 
      className="w-2/3 bg-white border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A] transition-all text-sm font-medium text-slate-800" 
    />
  </div>
);

export default DueDateReminder;
