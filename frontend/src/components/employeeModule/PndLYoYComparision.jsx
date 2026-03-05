import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const mockIncomeData = [
  { 
    id: 'revenue', label: 'Revenue from Operations', val1: null, val2: null,
    subItems: [
      { label: 'Revenue from Operations', val1: '5000', val2: '4500' },
      { label: 'Domestic Sales Revenue', val1: '5000', val2: '4500' },
      { label: 'Sales of Service', val1: '5000', val2: '4500' }
    ]
  },
  { id: 'closing_stock', label: 'Closing Stock', val1: '65800', val2: '85800' },
  { id: 'other_direct', label: 'Other Direct Income', val1: '65800', val2: '85800' },
  { id: 'other_indirect', label: 'Other Indirect Income', val1: '65800', val2: '85800' },
  { id: 'total_income', label: 'Total income', val1: '65800', val2: '85600', highlight: true }
];

const mockExpensesData = [
  { id: 'opening_stock', label: 'Opening Stock', val1: '65800', val2: '65800' },
  { 
    id: 'purchase', label: 'Purchase', val1: null, val2: null,
    subItems: [
      { label: 'Purchase RM', val1: '5000', val2: '4500' },
      { label: 'Purchase PM', val1: '5000', val2: '4500' },
      { label: 'Purchase Consumables', val1: '5000', val2: '4500' },
      { label: 'Purchase Trading Materials', val1: '5000', val2: '4500' },
      { label: 'Total Purchase', val1: '5000', val2: '4500', highlight: true }
    ]
  },
  { id: 'direct_exp', label: 'Direct Expenses', val1: null, val2: null },
  { id: 'direct_labor', label: 'Direct Labor Expenses', val1: '85600', val2: '85600' },
  { id: 'power_exp', label: 'Power Expenses', val1: '85600', val2: '85600' },
  { 
    id: 'mfg_overheads', label: 'Manufacturing Overheads', val1: null, val2: null,
    subItems: [
      { label: 'Factory Rent', val1: '5000', val2: '4500' },
      { label: 'Plant & Machinery Maintenance', val1: '5000', val2: '4500' },
      { label: 'Quality Control Testing', val1: '5000', val2: '4500' }
    ]
  },
  { 
    id: 'other_direct_exp', label: 'Other Direct Expenses', val1: null, val2: null,
    subItems: [
      { label: 'Freight Inward', val1: '5000', val2: '4500' },
      { label: 'Loading & Hamali Expenses', val1: '5000', val2: '4500' },
      { label: 'Labour Contract Expenses', val1: '5000', val2: '4500' },
      { label: 'Other Direct Expenses', val1: '5000', val2: '4500' }
    ]
  },
  { id: 'total_direct_exp', label: 'Total Direct Expenses', val1: '65800', val2: '65800', highlight: true },
  { id: 'cogs', label: 'Cost of Goods Sold', val1: '65800', val2: '65800', highlight: true },
  { id: 'gross_profit', label: 'Gross Profit', val1: '65800', val2: '65800', highlight: true },
  { id: 'indirect_exp', label: 'Indirect Expenses', val1: null, val2: null },
  { 
    id: 'operating_exp', label: 'Operating Expenses', val1: null, val2: null,
    subItems: [
      { label: 'Rent and Lease Expenses', val1: '5000', val2: '4500' },
      { label: 'Utilities and Electricity', val1: '5000', val2: '4500' },
      { label: 'Certification Charges', val1: '5000', val2: '4500' },
      { label: 'Insurance Expenses', val1: '5000', val2: '4500' },
      { label: 'Repairs and Maintenance', val1: '5000', val2: '4500' },
      { label: 'Telephone and Internet', val1: '5000', val2: '4500' },
      { label: 'Total Operating Expenses', val1: '5000', val2: '4500', highlight: true }
    ]
  },
  { 
    id: 'selling_exp', label: 'Selling & Distribution Expenses', val1: null, val2: null,
    subItems: [
      { label: 'Marketing and Advertising', val1: '5000', val2: '4500' },
      { label: 'Sales Commission', val1: '5000', val2: '4500' },
      { label: 'Freight & Shipping Outwards', val1: '5000', val2: '4500' },
      { label: 'Total Selling & Distribution', val1: '5000', val2: '4500', highlight: true }
    ]
  },
  { 
    id: 'employee_benefits', label: 'Employee Benefits', val1: null, val2: null,
    subItems: [
      { label: 'Office & Administrative Salaries', val1: '5000', val2: '4500' },
      { label: 'Employee Welfare', val1: '5000', val2: '4500' },
      { label: 'Total Employee Benefits', val1: '5000', val2: '4500', highlight: true }
    ]
  },
  { id: 'other_exp', label: 'Other Expenses', val1: '85600', val2: '85600' },
  { id: 'ebitda', label: 'EBITDA', val1: '85600', val2: '85600', highlight: true },
  { id: 'depreciation', label: 'Depreciation & Amortization', val1: '85600', val2: '85600' },
  { id: 'ebit', label: 'EBIT', val1: '85600', val2: '85600', highlight: true },
  { 
    id: 'financial_exp', label: 'Financial Expenses', val1: null, val2: null,
    subItems: [
      { label: 'Interest on Loans', val1: '5000', val2: '4500' },
      { label: 'Bank Charges', val1: '5000', val2: '4500' },
      { label: 'Total Financial Expenses', val1: '5000', val2: '4500', highlight: true }
    ]
  },
  { id: 'pbt', label: 'Profit Before Tax', val1: '85600', val2: '85600', highlight: true },
  { id: 'provision_tax', label: 'Provision for Tax', val1: '85600', val2: '85600' },
  { id: 'pat', label: 'Net Profit (PAT)', val1: '85600', val2: '85600', highlight: true }
];

