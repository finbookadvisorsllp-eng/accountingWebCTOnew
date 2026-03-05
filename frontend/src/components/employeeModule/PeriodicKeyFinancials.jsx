import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, FileText, CheckSquare, BarChart2, Package, Briefcase, Percent } from 'lucide-react';

const mockInvoiceData = [
  { label: 'No. of Invoice Prepared', value: '₹450' },
  { label: 'Total Sales', value: '₹6532000' },
  { label: 'Avg Sales per Invoice', value: '₹32000' },
  { label: 'Sales Returns', value: '₹32000' },
  { label: 'Discounts Allowed', value: '₹32000' }
];

const mockFundData = [
  { label: 'Cash In Hand', value: '₹450' },
  { label: 'Cash at Bank', value: '₹6532000' },
  { label: 'Loans Taken from Bank or NBFC', value: '₹32000' },
  { label: 'Loans Repaid from Bank or NBFC', value: '₹32000' },
  { label: 'Fixed Assets Purchased', value: '₹32000' },
  { label: 'Fixed Assets Sold', value: '₹32000' }
];

const mockStockData = [
  { label: 'Closing Stock', value: '₹3450' }
];

const mockDebtorsData = [
  { label: 'Bank', value: '₹3450' },
  { label: 'Cash', value: '₹6532000' }
];

const mockSalesData = [
  { label: 'Cash Sales', value: '₹450' },
  { label: 'Credit Sales', value: '₹6532000' },
  { label: 'Export Sales', value: '₹32000' },
  { label: 'Domestic Sales', value: '₹32000' },
  { label: 'Sales Product', value: '₹32000' },
  { label: 'Sales Service', value: '₹32000' }
];

const mockTaxData = [
  { label: 'Period', value: '01/04/25 to 15/04/25' },
  { label: 'GST Output', value: '₹6532000' },
  { label: 'GST Input', value: '₹32000' },
  { label: 'Advance Tax Paid', value: '₹32000' },
  { label: 'Mandi Tax Paid', value: '₹32000' },
  { label: 'Excise Duty Paid', value: '₹32000' },
  { label: 'VAT Paid', value: '₹32000' }
];

const AccordionItem = ({ title, icon: Icon, data, isOpen, onToggle }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all mb-4">
      <div 
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-slate-100 p-2 rounded-lg">
            <Icon size={20} className="text-slate-600" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">{title}</h3>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
      </div>
      
      {isOpen && (
        <div className="border-t border-slate-100">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="px-5 py-3.5 flex justify-between items-center border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-600">{item.label}</span>
              <span className="text-sm font-bold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PeriodicKeyFinancials = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  const [startDate, setStartDate] = useState('2025-03-01');
  const [endDate, setEndDate] = useState('2025-03-15');
  
  // Manage open states individually so they act like the mockup (which shows multiple open at once)
  const [openSections, setOpenSections] = useState({
    invoice: false,
    debtors: false,
    sales: false,
    stock: false,
    fund: false,
    tax: false
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/reports`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Periodic Key Financials</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Date Pickers */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:flex-1 bg-white border border-[#3A565A] text-slate-700 font-semibold rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-shadow text-center shadow-sm"
          />
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:flex-1 bg-white border border-[#3A565A] text-slate-700 font-semibold rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#3A565A]/50 transition-shadow text-center shadow-sm"
          />
        </div>

        {/* Accordion Lists */}
        <div className="space-y-4">
          <AccordionItem 
            title="Invoice" 
            icon={FileText} 
            data={mockInvoiceData} 
            isOpen={openSections.invoice} 
            onToggle={() => toggleSection('invoice')} 
          />
          <AccordionItem 
            title="Debtors Collection" 
            icon={CheckSquare} 
            data={mockDebtorsData} 
            isOpen={openSections.debtors} 
            onToggle={() => toggleSection('debtors')} 
          />
          <AccordionItem 
            title="Sales" 
            icon={BarChart2} 
            data={mockSalesData} 
            isOpen={openSections.sales} 
            onToggle={() => toggleSection('sales')} 
          />
          <AccordionItem 
            title="Stock" 
            icon={Package} 
            data={mockStockData} 
            isOpen={openSections.stock} 
            onToggle={() => toggleSection('stock')} 
          />
          <AccordionItem 
            title="Fund Management" 
            icon={Briefcase} 
            data={mockFundData} 
            isOpen={openSections.fund} 
            onToggle={() => toggleSection('fund')} 
          />
          <AccordionItem 
            title="Tax and Compliance" 
            icon={Percent} 
            data={mockTaxData} 
            isOpen={openSections.tax} 
            onToggle={() => toggleSection('tax')} 
          />
        </div>

      </div>
    </div>
  );
};

export default PeriodicKeyFinancials;
