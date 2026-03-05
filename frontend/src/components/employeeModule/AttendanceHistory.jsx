import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const attendanceData = [
  { id: 1, dateLabel: '06 TUE', dateClass: 'bg-[#91C765] text-white', checkIn: '09:08 AM', checkOut: '06:05 PM', total: '08:13'} ,
  { id: 2, dateLabel: '07 WED', dateClass: 'bg-[#567E82] text-white', checkIn: '09:08 AM', checkOut: '06:05 PM', total: '08:13'} ,
  { id: 3, dateLabel: '08 THU', dateClass: 'bg-[#91C765] text-white', checkIn: '09:08 AM', checkOut: '06:05 PM', total: '08:13'} ,
  { id: 4, dateLabel: '09 FRI', dateClass: 'bg-[#567E82] text-white', checkIn: '09:08 AM', checkOut: '06:05 PM', total: '08:13'} ,
];

const AttendanceHistory = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full pb-8">

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-xl mx-auto pt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-200">
           <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center md:text-left">Attendance History</h2>

           {/* Interactive Calendar Section */}
           <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-medium text-slate-700">December 2024</h3>
                 <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"><ChevronLeft size={16} className="text-slate-500" /></div>
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"><ChevronRight size={16} className="text-slate-500" /></div>
                 </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
                 <div className="text-slate-400 font-medium">S</div>
                 <div className="text-slate-400 font-medium">M</div>
                 <div className="text-slate-400 font-medium">T</div>
                 <div className="text-slate-400 font-medium">W</div>
                 <div className="text-slate-400 font-medium">T</div>
                 <div className="text-slate-400 font-medium">F</div>
                 <div className="text-slate-400 font-medium">S</div>

                 {/* Mocked days to match the design (starting on Sun 27th prev month) */}
                 <div className="text-slate-300">27</div>
                 <div className="text-slate-300">28</div>
                 <div className="text-slate-300">29</div>
                 <div className="text-slate-300">30</div>
                 <div className="text-slate-700 font-medium">1</div>
                 <div className="text-slate-700 font-medium">2</div>
                 <div className="text-slate-700 font-medium">3</div>

                 <div className="text-slate-700 font-medium">4</div>
                 <div className="text-slate-700 font-medium">5</div>
                 <div className="mx-auto w-8 h-8 rounded-full bg-[#3A565A] text-white flex items-center justify-center font-bold shadow-sm">6</div>
                 <div className="text-slate-700 font-medium">7</div>
                 <div className="text-slate-700 font-medium">8</div>
                 <div className="text-slate-700 font-medium">9</div>
                 <div className="text-slate-700 font-medium">10</div>

                 <div className="text-slate-700 font-medium bg-slate-100 rounded-md py-1 -my-1">11</div>
                 <div className="text-slate-700 font-medium bg-slate-100 rounded-md py-1 -my-1">12</div>
                 <div className="text-slate-700 font-medium bg-slate-100 rounded-md py-1 -my-1">13</div>
                 <div className="text-slate-700 font-medium bg-slate-100 rounded-md py-1 -my-1">14</div>
                 <div className="mx-auto w-8 h-8 rounded-full bg-[#3A565A] text-white flex items-center justify-center font-bold shadow-sm">15</div>
                 <div className="text-slate-700 font-medium">16</div>
                 <div className="text-slate-700 font-medium">17</div>

                 <div className="text-slate-700 font-medium">18</div>
                 <div className="text-slate-700 font-medium">19</div>
                 <div className="text-slate-700 font-medium">20</div>
                 <div className="text-slate-700 font-medium">21</div>
                 <div className="text-slate-700 font-medium">22</div>
                 <div className="text-slate-700 font-medium">23</div>
                 <div className="text-slate-700 font-medium">24</div>

                 <div className="text-slate-700 font-medium">25</div>
                 <div className="text-slate-700 font-medium">26</div>
                 <div className="text-slate-700 font-medium">27</div>
                 <div className="text-slate-700 font-medium">28</div>
                 <div className="text-slate-700 font-medium">29</div>
                 <div className="text-slate-700 font-medium">30</div>
                 <div className="text-slate-700 font-medium">31</div>
              </div>
           </div>

           {/* Divider */}
           <div className="h-px bg-slate-100 w-full mb-8"></div>

           {/* List of Attendances */}
           <div className="space-y-4">
              {attendanceData.map((item) => (
                 <div key={item.id} className="flex items-center justify-between border border-slate-200 rounded-xl p-3 hover:shadow-sm transition-shadow bg-white">
                    <div className={`w-14 items-center justify-center flex flex-col rounded-lg py-2 ${item.dateClass}`}>
                       <span className="font-bold text-lg leading-none">{item.dateLabel.split(' ')[0]}</span>
                       <span className="text-[10px] font-medium tracking-wide">{item.dateLabel.split(' ')[1]}</span>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-around px-2 text-center">
                       <div>
                          <p className="font-bold text-slate-800 text-sm">{item.checkIn}</p>
                          <p className="text-[10px] text-slate-400">Check In</p>
                       </div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm">{item.checkOut}</p>
                          <p className="text-[10px] text-slate-400">Check Out</p>
                       </div>
                    </div>

                    <div className="text-center pr-2 border-l border-slate-100 pl-4 w-24">
                       <p className="font-bold text-slate-800 text-sm">{item.total}</p>
                       <p className="text-[10px] text-slate-400">Total Hours</p>
                    </div>
                 </div> 
              ))}
           </div>
           
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
