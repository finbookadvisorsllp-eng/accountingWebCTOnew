import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, LogIn, LogOut } from 'lucide-react';
import { attendanceAPI } from '../../services/api';

const CheckInCheckOut = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams();
  const [history, setHistory] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [histRes, todayRes] = await Promise.all([
        attendanceAPI.clientHistory(clientId),
        attendanceAPI.officeToday(), // We also want to check if they are checked in for this client specifically
      ]);
      
      // Filter today's record for this client if it exists (the backend endpoint officeToday is generic, 
      // but clientHistory will contain it if it happened today)
      setHistory(histRes?.data?.data || []);
      
      const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
      const todayRec = (histRes?.data?.data || []).find(r => {
        const rDate = new Date(r.date).toLocaleDateString('en-CA');
        return rDate === todayStr && (r.status === 'checked-in' || r.status === 'late');
      });
      setTodayRecord(todayRec || null);
    } catch (err) {
      console.error('Failed to fetch client attendance data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (type) => {
    try {
      setActionLoading(true);
      let loc = {};
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) {}

      if (type === 'in') {
        await attendanceAPI.clientCheckIn(clientId, loc);
      } else {
        await attendanceAPI.clientCheckOut(clientId, loc);
      }
      await fetchData();
    } catch (err) {
      console.error(`Client ${type} failed`, err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate().toString().padStart(2, '0'),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    };
  };

  const getColor = (index) => {
    const colors = ['bg-[#76B055]', 'bg-[#71203A]', 'bg-[#DE7F5A]', 'bg-[#215E4C]', 'bg-[#E56A00]', 'bg-[#3A565A]'];
    return colors[index % colors.length];
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Check-in & Check-out</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6">
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="text-[#3A565A] animate-spin" />
          </div>
        ) : (
          <>
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <button 
                  onClick={() => handleAction('in')}
                  disabled={actionLoading || !!todayRecord}
                  className="bg-[#3A565A] text-white rounded-xl py-4 font-bold text-lg shadow-md hover:bg-[#2a3e41] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
               >
                  {actionLoading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
                  <span>Check-in</span>
               </button>
               <button 
                  onClick={() => handleAction('out')}
                  disabled={actionLoading || !todayRecord}
                  className="bg-white text-slate-800 border-2 border-slate-200 rounded-xl py-4 font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
               >
                  {actionLoading ? <Loader2 size={20} className="text-slate-400 animate-spin" /> : <LogOut size={20} className="text-slate-600" />}
                  <span>Check-out</span>
               </button>
            </div>

            {/* Past History Header */}
            <div>
               <h2 className="text-lg font-bold text-slate-800 mb-4">Past History</h2>
               
               {/* History List */}
               <div className="space-y-4">
                  {history.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                      No visit history found
                    </div>
                  ) : history.map((item, idx) => {
                    const { day, weekday } = formatDate(item.date);
                    return (
                      <div key={item._id} className="bg-white rounded-[20px] p-2 md:p-3 shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                         
                         {/* Date Block */}
                         <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex flex-col items-center justify-center text-white ${getColor(idx)}`}>
                            <span className="text-xl md:text-2xl font-bold leading-none">{day}</span>
                            <span className="text-[10px] md:text-xs font-semibold tracking-wider mt-0.5">{weekday}</span>
                         </div>

                         {/* Check In */}
                         <div className="flex flex-col flex-1 pl-4 md:pl-6">
                            <span className="font-bold text-slate-800 text-sm md:text-base">{formatTime(item.checkIn)}</span>
                            <span className="text-xs text-slate-500 font-medium">Check In</span>
                         </div>

                         {/* Check Out */}
                         <div className="flex flex-col flex-1">
                            <span className="font-bold text-slate-800 text-sm md:text-base">{formatTime(item.checkOut)}</span>
                            <span className="text-xs text-slate-500 font-medium">Check Out</span>
                         </div>

                         {/* Total Hours */}
                         <div className="flex flex-col flex-1 text-right pr-2 md:pr-4">
                            <span className="font-bold text-slate-800 text-sm md:text-base">
                              {item.totalMinutes ? `${Math.floor(item.totalMinutes / 60)}h ${item.totalMinutes % 60}m` : '--'}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Total</span>
                         </div>

                      </div>
                    );
                  })}
               </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CheckInCheckOut;
