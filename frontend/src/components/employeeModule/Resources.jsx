import React, { useState } from 'react';
import { ChevronDown, Play, FileText } from 'lucide-react';

const mockInsights = [
  { id: 1, title: 'Stay informed on the latest financial...', date: 'October 4 2021', readTime: '3 min read', 
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=200&auto=format&fit=crop' },
  { id: 2, title: 'Stay informed on the latest financial...', date: 'October 4 2021', readTime: '3 min read', 
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=200&auto=format&fit=crop' },
  { id: 3, title: 'Stay informed on the latest financial...', date: 'October 4 2021', readTime: '3 min read', 
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=200&auto=format&fit=crop' },
  { id: 4, title: 'Stay informed on the latest financial...', date: 'October 4 2021', readTime: '3 min read', 
    img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=200&auto=format&fit=crop' },
];

const mockFAQs = [
  { id: 'f1', question: 'What are the key tax deadlines?', snippet: 'Check with your local tax authority for filing dates...' },
  { id: 'f2', question: 'How can I reduce my taxable income legally?', snippet: 'Use deductions, tax credits, business expenses...' },
  { id: 'f3', question: 'What financial documents should for tax filing?', snippet: 'Keep income statements, receipts, tax forms, bank...' },
  { id: 'f4', question: 'How do I stay with financial regulations?', snippet: 'Stay updated on new tax laws, maintain accurate...' },
];

const Resources = ({ onMenuClick }) => {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full pb-8">

      {/* Main Content Area */}
      <div className="p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Left Column: Research & Updates */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
           <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Research & Updates</h2>
           
           <h3 className="font-bold text-slate-700 mb-4 text-lg">Latest Tax & Accounting Insights</h3>
           
           {/* Featured Article */}
           <div className="mb-8 cursor-pointer group">
              <div className="rounded-2xl overflow-hidden mb-4 relative aspect-[16/9] shadow-sm">
                 <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop" alt="Finance insight" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 {/* Dark overlay for contrast if needed */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              <p className="text-slate-700 font-medium group-hover:text-[#3A565A] transition-colors mb-2 line-clamp-2">Discover expert insights and the latest updates on tax regulations, make informed decisions for your business</p>
              <p className="text-sm text-slate-400">October 4 2021 • 3 min read</p>
           </div>

           <h3 className="font-bold text-slate-700 mb-4 text-lg">Latest Financial Regulations</h3>
           
           <div className="space-y-4">
              {mockInsights.map((insight) => (
                 <div key={insight.id} className="flex items-center space-x-4 cursor-pointer group">
                    <img src={insight.img} alt={insight.title} className="w-20 h-14 rounded-lg object-cover ring-1 ring-slate-100 shadow-sm group-hover:shadow-md transition-shadow" />
                    <div>
                        <p className="text-sm font-medium text-slate-700 group-hover:text-[#3A565A] transition-colors line-clamp-2 leading-snug mb-1">{insight.title}</p>
                        <p className="text-xs text-slate-400">{insight.date} • {insight.readTime}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Right Column: Knowledge Base */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
           <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Knowledge Base</h2>
           
           <h3 className="font-bold text-slate-700 mb-4 text-lg">Training & Learning Resources</h3>
           
           {/* Pills */}
           <div className="flex flex-wrap gap-2 mb-6">
              <div className="bg-[#598489] text-white px-4 py-1.5 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-[#3A565A] transition-colors">
                 <span className="text-sm font-medium">ChatGPT</span>
                 <span className="text-[10px] text-white/80">4M+ learners</span>
              </div>
              <div className="bg-[#598489] text-white px-4 py-1.5 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-[#3A565A] transition-colors">
                 <span className="text-sm font-medium">Data Science</span>
                 <span className="text-[10px] text-white/80">7M+ learners</span>
              </div>
              <div className="bg-[#598489] text-white px-4 py-1.5 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-[#3A565A] transition-colors">
                 <span className="text-sm font-medium">Python</span>
                 <span className="text-[10px] text-white/80">47M+ learners</span>
              </div>
           </div>

           {/* Video Cards Grid */}
           <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="cursor-pointer group">
                 <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-slate-900 shadow-sm group-hover:shadow-md transition-all">
                    <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&auto=format&fit=crop" alt="Video 1" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-x-2 bottom-2">
                       <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"><Play size={14} className="text-white ml-0.5" /></div>
                    </div>
                 </div>
                 <p className="text-xs text-slate-600 line-clamp-3 leading-snug text-center">Learn how to leverage ChatGPT automation, content creation, and growth.</p>
              </div>
              <div className="cursor-pointer group">
                 <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-slate-900 shadow-sm group-hover:shadow-md transition-all">
                    <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop" alt="Video 2" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-x-2 bottom-2">
                       <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"><Play size={14} className="text-white ml-0.5" /></div>
                    </div>
                 </div>
                 <p className="text-xs text-slate-600 line-clamp-3 leading-snug text-center">Build expertise in analytic machine learning, and real-world data applications.</p>
              </div>
           </div>

           <h3 className="font-bold text-slate-700 mb-4 text-lg">Finance & Tax FAQs</h3>
           <p className="text-sm text-slate-500 mb-6">Get answers to common finance and tax questions. Stay updated on regulations and best accounting practices.</p>
           
           {/* FAQs Accordion */}
           <div className="space-y-4">
              {mockFAQs.map((faq) => (
                 <div key={faq.id} className="flex gap-4 group">
                    <div className="shrink-0 mt-1">
                       <div className="w-8 h-8 rounded-lg bg-[#598489] text-white flex items-center justify-center shadow-sm">
                          <FileText size={16} />
                       </div>
                    </div>
                    <div className="flex-1 cursor-pointer" onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}>
                       <div className="flex items-start justify-between">
                          <h4 className="font-medium text-slate-800 text-sm group-hover:text-[#3A565A] pr-4">{faq.question}</h4>
                          <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${openFAQ === faq.id ? 'rotate-180' : ''}`} />
                       </div>
                       {openFAQ === faq.id ? (
                          <p className="text-sm text-slate-500 mt-2 pr-4">{faq.snippet}</p>
                       ) : (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 pr-4">{faq.snippet}</p>
                       )}
                    </div>
                 </div>
              ))}
           </div>

        </div>

      </div>
    </div>
  );
};

export default Resources;
