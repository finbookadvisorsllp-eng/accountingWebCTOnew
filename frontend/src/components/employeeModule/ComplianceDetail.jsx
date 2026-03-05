import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const mockCompliances = [
  { id: 1, name: 'Quarterly GST Filing', compId: '#GST-2024', due: '25th March 2025', freq: 'Quarterly' },
  { id: 2, name: 'Annual Tax Filing', compId: '#ITR-2024', due: '31st March 2025', freq: 'Yearly' },
  { id: 3, name: 'Monthly Payroll Processing', compId: '#PF-2025', due: '5th March 2025', freq: 'Monthly' },
  { id: 4, name: 'Quarterly TDS Filing', compId: '#TDS-2024', due: '25th April 2025', freq: 'Quarterly' },
];

const ComplianceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <ArrowLeft 
            size={28} 
            className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
            onClick={() => navigate(`/employee/clients/${clientId}/master/compliance`)}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Compliance detail</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-4">
        
        {/* Compliance List */}
        {mockCompliances.map((comp) => (
           <div key={comp.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              
              <div className="flex items-baseline justify-between mb-3 border-b border-slate-50 pb-3">
                 <span className="text-slate-500 font-medium text-sm">Compliance Name</span>
                 <span className="font-bold text-slate-800">{comp.name}</span>
              </div>
              
              <div className="flex items-baseline justify-between mb-3 border-b border-slate-50 pb-3">
                 <div className="flex items-center space-x-2 text-slate-500">
                    <span className="font-mono bg-slate-100 px-1 rounded text-xs">#</span>
                    <span className="font-medium text-sm">Compliance ID</span>
                 </div>
                 <span className="font-medium text-slate-700">{comp.compId}</span>
              </div>

              <div className="flex items-baseline justify-between mb-3 border-b border-slate-50 pb-3">
                 <div className="flex items-center space-x-2 text-slate-500 w-24">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span className="font-medium text-sm">Due Date</span>
                 </div>
                 <span className="font-medium text-slate-800">{comp.due}</span>
              </div>

              <div className="flex items-baseline justify-between">
                 <div className="flex items-center space-x-2 text-slate-500 w-24">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    <span className="font-medium text-sm">Frequency</span>
                 </div>
                 <span className="font-medium text-slate-700">{comp.freq}</span>
              </div>

           </div>
        ))}

      </div>
    </div>
  );
};

export default ComplianceDetail;
