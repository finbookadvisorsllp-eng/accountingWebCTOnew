import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Calendar, Clock, 
  AlertCircle, ChevronRight, FileText, CheckCircle2, User 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  pnlAPI, gstLiabilityAPI, rescheduleAPI, clientAPI 
} from '../../services/api';

const COLORS = ['#2DD4BF', '#F87171', '#FBBF24', '#60A5FA'];

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [pnlSummary, setPnlSummary] = useState({ total_income: 0, total_expenses: 0, profit_or_loss: 0 });
  const [gstData, setGstData] = useState([]);
  const [pendingReschedule, setPendingReschedule] = useState(null);
  const [submittingReschedule, setSubmittingReschedule] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');

  const currentYear = new Date().getFullYear().toString();

  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const clientId = user._id; // Client Document ID

      // 1. Fetch Profile / Schedules
      const profileRes = await clientAPI.getClient(clientId);
      setProfile(profileRes.data);

      // 2. Fetch PnL Summary
      try {
        const pnlRes = await pnlAPI.getSummary(clientId, currentYear);
        if (pnlRes.data?.data) {
          setPnlSummary(pnlRes.data.data);
        }
      } catch (e) {}

      // 3. Fetch GST Liability (trend chart)
      try {
        const gstRes = await gstLiabilityAPI.getByClientAndYear(clientId, currentYear);
        if (gstRes.data?.data) {
          // Map to month names for Recharts
          const monthMap = { "1": "Jan", "2": "Feb", "3": "Mar", "4": "Apr", "5": "May", "6": "Jun", "7": "Jul", "8": "Aug", "9": "Sep", "10": "Oct", "11": "Nov", "12": "Dec" };
          const mapped = gstRes.data.data.map(item => ({
            name: monthMap[item.month] || `M${item.month}`,
            payable: item.gst_payable || 0,
            output: item.output_total || 0,
            input: item.input_total || 0
          })).sort((a,b) => Object.values(monthMap).indexOf(a.name) - Object.values(monthMap).indexOf(b.name));
          setGstData(mapped);
        }
      } catch (e) {}

      // 4. Fetch Pending Reschedule explicit for Client
      try {
        const rescRes = await rescheduleAPI.getByClient(clientId);
        if (rescRes.data?.data) {
          const pending = rescRes.data.data.find(r => r.status === 'sent_to_client');
          setPendingReschedule(pending || null);
        }
      } catch (e) {}

    } catch (error) {
      console.error("Dashboard hit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondReschedule = async () => {
    if (!selectedDay || !pendingReschedule) return;
    setSubmittingReschedule(true);
    try {
      await rescheduleAPI.clientRespond(pendingReschedule._id, { selectedDay });
      setPendingReschedule(null); // Clear banner
      fetchDashboardData(); // Reload schedules
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReschedule(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A565A]"></div>
      </div>
    );
  }

  const pnlPieData = [
    { name: 'Income', value: pnlSummary.total_income || 0 },
    { name: 'Expenses', value: pnlSummary.total_expenses || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#3A565A] to-[#243538] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        <div className="absolute top-4 right-4 animate-pulse">
          <button 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold border border-white/10 transition"
          >
            <User size={16} />
            <span>View Full Profile</span>
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-black">Welcome back,</h1>
          <p className="text-xl text-teal-100 font-bold mt-1 opacity-90">{profile?.entityName || 'Client'}</p>
          <p className="text-xs text-teal-200 mt-4 bg-teal-800/40 inline-block px-3 py-1.5 rounded-full font-semibold">
            Client ID: {profile?.clientId}
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex flex-col items-end">
          <p className="text-right text-xs text-teal-100 font-medium">Next Scheduled Visit</p>
          <p className="text-2xl font-black mt-1">
            {profile?.visitDays?.length > 0 ? profile.visitDays[0] : 'Not Set'}
          </p>
          <p className="text-xs text-teal-200 opacity-80 mt-1">
            {profile?.visitTimeFrom} - {profile?.visitTimeTo}
          </p>
        </div>
      </div>

      {/* Reschedule Alert Banner */}
      {pendingReschedule && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center bounce-in">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Reschedule Request Approval Needed</h3>
              <p className="text-sm text-slate-600 font-medium">Accountant has requested a reschedule. Reason: <span className="italic">"{pendingReschedule.reason}"</span></p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pendingReschedule.clientProposedDays?.map((propDay, idx) => {
                  const isSelected = selectedDay && selectedDay.day === propDay.day && selectedDay.fromTime === propDay.fromTime;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDay(propDay)}
                      className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                        isSelected 
                          ? 'bg-amber-600 border-transparent text-white shadow-md' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      {propDay.day} ({propDay.fromTime} - {propDay.toTime})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            onClick={handleRespondReschedule}
            disabled={!selectedDay || submittingReschedule}
            className="mt-4 md:mt-0 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {submittingReschedule ? 'Submitting...' : 'Confirm New Day'}
          </button>
        </div>
      )}

      {/* Profile Modal Overlay */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-6 relative shadow-2xl">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-black text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black text-slate-800">Company Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold">Business Name</p>
                <p className="text-sm font-extrabold text-slate-800 mt-1">{profile?.entityName}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold">GSTIN</p>
                <p className="text-sm font-extrabold text-[#3A565A] mt-1">{profile?.gstNo || 'Not Added'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold">PAN</p>
                <p className="text-sm font-extrabold text-slate-800 mt-1">{profile?.panNo || 'Not Added'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold">Contact Person</p>
                <p className="text-sm font-extrabold text-slate-800 mt-1">{profile?.contactName}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl md:col-span-2">
                <p className="text-xs text-slate-400 font-bold">Billing Address</p>
                <p className="text-sm font-extrabold text-slate-800 mt-1">{profile?.billingAddress || 'Not Configured'}</p>
              </div>
              <div className="bg-slate-100 p-4 rounded-2xl md:col-span-2">
                <p className="text-xs text-slate-400 font-bold">Branch Locations</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 mt-1">
                  {profile?.branchDetails?.length > 0 ? profile.branchDetails.map((b, idx) => (
                    <li key={idx}>{b.branchName} - {b.address}</li>
                  )) : <li>Single Main Location Only</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Profit */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-50 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-teal-50 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center space-x-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold tracking-wider">NET PROFIT/LOSS ({currentYear})</p>
              <h3 className={`text-2xl font-black mt-1 ${pnlSummary.profit_or_loss >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
                ₹{Math.abs(pnlSummary.profit_or_loss).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
            </div>
          </div>
        </div>

        {/* Card 2: Income / Expense Ratio */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-50 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between relative">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold tracking-wider">TOTAL REVENUE (INCOME)</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">₹{(pnlSummary.total_income).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: GST Liability */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-50 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-amber-50 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center space-x-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold tracking-wider">GST PAYABLE THIS YEAR</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ₹{gstData.reduce((acc, curr) => acc + curr.payable, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid for Charts & Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Card (Bar) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-md border border-slate-50">
          <h3 className="font-bold text-slate-800 text-lg mb-4">GST Liability Monthly Trend</h3>
          <div className="h-72">
            {gstData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gstData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold' }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11, fontWeight: 'bold' }} stroke="#94A3B8" />
                  <Tooltip 
                    contentStyle={{ background: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                  />
                  <Bar dataKey="payable" name="GST Payable" fill="#3A565A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">No GST Data found for {currentYear}</div>
            )}
          </div>
        </div>

        {/* Schedules Card */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-50">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Visit Schedule</h3>
          <div className="space-y-3">
            {profile?.visitDays?.length > 0 ? profile.visitDays.map((day, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#3A565A]">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{day}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{profile.visitTimeFrom} - {profile.visitTimeTo}</p>
                  </div>
                </div>
                <div className="bg-teal-100 text-[#3A565A] text-[11px] font-black px-2 py-1 rounded-full">Weekly</div>
              </div>
            )) : (
              <div className="text-center text-slate-400 py-10 font-medium text-sm">No regular visits configured.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ClientDashboard;
