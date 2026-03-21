import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, Phone, Shield, Loader2, Users, Calendar, Clock,
  Star, Search, ChevronDown, ChevronUp, CalendarDays, RefreshCcw, X,
  CheckCircle2, AlertCircle, Send
} from 'lucide-react';
import { clientAPI, rescheduleAPI } from '../../services/api';

/* ─── 12-hour time helper ─── */
function to12Hr(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  if (isNaN(h)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

/* ─── Generate visit dates for a month from weekly/monthly schedule ─── */
function generateVisitDates(client) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const dates = [];

  if (client.scheduleType === 'weekly') {
    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const enabledDays = client.visitSchedule?.filter(s => s.enabled) || [];
    if (enabledDays.length === 0 && client.visitDays?.length) {
      // Legacy fallback
      client.visitDays.forEach(dayName => {
        const target = dayMap[dayName];
        if (target === undefined) return;
        const d = new Date(year, month, 1);
        while (d.getDay() !== target) d.setDate(d.getDate() + 1);
        while (d.getMonth() === month) {
          dates.push({
            date: new Date(d),
            day: dayName,
            fromTime: client.visitTimeFrom || '',
            toTime: client.visitTimeTo || '',
          });
          d.setDate(d.getDate() + 7);
        }
      });
    } else {
      enabledDays.forEach(s => {
        const target = dayMap[s.day];
        if (target === undefined) return;
        const d = new Date(year, month, 1);
        while (d.getDay() !== target) d.setDate(d.getDate() + 1);
        while (d.getMonth() === month) {
          dates.push({
            date: new Date(d),
            day: s.day,
            fromTime: s.fromTime || '',
            toTime: s.toTime || '',
          });
          d.setDate(d.getDate() + 7);
        }
      });
    }
  } else if (client.scheduleType === 'monthly' && client.monthlySchedule?.days?.length) {
    client.monthlySchedule.days.forEach(d => {
      const dayNum = parseInt(d.day, 10);
      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 31) {
        const dt = new Date(year, month, dayNum);
        if (dt.getMonth() === month) {
          dates.push({
            date: dt,
            day: d.day,
            fromTime: d.fromTime || '',
            toTime: d.toTime || '',
          });
        }
      }
    });
  }

  dates.sort((a, b) => a.date - b.date);
  return dates;
}

const getOrdinalSuffix = (i) => {
  const j = i % 10, k = i % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const hStr = hour.toString().padStart(2, '0');
      const mStr = min.toString().padStart(2, '0');
      const time24 = `${hStr}:${mStr}`;
      
      const period = hour >= 12 ? 'PM' : 'AM';
      let h12 = hour % 12;
      if (h12 === 0) h12 = 12;
      const h12Str = h12.toString().padStart(2, '0');
      const label = `${h12Str}:${mStr} ${period}`;
      
      options.push({ value: time24, label });
    }
  }
  return options;
};

