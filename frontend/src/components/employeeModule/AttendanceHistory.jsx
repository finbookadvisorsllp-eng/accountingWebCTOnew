import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { attendanceAPI } from '../../services/api';

const AttendanceHistory = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [currentDate]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const [histRes, summaryRes] = await Promise.all([
        attendanceAPI.officeHistory({ month, year }),
        attendanceAPI.getSummary({ month, year })
      ]);
      
      const rawHistory = histRes?.data?.data || [];
      
      // Process history to include 'Absent' days for elapsed days in current month
      // or for all days in past months
      const processedHistory = generateFullHistory(rawHistory, month, year);
      
      setHistory(processedHistory);
      setSummary(summaryRes?.data?.data || null);
    } catch (err) {
      console.error('Failed to fetch attendance history', err);
    } finally {
      setLoading(false);
    }
  };

  const generateFullHistory = (rawHistory, month, year) => {
    const now = new Date();
    const isCurrentMonth = now.getMonth() + 1 === month && now.getFullYear() === year;
    const lastDay = isCurrentMonth ? now.getDate() : new Date(year, month, 0).getDate();
    
    const full = [];
    for (let day = lastDay; day >= 1; day--) {
      const dateStr = new Date(year, month - 1, day).toISOString().split('T')[0];
      const record = rawHistory.find(r => r.date.startsWith(dateStr));
      const dayOfWeek = new Date(year, month - 1, day).getDay();
      
      if (record) {
        full.push(record);
      } else if (dayOfWeek !== 0) { // Not Sunday
        // Check if it's not today or if it is today and late in the evening (optional logic)
        // For simplicity, if no record and not Sunday, mark as Absent
        full.push({
          _id: `absent-${day}`,
          date: new Date(year, month - 1, day),
          status: 'absent',
          absent: true
        });
      }
    }
    return full;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateLabel = (dateUTC) => {
    const d = new Date(dateUTC);
    return {
      dayNum: d.getDate().toString().padStart(2, '0'),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    };
  };

  // Calendar Logic
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const days = daysInMonth(month, year);
    const startDay = startDayOfMonth(month, year);
    
    const pads = [];
    const prevDays = daysInMonth(month - 1, year);
    for (let i = startDay - 1; i >= 0; i--) {
      pads.push(<div key={`pad-${i}`} className="text-slate-200 py-2">{prevDays - i}</div>);
    }

    const dayCells = [];
    for (let day = 1; day <= days; day++) {
      const cellDate = new Date(year, month, day);
      const isToday = new Date().toDateString() === cellDate.toDateString();
      const attRecord = history.find(r => new Date(r.date).getDate() === day && !r.absent);
      const isAbsent = history.find(r => new Date(r.date).getDate() === day && r.status === 'absent');
      const isSunday = cellDate.getDay() === 0;
      
      let bgColor = '';
      let textColor = 'text-slate-700';
      let ring = '';

      if (attRecord) {
        if (attRecord.status === 'late') bgColor = 'bg-amber-500 text-white shadow-sm';
        else if (attRecord.status === 'auto-closed') bgColor = 'bg-indigo-500 text-white shadow-sm';
        else bgColor = 'bg-[#3A565A] text-white shadow-sm';
        textColor = 'text-white';
      } else if (isAbsent) {
        bgColor = 'bg-red-100 text-red-500';
      } else if (isToday) {
        ring = 'ring-2 ring-[#3A565A] ring-offset-2';
      } else if (isSunday) {
        textColor = 'text-red-300';
      }

      dayCells.push(
        <div key={day} className="relative flex items-center justify-center py-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${bgColor} ${textColor} ${ring}`}>
            {day}
          </div>
        </div>
      );
    }

    return [...pads, ...dayCells];
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'checked-out': return <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-100">Present</span>;
      case 'late': return <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ring-1 ring-amber-100">Late</span>;
      case 'auto-closed': return <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ring-1 ring-indigo-100">Auto Close</span>;
      case 'absent': return <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ring-1 ring-red-100">Absent</span>;
      default: return <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ring-1 ring-slate-100">{status}</span>;
    }
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full pb-6">
      <div className="p-3 md:p-6 w-full max-w-xl mx-auto pt-4 md:pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        <div className="bg-white rounded-[20px] p-4 md:p-6 shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-slate-800">Attendance History</h2>
             <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#3A565A]"></div>
                   <span className="text-[9px] font-bold text-slate-400">P</span>
                </div>
                <div className="flex items-center space-x-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                   <span className="text-[9px] font-bold text-slate-400">L</span>
                </div>
                <div className="flex items-center space-x-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                   <span className="text-[9px] font-bold text-slate-400">A</span>
                </div>
             </div>
           </div>

           {/* Interactive Calendar Section */}
           <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-black text-[#3A565A] text-base uppercase tracking-tighter">{monthName} {currentDate.getFullYear()}</h3>
                 <div className="flex space-x-1.5">
                    <button onClick={prevMonth} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                      <ChevronLeft size={14} className="text-[#3A565A]" />
                    </button>
                    <button onClick={nextMonth} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                      <ChevronRight size={14} className="text-[#3A565A]" />
                    </button>
                 </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-black">
                 {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                   <div key={d} className="text-slate-400 py-1.5">{d}</div>
                 ))}
                 {loading ? (
                   <div className="col-span-7 flex justify-center py-8"><Loader2 size={20} className="animate-spin text-slate-300" /></div>
                 ) : renderCalendar()}
              </div>
           </div>

           {/* Divider & Summary */}
           {summary && (
             <div className="grid grid-cols-4 gap-2 mb-6 bg-[#3A565A] rounded-xl p-4 text-white shadow-lg">
               <div className="text-center">
                 <p className="text-xl font-black mb-0.5">{summary.daysPresent}</p>
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Present</p>
               </div>
               <div className="text-center border-l border-white/10">
                 <p className="text-xl font-black mb-0.5">{summary.daysLate || 0}</p>
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Late</p>
               </div>
               <div className="text-center border-l border-white/10">
                 <p className="text-xl font-black mb-0.5">{summary.daysMissed}</p>
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Absent</p>
               </div>
               <div className="text-center border-l border-white/10">
                 <p className="text-xl font-black mb-0.5">{summary.totalHours}h</p>
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Worked</p>
               </div>
             </div>
           )}

           {/* List of Attendances */}
           <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="text-[#3A565A] animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-sm">
                  No attendance records for this month
                </div>
              ) : (
                history.map((record, idx) => {
                  const { dayNum, dayName } = formatDateLabel(record.date);
                  const isAbsent = record.status === 'absent';
                  
                  return (
                    <div key={record._id} className={`flex items-center justify-between border ${isAbsent ? 'border-red-100 bg-red-50/30' : 'border-slate-100 bg-white'} rounded-xl p-2.5 shadow-sm hover:shadow-md transition-all`}>
                       <div className={`w-12 items-center justify-center flex flex-col rounded-lg py-1.5 ${isAbsent ? 'bg-red-400' : 'bg-[#3A565A]'} text-white shadow-sm ring-2 ring-offset-0 ${isAbsent ? 'ring-red-50' : 'ring-slate-50'}`}>
                          <span className="font-black text-base leading-none">{dayNum}</span>
                          <span className="text-[8px] font-black tracking-widest opacity-80">{dayName}</span>
                       </div>
                       
                       <div className="flex-1 flex flex-col px-3">
                          <div className="flex items-center justify-between">
                             {isAbsent ? (
                               <div className="flex items-center space-x-1.5 text-red-500">
                                 <XCircle size={12} />
                                 <span className="text-xs font-bold">Absent Day</span>
                               </div>
                             ) : (
                               <div className="flex items-center space-x-3">
                                  <div>
                                     <p className="font-black text-slate-800 text-xs tracking-tighter leading-tight">{formatTime(record.checkIn)}</p>
                                     <p className="text-[8px] text-slate-400 font-bold uppercase">IN</p>
                                  </div>
                                  <div className="w-px h-5 bg-slate-100" />
                                  <div>
                                     <p className="font-black text-slate-800 text-xs tracking-tighter leading-tight">{formatTime(record.checkOut)}</p>
                                     <p className="text-[8px] text-slate-400 font-bold uppercase">OUT</p>
                                  </div>
                               </div>
                             )}
                             {getStatusBadge(record.status)}
                          </div>
                       </div>

                       {!isAbsent && (
                         <div className="text-center pr-1 border-l border-slate-100 pl-3 w-16">
                            <p className="font-black text-[#3A565A] text-xs leading-none">
                               {record.totalMinutes ? `${Math.floor(record.totalMinutes / 60)}h` : '--'}
                            </p>
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter mt-0.5">Total</p>
                         </div>
                       )}
                    </div> 
                  );
                })
              )}
           </div>
           
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
