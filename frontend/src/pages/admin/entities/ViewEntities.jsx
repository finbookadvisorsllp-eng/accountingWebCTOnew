import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { entityTypeAPI } from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";
import { Pencil, Trash2 } from "lucide-react";

const VALID_PAN = ["P", "F", "C", "G", "A", "H", "T"];

export default function ViewEntities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const load = async () => {
    setLoading(true);
    try {
      const res = await entityTypeAPI.getAll();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await entityTypeAPI.remove(id);
      setData((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="bg-white border border-gray-300 rounded-lg shadow p-4">
        {/* Header - same style as other master pages */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-bold text-gray-800">
              Master Entity Types
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage entity types and PAN classification
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/admin/entities/create"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-xs rounded transition"
            >
              + Create
            </Link>
          )}
        </div>

        {/* Table - exact same premium bordered style */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Entity Type
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Ownership
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Applicable Ownership
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  PAN
                </th>
                {isAdmin && (
                  <th className="border border-gray-300 px-3 py-2 font-bold text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="border border-gray-300 text-center py-4 text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="border border-gray-300 text-center py-4 text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row._id}
                    className={`hover:bg-gray-50 ${data.indexOf(row) % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="border border-gray-300 px-3 py-2 font-medium">
                      {row.entityType}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {row.ownership || "—"}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {row.applicableOwnership || "—"}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <span className="inline-flex items-center gap-2 border border-gray-300 px-2.5 py-1 rounded text-xs">
                        {row.panClassification}
                        {VALID_PAN.includes(row.panClassification) && (
                          <span className="text-green-600 text-xs">✔</span>
                        )}
                      </span>
                    </td>

                    {isAdmin && (
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/entities/${row._id}/edit`)
                            }
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(row._id)}
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
