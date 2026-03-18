import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, FileText, ChevronDown } from 'lucide-react';
import CompanySelector from './CompanySelector';

const mockHistoryOptions = [
  { id: 'company-kyc', title: 'Company KYC', status: 'Last Updated: Jan 2024' },
  { id: 'owner-kyc', title: 'Owner KYC', status: 'Status: Pending' },
  { id: 'itr', title: 'Income Tax Return', status: 'Last Filed: March 2023' },
  { id: 'audit', title: 'Audit Balance Sheet', status: 'Next Due: July 2024' },
  { id: 'gst', title: 'GST Return', status: 'Last Filed: April 2024' },
];

const HistoricalData = () => {
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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Historical Data</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-3xl mx-auto space-y-6">
        
        <CompanySelector />

        {/* History Options List */}
        <div className="space-y-4 pt-2">
           {mockHistoryOptions.map((option) => (
             <div 
               key={option.id}
               onClick={() => navigate(`/employee/clients/${clientId}/history/${option.id}`)}
               className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-[#3A565A]/40 transition-all flex items-center justify-between cursor-pointer group"
             >
                <div className="flex items-center space-x-4">
                   <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-[#3A565A] transition-colors border border-slate-100">
                     <FileText size={22} />
                   </div>
                   <div className="flex flex-col">
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#3A565A] transition-colors">{option.title}</h3>
                      <p className="text-slate-500 text-sm mt-0.5">{option.status}</p>
                   </div>
                </div>
                
                <ChevronRight size={24} className="text-slate-400 group-hover:text-[#3A565A] group-hover:translate-x-1 transition-transform" />
             </div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default HistoricalData;
