import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const mockTeams = [
  { id: 1, name: 'Rahul Sharma (Client)', completed: 6, process: 2, pending: 3 },
  { id: 2, name: 'Neha Patel (Corporate Client)', completed: 6, process: 2, pending: 3 },
  { id: 3, name: 'Sanjay Gupta (Vendor)', completed: 6, process: 2, pending: 3 },
];

const TeamManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Main Content Area */}
      <div className="p-4 md:p-8 lg:p-10 w-full max-w-4xl mx-auto space-y-6 pt-6 md:pt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Teams List */}
        {mockTeams.map((team) => (
          <div 
            key={team.id}
            className="bg-slate-50/50 rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100 flex flex-col gap-4 md:gap-5"
          >
            {/* Header part */}
            <div 
              className="bg-[#486769] rounded-xl p-4 md:p-5 flex items-center justify-between shadow-sm cursor-pointer group"
              onClick={() => navigate(`/employee/team/${team.id}`)}
            >
              <h3 className="font-semibold text-white text-lg md:text-xl tracking-wide">{team.name}</h3>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                 <ArrowRight size={20} className="text-[#486769]" />
              </div>
            </div>
            
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-white border text-slate-700 border-slate-200 rounded-lg py-2.5 md:py-3 text-center shadow-sm">
                <span className="text-sm md:text-base font-medium">{team.completed} Completed</span>
              </div>
              <div className="bg-white border text-slate-700 border-slate-200 rounded-lg py-2.5 md:py-3 text-center shadow-sm">
                <span className="text-sm md:text-base font-medium">{team.process} Process</span>
              </div>
              <div className="bg-white border text-slate-700 border-slate-200 rounded-lg py-2.5 md:py-3 text-center shadow-sm">
                <span className="text-sm md:text-base font-medium">{team.pending} Pending</span>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default TeamManagement;
