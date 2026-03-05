import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Download, ChevronDown } from 'lucide-react';

const mockGstReturns = [
  { id: 1, month: 'January 2023', turnover: '₹ XX,XX,XXX', arn: 'ABCD1234XYZ', filedDate: '20-June-2022' },
  { id: 2, month: 'February 2023', turnover: '₹ XX,XX,XXX', arn: 'ABCD1234XYZ', filedDate: '20-July-2022' },
  { id: 3, month: 'March 2023', turnover: '₹ XX,XX,XXX', arn: 'ABCD1234XYZ', filedDate: '20-August-2022' }
];

const gstrOptions = ['GSTR-1', 'GSTR-3B', 'GSTR-9', 'GSTR-9C'];
const yearOptions = ['2021-2022', '2022-2023', '2023-2024', '2024-2025'];

const GSTReturn = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  const [activeGstr, setActiveGstr] = useState('GSTR-3B');
  const [activeYear, setActiveYear] = useState('2022-2023');

  const [isGstrOpen, setIsGstrOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const gstrRef = useRef(null);
  const yearRef = useRef(null);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gstrRef.current && !gstrRef.current.contains(event.target)) setIsGstrOpen(false);
      if (yearRef.current && !yearRef.current.contains(event.target)) setIsYearOpen(false);
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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">GST return</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6 pt-6">
        
        {/* Dropdowns exactly matching Figma */}
        <div className="flex flex-row items-center gap-4 mb-8 relative z-20">
           
           {/* GSTR Dropdown */}
           <div className="relative w-1/2" ref={gstrRef}>
             <div 
               onClick={() => setIsGstrOpen(!isGstrOpen)}
               className="bg-white rounded-lg border border-slate-300 px-4 py-3 flex items-center justify-between cursor-pointer hover:border-slate-400 shadow-sm transition-colors"
             >
                <span className="text-slate-800 font-medium text-sm">Select {activeGstr}</span>
                <ChevronDown size={18} className={`text-slate-500 transition-transform ${isGstrOpen ? 'rotate-180' : ''}`} />
             </div>
             
             {/* GSTR Menu */}
             {isGstrOpen && (
               <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-300 shadow-lg py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                 {gstrOptions.map((opt, idx) => (
                   <div key={opt}>
                     <div 
                       onClick={() => {
                         setActiveGstr(opt);
                         setIsGstrOpen(false);
                       }}
                       className={`px-4 py-2 text-center text-sm cursor-pointer transition-colors ${activeGstr === opt ? 'bg-[#cbd5e1] font-bold text-slate-800 mx-4 rounded' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                     >
                       {opt}
                     </div>
                     {idx < gstrOptions.length - 1 && <div className="border-b border-slate-200 mx-4 my-1"></div>}
                   </div>
                 ))}
               </div>
             )}
           </div>
           
           {/* Year Dropdown */}
           <div className="relative w-1/2" ref={yearRef}>
             <div 
               onClick={() => setIsYearOpen(!isYearOpen)}
               className="bg-white rounded-lg border border-slate-300 px-4 py-2 flex items-center justify-between cursor-pointer hover:border-slate-400 shadow-sm transition-colors"
             >
                <div className="flex flex-col items-center flex-1">
                   <span className="text-xs text-slate-800 font-bold leading-tight">{activeGstr}</span>
                   <span className="text-slate-600 font-medium leading-tight text-sm">Financial year</span>
                </div>
                <ChevronDown size={18} className={`text-slate-500 transition-transform ${isYearOpen ? 'rotate-180' : ''}`} />
             </div>

             {/* Year Menu */}
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

        </div>

        {/* GST Filing Cards List */}
        <div className="space-y-6 relative z-10">
           {mockGstReturns.map((gst) => (
             <div key={gst.id} className="bg-white border border-slate-300 overflow-hidden shadow-sm">
                
                {/* Header of Card */}
                <div className="bg-[#f8fafc] px-5 py-3 border-b border-slate-300 flex items-center justify-between">
                   <div className="text-sm font-bold text-slate-800">Each Month Card Contains:</div>
                   <div className="flex items-center space-x-2">
                      <button className="p-2 bg-[#e2e8f0] text-[#334155] cursor-pointer hover:bg-slate-300 transition-colors"><Eye size={18} /></button>
                      <button className="p-2 bg-[#e2e8f0] text-[#334155] border-l border-slate-300 cursor-pointer hover:bg-slate-300 transition-colors"><Download size={18} /></button>
                   </div>
                </div>
                
                {/* Body of Card */}
                <div className="p-6 space-y-4">
                   <DetailRow label="Month Name" value={gst.month} />
                   <DetailRow label="GST Turnover" value={gst.turnover} />
                   <DetailRow label="ARN No" value={gst.arn} />
                   <DetailRow label="Date of Filing" value={gst.filedDate} />
                </div>
                
             </div>
           ))}
        </div>

      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start">
     <div className="w-1/2 md:w-2/5 text-[15px] font-medium text-slate-600">{label}</div>
     <div className="w-1/2 md:w-3/5 text-[15px] font-medium text-slate-800">: {value}</div>
  </div>
);

export default GSTReturn;
