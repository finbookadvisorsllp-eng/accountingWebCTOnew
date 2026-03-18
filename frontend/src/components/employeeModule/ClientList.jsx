import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, Shield, Loader2, Users, Calendar, Clock, Star } from 'lucide-react';
import { clientAPI } from '../../services/api';

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyClients();
  }, []);

  async function fetchMyClients() {
    try {
      setLoading(true);
      const res = await clientAPI.getMyClients();
      const rawClients = (res?.data?.data || []).filter(c => !c.groupCompany);
      
      // Sort: Today's visits first
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue", etc.
      
      const sorted = [...rawClients].sort((a, b) => {
        const aToday = a.visitDays?.includes(today);
        const bToday = b.visitDays?.includes(today);
        if (aToday && !bToday) return -1;
        if (!aToday && bToday) return 1;
        return 0;
      });

      setClients(sorted);
    } catch (err) {
      console.error('Failed to fetch clients', err);
      setError('Unable to load your clients. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <ArrowLeft
            size={28}
            className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full"
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">My Clients</h1>
            {!loading && (
              <p className="text-slate-500 text-sm mt-0.5">
                {clients.length} client{clients.length !== 1 ? 's' : ''} assigned
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 lg:p-10 w-full max-w-4xl mx-auto space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 size={40} className="text-[#3A565A] animate-spin" />
            <p className="text-slate-500 font-medium">Loading your clients...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <Shield size={28} className="text-red-400" />
            </div>
            <p className="text-slate-600 font-medium">{error}</p>
            <button onClick={fetchMyClients} className="px-5 py-2 bg-[#3A565A] text-white rounded-xl text-sm font-medium hover:bg-[#2a3e41] transition-colors">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && clients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
              <Users size={32} className="text-slate-300" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-700">No clients assigned</h3>
              <p className="text-slate-400 text-sm mt-1">You haven't been assigned any clients yet.</p>
            </div>
          </div>
        )}

        {!loading && !error && clients.map((client) => {
          const isTodayVisit = client.visitDays?.includes(todayStr);
          return (
            <div
              key={client._id}
              onClick={() => navigate(`/employee/clients/${client._id}`)}
              className={`bg-white rounded-[20px] p-5 shadow-sm border ${isTodayVisit ? 'border-[#3A565A] ring-1 ring-[#3A565A]/10' : 'border-slate-200'} hover:shadow-md hover:border-[#3A565A]/40 transition-all flex items-center justify-between cursor-pointer group relative overflow-hidden`}
            >
              {isTodayVisit && (
                <div className="absolute top-0 right-0">
                  <div className="bg-[#3A565A] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center space-x-1">
                    <Star size={10} className="fill-white" />
                    <span>TODAY'S VISIT</span>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 md:space-x-5 flex-1 min-w-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#3A565A] to-[#6DA4A4] flex items-center justify-center text-white text-xl md:text-2xl font-bold shrink-0 shadow-sm">
                  {getInitials(client.contactName)}
                </div>

                <div className="flex flex-col space-y-1.5 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-lg md:text-xl group-hover:text-[#3A565A] transition-colors truncate">
                    {client.contactName}
                  </h3>

                  {client.entityName && (
                    <div className="flex items-center space-x-2 text-slate-500 text-sm">
                      <Building2 size={14} className="text-[#6DA4A4] shrink-0" />
                      <span className="truncate">{client.entityName}</span>
                    </div>
                  )}

                  {client.contactPhone && (
                    <div className="flex items-center space-x-2 text-slate-500 text-sm">
                      <Phone size={14} className="text-[#6DA4A4] shrink-0" />
                      <span>{client.contactPhone}</span>
                    </div>
                  )}

                  {client.visitDays?.length > 0 && (
                    <div className="flex items-center space-x-2 text-slate-600 text-sm">
                      <Calendar size={14} className="text-[#6DA4A4] shrink-0" />
                      <span className={isTodayVisit ? "font-bold text-[#3A565A]" : ""}>{client.visitDays.join(', ')}</span>
                    </div>
                  )}

                  {(client.visitTimeFrom || client.visitTimeTo) && (
                    <div className="flex items-center space-x-2 text-slate-600 text-sm">
                      <Clock size={14} className="text-[#6DA4A4] shrink-0" />
                      <span className={isTodayVisit ? "font-bold text-[#3A565A]" : ""}>{client.visitTimeFrom || ''} - {client.visitTimeTo || ''}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#3A565A] flex items-center justify-center text-white shadow-md group-hover:bg-[#2a3e41] group-hover:scale-105 transition-all shrink-0 ml-3">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientList;
