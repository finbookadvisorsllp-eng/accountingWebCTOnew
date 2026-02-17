import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaBuilding,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaArrowRight,
  FaUserPlus
} from 'react-icons/fa';
import { clientAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const ClientList = () => {
  const { user } = useAuthStore();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    contactPerson: {
      name: '',
      designation: '',
      email: '',
      phone: ''
    },
    companyDetails: {
      companyType: '',
      industryType: '',
      registrationNumber: ''
    },
    complianceDetails: {
      panNumber: '',
      gstRegistered: false
    },
    assignedTo: ''
  });

  useEffect(() => {
    fetchClients();
  }, [search, statusFilter]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        status: statusFilter || undefined
      };
      const response = await clientAPI.getClients(params);
      setClients(response.data.data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientAPI.createClient(formData);
      setShowModal(false);
      fetchClients();
      setFormData({
        name: '',
        email: '',
        phone: '',
        contactPerson: { name: '', designation: '', email: '', phone: '' },
        companyDetails: { companyType: '', industryType: '', registrationNumber: '' },
        complianceDetails: { panNumber: '', gstRegistered: false },
        assignedTo: ''
      });
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Manage your client accounts</p>
        </div>
        
        {user?.role === 'CA' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaPlus />
            <span>Create Client</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="mx-auto text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500">No clients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Businesses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {client.userId?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {client.userId?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {client.userId?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {client.contactPerson?.name}
                      </p>
                      {client.contactPerson?.phone && (
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <FaPhone className="mr-1" />
                          {client.contactPerson.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {client.companyDetails?.companyType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaBuilding className="text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {client.businessCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.userId?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        client.userId?.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {client.userId?.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/clients/${client._id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      >
                        View <FaArrowRight className="ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Create New Client</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Type
                  </label>
                  <select
                    value={formData.companyDetails.companyType}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      companyDetails: { ...formData.companyDetails, companyType: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Type</option>
                    <option value="PROPRIETORSHIP">Proprietorship</option>
                    <option value="PVT_LTD">Pvt Ltd</option>
                    <option value="PARTNERSHIP">Partnership</option>
                    <option value="LLP">LLP</option>
                    <option value="PUBLIC_LTD">Public Ltd</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson.name}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contactPerson: { ...formData.contactPerson, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person Designation
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson.designation}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contactPerson: { ...formData.contactPerson, designation: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={formData.complianceDetails.panNumber}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      complianceDetails: { ...formData.complianceDetails, panNumber: e.target.value.toUpperCase() }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg uppercase"
                    maxLength={10}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;