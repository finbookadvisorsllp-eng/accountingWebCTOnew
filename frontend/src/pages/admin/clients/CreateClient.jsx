import React, { useEffect, useState, useRef } from "react";
import {
  clientAPI,
  complianceAPI,
  complianceTaskAPI,
  entityTypeAPI,
  natureOfBusinessAPI,
  candidateAPI,
} from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Briefcase, 
  FileText,
  Calendar,
  CheckSquare,
  Clock,
  Save,
  X,
  Layers,
  FileBadge
} from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/* ---------- helpers ---------- */

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-8 relative transition-all duration-200 hover:shadow-md">
    <div className="px-6 py-4 border-b border-slate-100/80 bg-slate-50/50 flex items-center gap-3">
      {Icon && <div className="p-2 bg-blue-50/80 text-blue-600 rounded-lg"><Icon size={18} strokeWidth={2.5} /></div>}
      <h3 className="text-[15px] font-extrabold text-slate-800 tracking-tight">{title}</h3>
    </div>
    <div className="p-6 space-y-6">
      {children}
    </div>
  </div>
);

const safeArray = (maybe) => {
  if (!maybe) return [];
  if (Array.isArray(maybe)) return maybe;
  if (Array.isArray(maybe.data)) return maybe.data;
  if (Array.isArray(maybe.data?.data)) return maybe.data.data;
  if (Array.isArray(maybe.items)) return maybe.items;
  return [];
};

const normalizeMasterField = (maybe, labelField, labelFn) => {
  const arr = safeArray(maybe);
  return arr.map((it) => {
    const id = String(it._id ?? it.id ?? "");
    let label = "";
    if (typeof labelFn === "function") {
      label = labelFn(it);
    } else if (labelField && it[labelField] !== undefined) {
      label = String(it[labelField]);
    } else {
      label = String(it.name ?? it.title ?? it.label ?? id);
    }
    return { id, label, raw: it };
  });
};

function generateEmptyClient() {
  return {
    entityName: "",
    empAssign: "",
    visitTimeFrom: "",
    visitTimeTo: "",
    visitDays: [],
    groupCompany: "",
    entityType: "",
    registrationNumber: "",
    dateOfIncorporation: "",
    registeredOfficeAddress: "", // old
    addressDetails: { state: "", city: "", area: "", fullAddress: "" }, // new
    natureOfBusiness: "",
    tin: "",
    gst: "", // old
    gstList: [{ state: "", gstNumber: "" }], // new
    pan: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    complianceStatus: [],
    taskApplicability: [],
    visitSchedule: DAYS.map(d => ({ day: d, fromTime: "", toTime: "", enabled: false })), // new
    monthlySchedule: { month: "", days: [] }, // new
    scheduleType: "weekly", // "weekly" or "monthly"
    status: "active",
    remarks: "",
  };
}

