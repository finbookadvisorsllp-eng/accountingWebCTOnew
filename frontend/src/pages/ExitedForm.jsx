import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCalculator, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { candidateAPI } from '../services/api';

const ExitedForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingCandidate, setCheckingCandidate] = useState(false);
  const [existingCandidate, setExistingCandidate] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [checkIdentifier, setCheckIdentifier] = useState({ email: '', mobile: '' });

  const tabs = [
    'Personal Info',
    'Contact Info',
    'Family Background',
    'Education',
    'Work Experience',
    'Professional Interests',
    'References',
    'Documents',
    'Consent'
  ];

  const [formData, setFormData] = useState({
    candidateId: null,
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      primaryContact: { countryCode: '+91', number: '' },
      currentAddress: { address: '', city: '', state: '', pin: '' }
    },
    exitedPersonalInfo: {
      maritalStatus: '',
      nationality: '',
      languagesKnown: []
    },
    contactInfo: {
      email: '',
      alternateMobile: '',
      permanentAddress: {
        address: '',
        city: '',
        state: '',
        pin: '',
        sameAsCurrent: false
      }
    },
    familyBackground: {
      fatherOrSpouseName: '',
      occupation: '',
      numberOfChildren: 0,
      numberOfSiblings: 0,
      familyIncome: ''
    },
    detailedEducation: [],
    detailedWorkExperience: [],
    professionalInterests: {
      whyJoinTeam: '',
      longTermGoals: '',
      preferredWorkAreas: [],
      availabilityToJoin: ''
    },
    references: [],
    exitedDocuments: {
      passportPhoto: '',
      addressProof: '',
      identityProof: ''
    },
    exitedConsent: {
      dataCollectionConsent: false,
      informationAccuracy: false,
      termsAgreement: false,
      digitalSignature: false
    }
  });

  const handleCheckCandidate = async () => {
    if (!checkIdentifier.email && !checkIdentifier.mobile) {
      toast.error('Please provide email or mobile number');
      return;
    }

    setCheckingCandidate(true);
    try {
      const response = await candidateAPI.checkCandidate(checkIdentifier);
      if (response.data.exists) {
        setExistingCandidate(response.data.data);
        setFormData(prev => ({
          ...prev,
          candidateId: response.data.data._id,
          personalInfo: response.data.data.personalInfo,
          education: response.data.data.education,
          workExperience: response.data.data.workExperience,
          interestInfo: response.data.data.interestInfo
        }));
        toast.success('Existing data found and loaded!');
      } else {
        toast.info('No existing record found. Please fill the complete form.');
      }
    } catch (error) {
      toast.error('Error checking candidate');
    } finally {
      setCheckingCandidate(false);
    }
  };

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

  const handleArrayAdd = (section, item) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], item]
    }));
  };

  const handleArrayRemove = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleArrayUpdate = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addLanguage = () => {
    const lang = prompt('Enter language name:');
    if (lang) {
      setFormData(prev => ({
        ...prev,
        exitedPersonalInfo: {
          ...prev.exitedPersonalInfo,
          languagesKnown: [...prev.exitedPersonalInfo.languagesKnown, lang]
        }
      }));
    }
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      exitedPersonalInfo: {
        ...prev.exitedPersonalInfo,
        languagesKnown: prev.exitedPersonalInfo.languagesKnown.filter((_, i) => i !== index)
      }
    }));
  };

  const addPreferredWorkArea = () => {
    const area = prompt('Enter preferred work area:');
    if (area) {
      setFormData(prev => ({
        ...prev,
        professionalInterests: {
          ...prev.professionalInterests,
          preferredWorkAreas: [...prev.professionalInterests.preferredWorkAreas, area]
        }
      }));
    }
  };

  const removePreferredWorkArea = (index) => {
    setFormData(prev => ({
      ...prev,
      professionalInterests: {
        ...prev.professionalInterests,
        preferredWorkAreas: prev.professionalInterests.preferredWorkAreas.filter((_, i) => i !== index)
      }
    }));
  };

  const addEducation = () => {
    handleArrayAdd('detailedEducation', {
      level: '10th',
      degree: '',
      institution: '',
      yearOfPassing: '',
      percentage: '',
      achievements: ''
    });
  };

  const addWorkExperience = () => {
    handleArrayAdd('detailedWorkExperience', {
      employerName: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      responsibilities: '',
      reasonForLeaving: '',
      skills: []
    });
  };

  const addReference = () => {
    if (formData.references.length >= 2) {
      toast.warning('Maximum 2 references allowed');
      return;
    }
    handleArrayAdd('references', {
      name: '',
      relationship: '',
      contact: '',
      email: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.exitedConsent.dataCollectionConsent || 
        !formData.exitedConsent.informationAccuracy || 
        !formData.exitedConsent.termsAgreement || 
        !formData.exitedConsent.digitalSignature) {
      toast.error('Please accept all consent declarations');
      return;
    }

    setLoading(true);

    try {
      await candidateAPI.submitExitedForm(formData);
      toast.success('Exited form submitted successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  const nextTab = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const prevTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Personal Info
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Personal Information</h2>
            
            {!existingCandidate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-semibold mb-3">Already filled interest form? Check for existing data:</p>
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={checkIdentifier.email}
                    onChange={(e) => setCheckIdentifier({ ...checkIdentifier, email: e.target.value })}
                    className="flex-1 px-4 py-2 border border-blue-300 rounded-lg"
                  />
                  <input
                    type="tel"
                    placeholder="Enter mobile"
                    value={checkIdentifier.mobile}
                    onChange={(e) => setCheckIdentifier({ ...checkIdentifier, mobile: e.target.value })}
                    className="flex-1 px-4 py-2 border border-blue-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleCheckCandidate}
                    disabled={checkingCandidate}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {checkingCandidate ? 'Checking...' : 'Check'}
                  </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition ${existingCandidate ? 'bg-gray-100' : ''}`}
                  placeholder="Full name"
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
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition ${existingCandidate ? 'bg-gray-100' : ''}`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
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
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition ${existingCandidate ? 'bg-gray-100' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Marital Status <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.exitedPersonalInfo.maritalStatus}
                  onChange={(e) => handleChange('exitedPersonalInfo', 'maritalStatus', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                >
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.exitedPersonalInfo.nationality}
                  onChange={(e) => handleChange('exitedPersonalInfo', 'nationality', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  placeholder="e.g., Indian"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Languages Known
              </label>
              <div className="space-y-2">
                {formData.exitedPersonalInfo.languagesKnown.map((lang, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={lang}
                      disabled
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
                >
                  + Add Language
                </button>
              </div>
            </div>
          </div>
        );

      case 1: // Contact Info
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Contact Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.personalInfo.primaryContact.number}
                  onChange={(e) => handleNestedChange('personalInfo', 'primaryContact', 'number', e.target.value)}
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition ${existingCandidate ? 'bg-gray-100' : ''}`}
                  placeholder="Mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alternate Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo.alternateMobile}
                  onChange={(e) => handleChange('contactInfo', 'alternateMobile', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  placeholder="Alternate number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactInfo.email}
                  onChange={(e) => handleChange('contactInfo', 'email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Residential Address</h3>
              <textarea
                required
                value={formData.personalInfo.currentAddress.address}
                onChange={(e) => handleNestedChange('personalInfo', 'currentAddress', 'address', e.target.value)}
                disabled={existingCandidate}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition ${existingCandidate ? 'bg-gray-100' : ''}`}
                rows="3"
                placeholder="Current address"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Permanent Address</h3>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.contactInfo.permanentAddress.sameAsCurrent}
                  onChange={(e) => {
                    handleNestedChange('contactInfo', 'permanentAddress', 'sameAsCurrent', e.target.checked);
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        contactInfo: {
                          ...prev.contactInfo,
                          permanentAddress: {
                            ...prev.personalInfo.currentAddress,
                            sameAsCurrent: true
                          }
                        }
                      }));
                    }
                  }}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 font-semibold">Same as current address</span>
              </label>

              {!formData.contactInfo.permanentAddress.sameAsCurrent && (
                <textarea
                  required
                  value={formData.contactInfo.permanentAddress.address}
                  onChange={(e) => handleNestedChange('contactInfo', 'permanentAddress', 'address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  rows="3"
                  placeholder="Permanent address"
                />
              )}
            </div>
          </div>
        );

      case 2: // Family Background
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Family Background</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Father/Spouse Name
                </label>
                <input
                  type="text"
                  value={formData.familyBackground.fatherOrSpouseName}
                  onChange={(e) => handleChange('familyBackground', 'fatherOrSpouseName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  placeholder="Name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.familyBackground.occupation}
                  onChange={(e) => handleChange('familyBackground', 'occupation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  placeholder="Occupation"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Children
                </label>
                <input
                  type="number"
                  value={formData.familyBackground.numberOfChildren}
                  onChange={(e) => handleChange('familyBackground', 'numberOfChildren', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Siblings
                </label>
                <input
                  type="number"
                  value={formData.familyBackground.numberOfSiblings}
                  onChange={(e) => handleChange('familyBackground', 'numberOfSiblings', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Family Income (Optional)
                </label>
                <input
                  type="text"
                  value={formData.familyBackground.familyIncome}
                  onChange={(e) => handleChange('familyBackground', 'familyIncome', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  placeholder="e.g., 5-10 LPA"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Education
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Educational Qualifications</h2>
            
            {formData.detailedEducation.map((edu, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Education #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('detailedEducation', index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                    <select
                      value={edu.level}
                      onChange={(e) => handleArrayUpdate('detailedEducation', index, 'level', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    >
                      <option value="10th">10th</option>
                      <option value="12th">12th</option>
                      <option value="Graduation">Graduation</option>
                      <option value="Post-Graduation">Post-Graduation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Degree/Certification</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleArrayUpdate('detailedEducation', index, 'degree', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="Degree name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleArrayUpdate('detailedEducation', index, 'institution', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="School/University name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year of Passing</label>
                    <input
                      type="number"
                      value={edu.yearOfPassing}
                      onChange={(e) => handleArrayUpdate('detailedEducation', index, 'yearOfPassing', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Percentage/CGPA</label>
                    <input
                      type="text"
                      value={edu.percentage}
                      onChange={(e) => handleArrayUpdate('detailedEducation', index, 'percentage', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="e.g., 85%"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Achievements</label>
                    <textarea
                      value={edu.achievements}
                      onChange={(e) => handleArrayUpdate('detailedEducation', index, 'achievements', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      rows="2"
                      placeholder="Any achievements or awards..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addEducation}
              className="w-full px-4 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
            >
              + Add Education
            </button>
          </div>
        );

      case 4: // Work Experience
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Work Experience</h2>
            
            {formData.detailedWorkExperience.map((work, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Experience #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('detailedWorkExperience', index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employer Name</label>
                    <input
                      type="text"
                      value={work.employerName}
                      onChange={(e) => handleArrayUpdate('detailedWorkExperience', index, 'employerName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="Company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={work.jobTitle}
                      onChange={(e) => handleArrayUpdate('detailedWorkExperience', index, 'jobTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="Position"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={work.startDate}
                      onChange={(e) => handleArrayUpdate('detailedWorkExperience', index, 'startDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={work.endDate}
                      onChange={(e) => handleArrayUpdate('detailedWorkExperience', index, 'endDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Responsibilities</label>
                    <textarea
                      value={work.responsibilities}
                      onChange={(e) => handleArrayUpdate('detailedWorkExperience', index, 'responsibilities', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      rows="3"
                      placeholder="Describe your responsibilities..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Leaving</label>
                    <input
                      type="text"
                      value={work.reasonForLeaving}
                      onChange={(e) => handleArrayUpdate('detailedWorkExperience', index, 'reasonForLeaving', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="Reason"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addWorkExperience}
              className="w-full px-4 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
            >
              + Add Work Experience
            </button>
          </div>
        );

      case 5: // Professional Interests
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Professional Interests & Goals</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Why do you want to join our accounting team?
              </label>
              <textarea
                value={formData.professionalInterests.whyJoinTeam}
                onChange={(e) => handleChange('professionalInterests', 'whyJoinTeam', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                rows="4"
                placeholder="Share your motivation..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Long-term career goals
              </label>
              <textarea
                value={formData.professionalInterests.longTermGoals}
                onChange={(e) => handleChange('professionalInterests', 'longTermGoals', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                rows="4"
                placeholder="What are your career aspirations?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Work Areas
              </label>
              <div className="space-y-2">
                {formData.professionalInterests.preferredWorkAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={area}
                      disabled
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => removePreferredWorkArea(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPreferredWorkArea}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
                >
                  + Add Work Area
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Availability to Join
              </label>
              <input
                type="text"
                value={formData.professionalInterests.availabilityToJoin}
                onChange={(e) => handleChange('professionalInterests', 'availabilityToJoin', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                placeholder="e.g., Immediate, 30 days notice"
              />
            </div>
          </div>
        );

      case 6: // References
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">References (Max 2)</h2>
            
            {formData.references.map((ref, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Reference #{index + 1} {index === 1 && <span className="text-sm text-gray-500">(Optional)</span>}</h3>
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('references', index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={ref.name}
                      onChange={(e) => handleArrayUpdate('references', index, 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="Reference name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship</label>
                    <input
                      type="text"
                      value={ref.relationship}
                      onChange={(e) => handleArrayUpdate('references', index, 'relationship', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="e.g., Former Manager"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact</label>
                    <input
                      type="tel"
                      value={ref.contact}
                      onChange={(e) => handleArrayUpdate('references', index, 'contact', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="Phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={ref.email}
                      onChange={(e) => handleArrayUpdate('references', index, 'email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </div>
            ))}

            {formData.references.length < 2 && (
              <button
                type="button"
                onClick={addReference}
                className="w-full px-4 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
              >
                + Add Reference
              </button>
            )}
          </div>
        );

      case 7: // Documents
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Documents Upload</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Note:</strong> Document upload functionality requires file handling. For now, you can proceed and upload documents later through the admin panel.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resume/CV</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Passport Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Proof</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Identity Proof (Aadhar/PAN/Passport)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        );

      case 8: // Consent
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Consent & Declaration</h2>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.exitedConsent.dataCollectionConsent}
                  onChange={(e) => handleChange('exitedConsent', 'dataCollectionConsent', e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">
                  I consent to the collection and processing of my personal data for recruitment and employment purposes.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.exitedConsent.informationAccuracy}
                  onChange={(e) => handleChange('exitedConsent', 'informationAccuracy', e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">
                  I declare that all information provided is true and accurate to the best of my knowledge.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.exitedConsent.termsAgreement}
                  onChange={(e) => handleChange('exitedConsent', 'termsAgreement', e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">
                  I agree to the terms and conditions of employment and company policies.
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.exitedConsent.digitalSignature}
                  onChange={(e) => handleChange('exitedConsent', 'digitalSignature', e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">
                  This serves as my digital signature and acknowledgment of the above declarations.
                </span>
              </label>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <div className="flex items-start space-x-3">
                <FaCheck className="text-green-600 text-2xl mt-1" />
                <div>
                  <h3 className="font-bold text-green-900 mb-2">Ready to Submit!</h3>
                  <p className="text-green-800">
                    Please review all the information you've entered before submitting. Once submitted, your application will be reviewed by our team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
              <FaCalculator className="text-2xl text-accent-600" />
              <span className="text-xl font-bold text-gray-800">Application Form</span>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-accent-600 to-accent-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">Complete Your Application (~50% profile)</h1>
              <span className="text-white font-semibold">Step {currentTab + 1} of {tabs.length}</span>
            </div>
            <div className="flex overflow-x-auto scrollbar-hide space-x-2">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTab(index)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                    currentTab === index
                      ? 'bg-white text-accent-600'
                      : currentTab > index
                      ? 'bg-accent-500 text-white'
                      : 'bg-accent-700 text-accent-200'
                  }`}
                >
                  {currentTab > index && <FaCheck className="inline mr-1" />}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            {renderTabContent()}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevTab}
                disabled={currentTab === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentTab < tabs.length - 1 ? (
                <button
                  type="button"
                  onClick={nextTab}
                  className="flex-1 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition font-semibold"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExitedForm;
