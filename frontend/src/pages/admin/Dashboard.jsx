import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserTie,
  FaChartLine,
  FaArrowRight,
  FaUserFriends,
  FaExclamationTriangle,
} from "react-icons/fa";

import { candidateAPI } from "../../services/api";
import useAuthStore from "../../store/authStore";
import AdminLayout from "../../components/AdminLayout";

const AdminDashboard = () => {
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const [stats, setStats] = useState(null);
  const [accountants, setAccountants] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsRes, accountantsRes] = await Promise.all([
        candidateAPI.getStats(),
        candidateAPI.getCandidates(),
      ]);

      setStats(statsRes.data.data);
      

      const accountantsData = accountantsRes.data.data || [];

      setAccountants(accountantsData);

      const employeesData = accountantsData.map((acc) => ({
        ...acc,
        clients: [],
      }));

      setEmployees(employeesData);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 text-xs font-medium">
            Loading Dashboard...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <FaExclamationTriangle className="text-5xl text-amber-500 mb-4" />
          <p className="text-lg text-slate-700 font-medium">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-xs"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const statCards = stats
    ? [
        {
          title: "Total Candidates",
          value: stats.total || 0,
          icon: <FaUsers />,
          color: "text-blue-600",
          bg: "bg-blue-50",
          link: "/admin/candidates",
        },
        {
          title: "Interested",
          value: stats.byStatus?.INTERESTED || 0,
          icon: <FaUserClock />,
          color: "text-amber-600",
          bg: "bg-amber-50",
          link: "/admin/candidates?status=INTERESTED",
        },
        {
          title: "Exited",
          value: stats.byStatus?.EXITED || 0,
          icon: <FaUserCheck />,
          color: "text-purple-600",
          bg: "bg-purple-50",
          link: "/admin/candidates?status=EXITED",
        },
        {
          title: "Approved",
          value: stats.byStatus?.APPROVED || 0,
          icon: <FaUserTie />,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          link: "/admin/candidates?status=APPROVED",
        },
        {
          title: "Active Employees",
          value: stats.byStatus?.ACTIVE || 0,
          icon: <FaChartLine />,
          color: "text-indigo-600",
          bg: "bg-indigo-50",
          link: "/admin/candidates?status=ACTIVE",
        },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <h3 className="text-xs font-medium text-gray-700 mb-2">
              Candidates Growth
            </h3>

            <svg viewBox="0 0 300 100" className="w-full h-24">
              <path
                d="M0 90 Q75 20,150 50 T300 10"
                stroke="url(#gradient1)"
                strokeWidth="2"
                fill="none"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            <p className="text-[10px] text-gray-500 mt-1">+25% this month</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <h3 className="text-xs font-medium text-gray-700 mb-2">
              Conversion Rate
            </h3>

            <svg viewBox="0 0 300 100" className="w-full h-24">
              <path
                d="M0 80 H75 V40 H150 V60 H225 V30 H300"
                stroke="url(#gradient2)"
                strokeWidth="2"
                fill="none"
              />

              <defs>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </svg>

            <p className="text-[10px] text-gray-500 mt-1">28% average</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {statCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="group bg-white border border-slate-200 p-3 rounded-2xl hover:border-blue-300 transition hover:shadow-md flex items-center justify-between"
            >
              <div>
                <p className="text-slate-500 text-[9px] uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {card.value}
                </h3>
              </div>

              <div
                className={`${card.bg} ${card.color} p-2 rounded-xl text-xl`}
              >
                {card.icon}
              </div>
            </Link>
          ))}
        </div>

        {/* Priority Actions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Priority Actions
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              to="/admin/candidates?status=INTERESTED"
              className="flex items-center p-3 rounded-xl border bg-slate-50 hover:shadow"
            >
              <div className="bg-amber-500 w-8 h-8 rounded-lg flex items-center justify-center text-white">
                <FaUserClock />
              </div>

              <span className="ml-3 text-xs font-medium">
                Review Interests
              </span>

              <FaArrowRight className="ml-auto text-xs" />
            </Link>

            <Link
              to="/admin/candidates?status=EXITED"
              className="flex items-center p-3 rounded-xl border bg-slate-50 hover:shadow"
            >
              <div className="bg-purple-500 w-8 h-8 rounded-lg flex items-center justify-center text-white">
                <FaUserCheck />
              </div>

              <span className="ml-3 text-xs font-medium">
                Process Forms
              </span>

              <FaArrowRight className="ml-auto text-xs" />
            </Link>
          </div>
        </div>

        {/* Employees */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            Employees
          </h2>

          {employees.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border">
              <FaUserFriends className="text-5xl text-slate-300 mx-auto mb-4" />
              <h3 className="text-base font-medium">
                No employees found
              </h3>
            </div>
          ) : (
            <div className="grid gap-6">
              {employees.map((emp) => (
                <div
                  key={emp._id}
                  className="bg-white rounded-2xl p-6 shadow border"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <FaUserTie className="text-blue-600 text-xl" />
                    </div>

                    <div>
                      <h3 className="font-bold">{emp.name}</h3>
                      <p className="text-xs text-gray-500">{emp.email}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    No clients assigned
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;