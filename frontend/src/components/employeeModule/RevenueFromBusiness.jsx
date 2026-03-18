import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ChevronRight, Loader2 } from 'lucide-react';
import { businessSummaryAPI } from '../../services/api';
import { toast } from 'react-toastify';

const years = ['2020 - 2021', '2021 - 2022', '2022 - 2023', '2023 - 2024', '2024 - 2025'];
const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const RevenueFromBusiness = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id;

  const [activeTab, setActiveTab] = useState('Sell');
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [yearlyData, setYearlyData] = useState([]);

  // Form State - Sell
  const [salesProductTaxable, setSalesProductTaxable] = useState('');
  const [salesServiceTaxable, setSalesServiceTaxable] = useState('');
  
  // Form State - Purchase
  const [purchaseRm, setPurchaseRm] = useState('');
  const [purchaseTrading, setPurchaseTrading] = useState('');
  const [purchasePm, setPurchasePm] = useState('');
  const [purchaseConsumables, setPurchaseConsumables] = useState('');

  // Auto-calculated fields
  const [salesTotalTaxable, setSalesTotalTaxable] = useState(0);
  const [purchaseTotal, setPurchaseTotal] = useState(0);

  // Calculate Sales Total Taxable
  useEffect(() => {
    const total = (parseFloat(salesProductTaxable) || 0) + (parseFloat(salesServiceTaxable) || 0);
    setSalesTotalTaxable(total);
  }, [salesProductTaxable, salesServiceTaxable]);

  // Calculate Purchase Total
  useEffect(() => {
    const total = 
      (parseFloat(purchaseRm) || 0) + 
      (parseFloat(purchaseTrading) || 0) + 
      (parseFloat(purchasePm) || 0) + 
      (parseFloat(purchaseConsumables) || 0);
    setPurchaseTotal(total);
  }, [purchaseRm, purchaseTrading, purchasePm, purchaseConsumables]);

  // Fetch Single Month Data when Year & Month are selected
  useEffect(() => {
    if (clientId && selectedYear && selectedMonth) {
      fetchData();
    }
  }, [clientId, selectedYear, selectedMonth]);

  // Fetch Yearly Data when Year changes
  useEffect(() => {
    if (clientId && selectedYear) {
      fetchYearlyData();
    }
  }, [clientId, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await businessSummaryAPI.getSingleMonth(clientId, selectedYear, selectedMonth);
      const data = res?.data?.data;

      if (data) {
        // Populate Sell state
        setSalesProductTaxable(data.sales_product_taxable?.toString() || '');
        setSalesServiceTaxable(data.sales_service_taxable?.toString() || '');

        // Populate Purchase state
        setPurchaseRm(data.purchase_rm?.toString() || '');
        setPurchaseTrading(data.purchase_trading?.toString() || '');
        setPurchasePm(data.purchase_pm?.toString() || '');
        setPurchaseConsumables(data.purchase_consumables?.toString() || '');
      } else {
        // Reset form for new entry
        resetForm();
      }
    } catch (err) {
      console.error('Failed to fetch business summary', err);
      toast.error('Unable to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyData = async () => {
    try {
      const res = await businessSummaryAPI.getByClientAndYear(clientId, selectedYear);
      setYearlyData(res?.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch yearly business data', err);
    }
  };

  const resetForm = () => {
    setSalesProductTaxable('');
    setSalesServiceTaxable('');
    setPurchaseRm('');
    setPurchaseTrading('');
    setPurchasePm('');
    setPurchaseConsumables('');
  };

  const handleSave = async () => {
    if (!selectedYear || !selectedMonth) {
      toast.warning('Please select Year and Month');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        client_id: clientId,
        year: selectedYear,
        month: selectedMonth,
        sales_product_taxable: salesProductTaxable || 0,
        sales_service_taxable: salesServiceTaxable || 0,
        purchase_rm: purchaseRm || 0,
        purchase_trading: purchaseTrading || 0,
        purchase_pm: purchasePm || 0,
        purchase_consumables: purchaseConsumables || 0,
      };

      await businessSummaryAPI.createOrUpdate(payload);
      toast.success('Data saved successfully');
      fetchYearlyData(); // Refresh yearly table
    } catch (err) {
      console.error('Failed to save business summary', err);
      toast.error(err.response?.data?.message || 'Failed to save data');
    } finally {
      setLoading(false);
    }
  };

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
                {selectedMonth || 'Select Month'}
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

        {loading && !salesProductTaxable && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#3A565A]" size={36} />
          </div>
        )}

        {/* Dynamic Content (Only show if Month and Year selected) */}
        {!loading && selectedYear && selectedMonth && (
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
               {/* Summary Total Header */}
               <div className="flex items-center justify-between mt-2">
                 <span className="text-slate-600 font-medium text-sm md:text-base">
                   {activeTab === 'Sell' ? 'Total Taxable Sales' : 'Total Purchase'}
                 </span>
                 <div className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-right font-bold text-[#3A565A]">
                    {activeTab === 'Sell' ? salesTotalTaxable.toFixed(2) : purchaseTotal.toFixed(2)}
                 </div>
               </div>

               {activeTab === 'Sell' ? (
                 <>
                   <InputField 
                     label="Taxable Sales (Product)" 
                     value={salesProductTaxable} 
                     onChange={(e) => setSalesProductTaxable(e.target.value)} 
                   />
                   <InputField 
                     label="Taxable Sales (Service)" 
                     value={salesServiceTaxable} 
                     onChange={(e) => setSalesServiceTaxable(e.target.value)} 
                   />
                 </>
               ) : (
                 <>
                   <InputField 
                     label="Purchase RM" 
                     value={purchaseRm} 
                     onChange={(e) => setPurchaseRm(e.target.value)} 
                   />
                   <InputField 
                     label="Purchase Trading" 
                     value={purchaseTrading} 
                     onChange={(e) => setPurchaseTrading(e.target.value)} 
                   />
                   <InputField 
                     label="Purchase PM" 
                     value={purchasePm} 
                     onChange={(e) => setPurchasePm(e.target.value)} 
                   />
                   <InputField 
                     label="Purchase Consumables" 
                     value={purchaseConsumables} 
                     onChange={(e) => setPurchaseConsumables(e.target.value)} 
                   />
                 </>
               )}
             </div>

             {/* Save Button */}
             <div className="pt-4 flex justify-center">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-[#3A565A] text-white px-12 py-3 rounded-full font-bold shadow-md hover:bg-[#2a3e41] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
             </div>

           </div>
        )}

        {/* Yearly History Section */}
        {selectedYear && yearlyData.length > 0 && (
          <div className="mt-10 border-t pt-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Past Monthly Records ({selectedYear})</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-sm">
                    <th className="p-3 font-semibold">Month</th>
                    <th className="p-3 font-semibold text-right">Total Sales</th>
                    <th className="p-3 font-semibold text-right">Total Purchase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...yearlyData].sort((a, b) => {
                    const order = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return order.indexOf(a.month) - order.indexOf(b.month);
                  }).map((item) => (
                    <tr key={item._id} className="text-slate-700 hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">{item.month}</td>
                      <td className="p-3 text-right font-semibold text-green-600">{item.sales_total_taxable?.toFixed(2)}</td>
                      <td className="p-3 text-right font-semibold text-orange-600">{item.purchase_total?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-600 text-sm md:text-base">{label}</span>
    <input 
      type="number" 
      min="0"
      step="0.01"
      value={value}
      onChange={onChange}
      className="w-1/2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-right focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A] transition-all" 
      placeholder="0.00"
    />
  </div>
);

export default RevenueFromBusiness;
