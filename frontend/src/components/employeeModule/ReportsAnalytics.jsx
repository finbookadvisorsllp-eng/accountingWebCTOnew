import React from 'react';
import { Download, BarChart2, TrendingUp, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const reportsList = [
  { id: 1, name: 'Q3 Annual Fiscal Aggregation', date: 'Oct 15, 2024', type: 'PDF', size: '2.4 MB' },
  { id: 2, name: 'Systemwide GST Liability Map', date: 'Oct 08, 2024', type: 'XLSX', size: '5.1 MB' },
  { id: 3, name: 'Client Registration Growth', date: 'Oct 01, 2024', type: 'PDF', size: '1.2 MB' },
  { id: 4, name: 'Outstanding Debtors Master List', date: 'Sep 25, 2024', type: 'CSV', size: '8.4 MB' },
];

const revenueMockData = [
  { name: 'Direct Income', value: 400 },
  { name: 'Capital Gains', value: 300 },
  { name: 'Consulting Fees', value: 300 },
  { name: 'Other Income', value: 200 },
];
const COLORS = ['#3A565A', '#6DA4A4', '#91C765', '#F97369'];

const ReportsAnalytics = ({ onMenuClick }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full pb-8">

      {/* Main Content Area */}
      <div className="p-4 md:p-8 lg:p-10 w-full max-w-6xl mx-auto space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><BarChart2 size={24} /></div>
              <div>
                 <p className="text-slate-500 text-sm mb-1 font-medium">Total Reports Generated</p>
                 <p className="text-2xl font-bold text-slate-800">1,248</p>
              </div>
           </div>
           
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#6DA4A4]/10 text-[#3A565A] flex items-center justify-center"><TrendingUp size={24} /></div>
              <div>
                 <p className="text-slate-500 text-sm mb-1 font-medium">Client Conversion Rate</p>
                 <p className="text-2xl font-bold text-slate-800">18.4% <span className="text-sm text-green-500 ml-1">↑</span></p>
              </div>
           </div>
           
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><DollarSign size={24} /></div>
              <div>
                 <p className="text-slate-500 text-sm mb-1 font-medium">System Revenue Managed</p>
                 <p className="text-2xl font-bold text-slate-800">₹42.5M</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
           
           {/* Chart */}
           <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 text-lg">Revenue Distribution</h3>
              <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={revenueMockData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {revenueMockData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                       <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Reports List */}
           <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <h3 className="font-bold text-slate-800 text-lg">Available Reports</h3>
                 <button className="text-sm font-bold text-[#3A565A] hover:underline">View Archive</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                 {reportsList.map((report, idx) => (
                    <div key={report.id} className={`p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer ${idx !== reportsList.length - 1 ? 'border-b border-slate-100' : ''}`}>
                       <div className="flex items-center space-x-4 truncate pr-4">
                          <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm
                             ${report.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}
                          `}>
                             {report.type}
                          </div>
                          <div className="truncate">
                             <p className="font-bold text-slate-700 group-hover:text-[#3A565A] transition-colors truncate mb-0.5">{report.name}</p>
                             <p className="text-xs text-slate-400 font-medium">Generated: {report.date} • {report.size}</p>
                          </div>
                       </div>
                       
                       <button className="shrink-0 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#3A565A] group-hover:border-[#3A565A] transition-all bg-white shadow-sm">
                          <Download size={18} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default ReportsAnalytics;
