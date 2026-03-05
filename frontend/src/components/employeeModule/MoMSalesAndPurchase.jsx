import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, LayoutGrid, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const mockGraphData = [
  { name: 'Apr', prev: 200, current: 300 },
  { name: 'May', prev: 250, current: 280 },
  { name: 'Jun', prev: 280, current: 350 },
  { name: 'Jul', prev: 220, current: 400 },
  { name: 'Aug', prev: 300, current: 420 },
  { name: 'Sep', prev: 350, current: 380 },
  { name: 'Oct', prev: 400, current: 450 },
  { name: 'Nov', prev: 450, current: 500 },
  { name: 'Dec', prev: 420, current: 550 },
  { name: 'Jan', prev: 480, current: 520 },
  { name: 'Feb', prev: 500, current: 600 },
  { name: 'Mar', prev: 550, current: 650 },
];

const months = ['April', 'May', 'June', 'Jul', 'August', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March'];
const purchaseOptions = ['Purchase PM', 'Purchase RM', 'Purchase Trading', 'Purchase Consumables'];

const MoMSalesAndPurchase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  const [activeTab, setActiveTab] = useState('Sales');
  
  const [isPurchaseDropdownOpen, setIsPurchaseDropdownOpen] = useState(false);
  const [purchaseType, setPurchaseType] = useState('Purchase RM');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPurchaseDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderTable = () => (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs md:text-sm text-left text-slate-600 min-w-[300px]">
          <thead className="bg-slate-100/80 text-slate-500 border-b border-slate-200">
             <tr>
                <th className="py-3 px-3 md:px-4 font-semibold border-r border-slate-200" style={{width: '25%'}}>Month</th>
                <th className="py-3 px-3 md:px-4 font-semibold border-r border-slate-200 text-center bg-slate-100/50" style={{width: '25%'}}>2023-24</th>
                <th className="py-3 px-3 md:px-4 font-semibold border-r border-slate-200 text-center bg-slate-100" style={{width: '25%'}}>2024-25</th>
                <th className="py-3 px-3 md:px-4 font-semibold text-center bg-slate-100/50" style={{width: '25%'}}>2025-26</th>
             </tr>
          </thead>
          <tbody>
             {months.map(m => (
                <tr key={m} className="border-b border-slate-100 bg-white">
                   <td className="py-2.5 px-3 md:px-4 border-r border-slate-200 font-medium text-slate-700">{m}</td>
                   <td className="py-2.5 px-3 md:px-4 border-r border-slate-200 text-right"></td>
                   <td className="py-2.5 px-3 md:px-4 border-r border-slate-200 text-right"></td>
                   <td className="py-2.5 px-3 md:px-4 text-right"></td>
                </tr>
             ))}
             <tr className="bg-slate-50 border-t border-slate-200">
               <td className="py-3 px-3 md:px-4 font-bold text-slate-800 border-r border-slate-200">Total</td>
               <td className="py-3 px-3 md:px-4 font-bold text-slate-800 border-r border-slate-200 text-right">0</td>
               <td className="py-3 px-3 md:px-4 font-bold text-slate-800 border-r border-slate-200 text-right">0</td>
               <td className="py-3 px-3 md:px-4 font-bold text-slate-800 text-right">0</td>
             </tr>
          </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/reports`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Revenue from business</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-4xl mx-auto space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Tabs Toggle */}
        <div className="flex border border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50">
          <button 
            className={`flex-1 py-3 text-sm md:text-base font-semibold rounded-lg transition-all ${activeTab === 'Sales' ? 'bg-[#3A565A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('Sales')}
          >
            Sales
          </button>
          <button 
            className={`flex-1 py-3 text-sm md:text-base font-semibold rounded-lg transition-all ${activeTab === 'Purchase' ? 'bg-[#3A565A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => setActiveTab('Purchase')}
          >
            Purchase
          </button>
        </div>

        {activeTab === 'Sales' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             
             {/* Taxable Sales (Product) Chart */}
             <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
               <div className="bg-slate-50/80 px-5 py-3.5 flex justify-between items-center border-b border-slate-200">
                  <span className="font-bold text-slate-800">Taxable Sales (Product)</span>
                  <LayoutGrid size={18} className="text-slate-500" />
               </div>
               <div className="p-5 h-[280px]">
                  <ResponsiveContainer width="100%" height="85%">
                     <LineChart data={mockGraphData} margin={{ top: 10, right: 0, left: -25, bottom: 5 }}>
                        <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                        <YAxis axisLine={true} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                        <Line type="monotone" dataKey="prev" stroke="#EC4899" strokeWidth={2.5} dot={false} />
                        <Line type="monotone" dataKey="current" stroke="#6366F1" strokeWidth={2.5} dot={false} />
                     </LineChart>
                  </ResponsiveContainer>
                  <div className="flex justify-around text-xs font-semibold text-slate-600 mt-4 px-4 border-t border-slate-100 pt-3">
                     <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#EC4899] mr-2"></div>2023-2024</span>
                     <span className="flex items-center opacity-50"><div className="w-2 h-2 rounded-full bg-slate-300 mr-2"></div>2024-2025</span>
                     <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#6366F1] mr-2"></div>2025-2026</span>
                  </div>
               </div>
             </div>

             {/* Taxable Sales (Service) Table */}
             <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
               <div className="bg-slate-50/80 px-5 py-3.5 flex justify-between items-center border-b border-slate-200">
                  <span className="font-bold text-slate-800">Taxable Sales (Service)</span>
                  <TrendingUp size={18} className="text-slate-500" />
               </div>
               {renderTable()}
             </div>

             {/* Total Sales Chart */}
             <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
               <div className="bg-slate-50/80 px-5 py-3.5 flex justify-between items-center border-b border-slate-200">
                  <span className="font-bold text-slate-800">Total Sales</span>
                  <LayoutGrid size={18} className="text-slate-500" />
               </div>
               <div className="p-5 h-[280px]">
                  <ResponsiveContainer width="100%" height="85%">
                     <LineChart data={mockGraphData} margin={{ top: 10, right: 0, left: -25, bottom: 5 }}>
                        <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                        <YAxis axisLine={true} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                        <Line type="monotone" dataKey="prev" stroke="#EC4899" strokeWidth={2.5} dot={false} />
                        <Line type="monotone" dataKey="current" stroke="#6366F1" strokeWidth={2.5} dot={false} />
                     </LineChart>
                  </ResponsiveContainer>
                  <div className="flex justify-around text-xs font-semibold text-slate-600 mt-4 px-4 border-t border-slate-100 pt-3">
                     <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#EC4899] mr-2"></div>2023-2024</span>
                     <span className="flex items-center opacity-50"><div className="w-2 h-2 rounded-full bg-slate-300 mr-2"></div>2024-2025</span>
                     <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#6366F1] mr-2"></div>2025-2026</span>
                  </div>
               </div>
             </div>

          </div>
        )}

        {activeTab === 'Purchase' && (
          <div className="space-y-6 animate-in fade-in duration-500">
              
              {/* Purchase Dropdown */}
              <div className="relative" ref={dropdownRef}>
                 <div 
                   className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex items-center justify-between cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
                   onClick={() => setIsPurchaseDropdownOpen(!isPurchaseDropdownOpen)}
                 >
                   <span className="font-semibold text-slate-800">{purchaseType || 'Purchase'}</span>
                   <ChevronDown size={20} className={`text-slate-500 transition-transform ${isPurchaseDropdownOpen ? 'rotate-180' : ''}`} />
                 </div>

                 {isPurchaseDropdownOpen && (
                   <div className="absolute top-full right-0 mt-2 w-full md:w-[250px] bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2 flex flex-col overflow-hidden">
                     {purchaseOptions.map(option => (
                        <div 
                          key={option}
                          className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium border-b border-slate-50 last:border-0"
                          onClick={() => {
                             setPurchaseType(option);
                             setIsPurchaseDropdownOpen(false);
                          }}
                        >
                          {option}
                        </div>
                     ))}
                   </div>
                 )}
              </div>

              {/* Purchase Table Card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                 <div className="bg-white px-5 py-4 flex justify-between items-center border-b border-slate-200">
                    <span className="font-bold text-slate-800 text-lg">{purchaseType}</span>
                    <div className="flex space-x-3 text-slate-400">
                       <div className="p-1 hover:bg-slate-100 rounded cursor-pointer transition-colors hover:text-slate-800">
                         <ChevronLeft size={20} />
                       </div>
                       <div className="p-1 hover:bg-slate-100 rounded cursor-pointer transition-colors hover:text-slate-800">
                         <ChevronRight size={20} />
                       </div>
                    </div>
                 </div>
                 {renderTable()}
              </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default MoMSalesAndPurchase;
