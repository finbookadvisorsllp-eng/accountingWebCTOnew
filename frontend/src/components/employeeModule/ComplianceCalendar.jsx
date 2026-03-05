import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';

const mockEvents = [
  { id: 1, date: '17', day: 'TUE', title: 'Income Tax Return Filing', desc: 'Ensure timely submission to avoid penalties.', color: 'bg-[#3A565A]' },
  { id: 2, date: '22', day: 'WED', title: 'TDS Payment & Filing', desc: 'Submit tax deducted at source before the due date.', color: 'bg-[#53A0A0]' },
];

const ComplianceCalendar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <ArrowLeft 
            size={28} 
            className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
            onClick={() => navigate(`/employee/clients/${clientId}/master`)}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Compliance Calendar</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6">
        
        {/* Calendar Card UI */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col space-y-4">
           
           <div className="flex justify-between items-center text-slate-500 font-medium pb-2 border-b border-slate-100">
             <span>Select date</span>
           </div>

           <div className="flex items-center justify-between pt-2 pb-4">
             <h2 className="text-3xl font-bold text-slate-800">Mon, Aug 17</h2>
             <Edit2 size={24} className="text-slate-400 cursor-pointer" />
           </div>

           <div className="flex justify-between items-center mb-4">
             <span className="font-semibold text-slate-700">August 2025  <span className="text-xs">▼</span></span>
             <div className="flex space-x-4 text-slate-600">
                <ChevronLeft size={20} className="cursor-pointer hover:text-slate-900" />
                <ChevronRight size={20} className="cursor-pointer hover:text-slate-900" />
             </div>
           </div>

           {/* Calendar Grid */}
           <div className="grid grid-cols-7 gap-y-6 text-center text-sm">
             <div className="text-slate-400 font-medium">S</div>
             <div className="text-slate-400 font-medium">M</div>
             <div className="text-slate-400 font-medium">T</div>
             <div className="text-slate-400 font-medium">W</div>
             <div className="text-slate-400 font-medium">T</div>
             <div className="text-slate-400 font-medium">F</div>
             <div className="text-slate-400 font-medium">S</div>

             <div></div>
             <div></div>
             <div>1</div>
             <div>2</div>
             <div>3</div>
             <div>4</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border border-slate-300 text-slate-600">5</div>

             <div>6</div>
             <div>7</div>
             <div>8</div>
             <div>9</div>
             <div>10</div>
             <div>11</div>
             <div>12</div>

             <div>13</div>
             <div>14</div>
             <div>15</div>
             <div>16</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-[#3A565A] text-white font-bold shadow-md shadow-[#3a565a]/30">17</div>
             <div>18</div>
             <div>19</div>

             <div>20</div>
             <div>21</div>
             <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-full border border-slate-300 text-slate-600">22</div>
             <div>23</div>
             <div>24</div>
             <div>25</div>
             <div>26</div>

             <div>27</div>
             <div>28</div>
             <div>29</div>
             <div>30</div>
             <div>31</div>
             <div></div>
             <div></div>
           </div>
           
           <div className="flex justify-end space-x-6 pt-6 text-sm font-semibold text-slate-600">
             <span className="cursor-pointer hover:text-slate-800">Cancel</span>
             <span className="cursor-pointer text-[#3A565A]">OK</span>
           </div>
        </div>

        {/* Events List */}
        <div className="space-y-4 pt-4">
           {mockEvents.map(event => (
              <div 
                key={event.id}
                onClick={() => navigate(`/employee/clients/${clientId}/master/compliance/detail`)}
                className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-[#3A565A]/40 transition-all flex items-center space-x-4 cursor-pointer group"
              >
                 <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform ${event.color}`}>
                    <span className="text-xl font-bold leading-none">{event.date}</span>
                    <span className="text-[10px] font-semibold tracking-wider mt-1">{event.day}</span>
                 </div>
                 
                 <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#3A565A] transition-colors">{event.title}</h3>
                    <p className="text-slate-500 text-sm mt-1 leading-snug">{event.desc}</p>
                 </div>
              </div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default ComplianceCalendar;
