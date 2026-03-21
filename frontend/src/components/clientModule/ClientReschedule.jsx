import React, { useState, useEffect } from 'react';
import { RefreshCcw, CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import { rescheduleAPI } from '../../services/api';

const ClientReschedule = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeReqId, setActiveReqId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const clientId = user._id;
      const res = await rescheduleAPI.getByClient(clientId);
      if (res.data?.data) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching reschedule requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reqId) => {
    if (!selectedDay) return;
    setSubmitting(true);
    try {
      await rescheduleAPI.clientRespond(reqId, { selectedDay });
      setSelectedDay(null);
      setActiveReqId(null);
      fetchRequests(); // Refresh
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending_senior: { label: 'Pending Approval', color: 'bg-slate-100 text-slate-600' },
      approved_by_senior: { label: 'Approved by Senior', color: 'bg-blue-100 text-blue-700' },
      rejected_by_senior: { label: 'Rejected', color: 'bg-rose-100 text-rose-700' },
      sent_to_client: { label: 'Awaiting Your Response', color: 'bg-amber-100 text-amber-700' },
      client_responded: { label: 'You Responded', color: 'bg-emerald-100 text-emerald-700' },
      completed: { label: 'Completed', color: 'bg-teal-100 text-teal-700' },
    };
    const info = map[status] || { label: status, color: 'bg-slate-100 text-slate-600' };
    return (
      <span className={`px-3 py-1 rounded-full text-[11px] font-black ${info.color}`}>{info.label}</span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A565A]"></div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'sent_to_client');
  const otherRequests = requests.filter(r => r.status !== 'sent_to_client');

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Reschedule Requests</h1>
        <p className="text-sm text-slate-500 font-semibold mt-1">View and respond to visit reschedule requests from your accountant.</p>
      </div>

      {/* Action Required Section */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-amber-700 flex items-center space-x-2">
            <Clock size={18} />
            <span>Action Required ({pendingRequests.length})</span>
          </h2>
          {pendingRequests.map((req) => (
            <div key={req._id} className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusBadge(req.status)}
                    <span className="text-xs text-slate-400 font-semibold">{formatDate(req.createdAt)}</span>
                  </div>
                  <h3 className="font-bold text-slate-800">
                    Original Visit: <span className="text-[#3A565A]">{req.originalDay}</span>
                    {req.originalFromTime && <span className="text-slate-500 text-sm ml-2">({req.originalFromTime} - {req.originalToTime})</span>}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium mt-1">
                    Reason: <span className="italic">"{req.reason}"</span>
                  </p>
                  {req.requestedBy && (
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Requested by: {req.requestedBy.personalInfo?.firstName || ''} {req.requestedBy.personalInfo?.lastName || ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Proposed Days Selection */}
              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">Select your preferred day:</p>
                <div className="flex flex-wrap gap-2">
                  {req.clientProposedDays?.map((propDay, idx) => {
                    const isSelected = activeReqId === req._id && selectedDay && selectedDay.day === propDay.day && selectedDay.fromTime === propDay.fromTime;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setSelectedDay(propDay); setActiveReqId(req._id); }}
                        className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                          isSelected 
                            ? 'bg-[#3A565A] border-transparent text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-200'
                        }`}
                      >
                        <Calendar size={14} className="inline mr-1.5" />
                        {propDay.day} ({propDay.fromTime} - {propDay.toTime})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleRespond(req._id)}
                  disabled={activeReqId !== req._id || !selectedDay || submitting}
                  className="px-6 py-3 bg-[#3A565A] hover:bg-[#2A3E42] text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-40 flex items-center space-x-2"
                >
                  <CheckCircle2 size={16} />
                  <span>{submitting ? 'Submitting...' : 'Confirm Selection'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-700 flex items-center space-x-2">
          <RefreshCcw size={18} />
          <span>Request History ({otherRequests.length})</span>
        </h2>
        {otherRequests.length > 0 ? otherRequests.map((req) => (
          <div key={req._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  {getStatusBadge(req.status)}
                  <span className="text-xs text-slate-400 font-semibold">{formatDate(req.createdAt)}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Original: {req.originalDay}
                  {req.originalFromTime && <span className="text-slate-500 ml-2">({req.originalFromTime} - {req.originalToTime})</span>}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">"{req.reason}"</p>
              </div>
              {req.clientSelectedDay && (
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold">Selected</p>
                  <p className="text-sm font-black text-[#3A565A]">{req.clientSelectedDay.day}</p>
                  <p className="text-[11px] text-slate-400">{req.clientSelectedDay.fromTime} - {req.clientSelectedDay.toTime}</p>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
            <RefreshCcw size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-semibold">No reschedule history found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientReschedule;
