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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ---------- helpers ---------- */

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
    registeredOfficeAddress: "",
    natureOfBusiness: "",
    tin: "",
    gst: "",
    pan: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    complianceStatus: [],
    taskApplicability: [],
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
          natureOfBusiness: c.natureOfBusiness?._id
            ? String(c.natureOfBusiness._id)
            : c.natureOfBusiness
              ? String(c.natureOfBusiness)
              : "",
          tin: c.tin || "",
          gst: c.gst || "",
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
      <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 tracking-tight">
          {clientId ? "Edit Client" : "Create Client"}
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Entity Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Entity Name *
            </label>
            <input
              name="entityName"
              value={form.entityName}
              onChange={handleChange}
              placeholder="Official legal name"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
            />
            {errors.entityName && (
              <p className="mt-1 text-xs text-red-500">{errors.entityName}</p>
            )}
          </div>

          {/* Entity Type, Nature of Business, Group Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Entity Type *
              </label>
              <select
                name="entityType"
                value={form.entityType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm bg-white"
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

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Nature of Business *
              </label>
              <select
                name="natureOfBusiness"
                value={form.natureOfBusiness}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm bg-white"
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

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Group Company (Parent)
              </label>
              {/* i want group company to be optional and if selected then it should be stored as a string and if not selected then it should be stored as null and in the dropdown should be show name not id */}
              <select
                name="groupCompany"
                value={form.groupCompany}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm bg-white"
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

          {/* Registration Number */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Registration Number
            </label>
            <input
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
            />
          </div>

          {/* Date of Incorporation & Registered Office Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Date of Incorporation
              </label>
              <input
                type="date"
                name="dateOfIncorporation"
                value={form.dateOfIncorporation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Registered Office Address
              </label>
              <input
                name="registeredOfficeAddress"
                value={form.registeredOfficeAddress}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
              />
            </div>
          </div>

          {/* TIN, GST, PAN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                TIN (TAN)
              </label>
              <input
                name="tin"
                value={form.tin}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                GST Number
              </label>
              <input
                name="gst"
                value={form.gst}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                PAN
              </label>
              <input
                name="pan"
                value={form.pan}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
              />
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Contact Person
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                placeholder="Name"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
              />
              <input
                placeholder="Phone"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
              />
              <input
                placeholder="Email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
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
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Assign Employee / Accountant
            </label>
            <select
              name="empAssign"
              value={form.empAssign}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm bg-white"
            >
              <option value="">Select accountant</option>
              {masters.accountants.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.firstName} {a.lastName} — {a.employeeId}
                </option>
              ))}
            </select>
          </div>

          {!form.groupCompany && (
            <>
              {/* Visit Time */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Visit Time
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider ml-1 mb-1">
                    from
                  </label>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1  ml-1">
                    to
                  </label>

                  <input
                    type="time"
                    name="visitTimeFrom"
                    value={form.visitTimeFrom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
                  />
                  <input
                    type="time"
                    name="visitTimeTo"
                    value={form.visitTimeTo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
                  />
                </div>
              </div>

              {/* Visit Days */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Visit Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => {
                    const isActive =
                      Array.isArray(form.visitDays) && form.visitDays.includes(d);
                    return (
                      <label
                        key={d}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full border text-sm cursor-pointer transition-all ${
                          isActive
                            ? "bg-blue-500 text-white border-blue-500 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="visitDays"
                          value={d}
                          checked={isActive}
                          onChange={handleChange}
                          className="hidden"
                        />
                        {d}
                      </label>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Compliance Status - Table Modal */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Compliance Status 
            </label>
            <button
              type="button"
              onClick={() => setShowComplianceModal(true)}
              className="px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition shadow-sm border border-blue-200 flex items-center space-x-2"
            >
              <span>Manage Compliances ({selectedCompliances.length} selected)</span>
            </button>

            {showComplianceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col m-4 border border-gray-100 animate-in zoom-in-95 duration-200">
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
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Task Applicability
            </label>
            <button
              type="button"
              onClick={() => setShowTaskModal(true)}
              className="px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-100 transition shadow-sm border border-blue-200 flex items-center space-x-2"
            >
              <span>Manage Tasks ({selectedTasks.length} selected)</span>
            </button>

            {showTaskModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col m-4 border border-gray-100 animate-in zoom-in-95 duration-200">
                  {/* Modal Header */}
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Select Tasks</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Manage tasks that are applicable for this client</p>
                    </div>
                    <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  
                  {/* Search */}
                  <div className="p-4 border-b border-gray-100 bg-white">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search tasks by name or description..." 
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
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
                          <th className="px-6 py-3">Task Name</th>
                          <th className="px-6 py-3">Description</th>
                          <th className="px-6 py-3">Due Date</th>
                          <th className="px-6 py-3">Frequency</th>
                          <th className="px-6 py-3 text-center">Select</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {masters.complianceTasks
                          .filter(t => t.label.toLowerCase().includes(taskSearch.toLowerCase()) || (t.raw?.description || '').toLowerCase().includes(taskSearch.toLowerCase()))
                          .map(t => {
                             const isChecked = (form.taskApplicability || []).some(ta => String(ta.taskId) === t.id);
                             const mapTask = (form.taskApplicability || []).find(ta => String(ta.taskId) === t.id) || {};
                             return (
                                <tr key={t.id} className={`hover:bg-blue-50/30 transition-colors ${isChecked ? 'bg-blue-50/10' : ''}`}>
                                   <td className="px-6 py-4 font-medium text-gray-800">{t.label}</td>
                                   <td className="px-6 py-4 text-gray-500 text-xs">{t.raw?.description || '-'}</td>
                                   <td className="px-6 py-4">
                                      {isChecked && (
                                         <input 
                                            type="date"
                                            value={mapTask.dueDate || ""}
                                            onChange={(e) => handleTaskDueDate(t.id, e.target.value)}
                                            className="px-2 py-1 border border-gray-200 rounded text-xs w-full max-w-[120px]"
                                         />
                                      )}
                                   </td>
                                   <td className="px-6 py-4">
                                      {isChecked && (
                                         <select
                                            value={mapTask.frequency || ""}
                                            onChange={(e) => handleTaskFrequency(t.id, e.target.value)}
                                            className="px-2 py-1 border border-gray-200 rounded text-xs bg-white w-full max-w-[120px]"
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
                    <button onClick={() => setShowTaskModal(false)} className="px-5 py-2 bg-gray-800 text-white rounded-lg font-bold text-sm shadow-md hover:bg-gray-700 transition">
                       Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected tasks with due dates */}
          {selectedTasks.length > 0 && (
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Summary of Selected Tasks
              </p>
              <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-4 py-3">Task Name</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Frequency Override</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {selectedTasks.map((task) => {
                       const mapTask = (form.taskApplicability || []).find(t => String(t.taskId) === task.taskId) || {};
                       return (
                        <tr key={task.taskId} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-sm text-gray-700">{task.label}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{mapTask.dueDate || "-"}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{mapTask.frequency || "-"}</td>
                        </tr>
                       );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Status and Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="dissolved">Dissolved</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Remarks
              </label>
              <input
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : clientId
                  ? "Update Client"
                  : "Create Client"}
            </button>
            <button
              type="button"
              onClick={() => setForm(generateEmptyClient())}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
            >
              Reset
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
