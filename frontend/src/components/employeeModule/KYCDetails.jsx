import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const KYCDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <ArrowLeft 
            size={28} 
            className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
            onClick={() => navigate(`/employee/clients/${clientId}/master`)}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">KYC Details</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6">
        
        {/* PAN Card Section */}
        <div>
           <h3 className="font-semibold text-slate-800 text-lg mb-3">PAN Card</h3>
           {/* We use a solid gradient/placeholder that mimics a PAN card design to avoid literal images as requested */}
           <div className="w-full h-48 md:h-56 rounded-xl bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 border border-blue-200 shadow-sm relative overflow-hidden flex flex-col p-4">
              <div className="flex justify-between w-full border-b border-blue-400 pb-2 mb-2">
                 <div className="text-[10px] md:text-xs font-bold text-slate-700">INCOME TAX DEPARTMENT</div>
                 <div className="text-[10px] md:text-xs font-bold text-slate-700">GOVT. OF INDIA</div>
              </div>
              <div className="flex space-x-4 mt-2">
                 <div className="w-20 h-24 bg-slate-200 border border-slate-300 rounded flex items-center justify-center text-xs text-slate-400">Photo</div>
                 <div className="flex flex-col space-y-2">
                    <div>
                       <div className="text-[10px] text-slate-600">Name</div>
                       <div className="font-bold text-slate-800 text-sm">ANKIT RAJPUT</div>
                    </div>
                    <div>
                       <div className="text-[10px] text-slate-600">Father's Name</div>
                       <div className="font-bold text-slate-800 text-sm">ABC RAJPUT</div>
                    </div>
                    <div>
                       <div className="text-[10px] text-slate-600">Permanent Account Number</div>
                       <div className="font-bold text-slate-800 text-lg tracking-wider">ABCDE1234F</div>
                    </div>
                 </div>
              </div>
              <div className="absolute right-4 bottom-4 w-16 h-16 bg-white border border-slate-300 p-1">
                 {/* Mock QR Code */}
                 <div className="w-full h-full bg-[repeating-conic-gradient(#cbd5e1_0%_25%,#f8fafc_0%_50%)] bg-[length:4px_4px]"></div>
              </div>
           </div>
        </div>

        {/* Other details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
           <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-slate-800 flex items-center space-x-2">
              <FileIcon /> <span>Other details</span>
           </div>
           
           <div className="p-4 space-y-4">
              
              <DetailRow label="Name" value="Ankit rajput D/O Virendra rajput" />
              <div className="border-b border-slate-100"></div>
              
              <DetailRow label="Tax Deduction and Collection Account Number" value="ABCD12345K" />
              <div className="border-b border-slate-100"></div>
              
              <DetailRow label="GST Number" value="22AAAAA0000A1Z5" />
              <div className="border-b border-slate-100"></div>
              
              <DetailRow label="Contact Number" value="+9145879875078" />
              <div className="border-b border-slate-100"></div>
              
              <DetailRow label="Address" value="Pune, Maharashtra" />
           </div>
        </div>

      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
     <span className="text-xs text-slate-500 font-medium">{label}</span>
     <span className="text-sm text-slate-800 font-semibold">{value}</span>
  </div>
);

const FileIcon = () => (
   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3A565A]">
     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
     <polyline points="14 2 14 8 20 8"></polyline>
     <line x1="16" y1="13" x2="8" y2="13"></line>
     <line x1="16" y1="17" x2="8" y2="17"></line>
     <polyline points="10 9 9 9 8 9"></polyline>
   </svg>
)

export default KYCDetails;
