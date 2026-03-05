import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Contact } from 'lucide-react';

const mockClients = [
  { id: 1, name: 'Daniel Smith', date: 'Sunday, 12 June', time: '11:00 - 12:00 AM', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop' },
  { id: 2, name: 'Suhana jain', date: 'Thursday, 16 June', time: '01:00 - 2:00 PM', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop' },
  { id: 3, name: 'Daniel Smith', date: 'Thursday, 18 June', time: '03:00 - 4:00 PM', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop' },
  { id: 4, name: 'Suhana jain', date: 'Thursday, 16 June', time: '01:00 - 2:00 PM', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&auto=format&fit=crop' },
  { id: 5, name: 'Daniel Smith', date: 'Thursday, 18 June', time: '03:00 - 4:00 PM', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop' },
  { id: 6, name: 'Daniel Smith', date: 'Sunday, 12 June', time: '11:00 - 12:00 AM', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' },
];

const ClientList = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <ArrowLeft 
            size={28} 
            className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
            onClick={() => navigate(-1)}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Client list</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 lg:p-10 w-full max-w-4xl mx-auto space-y-4">
        
        {/* Client List */}
        {mockClients.map((client, index) => (
          <div 
            key={`${client.id}-${index}`}
            onClick={() => navigate(`/employee/clients/${client.id}`)}
            className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-[#3A565A]/40 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center space-x-4 md:space-x-5">
              <img 
                src={client.avatar} 
                alt={client.name} 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-slate-50 shadow-sm"
              />
              <div className="flex flex-col space-y-1 md:space-y-1.5">
                <h3 className="font-semibold text-slate-800 text-lg md:text-xl group-hover:text-[#3A565A] transition-colors">{client.name}</h3>
                
                <div className="flex items-center space-x-2 text-slate-600 text-sm md:text-base">
                   <Calendar size={16} className="text-[#6DA4A4]" />
                   <span>{client.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 text-sm md:text-base">
                   <Clock size={16} className="text-[#6DA4A4]" />
                   <span>{client.time}</span>
                </div>
              </div>
            </div>
            
            {/* Action Icon */}
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#3A565A] flex items-center justify-center text-white shadow-md group-hover:bg-[#2a3e41] group-hover:scale-105 transition-all">
                <Contact size={24} className="md:w-7 md:h-7" />
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ClientList;
