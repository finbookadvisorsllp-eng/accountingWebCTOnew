import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { complianceTaskAPI } from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";
import { Pencil, Trash2 } from "lucide-react";

export default function ViewComplianceTasks() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    complianceTaskAPI.getAll().then((res) => setData(res.data));
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this task master?")) return;
    await complianceTaskAPI.remove(id);
    setData((d) => d.filter((x) => x._id !== id));
  };

  return (
    <AdminLayout>
      <div className="bg-white border border-gray-300 rounded-lg shadow p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-base font-bold text-gray-800">
           Task Masters
          </h1>

          {isAdmin && (
            <Link
              to="/admin/compliance-tasks/create"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-xs rounded transition"
            >
              + Create
            </Link>
          )}
        </div>

        {/* Table – exact same bordered style as ViewCompliances */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs text-left">
            {/* Header */}
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Task Name
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Description
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Due Date
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Frequency
                </th>
                {isAdmin && (
                  <th className="border border-gray-300 px-3 py-2 font-bold text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="border border-gray-300 text-center py-4 text-gray-500"
                  >
                    No tasks available
                  </td>
                </tr>
              ) : (
                data.map((r) => (
                  <tr
                    key={r._id}
                    className={`hover:bg-gray-50 ${data.indexOf(r) % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="border border-gray-300 px-3 py-2 font-medium">
                      {r.taskName}
                    </td>

                    <td className="border border-gray-300 px-3 py-2 text-gray-600">
                      {r.description || "—"}
                    </td>

                    <td className="border border-gray-300 px-3 py-2 text-gray-400 italic">
                      Not configured
                    </td>

                    <td className="border border-gray-300 px-3 py-2 text-gray-400 italic">
                      Not configured
                    </td>

                    {isAdmin && (
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/compliance-tasks/${r._id}/edit`)
                            }
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => remove(r._id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
