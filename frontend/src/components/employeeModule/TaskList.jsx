import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';

const mockTasks = [
  { 
    id: 1, 
    title: 'Compliance Audit Check', 
    deadline: 'March 20, 2025', 
    priority: 'High', 
    priorityColor: 'bg-green-500', 
    status: 'Completed',
    statusIcon: <CheckCircle2 size={16} className="text-green-500" />
  },
  { 
    id: 2, 
    title: 'Financial Report Review', 
    deadline: 'March 10, 2025', 
    priority: 'Medium', 
    priorityColor: 'bg-amber-400', 
    status: 'Pending',
    statusIcon: <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
  },
  { 
    id: 3, 
    title: 'Client VAT Reconciliation', 
    deadline: 'March 12, 2025', 
    priority: 'Low', 
    priorityColor: 'bg-blue-500', 
    status: 'Process',
    statusIcon: <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
  }
];

const TaskList = () => {
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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Task list</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-6">
        
        {/* Assigned User Mock Header */}
        <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
           <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop" 
              alt="Assigned to" 
              className="w-12 h-12 rounded-full object-cover shadow-sm bg-slate-100"
           />
           <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Assigned to</span>
              <span className="text-sm font-bold text-slate-800">Daniel Smith</span>
           </div>
        </div>

        {/* Tasks */}
        <div className="space-y-4 pt-2">
           {mockTasks.map((task) => (
             <div key={task.id} className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                
                <div className="flex items-center space-x-3 mb-4">
                   <div className="p-1.5 bg-slate-50 rounded text-slate-500 border border-slate-200">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                   </div>
                   <h3 className="font-bold text-slate-800 text-lg">{task.title}</h3>
                </div>

                <div className="space-y-3 pl-2">
                   {/* Deadline */}
                   <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 w-24">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-500">Deadline</span>
                      </div>
                      <span className="text-sm font-medium text-slate-700">{task.deadline}</span>
                   </div>

                   {/* Priority */}
                   <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 w-24">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                        <span className="text-sm text-slate-500">Priority</span>
                      </div>
                      <div className="flex items-center space-x-2">
                         <span className={`w-2 h-2 rounded-full ${task.priorityColor}`}></span>
                         <span className="text-sm font-medium text-slate-700">{task.priority}</span>
                      </div>
                   </div>

                   {/* Status */}
                   <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                         {task.statusIcon}
                         <span className="text-sm font-semibold text-slate-700">{task.status}</span>
                      </div>
                   </div>
                </div>

             </div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default TaskList;
