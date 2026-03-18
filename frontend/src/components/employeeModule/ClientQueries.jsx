import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Plus, Clock, CheckCircle2, Search, Filter } from 'lucide-react';
import CompanySelector from './CompanySelector';

const mockQueries = [
  { id: 'Q-1042', subject: 'Discrepancy in Q2 GST Filing', status: 'Open', date: 'Oct 24, 2024', replies: 2, excerpt: 'I noticed the SGST amount seems lower than expected on the recent Q2...' },
  { id: 'Q-1041', subject: 'Requesting updated Balance Sheet', status: 'Resolved', date: 'Oct 20, 2024', replies: 4, excerpt: 'Could you please forward the finalized balance sheet for last month?' },
  { id: 'Q-1039', subject: 'Adding new vendor to Master', status: 'Resolved', date: 'Oct 15, 2024', replies: 1, excerpt: 'We have a new local supplier, attaching their KYC details here.' },
  { id: 'Q-1038', subject: 'Explanation of TDS Dedcution on Invoice #442', status: 'Open', date: 'Oct 12, 2024', replies: 0, excerpt: 'Can someone clarify the TDS deduction percentage applied to...' },
];

const ClientQueries = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  const [activeFilter, setActiveFilter] = useState('All');

  const filteredQueries = activeFilter === 'All' 
     ? mockQueries 
     : mockQueries.filter(q => q.status === activeFilter);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Client Queries</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-4xl mx-auto space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <CompanySelector />
        
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           
           <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
               {['All', 'Open', 'Resolved'].map(filter => (
                  <button 
                     key={filter}
                     onClick={() => setActiveFilter(filter)}
                     className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === filter ? 'bg-[#3A565A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                     {filter}
                  </button>
               ))}
           </div>

           <div className="flex items-center space-x-3">
              <div className="relative flex-1 md:w-64">
                 <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="Search queries..." 
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#3A565A] focus:ring-1 focus:ring-[#3A565A] transition-all"
                 />
              </div>
              <button className="bg-[#3A565A] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#2a3e41] hover:-translate-y-0.5 transition-all flex items-center shrink-0">
                 <Plus size={18} className="mr-1.5" />
                 New Query
              </button>
           </div>
        </div>

        {/* Queries List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           {filteredQueries.length > 0 ? (
               filteredQueries.map((query, index) => (
                  <div 
                     key={query.id} 
                     className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 ${index !== filteredQueries.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1.5">
                           <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{query.id}</span>
                           <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#3A565A] transition-colors truncate">{query.subject}</h3>
                        </div>
                        <p className="text-slate-500 text-sm line-clamp-1">{query.excerpt}</p>
                        
                        <div className="flex items-center space-x-4 mt-3 text-xs font-medium text-slate-400">
                           <span className="flex items-center"><Clock size={14} className="mr-1" /> {query.date}</span>
                           <span className="flex items-center"><MessageSquare size={14} className="mr-1" /> {query.replies} Replies</span>
                        </div>
                     </div>
                     
                     <div className="shrink-0 flex items-center md:flex-col md:items-end md:justify-center justify-between">
                        <span className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${query.status === 'Open' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                           {query.status === 'Open' ? <Clock size={12} className="mr-1.5" /> : <CheckCircle2 size={12} className="mr-1.5" />}
                           {query.status}
                        </span>
                     </div>
                  </div>
               ))
           ) : (
               <div className="p-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                     <Filter size={24} className="text-slate-400" />
                  </div>
                  <h3 className="font-bold text-slate-700 mb-1">No queries found</h3>
                  <p className="text-slate-500 text-sm">There are no {activeFilter.toLowerCase()} queries matching your criteria.</p>
               </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default ClientQueries;
