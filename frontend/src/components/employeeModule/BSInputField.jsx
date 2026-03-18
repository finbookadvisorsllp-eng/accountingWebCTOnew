import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronRight, Loader2, Landmark, Scale, Coins, AlertCircle } from 'lucide-react';
import { balanceSheetAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const years = ['2020 - 2021', '2021 - 2022', '2022 - 2023', '2023 - 2024', '2024 - 2025'];

const formSections = {
  assets: [
    { title: 'Current Assets', fields: ['Cash and Cash Equivalents', 'Receivables', 'Inventory', 'Prepaid Expenses', 'Short-Term Investments', 'Loans & Advances', 'Other Current Assets'] },
    { title: 'Non-Current Assets', fields: ['Fixed Assets', 'Capital Work in Progress', 'Intangible Assets', 'Long-Term Investments', 'Other Non-Current Assets'] }
  ],
  liabilities: [
    { title: 'Current Liabilities', fields: ['Trade Payables', 'Short-Term Loans and Borrowings', 'Accrued/Payable Liabilities', 'Other Current Liabilities', 'Provisions'] },
    { title: 'Non-Current Liabilities', fields: ['Long-Term Loans and Borrowings', 'Deferred Liabilities', 'Other Non-Current Liabilities'] }
  ],
  equity: [
     { title: 'Equity', fields: ['Share Capital', 'Reserves and Surplus', 'Proprietor Capital', 'Partner Capital', 'Share Premium'] }
  ]
};

const BSInputField = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id;

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [values, setValues] = useState({});

  const [openSections, setOpenSections] = useState({
     'Assets': true,
     'Liabilities': false,
     'Equity': false
  });

  const [summary, setSummary] = useState({
    total_assets: 0,
    total_liabilities: 0,
    total_equity: 0,
    balance_difference: 0
  });

  const toggleSection = (section) => {
     setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (clientId && selectedYear) {
      fetchData();
    }
  }, [clientId, selectedYear]);

  // Recalculate Summary locally when values change
  useEffect(() => {
    let assets = 0;
    let liabilities = 0;
    let equity = 0;

    // Sum Assets
    formSections.assets.forEach(cat => {
      cat.fields.forEach(field => {
        const key = `${cat.title}_${field}`;
        assets += parseFloat(values[key]) || 0;
      });
    });

    // Sum Liabilities
    formSections.liabilities.forEach(cat => {
      cat.fields.forEach(field => {
        const key = `${cat.title}_${field}`;
        liabilities += parseFloat(values[key]) || 0;
      });
    });

    // Sum Equity
    formSections.equity.forEach(cat => {
      cat.fields.forEach(field => {
        const key = `${cat.title}_${field}`;
        equity += parseFloat(values[key]) || 0;
      });
    });

    const difference = assets - (liabilities + equity);

    setSummary({
      total_assets: assets,
      total_liabilities: liabilities,
      total_equity: equity,
      balance_difference: Math.abs(difference) < 0.01 ? 0 : difference // Avoid floating point issues
    });
  }, [values]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await balanceSheetAPI.getByYear(clientId, selectedYear);
      const records = res?.data?.data || [];

      const mappedValues = {};
      records.forEach(item => {
        const key = `${item.category}_${item.sub_category}`;
        mappedValues[key] = item.amount?.toString() || '';
      });

      setValues(mappedValues);
    } catch (err) {
      console.error('Failed to fetch Balance Sheet data', err);
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

      // Gather Assets
      formSections.assets.forEach(cat => {
        cat.fields.forEach(field => {
          const key = `${cat.title}_${field}`;
          const amount = parseFloat(values[key]) || 0;
          items.push({ category: cat.title, sub_category: field, type: 'asset', amount });
        });
      });

      // Gather Liabilities
      formSections.liabilities.forEach(cat => {
        cat.fields.forEach(field => {
          const key = `${cat.title}_${field}`;
          const amount = parseFloat(values[key]) || 0;
          items.push({ category: cat.title, sub_category: field, type: 'liability', amount });
        });
      });

      // Gather Equity
      formSections.equity.forEach(cat => {
        cat.fields.forEach(field => {
          const key = `${cat.title}_${field}`;
          const amount = parseFloat(values[key]) || 0;
          items.push({ category: cat.title, sub_category: field, type: 'equity', amount });
        });
      });

      await balanceSheetAPI.createOrUpdate({ client: clientId, year: selectedYear, items });
      toast.success('Balance Sheet saved successfully');
    } catch (err) {
      console.error('Failed to save Balance Sheet', err);
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
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">Balance Sheet</h1>
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
             
             {/* Balance Warnings */}
             {summary.balance_difference !== 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center space-x-3 text-amber-700 shadow-sm">
                   <AlertCircle size={24} className="flex-shrink-0 text-amber-500" />
                   <div>
                      <div className="font-bold">Balance Mismatch</div>
                      <div className="text-xs">Assets do not match Liabilities + Equity. Difference: <span className="font-bold">₹{Math.abs(summary.balance_difference).toFixed(2)}</span></div>
                   </div>
                </div>
             )}

             {/* Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard 
                  title="Total Assets" 
                  amount={summary.total_assets} 
                  icon={<Landmark className="text-blue-500" size={20} />} 
                  bgColor="bg-blue-50/50" 
                  borderColor="border-blue-200/60"
                  textColor="text-blue-600"
                />
                <SummaryCard 
                  title="Total Liabilities" 
                  amount={summary.total_liabilities} 
                  icon={<Scale className="text-red-500" size={20} />} 
                  bgColor="bg-red-50/50" 
                  borderColor="border-red-200/60"
                  textColor="text-red-600"
                />
                <SummaryCard 
                  title="Total Equity" 
                  amount={summary.total_equity} 
                  icon={<Coins className="text-green-500" size={20} />} 
                  bgColor="bg-green-50/50" 
                  borderColor="border-green-200/60"
                  textColor="text-green-600"
                />
             </div>

             {/* Accordions */}
             <div className="space-y-4">
               <AccordionBlock 
                 title="Assets" 
                 isOpen={openSections['Assets']} 
                 onToggle={() => toggleSection('Assets')}
                 data={formSections.assets}
                 values={values}
                 onChange={handleInputChange}
                 accentColor="before:bg-blue-500"
               />

               <AccordionBlock 
                 title="Liabilities" 
                 isOpen={openSections['Liabilities']} 
                 onToggle={() => toggleSection('Liabilities')}
                 data={formSections.liabilities}
                 values={values}
                 onChange={handleInputChange}
                 accentColor="before:bg-red-500"
               />

               <AccordionBlock 
                 title="Equity" 
                 isOpen={openSections['Equity']} 
                 onToggle={() => toggleSection('Equity')}
                 data={formSections.equity}
                 values={values}
                 onChange={handleInputChange}
                 accentColor="before:bg-green-500"
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
                    {/* Hide Title if standard Equity type structure setup correctly */}
                    {category.title !== title && (
                       <h4 className="font-bold text-slate-600 text-xs uppercase tracking-wider">{category.title}</h4>
                    )}
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

export default BSInputField;
