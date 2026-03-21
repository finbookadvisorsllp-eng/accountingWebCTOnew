import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, User, Send } from 'lucide-react';
import { clientAPI } from '../../services/api';

const ClientQueries = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const clientId = user._id;

      const res = await clientAPI.getClient(clientId);
      setProfile(res.data);
    } catch (error) {
      console.error("Error drawing support frame:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending, or connect to feedback endpoint if needed
    setTimeout(() => {
      alert("Message sent to your accountant!");
      setMessage('');
      setSending(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A565A]"></div>
      </div>
    );
  }

  const accountant = profile?.empAssign;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Support & Queries</h1>
        <p className="text-sm text-slate-500 font-semibold mt-1">Get in touch with your assigned accountant or raise questions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Accountant Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F1F2] text-[#3A565A] flex items-center justify-center mb-4">
            <User size={32} strokeWidth={1.5} />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Your Accountant</h3>
          <p className="text-lg font-black text-[#3A565A] mt-1">
            {accountant ? `${accountant.personalInfo?.firstName || ''} ${accountant.personalInfo?.lastName || 'Assigned'}` : 'Unassigned'}
          </p>
          <p className="text-xs text-slate-400 font-bold tracking-wider mt-1">GS ADVISOR</p>

          <div className="mt-6 w-full space-y-2">
            <a 
              href={`tel:${accountant?.personalInfo?.phone || '#'}`} 
              className="flex items-center justify-center space-x-2 py-2 w-full bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-700 transition"
            >
              <Phone size={16} className="text-[#3A565A]" />
              <span>{accountant?.personalInfo?.phone || 'Not Shared'}</span>
            </a>
            <a 
              href={`mailto:${accountant?.personalInfo?.email || accountant?.contactInfo?.email || '#'}`} 
              className="flex items-center justify-center space-x-2 py-2 w-full bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-bold text-slate-700 transition overflow-hidden text-ellipsis"
            >
              <Mail size={16} className="text-[#3A565A]" />
              <span className="truncate max-w-[150px]">{accountant?.personalInfo?.email || accountant?.contactInfo?.email || 'Not Shared'}</span>
            </a>
          </div>
        </div>

        {/* Message Input Box */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-50 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center space-x-2 text-base">
            <MessageSquare size={18} className="text-[#3A565A]" />
            <span>Send quick message</span>
          </h3>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              placeholder="Ask a question about your files, reports, or scheduling..."
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#3A565A] outline-none resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending || !message.trim()}
                className="px-6 py-3 bg-[#3A565A] hover:bg-[#2A3E42] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <span>{sending ? 'Sending...' : 'Send Message'}</span>
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientQueries;
