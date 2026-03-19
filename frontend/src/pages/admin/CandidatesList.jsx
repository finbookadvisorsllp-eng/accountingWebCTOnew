import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaSearch, FaFilter } from "react-icons/fa";
import { candidateAPI } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

const CandidatesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchCandidates();
  }, [filters, pagination.currentPage]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await candidateAPI.getCandidates({
        status: filters.status,
        search: filters.search,
        page: pagination.currentPage,
        limit: 10,
      });
      setCandidates(response.data.data);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const getStatusBadge = (status) => {
    const badges = {
      INTERESTED: "bg-yellow-100 text-yellow-800",
      ALLOWED_EXITED: "bg-orange-100 text-orange-800",
      EXITED: "bg-purple-100 text-purple-800",
      APPROVED: "bg-green-100 text-green-800",
      ACTIVE: "bg-blue-100 text-blue-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getProfileBadge = (percentage) => {
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <AdminLayout>
      <div className="bg-white border border-gray-300 rounded-lg shadow p-4">
        {/* Header - small & compact */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-bold text-gray-800">Candidates</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage all candidate applications
            </p>
          </div>
        </div>

        {/* Filters - compact */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                <FaSearch className="inline mr-1.5" />
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search by name, email, phone, employee ID..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                <FaFilter className="inline mr-1.5" />
                Status Filter
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">All Status</option>
                <option value="INTERESTED">Interested</option>
                <option value="ALLOWED_EXITED">Allowed Exited</option>
                <option value="EXITED,ALLOWED_EXITED">Exited</option>
                <option value="APPROVED">Approved</option>
                <option value="ACTIVE">Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Premium Bordered Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Candidate
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Contact
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Status
                </th>
                {/* <th className="border border-gray-300 px-3 py-2 font-bold">
                  Profile
                </th> */}
                <th className="border border-gray-300 px-3 py-2 font-bold">
                  Applied
                </th>
                <th className="border border-gray-300 px-3 py-2 font-bold text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="border border-gray-300 text-center py-8 text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : candidates.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="border border-gray-300 text-center py-8 text-gray-500 text-xs"
                  >
                    No candidates found
                  </td>
                </tr>
              ) : (
                candidates.map((candidate, index) => (
                  <tr
                    key={candidate._id}
                    className={`hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="border border-gray-300 px-3 py-2.5">
                      <div>
                        <p className="font-medium text-gray-900 text-xs">
                          {candidate.personalInfo?.firstName}{" "}
                          {candidate.personalInfo?.lastName}
                        </p>
                        {candidate.adminInfo?.employeeId && (
                          <p className="text-[10px] text-gray-500">
                            ID: {candidate.adminInfo.employeeId}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="border border-gray-300 px-3 py-2.5">
                      <div className="text-xs">
                        <p className="text-gray-900">
                          {candidate.contactInfo?.email || "N/A"}
                        </p>
                        <p className="text-gray-500">
                          {candidate.personalInfo?.primaryContact?.number ||
                            "N/A"}
                        </p>
                      </div>
                    </td>

                    <td className="border border-gray-300 px-3 py-2.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[10px] font-medium ${getStatusBadge(candidate.status)}`}
                      >
                        {candidate.status}
                      </span>
                    </td>

                    {/* <td className="border border-gray-300 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full transition-all"
                            style={{ width: `${candidate.profilePercentage}%` }}
                          ></div>
                        </div>
                        <span
                          className={`px-2 py-px rounded text-[10px] font-medium ${getProfileBadge(candidate.profilePercentage)}`}
                        >
                          {candidate.profilePercentage}%
                        </span>
                      </div>
                    </td> */}

                    <td className="border border-gray-300 px-3 py-2.5 text-xs text-gray-500">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </td>

                    <td className="border border-gray-300 px-3 py-2.5 text-center">
                      <Link
                        to={`/admin/candidates/${candidate._id}`}
                        className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                        title="View Profile"
                      >
                        <FaEye size={15} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - small */}
        {pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500 px-1">
            <div>
              Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
              {Math.min(pagination.currentPage * 10, pagination.total)} of{" "}
              {pagination.total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    currentPage: pagination.currentPage - 1,
                  })
                }
                disabled={pagination.currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition text-xs"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    currentPage: pagination.currentPage + 1,
                  })
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition text-xs"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CandidatesList;
  