/* ─── The Component ─── */
const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [expandedClient, setExpandedClient] = useState(null);

  // Reschedule modal
  const [rescheduleModal, setRescheduleModal] = useState(null); // { client, visitDate }
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => { fetchMyClients(); }, []);

  async function fetchMyClients() {
    try {
      setLoading(true);
      const res = await clientAPI.getMyClients();
      const rawClients = (res?.data?.data || []).filter(c => !c.groupCompany);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

      const checkTodayVisit = (c) => {
        if (c.scheduleType === 'weekly') {
          return c.visitSchedule?.some(s => s.enabled && s.day === today) || c.visitDays?.includes(today);
        } else if (c.scheduleType === 'monthly') {
          const currentDayStr = new Date().getDate().toString();
          return c.monthlySchedule?.days?.some(s => s.day === currentDayStr);
        }
        return false;
      };

      const sorted = [...rawClients].sort((a, b) => {
        const aT = checkTodayVisit(a), bT = checkTodayVisit(b);
        if (aT && !bT) return -1;
        if (!aT && bT) return 1;
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
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const [suggestedDay, setSuggestedDay] = useState('');
  const [suggestedFromTime, setSuggestedFromTime] = useState('');
  const [suggestedToTime, setSuggestedToTime] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchSearch =
        c.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.entityName?.toLowerCase().includes(searchTerm.toLowerCase());
      const isToday = c.scheduleType === 'weekly'
        ? (c.visitSchedule?.some(s => s.enabled && s.day === todayStr) || c.visitDays?.includes(todayStr))
        : c.scheduleType === 'monthly'
          ? c.monthlySchedule?.days?.some(s => s.day === new Date().getDate().toString())
          : false;
      const matchTab = filterTab === 'all' || (filterTab === 'today' && isToday);
      return matchSearch && matchTab;
    });
  }, [clients, searchTerm, filterTab, todayStr]);

  const getVisitDaysList = (client) => {
    if (client.scheduleType === 'weekly') {
      const fromSchedule = client.visitSchedule?.filter(s => s.enabled).map(s => s.day) || [];
      return fromSchedule.length > 0 ? fromSchedule : (client.visitDays || []);
    } else if (client.scheduleType === 'monthly') {
      return client.monthlySchedule?.days?.map(s => `${s.day}${getOrdinalSuffix(parseInt(s.day, 10))}`) || [];
    }
    return [];
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleReason.trim() || !rescheduleModal || !suggestedDay || !suggestedFromTime || !suggestedToTime) {
      alert('Please provide reason and suggested schedule (Day, From & To Time).');
      return;
    }
    setSubmitting(true);
    try {
      await rescheduleAPI.create({
        clientId: rescheduleModal.client._id,
        originalDay: rescheduleModal.visitDate.day,
        originalFromTime: rescheduleModal.visitDate.fromTime,
        originalToTime: rescheduleModal.visitDate.toTime,
        originalDate: rescheduleModal.visitDate.date?.toISOString(),
        reason: rescheduleReason.trim(),
        // Suggested Date (From Accountant)
        proposedDay: suggestedDay,
        proposedFromTime: suggestedFromTime,
        proposedToTime: suggestedToTime
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setRescheduleModal(null);
        setRescheduleReason('');
        setSuggestedDay('');
        setSuggestedFromTime('');
        setSuggestedToTime('');
        setSubmitSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Reschedule request failed', err);
      alert('Failed to submit reschedule request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white scrollbar-hide w-full h-full pb-8">
      {/* ─── Header ─── */}
      <header className="flex items-center justify-between px-5 md:px-8 py-5 bg-white/90 backdrop-blur-lg sticky top-0 z-30 border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">My Clients</h1>
            {!loading && (
              <p className="text-slate-400 text-xs font-medium mt-0.5">
                {clients.length} client{clients.length !== 1 ? 's' : ''} assigned
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <div className="px-4 md:px-8 lg:px-10 py-5 w-full max-w-5xl mx-auto space-y-5">
        {/* Search & Filters */}
        {!loading && !error && clients.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients or entity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:border-[#3A565A] focus:ring-2 focus:ring-[#3A565A]/10 shadow-sm text-sm text-slate-700 font-medium transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-100 self-start sm:self-auto">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-4 py-2 text-xs font-bold rounded-[10px] transition-all ${filterTab === 'all' ? 'bg-[#3A565A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab('today')}
                className={`px-4 py-2 text-xs font-bold rounded-[10px] transition-all flex items-center space-x-1.5 ${filterTab === 'today' ? 'bg-[#3A565A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Star size={12} className={filterTab === 'today' ? 'fill-white' : ''} />
                <span>Today</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 size={36} className="text-[#3A565A] animate-spin" />
            <p className="text-slate-400 font-medium text-sm">Loading your clients...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <Shield size={24} className="text-red-400" />
            </div>
            <p className="text-slate-600 font-medium text-sm">{error}</p>
            <button onClick={fetchMyClients} className="px-5 py-2 bg-[#3A565A] text-white rounded-xl text-xs font-bold hover:bg-[#2a3e41] transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && clients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
              <Users size={28} className="text-slate-300" />
            </div>
            <h3 className="text-base font-semibold text-slate-700">No clients assigned</h3>
            <p className="text-slate-400 text-xs">You haven't been assigned any clients yet.</p>
          </div>
        )}

        {/* No results */}
        {!loading && !error && clients.length > 0 && filteredClients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Search size={28} className="text-slate-300" />
            <h3 className="text-base font-semibold text-slate-600">No results found</h3>
            <p className="text-slate-400 text-xs">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {/* ─── Client Cards ─── */}
        {!loading && !error && filteredClients.map((client) => {
          const isTodayVisit = client.scheduleType === 'weekly'
            ? (client.visitSchedule?.some(s => s.enabled && s.day === todayStr) || client.visitDays?.includes(todayStr))
            : client.scheduleType === 'monthly'
              ? client.monthlySchedule?.days?.some(s => s.day === new Date().getDate().toString())
              : false;
          const visitDays = getVisitDaysList(client);
          const isExpanded = expandedClient === client._id;
          const visitDates = isExpanded ? generateVisitDates(client) : [];

          return (
            <div key={client._id} className="group">
              {/* Main Card */}
              <div
                className={`bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border transition-all duration-200 ${
                  isTodayVisit
                    ? 'border-[#3A565A]/30 ring-1 ring-[#3A565A]/8 shadow-[0_2px_12px_rgba(58,86,90,0.08)]'
                    : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                } ${isExpanded ? 'rounded-b-none border-b-0' : ''}`}
              >
                <div className="flex items-start p-4 md:p-5 gap-4">
                  {/* Avatar */}
                  <div
                    onClick={() => navigate(`/employee/clients/${client._id}`)}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#3A565A] to-[#5a8a8a] flex items-center justify-center text-white text-sm md:text-base font-bold shrink-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  >
                    {getInitials(client.contactName)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3
                          onClick={() => navigate(`/employee/clients/${client._id}`)}
                          className="font-bold text-slate-800 text-sm md:text-[15px] leading-tight cursor-pointer hover:text-[#3A565A] transition-colors truncate"
                        >
                          {client.contactName}
                        </h3>
                        {client.entityName && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <Building2 size={12} className="text-slate-400 shrink-0" />
                            <span className="text-xs text-slate-500 truncate">{client.entityName}</span>
                          </div>
                        )}
                      </div>

                      {/* Today badge */}
                      {isTodayVisit && (
                        <span className="shrink-0 inline-flex items-center gap-1 bg-[#3A565A] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          <Star size={10} className="fill-white" />
                          TODAY
                        </span>
                      )}
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
                      {client.contactPhone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone size={12} className="text-[#6DA4A4]" />
                          <span>{client.contactPhone}</span>
                        </div>
                      )}

                      {/* Visit Days — Bold Pills */}
                      {visitDays.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-[#6DA4A4] shrink-0" />
                          <div className="flex flex-wrap gap-1">
                            {visitDays.map(day => (
                              <span
                                key={day}
                                className={`inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                  day === todayStr || (client.scheduleType === 'monthly' && day.startsWith(new Date().getDate().toString()))
                                    ? 'bg-[#3A565A] text-white'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Visit Time — 12h format */}
                      {(client.scheduleType === 'weekly' || client.scheduleType === 'monthly') && (() => {
                        let todaySlot = null;

                        if (client.scheduleType === 'weekly') {
                          const withTime = client.visitSchedule?.filter(s => s.enabled && (s.fromTime || s.toTime));
                          if (withTime?.length) {
                            todaySlot = withTime.find(s => s.day === todayStr) || withTime[0];
                          }
                        } else if (client.scheduleType === 'monthly') {
                          const currentDayStr = new Date().getDate().toString();
                          const withTime = client.monthlySchedule?.days?.filter(s => s.fromTime || s.toTime);
                          if (withTime?.length) {
                            todaySlot = withTime.find(s => s.day === currentDayStr) || withTime[0];
                          }
                        }

                        if (todaySlot) {
                          return (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Clock size={12} className="text-[#6DA4A4]" />
                              <span className={isTodayVisit ? 'font-bold text-[#3A565A]' : ''}>
                                {to12Hr(todaySlot.fromTime)} – {to12Hr(todaySlot.toTime)}
                              </span>
                            </div>
                          );
                        }

                        if (client.visitTimeFrom || client.visitTimeTo) {
                          return (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Clock size={12} className="text-[#6DA4A4]" />
                              <span className={isTodayVisit ? 'font-bold text-[#3A565A]' : ''}>
                                {to12Hr(client.visitTimeFrom)} – {to12Hr(client.visitTimeTo)}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    {/* Navigate Button */}
                    <button
                      onClick={() => navigate(`/employee/clients/${client._id}`)}
                      className="w-9 h-9 rounded-xl bg-[#3A565A] flex items-center justify-center text-white shadow-sm hover:bg-[#2a3e41] hover:scale-105 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Visit Instance Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedClient(isExpanded ? null : client._id);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all text-xs font-bold ${
                        isExpanded
                          ? 'bg-[#3A565A] text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      title="Visit Instance"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <CalendarDays size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* ─── Visit Instance Panel ─── */}
              {isExpanded && (
                <div className="bg-white border border-t-0 border-slate-100 rounded-b-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="border-t border-dashed border-slate-200" />
                  <div className="px-4 md:px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-[#3A565A]" />
                        Visit Instance — {currentMonthName}
                      </h4>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-semibold">
                        {visitDates.length} visit{visitDates.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {visitDates.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">No visits scheduled this month</p>
                    ) : (
                      <div className="space-y-1.5">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <div className="col-span-3">Date</div>
                          <div className="col-span-2">Day</div>
                          <div className="col-span-3">From</div>
                          <div className="col-span-2">To</div>
                          <div className="col-span-2 text-right">Action</div>
                        </div>

                        {visitDates.map((vd, idx) => {
                          const isPast = vd.date < new Date(new Date().setHours(0, 0, 0, 0));
                          const isToday = vd.date.toDateString() === new Date().toDateString();

                          return (
                            <div
                              key={idx}
                              className={`grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-xl text-xs transition-colors ${
                                isToday
                                  ? 'bg-[#3A565A]/5 border border-[#3A565A]/10'
                                  : isPast
                                    ? 'bg-slate-50 opacity-60'
                                    : 'bg-white hover:bg-slate-50 border border-transparent'
                              }`}
                            >
                              <div className="col-span-3 font-semibold text-slate-700">
                                {vd.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                {isToday && (
                                  <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#3A565A] animate-pulse" />
                                )}
                              </div>
                              <div className="col-span-2">
                                <span className={`inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                  isToday ? 'bg-[#3A565A] text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {vd.day}
                                </span>
                              </div>
                              <div className="col-span-3 text-slate-600 font-medium">
                                {to12Hr(vd.fromTime) || '—'}
                              </div>
                              <div className="col-span-2 text-slate-600 font-medium">
                                {to12Hr(vd.toTime) || '—'}
                              </div>
                              <div className="col-span-2 text-right">
                                {!isPast && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRescheduleModal({ client, visitDate: vd });
                                      setRescheduleReason('');
                                      setSubmitSuccess(false);
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                                  >
                                    <RefreshCcw size={10} />
                                    Reschedule
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Reschedule Modal ─── */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => !submitting && setRescheduleModal(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <RefreshCcw size={16} className="text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Request Reschedule</h3>
              </div>
              <button
                onClick={() => !submitting && setRescheduleModal(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            {submitSuccess ? (
              /* Success State */
              <div className="px-6 py-10 flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center animate-[bounce_0.5s_ease-out]">
                  <CheckCircle2 size={28} className="text-emerald-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Request Submitted!</h4>
                <p className="text-xs text-slate-500 text-center">
                  Your senior will review this request and coordinate with the client.
                </p>
              </div>
            ) : (
              /* Form */
              <div className="px-6 py-5 space-y-4">
                {/* Visit Info */}
                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client</span>
                    <span className="text-xs font-bold text-slate-700">{rescheduleModal.client.contactName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Original Visit</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {rescheduleModal.visitDate.date?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {' · '}
                      <span className="font-extrabold text-slate-700">{rescheduleModal.visitDate.day}</span>
                    </span>
                  </div>
                  {(rescheduleModal.visitDate.fromTime || rescheduleModal.visitDate.toTime) && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</span>
                      <span className="text-xs text-slate-600">
                        {to12Hr(rescheduleModal.visitDate.fromTime)} – {to12Hr(rescheduleModal.visitDate.toTime)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Reason for Reschedule <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    placeholder="e.g. Client office closed for renovation, personal emergency…"
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#3A565A] focus:ring-2 focus:ring-[#3A565A]/10 transition-all resize-none"
                  />
                </div>

                {/* Suggested Date/Time */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Suggest New Schedule <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-2">
                    <select 
                      value={suggestedDay} 
                      onChange={e => setSuggestedDay(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 outline-none focus:border-[#3A565A] transition-all"
                    >
                      <option value="">-- Select Day --</option>
                      {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">From</label>
                        <select 
                          value={suggestedFromTime} 
                          onChange={e => setSuggestedFromTime(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 outline-none focus:border-[#3A565A]"
                        >
                          <option value="">-- Time --</option>
                          {generateTimeOptions().map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">To</label>
                        <select 
                          value={suggestedToTime} 
                          onChange={e => setSuggestedToTime(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 outline-none focus:border-[#3A565A]"
                        >
                          <option value="">-- Time --</option>
                          {generateTimeOptions().map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                  <AlertCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    This request goes to your senior. They will finalize the agreed date with the client offline.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            {!submitSuccess && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setRescheduleModal(null)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleSubmit}
                  disabled={submitting || !rescheduleReason.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#3A565A] rounded-xl hover:bg-[#2a3e41] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {submitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                  {submitting ? 'Submitting…' : 'Submit Request'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
