import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, CalendarDays } from 'lucide-react';

const DebtorsCreditors = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';
  
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // State for the two "Debtors Name" dropdowns
  const [isTop5Open1, setIsTop5Open1] = useState(false);
  const [selectedTop5Type1, setSelectedTop5Type1] = useState('Debtors Name');
  
  const [isTop5Open2, setIsTop5Open2] = useState(false);
  const [selectedTop5Type2, setSelectedTop5Type2] = useState('Debtors Name');
  
  const typeOptions = ['Debtors Name', 'Creditors Name', 'Other Name'];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-24">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/financial`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Debtors Creditors</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Date Filters */}
        <div className="grid grid-cols-2 gap-4">
           {/* From Date */}
           <div className="relative">
             <input 
               type="date" 
               value={fromDate}
               onChange={(e) => setFromDate(e.target.value)}
               className="w-full bg-white rounded-[12px] border border-slate-200 px-4 py-3 text-slate-700 font-medium shadow-sm focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A] transition-all appearance-none"
             />
             {!fromDate && (
               <div className="absolute inset-0 bg-white rounded-[12px] border border-slate-200 px-4 py-3 flex items-center justify-between pointer-events-none shadow-sm">
                 <span className="text-slate-500 font-medium">From</span>
                 <CalendarDays size={20} className="text-slate-400" />
               </div>
             )}
           </div>
           
           {/* To Date */}
           <div className="relative">
             <input 
               type="date" 
               value={toDate}
               onChange={(e) => setToDate(e.target.value)}
               className="w-full bg-white rounded-[12px] border border-slate-200 px-4 py-3 text-slate-700 font-medium shadow-sm focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A] transition-all appearance-none"
             />
             {!toDate && (
               <div className="absolute inset-0 bg-white rounded-[12px] border border-slate-200 px-4 py-3 flex items-center justify-between pointer-events-none shadow-sm">
                 <span className="text-slate-500 font-medium">To</span>
                 <CalendarDays size={20} className="text-slate-400" />
               </div>
             )}
           </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 md:p-8 space-y-8">
           
           {/* Basic Outcomes */}
           <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Debtors and Creditors</h3>
              <InputField label="Debtors Outstanding - Amount" />
              <InputField label="Creditors Outstanding - Amount" />
           </div>

           {/* Aging */}
           <div className="space-y-4 pt-4">
              <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">Debtors and Creditors Aging</h3>
              <InputField label="Debtors Outstanding - 30 Days" />
              <InputField label="Debtors Outstanding - 30 to 90 Days" />
              <InputField label="Debtors Outstanding - 90 to 180 Days" />
              <InputField label="Debtors Outstanding - More than 180 Days" />

              <div className="h-px bg-slate-100 my-4" />

              <InputField label="Creditors Outstanding - 30 Days" />
              <InputField label="Creditors Outstanding - 30 to 90 Days" />
              <InputField label="Creditors Outstanding - 90 to 180 Days" />
              <InputField label="Creditors Outstanding - More than 180 Days" />
           </div>

           {/* Top 5 Dynamic Box 1 */}
           <div className="space-y-4 pt-6">
              <h3 className="font-bold text-slate-800 md:text-lg leading-tight">Top 5- debtors/Creditors name and its outstanding</h3>
              <div className="relative w-1/2">
                 <div 
                   onClick={() => setIsTop5Open1(!isTop5Open1)}
                   className="cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 flex items-center justify-between hover:border-slate-300 transition-colors"
                 >
                    <span className="text-slate-700 font-medium text-sm">{selectedTop5Type1}</span>
                    <ChevronDown size={18} className="text-slate-400" />
                 </div>
                 {isTop5Open1 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                      {typeOptions.map((type, idx) => (
                         <div 
                           key={idx}
                           onClick={() => {
                             setSelectedTop5Type1(type);
                             setIsTop5Open1(false);
                           }}
                           className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                         >
                           {type}
                         </div>
                      ))}
                    </div>
                 )}
              </div>
              
              <div className="pt-2 space-y-3">
                 {[1,2,3,4,5].map(num => (
                    <InputField key={num} label={`Party Name ${num}`} />
                 ))}
              </div>
           </div>

           {/* Top 5 Dynamic Box 2 */}
           <div className="space-y-4 pt-6">
              <h3 className="font-bold text-slate-800 md:text-lg leading-tight">Top 5 Debtors/Creditors name where outstanding more than 180 days</h3>
              <div className="relative w-1/2">
                 <div 
                   onClick={() => setIsTop5Open2(!isTop5Open2)}
                   className="cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 flex items-center justify-between hover:border-slate-300 transition-colors"
                 >
                    <span className="text-slate-700 font-medium text-sm">{selectedTop5Type2}</span>
                    <ChevronDown size={18} className="text-slate-400" />
                 </div>
                 {isTop5Open2 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                      {typeOptions.map((type, idx) => (
                         <div 
                           key={idx}
                           onClick={() => {
                             setSelectedTop5Type2(type);
                             setIsTop5Open2(false);
                           }}
                           className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                         >
                           {type}
                         </div>
                      ))}
                    </div>
                 )}
              </div>

              <div className="pt-2 space-y-3">
                 {[1,2,3,4,5].map(num => (
                    <InputField key={num} label={`Party Name ${num}`} />
                 ))}
              </div>
           </div>

        </div>

      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:px-10 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] mx-auto md:ml-[16.666667%] lg:ml-[20%]">
         <div className="max-w-2xl mx-auto flex justify-center w-full px-4 text-center">
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
    <span className="text-slate-600 text-xs md:text-sm font-medium w-1/2 pr-2">{label}</span>
    <div className="relative w-1/2">
       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium select-none">₹</span>
       <input 
          type="text" 
          placeholder="Amount"
          className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-right focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A] transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400" 
       />
    </div>
  </div>
);

export default DebtorsCreditors;
