import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { complianceTaskAPI } from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";

export default function EditComplianceTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    complianceTaskAPI.getOne(id).then((res) => setForm(res.data));
  }, [id]);

  if (!form) return <div className="p-6">Loading…</div>;

  const submit = async (e) => {
    e.preventDefault();
    await complianceTaskAPI.update(id, {
      taskName: form.taskName,
      description: form.description,
    });
    navigate("/admin/compliance-tasks");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">Edit Compliance Task</h1>

        <form
          className="bg-white shadow rounded p-6 space-y-4"
          onSubmit={submit}
        >
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.taskName}
            onChange={(e) => setForm({ ...form, taskName: e.target.value })}
          />

          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/compliance-tasks")}
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
