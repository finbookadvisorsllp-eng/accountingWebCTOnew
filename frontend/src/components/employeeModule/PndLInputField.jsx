import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronRight, Loader2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { pnlAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const years = ['2020 - 2021', '2021 - 2022', '2022 - 2023', '2023 - 2024', '2024 - 2025'];

const formSections = {
  incomes: [
    { title: 'Revenue from Operations', fields: ['Domestic Sales Revenue', 'Sales of Service'] },
    { title: 'Closing Stock', fields: ['Closing Stock'] },
    { title: 'Other Direct Income', fields: ['Other Direct Income'] },
    { title: 'Other In-Direct Income', fields: ['Other In-Direct Income'] }
  ],
  expenses: [
    { title: 'Opening Stock', fields: ['Opening Stock in Hand'] },
    { title: 'Purchase', fields: ['Purchase RM', 'Purchase PM', 'Purchase Consumables', 'Purchase Trading Material'] },
    { title: 'Direct Expenses', fields: ['Direct Labor Expenses', 'Power Expenses'] },
    { title: 'Manufacturing Overheads', fields: ['Factory Rent', 'Plant & Machinery Maintenance', 'Consumables (Tools, Lubricants)', 'Quality Control/Testing Expenses'] },
    { title: 'Other Direct Expenses', fields: ['Freight & Shipping Expenses (Inward)', 'Loading & Hammali Expenses', 'Labor Contract Expenses', 'Other Direct Expenses'] },
    { title: 'Operating Expenses', fields: ['Rent and Lease Expenses', 'Utilities and Electricity', 'Certification Charges', 'Insurance Expenses', 'Repairs and Maintenance', 'Research & Development Cost', 'Safety & Compliances', 'Telephone and Internet Expenses'] },
    { title: 'Selling & Distribution Expenses', fields: ['Marketing and Advertising Expense', 'Commission & Incentives Expense', 'Distribution Expenses', 'Sales Office Expenses', 'Discount & Rebates Expenses', 'Freight & Shipping Expenses (Outward)'] },
    { title: 'Employee Benefits Expenses', fields: ['Office & Administrative Salaries', 'Employee Welfare Expenses', 'Employee Contribution Expenses', 'Bonus & Incentive Expenses', 'Training & Development Expenses'] },
    { title: 'Administrative Expenses', fields: ['Postage & Stationery Expenses', 'Office Expenses', 'Legal & Professional Fees', 'Travel and Conveyance Expenses', 'Security Expenses', 'Cleaning & House keeping Expense'] },
    { title: 'Financial Expenses', fields: ['Interest on Loans', 'Bank Charges', 'Finance Charges'] },
    { title: 'Other Expenses', fields: ['GST & other Taxes Paid', 'Provision for Bad Debts', 'Loss on Sale of Assets', 'Donation Expenses', 'Miscellaneous Expenses'] },
    { title: 'Depreciation and Amortization', fields: ['Depreciation Expenses'] },
    { title: 'Tax & Penalty Expenses', fields: ['Provision for Income Tax', 'Statutory Penalty & Interest Expenses'] }
  ]
};

const PndLInputField = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id;

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [values, setValues] = useState({});

  const [openSections, setOpenSections] = useState({
     'Income': true, // Open by default for better flow
     'Expenses': false
  });

  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    profit_or_loss: 0
  });

  const toggleSection = (section) => {
     setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (clientId && selectedYear) {
      fetchData();
    }
  }, [clientId, selectedYear]);

  useEffect(() => {
    let income = 0;
    let expense = 0;

    formSections.incomes.forEach(cat => {
      cat.fields.forEach(field => {
        const key = `${cat.title}_${field}`;
        income += parseFloat(values[key]) || 0;
      });
    });

    formSections.expenses.forEach(cat => {
      cat.fields.forEach(field => {
        const key = `${cat.title}_${field}`;
        expense += parseFloat(values[key]) || 0;
      });
    });

    setSummary({
      total_income: income,
      total_expenses: expense,
      profit_or_loss: income - expense
    });
  }, [values]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await pnlAPI.getByYear(clientId, selectedYear);
      const records = res?.data?.data || [];

      const mappedValues = {};
      records.forEach(item => {
        const key = `${item.category}_${item.sub_category}`;
        mappedValues[key] = item.amount?.toString() || '';
      });

      setValues(mappedValues);
    } catch (err) {
      console.error('Failed to fetch P&L data', err);
      toast.error('Unable to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedYear) {
      toast.warning('Please select Year');
      return;
    }

    try {
      setLoading(true);
      const items = [];

      formSections.incomes.forEach(cat => {
        cat.fields.forEach(field => {
          const key = `${cat.title}_${field}`;
          const amount = parseFloat(values[key]) || 0;
          items.push({ category: cat.title, sub_category: field, type: 'income', amount });
        });
      });

      formSections.expenses.forEach(cat => {
        cat.fields.forEach(field => {
          const key = `${cat.title}_${field}`;
          const amount = parseFloat(values[key]) || 0;
          items.push({ category: cat.title, sub_category: field, type: 'expense', amount });
        });
      });

      await pnlAPI.createOrUpdate({ client: clientId, year: selectedYear, items });
      toast.success('P&L data saved successfully');
    } catch (err) {
      console.error('Failed to save P&L data', err);
      toast.error(err.response?.data?.message || 'Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (category, field, value) => {
    const key = `${category}_${field}`;
    setValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 scrollbar-hide w-full h-full pb-10">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 bg-white sticky top-0 z-40 shadow-sm border-b border-slate-100">
        <div className="flex items-center space-x-4">
          <ArrowLeft 
            size={24} 
            className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1 rounded-full" 
            onClick={() => navigate(`/employee/clients/${clientId}/financial`)}
          />
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">P&L Data Entry</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-3xl mx-auto space-y-6 pt-6">
        
        {/* Year Dropdown */}
        <div className="relative">
           <div 
             className="bg-white rounded-xl border border-slate-200 px-4 py-3.5 flex items-center justify-between cursor-pointer hover:border-slate-300 shadow-sm transition-all"
             onClick={() => setIsYearOpen(!isYearOpen)}
           >
              <span className={`font-semibold ${selectedYear ? 'text-slate-800' : 'text-slate-400'}`}>
                {selectedYear || 'Select Financial Year'}
              </span>
              {isYearOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
           </div>
           
           <AnimatePresence>
             {isYearOpen && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="mt-2 bg-white rounded-xl border border-slate-200 shadow-xl p-2 absolute w-full z-30"
               >
                 {years.map(year => (
                   <div 
                     key={year} 
                     onClick={() => { setSelectedYear(year); setIsYearOpen(false); }} 
                     className={`px-4 py-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${selectedYear === year ? 'bg-slate-50 font-bold text-[#3A565A]' : 'text-slate-600 hover:bg-slate-50'}`}
                   >
                     <span>{year}</span>
                     {selectedYear === year && <ChevronRight size={18} />}
                   </div>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {loading && !Object.keys(values).length && (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#3A565A]" size={36} /></div>
        )}

        {!loading && selectedYear && (
           <div className="space-y-6 animate-in fade-in duration-300">
             
             {/* Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard 
                  title="Total Income" 
                  amount={summary.total_income} 
                  icon={<TrendingUp className="text-green-500" size={20} />} 
                  bgColor="bg-green-50/50" 
                  borderColor="border-green-200/60"
                  textColor="text-green-600"
                />
                <SummaryCard 
                  title="Total Expenses" 
                  amount={summary.total_expenses} 
                  icon={<TrendingDown className="text-red-500" size={20} />} 
                  bgColor="bg-red-50/50" 
                  borderColor="border-red-200/60"
                  textColor="text-red-600"
                />
                <SummaryCard 
                  title="Net Profit/Loss" 
                  amount={summary.profit_or_loss} 
                  icon={<DollarSign className={summary.profit_or_loss >= 0 ? "text-blue-500" : "text-amber-500"} size={20} />} 
                  bgColor={summary.profit_or_loss >= 0 ? "bg-blue-50/50" : "bg-amber-50/50"} 
                  borderColor={summary.profit_or_loss >= 0 ? "border-blue-200/60" : "border-amber-200/60"}
                  textColor={summary.profit_or_loss >= 0 ? "text-blue-600" : "text-amber-600"}
                />
             </div>

             {/* Accordions */}
             <div className="space-y-4">
               <AccordionBlock 
                 title="Incomes" 
                 isOpen={openSections['Income']} 
                 onToggle={() => toggleSection('Income')}
                 data={formSections.incomes}
                 values={values}
                 onChange={handleInputChange}
                 accentColor="before:bg-green-500"
               />

               <AccordionBlock 
                 title="Expenses" 
                 isOpen={openSections['Expenses']} 
                 onToggle={() => toggleSection('Expenses')}
                 data={formSections.expenses}
                 values={values}
                 onChange={handleInputChange}
                 accentColor="before:bg-red-500"
               />
             </div>

             {/* Save Button */}
             <div className="pt-6 flex justify-center border-t border-slate-100">
                <button 
                  onClick={handleSave} 
                  disabled={loading} 
                  className="bg-[#3A565A] hover:bg-[#2c4245] text-white px-12 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-3 disabled:opacity-50 text-sm md:text-base"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                  <span>Save Data</span>
                </button>
             </div>

           </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, amount, icon, bgColor, borderColor, textColor }) => (
  <div className={`p-4 rounded-xl border ${borderColor} ${bgColor} flex items-center justify-between shadow-sm backdrop-blur-sm`}>
    <div>
      <div className="text-slate-500 text-xs font-semibold">{title}</div>
      <div className={`font-extrabold text-lg mt-1 ${textColor}`}>₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
    <div className="p-2 rounded-lg bg-white/80 border border-slate-100 shadow-sm">{icon}</div>
  </div>
);

const AccordionBlock = ({ title, isOpen, onToggle, data, values, onChange, accentColor }) => (
  <div className={`bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${accentColor}`}>
     <div className={`px-5 py-4 flex items-center justify-between cursor-pointer ${isOpen ? 'bg-slate-50/80 border-b border-slate-100' : 'hover:bg-slate-50/30'}`} onClick={onToggle}>
        <h3 className="font-bold text-slate-800 text-base">{title}</h3>
        <span className="p-1 rounded-full bg-slate-100/80 text-slate-400">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
     </div>
     
     <AnimatePresence initial={false}>
       {isOpen && (
         <motion.div 
           initial={{ height: 0, opacity: 0 }}
           animate={{ height: "auto", opacity: 1 }}
           exit={{ height: 0, opacity: 0 }}
           transition={{ duration: 0.2 }}
           className="overflow-hidden"
         >
           <div className="p-5 space-y-6 bg-white">
              {data.map((category, idx) => (
                 <div key={idx} className="space-y-3">
                    <h4 className="font-bold text-slate-600 text-xs uppercase tracking-wider">{category.title}</h4>
                    <div className="space-y-2.5">
                       {category.fields.map((field, fIdx) => (
                          <InputField key={fIdx} label={field} value={values[`${category.title}_${field}`] || ''} onChange={(e) => onChange(category.title, field, e.target.value)} />
                       ))}
                    </div>
                 </div>
              ))}
           </div>
         </motion.div>
       )}
     </AnimatePresence>
  </div>
);

const InputField = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between py-1 group">
    <span className="text-slate-600 text-sm font-medium pr-4 group-hover:text-slate-800 transition-colors">{label}</span>
    <div className="relative w-1/2 md:w-3/5">
       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
       <input 
         type="number" 
         step="0.01" 
         min="0" 
         placeholder="0.00" 
         value={value} 
         onChange={onChange} 
         className="w-full bg-slate-50/50 border border-slate-200/80 rounded-lg pl-8 pr-4 py-2 text-right focus:bg-white focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A] text-sm font-semibold text-slate-800 transition-all shadow-sm group-hover:bg-slate-50" 
       />
    </div>
  </div>
);

export default PndLInputField;
