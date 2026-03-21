import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, RefreshCcw, Loader2, Calendar, Clock, Building2, User,
  CheckCircle2, XCircle, MessageSquare, Send
} from 'lucide-react';
import { rescheduleAPI, clientAPI } from '../../../services/api';

function to12Hr(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  if (isNaN(h)) return t;
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

const STATUS_CONFIG = {
  pending_senior:     { label: 'Pending Senior',    color: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-400' },
  approved_by_senior: { label: 'Senior Approved',   color: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-400' },
  rejected_by_senior: { label: 'Rejected',          color: 'bg-red-50 text-red-600 ring-red-200', dot: 'bg-red-400' },
  sent_to_client:     { label: 'Awaiting Response',  color: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-400' },
  client_responded:   { label: 'Responded',          color: 'bg-indigo-50 text-indigo-700 ring-indigo-200', dot: 'bg-indigo-400' },
  completed:          { label: 'Completed',          color: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
};

const ClientRescheduleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondModal, setRespondModal] = useState(null); // reschedule request
  const [selectedDay, setSelectedDay] = useState(null);
  const [responding, setResponding] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { fetchData(); }, [id]);

  async function fetchData() {
    setLoading(true);
    try {
      const [clientRes, reqRes] = await Promise.all([
        clientAPI.getClient(id),
        rescheduleAPI.getByClient(id),
      ]);
      setClient(clientRes?.data || null);
      setRequests(reqRes?.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleClientRespond(requestId) {
    if (!selectedDay) return;
    setResponding(true);
    try {
      await rescheduleAPI.clientRespond(requestId, { selectedDay });
      setSuccess(true);
      setTimeout(() => {
        setRespondModal(null);
        setSelectedDay(null);
        setSuccess(false);
        fetchData();
      }, 1500);
    } catch (err) {
      console.error('Client respond failed', err);
      alert('Failed to submit response.');
    } finally {
      setResponding(false);
    }
  }

  const getName = (req, field) => {
    const p = req?.[field]?.personalInfo;
    return p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm px-6 py-5 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Client Reschedule Requests</h1>
          {client && (
            <p className="text-xs text-slate-500 mt-0.5">
              {client.contactName} — {client.entityName}
            </p>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 size={32} className="text-slate-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading requests...</p>
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <RefreshCcw size={28} className="text-slate-300" />
            <p className="text-sm font-semibold text-slate-500">No reschedule requests for this client</p>
          </div>
        )}

        {!loading && requests.map((req) => {
          const status = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending_senior;
          const canRespond = req.status === 'sent_to_client' && req.clientProposedDays?.length > 0;

          return (
            <div key={req._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <RefreshCcw size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Reschedule Request</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <User size={11} className="text-slate-400" />
                      <span className="text-[11px] text-slate-500">
                        By: <span className="font-semibold">{getName(req, 'requestedBy')}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ring-1 ${status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              {/* Details */}
              <div className="px-5 pb-3">
                <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Original Day</span>
                    <span className="font-extrabold text-slate-700">{req.originalDay}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Time</span>
                    <span className="text-slate-600 font-semibold">{to12Hr(req.originalFromTime)} – {to12Hr(req.originalToTime)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Date</span>
                    <span className="text-slate-600 font-semibold">
                      {req.originalDate ? new Date(req.originalDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Reason</span>
                    <span className="text-amber-700 font-semibold">{req.reason}</span>
                  </div>
                </div>
              </div>

              {/* Proposed Days */}
              {req.clientProposedDays?.length > 0 && (
                <div className="px-5 pb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available Options</p>
                  <div className="flex flex-wrap gap-2">
                    {req.clientProposedDays.map((d, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold ring-1 ring-blue-200">
                        <Calendar size={12} /> {d.day} {d.fromTime && `(${to12Hr(d.fromTime)} – ${to12Hr(d.toTime)})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Selected */}
              {req.clientSelectedDay?.day && (
                <div className="px-5 pb-3">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">
                      Selected: {req.clientSelectedDay.day}
                      {req.clientSelectedDay.fromTime && ` (${to12Hr(req.clientSelectedDay.fromTime)} – ${to12Hr(req.clientSelectedDay.toTime)})`}
                    </span>
                  </div>
                </div>
              )}

              {/* Respond Button */}
              {canRespond && (
                <div className="px-5 py-3 border-t border-slate-100">
                  <button
                    onClick={() => { setRespondModal(req); setSelectedDay(null); }}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#3A565A] rounded-xl hover:bg-[#2a3e41] transition-colors shadow-sm"
                  >
                    <Calendar size={14} /> Select New Visit Day on Behalf of Client
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Respond Modal ─── */}
      {respondModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => !responding && setRespondModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={16} className="text-[#3A565A]" />
                Select New Visit Day
              </h3>
            </div>

            {success ? (
              <div className="px-6 py-10 flex flex-col items-center space-y-3">
                <CheckCircle2 size={32} className="text-emerald-500" />
                <h4 className="text-sm font-bold text-slate-800">Response Submitted!</h4>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                <p className="text-xs text-slate-500">Select one of the proposed days:</p>
                <div className="space-y-2">
                  {respondModal.clientProposedDays?.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(d)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                        selectedDay === d
                          ? 'border-[#3A565A] bg-[#3A565A]/5 text-[#3A565A]'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span className="font-bold">{d.day}</span>
                      </div>
                      {d.fromTime && (
                        <span>{to12Hr(d.fromTime)} – {to12Hr(d.toTime)}</span>
                      )}
                      {selectedDay === d && <CheckCircle2 size={16} className="text-[#3A565A]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!success && (
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button onClick={() => setRespondModal(null)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => handleClientRespond(respondModal._id)}
                  disabled={!selectedDay || responding}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#3A565A] rounded-xl hover:bg-[#2a3e41] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {responding ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Confirm Selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientRescheduleView;
