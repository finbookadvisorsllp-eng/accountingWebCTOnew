import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import CompanySelector from './CompanySelector';

const reportOptions = [
  { id: 'dashboard', title: 'Client Dashboard', color: 'bg-[#3A565A]', path: 'reports/dashboard' },
  { id: 'mom-sales', title: 'MoM Sales and Purchase', color: 'bg-[#6B8E23]', path: 'reports/mom-sales' },
  { id: 'gst-liability', title: 'GST Calculation', color: 'bg-[#A0522D]', path: 'reports/gst' },
  { id: 'pndl-yoy', title: 'PndL YoY Comparision', color: 'bg-[#696969]', path: 'reports/pndl-yoy' },
  { id: 'bs-yoy', title: 'BS YoY Comparision', color: 'bg-[#BDB76B]', path: 'reports/bs-yoy' },
  { id: 'budget-pndl', title: 'Budget PndL', color: 'bg-[#4682B4]', path: '' },
  { id: 'key-ratios', title: 'Key Ratios', color: 'bg-[#32CD32]', path: 'reports/key-ratios' },
  { id: 'periodic-pndl', title: 'Periodic P&L', color: 'bg-[#6A5ACD]', path: '' },
  { id: 'periodic-key', title: 'Periodic Key Financails', color: 'bg-[#FF8C00]', path: 'reports/periodic' },
];

const ClientFinancialReport = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Client Financial Report</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-3 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <CompanySelector />
        
        {/* Options List */}
        {reportOptions.map((option) => (
          <div 
            key={option.id}
            onClick={() => option.path && navigate(`/employee/clients/${clientId}/${option.path}`)}
            className={`bg-white rounded-xl p-4 shadow-sm border border-slate-200 transition-all flex items-center justify-between relative overflow-hidden ${option.path ? 'cursor-pointer hover:shadow-md hover:border-slate-300 group' : 'opacity-70 cursor-not-allowed'}`}
          >
             {/* Left color bar */}
             <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[65%] rounded-r-md ${option.color}`} />
             
             <div className="pl-5">
                <h3 className="font-medium text-slate-800 text-base md:text-lg group-hover:text-[#3A565A] transition-colors">{option.title}</h3>
             </div>
             
             <ChevronRight size={22} className="text-[#3A565A] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        ))}

      </div>
    </div>
  );
};

export default ClientFinancialReport;
