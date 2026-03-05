import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const mockKeyRatiosData = [
  { label: 'Current Assets', year1: '85600', year2: '85600' },
  { label: 'Current Liabilities', year1: '85600', year2: '85600' },
  { label: 'Working Capital Employed', year1: '85600', year2: '85600' },
  { label: 'Inventory', year1: '85600', year2: '85600' },
  { label: 'Cash', year1: '85600', year2: '85600' },
  { label: 'Daily Operating Expenses', year1: '85600', year2: '85600' },
  { label: 'COGS', year1: '85600', year2: '85600' },
  { label: 'Average Inventory', year1: '85600', year2: '85600' },
  { label: 'Average Accounts Receivable', year1: '85600', year2: '85600' },
  { label: 'Average Accounts Payable', year1: '85600', year2: '85600' },
  { label: 'Total Debt', year1: '85600', year2: '85600' },
  { label: 'Liquid Assets', year1: '85600', year2: '85600' },
  { label: 'Gross Profit', year1: '85600', year2: '85600' },
  { label: 'Net Profit', year1: '85600', year2: '85600' },
  { label: 'Operating Profit', year1: '85600', year2: '85600' },
  { label: 'EBITDA', year1: '85600', year2: '85600' },
  { label: 'Net Sales', year1: '85600', year2: '85600' },
  { label: 'Total Assets', year1: '85600', year2: '85600' },
  { label: 'Shareholder\'s Equity', year1: '85600', year2: '85600' },
  { label: 'Capital Employed', year1: '85600', year2: '85600' },
  { label: 'EBIT', year1: '85600', year2: '85600' },
  { label: 'Total Investment', year1: '85600', year2: '85600' },
  { label: 'Operating Expenses', year1: '85600', year2: '85600' },
  { label: 'Average Total Assets', year1: '85600', year2: '85600' },
  { label: 'Average Working Capital', year1: '85600', year2: '85600' },
  { label: 'Net Fixed Assets', year1: '85600', year2: '85600' },
  { label: 'Interest Expense', year1: '85600', year2: '85600' },
  { label: 'Total Debt Service', year1: '85600', year2: '85600' },
  { label: 'Gross Fixed Assets', year1: '85600', year2: '85600' },
];

const KeyRatios = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-3 px-4 md:px-10 py-5 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={24} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/reports`)}
        />
        <h1 className="text-xl md:text-3xl font-bold text-slate-800">Key Ratios</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-2 w-full max-w-2xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
        <div className="border-2 border-slate-400 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-max">
          
          {/* Year Selector */}
          <div className="p-4 border-b-2 border-slate-400 flex justify-between items-center bg-white sticky top-0 z-10">
            <ChevronLeft size={20} className="text-slate-500 cursor-pointer hover:text-slate-800 hover:-translate-x-1 transition-transform shrink-0" />
            <h2 className="font-bold text-slate-800 text-sm md:text-lg mx-2 text-center whitespace-nowrap overflow-hidden text-ellipsis">2023-24 vs 2024-25</h2>
            <ChevronRight size={20} className="text-slate-500 cursor-pointer hover:text-slate-800 hover:translate-x-1 transition-transform shrink-0" />
          </div>

          {/* Table Header Wrapper for sticky */}
          <div className="sticky top-[61px] md:top-[69px] z-10 bg-white shadow-sm w-full">
            <table className="w-full text-xs md:text-sm text-center text-slate-600 table-fixed">
              <thead className="bg-slate-200 border-b-2 border-t-2 border-slate-400">
                <tr>
                  <th className="py-4 px-4 text-left font-bold text-slate-800 border-r-2 border-slate-400 w-1/2 md:w-[50%]">Financial Figure</th>
                  <th className="py-4 px-2 md:px-4 font-bold text-slate-800 border-r-2 border-slate-400 w-1/4 md:w-[25%] text-xs md:text-sm">2023-24</th>
                  <th className="py-4 px-2 md:px-4 font-bold text-slate-800 w-1/4 md:w-[25%] text-xs md:text-sm">2024-25</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Table Body */}
          <div className="w-full flex-1 pb-4">
            <table className="w-full text-xs md:text-sm text-center text-slate-600 table-fixed">
              <tbody>
                {mockKeyRatiosData.map((item, idx) => (
                  <tr key={idx} className="bg-white border-b-2 border-slate-300 hover:bg-slate-200 transition-colors">
                    <td className="py-4 px-4 text-left font-medium text-slate-700 border-r-2 border-slate-300 w-1/2 md:w-[50%] break-words">
                      {item.label}
                    </td>
                    <td className="py-4 px-2 md:px-4 border-r-2 border-slate-300 text-center text-slate-600 w-1/4 md:w-[25%] text-xs md:text-sm">
                      {item.year1}
                    </td>
                    <td className="py-4 px-2 md:px-4 text-center text-slate-600 w-1/4 md:w-[25%] text-xs md:text-sm">
                      {item.year2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};

export default KeyRatios;
