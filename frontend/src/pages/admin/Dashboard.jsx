import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserTie,
  FaChartLine,
  FaArrowRight,
  FaBuilding,
  FaUserCog,
  FaUserFriends,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaMoneyBillWave,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { candidateAPI, clientAPI } from "../../services/api";
import useAuthStore from "../../store/authStore";
import AdminLayout from "../../components/AdminLayout";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [accountants, setAccountants] = useState([]);
  const [employees, setEmployees] = useState([]);

  // New client form
  const [newClient, setNewClient] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    gstNumber: "",
    panNumber: "",
    address: "",
    billingAmount: "",
    status: "active",
    assignedAccountant: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, clientsRes, accountantsRes] = await Promise.all([
        candidateAPI.getStats(),
        clientAPI.getClients(),
        candidateAPI.getCandidates(),
      ]);

      setStats(statsRes.data.data);
      const clientsData = clientsRes.data.data || [];
      const accountantsData = accountantsRes.data.data || [];

      setClients(clientsData);
      setAccountants(accountantsData);

      const employeesWithClients = accountantsData.map((acc) => ({
        ...acc,
        clients: clientsData.filter(
          (c) =>
            c.assignedAccountant &&
            (c.assignedAccountant === acc._id ||
              c.assignedAccountant?._id === acc._id),
        ),
      }));
      setEmployees(employeesWithClients);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      await clientAPI.createClient(newClient);
      await fetchDashboardData();
      setShowAddClientModal(false);
      setNewClient({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        gstNumber: "",
        panNumber: "",
        address: "",
        billingAmount: "",
        status: "active",
        assignedAccountant: "",
      });
    } catch (error) {
      console.error("Failed to add client:", error);
      alert("Failed to add client. Please check your input and try again.");
    }
  };

  const handleAssignAccountant = async (clientId, accountantId) => {
    try {
      await clientAPI.assignAccountant(clientId, accountantId);
      await fetchDashboardData();
      setShowAssignModal(false);
    } catch (error) {
      console.error("Assignment failed:", error);
      alert("Failed to assign accountant. Please try again.");
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await clientAPI.deleteClient(clientId);
        await fetchDashboardData();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete client. Please try again.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "inactive":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tab Navigation - small text */}
        <div className="flex space-x-1 bg-white p-1 rounded-2xl shadow-sm border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2 text-xs font-medium rounded-xl transition-all ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("employees")}
            className={`px-5 py-2 text-xs font-medium rounded-xl transition-all ${
              activeTab === "employees"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-5 py-2 text-xs font-medium rounded-xl transition-all ${
              activeTab === "clients"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Clients
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Charts instead of Welcome - premium look with shadows & gradients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Line Chart 1: Candidates Over Time (SVG - Style 1: Smooth Curve) */}
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <h3 className="text-xs font-medium text-gray-700 mb-2">
                  Candidates Growth
                </h3>
                <svg viewBox="0 0 300 100" className="w-full h-24">
                  <path
                    d="M0 90 Q75 20, 150 50 T300 10"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <defs>
                    <linearGradient
                      id="gradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="text-[10px] text-gray-500 mt-1">
                  +25% this month
                </p>
              </div>

              {/* Line Chart 2: Conversion Rate (Style 2: Stepped Line) */}
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
                    <linearGradient
                      id="gradient2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="text-[10px] text-gray-500 mt-1">28% average</p>
              </div>
            </div>

            {/* Stats Grid - small cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {statCards.map((card, index) => (
                <Link
                  key={index}
                  to={card.link}
                  className="group bg-white border border-slate-200 p-3 rounded-2xl hover:border-blue-300 transition-all hover:shadow-md hover:shadow-blue-900/5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-slate-500 font-medium text-[9px] uppercase tracking-wider">
                      {card.title}
                    </p>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {card.value}
                    </h3>
                  </div>
                  <div
                    className={`${card.bg} ${card.color} p-2 rounded-xl text-xl group-hover:scale-105 transition-transform`}
                  >
                    {card.icon}
                  </div>
                </Link>
              ))}
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("clients");
                }}
                className="group bg-white border border-slate-200 p-3 rounded-2xl hover:border-blue-300 transition-all hover:shadow-md hover:shadow-blue-900/5 flex items-center justify-between"
              >
                <div>
                  <p className="text-slate-500 font-medium text-[9px] uppercase tracking-wider">
                    Total Clients
                  </p>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {clients.length}
                  </h3>
                </div>
                <div className="bg-rose-50 text-rose-600 p-2 rounded-xl text-xl group-hover:scale-105 transition-transform">
                  <FaBuilding />
                </div>
              </Link>
            </div>

            {/* Priority Actions - small cards */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">
                  Priority Actions
                </h2>
                <Link
                  to="/admin/candidates"
                  className="text-blue-600 text-xs font-medium hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
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
                    className="flex items-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group"
                  >
                    <div
                      className={`${action.color} w-8 h-8 rounded-lg flex items-center justify-center text-white shadow`}
                    >
                      {action.icon}
                    </div>
                    <span className="ml-3 font-medium text-slate-700 text-xs">
                      {action.label}
                    </span>
                    <FaArrowRight className="ml-auto text-slate-300 text-xs group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Updated Modern Analysis Section - more metrics + line charts */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
              <h2 className="text-base font-bold text-slate-900 mb-4">
                Recruitment Analysis
              </h2>
              <div className="space-y-4 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Conversion Rate (Interested to Approved)</span>
                  <span className="font-medium text-green-600">
                    {stats &&
                    stats.byStatus?.APPROVED &&
                    stats.byStatus?.INTERESTED
                      ? (
                          (stats.byStatus.APPROVED /
                            stats.byStatus.INTERESTED) *
                          100
                        ).toFixed(1) + "%"
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Profile Completion</span>
                  <span className="font-medium text-blue-600">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Employees Growth (MoM)</span>
                  <span className="font-medium text-emerald-600">+15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Clients without Accountant</span>
                  <span className="font-medium text-amber-600">
                    {clients.filter((c) => !c.assignedAccountant).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Billing Revenue</span>
                  <span className="font-medium text-indigo-600">
                    ₹
                    {clients
                      .reduce(
                        (sum, c) => sum + (parseFloat(c.billingAmount) || 0),
                        0,
                      )
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Clients per Accountant</span>
                  <span className="font-medium text-purple-600">
                    {accountants.length > 0
                      ? (clients.length / accountants.length).toFixed(1)
                      : "N/A"}
                  </span>
                </div>
                {/* Line Chart 3: Revenue Trend (Style 3: Dashed Line) */}
                <div className="h-24 bg-gray-50 rounded-lg p-2">
                  <svg viewBox="0 0 300 100" className="w-full h-full">
                    <path
                      d="M0 70 L75 40 L150 60 L225 30 L300 50"
                      stroke="url(#gradient3)"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                      fill="none"
                    />
                    <defs>
                      <linearGradient
                        id="gradient3"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <p className="text-[10px] text-gray-500 italic">
                  Monthly revenue progression
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                Accountants & Their Clients
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md text-xs">
                <FaUserFriends />
                <span>Add Employee</span>
              </button>
            </div>

            {employees.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <FaUserFriends className="text-5xl text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-medium text-slate-900">
                  No employees found
                </h3>
                <p className="text-slate-500 mt-1 text-xs">
                  Add your first employee to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {employees.map((emp) => (
                  <div
                    key={emp._id}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-2xl">
                          <FaUserTie className="text-2xl text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            {emp.name}
                          </h3>
                          <p className="text-xs text-slate-600">{emp.email}</p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            ID: {emp.employeeId}
                          </p>
                        </div>
                      </div>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {emp.clients?.length || 0} Clients
                      </span>
                    </div>

                    {emp.clients && emp.clients.length > 0 ? (
                      <div className="mt-4 border-t pt-4">
                        <p className="text-xs font-semibold text-slate-700 mb-3">
                          Assigned Clients
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {emp.clients.map((client) => (
                            <div
                              key={client.id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                            >
                              <div>
                                <p className="font-medium text-slate-900 text-sm">
                                  {client.companyName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {client.contactPerson}
                                </p>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                  client.status,
                                )}`}
                              >
                                {client.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-4 text-xs text-slate-500 italic border-t pt-4">
                        No clients assigned yet
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div className="space-y-6">
            {/* Search & Add Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by company, contact, GST..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowAddClientModal(true)}
                    className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md text-xs"
                  >
                    <FaPlus />
                    <span>Add Client</span>
                  </button>
                  <button className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                    <FaFilter className="text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Clients List */}
            {clients.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <FaBuilding className="text-5xl text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-medium text-slate-900">
                  No clients found
                </h3>
                <p className="text-slate-500 mt-1 text-xs">
                  Click "Add Client" to create your first client.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {clients
                  .filter(
                    (c) =>
                      c.companyName
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      c.contactPerson
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      c.gstNumber?.includes(searchQuery),
                  )
                  .map((client) => (
                    <div
                      key={client.id}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition group"
                    >
                      <div className="flex flex-wrap lg:flex-nowrap gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-2xl">
                                <FaBuilding className="text-2xl text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-bold text-slate-900">
                                    {client.companyName}
                                  </h3>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                      client.status,
                                    )}`}
                                  >
                                    {client.status}
                                  </span>
                                </div>
                                <p className="text-slate-600 mt-1 text-sm">
                                  {client.contactPerson}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition">
                              <button
                                className="p-2 hover:bg-slate-100 rounded-lg"
                                title="Edit"
                              >
                                <FaEdit className="text-slate-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteClient(client.id)}
                                className="p-2 hover:bg-slate-100 rounded-lg"
                                title="Delete"
                              >
                                <FaTrash className="text-slate-400" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-slate-50 rounded-xl p-3">
                              <p className="text-[10px] text-slate-500">
                                Email
                              </p>
                              <p className="text-xs font-medium truncate">
                                {client.email}
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                              <p className="text-[10px] text-slate-500">
                                Phone
                              </p>
                              <p className="text-xs font-medium">
                                {client.phone}
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                              <p className="text-[10px] text-slate-500">GST</p>
                              <p className="text-xs font-medium">
                                {client.gstNumber}
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                              <p className="text-[10px] text-slate-500">PAN</p>
                              <p className="text-xs font-medium">
                                {client.panNumber}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t pt-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <FaUserTie className="text-slate-400" />
                                <span className="text-xs text-slate-600">
                                  Assigned:{" "}
                                  {client.assignedAccountant
                                    ? accountants.find(
                                        (a) =>
                                          a._id === client.assignedAccountant ||
                                          a._id ===
                                            client.assignedAccountant?._id,
                                      )?.name || "Unknown"
                                    : "Not assigned"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FaMoneyBillWave className="text-slate-400" />
                                <span className="text-xs font-semibold">
                                  ₹{client.billingAmount?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedClient(client);
                                setShowAssignModal(true);
                              }}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs"
                            >
                              <FaUserCog />
                              <span>Assign</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Client Modal - small text */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                Add New Client
              </h2>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>
            <form onSubmit={handleAddClient} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.companyName}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        companyName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={newClient.contactPerson}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        contactPerson: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) =>
                      setNewClient({ ...newClient, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newClient.phone}
                    onChange={(e) =>
                      setNewClient({ ...newClient, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={newClient.gstNumber}
                    onChange={(e) =>
                      setNewClient({ ...newClient, gstNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={newClient.panNumber}
                    onChange={(e) =>
                      setNewClient({ ...newClient, panNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Billing Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newClient.billingAmount}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        billingAmount: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={newClient.status}
                    onChange={(e) =>
                      setNewClient({ ...newClient, status: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Address
                  </label>
                  <textarea
                    rows="2"
                    value={newClient.address}
                    onChange={(e) =>
                      setNewClient({ ...newClient, address: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Assign Accountant (optional)
                  </label>
                  <select
                    value={newClient.assignedAccountant}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        assignedAccountant: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="">None</option>
                    {accountants.map((acc) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md text-xs"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Accountant Modal - small text */}
      {showAssignModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-slate-900">
                Assign Accountant
              </h3>
            </div>
            <div className="p-6">
              <p className="text-xs text-slate-600 mb-4">
                Client:{" "}
                <span className="font-semibold">
                  {selectedClient.companyName}
                </span>
              </p>
              <select
                className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                defaultValue={selectedClient.assignedAccountant || ""}
                onChange={(e) =>
                  handleAssignAccountant(selectedClient.id, e.target.value)
                }
              >
                <option value="">Select Accountant</option>
                {accountants.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
