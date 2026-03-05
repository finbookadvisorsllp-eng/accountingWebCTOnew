import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Download, Calendar } from 'lucide-react';

const yearOptions = ['2021-2022', '2022-2023', '2023-2024', '2024-2025'];

const IncomeTaxReturn = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  const [activeYear, setActiveYear] = useState('Year selection');
  const [isYearOpen, setIsYearOpen] = useState(false);
  const yearRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setIsYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/history`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Income tax return</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6 pt-6">
        
        {/* Year Dropdown */}
        <div className="relative z-20" ref={yearRef}>
          <div 
            onClick={() => setIsYearOpen(!isYearOpen)}
            className="bg-white rounded-lg border border-slate-300 px-4 py-3.5 flex items-center justify-between cursor-pointer hover:border-slate-400 shadow-sm transition-colors"
          >
             <span className={`font-medium ${activeYear === 'Year selection' ? 'text-slate-500' : 'text-slate-800 font-bold'}`}>
               {activeYear}
             </span>
             <Calendar size={20} className={`text-slate-400 transition-colors ${isYearOpen ? 'text-[#3A565A]' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isYearOpen && (
            <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-300 shadow-lg py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
              {yearOptions.map((yr, idx) => (
                <div key={yr}>
                  <div 
                    onClick={() => {
                      setActiveYear(yr);
                      setIsYearOpen(false);
                    }}
                    className={`px-4 py-2 text-center text-sm cursor-pointer transition-colors ${activeYear === yr ? 'bg-[#cbd5e1] font-bold text-slate-800 mx-4 rounded' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                  >
                    {yr}
                  </div>
                  {idx < yearOptions.length - 1 && <div className="border-b border-slate-200 mx-4 my-1"></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 relative z-10">

          {/* ITR Acknowledgment */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">ITR Acknowledgment</h3>
                <div className="flex items-center space-x-2">
                   <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Eye size={18} /></button>
                   <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Download size={18} /></button>
                </div>
             </div>
             <div className="p-5 space-y-3">
                <DetailRow label="Financial Year" value={activeYear === 'Year selection' ? "2023-24" : activeYear} />
                <DetailRow label="Acknowledgment Number" value="1234567890ABC" />
                <DetailRow label="Filed On" value="15-July-2024" />
                <DetailRow label="Status" value="Successfully Filed" />
             </div>
          </div>

          {/* Tax Payment Challan */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Tax Payment Challan</h3>
                <div className="flex items-center space-x-2">
                   <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Eye size={18} /></button>
                   <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Download size={18} /></button>
                </div>
             </div>
             <div className="p-5 space-y-3">
                <DetailRow label="Challan Number" value="5678WXYZ" />
                <DetailRow label="Date of Payment" value="20-June-2024" />
                <DetailRow label="Amount Paid" value="₹25,000" />
                <DetailRow label="Bank Name" value="SBI" />
             </div>
          </div>
          
          {/* Form 26AS */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Form 26AS</h3>
                <div className="flex items-center space-x-2">
                   <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Eye size={18} /></button>
                   <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Download size={18} /></button>
                </div>
             </div>
             <div className="p-5 space-y-3">
                <DetailRow label="Assessment Year" value={activeYear === 'Year selection' ? "2023-24" : activeYear} />
                <DetailRow label="TDS Deducted" value="₹30,000" />
                <DetailRow label="Advance Tax Paid" value="₹15,000" />
                <DetailRow label="Refund (if any)" value="₹5,000" />
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start">
     <div className="w-1/2 md:w-2/5 text-sm font-medium text-slate-500">{label}</div>
     <div className="w-1/2 md:w-3/5 text-sm font-bold text-slate-800">: {value}</div>
  </div>
);

export default IncomeTaxReturn;
