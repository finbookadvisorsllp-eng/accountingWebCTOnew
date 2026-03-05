import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const mockHistory = [
  { id: 1, date: '01', day: 'TUE', color: 'bg-[#76B055]', checkIn: '09:08 AM', checkOut: '06:05 PM', total: '08:13' },
  { id: 2, date: '02', day: 'WED', color: 'bg-[#71203A]', checkIn: '09:08 AM', checkOut: '06:05 PM', total: '08:13' },
  { id: 3, date: '03', day: 'THU', color: 'bg-[#DE7F5A]', checkIn: '09:08 AM', checkOut: '06:05 PM', total: '08:13' },
  { id: 4, date: '04', day: 'FRI', color: 'bg-[#215E4C]', checkIn: '09:08 AM', checkOut: '06:05 PM', total: '08:13' },
  { id: 5, date: '05', day: 'SAT', color: 'bg-[#E56A00]', checkIn: '09:08 AM', checkOut: '06:05 PM', total: '08:13' },
  { id: 6, date: '06', day: 'MON', color: 'bg-[#3A565A]', checkIn: '09:08 AM', checkOut: '06:05 PM', total: '08:13' },
];

const CheckInCheckOut = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Check-in & Check-out</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6">
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <button className="bg-[#3A565A] text-white rounded-xl py-4 font-bold text-lg shadow-md hover:bg-[#2a3e41] transition-colors">
              Check-in
           </button>
           <button className="bg-white text-slate-800 border-2 border-slate-200 rounded-xl py-4 font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
              Check-out
           </button>
        </div>

        {/* Past History Header */}
        <div>
           <h2 className="text-lg font-bold text-slate-800 mb-4">Past History</h2>
           
           {/* History List */}
           <div className="space-y-4">
              {mockHistory.map((item) => (
                 <div key={item.id} className="bg-white rounded-[20px] p-2 md:p-3 shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                    
                    {/* Date Block */}
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex flex-col items-center justify-center text-white ${item.color}`}>
                       <span className="text-xl md:text-2xl font-bold leading-none">{item.date}</span>
                       <span className="text-[10px] md:text-xs font-semibold tracking-wider mt-0.5">{item.day}</span>
                    </div>

                    {/* Check In */}
                    <div className="flex flex-col flex-1 pl-4 md:pl-6">
                       <span className="font-bold text-slate-800 text-sm md:text-base">{item.checkIn}</span>
                       <span className="text-xs text-slate-500 font-medium">Check In</span>
                    </div>

                    {/* Check Out */}
                    <div className="flex flex-col flex-1">
                       <span className="font-bold text-slate-800 text-sm md:text-base">{item.checkOut}</span>
                       <span className="text-xs text-slate-500 font-medium">Check Out</span>
                    </div>

                    {/* Total Hours */}
                    <div className="flex flex-col flex-1 text-right pr-2 md:pr-4">
                       <span className="font-bold text-slate-800 text-sm md:text-base">{item.total}</span>
                       <span className="text-xs text-slate-500 font-medium">Total Hours</span>
                    </div>

                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default CheckInCheckOut;
