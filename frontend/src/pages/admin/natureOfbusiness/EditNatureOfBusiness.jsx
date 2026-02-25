import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { natureOfBusinessAPI } from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";

/* ================= STATIC OPTIONS ================= */

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

export default function EditNatureOfBusiness() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* Load existing record */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await natureOfBusinessAPI.getOne(id);
        if (!mounted) return;

        setForm({
          businessGroup: res.data.businessGroup || "",
          natureOfBusiness: res.data.natureOfBusiness || "",
          description: res.data.description || "",
          operationalComplexity: res.data.operationalComplexity || "Low",
          difficultyScore: res.data.difficultyScore ?? 0,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load record");
        navigate("/admin/nature-of-business");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, navigate]);

  /* Submit update */
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await natureOfBusinessAPI.update(id, form);
      navigate("/admin/nature-of-business");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  if (!form) {
    return <div className="p-6 text-red-600">Unable to load data</div>;
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Edit Nature of Business</h1>
          <button
            onClick={() => navigate("/admin/nature-of-business")}
            className="px-4 py-2 border rounded text-sm bg-green-100 text-green-600"
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
              Default is 0. Can be updated later.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {saving ? "Saving…" : "Save Changes"}
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
