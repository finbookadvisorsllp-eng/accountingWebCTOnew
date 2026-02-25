import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaCalculator,
  FaBars,
  FaTimes,
  FaChartLine,
  FaUsers,
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaUserCircle,
  FaUserTie,
  FaBuilding,
  FaMoneyBillWave,
  FaFileAlt,
  FaFolderOpen,
  FaClock,
  FaEye,
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaRupeeSign,
  FaChartPie,
  FaShieldAlt,
  FaWallet,
  FaCheckDouble,
  FaEllipsisV,
} from "react-icons/fa";
import { candidateAPI } from "../../services/api";
import useAuthStore from "../../store/authStore";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy clients data
  const [clients] = useState([
    {
      id: 1,
      companyName: "TechSolutions Pvt Ltd",
      contactPerson: "Rajesh Kumar",
      email: "rajesh@techsolutions.com",
      phone: "+91 98765 43210",
      status: "active",
      lastInteraction: "2024-01-15",
      pendingTasks: 3,
      gstNumber: "27AAECS1234F1Z5",
      panNumber: "AAECS1234F",
      billingAmount: 85000,
      paidAmount: 75000,
      dueAmount: 10000,
      documents: [
        {
          id: 1,
          name: "GST Returns (Dec 2023)",
          type: "gst",
          status: "pending",
          dueDate: "2024-02-20",
        },
        {
          id: 2,
          name: "ITR Filing",
          type: "itr",
          status: "completed",
          dueDate: "2024-03-15",
        },
      ],
    },
    {
      id: 2,
      companyName: "Global Exports India",
      contactPerson: "Priya Sharma",
      email: "priya@globalexports.com",
      phone: "+91 99876 54321",
      status: "pending",
      lastInteraction: "2024-01-14",
      pendingTasks: 5,
      gstNumber: "07AABCS1234P1Z2",
      panNumber: "AABCS1234P",
      billingAmount: 120000,
      paidAmount: 60000,
      dueAmount: 60000,
      documents: [
        {
          id: 3,
          name: "TDS Returns (Q4)",
          type: "tds",
          status: "overdue",
          dueDate: "2024-01-10",
        },
        {
          id: 4,
          name: "Audit Report",
          type: "audit",
          status: "in-progress",
          dueDate: "2024-02-28",
        },
      ],
    },
    {
      id: 3,
      companyName: "Sharma & Associates",
      contactPerson: "Amit Sharma",
      email: "amit@sharmaassoc.com",
      phone: "+91 97654 32109",
      status: "active",
      lastInteraction: "2024-01-16",
      pendingTasks: 2,
      gstNumber: "36AABCS1234H1Z8",
      panNumber: "AABCS1234H",
      billingAmount: 45000,
      paidAmount: 45000,
      dueAmount: 0,
      documents: [
        {
          id: 5,
          name: "Monthly GST",
          type: "gst",
          status: "pending",
          dueDate: "2024-01-25",
        },
      ],
    },
    {
      id: 4,
      companyName: "Innovative Retailers",
      contactPerson: "Neha Gupta",
      email: "neha@innovative.in",
      phone: "+91 96543 21098",
      status: "inactive",
      lastInteraction: "2024-01-10",
      pendingTasks: 0,
      gstNumber: "29AABCI1234E1Z6",
      panNumber: "AABCI1234E",
      billingAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      documents: [],
    },
  ]);

  // Dummy notifications
  const notifications = [
    {
      id: 1,
      title: "GST Filing Deadline",
      message: "GST filing deadline for TechSolutions is approaching",
      type: "warning",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Document Upload",
      message: "New document uploaded by Global Exports",
      type: "info",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment received from Sharma & Associates",
      type: "success",
      time: "1 day ago",
      read: true,
    },
  ];

  useEffect(() => {
    if (user._id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await candidateAPI.getCandidate(user._id);
      setCandidate(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalConfirmation = async () => {
    if (
      !window.confirm(
        "Are you sure you want to confirm and activate your profile? This action finalizes your onboarding.",
      )
    ) {
      return;
    }

    setConfirmLoading(true);
    try {
      await candidateAPI.finalConfirmation(user._id, {
        accuracyConfirmed: true,
        finalDigitalConfirmation: true,
      });
      toast.success("Profile activated successfully! Welcome aboard!");
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm profile");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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

  const getDocStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "overdue":
        return "bg-rose-100 text-rose-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-indigo-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaCalculator className="text-2xl text-indigo-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl">
          <FaUserTie className="text-6xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-6">Profile not found</p>
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-lg shadow-indigo-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed Width */}
      <aside
        className={`
        fixed lg:static top-0 left-0 h-screen w-80 bg-gradient-to-b from-[#0A0F1E] to-[#1A1F32] text-white
        transform transition-transform duration-300 ease-out z-50
        lg:translate-x-0 overflow-y-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        shadow-2xl
      `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/30">
              <FaCalculator className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                AccounTech
              </h2>
              <p className="text-sm text-indigo-300">Professional Accountant</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-6 border-b border-white/10">
          <div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/10 transition cursor-pointer"
            onClick={() => {
              setShowProfile(true);
              setSidebarOpen(false);
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
                <FaUserTie className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {candidate.personalInfo?.firstName}{" "}
                  {candidate.personalInfo?.lastName}
                </h3>
                <p className="text-sm text-indigo-300 truncate">
                  {candidate.adminInfo?.designation || "Senior Accountant"}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  ID: {candidate.adminInfo?.employeeId}
                </p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg flex-shrink-0">
                <FaEye className="text-indigo-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 flex-1">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-4 mb-4">
            Main Menu
          </p>

          {[
            {
              id: "dashboard",
              icon: FaChartLine,
              label: "Dashboard",
              badge: null,
            },
            {
              id: "clients",
              icon: FaUsers,
              label: "My Clients",
              badge: clients.length,
            },
            {
              id: "invoices",
              icon: FaFileInvoiceDollar,
              label: "Invoices",
              badge: "12",
            },
            {
              id: "documents",
              icon: FaFolderOpen,
              label: "Documents",
              badge: "8",
            },
            { id: "reports", icon: FaChartPie, label: "Reports", badge: null },
            {
              id: "calendar",
              icon: FaCalendarAlt,
              label: "Calendar",
              badge: "3",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-1 transition-all
                ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <item.icon className="text-lg flex-shrink-0" />
              <span className="flex-1 text-left font-medium truncate">
                {item.label}
              </span>
              {item.badge && (
                <span
                  className={`
                  text-xs px-2 py-1 rounded-full flex-shrink-0
                  ${
                    activeTab === item.id
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/70"
                  }
                `}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-4 mt-8 mb-4">
            Tax & Compliance
          </p>

          {[
            {
              id: "gst",
              icon: FaMoneyBillWave,
              label: "GST Returns",
              badge: "4",
            },
            { id: "tds", icon: FaFileAlt, label: "TDS Reports", badge: "2" },
            { id: "audit", icon: FaShieldAlt, label: "Audit", badge: null },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-1 transition-all
                ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <item.icon className="text-lg flex-shrink-0" />
              <span className="flex-1 text-left font-medium truncate">
                {item.label}
              </span>
              {item.badge && (
                <span
                  className={`
                  text-xs px-2 py-1 rounded-full flex-shrink-0
                  ${
                    activeTab === item.id
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/70"
                  }
                `}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FaBell className="text-indigo-400" />
                <span className="text-sm text-white/80">Notifications</span>
              </div>
              <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.filter((n) => !n.read).length}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white/90 text-sm"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Flex 1 to take remaining width */}
      <main className="flex-1 min-w-0 bg-slate-50 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation - Fixed at top */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <FaBars className="text-slate-600" />
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {activeTab === "dashboard" && "Dashboard Overview"}
                  {activeTab === "clients" && "Client Portfolio"}
                  {activeTab === "invoices" && "Invoice Management"}
                  {activeTab === "documents" && "Document Repository"}
                  {activeTab === "reports" && "Financial Reports"}
                  {activeTab === "calendar" && "Schedule & Deadlines"}
                  {activeTab === "gst" && "GST Compliance"}
                  {activeTab === "tds" && "TDS Management"}
                  {activeTab === "audit" && "Audit Trail"}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search clients, invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-2.5 w-80 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 hover:bg-slate-100 rounded-xl transition"
                  >
                    <FaBell className="text-xl text-slate-600" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50">
                      <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900">
                            Notifications
                          </h3>
                          <span className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-700">
                            Mark all as read
                          </span>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`
                            p-4 border-b last:border-0 hover:bg-slate-50 cursor-pointer
                            ${!notif.read ? "bg-indigo-50/50" : ""}
                          `}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {notif.type === "warning" && (
                                  <FaExclamationTriangle className="text-amber-500" />
                                )}
                                {notif.type === "success" && (
                                  <FaCheckCircle className="text-emerald-500" />
                                )}
                                {notif.type === "info" && (
                                  <FaBell className="text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">
                                  {notif.title}
                                </p>
                                <p className="text-xs text-slate-600 mt-0.5">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {notif.time}
                                </p>
                              </div>
                              {!notif.read && (
                                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 hover:bg-slate-100 rounded-xl transition"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                      {candidate.personalInfo?.firstName?.charAt(0)}
                      {candidate.personalInfo?.lastName?.charAt(0)}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-slate-900">
                        {candidate.personalInfo?.firstName}{" "}
                        {candidate.personalInfo?.lastName}
                      </p>
                      <p className="text-xs text-slate-500">
                        Senior Accountant
                      </p>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50">
                      <div className="p-4 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">
                          Signed in as
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {candidate.contactInfo?.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowProfile(true);
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          View Profile
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                          Settings
                        </button>
                      </div>
                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Dashboard View */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      Welcome back, {candidate.personalInfo?.firstName}! 👋
                    </h1>
                    <p className="text-indigo-100 text-lg">
                      Here's what's happening with your portfolio today.
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <FaUserCircle className="text-8xl opacity-20" />
                  </div>
                </div>
              </div>

              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-indigo-100 p-3 rounded-xl">
                      <FaWallet className="text-xl text-indigo-600" />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      +12.5%
                    </span>
                  </div>
                  <h3 className="text-sm text-slate-600 mb-1">Total Billing</h3>
                  <p className="text-2xl font-bold text-slate-900">₹2,50,000</p>
                  <p className="text-xs text-slate-500 mt-2">
                    vs last month +₹25,000
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition">
                  <div className="bg-emerald-100 p-3 rounded-xl mb-4">
                    <FaCheckDouble className="text-xl text-emerald-600" />
                  </div>
                  <h3 className="text-sm text-slate-600 mb-1">Collected</h3>
                  <p className="text-2xl font-bold text-slate-900">₹1,80,000</p>
                  <p className="text-xs text-slate-500 mt-2">
                    72% of total billing
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition">
                  <div className="bg-amber-100 p-3 rounded-xl mb-4">
                    <FaClock className="text-xl text-amber-600" />
                  </div>
                  <h3 className="text-sm text-slate-600 mb-1">Pending</h3>
                  <p className="text-2xl font-bold text-slate-900">₹70,000</p>
                  <p className="text-xs text-slate-500 mt-2">From 8 invoices</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition">
                  <div className="bg-rose-100 p-3 rounded-xl mb-4">
                    <FaExclamationTriangle className="text-xl text-rose-600" />
                  </div>
                  <h3 className="text-sm text-slate-600 mb-1">Overdue</h3>
                  <p className="text-2xl font-bold text-slate-900">₹25,000</p>
                  <p className="text-xs text-slate-500 mt-2">From 3 clients</p>
                </div>
              </div>

              {/* Recent Clients */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Recent Client Activity
                  </h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700">
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {clients.slice(0, 3).map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-slate-100 p-3 rounded-xl">
                          <FaBuilding className="text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">
                            {client.companyName}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {client.contactPerson}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">
                          ₹{client.billingAmount.toLocaleString()}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(client.status)}`}
                        >
                          {client.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Clients View */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              {/* Header Actions */}
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
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                      <FaPlus />
                      <span>Add Client</span>
                    </button>
                    <button className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                      <FaFilter />
                    </button>
                  </div>
                </div>
              </div>

              {/* Clients Grid */}
              <div className="grid gap-6">
                {clients
                  .filter(
                    (client) =>
                      client.companyName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      client.contactPerson
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      client.gstNumber.includes(searchQuery),
                  )
                  .map((client) => (
                    <div
                      key={client.id}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition group"
                    >
                      <div className="flex flex-wrap lg:flex-nowrap gap-6">
                        {/* Client Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-2xl">
                                <FaBuilding className="text-2xl text-indigo-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-xl font-bold text-slate-900">
                                    {client.companyName}
                                  </h3>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(client.status)}`}
                                  >
                                    {client.status.charAt(0).toUpperCase() +
                                      client.status.slice(1)}
                                  </span>
                                </div>
                                <p className="text-slate-600 mt-1">
                                  {client.contactPerson}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition">
                              <button className="p-2 hover:bg-slate-100 rounded-lg">
                                <FaEllipsisV className="text-slate-400" />
                              </button>
                            </div>
                          </div>

                          {/* Contact Details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-slate-50 rounded-xl p-3">
                              <p className="text-xs text-slate-500 mb-1">
                                Email
                              </p>
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {client.email}
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                              <p className="text-xs text-slate-500 mb-1">
                                Phone
                              </p>
                              <p className="text-sm font-medium text-slate-900">
                                {client.phone}
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                              <p className="text-xs text-slate-500 mb-1">
                                GST No.
                              </p>
                              <p className="text-sm font-medium text-slate-900">
                                {client.gstNumber}
                              </p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                              <p className="text-xs text-slate-500 mb-1">PAN</p>
                              <p className="text-sm font-medium text-slate-900">
                                {client.panNumber}
                              </p>
                            </div>
                          </div>

                          {/* Financial Summary */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-slate-500">
                                Total Billing
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                ₹{client.billingAmount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Paid</p>
                              <p className="text-lg font-bold text-emerald-600">
                                ₹{client.paidAmount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Due</p>
                              <p className="text-lg font-bold text-amber-600">
                                ₹{client.dueAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Documents/Pending Tasks */}
                          {client.documents.length > 0 && (
                            <div className="border-t pt-4">
                              <p className="text-sm font-semibold text-slate-700 mb-3">
                                Pending Items
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {client.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getDocStatusBadge(doc.status)}`}
                                  >
                                    <FaClock className="text-xs" />
                                    <span className="text-sm">{doc.name}</span>
                                    <span className="text-xs opacity-75">
                                      Due: {doc.dueDate}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setShowClientDetails(true);
                            }}
                            className="flex-1 lg:w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition"
                          >
                            <FaEye />
                            <span>View</span>
                          </button>
                          <button className="flex-1 lg:w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition">
                            <FaFileInvoiceDollar />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {(activeTab === "invoices" ||
            activeTab === "documents" ||
            activeTab === "reports" ||
            activeTab === "calendar" ||
            activeTab === "gst" ||
            activeTab === "tds" ||
            activeTab === "audit") && (
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-100 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-3xl inline-block mb-6">
                  {activeTab === "invoices" && (
                    <FaFileInvoiceDollar className="text-5xl text-indigo-600" />
                  )}
                  {activeTab === "documents" && (
                    <FaFolderOpen className="text-5xl text-indigo-600" />
                  )}
                  {activeTab === "reports" && (
                    <FaChartPie className="text-5xl text-indigo-600" />
                  )}
                  {activeTab === "calendar" && (
                    <FaCalendarAlt className="text-5xl text-indigo-600" />
                  )}
                  {activeTab === "gst" && (
                    <FaMoneyBillWave className="text-5xl text-indigo-600" />
                  )}
                  {activeTab === "tds" && (
                    <FaFileAlt className="text-5xl text-indigo-600" />
                  )}
                  {activeTab === "audit" && (
                    <FaShieldAlt className="text-5xl text-indigo-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  Module
                </h2>
                <p className="text-slate-600 mb-6">
                  This section is ready for API integration.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Complete Profile
              </h2>
              <button
                onClick={() => setShowProfile(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>

            <div className="p-8">
              {/* Profile Header */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-3xl">
                  <FaUserTie className="text-5xl text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {candidate.personalInfo?.firstName}{" "}
                    {candidate.personalInfo?.lastName}
                  </h3>
                  <p className="text-slate-600 text-lg mt-1">
                    {candidate.adminInfo?.designation || "Senior Accountant"}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                      ID: {candidate.adminInfo?.employeeId}
                    </span>
                    <span className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                      {candidate.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Sections Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                    <FaUser className="text-indigo-600" />
                    <span>Personal Information</span>
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Full Name</span>
                      <span className="font-medium text-slate-900">
                        {candidate.personalInfo?.firstName}{" "}
                        {candidate.personalInfo?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date of Birth</span>
                      <span className="font-medium text-slate-900">
                        {candidate.personalInfo?.dateOfBirth
                          ? new Date(
                              candidate.personalInfo.dateOfBirth,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gender</span>
                      <span className="font-medium text-slate-900">
                        {candidate.personalInfo?.gender || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    Contact Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email</span>
                      <span className="font-medium text-slate-900">
                        {candidate.contactInfo?.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone</span>
                      <span className="font-medium text-slate-900">
                        {candidate.personalInfo?.primaryContact?.number ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    Education
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Highest Qualification
                      </span>
                      <span className="font-medium text-slate-900">
                        {candidate.education?.highestQualification || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Year of Passing</span>
                      <span className="font-medium text-slate-900">
                        {candidate.education?.yearOfPassing || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">
                    Work Experience
                  </h4>
                  <div className="space-y-4">
                    {candidate.workExperience?.yearsOfExperience && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Years of Experience
                        </span>
                        <span className="font-medium text-slate-900">
                          {candidate.workExperience.yearsOfExperience} years
                        </span>
                      </div>
                    )}
                    {candidate.workExperience?.jobTitle && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Previous Position
                        </span>
                        <span className="font-medium text-slate-900">
                          {candidate.workExperience.jobTitle}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {showClientDetails && selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Client Details
              </h2>
              <button
                onClick={() => {
                  setShowClientDetails(false);
                  setSelectedClient(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-4 rounded-2xl">
                  <FaBuilding className="text-3xl text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedClient.companyName}
                  </h3>
                  <p className="text-slate-600">
                    {selectedClient.contactPerson}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedClient.status)}`}
                >
                  {selectedClient.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-slate-500">Email:</span>{" "}
                      {selectedClient.email}
                    </p>
                    <p>
                      <span className="text-slate-500">Phone:</span>{" "}
                      {selectedClient.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Tax Information</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-slate-500">GST:</span>{" "}
                      {selectedClient.gstNumber}
                    </p>
                    <p>
                      <span className="text-slate-500">PAN:</span>{" "}
                      {selectedClient.panNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Total Billing</p>
                  <p className="text-xl font-bold text-slate-900">
                    ₹{selectedClient.billingAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Paid</p>
                  <p className="text-xl font-bold text-emerald-600">
                    ₹{selectedClient.paidAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-500">Due</p>
                  <p className="text-xl font-bold text-amber-600">
                    ₹{selectedClient.dueAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
