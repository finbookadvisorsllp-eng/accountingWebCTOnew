import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { candidateAPI } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import InterestedCandidateDetail from "./InterestedCandidateDetail";
import ExitedCandidateDetail from "./ExitedCandidateDetail";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveData, setApproveData] = useState({
    designation: "",
    dateOfJoining: "",
  });

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    try {
      const response = await candidateAPI.getCandidate(id);
      setCandidate(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch candidate details");
    } finally {
      setLoading(false);
    }
  };

  const handleAllowExited = async () => {
    if (!window.confirm("Allow this candidate to fill the exited form?"))
      return;

    setActionLoading(true);
    try {
      await candidateAPI.allowExited(id);
      toast.success("Candidate allowed to fill exited form");
      fetchCandidate();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update candidate",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approveData.designation || !approveData.dateOfJoining) {
      toast.error("Please provide designation and date of joining");
      return;
    }

    setActionLoading(true);
    try {
      const response = await candidateAPI.approveCandidate(id, approveData);
      toast.success(
        `Candidate approved! Employee ID: ${response.data.data.credentials.employeeId}, Password: ${response.data.data.credentials.temporaryPassword}`,
      );
      setShowApproveModal(false);
      fetchCandidate();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve candidate",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this candidate? This action cannot be undone.",
      )
    )
      return;

    setActionLoading(true);
    try {
      await candidateAPI.deleteCandidate(id);
      toast.success("Candidate deleted successfully");
      navigate("/admin/candidates");
    } catch (error) {
      toast.error("Failed to delete candidate");
    } finally {
      setActionLoading(false);
    }
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!candidate) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Candidate not found</p>
          <Link
            to="/admin/candidates"
            className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
          >
            Go back to candidates list
          </Link>
        </div>
      </AdminLayout>
    );
  }

  // Decide which detail component to render
  const isExitedCandidate =
    candidate.status === "EXITED" ||
    candidate.status === "APPROVED" ||
    candidate.status === "ACTIVE" ||
    candidate.detailedEducation?.length > 0 ||
    candidate.detailedWorkExperience?.length > 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header - modern, premium */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/candidates"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaArrowLeft className="text-lg text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {candidate.personalInfo?.firstName}{" "}
                {candidate.personalInfo?.lastName}
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    candidate.status,
                  )}`}
                >
                  {candidate.status}
                </span>
                {/* <span className="text-sm text-gray-500">
                  Profile: {candidate.profilePercentage}% Complete
                </span> */}
              </div>
            </div>
          </div>

          {/* Action Buttons - consistent, clean */}
          <div className="flex space-x-3">
            {candidate.status === "INTERESTED" && (
              <button
                onClick={handleAllowExited}
                disabled={actionLoading}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 shadow-sm"
              >
                Allow Exited Form
              </button>
            )}

            {candidate.status === "EXITED" && (
              <button
                onClick={() => setShowApproveModal(true)}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 shadow-sm"
              >
                Approve & Generate ID
              </button>
            )}

            {candidate.status === "APPROVED" && (
              <button
                onClick={() => navigate(`/admin/candidates/${id}/admin-edit`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
              >
                Update Admin Details
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Render the appropriate detail component */}
        {isExitedCandidate ? (
          <ExitedCandidateDetail candidate={candidate} />
        ) : (
          <InterestedCandidateDetail candidate={candidate} />
        )}
      </div>

      {/* Approve Modal (same as before) */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Approve Candidate
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={approveData.designation}
                  onChange={(e) =>
                    setApproveData({
                      ...approveData,
                      designation: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., Junior Accountant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Joining <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={approveData.dateOfJoining}
                  onChange={(e) =>
                    setApproveData({
                      ...approveData,
                      dateOfJoining: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
              >
                {actionLoading ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CandidateDetail;
