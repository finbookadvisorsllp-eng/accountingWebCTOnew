import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const managementOptions = [
  { id: 'master', title: 'Client master', desc: 'Manage client profiles easily.', color: 'bg-green-500' },
  { id: 'checkin', title: 'Check-in & Check-out', desc: 'Track client visits efficiently.', color: 'bg-slate-400' },
  { id: 'history', title: 'Client Historical Data', desc: 'Monitor transactions & records.', color: 'bg-red-700' },
  { id: 'financial', title: 'Financial Data', desc: 'Manage and track finances securely.', color: 'bg-slate-600' },
  { id: 'dashboard', title: 'Client Financial Dashboard', desc: 'Overview of client transactions and balances.', color: 'bg-green-600' },
  { id: 'reports', title: 'Client Financial Reports', desc: 'Overview of client Financial reports.', color: 'bg-green-500' },
  { id: 'queries', title: 'Client Queries', desc: 'Track and resolve client inquiries efficiently.', color: 'bg-red-800' },
  { id: 'documents', title: 'Documents and Files', desc: 'Securely store and access important records.', color: 'bg-slate-700' },
];

const ClientManagement = ({ client, onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full pb-8">

      {/* Main Content Area */}
      <div className="p-4 md:p-8 lg:p-10 w-full max-w-4xl mx-auto space-y-6 lg:space-y-8">
        
        {/* Profile Card */}
        <div className="bg-[#6DA4A4] rounded-2xl p-6 shadow-md flex items-center space-x-5 text-white">
          <img 
            src={client?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop'} 
            alt={client?.name || 'Client Name'} 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/50 shadow-sm"
          />
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold">{client?.name || 'Daniel Smith'}</h2>
            <p className="text-white/80 text-sm md:text-base">{(client?.name || 'Daniel12').replace(' ', '').toLowerCase()}@gmail.com</p>
          </div>
        </div>

        {/* Management List Section */}
        <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 text-xl md:text-2xl mb-1">Client Management</h3>
            <p className="text-slate-500 text-sm md:text-base">Organize, track, and manage all client interactions in one place.</p>
          </div>

          <div className="space-y-4">
            {managementOptions.map((option, index) => (
              <div 
                key={option.id}
                onClick={() => {
                  if (option.id === 'master') {
                     navigate(`/employee/clients/${client?.id || '1'}/master`);
                  } else if (option.id === 'checkin') {
                     navigate(`/employee/clients/${client?.id || '1'}/checkin`);
                  } else if (option.id === 'history') {
                     navigate(`/employee/clients/${client?.id || '1'}/history`);
                  } else if (option.id === 'financial') {
                     navigate(`/employee/clients/${client?.id || '1'}/financial`);
                  } else if (option.id === 'dashboard') {
                     navigate(`/employee/clients/${client?.id || '1'}/dashboard`);
                  } else if (option.id === 'documents') {
                     navigate(`/employee/clients/${client?.id || '1'}/documents`);
                  } else if (option.id === 'reports') {
                     navigate(`/employee/clients/${client?.id || '1'}/reports`);
                  } else if (option.id === 'queries') {
                     navigate(`/employee/clients/${client?.id || '1'}/queries`);
                  }
                }}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-[#3A565A]/30 transition-all flex items-center justify-between cursor-pointer group relative overflow-hidden"
              >
                {/* Colored Left Border indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${option.color}`} />
                
                <div className="pl-4 flex flex-col space-y-1">
                  <h4 className="font-semibold text-slate-800 text-lg group-hover:text-[#3A565A] transition-colors">{option.title}</h4>
                  <p className="text-slate-500 text-sm">{option.desc}</p>
                </div>
                
                <ChevronRight className="text-slate-400 group-hover:text-[#3A565A] group-hover:translate-x-1 transition-all w-6 h-6" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientManagement;
