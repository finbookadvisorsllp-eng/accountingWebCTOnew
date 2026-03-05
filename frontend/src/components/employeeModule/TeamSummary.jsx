import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Edit } from 'lucide-react';

const mockTasks = [
  { id: 101, title: 'GST Return Filing Issue', assignedBy: 'Ankit Verma (Tax Consultant)', dueDate: '02/07/2025', status: 'Pending' },
  { id: 102, title: 'GST Return Filing Issue', assignedBy: 'Neha Patel (Senior Auditor)', dueDate: '02/07/2025', status: 'Status' },
  { id: 103, title: 'GST Return Filing Issue', assignedBy: 'Vishal Mehra (Finance Manager)', dueDate: '02/07/2025', status: 'Status' },
];

const StatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = ['Complete', 'Pending', 'Process'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#486769] text-white px-4 py-1.5 md:px-5 md:py-2 flex items-center justify-between rounded-lg min-w-[120px] md:min-w-[140px] shadow-sm text-sm font-medium focus:outline-none"
      >
        {value === 'Status' ? 'Status' : value}
        <ChevronDown size={16} className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden text-left flex flex-col">
          {options.map((option) => (
            <div 
              key={option}
              className={`px-4 py-2 text-sm text-center cursor-pointer hover:bg-slate-100 ${value === option ? 'bg-slate-200 font-medium' : 'text-slate-700'}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TeamSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tasks, setTasks] = useState(mockTasks);
  const [globalStatus, setGlobalStatus] = useState('Select Status');
  const [isGlobalDropdownOpen, setIsGlobalDropdownOpen] = useState(false);
  const globalDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (globalDropdownRef.current && !globalDropdownRef.current.contains(event.target)) {
        setIsGlobalDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header Area */}
      <div className="px-5 py-6 md:px-10 md:py-8 sticky top-0 bg-white z-10 border-b border-slate-100 flex items-center gap-4">
        <ArrowLeft 
          size={30} 
          className="text-[#486769] cursor-pointer bg-slate-100 p-1.5 rounded-full hover:bg-slate-200 transition-colors" 
          onClick={() => navigate('/employee/team')}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Team summary</h1>
      </div>

      <div className="p-4 md:p-8 lg:p-10 w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Global Select Status Dropdown */}
        <div className="relative" ref={globalDropdownRef}>
          <div 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer shadow-sm hover:bg-slate-100 transition-colors"
            onClick={() => setIsGlobalDropdownOpen(!isGlobalDropdownOpen)}
          >
            <span className="text-lg font-medium text-slate-700">{globalStatus}</span>
            <ChevronDown size={24} className={`text-[#486769] transition-transform ${isGlobalDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isGlobalDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 w-full md:w-[250px] bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2 flex flex-col">
              <div 
                className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 text-center font-medium"
                onClick={() => { setGlobalStatus('Complete'); setIsGlobalDropdownOpen(false); }}
              >
                Complete
              </div>
              <div className="my-1.5 bg-slate-200 h-[32px] flex items-center justify-center cursor-pointer text-slate-700 text-center mx-4 rounded-md shadow-inner font-medium hover:bg-slate-300 transition-colors"
                onClick={() => { setGlobalStatus('Pending'); setIsGlobalDropdownOpen(false); }}
              >
                Pending
              </div>
              <div 
                className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 text-center font-medium"
                onClick={() => { setGlobalStatus('Process'); setIsGlobalDropdownOpen(false); }}
              >
                Process
              </div>
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border border-slate-200 rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition-shadow relative">
               
               <div className="flex flex-col gap-4">
                 <div className="flex gap-4">
                   <div className="mt-1 shrink-0 text-slate-400">
                     <Edit size={22} className="text-[#486769]" />
                   </div>
                   <div className="flex-1 space-y-2.5">
                      <h3 className="text-lg font-semibold text-slate-800">{task.title}</h3>
                      
                      <div className="space-y-1.5 text-sm md:text-base text-slate-600">
                        <p><span className="font-medium mr-1.5">Assigned By:</span> {task.assignedBy}</p>
                        <p><span className="font-medium mr-1.5">Due Date:</span> {task.dueDate}</p>
                      </div>
                   </div>
                 </div>

                 {/* task action dropdown bottom right */}
                 <div className="flex justify-end mt-1">
                     <StatusDropdown 
                       value={task.status} 
                       onChange={(newStatus) => handleStatusChange(task.id, newStatus)} 
                     />
                 </div>
               </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TeamSummary;
