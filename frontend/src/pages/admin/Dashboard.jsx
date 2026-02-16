import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserCheck, FaUserClock, FaUserTie, FaChartLine, FaCalculator } from 'react-icons/fa';
import { candidateAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import AdminLayout from '../../components/AdminLayout';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await candidateAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats?.total || 0,
      icon: <FaUsers className="text-4xl" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/admin/candidates'
    },
    {
      title: 'Interested',
      value: stats?.byStatus?.INTERESTED || 0,
      icon: <FaUserClock className="text-4xl" />,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      link: '/admin/candidates?status=INTERESTED'
    },
    {
      title: 'Exited Applications',
      value: stats?.byStatus?.EXITED || 0,
      icon: <FaUserCheck className="text-4xl" />,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      link: '/admin/candidates?status=EXITED'
    },
    {
      title: 'Approved',
      value: stats?.byStatus?.APPROVED || 0,
      icon: <FaUserTie className="text-4xl" />,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/admin/candidates?status=APPROVED'
    },
    {
      title: 'Active Employees',
      value: stats?.byStatus?.ACTIVE || 0,
      icon: <FaChartLine className="text-4xl" />,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      link: '/admin/candidates?status=ACTIVE'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center space-x-4">
            <FaCalculator className="text-5xl" />
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
              <p className="text-primary-100 mt-1">Here's what's happening with your recruitment today.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className={`${card.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-semibold mb-1">{card.title}</p>
                  <p className="text-4xl font-bold">{card.value}</p>
                </div>
                <div className="opacity-80">
                  {card.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/candidates?status=INTERESTED"
              className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl hover:shadow-md transition text-center"
            >
              <FaUserClock className="text-3xl text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Review Interested</h3>
              <p className="text-sm text-gray-600 mt-1">Approve for exited form</p>
            </Link>

            <Link
              to="/admin/candidates?status=EXITED"
              className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:shadow-md transition text-center"
            >
              <FaUserCheck className="text-3xl text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Process Applications</h3>
              <p className="text-sm text-gray-600 mt-1">Review exited forms</p>
            </Link>

            <Link
              to="/admin/candidates?status=APPROVED"
              className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl hover:shadow-md transition text-center"
            >
              <FaUserTie className="text-3xl text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Approved Candidates</h3>
              <p className="text-sm text-gray-600 mt-1">Manage onboarding</p>
            </Link>

            <Link
              to="/admin/candidates"
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:shadow-md transition text-center"
            >
              <FaUsers className="text-3xl text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">All Candidates</h3>
              <p className="text-sm text-gray-600 mt-1">View complete list</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-gray-700">Database Connection</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-gray-700">API Server</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Running</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Last Backup</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Today</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
