import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import CompanySelector from './CompanySelector';

const financialOptions = [
  { id: 'revenue', title: 'Revenue from business', color: 'bg-[#5B8D8D]' },
  { id: 'gst-liability', title: 'GST Liability Cal', color: 'bg-[#8BB250]' },
  { id: 'pndl', title: 'PndL Input Field', color: 'bg-[#B05B43]' },
  { id: 'bs', title: 'BS Input Field', color: 'bg-[#7E6545]' },
  { id: 'due-date', title: 'Due Date Reminder', color: 'bg-[#C17C46]' },
  { id: 'debtors', title: 'Debtors Creditors', color: 'bg-[#3A6B9B]' },
  { id: 'periodic', title: 'Periodic Data', color: 'bg-[#B44B6D]' },
  { id: 'task-progress', title: 'Task Progress', color: 'bg-[#4B9C8B]' },
];

const FinancialData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Financial Data</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-3xl mx-auto space-y-4 pt-6">
        <CompanySelector />
        
        {/* Options List */}
        {financialOptions.map((option) => (
          <div 
            key={option.id}
            onClick={() => {
               if (option.id === 'revenue') navigate(`/employee/clients/${clientId}/financial/revenue`);
               else if (option.id === 'gst-liability') navigate(`/employee/clients/${clientId}/financial/gst-liability`);
               else if (option.id === 'pndl') navigate(`/employee/clients/${clientId}/financial/pndl`);
               else if (option.id === 'bs') navigate(`/employee/clients/${clientId}/financial/bs`);
               else if (option.id === 'due-date') navigate(`/employee/clients/${clientId}/financial/due-date`);
               else if (option.id === 'debtors') navigate(`/employee/clients/${clientId}/financial/debtors`);
               else if (option.id === 'periodic') navigate(`/employee/clients/${clientId}/financial/periodic`);
               else if (option.id === 'task-progress') navigate(`/employee/clients/${clientId}/financial/task-progress`);
            }}
            className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-[#3A565A]/40 transition-all flex items-center justify-between cursor-pointer group relative overflow-hidden"
          >
             {/* Left color bar */}
             <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3/5 rounded-r-md ${option.color}`} />
             
             <div className="pl-4">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#3A565A] transition-colors">{option.title}</h3>
             </div>
             
             <ChevronRight size={24} className="text-slate-400 group-hover:text-[#3A565A] group-hover:translate-x-1 transition-transform" />
          </div>
        ))}

      </div>
    </div>
  );
};

export default FinancialData;
