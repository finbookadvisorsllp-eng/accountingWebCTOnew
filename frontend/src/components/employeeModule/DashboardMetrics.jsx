import React from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';

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

const DashboardMetrics = ( {id} ) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full pb-8">
      
    

      {/* Main Content Area */}
      <div className="p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto space-y-6 lg:space-y-8">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* User Profile column */}
          <div className="flex flex-col space-y-6">
            {/* i want to make a link tap */}
            <Link to={`/employee/clients/${id}`} className="bg-white rounded-[24px] p-6 shadow-sm hover:shadow-md border border-slate-100 transition-shadow"> 
               <div className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center space-x-5">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop" 
                      alt="Daniel Smith" 
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg md:text-xl group-hover:text-[#3A565A] transition-colors">Daniel Smith</h3>
                      <p className="text-slate-500 text-sm md:text-base">Businessman</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400 group-hover:text-[#3A565A] group-hover:translate-x-1 transition-all" />
               </div>
               
               <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-slate-100 text-slate-600 text-sm md:text-base">
                  <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                     <Calendar size={18} className="text-[#3A565A]" />
                     <span className="font-medium text-slate-700">Sunday, 12 June</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                     <Clock size={18} className="text-[#3A565A]" />
                     <span className="font-medium text-slate-700">11:00 - 12:00 AM</span>
                  </div>
               </div>
            </Link>

            {/* <button className="w-full bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-[#3A565A]/30 hover:bg-slate-50 transition-all group">
              <span className="font-semibold text-slate-700 group-hover:text-[#3A565A] text-lg transition-colors">View Clients</span>
              <ChevronRight className="text-slate-400 group-hover:text-[#3A565A] group-hover:translate-x-1 transition-all" />
            </button> */}

            {/* i want to make a link tap */}
            <Link to="/employee/clients" className="w-full bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-[#3A565A]/30 hover:bg-slate-50 transition-all group">
              <span className="font-semibold text-slate-700 group-hover:text-[#3A565A] text-lg transition-colors">View Clients</span>
              <ChevronRight className="text-slate-400 group-hover:text-[#3A565A] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* 26 Days Card Column */}
          {/* i want to make a link tap */}
          <Link to="/employee/attendance" className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col justify-center">
            <div className="flex items-baseline space-x-3 mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800">26 days</h2>
              <span className="text-slate-400 text-sm md:text-base font-medium">(out of 31 days)</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm md:text-base text-slate-600">
                <span className="w-4 h-4 rounded-full bg-[#EF4444] shadow-sm shadow-red-200"></span>
                <span className="font-medium text-lg text-slate-700">5 days missed</span>
              </div>
              <div className="flex items-center space-x-3 text-sm md:text-base text-slate-600">
                <span className="w-4 h-4 rounded-full bg-[#3A565A] shadow-sm shadow-[#3A565A]/30"></span>
                <span className="font-medium text-lg text-slate-700">2 upcoming holidays</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Task Overview */}
          {/* Task Overview */}
          <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <h3 className="font-bold text-slate-800 text-xl mb-6">Task Overview</h3>
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                
                <ul className="space-y-4 text-base text-slate-600 w-full md:w-auto">
                   <li className="flex items-center space-x-3">
                     <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                     <span><span className="font-semibold text-slate-700">Completed Tasks:</span> 7</span>
                   </li>
                   <li className="flex items-center space-x-3">
                     <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                     <span><span className="font-semibold text-slate-700">Pending Tasks:</span> 3</span>
                   </li>
                   <li className="flex items-center space-x-3">
                     <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                     <span><span className="font-semibold text-slate-700">Ongoing Review:</span> 2</span>
                   </li>
                   <li className="pt-4 text-[#3A565A] font-semibold hover:text-[#2a3e41] cursor-pointer transition-colors list-none flex items-center space-x-1 group">
                     {/* i want to make a link tap */}
                     <Link to="/employee/team" className="flex items-center">
                       <span>View Detailed Report</span>
                       <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </Link>
                   </li>
                </ul>
                
                <div className="w-40 h-40 relative">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
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
                      <span className="text-2xl font-bold text-slate-800">92%</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col min-h-[300px]">
             <h3 className="font-bold text-slate-800 text-xl mb-6">Productivity</h3>
             <div className="flex-1 w-full h-full min-h-[220px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} barSize={28} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 600}} dy={10} />
                     <Tooltip 
                       cursor={{fill: '#f1f5f9'}} 
                       contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                     />
                     <Bar dataKey="completed" stackId="a" fill="#3A565A" radius={[0, 0, 6, 6]} />
                     <Bar dataKey="pending" stackId="a" fill="#719398" radius={[6, 6, 0, 0]} />
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
