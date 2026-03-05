import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-gray-100 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 shadow-sm w-full">
      {/* <div className="text-3xl font-serif italic text-[#3A565A]">GS</div> */}
      {/* i want to add link tap */}
      <Link to="/employee" className="text-3xl font-serif italic text-[#3A565A]">FB</Link>  
      <div className="flex items-center space-x-6 text-slate-600">
        <Search size={24} className="cursor-pointer hover:text-[#3A565A] transition-colors" />
        <div className="relative cursor-pointer hover:text-[#3A565A] transition-colors">
          <Bell size={24} />
          <span className="absolute -top-1.5 -right-2 bg-[#F97369] text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">4</span>
        </div>
        <Menu size={28} className="cursor-pointer md:hidden hover:text-[#3A565A] transition-colors" onClick={onMenuClick} />
      </div>
    </header>
  );
};

export default Header;
