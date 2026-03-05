import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronRight, Activity } from 'lucide-react';

const years = ['2020 - 2021', '2021 - 2022', '2022 - 2023', '2023 - 2024', '2024 - 2025'];

// Define form structure logic matching the Figma spec exactly
const formSections = {
  incomes: [
    {
      title: 'Revenue from Operations',
      fields: ['Domestic Sales Revenue', 'Sales of Service']
    },
    {
      title: 'Closing Stock',
      fields: ['(Optional Value)'] // Field without explicit sublabel but requires an input row
    },
    {
      title: 'Other Direct Income',
      fields: ['(Optional Value)']
    },
    {
      title: 'Other In-Direct Income',
      fields: ['(Optional Value)']
    }
  ],
  expenses: [
    {
      title: 'Opening Stock',
      fields: ['Opening Stock in Hand']
    },
    {
      title: 'Purchase',
      fields: ['Purchase RM', 'Purchase PM', 'Purchase Consumables', 'Purchase Trading Material']
    },
    {
      title: 'Direct Expenses',
      fields: ['Direct Labor Expenses', 'Power Expenses']
    },
    {
      title: 'Manufacturing Overheads',
      fields: ['Factory Rent', 'Plant & Machinery Maintenance', 'Consumables (Tools, Lubricants)', 'Quality Control/Testing Expenses']
    },
    {
      title: 'Other Direct Expenses',
       fields: ['Freight & Shipping Expenses (Inward)','Loading & Hammali Expenses','Labor Contract Expenses','Other Direct Expenses']
    },
    {
      title: 'In-Direct Expenses'
    },
    {
      title: 'Operating Expenses',
      fields: ['Rent and Lease Expenses', 'Utilities and Electricity', 'Certification Charges', 'Insurance Expenses', 'Repairs and Maintenance', 'Research & Development Cost', 'Safety & Compliances', 'Telephone and Internet Expenses']
    },
    {
      title: 'Selling & Distribution Expenses',
      fields: ['Marketing and Advertising Expense', 'Commission & Incentives Expense', 'Distribution Expenses', 'Sales Office Expenses', 'Discount & Rebates Expenses', 'Freight & Shipping Expenses (Outward)']
    },
    {
      title: 'Employee Benefits Expenses',
      fields: ['Office & Administrative Salaries', 'Employee Welfare Expenses', 'Employee Contribution Expenses', 'Bonus & Incentive Expenses', 'Training & Development Expenses']
    },
    {
      title: 'Administrative Expenses',
      fields: ['Postage & Stationery Expenses', 'Office Expenses', 'Legal & Professional Fees', 'Travel and Conveyance Expenses', 'Security Expenses', 'Cleaning & House keeping Expense']
    },
    {
      title: 'Financial Expenses',
      fields: ['Interest on Loans', 'Bank Charges', 'Finance Charges']
    },
    {
      title: 'Other Expenses',
      fields: ['GST & other Taxes Paid', 'Provision for Bad Debts', 'Loss on Sale of Assets', 'Donation Expenses', 'Miscellaneous Expenses']
    },
    {
      title: 'Depreciation and Amortization',
      fields: ['Depreciation Expenses']
    },
    {
      title: 'Tax & Penalty Expenses',
      fields: ['Provision for Income Tax', 'Statutory Penalty & Interest Expenses']
    }
  ]
};

const PndLInputField = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  
  const [openSections, setOpenSections] = useState({
     'Income': false,
     'Expenses': false
  });

  const toggleSection = (section) => {
     setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-24">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/financial`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">PndL Input Field</h1>
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
             <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg p-2 absolute w-full z-30">
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

        {/* Dynamic Accordion Content (Only show if Year selected) */}
        {selectedYear && (
           <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
             {/* Income Accordion */}
             <AccordionBlock 
               title="Income" 
               isOpen={openSections['Income']} 
               onToggle={() => toggleSection('Income')}
               data={formSections.incomes}
             />

             {/* Expenses Accordion */}
             <AccordionBlock 
               title="Expenses" 
               isOpen={openSections['Expenses']} 
               onToggle={() => toggleSection('Expenses')}
               data={formSections.expenses}
             />

           </div>
        )}

      </div>

      {/* Sticky Save Button (only visible if a year is picked) */}
      {selectedYear && (
         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:px-10 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:ml-[16.666667%] lg:ml-[20%]">
            <div className="max-w-2xl mx-auto flex justify-center w-full">
               <button className="bg-[#3A565A] text-white w-full max-w-sm py-4 rounded-full font-bold shadow-lg shadow-[#3A565A]/30 hover:bg-[#2a3e41] hover:-translate-y-0.5 transition-all text-lg">
                 Save
               </button>
            </div>
         </div>
      )}

    </div>
  );
};

// Reusable Accordion Component
const AccordionBlock = ({ title, isOpen, onToggle, data }) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-300">
     <div 
       className={`px-5 py-4 flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'bg-slate-50 border-b border-slate-200' : 'hover:bg-slate-50'}`}
       onClick={onToggle}
     >
        <h3 className="font-bold text-slate-800 md:text-lg">{title}</h3>
        {isOpen ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronRight size={20} className="text-slate-400" />}
     </div>
     
     <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[3500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 space-y-6 bg-white">
           {data.map((category, idx) => (
              <div key={idx} className={`space-y-3 ${category.isSectionHeader ? 'pt-4 border-t border-slate-100' : ''}`}>
                 <h4 className={`font-bold ${category.isSectionHeader ? 'text-slate-800 text-base md:text-lg text-center' : 'text-slate-700 text-sm'}`}>{category.title}</h4>
                 {category.fields && category.fields.length > 0 && (
                   <div className="space-y-3">
                      {category.fields.map((field, fieldIdx) => (
                         <InputField key={fieldIdx} label={field} />
                      ))}
                   </div>
                 )}
              </div>
           ))}
        </div>
     </div>
  </div>
);

// Form Row with standard right-alignment and ₹ placeholder
const InputField = ({ label }) => {
  const isOptionalLabel = label === '(Optional Value)';
  
  return (
    <div className={`flex items-center justify-between ${isOptionalLabel ? 'justify-end' : ''}`}>
      {!isOptionalLabel && (
         <span className="text-slate-600 text-xs md:text-sm font-medium w-1/2 md:w-2/5 break-words pr-2 leading-tight">
            {label}
         </span>
      )}
      <div className={`relative ${isOptionalLabel ? 'w-full text-right' : 'w-1/2 md:w-3/5'}`}>
         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium select-none">₹</span>
         <input 
            type="text" 
            placeholder="Amount"
            className="w-full bg-slate-50/70 border border-slate-200 rounded-lg pl-8 pr-4 py-2 text-right focus:bg-white focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A] transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400" 
         />
      </div>
    </div>
  );
};

export default PndLInputField;
