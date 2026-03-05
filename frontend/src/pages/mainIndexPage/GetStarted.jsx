import { Link } from 'react-router-dom';
import { FaHeart, FaRocket, FaCalculator } from 'react-icons/fa';

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <FaCalculator className="text-3xl text-primary-600" />
              <span className="text-2xl font-bold text-gray-800">AccounTech Advisory</span>
            </Link>
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold transition"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose how you'd like to connect with us. We're excited to learn more about you!
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Interested Option */}
            <Link
              to="/interest-form"
              className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-200"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mb-6 group-hover:scale-110 transition">
                  <FaHeart className="text-4xl text-primary-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  I'm Interested
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Want to explore opportunities with us? Fill out a quick interest form and 
                  we'll keep you updated on relevant positions and opportunities.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Quick and easy form</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">No immediate commitment</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Stay updated on opportunities</p>
                  </div>
                </div>
                <div className="mt-8">
                  <span className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold group-hover:bg-primary-700 transition">
                    Express Interest →
                  </span>
                </div>
              </div>
            </Link>

            {/* Excited to Work Option */}
            <Link
              to="/exited-form"
              className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-transparent hover:border-accent-200"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full mb-6 group-hover:scale-110 transition">
                  <FaRocket className="text-4xl text-accent-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Excited to Work
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Ready to join our team? Complete the comprehensive application form 
                  and take the first step towards an exciting career with us.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Detailed application form</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Fast-track your application</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-600 rounded-full mt-2"></div>
                    <p className="text-gray-600">Priority consideration</p>
                  </div>
                </div>
                <div className="mt-8">
                  <span className="inline-block bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold group-hover:bg-accent-700 transition">
                    Start Application →
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              What Happens Next?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Submit Form</h4>
                <p className="text-gray-600 text-sm">
                  Complete your chosen form with accurate information
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Review Process</h4>
                <p className="text-gray-600 text-sm">
                  Our team reviews your application carefully
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Get in Touch</h4>
                <p className="text-gray-600 text-sm">
                  We'll contact you with next steps or opportunities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
