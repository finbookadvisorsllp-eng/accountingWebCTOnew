import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formType = location.state?.form; // 'interest' or 'exited'

  // If there's no valid state, redirect to home
  useEffect(() => {
    if (!formType || (formType !== "interest" && formType !== "exited")) {
      navigate("/", { replace: true });
    }
  }, [formType, navigate]);

  // Don't render anything while redirecting
  if (!formType) return null;

  // Dynamic content based on form type
  const title =
    formType === "interest"
      ? "Thank You for Your Interest!"
      : "We Value Your Feedback";
  const message =
    formType === "interest"
      ? "Your interest has been successfully submitted."
      : "Your exited form has been successfully submitted.";
  const subMessage =
    formType === "interest"
      ? "“We’re thrilled to have you on board. A member of our team will reach out to you shortly.”"
      : "“We’re sorry to see you go. Your feedback helps us improve.”";
  const iconColor =
    formType === "interest" ? "text-green-500" : "text-orange-500";
  const bgColor = formType === "interest" ? "bg-green-100" : "bg-orange-100";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      {/* Main Card */}
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/30">
        {/* Finbook Advisor with style */}
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          Finbook Advisor
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mb-6"></div>

        {/* Dynamic Icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center`}
          >
            <svg
              className={`w-8 h-8 ${iconColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Dynamic Title & Message */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>

        {/* Additional best wishes lines */}
        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
          <p className="text-indigo-700 italic">{subMessage}</p>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Best wishes, <br />
          <span className="font-semibold text-indigo-600">
            The Finbook Advisor Team
          </span>
        </p>

        {/* Button to go back to home */}
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
