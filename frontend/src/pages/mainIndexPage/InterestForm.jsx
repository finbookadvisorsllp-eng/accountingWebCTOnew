import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { candidateAPI } from "../../services/api";
import { State, City } from "country-state-city";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InterestForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  // Source of awareness options
  const sourceOptions = ["Social Media", "Referral", "Website", "University"];
  const [isOtherSource, setIsOtherSource] = useState(false);
  const [customSource, setCustomSource] = useState("");

  // State & City
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      gender: "",
      primaryContact: {
        countryCode: "+91",
        number: "",
      },
      currentAddress: {
        address: "",
        city: "",
        state: "",
        pin: "",
      },
    },
    detailedEducation: [
      {
        level: "",
        degree: "",
        institution: "",
        yearOfPassing: "",
        percentage: "",
        achievements: "",
      },
    ],
    detailedWorkExperience: [
      {
        employerName: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        responsibilities: "",
        reasonForLeaving: "",
      },
    ],
    interestInfo: {
      whyJoin: "",
      careerGoals: "",
      sourceOfAwareness: "",
    },
    consent: {
      accuracyDeclaration: false,
      dataProcessingConsent: false,
    },
  });

  // Stabilize handleChange with useCallback
  const handleChange = useCallback((section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  const handleNestedChange = useCallback(
    (section, subsection, field, value) => {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [field]: value,
          },
        },
      }));
    },
    [],
  );

  // Array helpers for detailedEducation & detailedWorkExperience
  const handleArrayUpdate = useCallback((section, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  }, []);

  const handleArrayAdd = useCallback((section, item) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], item],
    }));
  }, []);

  const handleArrayRemove = useCallback((section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  }, []);

  const addEducation = () => {
    handleArrayAdd("detailedEducation", {
      level: "",
      degree: "",
      institution: "",
      yearOfPassing: "",
      percentage: "",
      achievements: "",
    });
  };

  const addWorkExperience = () => {
    handleArrayAdd("detailedWorkExperience", {
      employerName: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
      reasonForLeaving: "",
    });
  };

  // Date of Birth – stable reference to avoid infinite loops
  const dateRef = useRef(null);
  useEffect(() => {
    const dateStr = formData.personalInfo.dateOfBirth;
    if (!dateStr) {
      dateRef.current = null;
      return;
    }
    const [year, month, day] = dateStr.split("-").map(Number);
    dateRef.current = new Date(Date.UTC(year, month - 1, day));
  }, [formData.personalInfo.dateOfBirth]);

  const handleDatePickerChange = useCallback(
    (date) => {
      if (!date) {
        handleChange("personalInfo", "dateOfBirth", "");
        return;
      }
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      handleChange("personalInfo", "dateOfBirth", `${year}-${month}-${day}`);
    },
    [handleChange],
  );

  // Load states on mount
  useEffect(() => {
    const allStates = State.getStatesOfCountry("IN") || [];
    setStates(allStates);
  }, []);

  // Load cities when state changes
  useEffect(() => {
    const selectedStateName = formData.personalInfo.currentAddress.state;
    if (!selectedStateName) {
      setCities([]);
      return;
    }
    const matchedState = states.find((s) => s.name === selectedStateName);
    if (!matchedState?.isoCode) {
      setCities([]);
      return;
    }
    setIsCitiesLoading(true);
    const stateCities = City.getCitiesOfState("IN", matchedState.isoCode) || [];
    setCities(stateCities);
    setIsCitiesLoading(false);
  }, [formData.personalInfo.currentAddress.state, states]);

  // Handle "Other" source
  useEffect(() => {
    const current = formData.interestInfo?.sourceOfAwareness;
    if (current && !sourceOptions.includes(current)) {
      setIsOtherSource(true);
      setCustomSource(current);
    } else {
      setIsOtherSource(false);
      setCustomSource("");
    }
  }, [formData.interestInfo?.sourceOfAwareness]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.consent.accuracyDeclaration ||
      !formData.consent.dataProcessingConsent
    ) {
      toast.error("Please accept all consent declarations");
      return;
    }

    // No resume validation – it's now optional

    setLoading(true);
    try {
      const formPayload = new FormData();

      // Only append resume if a file was selected
      if (resumeFile) {
        formPayload.append("resume", resumeFile);
      }

      formPayload.append("formData", JSON.stringify(formData));

      await candidateAPI.submitInterestForm(formPayload);
      toast.success("Interest form submitted successfully!");
      navigate("/success", { state: { form: "interest" } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-6 md:py-8">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between">
            <Link
              to="/get-started"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              <FaArrowLeft className="text-xs" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-lg md:text-xl font-bold text-gray-800">
                Interest Form
              </span>
            </div>
            <div className="w-12 md:w-16"></div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Express Your Interest
            </h1>
            <p className="text-sm text-gray-600">
              Fill out this form to stay updated on opportunities with us (~20%
              profile)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Personal Information */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.firstName}
                    onChange={(e) =>
                      handleChange("personalInfo", "firstName", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.personalInfo.lastName}
                    onChange={(e) =>
                      handleChange("personalInfo", "lastName", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.personalInfo.email}
                    onChange={(e) =>
                      handleChange("personalInfo", "email", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={dateRef.current}
                    onChange={handleDatePickerChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.personalInfo.gender}
                    onChange={(e) =>
                      handleChange("personalInfo", "gender", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Primary Contact */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Primary Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formData.personalInfo.primaryContact.countryCode}
                    onChange={(e) =>
                      handleNestedChange(
                        "personalInfo",
                        "primaryContact",
                        "countryCode",
                        e.target.value,
                      )
                    }
                    className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                  />
                  <input
                    type="tel"
                    required
                    value={formData.personalInfo.primaryContact.number}
                    onChange={(e) =>
                      handleNestedChange(
                        "personalInfo",
                        "primaryContact",
                        "number",
                        e.target.value,
                      )
                    }
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <h3 className="text-base font-medium text-gray-800">
                  Current Residential Address
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.personalInfo.currentAddress.address}
                    onChange={(e) =>
                      handleNestedChange(
                        "personalInfo",
                        "currentAddress",
                        "address",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
                    rows="3"
                    placeholder="Enter full address"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* State */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      State
                    </label>
                    <select
                      value={formData.personalInfo.currentAddress.state}
                      onChange={(e) => {
                        const newState = e.target.value;
                        handleNestedChange(
                          "personalInfo",
                          "currentAddress",
                          "state",
                          newState,
                        );
                        handleNestedChange(
                          "personalInfo",
                          "currentAddress",
                          "city",
                          "",
                        );
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      City
                    </label>
                    <select
                      value={formData.personalInfo.currentAddress.city}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalInfo",
                          "currentAddress",
                          "city",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                      disabled={
                        !formData.personalInfo.currentAddress.state ||
                        isCitiesLoading
                      }
                    >
                      <option value="">
                        {isCitiesLoading
                          ? "Loading cities..."
                          : formData.personalInfo.currentAddress.state
                            ? "Select City"
                            : "Select State first"}
                      </option>
                      {cities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.currentAddress.pin}
                      onChange={(e) =>
                        handleNestedChange(
                          "personalInfo",
                          "currentAddress",
                          "pin",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                      placeholder="PIN"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Educational Background */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Educational Background
                </h2>
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  + Add Education
                </button>
              </div>

              {formData.detailedEducation.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Education {index + 1}</span>
                    {formData.detailedEducation.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleArrayRemove("detailedEducation", index)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Level</label>
                      <select
                        value={edu.level}
                        onChange={(e) => handleArrayUpdate("detailedEducation", index, "level", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                      >
                        <option value="">Select level</option>
                        <option value="10th">10th</option>
                        <option value="12th">12th</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Post-Graduation">Post-Graduation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Degree / Certification</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleArrayUpdate("detailedEducation", index, "degree", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                        placeholder="e.g., B.Com, B.Tech"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleArrayUpdate("detailedEducation", index, "institution", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                        placeholder="School / University name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Year of Passing</label>
                      <input
                        type="number"
                        value={edu.yearOfPassing}
                        onChange={(e) => handleArrayUpdate("detailedEducation", index, "yearOfPassing", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                        placeholder="e.g., 2020"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Percentage / CGPA</label>
                      <input
                        type="number"
                        value={edu.percentage}
                        onChange={(e) => handleArrayUpdate("detailedEducation", index, "percentage", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                        placeholder="e.g., 85"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Achievements</label>
                      <input
                        type="text"
                        value={edu.achievements}
                        onChange={(e) => handleArrayUpdate("detailedEducation", index, "achievements", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                        placeholder="Any awards or achievements"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Work Experience */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Work Experience (Optional)
                </h2>
                <button
                  type="button"
                  onClick={addWorkExperience}
                  className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  + Add Experience
                </button>
              </div>

              {formData.detailedWorkExperience.map((work, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Experience {index + 1}</span>
                    {formData.detailedWorkExperience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleArrayRemove("detailedWorkExperience", index)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Employer / Company Name</label>
                      <input
                        type="text"
                        value={work.employerName}
                        onChange={(e) => handleArrayUpdate("detailedWorkExperience", index, "employerName", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={work.jobTitle}
                        onChange={(e) => handleArrayUpdate("detailedWorkExperience", index, "jobTitle", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                        placeholder="e.g., Junior Accountant"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={work.startDate}
                        onChange={(e) => handleArrayUpdate("detailedWorkExperience", index, "startDate", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={work.endDate}
                        onChange={(e) => handleArrayUpdate("detailedWorkExperience", index, "endDate", e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Key Responsibilities</label>
                    <textarea
                      value={work.responsibilities}
                      onChange={(e) => handleArrayUpdate("detailedWorkExperience", index, "responsibilities", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                      rows="2"
                      placeholder="Describe your key responsibilities..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Reason for Leaving</label>
                    <input
                      type="text"
                      value={work.reasonForLeaving}
                      onChange={(e) => handleArrayUpdate("detailedWorkExperience", index, "reasonForLeaving", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                      placeholder="e.g., Career growth"
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* Interest & Availability */}
            <section className="space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">
                Interest & Availability
              </h2>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Why do you want to join our team?
                </label>
                <textarea
                  value={formData.interestInfo.whyJoin}
                  onChange={(e) =>
                    handleChange("interestInfo", "whyJoin", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                  rows="3"
                  placeholder="Tell us why you're interested..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Long-term career goals
                </label>
                <textarea
                  value={formData.interestInfo.careerGoals}
                  onChange={(e) =>
                    handleChange("interestInfo", "careerGoals", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                  rows="3"
                  placeholder="Share your career aspirations..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  How did you hear about us?
                </label>
                <select
                  value={
                    isOtherSource
                      ? "other"
                      : formData.interestInfo.sourceOfAwareness || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "other") {
                      setIsOtherSource(true);
                      handleChange(
                        "interestInfo",
                        "sourceOfAwareness",
                        customSource,
                      );
                    } else {
                      setIsOtherSource(false);
                      handleChange("interestInfo", "sourceOfAwareness", val);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                >
                  <option value="">Select source</option>
                  {sourceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
                {isOtherSource && (
                  <input
                    type="text"
                    value={formData.interestInfo.sourceOfAwareness || ""}
                    onChange={(e) => {
                      const text = e.target.value;
                      setCustomSource(text);
                      handleChange("interestInfo", "sourceOfAwareness", text);
                    }}
                    placeholder="Please specify"
                    className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 transition"
                  />
                )}
              </div>
            </section>

            {/* Resume Upload */}
            <section>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Upload Resume (PDF/DOC/DOCX){" "}
                <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full text-sm border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition"
              />
            </section>

            {/* Consent & Declaration */}
            <section className="space-y-3">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 border-b pb-2">
                Consent & Declaration
              </h2>

              <div className="space-y-2">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent.accuracyDeclaration}
                    onChange={(e) =>
                      handleChange(
                        "consent",
                        "accuracyDeclaration",
                        e.target.checked,
                      )
                    }
                    className="mt-0.5 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-xs text-gray-700">
                    I declare that all the information provided is accurate to
                    the best of my knowledge.
                  </span>
                </label>

                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent.dataProcessingConsent}
                    onChange={(e) =>
                      handleChange(
                        "consent",
                        "dataProcessingConsent",
                        e.target.checked,
                      )
                    }
                    className="mt-0.5 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-xs text-gray-700">
                    I consent to the processing of my personal data for
                    recruitment purposes.
                  </span>
                </label>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Interest Form"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterestForm;
