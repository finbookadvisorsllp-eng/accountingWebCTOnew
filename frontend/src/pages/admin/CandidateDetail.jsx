import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { candidateAPI } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/candidates"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {candidate.personalInfo?.firstName}{" "}
                {candidate.personalInfo?.lastName}
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(candidate.status)}`}
                >
                  {candidate.status}
                </span>
                <span className="text-sm text-gray-600">
                  Profile: {candidate.profilePercentage}% Complete
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {candidate.status === "INTERESTED" && (
              <button
                onClick={handleAllowExited}
                disabled={actionLoading}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold disabled:opacity-50"
              >
                Allow Exited Form
              </button>
            )}

            {candidate.status === "EXITED" && (
              <button
                onClick={() => setShowApproveModal(true)}
                disabled={actionLoading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
              >
                Approve & Generate ID
              </button>
            )}

            {/* Only show the update admin details button if the candidate is approved */}
            {candidate.status === "APPROVED" && (
              <button
                onClick={() => navigate(`/admin/candidates/${id}/admin-edit`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Update Admin Details
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-2xl" />
              <div>
                <p className="text-primary-100 text-sm">Email</p>
                <p className="font-semibold">
                  {candidate.contactInfo?.email || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-2xl" />
              <div>
                <p className="text-primary-100 text-sm">Phone</p>
                <p className="font-semibold">
                  {candidate.personalInfo?.primaryContact?.number || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaUser className="text-2xl" />
              <div>
                <p className="text-primary-100 text-sm">Employee ID</p>
                <p className="font-semibold">
                  {candidate.adminInfo?.employeeId || "Not Generated"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Resume Section */}
          {candidate.documents?.resume && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                Uploaded Resume
              </h2>

              <a
                href={`http://localhost:5000${candidate.documents.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                View Resume
              </a>
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
              Personal Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-semibold">
                  {candidate.personalInfo?.firstName}{" "}
                  {candidate.personalInfo?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-semibold">
                  {candidate.personalInfo?.dateOfBirth
                    ? new Date(
                        candidate.personalInfo.dateOfBirth,
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-semibold">
                  {candidate.personalInfo?.gender || "N/A"}
                </p>
              </div>
              {candidate.exitedPersonalInfo?.maritalStatus && (
                <div>
                  <p className="text-sm text-gray-600">Marital Status</p>
                  <p className="font-semibold">
                    {candidate.exitedPersonalInfo.maritalStatus}
                  </p>
                </div>
              )}
              {candidate.exitedPersonalInfo?.nationality && (
                <div>
                  <p className="text-sm text-gray-600">Nationality</p>
                  <p className="font-semibold">
                    {candidate.exitedPersonalInfo.nationality}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          {candidate.education && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                Education
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Highest Qualification</p>
                  <p className="font-semibold">
                    {candidate.education.highestQualification || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year of Passing</p>
                  <p className="font-semibold">
                    {candidate.education.yearOfPassing || "N/A"}
                  </p>
                </div>
                {candidate.education.certifications?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Certifications</p>
                    <ul className="list-disc list-inside">
                      {candidate.education.certifications.map((cert, index) => (
                        <li key={index} className="font-semibold">
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Education (if exited) */}
        {candidate.detailedEducation?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
              Detailed Education
            </h2>
            <div className="space-y-4">
              {candidate.detailedEducation.map((edu, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Level</p>
                      <p className="font-semibold">{edu.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Degree</p>
                      <p className="font-semibold">{edu.degree}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Institution</p>
                      <p className="font-semibold">{edu.institution}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year & Percentage</p>
                      <p className="font-semibold">
                        {edu.yearOfPassing} - {edu.percentage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {candidate.detailedWorkExperience?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
              Work Experience
            </h2>
            <div className="space-y-4">
              {candidate.detailedWorkExperience.map((work, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-semibold">{work.employerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Position</p>
                      <p className="font-semibold">{work.jobTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">
                        {work.startDate &&
                          new Date(work.startDate).toLocaleDateString()}{" "}
                        -
                        {work.endDate
                          ? new Date(work.endDate).toLocaleDateString()
                          : "Present"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Responsibilities</p>
                      <p className="font-semibold">{work.responsibilities}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Interests */}
        {candidate.professionalInterests && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
              Professional Interests
            </h2>
            <div className="space-y-4">
              {candidate.professionalInterests.whyJoinTeam && (
                <div>
                  <p className="text-sm text-gray-600">Why Join Our Team</p>
                  <p className="font-semibold">
                    {candidate.professionalInterests.whyJoinTeam}
                  </p>
                </div>
              )}
              {candidate.professionalInterests.longTermGoals && (
                <div>
                  <p className="text-sm text-gray-600">Long-term Goals</p>
                  <p className="font-semibold">
                    {candidate.professionalInterests.longTermGoals}
                  </p>
                </div>
              )}
              {candidate.professionalInterests.availabilityToJoin && (
                <div>
                  <p className="text-sm text-gray-600">Availability</p>
                  <p className="font-semibold">
                    {candidate.professionalInterests.availabilityToJoin}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Approve Candidate
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  placeholder="e.g., Junior Accountant"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
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
