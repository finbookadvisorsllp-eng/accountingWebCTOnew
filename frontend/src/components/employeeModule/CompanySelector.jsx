import React, { useContext, useState } from 'react';
import { ChevronDown, Check, Building2 } from 'lucide-react';
import { ClientContext } from './ClientLayout';
import { useParams } from 'react-router-dom';

const CompanySelector = () => {
    const { id } = useParams();
    const context = useContext(ClientContext);
    const [isOpen, setIsOpen] = useState(false);

    // Safety fallback
    if (!context) return null;

    const { companies, loading, handleSwitch, selectedCompany } = context;

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm animate-pulse mb-6">
                <div className="h-5 bg-slate-200 rounded w-1/3"></div>
            </div>
        );
    }

    if (!companies || companies.length <= 1) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center space-x-2 shadow-sm mb-6">
                <Building2 size={18} className="text-slate-500" />
                <span className="text-slate-700 font-medium">{selectedCompany?.entityName || "Company"}</span>
            </div>
        );
    }

    return (
        <div className="relative mb-6">
            <div 
                className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center space-x-2">
                    <Building2 size={18} className="text-[#3A565A]" />
                    <span className="text-slate-800 font-semibold">
                        {selectedCompany?.entityName || "Select Company"}
                    </span>
                </div>
                <ChevronDown size={20} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-14 left-0 right-0 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-40 mt-1 max-h-60 overflow-y-auto">
                    {companies.map((c) => (
                        <div 
                            key={c._id}
                            className={`px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between ${c._id === id ? 'bg-slate-50/50' : ''}`}
                            onClick={() => {
                                handleSwitch(c._id);
                                setIsOpen(false);
                            }}
                        >
                            <span className={`text-sm ${c._id === id ? 'font-bold text-[#3A565A]' : 'text-slate-700'}`}>
                                {c.entityName}
                            </span>
                            {c._id === id && <Check size={18} className="text-[#3A565A]" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanySelector;
