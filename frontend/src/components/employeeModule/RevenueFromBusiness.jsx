import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

const years = ['2020 - 2021', '2021 - 2022', '2022 - 2023', '2023 - 2024', '2024 - 2025'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RevenueFromBusiness = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  const [activeTab, setActiveTab] = useState('Sell');
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/financial`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Revenue from business</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-4 pt-6">
        
        {/* Financial Year Selection Dropdown */}
        <div className="relative">
           <div 
             className="bg-white rounded-[12px] border border-slate-200 px-4 py-3.5 flex items-center justify-between cursor-pointer hover:border-slate-300 shadow-sm transition-colors"
             onClick={() => setIsYearOpen(!isYearOpen)}
           >
              <span className={`font-medium ${selectedYear ? 'text-slate-800' : 'text-slate-500'}`}>
                {selectedYear || 'Financial Year Selection'}
              </span>
              {isYearOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
           </div>
           
           {/* Year Dropdown Content */}
           {isYearOpen && (
             <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg p-2 absolute w-full z-20">
               {years.map(year => (
                 <div 
                   key={year}
                   onClick={() => {
                     setSelectedYear(year);
                     setIsYearOpen(false);
                   }}
                   className={`px-4 py-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${selectedYear === year ? 'bg-slate-50 font-bold text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                   <span>{year}</span>
                   {selectedYear === year && <ChevronRight size={18} className="text-slate-400" />}
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Month Dropdown */}
        <div className="relative">
           <div 
             className={`bg-white rounded-[12px] border border-slate-200 px-4 py-3.5 flex items-center justify-between cursor-pointer hover:border-slate-300 shadow-sm transition-colors ${(!selectedYear) && 'opacity-50 cursor-not-allowed'}`}
             onClick={() => selectedYear && setIsMonthOpen(!isMonthOpen)}
           >
              <span className={`font-medium ${selectedMonth ? 'text-slate-800' : 'text-slate-500'}`}>
                {selectedMonth || 'January'}
              </span>
              {isMonthOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
           </div>
           
           {/* Month Dropdown Content (Grid) */}
           {isMonthOpen && selectedYear && (
             <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg p-4 absolute w-full z-10">
               
               <div className="flex items-center justify-center space-x-2 text-slate-800 font-bold mb-4">
                  <span>{selectedYear}</span>
                  <ChevronRight size={16} className="text-slate-400" />
               </div>

               <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                 {months.map(month => (
                   <div 
                     key={month}
                     onClick={() => {
                       setSelectedMonth(month);
                       setIsMonthOpen(false);
                     }}
                     className={`text-center py-2 rounded-full cursor-pointer transition-colors text-sm font-medium ${selectedMonth === month ? 'bg-[#3A565A] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                   >
                     {month}
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* Dynamic Content (Only show if Month and Year selected) */}
        {selectedYear && selectedMonth && (
           <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
             {/* Tabs Toggle */}
             <div className="grid grid-cols-2 gap-4">
               <button 
                 className={`py-3.5 rounded-xl font-bold text-sm md:text-base border-2 transition-all ${activeTab === 'Sell' ? 'bg-[#3A565A] text-white border-[#3A565A] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                 onClick={() => setActiveTab('Sell')}
               >
                 Sell
               </button>
               <button 
                 className={`py-3.5 rounded-xl font-bold text-sm md:text-base border-2 transition-all ${activeTab === 'Purchase' ? 'bg-[#3A565A] text-white border-[#3A565A] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                 onClick={() => setActiveTab('Purchase')}
               >
                 Purchase
               </button>
             </div>

             {/* Form Content */}
             <div className="space-y-4">
               {/* Pre-populated Total */}
               <div className="flex items-center justify-between mt-2">
                 <span className="text-slate-600 font-medium text-sm md:text-base">Total</span>
                 <div className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-right font-medium text-slate-800">
                    14566
                 </div>
               </div>

               {activeTab === 'Sell' ? (
                 <>
                   <InputField label="Taxable Sales (Product)" />
                   <InputField label="Taxable Sales (Service)" />
                   <InputField label="Total Taxable Sales" />
                 </>
               ) : (
                 <>
                   <InputField label="Purchase RM" />
                   <InputField label="Purchase Trading" />
                   <InputField label="Purchase PM" />
                   <InputField label="Purchase Consumables" />
                 </>
               )}
             </div>

             {/* Save Button */}
             <div className="pt-4 flex justify-center">
                <button className="bg-[#3A565A] text-white px-12 py-3 rounded-full font-bold shadow-md hover:bg-[#2a3e41] transition-colors">
                  Save
                </button>
             </div>

           </div>
        )}

      </div>
    </div>
  );
};

const InputField = ({ label }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600 text-sm md:text-base">{label}</span>
    <input 
      type="text" 
      className="w-1/2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-right focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A] transition-all" 
      defaultValue=""
    />
  </div>
);

export default RevenueFromBusiness;
