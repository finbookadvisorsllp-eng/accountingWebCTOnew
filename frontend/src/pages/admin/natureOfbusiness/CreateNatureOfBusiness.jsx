import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { natureOfBusinessAPI } from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";

/* ================= STATIC OPTIONS ================= */

const BUSINESS_GROUPS = [
  "Retail & Wholesale Trading",
  "E-Commerce",
  "Manufacturer",
  "Service Provided",
];

const COMPLEXITY_OPTIONS = [
  {
    label: "Low",
    hint: "Limited transactions, minimal compliance",
  },
  {
    label: "Moderate",
    hint: "Inventory sync, multi-location accounting",
  },
  {
    label: "High",
    hint: "High compliance, complex reporting",
  },
  {
    label: "Very High",
    hint: "Heavy compliance & regulatory burden",
  },
];

/* ================= COMPONENT ================= */

export default function CreateNatureOfBusiness() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessGroup: "",
    natureOfBusiness: "",
    description: "",
    operationalComplexity: "Low",
    difficultyScore: 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* Submit form */
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await natureOfBusinessAPI.create(form);
      navigate("/admin/nature-of-business");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Create Nature of Business</h1>
          <button
            onClick={() => navigate("/admin/nature-of-business")}
            className="px-4 py-2 border rounded text-sm"
          >
            Back
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={submit}
          className="bg-white shadow rounded p-6 space-y-4"
        >
          {error && <div className="text-red-600 text-sm">{error}</div>}

          {/* Business Group */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Business Group
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. Retail & Wholesale Trading"
              value={form.businessGroup}
              onChange={(e) =>
                setForm({ ...form, businessGroup: e.target.value })
              }
              required
            />
          </div>

          {/* Nature of Business */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nature of Business
            </label>
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. Franchise Retail Store"
              value={form.natureOfBusiness}
              onChange={(e) =>
                setForm({
                  ...form,
                  natureOfBusiness: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              rows={3}
              placeholder="Short description of the business nature"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* Operational Complexity */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Operational / Transaction Complexity
            </label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={form.operationalComplexity}
              onChange={(e) =>
                setForm({
                  ...form,
                  operationalComplexity: e.target.value,
                })
              }
              required
            >
              {COMPLEXITY_OPTIONS.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label} — {c.hint}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Score */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Difficulty Score
            </label>
            <input
              type="number"
              min="0"
              className="w-full border px-3 py-2 rounded"
              value={form.difficultyScore}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficultyScore: Number(e.target.value),
                })
              }
            />
            <p className="text-xs text-gray-400 mt-1">
              Default is 0. You can adjust later in edit mode.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {saving ? "Saving…" : "Create"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/nature-of-business")}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
