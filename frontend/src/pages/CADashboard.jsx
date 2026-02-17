import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaBuilding, 
  FaUserPlus, 
  FaPlus, 
  FaClipboard,
  FaNetwork,
  FaChartBar,
  FaCog,
  FaBell,
  FaCalendar
} from 'react-icons/fa';
import useDashboardStore from '../store/dashboardStore';
import useAuthStore from '../store/authStore';

const CADashboard = () => {
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-blue-100 mt-1">Chartered Accountant Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900">{data.summary?.totalClients || 0}</p>
              <p className="text-sm text-green-600">
                {data.summary?.activeClients || 0} active
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaUsers className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Businesses</p>
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
              <p className="text-sm text-gray-600">Accountants</p>
              <p className="text-3xl font-bold text-gray-900">{data.summary?.totalAccountants || 0}</p>
              <p className="text-sm text-green-600">
                {data.summary?.activeAccountants || 0} active
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
              <p className="text-sm text-gray-600">Recent Clients</p>
              <p className="text-3xl font-bold text-gray-900">{data.recentClients?.length || 0}</p>
              <p className="text-sm text-blue-600">This week</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaCalendar className="text-2xl text-orange-600" />
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <action.icon className="text-lg text-blue-600" />
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
        {/* Accountants List */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Accountants Overview</h3>
            <button
              onClick={() => navigate('/users')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {data.accountants?.slice(0, 5).map((accountant) => (
              <div key={accountant._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{accountant.name}</p>
                  <p className="text-sm text-gray-600">{accountant.employeeId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{accountant.clientCount} clients</p>
                  <p className="text-xs text-gray-600">{accountant.subordinateCount} team</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Businesses by Type */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Businesses by Type</h3>
            <button
              onClick={() => navigate('/businesses')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {data.businessesByType?.map((type) => (
              <div key={type._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{type._id || 'Unspecified'}</p>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                  {type.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Clients</h3>
          <button
            onClick={() => navigate('/clients')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recentClients?.slice(0, 5).map((client) => (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {client.email}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Overview */}
      {data.complianceOverview && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">GST Returns</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Filed:</span>
                  <span className="text-sm font-medium text-green-600">{data.complianceOverview.gstFiled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <span className="text-sm font-medium text-yellow-600">{data.complianceOverview.gstPending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overdue:</span>
                  <span className="text-sm font-medium text-red-600">{data.complianceOverview.gstOverdue}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Income Tax</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Filed:</span>
                  <span className="text-sm font-medium text-green-600">{data.complianceOverview.itFiled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <span className="text-sm font-medium text-yellow-600">{data.complianceOverview.itPending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overdue:</span>
                  <span className="text-sm font-medium text-red-600">{data.complianceOverview.itOverdue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CADashboard;