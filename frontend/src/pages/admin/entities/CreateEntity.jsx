// src/pages/admin/entities/CreateEntity.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { entityTypeAPI } from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";

const PAN_OPTIONS = [
  ["P", "Proprietor"],
  ["F", "Firm / LLP"],
  ["C", "Company"],
  ["G", "Government"],
  ["A", "AOP"],
  ["H", "HUF"],
  ["T", "Trust"],
];

export default function CreateEntity() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    entityType: "",
    ownership: "",
    applicableOwnership: "",
    panClassification: "P",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await entityTypeAPI.create(form);
      navigate("/admin/entities");
    } catch (err) {
      setError(err?.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">
          Create Master Entity Type
        </h1>

        <form
          onSubmit={submit}
          className="bg-white shadow rounded p-6 space-y-4"
        >
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <input
            placeholder="Entity Type"
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setForm({ ...form, entityType: e.target.value })}
            required
          />

          <input
            placeholder="Ownership"
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setForm({ ...form, ownership: e.target.value })}
          />

          <input
            placeholder="Applicable Ownership"
            className="w-full border px-3 py-2 rounded"
            onChange={(e) =>
              setForm({ ...form, applicableOwnership: e.target.value })
            }
          />

          <select
            className="w-full border px-3 py-2 rounded"
            onChange={(e) =>
              setForm({ ...form, panClassification: e.target.value })
            }
          >
            {PAN_OPTIONS.map(([c, l]) => (
              <option key={c} value={c}>
                {c} – {l}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Saving…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/entities")}
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
