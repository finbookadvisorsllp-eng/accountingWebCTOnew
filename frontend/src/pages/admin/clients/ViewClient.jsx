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
  Globe, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  Eye
} from "lucide-react";

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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !client) {
    return (
      <AdminLayout>
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <p>{error || "Client not found."}</p>
          <Link to="/admin/clients" className="mt-4 inline-flex items-center text-sm font-medium hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Clients
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'inactive': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'dissolved': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const InfoCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-500" />
        <h3 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  const DetailItem = ({ label, value }) => (
    <div className="mb-3 last:mb-0">
      <p className="text-[10px] text-slate-400 uppercase font-medium tracking-tight mb-0.5">{label}</p>
      <p className="text-[13px] text-slate-700 font-medium">
        {value || <span className="text-slate-300 italic">Not set</span>}
      </p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumbs & Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Link to="/admin/clients" className="text-[12px] text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center mb-1">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Clients List
            </Link>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              {client.entityName}
              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
            </h1>
          </div>
          {children.length === 0 ? (
            <Link 
              to={`/admin/clients/edit/${client._id}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold rounded-lg shadow-sm transition-all"
            >
              <Edit3 className="w-4 h-4" /> Edit Client
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold rounded-lg shadow-sm transition-all"
              >
                <Edit3 className="w-4 h-4" /> Edit Options <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isEditDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isEditDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-50">
                  <Link to={`/admin/clients/edit/${client._id}`} className="block px-3 py-2 text-[12px] font-semibold text-slate-800 hover:bg-slate-50 rounded-lg">
                     Edit Main Company
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <p className="px-3 py-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Group Companies</p>
                  <div className="max-h-48 overflow-y-auto scrollbar-hide">
                    {children.map(child => (
                       <div key={child._id} className="flex items-center justify-between px-3 py-1 hover:bg-slate-50 rounded-lg transition-colors">
                          <span className="text-[12px] text-slate-600 truncate max-w-[120px]" title={child.entityName}>
                             {child.entityName}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                             <Link to={`/admin/clients/${child._id}`} title="View Details" className="text-slate-400 hover:text-slate-600 p-1">
                                <Eye className="w-3.5 h-3.5" />
                             </Link>
                             <Link to={`/admin/clients/edit/${child._id}`} title="Edit Client" className="text-blue-500 hover:text-blue-600 p-1">
                                <Edit3 className="w-3.5 h-3.5" />
                             </Link>
                          </div>
                       </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Identity Information */}
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="Entity Details" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailItem label="Full Legal Name" value={client.entityName} />
                <DetailItem label="Entity Type" value={client.entityType?.entityType} />
                <DetailItem label="Registration Number" value={client.registrationNumber} />
                <DetailItem label="Date of Incorporation" value={client.dateOfIncorporation && new Date(client.dateOfIncorporation).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
                <DetailItem label="Nature of Business" value={client.natureOfBusiness?.natureOfBusiness} />
                <DetailItem label="Registered Office Address" value={client.registeredOfficeAddress} />
              </div>
            </InfoCard>

            <InfoCard title="Taxation & Compliance" icon={FileText}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                <DetailItem label="GST Number" value={client.gst} />
                <DetailItem label="PAN Number" value={client.pan} />
                <DetailItem label="TIN / TAN" value={client.tin} />
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-medium tracking-tight mb-3">Active Compliances</p>
                <div className="flex flex-wrap gap-2">
                  {client.complianceStatus?.length > 0 ? (
                    client.complianceStatus.map((c) => (
                      <span key={c._id} className="inline-flex items-center px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                        <CheckCircle2 className="w-3 h-3 mr-1.5 text-slate-400" />
                        {c.complianceName}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-[12px] italic">No compliances assigned</span>
                  )}
                </div>
              </div>
            </InfoCard>

            {client.remarks && (
              <InfoCard title="Internal Remarks" icon={AlertCircle}>
                <p className="text-[13px] text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-4">
                  "{client.remarks}"
                </p>
              </InfoCard>
            )}
          </div>

          {/* Sidebar Area: Contacts & Assignments */}
          <div className="space-y-6">
            <InfoCard title="Contact Person" icon={User}>
              <DetailItem label="Name" value={client.contactName} />
              <DetailItem label="Phone" value={client.contactPhone} />
              <DetailItem label="Email" value={client.contactEmail} />
            </InfoCard>

            <InfoCard title="Assigned Accountant" icon={User}>
              {client.empAssign ? (
                <div>
                  <div className="flex items-center gap-3 mb-4 p-2 bg-blue-50/50 rounded-lg border border-blue-100/50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                      {client.empAssign.personalInfo?.firstName?.[0]}
                      {client.empAssign.personalInfo?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">
                        {client.empAssign.personalInfo?.firstName} {client.empAssign.personalInfo?.lastName}
                      </p>
                      <p className="text-[10px] text-blue-600 font-medium">{client.empAssign.adminInfo?.employeeId}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-[12px] italic">No accountant assigned</p>
              )}
            </InfoCard>

            <InfoCard title="Visit Schedule" icon={Clock}>
              <DetailItem 
                label="Days" 
                value={client.visitDays?.length > 0 ? client.visitDays.join(", ") : "Not scheduled"} 
              />
              <div className="grid grid-cols-2 gap-4 mt-1">
                <DetailItem label="From" value={client.visitTimeFrom} />
                <DetailItem label="To" value={client.visitTimeTo} />
              </div>
            </InfoCard>

            {children.length > 0 && (
              <InfoCard title="Group / Branch Companies" icon={Building2}>
                <div className="space-y-2">
                  {children.map(child => (
                    <div key={child._id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                      <span className="text-[12px] font-semibold text-slate-700 truncate max-w-[120px]" title={child.entityName}>
                        {child.entityName}
                      </span>
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/clients/${child._id}`} className="text-slate-500 hover:text-slate-700 text-[11px] font-bold flex items-center gap-1">
                          <Eye className="w-3 h-3" /> View
                        </Link>
                        <Link to={`/admin/clients/edit/${child._id}`} className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1">
                          <Edit3 className="w-3 h-3" /> Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </InfoCard>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
