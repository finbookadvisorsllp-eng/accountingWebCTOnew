import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Loader2, Mail, User, Building2, Phone } from 'lucide-react';
import { clientAPI } from '../../services/api';

const managementOptions = [
  { id: 'master', title: 'Client master', desc: 'Manage client profiles easily.', color: 'bg-green-500' },
  { id: 'checkin', title: 'Check-in & Check-out', desc: 'Track client visits efficiently.', color: 'bg-slate-400' },
  { id: 'history', title: 'Client Historical Data', desc: 'Monitor transactions & records.', color: 'bg-red-700' },
  { id: 'financial', title: 'Financial Data', desc: 'Manage and track finances securely.', color: 'bg-slate-600' },

  { id: 'reports', title: 'Client Financial Reports', desc: 'Overview of client Financial reports.', color: 'bg-green-500' },
  { id: 'queries', title: 'Client Queries', desc: 'Track and resolve client inquiries efficiently.', color: 'bg-red-800' },
  { id: 'documents', title: 'Documents and Files', desc: 'Securely store and access important records.', color: 'bg-slate-700' },
];

const ClientManagement = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  async function fetchClient() {
    try {
      setLoading(true);
      const res = await clientAPI.getClient(clientId);
      setClient(res?.data || null);
    } catch (err) {
      console.error('Failed to fetch client', err);
    } finally {
      setLoading(false);
    }
  }

  // Generate initials from entity name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full pb-8">

      {/* Main Content Area */}
      <div className="p-4 md:p-8 lg:p-10 w-full max-w-4xl mx-auto space-y-6 lg:space-y-8">
        
        {/* Profile Card — Dynamic */}
        {loading ? (
          <div className="bg-[#6DA4A4] rounded-2xl p-8 shadow-md flex items-center justify-center">
            <Loader2 size={32} className="text-white animate-spin" />
          </div>
        ) : (
          <div className="bg-[#6DA4A4] rounded-2xl p-6 shadow-md flex items-center space-x-5 text-white">
            {/* Avatar / Initials */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-sm shrink-0">
              {client ? getInitials(client.contactName) : <User size={32} />}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-xl md:text-2xl font-bold truncate">
                {client?.contactName || 'Unknown Client'}
              </h2>

             {client?.entityName && (
                <div className="flex items-center space-x-2 mt-1">
                  <Building2 size={14} className="text-white/70 shrink-0" />
                  <p className="text-white/80 text-sm truncate">{client.entityName}</p>
                </div>
              )}

              {client?.contactEmail && (
                <div className="flex items-center space-x-2 mt-1">
                  <Mail size={14} className="text-white/70 shrink-0" />
                  <p className="text-white/80 text-xs mt-0.5">{client.contactEmail}</p>
                </div>
              )}
              {client?.contactPhone && (

                <div className="flex items-center space-x-2 mt-1">
                  <Phone size={14} className="text-white/70 shrink-0" />
                  <p className="text-white/80 text-xs mt-0.5">{client.contactPhone}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Management List Section — Static */}
        <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 text-xl md:text-2xl mb-1">Client Management</h3>
            <p className="text-slate-500 text-sm md:text-base">Organize, track, and manage all client interactions in one place.</p>
          </div>

          <div className="space-y-4">
            {managementOptions.map((option) => (
              <div 
                key={option.id}
                onClick={() => navigate(`/employee/clients/${clientId}/${option.id}`)}
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
