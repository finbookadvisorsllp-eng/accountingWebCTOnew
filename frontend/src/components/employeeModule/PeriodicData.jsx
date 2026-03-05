import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronRight, CalendarDays, CheckCircle, Clock } from 'lucide-react';

// Define complex structure logic matching the Periodic Figma spec
const formSections = {
  income: [
    {
      title: 'Sales Figures',
      fields: ['No. of Invoice Prepared', 'Total Sales', 'Sales Returns', 'Discounts Allowed', 'Total Direct Income', 'Debtors Collection - Bank', 'Debtors Collection - Cash', 'Cash Sales', 'Credit Sales', 'Export Sales', 'Domestic Sales', 'Sales Product', 'Sales Service', 'Interstate Sales', 'Local Sales']
    },
    {
      title: 'Direct & Indirect Income',
      fields: ['Direct Income', 'Commission Income', 'Incentive Income', 'Other Direct Income', 'Indirect Income', 'Interest Income']
    }
  ],
  expenses: [
    {
      title: 'Cost of Goods Sold (COGS)',
      fields: ['Opening Stock', 'Closing Stock', 'Purchase', 'Labor Expenses', 'Power Expenses', 'Manufacturing Overhead', 'Other Director Expenses']
    },
    {
      title: 'Operating Expenses',
      fields: ['Rent and Lease Expenses', 'Utilities and Electricity', 'Insurance Expenses', 'Repairs and Maintenance', 'Telephone and Internet Expenses', 'Other Operating Expenses']
    },
    {
      title: 'Selling & Distribution Expenses',
      fields: ['Marketing and Advertising Expense', 'Sales Commission Expense', 'Other Selling & Distribution Expenses']
    },
    {
      title: 'Employee Benefits Expenses',
      fields: ['Office & Administrative Salaries', 'Employee Welfare Expenses', 'Employee Contribution expenses']
    },
    {
      title: 'Administrative Expenses',
      fields: ['Postage & Stationary Expenses', 'Legal & Professional Fees', 'Travel and Transportation', 'Other Admin Expenses']
    },
    {
      title: 'Financial Expenses',
      fields: ['Interest on Loans', 'Bank Charges', 'Finance Charges']
    },
    {
      title: 'Other Expenses',
      fields: ['Loss of Sales of Assets', 'Provision for Bad Debts', 'Other Expenses']
    },
    {
      title: 'Fund Management',
      fields: ['Cash In Hand', 'Cash at Bank', 'Loans taken from Bank or NBFC', 'Loans Repaid from Bank or NBFC', 'Fixed Assets Purchased', 'Fixed Assets Sold']
    },
    {
      title: 'Tax and Compliance',
      fields: ['VAT Paid', 'GST Output', 'GST Input', 'Advance Tax Paid', 'Mandi Tax Paid', 'Excise Duty Paid']
    }
  ]
};

const PeriodicData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  const [activeTab, setActiveTab] = useState('Income');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Accordion state - default everything to false
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
     setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-24">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/financial`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Periodic Data</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6 pt-6">
        
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

        {/* Tabs Toggle */}
        <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
                className={`py-3.5 rounded-full font-bold text-sm md:text-base border-2 transition-all ${activeTab === 'Income' ? 'bg-[#3A565A] text-white border-[#3A565A] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                onClick={() => setActiveTab('Income')}
            >
                Income
            </button>
            <button 
                className={`py-3.5 rounded-full font-bold text-sm md:text-base border-2 transition-all ${activeTab === 'Expenses' ? 'bg-[#3A565A] text-white border-[#3A565A] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                onClick={() => setActiveTab('Expenses')}
            >
                Expenses
            </button>
        </div>

        {/* Dynamic Accordion Content based on Tab */}
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'Income' ? (
                // Income Accordions
                formSections.income.map((category, idx) => (
                    <AccordionBlock 
                        key={idx}
                        title={category.title}
                        isOpen={openSections[category.title]} 
                        onToggle={() => toggleSection(category.title)}
                        fields={category.fields}
                    />
                ))
            ) : (
                // Expenses Accordions
                formSections.expenses.map((category, idx) => (
                    <AccordionBlock 
                        key={idx}
                        title={category.title}
                        isOpen={openSections[category.title]} 
                        onToggle={() => toggleSection(category.title)}
                        fields={category.fields}
                    />
                ))
            )}
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

// Reusable Accordion Component
const AccordionBlock = ({ title, isOpen, onToggle, fields }) => (
  <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-sm transition-all duration-300">
     <div 
       className={`px-5 py-4 flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'bg-slate-50 border-b border-slate-200' : 'hover:bg-slate-50'}`}
       onClick={onToggle}
     >
        <h3 className="font-bold text-slate-800 md:text-lg">{title}</h3>
        {isOpen ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronRight size={20} className="text-slate-400" />}
     </div>
     
     <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[3500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 space-y-3 bg-white">
            {fields.map((field, fieldIdx) => (
                <InputField key={fieldIdx} label={field} />
            ))}
        </div>
     </div>
  </div>
);

// Form Row with standard right-alignment and ₹ placeholder
const InputField = ({ label }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600 text-xs md:text-sm font-medium w-1/2 break-words pr-2 leading-tight">
         {label}
      </span>
      <div className="relative w-1/2">
         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium select-none">₹</span>
         <input 
            type="text" 
            placeholder="Amount"
            className="w-full bg-slate-50/70 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-right focus:bg-white focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A] transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400" 
         />
      </div>
    </div>
  );
};

export default PeriodicData;
