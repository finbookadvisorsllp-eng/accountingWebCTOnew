import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { natureOfBusinessAPI } from "../../../services/api";
import AdminLayout from "../../../components/AdminLayout";
import { Pencil, Trash2 } from "lucide-react";

export default function ViewNatureOfBusiness() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    natureOfBusinessAPI.getAll().then((res) => setData(res.data));
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this record?")) return;
    await natureOfBusinessAPI.remove(id);
    setData((d) => d.filter((x) => x._id !== id));
  };

  return (
    <AdminLayout>
      <div className="bg-white border border-gray-300 rounded-lg shadow p-4">
        {/* Header - matching all other master pages */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-base font-bold text-gray-800">
            Nature of Business
          </h1>

          {isAdmin && (
            <Link
              to="/admin/nature-of-business/create"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-xs rounded transition"
            >
              + Create
            </Link>
          )}
        </div>

        {/* Table - exact same premium bordered grid style */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Business Group
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Nature
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Description
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Complexity
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Difficulty
                </th>
                {isAdmin && (
                  <th className="border border-gray-300 px-3 py-2 font-bold text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 6 : 5}
                    className="border border-gray-300 text-center py-4 text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((r, index) => (
                  <tr
                    key={r._id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="border border-gray-300 px-3 py-2">
                      {r.businessGroup}
                    </td>

                    <td className="border border-gray-300 px-3 py-2">
                      {r.natureOfBusiness}
                    </td>

                    <td className="border border-gray-300 px-3 py-2 max-w-xs">
                      {r.description ? (
                        <p
                          className="text-gray-600 text-xs line-clamp-2"
                          title={r.description}
                        >
                          {r.description}
                        </p>
                      ) : (
                        <span className="text-gray-400 italic text-xs">
                          No description
                        </span>
                      )}
                    </td>

                    <td className="border border-gray-300 px-3 py-2">
                      {r.operationalComplexity}
                    </td>

                    <td className="border border-gray-300 px-3 py-2">
                      {r.difficultyScore}
                    </td>

                    {isAdmin && (
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/nature-of-business/${r._id}/edit`,
                              )
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
