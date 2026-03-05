import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Download } from 'lucide-react';

const CompanyKYC = () => {
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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Company KYC</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6">
        
        {/* PAN Section */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
           <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">PAN</h3>
              <div className="flex items-center space-x-2">
                 <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Eye size={18} /></button>
                 <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Download size={18} /></button>
              </div>
           </div>
           <div className="p-5 space-y-3">
              <DetailRow label="PAN Number" value="ABCDE1234F" />
              <DetailRow label="Date of Issue" value="10-Apr-2015" />
              <DetailRow label="Validity" value="Permanent Validity" />
           </div>
        </div>

        {/* GST Registration Details */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
           <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">GST Registration Details</h3>
              <div className="flex items-center space-x-2">
                 <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Eye size={18} /></button>
                 <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Download size={18} /></button>
              </div>
           </div>
           <div className="p-5 space-y-3">
              <DetailRow label="GST Number" value="27ABCDE1234F1Z5" />
              <DetailRow label="Registered On" value="15-Jul-2017" />
              <DetailRow label="Status" value="Active" />
              <DetailRow label="Type" value="Regular Taxpayer" />
           </div>
        </div>
        
        {/* Gumasta License Details */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
           <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Gumasta License Details</h3>
              <div className="flex items-center space-x-2">
                 <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Eye size={18} /></button>
                 <button className="p-1.5 bg-slate-100 text-slate-600 rounded cursor-pointer hover:bg-slate-200"><Download size={18} /></button>
              </div>
           </div>
           <div className="p-5 space-y-3">
              <DetailRow label="License Number" value="GUM123456789" />
              <DetailRow label="Registered On" value="15-Jul-2017" />
              <DetailRow label="Expiry Date" value="20-Sep-2026" />
              <DetailRow label="Business Type" value="Retail / Wholesale" />
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

export default CompanyKYC;
