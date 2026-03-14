import React, { useEffect, useState } from "react";
import { clientAPI } from "../../../services/api";
import { Link } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const res = await clientAPI.getClients();
      setClients(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="w-full px-6 py-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
              Clients
            </h2>

            <Link
              to="/admin/clients/create"
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all"
            >
              + Add Client
            </Link>
          </div>

          {/* Table Wrapper */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-[12px] text-gray-700">
              {/* Table Head */}
              <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="border border-gray-200 px-3 py-3 text-left">
                    Entity
                  </th>
                  <th className="border border-gray-200 px-3 py-3 text-left">
                    Accountant
                  </th>
                  <th className="border border-gray-200 px-3 py-3 text-left">
                    Entity Type
                  </th>
                  <th className="border border-gray-200 px-3 py-3 text-left">
                    Nature
                  </th>
                  <th className="border border-gray-200 px-3 py-3 text-left">
                    GST
                  </th>
                  <th className="border border-gray-200 px-3 py-3 text-left">
                    PAN
                  </th>
                  <th className="border border-gray-200 px-3 py-3 text-left">
                    Visit Days
                  </th>
                  <th className="border border-gray-200 px-3 py-3 text-left">
                    Status
                  </th>
                  <th className="border border-gray-200 px-3 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-6 text-gray-400 border"
                    >
                      Loading clients...
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-6 text-gray-400 border"
                    >
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr
                      key={client._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="border border-gray-200 px-3 py-3 font-medium text-gray-800">
                        {client.entityName}
                        <div className="text-[10px] text-gray-400">
                          {client.registrationNumber}
                        </div>
                      </td>

                      <td className="border border-gray-200 px-3 py-3">
                        {client.empAssign
                          ? `${client.empAssign.personalInfo?.firstName || ""} ${
                              client.empAssign.personalInfo?.lastName || ""
                            }`
                          : "-"}
                      </td>

                      <td className="border border-gray-200 px-3 py-3">
                        {client.entityType?.entityType || "-"}
                      </td>

                      <td className="border border-gray-200 px-3 py-3">
                        {client.natureOfBusiness?.natureOfBusiness || "-"}
                      </td>

                      <td className="border border-gray-200 px-3 py-3">
                        {client.gst || "-"}
                      </td>

                      <td className="border border-gray-200 px-3 py-3">
                        {client.pan || "-"}
                      </td>

                      <td className="border border-gray-200 px-3 py-3">
                        {client.visitDays?.length > 0
                          ? client.visitDays.join(", ")
                          : "-"}
                      </td>

                      <td className="border border-gray-200 px-3 py-3">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-medium ${
                            client.status === "active"
                              ? "bg-green-100 text-green-700"
                              : client.status === "inactive"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>

                      <td className="border border-gray-200 px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/clients/${client._id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors group"
                            title="View Details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            to={`/admin/clients/edit/${client._id}`}
                            className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-md transition-colors group"
                            title="Edit Client"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
