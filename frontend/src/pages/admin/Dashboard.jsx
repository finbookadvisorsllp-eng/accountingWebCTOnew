import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserTie,
  FaChartLine,
  FaArrowRight,
  FaShieldAlt,
  FaDatabase,
  FaServer,
} from "react-icons/fa";
import { candidateAPI } from "../../services/api";
import useAuthStore from "../../store/authStore";
import AdminLayout from "../../components/AdminLayout";

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
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Candidates",
      value: stats?.total || 0,
      icon: <FaUsers />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      link: "/admin/candidates",
    },
    {
      title: "Interested",
      value: stats?.byStatus?.INTERESTED || 0,
      icon: <FaUserClock />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      link: "/admin/candidates?status=INTERESTED",
    },
    {
      title: "Exited Applications",
      value: stats?.byStatus?.EXITED || 0,
      icon: <FaUserCheck />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      link: "/admin/candidates?status=EXITED",
    },
    {
      title: "Approved",
      value: stats?.byStatus?.APPROVED || 0,
      icon: <FaUserTie />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      link: "/admin/candidates?status=APPROVED",
    },
    {
      title: "Active Employees",
      value: stats?.byStatus?.ACTIVE || 0,
      icon: <FaChartLine />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      link: "/admin/candidates?status=ACTIVE",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Hello, {user?.name.split(" ")[0]}!
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Your recruitment funnel is performing{" "}
              <span className="text-emerald-400 font-bold">12% better</span>{" "}
              than last month. Check the latest applications below.
            </p>
          </div>
          {/* Decorative background shape */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="group bg-white border border-slate-200 p-6 rounded-3xl hover:border-blue-300 transition-all hover:shadow-xl hover:shadow-blue-900/5 flex items-center justify-between"
            >
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                  {card.title}
                </p>
                <h3 className="text-4xl font-black text-slate-900 mt-2">
                  {card.value}
                </h3>
              </div>
              <div
                className={`${card.bg} ${card.color} p-4 rounded-2xl text-2xl group-hover:scale-110 transition-transform`}
              >
                {card.icon}
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900">
                Priority Actions
              </h2>
              <button className="text-blue-600 text-sm font-bold hover:underline">
                View All
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 ">
              {[
                {
                  label: "Review Interests",
                  icon: <FaUserClock />,
                  color: "bg-amber-500",
                  link: "/admin/candidates?status=INTERESTED",
                },
                {
                  label: "Process Forms",
                  icon: <FaUserCheck />,
                  color: "bg-purple-500",
                  link: "/admin/candidates?status=EXITED",
                },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.link}
                  className="flex shadow-md items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group"
                >
                  <div
                    className={`${action.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg`}
                  >
                    {action.icon}
                  </div>
                  <span className="ml-4 font-bold text-slate-700">
                    {action.label}
                  </span>
                  <FaArrowRight className="ml-auto text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
