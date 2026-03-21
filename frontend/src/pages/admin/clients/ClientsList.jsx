import React, { useEffect, useState, useMemo, useRef } from "react";
import { clientAPI } from "../../../services/api";
import { Link } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Ban,
  Building2,
  CalendarDays
} from "lucide-react";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Search, Filter, Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dropdown tracking
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);
      const res = await clientAPI.getClients();
      setClients((res?.data?.data || []).filter(c => !c.groupCompany));
    } catch (err) {
      console.error("Failed to fetch clients", err);
    } finally {
      setLoading(false);
    }
  }

  // Helper to get client state safely
  const getClientState = (c) => {
    return c.addressDetails?.state || c.registeredOfficeAddress?.state || "";
  };

  // Extract unique states for the filter dropdown
  const uniqueStates = useMemo(() => {
    const states = new Set();
    clients.forEach(c => {
      const state = getClientState(c);
      if (state) states.add(state);
    });
    return Array.from(states).sort();
  }, [clients]);

  // Compute filtered & paginated clients
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      // 1. Search
      const searchMatch = 
        (c.entityName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.contactName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.registrationNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Status
      const statusMatch = statusFilter === "all" || c.status === statusFilter;

      // 3. State
      const stateMatch = stateFilter === "all" || getClientState(c) === stateFilter;

      return searchMatch && statusMatch && stateMatch;
    });
  }, [clients, searchTerm, statusFilter, stateFilter]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage) || 1;
  const currentClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const getInitials = (firstName, lastName) => {
    if (!firstName) return <User size={14} className="text-slate-400" />;
    return `${firstName[0] || ""}${lastName ? lastName[0] || "" : ""}`.toUpperCase();
  };

  const getGSTCount = (client) => {
    if (Array.isArray(client.gstList) && client.gstList.length > 0) return client.gstList.length;
    if (client.gst && typeof client.gst === 'string') return 1;
    return 0;
  };

  const getGSTPreview = (client) => {
    if (Array.isArray(client.gstList) && client.gstList.length > 0) return client.gstList[0].gstNumber || "Multiple";
    if (client.gst && typeof client.gst === 'string') return client.gst;
    return "N/A";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-emerald-100 text-emerald-700 font-bold';
      case 'inactive': return 'bg-amber-100 text-amber-700 font-bold';
      case 'dissolved': return 'bg-rose-100 text-rose-700 font-bold';
      default: return 'bg-slate-100 text-slate-700 font-bold';
    }
  };

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, stateFilter]);

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Clients</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Manage your client portfolio, assignments, and statuses.
            </p>
          </div>
          <Link
            to="/admin/clients/create"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <span className="text-lg leading-none mb-0.5">+</span> Create Client
          </Link>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search entity, contact, or registration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
              {['all', 'active', 'inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${
                    statusFilter === status 
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative min-w-[140px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all outline-none"
              >
                <option value="all">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-[30%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[10%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Client Info</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-2">GST Details</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-2">Schedule</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-2">Assigned</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center text-slate-400">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600 mb-2"></div>
                      <p className="text-xs font-medium">Loading clients...</p>
                    </td>
                  </tr>
                ) : currentClients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-slate-400">
                      <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-200">
                        <Building2 className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-500">No clients found</p>
                      <p className="text-[11px] mt-1">Try adjusting your filters or search terms.</p>
                    </td>
                  </tr>
                ) : (
                  currentClients.map((client) => {
                    const isWeekly = client.scheduleType === 'weekly';
                    const hasSchedule = client.scheduleType && (
                      isWeekly 
                        ? (client.visitSchedule?.some(s => s.enabled) || client.visitDays?.length > 0) 
                        : (client.monthlySchedule?.days?.length > 0)
                    );
                    const scheduleLabel = !hasSchedule ? "Not Set" : isWeekly ? "Weekly" : "Monthly";

                    return (
                      <tr key={client._id} className="hover:bg-slate-50/70 transition-colors group">
                        
                        {/* Client Info */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                              <Building2 className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 pr-2">
                              <Link to={`/admin/clients/${client._id}`} className="text-[12px] font-bold text-slate-800 hover:text-blue-600 transition-colors block truncate" title={client.entityName || client.contactName}>
                                {client.entityName || client.contactName}
                              </Link>
                              <div className="flex items-center text-[10px] font-medium text-slate-400 mt-0.5 gap-1.5">
                                <span className="truncate">{client.registrationNumber || "No Reg No"}</span>
                                <span className="w-0.5 h-0.5 rounded-full bg-slate-300 shrink-0"></span>
                                <span className="truncate">{getClientState(client) || "No State"}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* GST Details */}
                        <td className="px-4 py-3 pl-2">
                          <div className="text-[12px] font-medium text-slate-700">
                            {getGSTCount(client) > 1 ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                                {getGSTCount(client)} GSTs
                              </span>
                            ) : (
                              <span className="font-mono text-[11px] font-bold">{getGSTPreview(client)}</span>
                            )}
                          </div>
                          {getGSTCount(client) === 1 && (
                            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Primary GST</div>
                          )}
                        </td>

                        {/* Schedule Preview */}
                        <td className="px-4 py-3 pl-2">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className={`w-3.5 h-3.5 shrink-0 ${hasSchedule ? 'text-blue-500' : 'text-slate-300'}`} />
                            <span className={`text-[11px] font-bold ${hasSchedule ? 'text-slate-700' : 'text-slate-400 italic'} truncate`}>
                              {scheduleLabel}
                            </span>
                          </div>
                          {hasSchedule && (
                            <div className="text-[9px] font-semibold text-slate-400 mt-1 truncate pr-2" title={
                              isWeekly 
                                ? (client.visitSchedule?.filter(s => s.enabled).map(s => s.day).join(", ") || client.visitDays?.join(", ")) 
                                : `${client.monthlySchedule?.days?.length || 0} days/mo`
                            }>
                              {isWeekly 
                                ? (client.visitSchedule?.filter(s => s.enabled).map(s => s.day).join(", ") || client.visitDays?.join(", ")) 
                                : `${client.monthlySchedule?.days?.length || 0} days/mo`
                              }
                            </div>
                          )}
                        </td>

                        {/* Assigned Employee */}
                        <td className="px-4 py-3 pl-2">
                          {client.empAssign ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[9px] font-bold text-emerald-700 shrink-0">
                                {getInitials(client.empAssign.personalInfo?.firstName, client.empAssign.personalInfo?.lastName)}
                              </div>
                              <div className="text-[11px] font-bold text-slate-700 truncate pr-2" title={`${client.empAssign.personalInfo?.firstName} ${client.empAssign.personalInfo?.lastName}`}>
                                {client.empAssign.personalInfo?.firstName} {client.empAssign.personalInfo?.lastName}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] font-medium italic text-slate-400">Unassigned</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] uppercase tracking-wider border border-transparent ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-0.5 relative" ref={openDropdownId === client._id ? dropdownRef : null}>
                            
                            <Link
                              to={`/admin/clients/${client._id}`}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>

                            <Link
                              to={`/admin/clients/edit/${client._id}`}
                              className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                              title="Edit Client"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => setOpenDropdownId(openDropdownId === client._id ? null : client._id)}
                              className={`p-1 rounded transition-colors ${openDropdownId === client._id ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdownId === client._id && (
                              <div className="absolute top-full right-2 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="py-1">
                                  <Link to={`/admin/clients/${client._id}`} className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                    <Eye className="w-3.5 h-3.5 text-slate-400" /> View profile
                                  </Link>
                                  <Link to={`/admin/clients/edit/${client._id}`} className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                    <Edit3 className="w-3.5 h-3.5 text-slate-400" /> Edit info
                                  </Link>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left">
                                    <Ban className="w-3.5 h-3.5" /> Deactivate
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          {!loading && currentClients.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="text-xs font-medium text-slate-500">
                Showing <span className="font-bold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredClients.length)}</span> of <span className="font-bold text-slate-700">{filteredClients.length}</span> clients
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center px-2">
                  <span className="text-xs font-bold text-slate-700">Page {currentPage} of {totalPages}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
