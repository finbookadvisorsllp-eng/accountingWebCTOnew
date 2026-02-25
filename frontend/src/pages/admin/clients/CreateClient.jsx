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
  const [showComplianceDropdown, setShowComplianceDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);

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
          .filter(
            (c) =>
              c?.adminInfo?.designation?.toLowerCase() === "advisor" &&
              c?.status === "ACTIVE",
          )
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
            "companyName",
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
          { taskId: sId, dueDate: "" },
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
              <select
                name="groupCompany"
                value={form.groupCompany}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm bg-white"
              >
                <option value="">-- none --</option>
                {masters.companies.map((c) => (
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

          {/* Compliance Status - Dropdown */}
          <div ref={complianceRef} className="relative">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Compliance Status (select multiple)
            </label>
            <button
              type="button"
              onClick={() => setShowComplianceDropdown(!showComplianceDropdown)}
              className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg bg-white shadow-sm flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <span className="text-sm text-gray-700 truncate">
                {selectedCompliances.length > 0
                  ? selectedCompliances.map((c) => c.label).join(", ")
                  : "Select compliances..."}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  showComplianceDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showComplianceDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {masters.compliances.map((c) => {
                  const checked = (form.complianceStatus || []).includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleComplianceToggle(c.id)}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{c.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Task Applicability - Dropdown */}
          <div ref={taskRef} className="relative">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Task Applicability (select tasks and set due dates)
            </label>
            <button
              type="button"
              onClick={() => setShowTaskDropdown(!showTaskDropdown)}
              className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg bg-white shadow-sm flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <span className="text-sm text-gray-700 truncate">
                {selectedTasks.length > 0
                  ? selectedTasks.map((t) => t.label).join(", ")
                  : "Select tasks..."}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  showTaskDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showTaskDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {masters.complianceTasks.map((t) => {
                  const checked = (form.taskApplicability || []).some(
                    (ta) => String(ta.taskId) === t.id,
                  );
                  return (
                    <label
                      key={t.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleTaskToggle(t.id)}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{t.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected tasks with due dates */}
          {selectedTasks.length > 0 && (
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Dates for Selected Tasks
              </p>
              {selectedTasks.map((task) => (
                <div
                  key={task.taskId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                    {task.label}
                  </span>
                  <input
                    type="date"
                    value={task.dueDate || ""}
                    onChange={(e) =>
                      handleTaskDueDate(task.taskId, e.target.value)
                    }
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm"
                  />
                </div>
              ))}
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
