import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
          <button
            onClick={() => navigate("/admin/candidates")}
            className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
          >
            Go back to candidates list
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Decide which detail component to render
  const isExitedCandidate =
    candidate.status === "EXITED" ||
    candidate.status === "ALLOWED_EXITED" ||
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
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaArrowLeft className="text-lg text-gray-600" />
            </button>
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
                {candidate.adminInfo?.employeeId && (
                  <span className="text-sm text-gray-500 font-mono">
                    {candidate.adminInfo.employeeId}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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

            {(["APPROVED", "ACTIVE", "EXITED", "ALLOWED_EXITED"].includes(candidate.status)) && (
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
    </AdminLayout>
  );
};

export default CandidateDetail;