export default function ClientForm({ clientId = null, onSaved = () => {} }) {
  const [masters, setMasters] = useState({
    entityTypes: [],
    natureOfBusiness: [],
    complianceTasks: [],
    compliances: [],
    accountants: [],
    companies: [],
  });

  const [form, setForm] = useState(generateEmptyClient());
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [errors, setErrors] = useState({});

  // Dropdown visibility states
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [complianceSearch, setComplianceSearch] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskSearch, setTaskSearch] = useState("");

  // Refs for outside click handling
  const complianceRef = useRef(null);
  const taskRef = useRef(null);

  /* ---------- fetch masters ---------- */
  useEffect(() => {
    let mounted = true;

    async function fetchMasters() {
      try {
        const [
          entityTypesRes,
          natureRes,
          tasksRes,
          compliancesRes,
          candidatesRes,
          companiesRes,
        ] = await Promise.all([
          entityTypeAPI.getAll(),
          natureOfBusinessAPI.getAll(),
          complianceTaskAPI.getAll(),
          complianceAPI.getAll(),
          candidateAPI.getCandidates(),
          clientAPI.getClients({ onlyCompanies: true }),
        ]);

        if (!mounted) return;

        const allCandidates = candidatesRes?.data?.data || [];

        const accountants = allCandidates
          .filter((c) => c?.status === "ACTIVE")
          .map((c) => ({
            _id: c._id,
            firstName: c.personalInfo?.firstName || "",
            lastName: c.personalInfo?.lastName || "",
            employeeId: c.adminInfo?.employeeId || "",
          }));

        setMasters({
          entityTypes: normalizeMasterField(entityTypesRes?.data, "entityType"),
          natureOfBusiness: normalizeMasterField(
            natureRes?.data,
            "natureOfBusiness",
          ),
          complianceTasks: normalizeMasterField(tasksRes?.data, "taskName"),
          compliances: normalizeMasterField(
            compliancesRes?.data?.data ?? compliancesRes?.data,
            "complianceName",
          ),
          accountants: accountants,
          companies: normalizeMasterField(
            companiesRes?.data?.data ?? companiesRes?.data ?? companiesRes,
            "entityName",
          ),
        });
      } catch (err) {
        console.error("Failed to load masters", err);
      }
    }

    fetchMasters();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- fetch client (edit mode) ---------- */
  useEffect(() => {
    if (!clientId) {
      setForm(generateEmptyClient());
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const res = await clientAPI.getClient(clientId);
        const c = res?.data || {};
        if (!mounted) return;

        setForm({
          entityName: c.entityName || "",
          empAssign: c.empAssign?._id
            ? String(c.empAssign._id)
            : c.empAssign
              ? String(c.empAssign)
              : "",
          visitTimeFrom: c.visitTimeFrom || "",
          visitTimeTo: c.visitTimeTo || "",
          visitDays: Array.isArray(c.visitDays)
            ? c.visitDays
            : c.visitDays
              ? safeArray(c.visitDays)
              : [],
          groupCompany: c.groupCompany?._id
            ? String(c.groupCompany._id)
            : c.groupCompany
              ? String(c.groupCompany)
              : "",
          entityType: c.entityType?._id
            ? String(c.entityType._id)
            : c.entityType
              ? String(c.entityType)
              : "",
          registrationNumber: c.registrationNumber || "",
          dateOfIncorporation: c.dateOfIncorporation
            ? String(c.dateOfIncorporation).split("T")[0]
            : "",
          registeredOfficeAddress: c.registeredOfficeAddress || "",
          addressDetails: c.addressDetails || { 
            state: "", 
            city: "", 
            area: "", 
            fullAddress: c.registeredOfficeAddress || "" 
          },
          natureOfBusiness: c.natureOfBusiness?._id
            ? String(c.natureOfBusiness._id)
            : c.natureOfBusiness
              ? String(c.natureOfBusiness)
              : "",
          tin: c.tin || "",
          gst: c.gst || "",
          gstList: Array.isArray(c.gstList) && c.gstList.length > 0 
            ? c.gstList 
            : [{ state: "", gstNumber: c.gst || "" }],
          pan: c.pan || "",
          contactName: c.contactName || "",
          contactPhone: c.contactPhone || "",
          contactEmail: c.contactEmail || "",
          complianceStatus: (Array.isArray(c.complianceStatus)
            ? c.complianceStatus
            : safeArray(c.complianceStatus)
          ).map((x) =>
            typeof x === "string" ? String(x) : String(x?._id ?? ""),
          ),
          taskApplicability: safeArray(c.taskApplicability).map((t) => ({
            taskId: t.taskId?._id
              ? String(t.taskId._id)
              : String(t.taskId ?? ""),
            dueDate: t.dueDate ? String(t.dueDate).split("T")[0] : "",
            frequency: t.frequency || "",
          })),
          visitSchedule: Array.isArray(c.visitSchedule) && c.visitSchedule.length > 0
            ? c.visitSchedule
            : DAYS.map(d => {
                const isSelected = Array.isArray(c.visitDays) && c.visitDays.includes(d);
                return {
                  day: d,
                  fromTime: isSelected ? c.visitTimeFrom || "" : "",
                  toTime: isSelected ? c.visitTimeTo || "" : "",
                  enabled: isSelected
                };
              }),
           monthlySchedule: c.monthlySchedule || { month: "", days: [] },
          scheduleType: c.scheduleType || (c.monthlySchedule?.days?.length > 0 ? "monthly" : "weekly"),
          status: c.status || "active",
          remarks: c.remarks || "",
        });
      } catch (err) {
        console.error("Error fetching client", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [clientId]);

  /* ---------- outside click handlers ---------- */
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        complianceRef.current &&
        !complianceRef.current.contains(event.target)
      ) {
        setShowComplianceDropdown(false);
      }
      if (taskRef.current && !taskRef.current.contains(event.target)) {
        setShowTaskDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- handlers ---------- */
  function handleChange(e) {
    const { name, value, type } = e.target;

    if (type === "checkbox" && name === "visitDays") {
      setForm((prev) => {
        const has =
          Array.isArray(prev.visitDays) && prev.visitDays.includes(value);
        return {
          ...prev,
          visitDays: has
            ? prev.visitDays.filter((d) => d !== value)
            : [...(prev.visitDays || []), value],
        };
      });
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  /* ---------- new handlers for structured data ---------- */

  function handleAddGst() {
    setForm((prev) => ({
      ...prev,
      gstList: [...(prev.gstList || []), { state: "", gstNumber: "" }],
    }));
  }

  function handleRemoveGst(index) {
    setForm((prev) => ({
      ...prev,
      gstList: (prev.gstList || []).filter((_, i) => i !== index),
    }));
  }

  function handleGstChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      gstList: (prev.gstList || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function handleAddressChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      addressDetails: { ...(prev.addressDetails || {}), [name]: value },
    }));
  }

  function handleVisitScheduleChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      visitSchedule: (prev.visitSchedule || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function handleMonthlyScheduleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      monthlySchedule: { ...(prev.monthlySchedule || {}), [field]: value },
    }));
  }

  function handleAddMonthlyDay() {
    setForm((prev) => ({
      ...prev,
      monthlySchedule: {
        ...(prev.monthlySchedule || {}),
        days: [...(prev.monthlySchedule?.days || []), { day: "", fromTime: "", toTime: "" }]
      }
    }));
  }

  function handleRemoveMonthlyDay(index) {
    setForm((prev) => ({
      ...prev,
      monthlySchedule: {
        ...(prev.monthlySchedule || {}),
        days: (prev.monthlySchedule?.days || []).filter((_, i) => i !== index)
      }
    }));
  }

  function handleMonthlyDayChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      monthlySchedule: {
        ...(prev.monthlySchedule || {}),
        days: (prev.monthlySchedule?.days || []).map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  }

  // Compliance multi-select toggle
  function handleComplianceToggle(complianceId) {
    setForm((prev) => {
      const current = prev.complianceStatus || [];
      const idStr = String(complianceId);
      if (current.includes(idStr)) {
        return {
          ...prev,
          complianceStatus: current.filter((id) => id !== idStr),
        };
      } else {
        return { ...prev, complianceStatus: [...current, idStr] };
      }
    });
  }

  // Task multi-select toggle
  function handleTaskToggle(taskId) {
    const sId = String(taskId);
    setForm((prev) => {
      const exists = (prev.taskApplicability || []).find(
        (t) => String(t.taskId) === sId,
      );
      if (exists) {
        return {
          ...prev,
          taskApplicability: (prev.taskApplicability || []).filter(
            (t) => String(t.taskId) !== sId,
          ),
        };
      }
      return {
        ...prev,
        taskApplicability: [
          ...(prev.taskApplicability || []),
          { taskId: sId, dueDate: "", frequency: "" },
        ],
      };
    });
  }

  function handleTaskDueDate(taskId, date) {
    const sId = String(taskId);
    setForm((prev) => ({
      ...prev,
      taskApplicability: (prev.taskApplicability || []).map((t) =>
        String(t.taskId) === sId ? { ...t, dueDate: date } : t,
      ),
    }));
  }

  function handleTaskFrequency(taskId, frequency) {
    const sId = String(taskId);
    setForm((prev) => ({
      ...prev,
      taskApplicability: (prev.taskApplicability || []).map((t) =>
        String(t.taskId) === sId ? { ...t, frequency: frequency } : t,
      ),
    }));
  }

  function validate() {
    const e = {};
    if (!form.entityName) e.entityName = "Entity name is required";
    if (!form.entityType) e.entityType = "Select entity type";
    if (!form.natureOfBusiness)
      e.natureOfBusiness = "Select nature of business";
    if (!form.contactName) e.contactName = "Contact name required";
    if (!form.contactEmail) e.contactEmail = "Contact email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ---------- submit ---------- */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        visitDays: form.scheduleType === 'weekly' 
          ? (form.visitSchedule || []).filter(s => s.enabled).map(s => s.day)
          : [],
        taskApplicability: (form.taskApplicability || []).map((t) => ({
          taskId: t.taskId,
          dueDate: t.dueDate || null,
        })),
      };

      let res;
      if (clientId) {
        res = await clientAPI.updateClient(clientId, payload);
      } else {
        res = await clientAPI.createClient(payload);
      }

      if (res?.data?.generatedPassword) {
        setGeneratedPassword(res.data.generatedPassword);
      } else {
        setGeneratedPassword(null);
      }

      onSaved && onSaved(res?.data ?? null);
      alert(`Client ${clientId ? "updated" : "created"} successfully`);
      if (!clientId) setForm(generateEmptyClient());
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save client");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- helper to get selected compliance labels ---------- */
  const selectedCompliances = (form.complianceStatus || [])
    .map((id) => masters.compliances.find((c) => c.id === id))
    .filter(Boolean);

  const selectedTasks = (form.taskApplicability || [])
    .map((t) => {
      const task = masters.complianceTasks.find((ct) => ct.id === t.taskId);
      return task ? { ...t, label: task.label } : null;
    })
    .filter(Boolean);

  /* ---------- render ---------- */
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto my-6 p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {clientId ? "Edit Client" : "Create Client"}
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">
              {clientId ? "Update the details of this business entity." : "Enter the details to register a new business entity."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              onClick={(e) => { e.preventDefault(); window.history.back(); }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Client"}
            </button>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <SectionCard title="Basic Information" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Entity Name */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Entity Name *
                </label>
                <input
                  name="entityName"
                  value={form.entityName}
                  onChange={handleChange}
                  placeholder="Official legal name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none placeholder:text-slate-400"
                />
                {errors.entityName && (
                  <p className="mt-1 text-xs text-red-500">{errors.entityName}</p>
                )}
              </div>

              {/* Entity Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Entity Type *
                </label>
                <select
                  name="entityType"
                  value={form.entityType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
                >
                  <option value="">Select entity type</option>
                  {masters.entityTypes.map((et) => (
                    <option key={et.id} value={et.id}>
                      {et.label}
                    </option>
                  ))}
                </select>
                {errors.entityType && (
                  <p className="mt-1 text-xs text-red-500">{errors.entityType}</p>
                )}
              </div>

              {/* Nature of Business */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Nature of Business *
                </label>
                <select
                  name="natureOfBusiness"
                  value={form.natureOfBusiness}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
                >
                  <option value="">Select nature</option>
                  {masters.natureOfBusiness.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
                {errors.natureOfBusiness && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.natureOfBusiness}
                  </p>
                )}
              </div>

              {/* Group Company */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Group Company (Parent)
                </label>
                <select
                  name="groupCompany"
                  value={form.groupCompany}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
                >
                  <option value="">-- none --</option>
                  {masters.companies.filter(c => !c.raw.groupCompany).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Registered Office Address" icon={MapPin}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <select
                  name="state"
                  value={form.addressDetails?.state || ""}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm text-sm bg-slate-50 outline-none"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  name="city"
                  value={form.addressDetails?.city || ""}
                  onChange={handleAddressChange}
                  placeholder="e.g. Mumbai"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm text-sm bg-slate-50 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Area / Location
                </label>
                <input
                  name="area"
                  value={form.addressDetails?.area || ""}
                  onChange={handleAddressChange}
                  placeholder="e.g. Bandra"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm text-sm bg-slate-50 outline-none"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Detailed Address
                </label>
                <textarea
                  name="fullAddress"
                  value={form.addressDetails?.fullAddress || ""}
                  onChange={handleAddressChange}
                  placeholder="Building Name, Street Name, Floor, etc."
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm text-sm resize-none bg-slate-50 outline-none"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Registration & Taxation" icon={Briefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Registration Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Registration Number
                </label>
                <input
                  name="registrationNumber"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
                />
              </div>

              {/* Date of Incorporation */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Date of Incorporation
                </label>
                <input
                  type="date"
                  name="dateOfIncorporation"
                  value={form.dateOfIncorporation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
                />
              </div>

              {/* TIN (TAN) */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  TIN (TAN)
                </label>
                <input
                  name="tin"
                  value={form.tin}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
                />
              </div>

              {/* PAN */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  PAN
                </label>
                <input
                  name="pan"
                  value={form.pan}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
                />
              </div>
            </div>

            {/* GST Numbers Section */}
            <div className="space-y-4 border-t border-slate-100 pt-6 mt-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  GST Number(s)
                </label>
                <button
                  type="button"
                  onClick={handleAddGst}
                  className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition border border-blue-100"
                >
                  + Add More
                </button>
              </div>

              <div className="space-y-3">
                {(form.gstList || []).map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 transition-transform">
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        State
                      </label>
                      <select
                        value={item.state}
                        onChange={(e) => handleGstChange(index, "state", e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm text-sm bg-white outline-none"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-7">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        GST Number
                      </label>
                      <input
                        value={item.gstNumber}
                        onChange={(e) => handleGstChange(index, "gstNumber", e.target.value)}
                        placeholder="22AAAAA0000A1Z5"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm text-sm outline-none bg-white"
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end md:justify-center pt-5">
                      {form.gstList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGst(index)}
                          className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-red-200"
                          title="Remove GST"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6M1 4h22M4 4h16" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Contact & Assignment" icon={Phone}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Contact Person */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Contact Person
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    placeholder="Name"
                    name="contactName"
                    value={form.contactName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none placeholder:text-slate-400"
                  />
                  <input
                    placeholder="Phone"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none placeholder:text-slate-400"
                  />
                  <input
                    placeholder="Email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.contactName && (
                  <p className="mt-1 text-xs text-red-500">{errors.contactName}</p>
                )}
                {errors.contactEmail && (
                  <p className="mt-1 text-xs text-red-500">{errors.contactEmail}</p>
                )}
              </div>

              {/* Assign Employee */}
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Assign Employee
                </label>
                <select
                  name="empAssign"
                  value={form.empAssign}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
                >
                  <option value="">Select accountant</option>
                  {masters.accountants.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.firstName} {a.lastName} — {a.employeeId}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SectionCard>

          {!form.groupCompany && (
            <SectionCard title="Visit Schedule" icon={Calendar}>
              <div className="space-y-5">
                <div className="flex justify-start items-center gap-3 border-b border-slate-100 pb-4">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({
                      ...prev,
                      scheduleType: "weekly",
                      monthlySchedule: { ...prev.monthlySchedule, days: [] }
                    }))}
                    className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      form.scheduleType === "weekly" ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-600/30 ring-offset-1" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Weekly Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({
                      ...prev,
                      scheduleType: "monthly",
                      visitSchedule: prev.visitSchedule.map(s => ({ ...s, enabled: false }))
                    }))}
                    className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                      form.scheduleType === "monthly" ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-600/30 ring-offset-1" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Monthly Schedule
                  </button>
                </div>

                {form.scheduleType === "weekly" ? (
                  <div className="overflow-hidden border border-slate-200/60 rounded-xl shadow-sm bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                        <tr className="border-b border-slate-100">
                          <th className="px-5 py-4 text-center w-16">Enable</th>
                          <th className="px-5 py-4">Visit Day</th>
                          <th className="px-5 py-4">From Time</th>
                          <th className="px-5 py-4">To Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {(form.visitSchedule || []).map((item, index) => (
                          <tr key={item.day} className={`hover:bg-blue-50/20 transition-colors ${item.enabled ? 'bg-blue-50/30' : ''}`}>
                            <td className="px-5 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={item.enabled}
                                onChange={(e) => handleVisitScheduleChange(index, "enabled", e.target.checked)}
                                className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                              />
                            </td>
                            <td className="px-5 py-4 font-semibold text-slate-700">{item.day}</td>
                            <td className="px-5 py-4">
                              <input
                                type="time"
                                disabled={!item.enabled}
                                value={item.fromTime || ""}
                                onChange={(e) => handleVisitScheduleChange(index, "fromTime", e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-full max-w-[150px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 outline-none"
                              />
                            </td>
                            <td className="px-5 py-4">
                              <input
                                type="time"
                                disabled={!item.enabled}
                                value={item.toTime || ""}
                                onChange={(e) => handleVisitScheduleChange(index, "toTime", e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-full max-w-[150px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 outline-none"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-5 bg-slate-50/50 p-6 rounded-xl border border-slate-200/60">
                    <div className="flex justify-between items-center">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Visit Days & Time
                      </label>
                      <button
                        type="button"
                        onClick={handleAddMonthlyDay}
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition border border-blue-100"
                      >
                        + Add Day
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(form.monthlySchedule?.days || []).map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md">
                          <div className="md:col-span-3">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 line-clamp-1">
                              Day / Date
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 5th, 15th"
                              value={item.day || ""}
                              onChange={(e) => handleMonthlyDayChange(index, "day", e.target.value)}
                              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div className="md:col-span-4">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                              From
                            </label>
                            <input
                              type="time"
                              value={item.fromTime || ""}
                              onChange={(e) => handleMonthlyDayChange(index, "fromTime", e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="md:col-span-4">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                              To
                            </label>
                            <input
                              type="time"
                              value={item.toTime || ""}
                              onChange={(e) => handleMonthlyDayChange(index, "toTime", e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="md:col-span-1 flex justify-center pt-5">
                            <button
                              type="button"
                              onClick={() => handleRemoveMonthlyDay(index)}
                              className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-red-200"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6M1 4h22M4 4h16" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                      {form.monthlySchedule?.days?.length === 0 && (
                        <div className="text-center py-6 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                          No recurring days added. Add a day to configure monthly schedule.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          <SectionCard title="Operations & Compliance" icon={CheckSquare}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compliance Status - Table Modal */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Compliance Status 
                </label>
                <button
                  type="button"
                  onClick={() => setShowComplianceModal(true)}
                  className="w-full px-4 py-3 bg-white text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition shadow-sm border border-slate-200 flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <FileBadge className="w-5 h-5 text-blue-500" />
                    Manage Compliances 
                  </span>
                  <span className="bg-blue-100 text-blue-700 py-0.5 px-2.5 rounded-full text-xs font-bold shadow-sm">
                    {selectedCompliances.length}
                  </span>
                </button>

                {showComplianceModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col m-4 border border-slate-100 animate-in zoom-in-95 duration-200">
                  {/* Modal Header */}
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Select Compliances</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Manage applicability lists easily</p>
                    </div>
                    <button onClick={() => setShowComplianceModal(false)} className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  
                  {/* Search */}
                  <div className="p-4 border-b border-gray-100 bg-white">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search compliances by name or type..." 
                        value={complianceSearch}
                        onChange={(e) => setComplianceSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                      />
                      <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                  </div>

                  {/* Table View */}
                  <div className="flex-1 overflow-y-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10">
                        <tr className="border-b border-gray-200">
                          <th className="px-6 py-3">Compliance Name</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Due Date Rule</th>
                          <th className="px-6 py-3">Frequency</th>
                          <th className="px-6 py-3 text-center">Select</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {masters.compliances
                          .filter(c => c.label.toLowerCase().includes(complianceSearch.toLowerCase()) || (c.raw?.typeOfCompliance || '').toLowerCase().includes(complianceSearch.toLowerCase()))
                          .map(c => {
                             const isChecked = (form.complianceStatus || []).includes(c.id);
                             return (
                                <tr key={c.id} className={`hover:bg-blue-50/30 transition-colors ${isChecked ? 'bg-blue-50/10' : ''}`}>
                                   <td className="px-6 py-4 font-medium text-gray-800">{c.label}</td>
                                   <td className="px-6 py-4 text-gray-500 text-xs">{c.raw?.typeOfCompliance || '-'}</td>
                                   <td className="px-6 py-4 text-gray-500 text-xs">{c.raw?.dueDateRule || '-'}</td>
                                   <td className="px-6 py-4 text-gray-500 text-xs">{c.raw?.frequency || '-'}</td>
                                   <td className="px-6 py-4 text-center">
                                      <input 
                                         type="checkbox" 
                                         checked={isChecked} 
                                         onChange={() => handleComplianceToggle(c.id)}
                                         className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                                      />
                                   </td>
                                </tr>
                             );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
                    <button onClick={() => setShowComplianceModal(false)} className="px-5 py-2 bg-gray-800 text-white rounded-lg font-bold text-sm shadow-md hover:bg-gray-700 transition">
                       Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

              {/* Task Applicability - Table Modal */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Task Applicability
                </label>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(true)}
                  className="w-full px-4 py-3 bg-white text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition shadow-sm border border-slate-200 flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-500" />
                    Manage Tasks
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 py-0.5 px-2.5 rounded-full text-xs font-bold shadow-sm">
                    {selectedTasks.length}
                  </span>
                </button>

                {showTaskModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col m-4 border border-slate-100 animate-in zoom-in-95 duration-200">
                      {/* Modal Header */}
                      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">Select Tasks</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Manage tasks that are applicable for this client</p>
                        </div>
                        <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      
                      {/* Search */}
                      <div className="p-4 border-b border-slate-100 bg-white">
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Search tasks by name or description..." 
                            value={taskSearch}
                            onChange={(e) => setTaskSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium outline-none"
                          />
                          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                      </div>

                      {/* Table View */}
                      <div className="flex-1 overflow-y-auto w-full">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10">
                            <tr className="border-b border-slate-200">
                              <th className="px-6 py-4 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-200 bg-slate-50">Task Name</th>
                              <th className="px-6 py-4 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-200 bg-slate-50">Description</th>
                              <th className="px-6 py-4 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-200 bg-slate-50">Due Date</th>
                              <th className="px-6 py-4 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-200 bg-slate-50">Frequency</th>
                              <th className="px-6 py-4 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-slate-200 bg-slate-50 text-center">Select</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-sm">
                            {masters.complianceTasks
                              .filter(t => t.label.toLowerCase().includes(taskSearch.toLowerCase()) || (t.raw?.description || '').toLowerCase().includes(taskSearch.toLowerCase()))
                              .map(t => {
                                 const isChecked = (form.taskApplicability || []).some(ta => String(ta.taskId) === t.id);
                                 const mapTask = (form.taskApplicability || []).find(ta => String(ta.taskId) === t.id) || {};
                                 return (
                                    <tr key={t.id} className={`hover:bg-emerald-50/30 transition-colors ${isChecked ? 'bg-emerald-50/10' : ''}`}>
                                       <td className="px-6 py-4 font-bold text-slate-800">{t.label}</td>
                                       <td className="px-6 py-4 text-slate-500 text-xs">{t.raw?.description || '-'}</td>
                                       <td className="px-6 py-4">
                                          {isChecked && (
                                             <input 
                                                type="date"
                                                value={mapTask.dueDate || ""}
                                                onChange={(e) => handleTaskDueDate(t.id, e.target.value)}
                                                className="px-2 py-1.5 border border-slate-200 rounded-md text-xs w-full max-w-[130px] shadow-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                             />
                                          )}
                                       </td>
                                       <td className="px-6 py-4">
                                          {isChecked && (
                                             <select
                                                value={mapTask.frequency || ""}
                                                onChange={(e) => handleTaskFrequency(t.id, e.target.value)}
                                                className="px-2 py-1.5 border border-slate-200 rounded-md text-xs bg-white w-full max-w-[130px] shadow-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                             >
                                                <option value="">-- inherit --</option>
                                                <option value="Monthly">Monthly</option>
                                                <option value="Quarterly">Quarterly</option>
                                                <option value="Half-Yearly">Half-Yearly</option>
                                                <option value="Yearly">Yearly</option>
                                             </select>
                                          )}
                                       </td>
                                       <td className="px-6 py-4 text-center">
                                          <input 
                                             type="checkbox" 
                                             checked={isChecked} 
                                             onChange={() => handleTaskToggle(t.id)}
                                             className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4 outline-none"
                                          />
                                       </td>
                                    </tr>
                                 );
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Modal Footer */}
                      <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
                        <button onClick={() => setShowTaskModal(false)} className="px-6 py-2.5 bg-slate-800 text-white rounded-lg font-bold text-sm shadow hover:bg-slate-700 transition">
                           Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Selected tasks with due dates */}
            {selectedTasks.length > 0 && (
              <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Selected Tasks Summary
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                      <tr className="border-b border-slate-100">
                        <th className="px-5 py-4">Task Name</th>
                        <th className="px-5 py-4">Due Date</th>
                        <th className="px-5 py-4">Frequency Override</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {selectedTasks.map((task) => {
                         const mapTask = (form.taskApplicability || []).find(t => String(t.taskId) === task.taskId) || {};
                         return (
                          <tr key={task.taskId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3 font-semibold text-sm text-slate-700">{task.label}</td>
                            <td className="px-5 py-3 text-sm text-slate-500">{mapTask.dueDate || <span className="text-slate-300 italic font-medium">Not set</span>}</td>
                            <td className="px-5 py-3 text-sm text-slate-500">{mapTask.frequency || <span className="text-slate-300 italic font-medium">Inherited</span>}</td>
                          </tr>
                         );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Additional Details" icon={FileText}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="dissolved">Dissolved</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Remarks
                </label>
                <input
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  placeholder="Any additional notes..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none"
                />
              </div>
            </div>
          </SectionCard>

          {/* Bottom Action Area */}
          <div className="flex items-center justify-end gap-4 pt-2 mb-8">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to discard your progress?")) {
                  if (clientId) window.history.back();
                  else setForm(generateEmptyClient());
                }
              }}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {loading ? "Saving..." : clientId ? "Update Client" : "Create Client"}
            </button>
          </div>

          {/* Generated Password */}
          {generatedPassword && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-800">
                <strong className="font-semibold">Generated password:</strong>{" "}
                <code className="px-2 py-1 bg-white rounded border border-emerald-300 text-emerald-900">
                  {generatedPassword}
                </code>
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Copy this now — it's shown only once (for security).
              </p>
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
