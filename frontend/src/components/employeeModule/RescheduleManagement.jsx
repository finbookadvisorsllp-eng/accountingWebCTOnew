import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, RefreshCcw, Loader2, Clock, Calendar, Building2, User,
  CheckCircle2, XCircle, Send, ChevronDown, ChevronUp, AlertCircle,
  Filter, Star, MessageSquare
} from 'lucide-react';
import { rescheduleAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';

/* ─── 12h helper ─── */
function to12Hr(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  if (isNaN(h)) return t;
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

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
      const h12Str = h12.toString().padStart(2, '0').slice(-2); // just standard
      const label = `${h12Str}:${mStr} ${period}`;
      
      options.push({ value: time24, label });
    }
  }
  return options;
};

const STATUS_CONFIG = {
  pending_senior:     { label: 'Pending Review',    color: 'bg-amber-50 text-amber-700 ring-amber-200',    dot: 'bg-amber-400' },
  approved_by_senior: { label: 'Senior Approved',   color: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-400' },
  rejected_by_senior: { label: 'Rejected',          color: 'bg-red-50 text-red-600 ring-red-200',         dot: 'bg-red-400' },
  sent_to_client:     { label: 'Sent to Client',    color: 'bg-blue-50 text-blue-700 ring-blue-200',      dot: 'bg-blue-400' },
  client_responded:   { label: 'Client Responded',  color: 'bg-indigo-50 text-indigo-700 ring-indigo-200', dot: 'bg-indigo-400' },
  completed:          { label: 'Completed',          color: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
};

const RescheduleManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isSenior = user?.designation === 'Manager' || user?.designation === 'Senior Accountant';

  const [activeTab, setActiveTab] = useState('my');
  const [myRequests, setMyRequests] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // request id

  // Senior action modal state
  const [actionModal, setActionModal] = useState(null); // { request, type: 'approve'|'reject'|'send' }
  const [actionNote, setActionNote] = useState('');
  const [proposedDays, setProposedDays] = useState([{ day: '', fromTime: '', toTime: '' }]);
  const [agreedDay, setAgreedDay] = useState('');
  const [agreedFromTime, setAgreedFromTime] = useState('');
  const [agreedToTime, setAgreedToTime] = useState('');

  useEffect(() => { fetchRequests(); }, [activeTab]);

  async function fetchRequests() {
    setLoading(true);
    try {
      if (activeTab === 'my') {
        const res = await rescheduleAPI.getMyRequests();
        setMyRequests(res?.data?.data || []);
      } else {
        const res = await rescheduleAPI.getPending();
        setTeamRequests(res?.data?.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch reschedule requests', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeniorAction(requestId, action) {
    setActionLoading(requestId);
    try {
      const payload = { action, note: actionNote };
      if (action === 'approved') {
        payload.selectedDay = { day: agreedDay, fromTime: agreedFromTime, toTime: agreedToTime };
      }
      await rescheduleAPI.seniorAction(requestId, payload);
      setActionModal(null);
      setActionNote('');
      fetchRequests();
    } catch (err) {
      console.error('Senior action failed', err);
      alert('Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSendToClient(requestId) {
    const validDays = proposedDays.filter(d => d.day.trim());
    if (validDays.length === 0) {
      alert('Please add at least one proposed day.');
      return;
    }
    setActionLoading(requestId);
    try {
      await rescheduleAPI.sendToClient(requestId, { proposedDays: validDays });
      setActionModal(null);
      setProposedDays([{ day: '', fromTime: '', toTime: '' }]);
      fetchRequests();
    } catch (err) {
      console.error('Send to client failed', err);
      alert('Failed to send to client.');
    } finally {
      setActionLoading(null);
    }
  }

  const getName = (req, field) => {
    const p = req?.[field]?.personalInfo;
    return p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() : 'Unknown';
  };

  const requests = activeTab === 'my' ? myRequests : teamRequests;

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white scrollbar-hide w-full h-full pb-8">
      {/* Header */}
      <header className="flex items-center justify-between px-5 md:px-8 py-5 bg-white/90 backdrop-blur-lg sticky top-0 z-30 border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Reschedule Requests</h1>
            <p className="text-slate-400 text-xs font-medium mt-0.5">Manage visit rescheduling</p>
          </div>
        </div>
      </header>

      <div className="px-4 md:px-8 lg:px-10 py-5 w-full max-w-5xl mx-auto space-y-5">
        {/* Tabs */}
        <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-100 self-start w-fit">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-5 py-2.5 text-xs font-bold rounded-[10px] transition-all ${activeTab === 'my' ? 'bg-[#3A565A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            My Requests
          </button>
          {isSenior && (
            <button
              onClick={() => setActiveTab('team')}
              className={`px-5 py-2.5 text-xs font-bold rounded-[10px] transition-all flex items-center gap-1.5 ${activeTab === 'team' ? 'bg-[#3A565A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <User size={13} />
              Team Requests
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 size={32} className="text-[#3A565A] animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Loading requests...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
              <RefreshCcw size={24} className="text-slate-300" />
            </div>
            <h3 className="text-sm font-bold text-slate-600">No requests found</h3>
            <p className="text-xs text-slate-400">
              {activeTab === 'my' ? "You haven't submitted any reschedule requests yet." : 'No pending requests from your team.'}
            </p>
          </div>
        )}

        {/* Request Cards */}
        {!loading && requests.map((req) => {
          const status = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending_senior;
          const isMyTab = activeTab === 'my';

          return (
            <div key={req._id} className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="px-5 py-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shrink-0">
                    <RefreshCcw size={18} className="text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate">
                      {req.client?.contactName || req.client?.entityName || 'Client'}
                    </h3>
                    {req.client?.entityName && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Building2 size={11} className="text-slate-400" />
                        <span className="text-[11px] text-slate-500 truncate">{req.client.entityName}</span>
                      </div>
                    )}
                    {!isMyTab && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <User size={11} className="text-slate-400" />
                        <span className="text-[11px] text-slate-500">
                          Requested by: <span className="font-semibold text-slate-700">{getName(req, 'requestedBy')}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ring-1 ${status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              {/* Visit Details */}
              <div className="px-5 pb-3">
                <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Original Day</span>
                    <span className="font-extrabold text-slate-700">{req.originalDay}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Time</span>
                    <span className="font-semibold text-slate-600">
                      {to12Hr(req.originalFromTime)} – {to12Hr(req.originalToTime)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Date</span>
                    <span className="font-semibold text-slate-600">
                      {req.originalDate ? new Date(req.originalDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Submitted</span>
                    <span className="font-semibold text-slate-600">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="px-5 pb-3">
                <div className="flex items-start gap-2 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                  <MessageSquare size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">{req.reason}</p>
                </div>
              </div>

              {/* Senior Response */}
              {req.seniorResponse?.action && (
                <div className="px-5 pb-3">
                  <div className={`flex items-start gap-2 p-3 rounded-xl border ${req.seniorResponse.action === 'approved' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                    {req.seniorResponse.action === 'approved' ? (
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-[11px] font-bold ${req.seniorResponse.action === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}>
                        Senior {req.seniorResponse.action === 'approved' ? 'Approved' : 'Rejected'}
                      </p>
                      {req.seniorResponse.note && (
                        <p className="text-xs text-slate-600 mt-0.5">{req.seniorResponse.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Proposed Day by Accountant */}
              {req.accountantProposedDay && (
                <div className="px-5 pb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Accountant Suggested</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold ring-1 ring-amber-200">
                    <Calendar size={12} />
                    {req.accountantProposedDay} {req.accountantProposedFromTime && `(${to12Hr(req.accountantProposedFromTime)} – ${to12Hr(req.accountantProposedToTime)})`}
                  </span>
                </div>
              )}

              {/* Client Selected Day */}
              {req.clientSelectedDay?.day && (
                <div className="px-5 pb-3">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">
                      Client selected: {req.clientSelectedDay.day}
                      {req.clientSelectedDay.fromTime && ` (${to12Hr(req.clientSelectedDay.fromTime)} – ${to12Hr(req.clientSelectedDay.toTime)})`}
                    </span>
                  </div>
                </div>
              )}

              {/* Senior Action Buttons (Team tab only) */}
              {!isMyTab && req.status === 'pending_senior' && (
                <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2.5">
                  <button
                    onClick={() => { 
                      setActionModal({ request: req, type: 'approve' }); 
                      setActionNote(''); 
                      setAgreedDay(req.accountantProposedDay || '');
                      setAgreedFromTime(req.accountantProposedFromTime || '');
                      setAgreedToTime(req.accountantProposedToTime || '');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button
                    onClick={() => { setActionModal({ request: req, type: 'reject' }); setActionNote(''); }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}

              {/* Send to Client Button (after approval) */}
              {!isMyTab && req.status === 'approved_by_senior' && (
                <div className="px-5 py-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setActionModal({ request: req, type: 'send' });
                      setProposedDays([{ day: '', fromTime: '', toTime: '' }]);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    <Send size={14} /> Send Proposed Days to Client
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Helper to generate time options ─── */}
      {/* This helper function should ideally be defined outside the component or before the return statement.
          Placing it directly within JSX curly braces as shown in the instruction would cause a syntax error.
          Assuming the intent is to have it available within the component's scope. */}
      {/*
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
      */}

      {/* ─── Action Modal ─── */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setActionModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  actionModal.type === 'approve' ? 'bg-emerald-50' : actionModal.type === 'reject' ? 'bg-red-50' : 'bg-blue-50'
                }`}>
                  {actionModal.type === 'approve' && <CheckCircle2 size={16} className="text-emerald-600" />}
                  {actionModal.type === 'reject' && <XCircle size={16} className="text-red-600" />}
                  {actionModal.type === 'send' && <Send size={16} className="text-blue-600" />}
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {actionModal.type === 'approve' ? 'Approve Request' : actionModal.type === 'reject' ? 'Reject Request' : 'Send to Client'}
                </h3>
              </div>
              <button onClick={() => setActionModal(null)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <XCircle size={14} className="text-slate-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Request Info */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Client</span>
                  <span className="text-slate-700 font-bold">{actionModal.request.client?.contactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Requested By</span>
                  <span className="text-slate-700 font-semibold">{getName(actionModal.request, 'requestedBy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Day</span>
                  <span className="text-slate-700 font-extrabold">{actionModal.request.originalDay}</span>
                </div>
              </div>

              {/* Approve/Reject Note */}
              {(actionModal.type === 'approve' || actionModal.type === 'reject') && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Note (optional)</label>
                  <textarea
                    value={actionNote}
                    onChange={e => setActionNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={2}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-[#3A565A] focus:ring-2 focus:ring-[#3A565A]/10 transition-all resize-none"
                  />
                </div>
              )}

              {/* Approve — Adjust Final Schedule */}
              {actionModal.type === 'approve' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Final Agreed Schedule (Confirm with Client offline) <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-2">
                    <select 
                      value={agreedDay} 
                      onChange={e => setAgreedDay(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 outline-none focus:border-[#3A565A]"
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
                          value={agreedFromTime} 
                          onChange={e => setAgreedFromTime(e.target.value)}
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
                          value={agreedToTime} 
                          onChange={e => setAgreedToTime(e.target.value)}
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
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2.5">
              <button onClick={() => setActionModal(null)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              {actionModal.type === 'approve' && (
                <button
                  onClick={() => handleSeniorAction(actionModal.request._id, 'approved')}
                  disabled={actionLoading === actionModal.request._id}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionLoading === actionModal.request._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Approve
                </button>
              )}
              {actionModal.type === 'reject' && (
                <button
                  onClick={() => handleSeniorAction(actionModal.request._id, 'rejected')}
                  disabled={actionLoading === actionModal.request._id}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionLoading === actionModal.request._id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                  Reject
                </button>
              )}
              {actionModal.type === 'send' && (
                <button
                  onClick={() => handleSendToClient(actionModal.request._id)}
                  disabled={actionLoading === actionModal.request._id}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionLoading === actionModal.request._id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Send to Client
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescheduleManagement;
