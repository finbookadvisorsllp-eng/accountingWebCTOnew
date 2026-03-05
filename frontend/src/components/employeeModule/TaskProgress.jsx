import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle2, Clock, CalendarDays } from 'lucide-react';

const tasks = [
  { id: 1, name: 'Compliance Audit Check', status: 'Pending', color: 'text-red-500' },
  { id: 2, name: 'Financial Report Review', status: 'Completed', color: 'text-green-500' },
  { id: 3, name: 'Client VAT Reconciliation', status: 'Process', color: 'text-blue-500' },
  { id: 4, name: 'Compliance Audit Check', status: 'Pending', color: 'text-red-500' },
  { id: 5, name: 'Financial Report Review', status: 'Completed', color: 'text-green-500' },
  { id: 6, name: 'Client VAT Reconciliation', status: 'Process', color: 'text-blue-500' },
  { id: 7, name: 'Financial Report Review', status: 'Completed', color: 'text-green-500' },
  { id: 8, name: 'Client VAT Reconciliation', status: 'Process', color: 'text-blue-500' },
  { id: 9, name: 'Compliance Audit Check', status: 'Pending', color: 'text-red-500' },
  { id: 10, name: 'Financial Report Review', status: 'Completed', color: 'text-green-500' },
];

const TaskProgress = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}/financial`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Task Progress</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-4 pt-6">
        
        {/* Sub Header */}
        <div className="flex items-center justify-between px-4 pb-2">
            <h3 className="font-bold text-slate-700">Task Name</h3>
            <h3 className="font-bold text-slate-700">Status</h3>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {tasks.map((task, index) => (
                <div 
                    key={task.id} 
                    className={`flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer ${index !== tasks.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                    {/* Left Icon & Name */}
                    <div className="flex items-center space-x-3 w-2/3">
                        {task.status === 'Completed' ? (
                            <CheckCircle2 size={18} className="text-slate-400 shrink-0" />
                        ) : task.status === 'Pending' ? (
                            <CalendarDays size={18} className="text-slate-400 shrink-0" />
                        ) : (
                            <Clock size={18} className="text-slate-400 shrink-0" />
                        )}
                        <span className="text-slate-700 text-sm md:text-base font-medium truncate">{task.name}</span>
                    </div>

                    {/* Right Status & Arrow */}
                    <div className="flex items-center space-x-2 shrink-0">
                        <div className="flex items-center justify-end space-x-1 w-[80px]">
                            <div className={`w-1.5 h-1.5 rounded-full ${task.color} ${task.color.replace('text-', 'bg-')}`} />
                            <span className={`text-xs md:text-sm font-bold ${task.color}`}>{task.status}</span>
                        </div>
                        <ChevronRight size={18} className="text-slate-300" />
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default TaskProgress;
