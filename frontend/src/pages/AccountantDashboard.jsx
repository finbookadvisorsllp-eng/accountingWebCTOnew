import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaBuilding, 
  FaUserPlus, 
  FaPlus, 
  FaClipboard,
  FaNetwork,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowRight
} from 'react-icons/fa';
import useDashboardStore from '../store/dashboardStore';
import useAuthStore from '../store/authStore';

const AccountantDashboard = () => {
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
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-purple-100 mt-1">Accountant Dashboard</p>
        {user?.employeeId && <p className="text-purple-200 text-sm mt-1">ID: {user.employeeId}</p>}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">My Clients</p>
              <p className="text-3xl font-bold text-gray-900">{data.summary?.totalClients || 0}</p>
              <p className="text-sm text-green-600">
                {data.summary?.activeClients || 0} active
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaUsers className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>

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
              <p className="text-sm text-gray-600">My Team</p>
              <p className="text-3xl font-bold text-gray-900">{data.summary?.subordinatesCount || 0}</p>
              <p className="text-sm text-gray-600">
                subordinates
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaNetwork className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Compliance</p>
              <p className="text-3xl font-bold text-gray-900">{data.summary?.pendingComplianceCount || 0}</p>
              <p className="text-sm text-orange-600">
                needs attention
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaExclamationTriangle className="text-2xl text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.quickActions?.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.action)}
              className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <action.icon className="text-lg text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{action.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Team */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">My Team</h3>
            <button
              onClick={() => navigate('/team')}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {data.subordinates?.length > 0 ? (
              data.subordinates.slice(0, 5).map((member) => (
                <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">
                        {member.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    member.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No team members yet</p>
            )}
          </div>
        </div>

        {/* Pending Compliance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Compliance</h3>
            <button
              onClick={() => navigate('/businesses')}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {data.pendingCompliance?.length > 0 ? (
              data.pendingCompliance.map((business) => (
                <div key={business._id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{business.businessName}</p>
                      <p className="text-sm text-gray-600">
                        {business.complianceStatus?.gstReturn?.status === 'OVERDUE' && 'GST Overdue'}
                        {business.complianceStatus?.incomeTax?.status === 'OVERDUE' && 'IT Overdue'}
                      </p>
                    </div>
                    <FaExclamationTriangle className="text-orange-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <FaCheckCircle className="mx-auto text-green-500 text-3xl mb-2" />
                <p className="text-gray-600">All compliance up to date!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assigned Clients */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">My Clients</h3>
          <button
            onClick={() => navigate('/clients')}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.assignedClients?.slice(0, 5).map((client) => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {client.userId?.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {client.contactPerson?.companyDetails?.companyType}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      client.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/clients/${client._id}`)}
                      className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
                    >
                      View Details <FaArrowRight className="ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;