import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaLock, FaCalculator } from "react-icons/fa";
import useAuthStore from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { login, employeeLogin, loading } = useAuthStore();

  const [loginType, setLoginType] = useState("admin"); // admin, advisor, client, employee
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    employeeId: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (loginType === "employee") {
        await employeeLogin({
          employeeId: formData.employeeId,
          password: formData.password,
        });
        toast.success("Login successful!");
        navigate("/employee/dashboard");
      } else {
        await login({
          email: formData.email,
          password: formData.password,
          role: loginType,
        });
        toast.success("Login successful!");

        if (loginType === "admin" || loginType === "advisor") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <FaCalculator className="text-4xl text-primary-600" />
            <span className="text-3xl font-bold text-gray-800">AccounTech</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Role Selector */}
          <div className="grid grid-cols-4 gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            {["admin", "advisor", "client", "employee"].map((type) => (
              <button
                key={type}
                onClick={() => setLoginType(type)}
                className={`py-2 px-3 rounded-md text-sm font-semibold transition ${
                  loginType === type
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {loginType === "employee" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="Enter your employee ID"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/get-started"
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                Get Started
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
