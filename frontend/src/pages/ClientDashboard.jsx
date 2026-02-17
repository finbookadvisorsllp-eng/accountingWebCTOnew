import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBuilding, 
  FaUser,
  FaEnvelope,
  FaPhone,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowRight
} from 'react-icons/fa';
import useDashboardStore from '../store/dashboardStore';
import useAuthStore from '../store/authStore';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { dashboardData, isLoading } = useDashboardStore();
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const data = dashboardData || {};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-green-100 mt-1">Client Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">My Businesses</p>
              <p className="text-3xl font-bold text-gray-900">{data.summary?.totalBusinesses || 0}</p>
              <p className="text-sm text-green-600">
                {data.summary?.activeBusinesses || 0} active
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaBuilding className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">GST Status</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xl font-bold text-gray-900">
                  {data.summary?.complianceSummary?.gst?.filed || 0}
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-sm text-gray-600">
                  {data.summary?.complianceSummary?.gst?.filed + data.summary?.complianceSummary?.gst?.pending + data.summary?.complianceSummary?.gst?.overdue || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">filed</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaCheckCircle className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Income Tax</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xl font-bold text-gray-900">
                  {data.summary?.complianceSummary?.incomeTax?.filed || 0}
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-sm text-gray-600">
                  {data.summary?.complianceSummary?.incomeTax?.filed + data.summary?.complianceSummary?.incomeTax?.pending + data.summary?.complianceSummary?.incomeTax?.overdue || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">filed</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaCheckCircle className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance</p>
              <div className="mt-1">
                <span className="text-lg font-bold text-green-600">
                  {data.summary?.complianceSummary?.gst?.filed + data.summary?.complianceSummary?.incomeTax?.filed || 0}
                </span>
                <span className="text-sm text-gray-600"> / </span>
                <span className="text-sm text-gray-600">
                  {data.summary?.complianceSummary?.gst?.pending + data.summary?.complianceSummary?.gst?.overdue + data.summary?.complianceSummary?.incomeTax?.pending + data.summary?.complianceSummary?.incomeTax?.overdue || 0} pending
                </span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaClock className="text-2xl text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Accountant */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Accountant</h3>
          {data.assignedAccountant ? (
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-green-600 font-bold">
                  {data.assignedAccountant.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {data.assignedAccountant.name}
                </p>
                {data.assignedAccountant.employeeId && (
                  <p className="text-sm text-gray-600">
                    ID: {data.assignedAccountant.employeeId}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <FaEnvelope className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-600">{data.assignedAccountant.email}</span>
                </div>
                {data.assignedAccountant.phone && (
                  <div className="flex items-center space-x-2 mt-1">
                    <FaPhone className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">{data.assignedAccountant.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaUser className="mx-auto text-gray-300 text-4xl mb-2" />
              <p className="text-gray-500">No accountant assigned yet</p>
            </div>
          )}
        </div>

        {/* Contact Person */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
          {data.clientProfile ? (
            <div className="space-y-3">
              {data.clientProfile.contactPerson && (
                <div>
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="font-medium text-gray-900">
                    {data.clientProfile.contactPerson.name}
                  </p>
                  {data.clientProfile.contactPerson.designation && (
                    <p className="text-sm text-gray-600">
                      {data.clientProfile.contactPerson.designation}
                    </p>
                  )}
                </div>
              )}
              {data.clientProfile.companyDetails && (
                <div>
                  <p className="text-sm text-gray-600">Company Type</p>
                  <p className="font-medium text-gray-900">
                    {data.clientProfile.companyDetails.companyType || 'N/A'}
                  </p>
                </div>
              )}
              {data.clientProfile.complianceDetails?.panNumber && (
                <div>
                  <p className="text-sm text-gray-600">PAN Number</p>
                  <p className="font-medium text-gray-900 uppercase">
                    {data.clientProfile.complianceDetails.panNumber}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No profile information available</p>
          )}
        </div>
      </div>

      {/* Businesses */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">My Businesses</h3>
          <button
            onClick={() => navigate('/businesses')}
            className="text-sm text-green-600 hover:text-green-800"
          >
            View All
          </button>
        </div>
        
        {data.businesses?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GST Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.businesses.slice(0, 5).map((business) => (
                  <tr key={business._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">
                        {business.businessName}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {business.businessType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 uppercase">
                        {business.taxDetails?.gstNumber || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        business.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        business.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                        business.status === 'DORMANT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {business.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FaBuilding className="mx-auto text-gray-300 text-4xl mb-2" />
            <p className="text-gray-500">No businesses registered yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;