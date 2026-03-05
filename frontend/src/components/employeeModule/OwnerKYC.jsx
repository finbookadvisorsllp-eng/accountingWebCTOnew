import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Download } from 'lucide-react';

const OwnerKYC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/history`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Owner KYC</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6">
        
        {/* PAN Section */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
           <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Owner PAN</h3>
              <div className="flex items-center space-x-2">
                 <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Eye size={18} /></button>
                 <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Download size={18} /></button>
              </div>
           </div>
           <div className="p-5 space-y-3">
              <DetailRow label="PAN Number" value="ZYXWV9876E" />
              <DetailRow label="Name on PAN" value="Daniel Smith" />
              <DetailRow label="Date of Birth" value="05-May-1988" />
           </div>
        </div>

        {/* Aadhar Details */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
           <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Aadhar Details</h3>
              <div className="flex items-center space-x-2">
                 <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Eye size={18} /></button>
                 <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Download size={18} /></button>
              </div>
           </div>
           <div className="p-5 space-y-3">
              <DetailRow label="Aadhar Number" value="1234 5678 9012" />
              <DetailRow label="Linked Mobile" value="+91 9876543210" />
              <DetailRow label="Address" value="123, Main Street, City" />
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

export default OwnerKYC;
