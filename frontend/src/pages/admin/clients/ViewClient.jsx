import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { clientAPI } from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";
import { 
  ArrowLeft, 
  Edit3, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  CalendarDays, 
  MapPin, 
  Briefcase,
  CheckCircle2,
  Clock,
  Ban,
  ChevronDown,
  Eye,
  FileText
} from "lucide-react";

function formatTime12(timeString) {
  if (!timeString) return "Not set";
  const parts = timeString.split(":");
  if (parts.length < 2) return timeString;
  const [hours, minutes] = parts;
  let h = parseInt(hours, 10);
  if (isNaN(h)) return timeString;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${minutes} ${ampm}`;
}

export default function ViewClient() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [children, setChildren] = useState([]);
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchClient() {
      try {
        const [clientRes, childrenRes] = await Promise.all([
          clientAPI.getClient(id),
          clientAPI.getChildCompanies(id)
        ]);
        setClient(clientRes?.data || null);
        setChildren(childrenRes?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch client details", err);
        setError("Could not load client details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEditDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium tracking-wide animate-pulse">Loading Client Profile...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !client) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto p-6 mt-8 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 shadow-sm">
          <div className="flex-shrink-0">
            <Ban className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800">Client Not Found</h3>
            <p className="text-red-600 mt-1">{error || "The client you are looking for does not exist or has been removed."}</p>
            <Link to="/admin/clients" className="mt-4 inline-flex items-center text-sm font-bold text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Clients
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'inactive': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'dissolved': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName) return <User size={20} />;
    return `${firstName[0] || ""}${lastName ? lastName[0] || "" : ""}`.toUpperCase();
  };

  const hasScheduledDays = () => {
    if (client.scheduleType === 'monthly') {
      return client.monthlySchedule?.days?.length > 0;
    }
    // Handle both new 'visitSchedule' structure and legacy 'visitDays'
    if (client.visitSchedule?.some(s => s.enabled)) return true;
    if (client.visitDays?.length > 0) return true;
    return false;
  };

  const hasValidAddressDetails = client.addressDetails && 
    (client.addressDetails.state || client.addressDetails.city || client.addressDetails.area || client.addressDetails.fullAddress);

  return (
    <AdminLayout>
      <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
        
        {/* Breadcrumb Navigation */}
        <Link to="/admin/clients" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Clients List
        </Link>

        {/* TOP SECTION: Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Decorative left accent */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-2xl"></div>

          <div className="flex gap-5">
            <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm text-blue-600 font-bold text-2xl">
              {client.entityName ? client.entityName[0].toUpperCase() : <Building2 className="w-8 h-8" />}
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                {client.entityName || client.contactName}
                <span className={`px-3 py-0.5 rounded-full border text-xs font-bold uppercase tracking-widest ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                <span className="flex items-center text-sm font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                  <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                  {client.addressDetails?.state || client.registeredOfficeAddress?.state || "Location Unspecified"}
                </span>
                
                {client.empAssign ? (
                  <span className="flex items-center text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
                    <User className="w-4 h-4 mr-1.5 text-emerald-500" />
                    Assigned: {client.empAssign.personalInfo?.firstName} {client.empAssign.personalInfo?.lastName}
                  </span>
                ) : (
                  <span className="flex items-center text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md">
                    <User className="w-4 h-4 mr-1.5 text-amber-500" />
                    Unassigned
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3" ref={dropdownRef}>
            {children.length === 0 ? (
              <Link 
                to={`/admin/clients/edit/${client._id}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all"
              >
                <Edit3 className="w-4 h-4" /> Edit Client
              </Link>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all"
                >
                  <Edit3 className="w-4 h-4" /> Manage Client <ChevronDown className={`w-4 h-4 transition-transform ${isEditDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isEditDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <Link to={`/admin/clients/edit/${client._id}`} className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors">
                      Edit Main Entity
                    </Link>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <p className="px-3 py-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Group Companies</p>
                    <div className="max-h-48 overflow-y-auto scrollbar-hide">
                      {children.map(child => (
                        <div key={child._id} className="flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 rounded-lg group transition-colors">
                          <span className="text-xs font-semibold text-slate-600 truncate max-w-[120px]" title={child.entityName}>
                            {child.entityName}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/admin/clients/${child._id}`} className="text-slate-400 hover:text-slate-700 p-1 bg-white shadow-sm border border-slate-200 rounded">
                              <Eye className="w-3 h-3" />
                            </Link>
                            <Link to={`/admin/clients/edit/${child._id}`} className="text-blue-500 hover:text-blue-700 p-1 bg-white shadow-sm border border-slate-200 rounded">
                              <Edit3 className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <button className="flex items-center justify-center p-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-400 rounded-xl shadow-sm transition-colors group">
              <Ban className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECTION CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1. Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"><Building2 size={18} strokeWidth={2.5} /></div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Basic Information</h3>
            </div>
            <div className="p-6 space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Entity Name</p>
                  <p className="text-sm font-semibold text-slate-800">{client.entityName || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Contact Person</p>
                  <p className="text-sm font-semibold text-slate-800">{client.contactName || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Phone</p>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {client.contactPhone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Email</p>
                  <p className="text-sm font-semibold text-slate-800 text-blue-600 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    {client.contactEmail || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Entity Type</p>
                  <p className="text-sm font-semibold text-slate-800">{client.entityType?.entityType || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Nature of Business</p>
                  <p className="text-sm font-semibold text-slate-800">{client.natureOfBusiness?.natureOfBusiness || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Registered Office Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg"><MapPin size={18} strokeWidth={2.5} /></div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Registered Office Address</h3>
            </div>
            <div className="p-6 space-y-5 flex-1">
              {hasValidAddressDetails ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">State</p>
                      <p className="text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 inline-block">{client.addressDetails.state || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">City</p>
                      <p className="text-sm font-semibold text-slate-800">{client.addressDetails.city || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Area / Location</p>
                    <p className="text-sm font-semibold text-slate-800">{client.addressDetails.area || "—"}</p>
                  </div>
                  <div className="bg-orange-50/50 border border-orange-100/50 p-3 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-orange-600/70 tracking-wider mb-1">Full Address</p>
                    <p className="text-sm font-semibold text-slate-800 italic leading-relaxed">
                      {client.addressDetails.fullAddress || "No detailed address provided."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MapPin className="w-8 h-8 opacity-20 mb-2" />
                  <p className="text-sm font-medium">No structured address format found.</p>
                  <p className="text-xs">{client.registeredOfficeAddress}</p>
                </div>
              )}
            </div>
          </div>

          {/* 2. GST & Registration Details */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Briefcase size={18} strokeWidth={2.5} /></div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Registration & Taxation</h3>
            </div>
            <div className="p-6">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">PAN Number</p>
                  <p className="text-sm font-mono font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded inline-block border border-slate-200">{client.pan || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">TIN / TAN</p>
                  <p className="text-sm font-mono font-bold text-slate-800">{client.tin || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Registration No.</p>
                  <p className="text-sm font-semibold text-slate-800">{client.registrationNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Date of Inc.</p>
                  <p className="text-sm font-semibold text-slate-800">{client.dateOfIncorporation ? new Date(client.dateOfIncorporation).toLocaleDateString('en-GB') : "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mb-2 border-b border-slate-100 pb-2">Verified GST Entries</p>
                {client.gstList && client.gstList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {client.gstList.map((g, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white border border-slate-200 shadow-sm rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] border border-blue-100">
                            GST
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">{g.state || "State Unspecified"}</p>
                            <p className="text-sm font-mono font-bold text-slate-800">{g.gstNumber || "No Number"}</p>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                ) : client.gst ? (
                  <div className="flex items-center p-3 bg-white border border-slate-200 shadow-sm rounded-xl max-w-sm">
                     <p className="text-sm font-mono font-bold text-slate-800">{client.gst}</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-400 italic">No GST information available.</p>
                )}
              </div>

            </div>
          </div>

          {/* 4. Visit Schedule */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><CalendarDays size={18} strokeWidth={2.5} /></div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Visit Schedule</h3>
            </div>
            <div className="p-6 flex flex-col flex-1">
              {!hasScheduledDays() ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-6">
                  <CalendarDays className="w-10 h-10 opacity-20 mb-3" />
                  <p className="text-sm font-bold text-slate-500">No Active Schedule</p>
                  <p className="text-xs mt-1 text-center max-w-[200px]">There are no recurring visits configured for this client.</p>
                </div>
              ) : client.scheduleType === 'monthly' ? (
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 mb-4">
                     <Clock className="w-3.5 h-3.5" /> Recurring Monthly Setup
                   </div>
                   <table className="w-full text-left">
                     <thead className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                       <tr className="border-b border-slate-100">
                         <th className="pb-2">Month Day</th>
                         <th className="pb-2">Time Window</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                       {client.monthlySchedule?.days?.map((d, i) => (
                         <tr key={i}>
                           <td className="py-2.5 text-sm font-bold text-slate-800">Day {d.day}</td>
                           <td className="py-2.5 text-sm font-semibold text-slate-500">{formatTime12(d.fromTime)} - {formatTime12(d.toTime)}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              ) : client.scheduleType === 'weekly' && client.visitSchedule?.some(s => s.enabled) ? (
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 mb-4">
                     <Clock className="w-3.5 h-3.5" /> Repeats Every Week
                   </div>
                   <table className="w-full text-left">
                     <thead className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                       <tr className="border-b border-slate-100">
                         <th className="pb-2">Weekday</th>
                         <th className="pb-2">Time Window</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                       {(client.visitSchedule || []).filter(s => s.enabled).map((s) => (
                         <tr key={s.day}>
                           <td className="py-2.5 text-sm font-bold text-slate-800">{s.day}</td>
                           <td className="py-2.5 text-sm font-semibold text-slate-500">{formatTime12(s.fromTime)} - {formatTime12(s.toTime)}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              ) : client.visitDays?.length > 0 ? (
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 mb-4">
                     <Clock className="w-3.5 h-3.5" /> Recurring Weekly
                   </div>
                   <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                     <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Visit Days</p>
                     <p className="text-sm font-bold text-slate-800 mb-4">{client.visitDays.join(", ")}</p>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">From Time</p>
                         <p className="text-sm font-semibold text-slate-700">{formatTime12(client.visitTimeFrom)}</p>
                       </div>
                       <div>
                         <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">To Time</p>
                         <p className="text-sm font-semibold text-slate-700">{formatTime12(client.visitTimeTo)}</p>
                       </div>
                     </div>
                   </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* 5. Assigned Team / Employee & Remarks */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-1.5 bg-cyan-100 text-cyan-600 rounded-lg"><User size={18} strokeWidth={2.5} /></div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Assigned Team & Notes</h3>
            </div>
            <div className="p-6 flex flex-col flex-1">
              
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Primary Lead</p>
              {client.empAssign ? (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                    {getInitials(client.empAssign.personalInfo?.firstName, client.empAssign.personalInfo?.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-800 truncate">
                      {client.empAssign.personalInfo?.firstName} {client.empAssign.personalInfo?.lastName}
                    </p>
                    <p className="text-xs font-semibold text-cyan-600 mt-0.5">{client.empAssign.adminInfo?.employeeId}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center mb-6">
                  <p className="text-sm font-bold text-slate-500">Unassigned</p>
                  <p className="text-xs mt-1 text-slate-400">No active employee managing this portfolio.</p>
                </div>
              )}

              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Internal Remarks</p>
              {client.remarks ? (
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100/60">
                  <FileText className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-amber-900 leading-relaxed italic">
                    "{client.remarks}"
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic font-medium px-1">No remarks provided.</p>
              )}

            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