const PndLYoYComparision = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  const [activeToggle, setActiveToggle] = useState('%'); // '₹' | '%'
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const renderRows = (dataSection) => {
    return dataSection.map((item) => {
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isOpen = openSections[item.id];
      
      return (
        <React.Fragment key={item.id || item.label}>
          {/* Main Table Row */}
          <tr 
            className={`border-b border-slate-100 transition-colors ${item.highlight ? 'bg-slate-50/50' : 'bg-white'} ${hasSubItems ? 'cursor-pointer hover:bg-slate-50' : ''}`}
            onClick={() => hasSubItems && toggleSection(item.id)}
          >
            <td className={`py-4 px-4 text-left border-r border-slate-100 ${item.highlight ? 'font-bold text-slate-800' : 'font-medium text-slate-700'} text-xs md:text-sm`}>
              <div className="flex items-center justify-between">
                <span className="flex-1 pr-2">{item.label}</span>
                {hasSubItems && (
                  <div className="bg-white p-0.5 rounded-full border border-slate-300 shadow-sm shrink-0 flex items-center justify-center h-5 w-5 md:h-6 md:w-6 transition-transform duration-200">
                    {isOpen ? <ChevronUp size={14} className="text-[#3A565A]" /> : <ChevronDown size={14} className="text-[#3A565A]" />}
                  </div>
                )}
              </div>
            </td>
            <td className={`py-4 px-2 md:px-4 border-r border-slate-100 text-center ${item.highlight ? 'font-bold text-slate-800' : ''} text-xs md:text-sm`}>{item.val1}</td>
            <td className={`py-4 px-2 md:px-4 text-center ${item.highlight ? 'font-bold text-slate-800' : ''} text-xs md:text-sm`}>{item.val2}</td>
          </tr>

          {/* Expanded Inline FAQ Rows - Nested directly into main tbody to fit exact column widths without cutting off fields */}
          {hasSubItems && isOpen && (
            <>
              {/* Added light gap row as top border indicator to look exactly like mockup popup */}
              <tr className="bg-slate-50 border-b border-slate-200">
                <td className="py-2.5 px-4 text-left border-r border-slate-200 font-bold text-[#3A565A] text-xs">
                  {item.label}
                </td>
                <td className="py-2.5 px-2 md:px-4 border-r border-slate-200 font-semibold text-center text-slate-500 text-[10px] md:text-xs">2023-24</td>
                <td className="py-2.5 px-2 md:px-4 font-semibold text-center text-slate-500 text-[10px] md:text-xs">2024-25</td>
              </tr>
              {item.subItems.map((sub, sIdx) => (
                <tr key={`${item.id}-sub-${sIdx}`} className={`bg-white transition-colors border-b border-slate-100 ${sub.highlight ? 'font-bold bg-slate-50' : ''}`}>
                  <td className="py-3 px-6 md:px-8 text-left border-r border-slate-200 flex items-center text-slate-600">
                    {!sub.highlight && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2 md:mr-3 shrink-0"></div>}
                    <span className="text-xs md:text-sm">{sub.label}</span>
                  </td>
                  <td className="py-3 px-2 md:px-4 border-r border-slate-200 text-center text-slate-700 text-xs md:text-sm">{sub.val1}</td>
                  <td className="py-3 px-2 md:px-4 text-center text-slate-700 text-xs md:text-sm">{sub.val2}</td>
                </tr>
              ))}
              {/* Adding slightly darker line at bottom of the open dropdown group to close off the box */}
              <tr className="bg-[#3A565A]/10"><td colSpan="3" className="p-[1px]"></td></tr>
            </>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-4 md:px-10 py-5 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={24} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full hidden sm:block md:w-[32px] md:h-[32px]" 
          onClick={() => navigate(`/employee/clients/${clientId}/reports`)}
        />
        <h1 className="text-xl md:text-3xl font-bold text-slate-800">PndL Comparision</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto pt-4 md:pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
        <div className="border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-max">
          
          {/* Year Selector */}
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10 w-full">
            <ChevronLeft size={20} className="text-slate-500 cursor-pointer hover:text-slate-800 hover:-translate-x-1 transition-transform shrink-0" />
            <h2 className="font-bold text-slate-800 text-sm md:text-lg mx-2 text-center whitespace-nowrap overflow-hidden text-ellipsis">2023-24 vs 2024-25</h2>
            <ChevronRight size={20} className="text-slate-500 cursor-pointer hover:text-slate-800 hover:translate-x-1 transition-transform shrink-0" />
          </div>

          {/* Toggle (₹ / %) */}
          <div className="p-3 border-b border-slate-200 bg-white flex justify-end sticky top-[65px] md:top-[74px] z-10 w-full">
            <div className="flex bg-slate-50 rounded-full border border-slate-200 overflow-hidden shadow-sm">
              <button 
                className={`px-4 py-1.5 text-xs md:text-sm font-bold transition-colors ${activeToggle === '₹' ? 'bg-[#3A565A] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setActiveToggle('₹')}
              >₹</button>
              <button 
                className={`px-4 py-1.5 text-xs md:text-sm font-bold transition-colors ${activeToggle === '%' ? 'bg-[#3A565A] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setActiveToggle('%')}
              >%</button>
            </div>
          </div>

          {/* Table Header Wrapper for sticky */}
          <div className="sticky top-[120px] md:top-[128px] z-10 bg-white shadow-sm w-full">
            <table className="w-full text-xs md:text-sm text-center text-slate-600 table-fixed">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold border-r border-slate-200 w-1/2 md:w-[50%]"></th>
                  <th className="py-3 px-2 md:px-4 font-semibold border-r border-slate-200 w-1/4 md:w-[25%] text-xs md:text-sm">2023-24</th>
                  <th className="py-3 px-2 md:px-4 font-semibold w-1/4 md:w-[25%] text-xs md:text-sm">2024-25</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Table Body - ensuring w-full scaling with table-fixed for strict column locking so no fields can overflow */}
          <div className="w-full flex-1 pb-4">
            <table className="w-full text-xs md:text-sm text-center text-slate-600 table-fixed">
              <tbody>
                
                {/* Income Section */}
                <tr className="bg-white border-b border-slate-200">
                  <td colSpan="3" className="py-3 px-4 font-bold text-slate-800 text-left w-full text-sm">Income</td>
                </tr>
                {renderRows(mockIncomeData)}

                {/* Expenses Section */}
                <tr className="bg-white border-b border-slate-200 border-t border-t-slate-100">
                  <td colSpan="3" className="py-3 px-4 font-bold text-slate-800 text-left w-full text-sm">Expenses</td>
                </tr>
                {renderRows(mockExpensesData)}

              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PndLYoYComparision;
