import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Package, BarChart2 } from 'lucide-react';

const mockAssets = [
  { 
    id: 'current_assets', label: 'Current Assets', 
    subItems: [
        { label: 'Cash and Cash Equivalents', val1: '500000', val2: '500000' },
        { label: 'Receivables', val1: '500000', val2: '500000' },
        { label: 'Prepaid Expenses', val1: '500000', val2: '500000' },
        { label: 'Short-Term Investments', val1: '500000', val2: '500000' },
        { label: 'Loans & Advances', val1: '500000', val2: '500000' },
        { label: 'Other Current Assets', val1: '500000', val2: '500000' },
        { label: 'Inventory', val1: '500000', val2: '500000' },
        { label: 'Total Current Assets', val1: '500000', val2: '500000', highlight: true }
    ]
  },
  { 
    id: 'non_current_assets', label: 'Non-Current Assets', 
    subItems: [
        { label: 'Fixed Assets', val1: '500000', val2: '500000' },
        { label: 'Intangible Assets', val1: '500000', val2: '500000' },
        { label: 'Long-Term Investments', val1: '500000', val2: '500000' },
        { label: 'Capital Work in Progress', val1: '500000', val2: '500000' },
        { label: 'Other Non-Current Assets', val1: '500000', val2: '500000' },
        { label: 'Total Non-Current Assets', val1: '500000', val2: '500000', highlight: true }
    ]
  },
  { 
    id: 'total_assets', label: 'Total Assets', 
    subItems: [
        { label: 'Total Assets', val1: '500000', val2: '500000', highlight: true }
    ] 
  }
];

const mockLiabilities = [
   { 
     id: 'current_liabilities', label: 'Current Liabilities', 
     subItems: [
        { label: 'Trade Payables', val1: '500000', val2: '500000' },
        { label: 'Short-Term Loans', val1: '500000', val2: '500000' },
        { label: 'Accrued Liabilities', val1: '500000', val2: '500000' },
        { label: 'Other Current Assets', val1: '500000', val2: '500000' },
        { label: 'Provisions', val1: '500000', val2: '500000' },
        { label: 'Total Current Liabilities', val1: '500000', val2: '500000', highlight: true }
     ] 
   },
   { 
     id: 'non_current_liabilities', label: 'Non-Current Liabilities', 
     subItems: [
        { label: 'Long-Term Loans', val1: '500000', val2: '500000' },
        { label: 'Deferred Liabilities', val1: '500000', val2: '500000' },
        { label: 'Other Non-Current Liabilities', val1: '500000', val2: '500000' },
        { label: 'Total Non-Current Liabilities', val1: '500000', val2: '500000', highlight: true }
     ] 
   },
   { 
     id: 'equity', label: 'Equity', 
     subItems: [
        { label: 'Share Capital', val1: '500000', val2: '500000' },
        { label: 'Reserves and Surplus', val1: '500000', val2: '500000' },
        { label: 'Proprietor Capital', val1: '500000', val2: '500000' },
        { label: 'Partner Capital', val1: '500000', val2: '500000' },
        { label: 'Share Premium', val1: '500000', val2: '500000' },
        { label: 'Total Equity', val1: '500000', val2: '500000', highlight: true }
     ] 
   },
   { 
     id: 'total_liabilities', label: 'Total Liabilities & Equity', 
     subItems: [
        { label: 'Total Liabilities & Equity', val1: '500000', val2: '500000', highlight: true }
     ] 
   }
];


const FAQSubCard = ({ data, year1, year2, title, isOpen, onToggle }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm mb-3 last:mb-0 transition-all">
      <div 
        className="px-4 py-3.5 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <span className="font-semibold text-slate-800 text-sm md:text-base">{title}</span>
        <div className="bg-slate-50 p-1 rounded-full border border-slate-200">
          {isOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </div>
      
      {isOpen && (
        <div className="border-t border-slate-100">
           <table className="w-full text-xs md:text-sm text-center text-slate-600">
             <thead className="bg-white border-b border-slate-100">
               <tr>
                 <th className="py-2.5 px-4 text-left font-medium w-1/2"></th>
                 <th className="py-2.5 px-4 font-medium border-r border-l border-slate-100 w-1/4">{year1}</th>
                 <th className="py-2.5 px-4 font-medium w-1/4">{year2}</th>
               </tr>
             </thead>
             <tbody>
               {data.map((item, idx) => (
                 <tr key={idx} className={`border-b border-slate-50 last:border-0 ${item.highlight ? 'bg-slate-50/70' : ''}`}>
                   <td className={`py-3 px-4 text-left ${item.highlight ? 'font-bold text-slate-800' : 'font-medium'}`}>{item.label}</td>
                   <td className={`py-3 px-4 border-r border-l border-slate-100 ${item.highlight ? 'font-bold text-slate-800' : ''}`}>{item.val1}</td>
                   <td className={`py-3 px-4 ${item.highlight ? 'font-bold text-slate-800' : ''}`}>{item.val2}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}
    </div>
  )
}

const FAQMainCard = ({ title, icon: Icon, subCategories, openState, toggleState }) => {
  const [isMainOpen, setIsMainOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-4 overflow-hidden transition-all">
      {/* Main Accordion Header */}
      <div 
        className="px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsMainOpen(!isMainOpen)}
      >
        <div className="flex items-center space-x-3">
           <div className="bg-slate-100 p-2 rounded-lg">
             <Icon size={20} className="text-slate-600" />
           </div>
           <h2 className="font-bold text-slate-800 text-lg">{title}</h2>
        </div>
        <div className="bg-white shadow-sm border border-slate-200 p-1.5 rounded-full">
           {isMainOpen ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
        </div>
      </div>

      {/* Main Accordion Body */}
      {isMainOpen && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
           {subCategories.map((subCat) => (
              <FAQSubCard 
                key={subCat.id}
                title={subCat.label}
                data={subCat.subItems}
                year1={"2023-24"}
                year2={"2024-25"}
                isOpen={openState[subCat.id]}
                onToggle={() => toggleState(subCat.id)}
              />
           ))}
        </div>
      )}
    </div>
  )
}

const BSYoYComparision = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  // Flat state tracking to quickly open/close any nested FAQ table
  const [openFAQs, setOpenFAQs] = useState({});

  const toggleFAQ = (key) => setOpenFAQs(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/reports`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">BS Comparision</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-3xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
        {/* Year Selector */}
        <div className="border border-slate-200 bg-white rounded-[16px] shadow-sm flex justify-between items-center p-4 mb-6">
          <ChevronLeft size={20} className="text-slate-500 cursor-pointer hover:text-slate-800 hover:-translate-x-1 transition-transform" />
          <h2 className="font-bold text-slate-800 text-base">2023-24 vs 2024-25</h2>
          <ChevronRight size={20} className="text-slate-500 cursor-pointer hover:text-slate-800 hover:translate-x-1 transition-transform" />
        </div>

        {/* Nested Accordion Cards (Assets / Liabilities) purely stacked as requested */}
        <div className="space-y-4">
           <FAQMainCard 
             title="Assets" 
             icon={Package} 
             subCategories={mockAssets}
             openState={openFAQs}
             toggleState={toggleFAQ}
           />
           
           <FAQMainCard 
             title="Liabilities & Equity" 
             icon={BarChart2} 
             subCategories={mockLiabilities}
             openState={openFAQs}
             toggleState={toggleFAQ}
           />
        </div>

      </div>
    </div>
  );
};

export default BSYoYComparision;
