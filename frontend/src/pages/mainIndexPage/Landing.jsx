import { Link } from 'react-router-dom';
import { FaChartLine, FaUsers, FaHandshake, FaCalculator, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-800">AccounTech Advisory</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/get-started"
                className="hidden md:block text-primary-600 hover:text-primary-700 font-semibold transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your Business with Expert
                <span className="text-primary-600"> Accounting & Advisory</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We provide comprehensive accounting, tax planning, financial advisory, and business consulting services to help your business thrive in today's competitive landscape.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/get-started"
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg flex items-center justify-center group"
                >
                  Get Started
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition" />
                </Link>
                <a
                  href="#services"
                  className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg hover:bg-primary-50 transition font-semibold text-lg text-center"
                >
                  Our Services
                </a>
              </div>
            </div>
            <div className="hidden md:block animate-fade-in">
              <div className="bg-gradient-to-br from-primary-100 to-accent-100 rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"
                  alt="Accounting Services"
                  className="rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive financial solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaCalculator className="text-4xl" />,
                title: 'Accounting Services',
                description: 'Complete bookkeeping, financial reporting, and compliance management for your business.',
                color: 'primary'
              },
              {
                icon: <FaChartLine className="text-4xl" />,
                title: 'Tax Planning',
                description: 'Strategic tax planning and optimization to minimize liabilities and maximize returns.',
                color: 'accent'
              },
              {
                icon: <FaHandshake className="text-4xl" />,
                title: 'Business Advisory',
                description: 'Expert guidance on business strategy, growth planning, and operational efficiency.',
                color: 'primary'
              },
              {
                icon: <FaUsers className="text-4xl" />,
                title: 'Financial Consulting',
                description: 'Comprehensive financial analysis and consulting to drive informed decision-making.',
                color: 'accent'
              }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className={`text-${service.color}-600 mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              We combine expertise, technology, and personalized service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expert Team',
                description: 'Certified professionals with years of industry experience',
              },
              {
                title: 'Personalized Service',
                description: 'Tailored solutions designed specifically for your business',
              },
              {
                title: 'Technology Driven',
                description: 'Modern tools and platforms for efficient service delivery',
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <FaCheckCircle className="text-5xl text-accent-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-primary-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-3xl p-12 text-center shadow-xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always looking for talented professionals to join our growing team. 
              Start your journey with us today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/interest-form"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg"
              >
                I'm Interested
              </Link>
              <Link
                to="/exited-form"
                className="bg-accent-600 text-white px-8 py-4 rounded-lg hover:bg-accent-700 transition font-semibold text-lg"
              >
                Excited to Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold">AccounTech</span>
              </div>
              <p className="text-gray-400">
                Professional accounting and advisory services for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Accounting</li>
                <li>Tax Planning</li>
                <li>Business Advisory</li>
                <li>Financial Consulting</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/get-started" className="hover:text-white transition">Careers</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@accountech.com</li>
                <li>Phone: +91 1234567890</li>
                <li>Location: India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AccounTech Advisory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
