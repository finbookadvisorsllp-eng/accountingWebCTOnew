import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Bell, Menu, ChevronRight, FileText, Calendar as CalendarIcon, CheckSquare } from 'lucide-react';
import CompanySelector from './CompanySelector';

const ClientMaster = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Temporary mock ID if not provided in URL
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full pb-8">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <ArrowLeft 
            size={28} 
            className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
            onClick={() => navigate(`/employee/clients/${clientId}`)}
          />
        </div>
        <div className="flex items-center space-x-6 text-slate-600">
          <Search size={24} className="cursor-pointer hover:text-[#3A565A] transition-colors" />
          <div className="relative cursor-pointer hover:text-[#3A565A] transition-colors">
            <Bell size={24} />
            <span className="absolute -top-1.5 -right-2 bg-[#F97369] text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">4</span>
          </div>
          <Menu size={28} className="cursor-pointer md:hidden hover:text-[#3A565A] transition-colors" onClick={onMenuClick} />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-3xl mx-auto space-y-6">
        
        <CompanySelector />

        {/* KYC Details Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col space-y-4">
           <div className="flex items-start space-x-3">
              <div className="p-2 bg-slate-50 rounded-lg">
                 <FileText size={24} className="text-[#3A565A]" />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800 text-lg">KYC Details</h3>
                 <p className="text-slate-500 text-sm mt-1">Secure and verify your identity for seamless compliance and financial safety.</p>
              </div>
           </div>
           
           <button 
             onClick={() => navigate(`/employee/clients/${clientId}/master/kyc`)}
             className="w-full bg-[#3A565A] text-white rounded-xl py-3 px-4 flex items-center justify-between hover:bg-[#2a3e41] transition-colors mt-2"
           >
             <span className="font-medium">View details</span>
             <ChevronRight size={20} className="text-white/80" />
           </button>
        </div>

        {/* Compliance Calendar Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col space-y-4">
           <div className="flex items-start space-x-3">
              <div className="p-2 bg-slate-50 rounded-lg">
                 <CalendarIcon size={24} className="text-[#3A565A]" />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800 text-lg">Compliance Calendar</h3>
                 <p className="text-slate-500 text-sm mt-1">Stay ahead of deadlines with an organized compliance schedule and timely reminders.</p>
              </div>
           </div>
           
           {/* Visual mock of the bar chart in the card */}
           <div className="flex items-end space-x-2 h-16 pt-2 pb-2">
              <div className="w-1/6 bg-[#6DA4A4] rounded-t-sm h-[60%]"></div>
              <div className="w-1/6 bg-amber-400 rounded-t-sm h-[80%]"></div>
              <div className="w-1/6 bg-[#F97369] rounded-t-sm h-[40%]"></div>
              <div className="w-1/6 bg-yellow-400 rounded-t-sm h-[90%]"></div>
              <div className="w-1/6 bg-blue-400 rounded-t-sm h-[70%]"></div>
              <div className="w-1/6 bg-[#F97369] rounded-t-sm h-[50%]"></div>
           </div>

           <button 
             onClick={() => navigate(`/employee/clients/${clientId}/master/compliance`)}
             className="w-full bg-[#3A565A] text-white rounded-xl py-3 px-4 flex items-center justify-between hover:bg-[#2a3e41] transition-colors"
           >
             <span className="font-medium">View details</span>
             <ChevronRight size={20} className="text-white/80" />
           </button>
        </div>

        {/* Task List Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col space-y-4">
           <div className="flex items-start space-x-3">
              <div className="p-2 bg-slate-50 rounded-lg">
                 <CheckSquare size={24} className="text-[#3A565A]" />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800 text-lg">Task list</h3>
                 <p className="text-slate-500 text-sm mt-1">Easily manage, track, and complete your daily tasks for better productivity.</p>
              </div>
           </div>
           
           {/* Status indicators mock */}
           <div className="flex items-center space-x-4 pt-2 pb-2">
              <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span><span className="text-sm font-semibold text-slate-700">08</span></div>
              <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span><span className="text-sm font-semibold text-slate-700">02</span></div>
              <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="text-sm font-semibold text-slate-700">01</span></div>
           </div>

           <button 
             onClick={() => navigate(`/employee/clients/${clientId}/master/tasks`)}
             className="w-full bg-[#3A565A] text-white rounded-xl py-3 px-4 flex items-center justify-between hover:bg-[#2a3e41] transition-colors"
           >
             <span className="font-medium">View task list</span>
             <ChevronRight size={20} className="text-white/80" />
           </button>
        </div>

      </div>
    </div>
  );
};

export default ClientMaster;
