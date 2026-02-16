import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCalculator, FaArrowLeft } from 'react-icons/fa';
import { candidateAPI } from '../services/api';

const InterestForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      primaryContact: {
        countryCode: '+91',
        number: ''
      },
      currentAddress: {
        address: '',
        city: '',
        state: '',
        pin: ''
      }
    },
    education: {
      highestQualification: '',
      yearOfPassing: '',
      certifications: []
    },
    workExperience: {
      jobTitle: '',
      companyName: '',
      yearsOfExperience: '',
      responsibilities: ''
    },
    interestInfo: {
      whyJoin: '',
      careerGoals: '',
      availability: '',
      sourceOfAwareness: ''
    },
    consent: {
      accuracyDeclaration: false,
      dataProcessingConsent: false
    }
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleCertificationAdd = () => {
    const cert = prompt('Enter certification name:');
    if (cert) {
      setFormData(prev => ({
        ...prev,
        education: {
          ...prev.education,
          certifications: [...prev.education.certifications, cert]
        }
      }));
    }
  };

  const handleCertificationRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        certifications: prev.education.certifications.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consent.accuracyDeclaration || !formData.consent.dataProcessingConsent) {
      toast.error('Please accept all consent declarations');
      return;
    }

    setLoading(true);

    try {
      const response = await candidateAPI.submitInterestForm(formData);
      toast.success('Interest form submitted successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
      {/* Header */}
      <div className="container mx-auto px-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <Link to="/get-started" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition">
              <FaArrowLeft />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <FaCalculator className="text-2xl text-primary-600" />
              <span className="text-xl font-bold text-gray-800">Interest Form</span>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Express Your Interest</h1>
            <p className="text-gray-600">Fill out this form to stay updated on opportunities with us (~20% profile)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Personal Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.firstName}
                    onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.lastName}
                    onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.personalInfo.gender}
                    onChange={(e) => handleChange('personalInfo', 'gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={formData.personalInfo.primaryContact.countryCode}
                    onChange={(e) => handleNestedChange('personalInfo', 'primaryContact', 'countryCode', e.target.value)}
                    className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  />
                  <input
                    type="tel"
                    required
                    value={formData.personalInfo.primaryContact.number}
                    onChange={(e) => handleNestedChange('personalInfo', 'primaryContact', 'number', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Current Residential Address</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.personalInfo.currentAddress.address}
                    onChange={(e) => handleNestedChange('personalInfo', 'currentAddress', 'address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    rows="3"
                    placeholder="Enter full address"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.personalInfo.currentAddress.city}
                      onChange={(e) => handleNestedChange('personalInfo', 'currentAddress', 'city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={formData.personalInfo.currentAddress.state}
                      onChange={(e) => handleNestedChange('personalInfo', 'currentAddress', 'state', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code</label>
                    <input
                      type="text"
                      value={formData.personalInfo.currentAddress.pin}
                      onChange={(e) => handleNestedChange('personalInfo', 'currentAddress', 'pin', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="PIN"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Background */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Educational Background</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Highest Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.education.highestQualification}
                    onChange={(e) => handleChange('education', 'highestQualification', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="e.g., Bachelor's in Commerce"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year of Passing
                  </label>
                  <input
                    type="number"
                    value={formData.education.yearOfPassing}
                    onChange={(e) => handleChange('education', 'yearOfPassing', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="e.g., 2020"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Relevant Certifications (Optional)
                </label>
                <div className="space-y-2">
                  {formData.education.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cert}
                        disabled
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => handleCertificationRemove(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleCertificationAdd}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
                  >
                    + Add Certification
                  </button>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Work Experience (Optional)</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current/Most Recent Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.workExperience.jobTitle}
                    onChange={(e) => handleChange('workExperience', 'jobTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="e.g., Junior Accountant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.workExperience.companyName}
                    onChange={(e) => handleChange('workExperience', 'companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={formData.workExperience.yearsOfExperience}
                    onChange={(e) => handleChange('workExperience', 'yearsOfExperience', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="e.g., 2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Key Responsibilities
                </label>
                <textarea
                  value={formData.workExperience.responsibilities}
                  onChange={(e) => handleChange('workExperience', 'responsibilities', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  rows="3"
                  placeholder="Describe your key responsibilities..."
                />
              </div>
            </div>

            {/* Interest & Availability */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Interest & Availability</h2>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Why do you want to join our team?
                </label>
                <textarea
                  value={formData.interestInfo.whyJoin}
                  onChange={(e) => handleChange('interestInfo', 'whyJoin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  rows="4"
                  placeholder="Tell us why you're interested..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Long-term career goals
                </label>
                <textarea
                  value={formData.interestInfo.careerGoals}
                  onChange={(e) => handleChange('interestInfo', 'careerGoals', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  rows="4"
                  placeholder="Share your career aspirations..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Availability to join
                  </label>
                  <input
                    type="text"
                    value={formData.interestInfo.availability}
                    onChange={(e) => handleChange('interestInfo', 'availability', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="e.g., Immediate or 30 days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    value={formData.interestInfo.sourceOfAwareness}
                    onChange={(e) => handleChange('interestInfo', 'sourceOfAwareness', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  >
                    <option value="">Select source</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Referral">Referral</option>
                    <option value="Website">Website</option>
                    <option value="University">University</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Consent & Declaration */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Consent & Declaration</h2>
              
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent.accuracyDeclaration}
                    onChange={(e) => handleChange('consent', 'accuracyDeclaration', e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">
                    I declare that all the information provided is accurate to the best of my knowledge.
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent.dataProcessingConsent}
                    onChange={(e) => handleChange('consent', 'dataProcessingConsent', e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700">
                    I consent to the processing of my personal data for recruitment purposes.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Interest Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterestForm;
