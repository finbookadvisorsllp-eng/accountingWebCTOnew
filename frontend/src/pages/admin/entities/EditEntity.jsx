// src/pages/admin/entities/EditEntity.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { entityTypeAPI } from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";

export default function EditEntity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    entityTypeAPI
      .getOne(id)
      .then((res) => setForm(res.data))
      .catch(() => navigate("/admin/entities"));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await entityTypeAPI.update(id, form);
      navigate("/admin/entities");
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    }
  };

  if (!form) return <div className="p-6">Loading…</div>;

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">Edit Entity Type</h1>

        <form
          onSubmit={submit}
          className="bg-white shadow rounded p-6 space-y-4"
        >
          {error && <div className="text-red-600 text-sm">{error}</div>}

          <input
            value={form.entityType}
            onChange={(e) => setForm({ ...form, entityType: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            value={form.ownership}
            onChange={(e) => setForm({ ...form, ownership: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            value={form.applicableOwnership}
            onChange={(e) =>
              setForm({ ...form, applicableOwnership: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <select
            value={form.panClassification}
            onChange={(e) =>
              setForm({ ...form, panClassification: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          >
            {["P", "F", "C", "G", "A", "H", "T"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
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
