import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import CompanySelector from './CompanySelector';

const recentFiles = [
  { id: 1, name: 'Inventory_Tracking_Sheet_August.xlsx', desc: 'Description or email of tenant', type: 'excel' },
  { id: 2, name: 'Inventory_Tracking_Sheet_August.xlsx', desc: 'Description or email of tenant', type: 'onenote' },
  { id: 3, name: 'Project_Presentation_2024_V1.pptx', desc: 'Description or email of tenant', type: 'ppt' },
  { id: 4, name: 'Inventory_Tracking_Sheet_August.xlsx', desc: 'Description or email of tenant', type: 'excel' },
  { id: 5, name: 'Inventory_Tracking_Sheet_August.xlsx', desc: 'Description or email of tenant', type: 'onenote' },
  { id: 6, name: 'Project_Presentation_2024_V1.pptx', desc: 'Description or email of tenant', type: 'ppt' },
  { id: 7, name: 'Inventory_Tracking_Sheet_August.xlsx', desc: 'Description or email of tenant', type: 'excel' },
];

const getIconForType = (type) => {
   // Fallback colored squares if real image assets are missing, using typical Office branding colors
   switch(type) {
      case 'excel':
         return <div className="w-8 h-8 rounded bg-[#107C41] text-white flex items-center justify-center font-bold text-sm">X</div>;
      case 'onenote':
         return <div className="w-8 h-8 rounded bg-[#7719AA] text-white flex items-center justify-center font-bold text-sm">N</div>;
      case 'ppt':
         return <div className="w-8 h-8 rounded bg-[#C43E1C] text-white flex items-center justify-center font-bold text-sm">P</div>;
      default:
         return <div className="w-8 h-8 rounded bg-slate-400 text-white flex items-center justify-center font-bold text-sm">?</div>;
   }
};

const DocumentsAndFiles = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id || '1';

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FBFB] scrollbar-hide w-full h-full pb-8">
      
      {/* Header */}
      <header className="flex items-center space-x-4 px-6 md:px-10 py-6 md:py-8 bg-white sticky top-0 z-30 shadow-sm border-b border-slate-100">
        <ArrowLeft 
          size={28} 
          className="text-[#3A565A] cursor-pointer hover:-translate-x-1 transition-transform bg-slate-50 p-1.5 rounded-full" 
          onClick={() => navigate(`/employee/clients/${clientId}`)}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Documents and Files</h1>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 w-full max-w-2xl mx-auto space-y-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <CompanySelector />
        
        {/* Upload Card */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-200">
           <h3 className="text-slate-600 font-medium mb-4">Upload Documents</h3>
           <div className="bg-[#F6F6F6] rounded-[20px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center py-10 cursor-pointer hover:border-[#3A565A] hover:bg-slate-50 transition-all group">
              <UploadCloud size={40} className="text-slate-400 group-hover:text-[#3A565A] mb-3 transition-colors" />
              <span className="text-slate-500 font-medium group-hover:text-[#3A565A] transition-colors">Click here to Upload Files</span>
           </div>
        </div>

        {/* Recent Files List */}
        <div className="space-y-4">
           <h3 className="font-bold text-slate-800 text-lg px-2">Your Recent Files</h3>
           
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {recentFiles.map((file, index) => (
                 <div 
                   key={file.id} 
                   className={`flex items-center justify-between p-4 md:p-5 hover:bg-slate-50 transition-colors cursor-pointer ${index !== recentFiles.length - 1 ? 'border-b border-slate-100' : ''}`}
                 >
                    <div className="flex flex-col pr-4">
                       <span className="text-slate-700 font-medium text-sm md:text-base break-all leading-tight mb-1">{file.name}</span>
                       <span className="text-slate-400 text-xs md:text-sm">{file.desc}</span>
                    </div>
                    <div className="shrink-0 pl-2">
                       {getIconForType(file.type)}
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentsAndFiles;
