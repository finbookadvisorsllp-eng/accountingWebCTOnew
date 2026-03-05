import React, { useState } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Image as ImageIcon, Paperclip, ArrowLeft } from 'lucide-react';

const mockContacts = [
  { id: 1, name: 'Daniel Smith', role: 'Premium Client', time: '10:42 AM', unread: 2, msg: 'Can we schedule a meeting to...' },
  { id: 2, name: 'Sarah Connor', role: 'Business Account', time: 'Yesterday', unread: 0, msg: 'The documents look perfect.' },
  { id: 3, name: 'Vanguard Corp', role: 'Enterprise', time: 'Mon', unread: 0, msg: 'We need to amend the Q2 filings...' },
  { id: 4, name: 'Alice Jenkins', role: 'Individual Tax', time: 'Oct 12', unread: 0, msg: 'Thanks for the quick turnaround!' },
];

const mockChat = [
  { id: 1, sender: 'them', text: 'Hi, I saw the new financial dashboard you deployed for us.', time: '10:30 AM' },
  { id: 2, sender: 'them', text: 'Can we schedule a meeting to discuss the Q3 tax breakdown?', time: '10:31 AM' },
  { id: 3, sender: 'me', text: 'Absolutely Daniel! I am free anytime after 2 PM tomorrow. Does that work?', time: '10:45 AM' },
  { id: 4, sender: 'them', text: 'Yes, I will send over a calendar invite shortly.', time: '10:46 AM' },
];

const Communication = () => {
  const [activeContact, setActiveContact] = useState(mockContacts[0]);
  const [message, setMessage] = useState('');
  
  // Track if we should show the chat or the contact list on mobile
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-[#F9FBFB] w-full h-full overflow-hidden">
      
      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden lg:p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
         
         <div className="flex-1 flex w-full max-w-7xl mx-auto bg-white lg:rounded-[24px] lg:border border-slate-200 lg:shadow-sm overflow-hidden">
            
            {/* Contacts Sidebar */}
            <div className={`w-full md:w-80 border-r border-slate-200 flex-col bg-slate-50/50 shrink-0 ${showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
               
               {/* Mobile Header (Only visible when contact list is full width) */}
               <div className="md:hidden px-6 py-4 border-b border-slate-200 bg-white">
                  <h1 className="text-xl font-bold text-slate-800">Messages</h1>
               </div>

               <div className="p-4 border-b border-slate-200">
                  <div className="relative">
                     <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="text" placeholder="Search messages..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#3A565A]" />
                  </div>
               </div>
               
               <div className="flex-1 overflow-y-auto w-full">
                  {mockContacts.map((contact) => (
                     <div 
                        key={contact.id}
                        onClick={() => {
                           setActiveContact(contact);
                           // On mobile, auto-switch to chat view when a contact is tapped
                           setShowChatOnMobile(true);
                        }}
                        className={`p-4 border-b border-slate-100 cursor-pointer transition-colors relative ${activeContact.id === contact.id ? 'bg-white' : 'hover:bg-white/60'}`}
                     >
                        {activeContact.id === contact.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3A565A] hidden md:block" />}
                        <div className="flex items-center justify-between mb-1">
                           <h3 className={`font-bold text-sm ${activeContact.id === contact.id ? 'text-[#3A565A]' : 'text-slate-800'}`}>{contact.name}</h3>
                           <span className="text-[10px] font-medium text-slate-400">{contact.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <p className="text-xs text-slate-500 line-clamp-1 pr-4">{contact.msg}</p>
                           {contact.unread > 0 && <span className="bg-[#F97369] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{contact.unread}</span>}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex-col h-full bg-white relative w-full ${!showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
               
               {/* Chat Header */}
               <div className="h-16 md:h-20 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 bg-white shadow-sm z-10">
                  <div className="flex items-center space-x-3">
                     
                     {/* Back Button (Mobile Only) */}
                     <button 
                        onClick={() => setShowChatOnMobile(false)}
                        className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                     >
                        <ArrowLeft size={20} />
                     </button>

                     <div className="w-10 h-10 rounded-full bg-[#6DA4A4] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {activeContact.name.charAt(0)}
                     </div>
                     <div>
                        <h2 className="font-bold text-slate-800 text-sm md:text-base">{activeContact.name}</h2>
                        <p className="text-[11px] md:text-xs text-slate-500 font-medium">{activeContact.role}</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-3 md:space-x-4 text-slate-400">
                     <Phone size={20} className="hover:text-[#3A565A] cursor-pointer transition-colors" />
                     <Video size={20} className="hover:text-[#3A565A] cursor-pointer transition-colors" />
                     <MoreVertical size={20} className="hover:text-[#3A565A] cursor-pointer transition-colors hidden sm:block" />
                  </div>
               </div>

               {/* Chat Messages */}
               <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-50/50">
                  <div className="text-center">
                     <span className="text-[10px] md:text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
                  </div>
                  
                  {mockChat.map((msg) => (
                     <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 md:px-5 py-2.5 md:py-3 shadow-sm text-[13px] md:text-sm ${msg.sender === 'me' ? 'bg-[#3A565A] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                           {msg.text}
                        </div>
                        <span className="text-[9px] md:text-[10px] font-medium text-slate-400 mt-1.5 px-1">{msg.time}</span>
                     </div>
                  ))}
               </div>

               {/* Message Input Box */}
               <div className="p-3 md:p-4 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
                  <div className="flex items-end space-x-2 md:space-x-3 bg-slate-50/80 rounded-[20px] md:rounded-2xl border border-slate-200 p-1.5 md:p-2 pl-3 md:pl-4 focus-within:border-[#3A565A] focus-within:ring-1 focus-within:ring-[#3A565A]/20 transition-all">
                     <div className="flex space-x-2 md:space-x-3 pb-2 text-slate-400 shrink-0">
                        <ImageIcon size={20} className="hover:text-[#3A565A] cursor-pointer transition-colors" />
                        <Paperclip size={20} className="hover:text-[#3A565A] cursor-pointer transition-colors hidden sm:block" />
                     </div>
                     <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-24 md:max-h-32 text-sm text-slate-700 py-1.5 md:py-2 min-h-[36px] md:min-h-[40px] scrollbar-hide py-2"
                        rows="1"
                     />
                     <button className="bg-[#3A565A] text-white p-2 md:p-2.5 rounded-full md:rounded-xl hover:bg-[#2a3e41] transition-colors shrink-0 shadow-sm">
                        <Send size={16} className="md:w-[18px] md:h-[18px] translate-x-[-1px] translate-y-[1px]" />
                     </button>
                  </div>
               </div>

            </div>
         </div>

      </div>
    </div>
  );
};

export default Communication;
