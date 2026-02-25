import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { complianceTaskAPI } from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";

export default function CreateComplianceTask() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    taskName: "",
    description: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    await complianceTaskAPI.create(form);
    navigate("/admin/compliance-tasks");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">Create Task</h1>

        <form
          className="bg-white shadow rounded p-6 space-y-4"
          onSubmit={submit}
        >
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Task Name"
            required
            onChange={(e) => setForm({ ...form, taskName: e.target.value })}
          />

          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Description"
            rows={4}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Create
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
