import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ArrowRight, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const mockChartData = [
  { name: 'Jan', sales: 90, output: 40 },
  { name: 'Feb', sales: 80, output: 35 },
  { name: 'Mar', sales: 75, output: 52 },
  { name: 'Apr', sales: 45, output: 50 },
  { name: 'May', sales: 60, output: 45 },
  { name: 'Jun', sales: 42, output: 25 }
];

const monthsFull = ['April', 'May', 'June', 'Jul', 'August', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March'];
const monthsInput = ['April', 'May', 'June', 'Jul', 'August', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March'];
const years = ['2022-2023', '2023-2024', '2024-2025', '2025-2026'];

const GSTCalculation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  const [activeTab, setActiveTab] = useState('OutputInput'); // 'OutputInput' | 'InputCFLiability'
  const [showChart, setShowChart] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderTableThreeCol = (title) => (
    <div className="border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        <div className="flex space-x-2 text-slate-500">
          <button className="p-1 hover:bg-slate-100 rounded transition-colors"><ChevronLeft size={20} /></button>
          <button className="p-1 hover:bg-slate-100 rounded transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm text-left text-slate-600 min-w-[350px]">
          <thead className="bg-slate-100/80 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 font-semibold border-r border-slate-200 text-center w-1/4">Month</th>
              <th className="py-3 px-4 font-semibold border-r border-slate-200 text-center bg-slate-100/50 w-1/4">2023-24</th>
              <th className="py-3 px-4 font-semibold border-r border-slate-200 text-center bg-slate-100 w-1/4">2024-25</th>
              <th className="py-3 px-4 font-semibold text-center bg-slate-100/50 w-1/4">2025-26</th>
            </tr>
          </thead>
          <tbody>
            {monthsFull.map(m => (
              <tr key={m} className="border-b border-slate-100 bg-white">
                <td className="py-2.5 px-4 border-r border-slate-200 font-medium text-slate-700">{m}</td>
                <td className="py-2.5 px-4 border-r border-slate-200"></td>
                <td className="py-2.5 px-4 border-r border-slate-200"></td>
                <td className="py-2.5 px-4"></td>
              </tr>
            ))}
            <tr className="bg-slate-50 border-t border-slate-200">
              <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">Total</td>
              <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200 text-right">0</td>
              <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200 text-right">0</td>
              <td className="py-3 px-4 font-bold text-slate-800 text-right">0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTableFiveCol = (title) => (
    <div className="border border-slate-200 bg-white shadow-sm overflow-hidden mb-8">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
      </div>
      {selectedYear && (
          <div className="py-2 border-b border-slate-200 text-center bg-white font-bold text-slate-800">
            {selectedYear}
          </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm text-center text-slate-600 min-w-[400px]">
          <thead className="bg-slate-100/80 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-2 font-semibold border-r border-slate-200 bg-slate-100">Month</th>
              <th className="py-3 px-2 font-semibold border-r border-slate-200">CGST</th>
              <th className="py-3 px-2 font-semibold border-r border-slate-200 bg-slate-100/50">SGST</th>
              <th className="py-3 px-2 font-semibold border-r border-slate-200">IGST</th>
              <th className="py-3 px-2 font-semibold bg-slate-100">Cess</th>
            </tr>
          </thead>
          <tbody>
            {monthsInput.map(m => (
              <tr key={m} className="border-b border-slate-100 bg-white">
                <td className="py-2.5 px-2 border-r border-slate-200 font-medium text-slate-700 bg-slate-50/30">{m}</td>
                <td className="py-2.5 px-2 border-r border-slate-200">{selectedYear ? '25,690' : ''}</td>
                <td className="py-2.5 px-2 border-r border-slate-200">{selectedYear ? '25,690' : ''}</td>
                <td className="py-2.5 px-2 border-r border-slate-200">{selectedYear ? '25,690' : ''}</td>
                <td className="py-2.5 px-2">{selectedYear ? '25,690' : ''}</td>
              </tr>
            ))}
            <tr className="bg-slate-50 border-t border-slate-200">
              <td className="py-3 px-2 font-bold text-slate-800 border-r border-slate-200">Total</td>
              <td className="py-3 px-2 font-bold text-slate-700 border-r border-slate-200">{selectedYear ? '25,690' : ''}</td>
              <td className="py-3 px-2 font-bold text-slate-700 border-r border-slate-200">{selectedYear ? '25,690' : ''}</td>
              <td className="py-3 px-2 font-bold text-slate-700 border-r border-slate-200">{selectedYear ? '25,690' : ''}</td>
              <td className="py-3 px-2 font-bold text-slate-700">{selectedYear ? '25,690' : ''}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => {
            if (showChart) setShowChart(false);
            else navigate(`/employee/clients/${clientId}/reports`);
          }}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">GST Calculations</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-4xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Toggle Pills - only show if not in chart view */}
        {!showChart && (
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
            <button 
              className={`flex-1 py-3 px-4 text-sm md:text-sm font-semibold rounded-xl transition-all border ${activeTab === 'OutputInput' ? 'bg-[#3A565A] text-white border-[#3A565A] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              onClick={() => setActiveTab('OutputInput')}
            >
              GST Output / Input
            </button>
            <button 
              className={`flex-1 py-3 px-4 text-sm md:text-sm font-semibold rounded-xl transition-all border ${activeTab === 'InputCFLiability' ? 'bg-[#3A565A] text-white border-[#3A565A] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              onClick={() => setActiveTab('InputCFLiability')}
            >
              GST Input C/F And Liability paid
            </button>
          </div>
        )}

        {/* Tab 1: Output / Input */}
        {activeTab === 'OutputInput' && !showChart && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {renderTableThreeCol("GST Output")}

            {/* Comparison Button */}
            <div 
              className="border border-slate-200 rounded-xl bg-white p-4 flex justify-between items-center cursor-pointer hover:border-[#3A565A] hover:shadow-sm transition-all group my-6"
              onClick={() => setShowChart(true)}
            >
              <span className="font-semibold text-slate-800 text-sm md:text-base group-hover:text-[#3A565A] transition-colors">
                Comparision b/w Sales and GST Output
              </span>
              <ArrowRight size={20} className="text-slate-400 group-hover:text-[#3A565A] group-hover:translate-x-1 transition-all" />
            </div>

            {renderTableThreeCol("GST Input")}
          </div>
        )}

        {/* Chart View (Sub-view of OutputInput) */}
        {activeTab === 'OutputInput' && showChart && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Comparision b/w Sales and GST Output</h2>
            
            <div className="border border-slate-200 rounded-xl bg-white p-4 mb-6 shadow-sm">
              <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3">
                <ChevronLeft size={20} className="text-slate-500 cursor-pointer hover:text-slate-800" />
                <span className="font-bold text-slate-800">2024-25</span>
                <ChevronRight size={20} className="text-slate-500 cursor-pointer hover:text-slate-800" />
              </div>

              <div className="mt-8 h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockChartData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }} barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{fontSize: 12, fill: '#475569', fontWeight: 600}} />
                    <YAxis axisLine={true} tickLine={false} tick={{fontSize: 12, fill: '#475569'}} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#475569', paddingTop: '20px' }} verticalAlign="top" align="right" />
                    <Bar dataKey="sales" name="Total Sales" fill="#6DA4A4" radius={[2, 2, 0, 0]} barSize={12} />
                    <Bar dataKey="output" name="GST Output" fill="#A0B8B8" radius={[2, 2, 0, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Input C/F And Liability paid */}
        {activeTab === 'InputCFLiability' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Year Dropdown */}
            <div className="relative mb-6" ref={dropdownRef}>
              <div 
                className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex items-center justify-between cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              >
                <span className={`font-semibold ${selectedYear ? 'text-slate-800' : 'text-slate-500'}`}>
                  {selectedYear || 'Financial Year Selection'}
                </span>
                <ChevronDown size={20} className={`text-slate-500 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isYearDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2 flex flex-col overflow-hidden">
                  {years.map(year => (
                    <div 
                      key={year}
                      className={`px-5 py-3 hover:bg-slate-50 cursor-pointer font-medium border-b border-slate-50 last:border-0 ${selectedYear === year ? 'text-[#3A565A] bg-slate-50' : 'text-slate-700'}`}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsYearDropdownOpen(false);
                      }}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {renderTableFiveCol("GST Input C/F")}
            {renderTableFiveCol("GST Liability Paid")}

          </div>
        )}

      </div>
    </div>
  );
};

export default GSTCalculation;
