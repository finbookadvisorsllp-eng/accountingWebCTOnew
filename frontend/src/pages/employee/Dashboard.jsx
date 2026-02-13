import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaCheckCircle, FaExclamationTriangle, FaSignOutAlt, FaCalculator } from 'react-icons/fa';
import { candidateAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await candidateAPI.getCandidate(user._id);
      setCandidate(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalConfirmation = async () => {
    if (!window.confirm('Are you sure you want to confirm and activate your profile? This action finalizes your onboarding.')) {
      return;
    }

    setConfirmLoading(true);
    try {
      await candidateAPI.finalConfirmation(user._id, {
        accuracyConfirmed: true,
        finalDigitalConfirmation: true
      });
      toast.success('Profile activated successfully! Welcome aboard!');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm profile');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Profile not found</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaCalculator className="text-3xl text-primary-600" />
              <span className="text-2xl font-bold text-gray-800">AccounTech Advisory</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {candidate.personalInfo?.firstName}!
              </h1>
              <p className="text-primary-100 text-lg">Employee ID: {candidate.adminInfo?.employeeId}</p>
            </div>
            <FaUser className="text-6xl opacity-50" />
          </div>
        </div>

        {/* Status Card */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-bold text-2xl text-primary-600">{candidate.profilePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-500"
                    style={{ width: `${candidate.profilePercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Current Status</span>
                  <span className={`px-4 py-2 rounded-full font-semibold ${
                    candidate.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {candidate.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-semibold text-lg">{candidate.adminInfo?.designation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Joining</p>
                <p className="font-semibold text-lg">
                  {candidate.adminInfo?.dateOfJoining 
                    ? new Date(candidate.adminInfo.dateOfJoining).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Your Profile Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold">{candidate.personalInfo?.firstName} {candidate.personalInfo?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-semibold">
                    {candidate.personalInfo?.dateOfBirth 
                      ? new Date(candidate.personalInfo.dateOfBirth).toLocaleDateString() 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-semibold">{candidate.personalInfo?.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{candidate.contactInfo?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{candidate.personalInfo?.primaryContact?.number || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Education & Experience</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Highest Qualification</p>
                  <p className="font-semibold">{candidate.education?.highestQualification || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year of Passing</p>
                  <p className="font-semibold">{candidate.education?.yearOfPassing || 'N/A'}</p>
                </div>
                {candidate.workExperience?.yearsOfExperience && (
                  <div>
                    <p className="text-sm text-gray-600">Years of Experience</p>
                    <p className="font-semibold">{candidate.workExperience.yearsOfExperience} years</p>
                  </div>
                )}
                {candidate.workExperience?.jobTitle && (
                  <div>
                    <p className="text-sm text-gray-600">Previous Position</p>
                    <p className="font-semibold">{candidate.workExperience.jobTitle}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        {candidate.status === 'APPROVED' && !candidate.finalConfirmation?.finalDigitalConfirmation && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-4">
              <FaExclamationTriangle className="text-4xl text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Action Required</h2>
                <p className="text-gray-700 mb-4">
                  Please review your profile information above carefully. Once you confirm, your profile will be activated and you'll be officially onboarded as an employee.
                </p>
                <div className="space-y-3 mb-6">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded" />
                    <span className="text-gray-700">I have reviewed all my information and confirm it is accurate</span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded" />
                    <span className="text-gray-700">I understand that this action will finalize my onboarding process</span>
                  </label>
                </div>
                <button
                  onClick={handleFinalConfirmation}
                  disabled={confirmLoading}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {confirmLoading ? 'Confirming...' : 'Confirm & Activate Profile'}
                </button>
              </div>
            </div>
          </div>
        )}

        {candidate.status === 'ACTIVE' && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-4">
              <FaCheckCircle className="text-4xl text-green-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Active!</h2>
                <p className="text-gray-700 mb-2">
                  Congratulations! Your profile has been successfully activated. Welcome to the AccounTech Advisory team!
                </p>
                <p className="text-sm text-gray-600">
                  Activated on: {candidate.finalConfirmation?.confirmedAt 
                    ? new Date(candidate.finalConfirmation.confirmedAt).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
