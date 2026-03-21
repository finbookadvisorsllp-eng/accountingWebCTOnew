import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ChevronRight, LogIn, LogOut, Loader2, AlertCircle, CheckCircle2, Star, Building2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { attendanceAPI, clientAPI, candidateAPI, rescheduleAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import TeamHierarchySection from './TeamHierarchySection';



const taskData = [
  { name: 'Completed', value: 92, color: '#4ADE80' },
  { name: 'Pending', value: 5, color: '#F87171' },
  { name: 'Review', value: 3, color: '#60A5FA' },
];

const barData = [
  { name: 'M', completed: 60, pending: 20 },
  { name: 'T', completed: 80, pending: 10 },
  { name: 'W', completed: 40, pending: 30 },
  { name: 'T', completed: 70, pending: 20 },
  { name: 'F', completed: 50, pending: 10 },
  { name: 'S', completed: 30, pending: 10 },
  { name: 'S', completed: 20, pending: 5 },
];

const DashboardMetrics = () => {
  const { user } = useAuthStore();
  const [todayRecord, setTodayRecord] = useState(null);
  const [summary, setSummary] = useState(null);
  const [nextClient, setNextClient] = useState(null);
  const [attLoading, setAttLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [elapsed, setElapsed] = useState('00:00:00');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [forgotCheckout, setForgotCheckout] = useState(false);
  const [profile, setProfile] = useState(null);
  const [pendingRescheduleCount, setPendingRescheduleCount] = useState(0);
  const timerRef = useRef(null);


  useEffect(() => {
    fetchDashboardData();
    return () => clearInterval(timerRef.current);
  }, []);

  // Start running timer when checked in
  useEffect(() => {
    clearInterval(timerRef.current);
    if (todayRecord && (todayRecord.status === 'checked-in' || todayRecord.status === 'late')) {
      const update = () => {
        const diff = Date.now() - new Date(todayRecord.checkIn).getTime();
        setElapsedMs(diff);
        const hrs = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setElapsed(
          `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
      };
      update();
      timerRef.current = setInterval(update, 1000);
    } else {
      setElapsed('00:00:00');
      setElapsedMs(0);
    }
  }, [todayRecord]);

  async function fetchDashboardData() {
    try {
      setAttLoading(true);
      const [todayRes, summaryRes, clientRes, profileRes] = await Promise.all([
        attendanceAPI.officeToday(),
        attendanceAPI.getSummary(),
        clientAPI.getMyClients(),
        user?._id ? candidateAPI.getCandidate(user._id) : Promise.resolve(null),
      ]);
      
      setTodayRecord(todayRes?.data?.data || null);
      setForgotCheckout(todayRes?.data?.forgotCheckout || false);
      setSummary(summaryRes?.data?.data || null);
      if (profileRes?.data?.data) {
        setProfile(profileRes.data.data);
      }

      
      // Find earliest client visit for today
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const myClients = (clientRes?.data?.data || []).filter(c => !c.groupCompany);
      const todayClients = myClients.filter(c => c.visitDays?.includes(today));
      
      // Simulating "next" by picking the first one available
      setNextClient(todayClients[0] || myClients[0] || null);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setAttLoading(false);
    }

    // Fetch pending reschedule count for seniors
    if (user?.designation === 'Manager' || user?.designation === 'Senior Accountant') {
      try {
        const rescRes = await rescheduleAPI.getPending();
        setPendingRescheduleCount(rescRes?.data?.data?.length || 0);
      } catch (e) {}
    }
  }

  async function handleCheckIn() {
    try {
      setActionLoading(true);
      let loc = {};
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) {}

      const res = await attendanceAPI.officeCheckIn(loc);
      setTodayRecord(res?.data?.data || null);
      fetchDashboardData();
    } catch (err) {
      console.error('Check-in failed', err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckOut() {
    // 1. Mistake Prevention: Minimum time check (e.g., 5 minutes = 300,000 ms)
    const minTimeMs = 5 * 60 * 1000;
    if (elapsedMs < minTimeMs) {
      alert(`Minimum check-in time of 5 minutes required. Please wait ${Math.ceil((minTimeMs - elapsedMs) / 60000)} more minutes.`);
      return;
    }

    // 2. Confirmation
    if (!window.confirm("Are you sure you want to check out?")) {
      return;
    }

    try {
      setActionLoading(true);
      let loc = {};
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) {}

      const res = await attendanceAPI.officeCheckOut(loc);
      setTodayRecord(res?.data?.data || null);
      clearInterval(timerRef.current);
      fetchDashboardData();
    } catch (err) {
      console.error('Check-out failed', err);
    } finally {
      setActionLoading(false);
    }
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTo12Hr = (timeStr) => {
    if (!timeStr) return '--:--';
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    const [hrs, mins] = parts;
    const h = parseInt(hrs);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr12 = h % 12 || 12;
    return `${hr12}:${mins} ${ampm}`;
  };

  const isWorking = todayRecord?.status === 'checked-in' || todayRecord?.status === 'late';
  const todayDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full pb-6">
      {/* Main Content Area */}
      <div className="p-3 md:p-5 lg:p-6 w-full max-w-7xl mx-auto space-y-4 lg:space-y-6">
        
        {/* Notification Area */}
        {forgotCheckout && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center space-x-3 text-amber-800 animate-in fade-in slide-in-from-top-2 duration-500">
            <AlertCircle className="shrink-0" size={20} />
            <div>
              <p className="font-bold text-sm">You forgot to check out yesterday.</p>
              <p className="text-xs">The system auto-closed your attendance session.</p>
            </div>
          </div>
        )}
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#3A565A] to-[#6DA4A4] rounded-[20px] p-5 text-white shadow-md flex justify-between items-center animate-in fade-in slide-in-from-top-3 duration-500">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Welcome back, {profile?.personalInfo?.firstName || "Accountant"}! 👋</h1>
            <p className="text-xs md:text-sm mt-1 text-white/80">Manage your clients and attendance here.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Reporting To</p>
            <p className="text-sm font-bold mt-0.5">{profile?.adminInfo?.reportingAuthorityName || "Admin"}</p>
          </div>
        </div>

        {/* Top Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          {/* User Profile column — Focused Client Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 flex flex-col h-full"> 
               <div className="flex items-center justify-between mb-4">
                 <div className="bg-[#3A565A]/10 text-[#3A565A] px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase">Next Visit Priority</div>
                 {nextClient?.visitDays?.includes(new Date().toLocaleDateString('en-US', { weekday: 'short' })) && (
                   <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold ring-1 ring-emerald-100">
                     <Star size={10} className="fill-emerald-600" />
                     <span>TODAY'S VISIT</span>
                   </div>
                 )}
               </div>

               <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3A565A] to-[#6DA4A4] flex items-center justify-center text-white text-xl font-bold shadow-sm ring-4 ring-slate-50">
                    {nextClient?.contactName ? nextClient.contactName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{nextClient?.contactName || 'No Assigned Client'}</h3>
                    <div className="flex items-center space-x-1.5 text-slate-500 mt-0.5">
                      <Building2 size={14} className="text-[#6DA4A4]" />
                      <p className="font-medium text-xs truncate">{nextClient?.entityName || 'General Client'}</p>
                    </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-slate-100">
                   <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col">
                      <div className="flex items-center space-x-1.5 text-[#3A565A] mb-0.5">
                        <Calendar size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Scheduled Day</span>
                      </div>
                      <span className="font-bold text-slate-700 text-xs ml-4">
                        {nextClient?.visitDays?.includes(today) ? today : (nextClient?.visitDays?.join(', ') || 'None')}
                      </span>
                   </div>
                   <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col">
                      <div className="flex items-center space-x-1.5 text-[#3A565A] mb-0.5">
                        <Clock size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Visit Time</span>
                      </div>
                      <span className="font-bold text-slate-700 text-xs">
                        {nextClient?.visitTimeFrom 
                          ? `${formatTo12Hr(nextClient.visitTimeFrom)} - ${formatTo12Hr(nextClient.visitTimeTo)}` 
                          : '--:--'}
                      </span>
                   </div>
               </div>

               <Link 
                 to={nextClient ? `/employee/clients/${nextClient._id}` : '/employee/clients'} 
                 className="mt-4 w-full py-3 bg-[#3A565A] text-white rounded-lg font-bold text-sm flex items-center justify-center space-x-2 hover:bg-[#2a3e41] transition-all shadow-md group"
               >
                 <span>Start Visit Management</span>
                 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
             
            </div>
              {/* i want to make a button to view all clients */}
               <Link 
                 to="/employee/clients" 
                 className="mt-4 w-full py-3 bg-white text-black rounded-lg font-bold text-sm flex justify-between hover:text-blue-500 transition-all shadow-md group"
               >
                 <span className="ml-4">View All Clients</span>
                 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform mr-4" />
               </Link>
          </div>

          {/* ═══ OFFICE ATTENDANCE CARD (DYNAMIC) ═══ */}
          <div className="lg:col-span-7 bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden relative min-h-[220px]">
            {attLoading ? (
              <div className="flex items-center justify-center h-full py-10">
                <Loader2 size={24} className="text-[#3A565A] animate-spin" />
              </div>
            ) : (
              <>
                {/* Date & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">{todayDateStr}</p>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">Office Attendance</h3>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {todayRecord?.status === 'late' && (
                      <div className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-black ring-1 ring-red-100 animate-pulse">LATE TODAY</div>
                    )}
                    {todayRecord?.status === 'checked-out' && (
                      <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black ring-1 ring-emerald-100">COMPLETED</div>
                    )}
                  </div>
                </div>

                {/* Check-In / Running Timer / Check-Out */}
                {!todayRecord ? (
                  <button
                    onClick={handleCheckIn}
                    disabled={actionLoading}
                    className="w-full h-24 bg-[#3A565A] text-white rounded-xl p-4 shadow-lg hover:bg-[#2a3e41] transition-all flex flex-col items-center justify-center group disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                          <LogIn size={20} />
                        </div>
                        <span className="text-base font-bold">Punch In for Today</span>
                      </>
                    )}
                  </button>
                ) : isWorking ? (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center ring-4 ring-emerald-50/50">
                      <p className="text-emerald-600 text-[9px] font-black uppercase tracking-widest mb-1.5">Work Timer Active</p>
                      <p className="text-3xl font-mono font-black text-emerald-700 tracking-tighter">{elapsed}</p>
                      <div className="flex items-center justify-center space-x-1.5 mt-2 text-emerald-500">
                        <CheckCircle2 size={12} />
                        <span className="text-[10px] font-bold">Punch In at {formatTime(todayRecord.checkIn)}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckOut}
                      disabled={actionLoading}
                      className="md:col-span-2 bg-red-500 text-white rounded-xl py-3 font-bold text-sm shadow-md hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <LogOut size={20} />
                          <span>Punch Out</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center space-y-3">
                    <div className="w-10 h-10 bg-[#3A565A]/10 text-[#3A565A] rounded-full flex items-center justify-center mx-auto">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Shift Completed</p>
                      <div className="flex items-center justify-center space-x-6 mt-2">
                        <div className="text-center">
                          <p className="font-black text-slate-800 text-sm leading-tight">{formatTime(todayRecord.checkIn)}</p>
                          <p className="text-[9px] text-slate-400 font-bold">IN</p>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="text-center">
                          <p className="font-black text-slate-800 text-sm leading-tight">{formatTime(todayRecord.checkOut)}</p>
                          <p className="text-[9px] text-slate-400 font-bold">OUT</p>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div className="text-center">
                          <p className="font-black text-[#3A565A] text-sm leading-tight">
                            {todayRecord.totalMinutes ? `${Math.floor(todayRecord.totalMinutes / 60)}h ${todayRecord.totalMinutes % 60}m` : '--'}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold">DURATION</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Monthly Summary */}
                {summary && (
                  <Link to="/employee/attendance" className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between group">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-slate-800">{summary.daysPresent}</span>
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">Days in {new Date().toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right whitespace-nowrap">
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter leading-none">{summary.daysMissed} Missed</p>
                        <p className="text-[10px] font-black text-[#3A565A] uppercase tracking-tighter leading-none mt-1">{summary.totalHours}h Total</p>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#3A565A] group-hover:text-white transition-all shadow-inner">
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Team Hierarchy Section — Only for Manager / Senior Accountant */}
        {(user?.designation === 'Manager' || user?.designation === 'Senior Accountant') && (
          <TeamHierarchySection designation={user.designation} />
        )}

        {/* Pending Reschedule Card for Seniors */}
        {(user?.designation === 'Manager' || user?.designation === 'Senior Accountant') && pendingRescheduleCount > 0 && (
          <Link to="/employee/reschedule" className="block">
            <div className="bg-white rounded-[20px] p-5 shadow-sm border border-amber-200 hover:shadow-md transition-shadow flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Reschedule Requests</h3>
                  <p className="text-xs text-amber-600 font-semibold mt-0.5">
                    {pendingRescheduleCount} pending request{pendingRescheduleCount !== 1 ? 's' : ''} from your team
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500 text-white text-sm font-black w-8 h-8 rounded-full flex items-center justify-center">
                  {pendingRescheduleCount}
                </span>
                <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 group-hover:text-[#3A565A] transition-all" />
              </div>
            </div>
          </Link>
        )}

        {/* Bottom Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Task Overview */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <h3 className="font-bold text-slate-800 text-base mb-4">Task Overview</h3>
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                
                <ul className="space-y-2.5 text-xs text-slate-600 w-full md:w-auto">
                   <li className="flex items-center space-x-2.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                     <span><span className="font-semibold text-slate-700">Completed Tasks:</span> 7</span>
                   </li>
                   <li className="flex items-center space-x-2.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                     <span><span className="font-semibold text-slate-700">Pending Tasks:</span> 3</span>
                   </li>
                   <li className="flex items-center space-x-2.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                     <span><span className="font-semibold text-slate-700">Ongoing Review:</span> 2</span>
                   </li>
                   <li className="pt-2 text-[#3A565A] font-semibold hover:text-[#2a3e41] cursor-pointer transition-colors list-none flex items-center space-x-1 group">
                     <Link to="/employee/team" className="flex items-center">
                        <span>View Detailed Report</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </Link>
                   </li>
                </ul>
                
                <div className="w-32 h-32 relative">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {taskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xl font-bold text-slate-800">92%</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col min-h-[220px]">
             <h3 className="font-bold text-slate-800 text-base mb-4">Productivity</h3>
             <div className="flex-1 w-full h-full min-h-[160px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barSize={20} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={5} />
                     <Tooltip 
                       cursor={{fill: '#f1f5f9'}} 
                       contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.06)', fontSize: '11px' }} 
                     />
                     <Bar dataKey="completed" stackId="a" fill="#3A565A" radius={[0, 0, 4, 4]} />
                     <Bar dataKey="pending" stackId="a" fill="#719398" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardMetrics;
