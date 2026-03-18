import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, IndianRupee, Users, FileText, Activity, CreditCard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import CompanySelector from './CompanySelector';

const monthlyData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

const recentTransactions = [
  { id: 1, name: 'TechCorp Services', type: 'Invoice Sent', amount: '+₹45,000', status: 'Pending', date: 'Today' },
  { id: 2, name: 'AWS Cloud Hosting', type: 'Expense', amount: '-₹12,400', status: 'Completed', date: 'Yesterday' },
  { id: 3, name: 'Global Logistics', type: 'Payment Received', amount: '+₹22,000', status: 'Completed', date: 'Oct 12' },
];

const FinancialDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Financial Dashboard</h1>
      </header>

      <div className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <CompanySelector />
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           
           <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#3A565A]/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-2.5 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-100 transition-colors">
                    <IndianRupee size={24} />
                 </div>
                 <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center"><TrendingUp size={12} className="mr-1" /> +12%</span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">Total Revenue (YTD)</h3>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">₹24,50,000</p>
           </div>
           
           <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#3A565A]/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-2.5 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-100 transition-colors">
                    <Activity size={24} />
                 </div>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">Total Expenses</h3>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">₹8,90,400</p>
           </div>

           <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#3A565A]/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <Users size={24} />
                 </div>
                 <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">14 Active</span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">Outstanding Debtors</h3>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">₹4,20,000</p>
           </div>

           <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-[#3A565A]/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition-colors">
                    <FileText size={24} />
                 </div>
                 <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">3 Overdue</span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">Pending Invoices</h3>
              <p className="text-2xl md:text-3xl font-bold text-slate-800">24 Docs</p>
           </div>

        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* Main Area Chart */}
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:col-span-2">
              <h3 className="font-bold text-slate-800 mb-6">Cash Flow Overview (Mth)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                       cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Area type="monotone" name="Revenue" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" name="Expenses" dataKey="expenses" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Secondary Bar Chart (e.g. Tax / Liability breakdown) */}
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
              <h3 className="font-bold text-slate-800 mb-6">Q3 Tax Breakdown</h3>
              <div className="h-[300px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData.slice(4, 7)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="revenue" name="GST Output" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="expenses" name="GST Input" fill="#93C5FD" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

        </div>

        {/* Recent Transactions List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Recent Transactions</h3>
              <span className="text-sm font-bold text-[#3A565A] cursor-pointer hover:underline">View All</span>
           </div>
           <div>
              {recentTransactions.map((tx, idx) => (
                 <div key={tx.id} className={`p-4 md:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${idx !== recentTransactions.length -1 ? 'border-b border-slate-100' : ''}`}>
                    <div className="flex items-center space-x-4">
                       <div className={`p-3 rounded-xl ${tx.amount.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          <IndianRupee size={20} />
                       </div>
                       <div>
                          <p className="font-bold text-slate-800">{tx.name}</p>
                          <p className="text-sm text-slate-500">{tx.type} • {tx.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-slate-800'}`}>{tx.amount}</p>
                       <p className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${tx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {tx.status}
                       </p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>

    </div>
  );
};

export default FinancialDashboard;
