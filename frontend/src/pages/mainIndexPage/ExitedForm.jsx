// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { FaCalculator, FaArrowLeft, FaCheck } from "react-icons/fa";
// import { candidateAPI } from "../services/api";

// const ExitedForm = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [checkingCandidate, setCheckingCandidate] = useState(false);
//   const [existingCandidate, setExistingCandidate] = useState(null);
//   const [currentTab, setCurrentTab] = useState(0);
//   const [checkIdentifier, setCheckIdentifier] = useState({
//     email: "",
//     mobile: "",
//   });

//   const tabs = [
//     "Personal Info",
//     "Contact Info",
//     "Family Background",
//     "Education",
//     "Work Experience",
//     "Professional Interests",
//     "References",
//     "Documents",
//     "Consent",
//   ];

//   const [formData, setFormData] = useState({
//     candidateId: null,
//     personalInfo: {
//       firstName: "",
//       lastName: "",
//       dateOfBirth: "",
//       gender: "",
//       primaryContact: { countryCode: "+91", number: "" },
//       currentAddress: { address: "", city: "", state: "", pin: "" },
//     },
//     exitedPersonalInfo: {
//       maritalStatus: "",
//       nationality: "",
//       languagesKnown: [],
//     },
//     contactInfo: {
//       email: "",
//       alternateMobile: "",
//       permanentAddress: {
//         address: "",
//         city: "",
//         state: "",
//         pin: "",
//         sameAsCurrent: false,
//       },
//     },
//     familyBackground: {
//       fatherOrSpouseName: "",
//       occupation: "",
//       numberOfChildren: 0,
//       numberOfSiblings: 0,
//       familyIncome: "",
//     },
//     detailedEducation: [],
//     detailedWorkExperience: [],
//     professionalInterests: {
//       whyJoinTeam: "",
//       longTermGoals: "",
//       preferredWorkAreas: [],
//       availabilityToJoin: "",
//     },
//     references: [],
//     exitedDocuments: {
//       passportPhoto: "",
//       addressProof: "",
//       identityProof: "",
//     },
//     exitedConsent: {
//       dataCollectionConsent: false,
//       informationAccuracy: false,
//       termsAgreement: false,
//       digitalSignature: false,
//     },
//   });

//   const handleCheckCandidate = async () => {
//     if (!checkIdentifier.email && !checkIdentifier.mobile) {
//       toast.error("Please provide email or mobile number");
//       return;
//     }

//     setCheckingCandidate(true);
//     try {
//       const response = await candidateAPI.checkCandidate(checkIdentifier);
//       if (response.data.exists) {
//         setExistingCandidate(response.data.data);
//         setFormData((prev) => ({
//           ...prev,
//           candidateId: response.data.data._id,
//           personalInfo: response.data.data.personalInfo,
//           education: response.data.data.education,
//           workExperience: response.data.data.workExperience,
//           interestInfo: response.data.data.interestInfo,
//         }));
//         toast.success("Existing data found and loaded!");
//       } else {
//         toast.info("No existing record found. Please fill the complete form.");
//       }
//     } catch (error) {
//       toast.error("Error checking candidate");
//     } finally {
//       setCheckingCandidate(false);
//     }
//   };

//   const handleChange = (section, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }));
//   };

//   const handleNestedChange = (section, subsection, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [subsection]: {
//           ...prev[section][subsection],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   const handleArrayAdd = (section, item) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: [...prev[section], item],
//     }));
//   };

//   const handleArrayRemove = (section, index) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: prev[section].filter((_, i) => i !== index),
//     }));
//   };

//   const handleArrayUpdate = (section, index, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: prev[section].map((item, i) =>
//         i === index ? { ...item, [field]: value } : item,
//       ),
//     }));
//   };

//   const addLanguage = () => {
//     const lang = prompt("Enter language name:");
//     if (lang) {
//       setFormData((prev) => ({
//         ...prev,
//         exitedPersonalInfo: {
//           ...prev.exitedPersonalInfo,
//           languagesKnown: [...prev.exitedPersonalInfo.languagesKnown, lang],
//         },
//       }));
//     }
//   };

//   const removeLanguage = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       exitedPersonalInfo: {
//         ...prev.exitedPersonalInfo,
//         languagesKnown: prev.exitedPersonalInfo.languagesKnown.filter(
//           (_, i) => i !== index,
//         ),
//       },
//     }));
//   };

//   const addPreferredWorkArea = () => {
//     const area = prompt("Enter preferred work area:");
//     if (area) {
//       setFormData((prev) => ({
//         ...prev,
//         professionalInterests: {
//           ...prev.professionalInterests,
//           preferredWorkAreas: [
//             ...prev.professionalInterests.preferredWorkAreas,
//             area,
//           ],
//         },
//       }));
//     }
//   };

//   const removePreferredWorkArea = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       professionalInterests: {
//         ...prev.professionalInterests,
//         preferredWorkAreas:
//           prev.professionalInterests.preferredWorkAreas.filter(
//             (_, i) => i !== index,
//           ),
//       },
//     }));
//   };

//   const addEducation = () => {
//     handleArrayAdd("detailedEducation", {
//       level: "10th",
//       degree: "",
//       institution: "",
//       yearOfPassing: "",
//       percentage: "",
//       achievements: "",
//     });
//   };

//   const addWorkExperience = () => {
//     handleArrayAdd("detailedWorkExperience", {
//       employerName: "",
//       jobTitle: "",
//       startDate: "",
//       endDate: "",
//       responsibilities: "",
//       reasonForLeaving: "",
//       skills: [],
//     });
//   };

//   const addReference = () => {
//     if (formData.references.length >= 2) {
//       toast.warning("Maximum 2 references allowed");
//       return;
//     }
//     handleArrayAdd("references", {
//       name: "",
//       relationship: "",
//       contact: "",
//       email: "",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !formData.exitedConsent.dataCollectionConsent ||
//       !formData.exitedConsent.informationAccuracy ||
//       !formData.exitedConsent.termsAgreement ||
//       !formData.exitedConsent.digitalSignature
//     ) {
//       toast.error("Please accept all consent declarations");
//       return;
//     }

//     setLoading(true);

//     try {
//       await candidateAPI.submitExitedForm(formData);
//       toast.success("Exited form submitted successfully!");
//       setTimeout(() => {
//         navigate("/success", { state: { form: "exited" } });
//       }, 2000);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to submit form");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextTab = () => {
//     if (currentTab < tabs.length - 1) {
//       setCurrentTab(currentTab + 1);
//     }
//   };

//   const prevTab = () => {
//     if (currentTab > 0) {
//       setCurrentTab(currentTab - 1);
//     }
//   };

//   const renderTabContent = () => {
//     switch (currentTab) {
//       case 0: // Personal Info
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
//               Personal Information
//             </h2>

//             {!existingCandidate && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <p className="text-blue-800 font-semibold mb-3">
//                   Already filled interest form? Check for existing data:
//                 </p>
//                 <div className="flex gap-4">
//                   <input
//                     type="email"
//                     placeholder="Enter email"
//                     value={checkIdentifier.email}
//                     onChange={(e) =>
//                       setCheckIdentifier({
//                         ...checkIdentifier,
//                         email: e.target.value,
//                       })
//                     }
//                     className="flex-1 px-4 py-2 border border-blue-300 rounded-lg"
//                   />
//                   <input
//                     type="tel"
//                     placeholder="Enter mobile"
//                     value={checkIdentifier.mobile}
//                     onChange={(e) =>
//                       setCheckIdentifier({
//                         ...checkIdentifier,
//                         mobile: e.target.value,
//                       })
//                     }
//                     className="flex-1 px-4 py-2 border border-blue-300 rounded-lg"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleCheckCandidate}
//                     disabled={checkingCandidate}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                   >
//                     {checkingCandidate ? "Checking..." : "Check"}
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.personalInfo.firstName}
//                   onChange={(e) =>
//                     handleChange("personalInfo", "firstName", e.target.value)
//                   }
//                   disabled={existingCandidate}
//                   className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition ${existingCandidate ? "bg-gray-100" : ""}`}
//                   placeholder="Full name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Gender <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   required
//                   value={formData.personalInfo.gender}
//                   onChange={(e) =>
//                     handleChange("personalInfo", "gender", e.target.value)
//                   }
//                   disabled={existingCandidate}
//                   className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition ${existingCandidate ? "bg-gray-100" : ""}`}
//                 >
//                   <option value="">Select gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Date of Birth <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   value={formData.personalInfo.dateOfBirth}
//                   onChange={(e) =>
//                     handleChange("personalInfo", "dateOfBirth", e.target.value)
//                   }
//                   disabled={existingCandidate}
//                   className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition ${existingCandidate ? "bg-gray-100" : ""}`}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Marital Status <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   required
//                   value={formData.exitedPersonalInfo.maritalStatus}
//                   onChange={(e) =>
//                     handleChange(
//                       "exitedPersonalInfo",
//                       "maritalStatus",
//                       e.target.value,
//                     )
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                 >
//                   <option value="">Select status</option>
//                   <option value="Single">Single</option>
//                   <option value="Married">Married</option>
//                   <option value="Divorced">Divorced</option>
//                   <option value="Widowed">Widowed</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Nationality <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.exitedPersonalInfo.nationality}
//                   onChange={(e) =>
//                     handleChange(
//                       "exitedPersonalInfo",
//                       "nationality",
//                       e.target.value,
//                     )
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                   placeholder="e.g., Indian"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Languages Known
//               </label>
//               <div className="space-y-2">
//                 {formData.exitedPersonalInfo.languagesKnown.map(
//                   (lang, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <input
//                         type="text"
//                         value={lang}
//                         disabled
//                         className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeLanguage(index)}
//                         className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ),
//                 )}
//                 <button
//                   type="button"
//                   onClick={addLanguage}
//                   className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
//                 >
//                   + Add Language
//                 </button>
//               </div>
//             </div>
//           </div>
//         );

//       case 1: // Contact Info
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
//               Contact Information
//             </h2>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Mobile Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   required
//                   value={formData.personalInfo.primaryContact.number}
//                   onChange={(e) =>
//                     handleNestedChange(
//                       "personalInfo",
//                       "primaryContact",
//                       "number",
//                       e.target.value,
//                     )
//                   }
//                   disabled={existingCandidate}
//                   className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition ${existingCandidate ? "bg-gray-100" : ""}`}
//                   placeholder="Mobile number"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Alternate Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.contactInfo.alternateMobile}
//                   onChange={(e) =>
//                     handleChange(
//                       "contactInfo",
//                       "alternateMobile",
//                       e.target.value,
//                     )
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                   placeholder="Alternate number"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Email Address <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   required
//                   value={formData.contactInfo.email}
//                   onChange={(e) =>
//                     handleChange("contactInfo", "email", e.target.value)
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                   placeholder="Email address"
//                 />
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Residential Address
//               </h3>
//               <textarea
//                 required
//                 value={formData.personalInfo.currentAddress.address}
//                 onChange={(e) =>
//                   handleNestedChange(
//                     "personalInfo",
//                     "currentAddress",
//                     "address",
//                     e.target.value,
//                   )
//                 }
//                 disabled={existingCandidate}
//                 className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition ${existingCandidate ? "bg-gray-100" : ""}`}
//                 rows="3"
//                 placeholder="Current address"
//               />
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 Permanent Address
//               </h3>
//               <label className="flex items-center space-x-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.contactInfo.permanentAddress.sameAsCurrent}
//                   onChange={(e) => {
//                     handleNestedChange(
//                       "contactInfo",
//                       "permanentAddress",
//                       "sameAsCurrent",
//                       e.target.checked,
//                     );
//                     if (e.target.checked) {
//                       setFormData((prev) => ({
//                         ...prev,
//                         contactInfo: {
//                           ...prev.contactInfo,
//                           permanentAddress: {
//                             ...prev.personalInfo.currentAddress,
//                             sameAsCurrent: true,
//                           },
//                         },
//                       }));
//                     }
//                   }}
//                   className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                 />
//                 <span className="text-gray-700 font-semibold">
//                   Same as current address
//                 </span>
//               </label>

//               {!formData.contactInfo.permanentAddress.sameAsCurrent && (
//                 <textarea
//                   required
//                   value={formData.contactInfo.permanentAddress.address}
//                   onChange={(e) =>
//                     handleNestedChange(
//                       "contactInfo",
//                       "permanentAddress",
//                       "address",
//                       e.target.value,
//                     )
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                   rows="3"
//                   placeholder="Permanent address"
//                 />
//               )}
//             </div>
//           </div>
//         );

//       case 2: // Family Background
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
//               Family Background
//             </h2>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Father/Spouse Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.familyBackground.fatherOrSpouseName}
//                   onChange={(e) =>
//                     handleChange(
//                       "familyBackground",
//                       "fatherOrSpouseName",
//                       e.target.value,
//                     )
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                   placeholder="Name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Occupation
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.familyBackground.occupation}
//                   onChange={(e) =>
//                     handleChange(
//                       "familyBackground",
//                       "occupation",
//                       e.target.value,
//                     )
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                   placeholder="Occupation"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Number of Children
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.familyBackground.numberOfChildren}
//                   onChange={(e) =>
//                     handleChange(
//                       "familyBackground",
//                       "numberOfChildren",
//                       parseInt(e.target.value) || 0,
//                     )
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                   min="0"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Number of Siblings
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.familyBackground.numberOfSiblings}
//                   onChange={(e) =>
//                     handleChange(
//                       "familyBackground",
//                       "numberOfSiblings",
//                       parseInt(e.target.value) || 0,
//                     )
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                   min="0"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Family Income (Optional)
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.familyBackground.familyIncome}
//                   onChange={(e) =>
//                     handleChange(
//                       "familyBackground",
//                       "familyIncome",
//                       e.target.value,
//                     )
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                   placeholder="e.g., 5-10 LPA"
//                 />
//               </div>
//             </div>
//           </div>
//         );

//       case 3: // Education
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
//               Educational Qualifications
//             </h2>

//             {formData.detailedEducation.map((edu, index) => (
//               <div
//                 key={index}
//                 className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200"
//               >
//                 <div className="flex justify-between items-center">
//                   <h3 className="font-semibold text-lg">
//                     Education #{index + 1}
//                   </h3>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       handleArrayRemove("detailedEducation", index)
//                     }
//                     className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//                   >
//                     Remove
//                   </button>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Level
//                     </label>
//                     <select
//                       value={edu.level}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedEducation",
//                           index,
//                           "level",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                     >
//                       <option value="10th">10th</option>
//                       <option value="12th">12th</option>
//                       <option value="Graduation">Graduation</option>
//                       <option value="Post-Graduation">Post-Graduation</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Degree/Certification
//                     </label>
//                     <input
//                       type="text"
//                       value={edu.degree}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedEducation",
//                           index,
//                           "degree",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       placeholder="Degree name"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Institution
//                     </label>
//                     <input
//                       type="text"
//                       value={edu.institution}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedEducation",
//                           index,
//                           "institution",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       placeholder="School/University name"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Year of Passing
//                     </label>
//                     <input
//                       type="number"
//                       value={edu.yearOfPassing}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedEducation",
//                           index,
//                           "yearOfPassing",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Percentage/CGPA
//                     </label>
//                     <input
//                       type="text"
//                       value={edu.percentage}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedEducation",
//                           index,
//                           "percentage",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       placeholder="e.g., 85%"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Achievements
//                     </label>
//                     <textarea
//                       value={edu.achievements}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedEducation",
//                           index,
//                           "achievements",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       rows="2"
//                       placeholder="Any achievements or awards..."
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}

//             <button
//               type="button"
//               onClick={addEducation}
//               className="w-full px-4 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
//             >
//               + Add Education
//             </button>
//           </div>
//         );

//       case 4: // Work Experience
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
//               Work Experience
//             </h2>

//             {formData.detailedWorkExperience.map((work, index) => (
//               <div
//                 key={index}
//                 className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200"
//               >
//                 <div className="flex justify-between items-center">
//                   <h3 className="font-semibold text-lg">
//                     Experience #{index + 1}
//                   </h3>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       handleArrayRemove("detailedWorkExperience", index)
//                     }
//                     className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//                   >
//                     Remove
//                   </button>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Employer Name
//                     </label>
//                     <input
//                       type="text"
//                       value={work.employerName}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedWorkExperience",
//                           index,
//                           "employerName",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       placeholder="Company name"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Job Title
//                     </label>
//                     <input
//                       type="text"
//                       value={work.jobTitle}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedWorkExperience",
//                           index,
//                           "jobTitle",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       placeholder="Position"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       value={work.startDate}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedWorkExperience",
//                           index,
//                           "startDate",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       value={work.endDate}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedWorkExperience",
//                           index,
//                           "endDate",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Responsibilities
//                     </label>
//                     <textarea
//                       value={work.responsibilities}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedWorkExperience",
//                           index,
//                           "responsibilities",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       rows="3"
//                       placeholder="Describe your responsibilities..."
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Reason for Leaving
//                     </label>
//                     <input
//                       type="text"
//                       value={work.reasonForLeaving}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "detailedWorkExperience",
//                           index,
//                           "reasonForLeaving",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       placeholder="Reason"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}

//             <button
//               type="button"
//               onClick={addWorkExperience}
//               className="w-full px-4 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
//             >
//               + Add Work Experience
//             </button>
//           </div>
//         );

//       case 5: // Professional Interests
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
//               Professional Interests & Goals
//             </h2>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Why do you want to join our accounting team?
//               </label>
//               <textarea
//                 value={formData.professionalInterests.whyJoinTeam}
//                 onChange={(e) =>
//                   handleChange(
//                     "professionalInterests",
//                     "whyJoinTeam",
//                     e.target.value,
//                   )
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                 rows="4"
//                 placeholder="Share your motivation..."
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Long-term career goals
//               </label>
//               <textarea
//                 value={formData.professionalInterests.longTermGoals}
//                 onChange={(e) =>
//                   handleChange(
//                     "professionalInterests",
//                     "longTermGoals",
//                     e.target.value,
//                   )
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                 rows="4"
//                 placeholder="What are your career aspirations?"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Preferred Work Areas
//               </label>
//               <div className="space-y-2">
//                 {formData.professionalInterests.preferredWorkAreas.map(
//                   (area, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <input
//                         type="text"
//                         value={area}
//                         disabled
//                         className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removePreferredWorkArea(index)}
//                         className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   ),
//                 )}
//                 <button
//                   type="button"
//                   onClick={addPreferredWorkArea}
//                   className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
//                 >
//                   + Add Work Area
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Availability to Join
//               </label>
//               <input
//                 type="text"
//                 value={formData.professionalInterests.availabilityToJoin}
//                 onChange={(e) =>
//                   handleChange(
//                     "professionalInterests",
//                     "availabilityToJoin",
//                     e.target.value,
//                   )
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                 placeholder="e.g., Immediate, 30 days notice"
//               />
//             </div>
//           </div>
//         );

//       case 6: // References
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
//               References (Max 2)
//             </h2>

//             {formData.references.map((ref, index) => (
//               <div
//                 key={index}
//                 className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200"
//               >
//                 <div className="flex justify-between items-center">
//                   <h3 className="font-semibold text-lg">
//                     Reference #{index + 1}{" "}
//                     {index === 1 && (
//                       <span className="text-sm text-gray-500">(Optional)</span>
//                     )}
//                   </h3>
//                   <button
//                     type="button"
//                     onClick={() => handleArrayRemove("references", index)}
//                     className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
//                   >
//                     Remove
//                   </button>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       value={ref.name}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "references",
//                           index,
//                           "name",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       placeholder="Reference name"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Relationship
//                     </label>
//                     <input
//                       type="text"
//                       value={ref.relationship}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "references",
//                           index,
//                           "relationship",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       placeholder="e.g., Former Manager"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Contact
//                     </label>
//                     <input
//                       type="tel"
//                       value={ref.contact}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "references",
//                           index,
//                           "contact",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       placeholder="Phone number"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={ref.email}
//                       onChange={(e) =>
//                         handleArrayUpdate(
//                           "references",
//                           index,
//                           "email",
//                           e.target.value,
//                         )
//                       }
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                       placeholder="Email address"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {formData.references.length < 2 && (
//               <button
//                 type="button"
//                 onClick={addReference}
//                 className="w-full px-4 py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
//               >
//                 + Add Reference
//               </button>
//             )}
//           </div>
//         );

//       case 7: // Documents
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
//               Documents Upload
//             </h2>

//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//               <p className="text-yellow-800">
//                 <strong>Note:</strong> Document upload functionality requires
//                 file handling. For now, you can proceed and upload documents
//                 later through the admin panel.
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Resume/CV
//                 </label>
//                 <input
//                   type="file"
//                   accept=".pdf,.doc,.docx"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Passport Photo
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Address Proof
//                 </label>
//                 <input
//                   type="file"
//                   accept=".pdf,image/*"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Identity Proof (Aadhar/PAN/Passport)
//                 </label>
//                 <input
//                   type="file"
//                   accept=".pdf,image/*"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition"
//                 />
//               </div>
//             </div>
//           </div>
//         );

//       case 8: // Consent
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
//               Consent & Declaration
//             </h2>

//             <div className="space-y-4">
//               <label className="flex items-start space-x-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   required
//                   checked={formData.exitedConsent.dataCollectionConsent}
//                   onChange={(e) =>
//                     handleChange(
//                       "exitedConsent",
//                       "dataCollectionConsent",
//                       e.target.checked,
//                     )
//                   }
//                   className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                 />
//                 <span className="text-gray-700">
//                   I consent to the collection and processing of my personal data
//                   for recruitment and employment purposes.
//                 </span>
//               </label>

//               <label className="flex items-start space-x-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   required
//                   checked={formData.exitedConsent.informationAccuracy}
//                   onChange={(e) =>
//                     handleChange(
//                       "exitedConsent",
//                       "informationAccuracy",
//                       e.target.checked,
//                     )
//                   }
//                   className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                 />
//                 <span className="text-gray-700">
//                   I declare that all information provided is true and accurate
//                   to the best of my knowledge.
//                 </span>
//               </label>

//               <label className="flex items-start space-x-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   required
//                   checked={formData.exitedConsent.termsAgreement}
//                   onChange={(e) =>
//                     handleChange(
//                       "exitedConsent",
//                       "termsAgreement",
//                       e.target.checked,
//                     )
//                   }
//                   className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                 />
//                 <span className="text-gray-700">
//                   I agree to the terms and conditions of employment and company
//                   policies.
//                 </span>
//               </label>

//               <label className="flex items-start space-x-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   required
//                   checked={formData.exitedConsent.digitalSignature}
//                   onChange={(e) =>
//                     handleChange(
//                       "exitedConsent",
//                       "digitalSignature",
//                       e.target.checked,
//                     )
//                   }
//                   className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
//                 />
//                 <span className="text-gray-700">
//                   This serves as my digital signature and acknowledgment of the
//                   above declarations.
//                 </span>
//               </label>
//             </div>

//             <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
//               <div className="flex items-start space-x-3">
//                 <FaCheck className="text-green-600 text-2xl mt-1" />
//                 <div>
//                   <h3 className="font-bold text-green-900 mb-2">
//                     Ready to Submit!
//                   </h3>
//                   <p className="text-green-800">
//                     Please review all the information you've entered before
//                     submitting. Once submitted, your application will be
//                     reviewed by our team.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
//       {/* Header */}
//       <div className="container mx-auto px-6 mb-8">
//         <div className="bg-white rounded-2xl shadow-md p-6">
//           <div className="flex items-center justify-between">
//             <Link
//               to="/get-started"
//               className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
//             >
//               <FaArrowLeft />
//               <span>Back</span>
//             </Link>
//             <div className="flex items-center space-x-2">
//               <FaCalculator className="text-2xl text-accent-600" />
//               <span className="text-xl font-bold text-gray-800">
//                 Application Form
//               </span>
//             </div>
//             <div className="w-16"></div>
//           </div>
//         </div>
//       </div>

//       {/* Form Container */}
//       <div className="container mx-auto px-6 max-w-6xl">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Tab Navigation */}
//           <div className="bg-gradient-to-r from-accent-600 to-accent-700 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h1 className="text-2xl font-bold text-white">
//                 Complete Your Application (~50% profile)
//               </h1>
//               <span className="text-white font-semibold">
//                 Step {currentTab + 1} of {tabs.length}
//               </span>
//             </div>
//             <div className="flex overflow-x-auto scrollbar-hide space-x-2">
//               {tabs.map((tab, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentTab(index)}
//                   className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
//                     currentTab === index
//                       ? "bg-white text-accent-600"
//                       : currentTab > index
//                         ? "bg-accent-500 text-white"
//                         : "bg-accent-700 text-accent-200"
//                   }`}
//                 >
//                   {currentTab > index && <FaCheck className="inline mr-1" />}
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Form Content */}
//           <form onSubmit={handleSubmit} className="p-8">
//             {renderTabContent()}

//             {/* Navigation Buttons */}
//             <div className="flex gap-4 mt-8 pt-6 border-t">
//               <button
//                 type="button"
//                 onClick={prevTab}
//                 disabled={currentTab === 0}
//                 className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>

//               {currentTab < tabs.length - 1 ? (
//                 <button
//                   type="button"
//                   onClick={nextTab}
//                   className="flex-1 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition font-semibold"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? "Submitting..." : "Submit Application"}
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExitedForm;

// src/components/ExitedForm.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCalculator,
  FaArrowLeft,
  FaCheck,
  FaUser,
  FaCloudUploadAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { candidateAPI } from "../../services/api";

const ExitedForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingCandidate, setCheckingCandidate] = useState(false);
  const [existingCandidate, setExistingCandidate] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [checkIdentifier, setCheckIdentifier] = useState({
    email: "",
    mobile: "",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- tag-input states ---
  const [languageInput, setLanguageInput] = useState("");
  const [workAreaInput, setWorkAreaInput] = useState("");

  // --- Indian States & Cities data ---
  const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh", "Jammu & Kashmir", "Ladakh", "Puducherry",
  ];

  const STATE_CITIES = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kakinada", "Rajahmundry", "Kurnool", "Anantapur"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Tawang", "Pasighat"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tezpur"],
    "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Ara"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak", "Sonipat"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Mandi", "Solan", "Kullu"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belgaum", "Dharwad", "Gulbarga"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Rewa"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Navi Mumbai"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur"],
    "Meghalaya": ["Shillong", "Tura", "Jowai"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur"],
    "Sikkim": ["Gangtok", "Namchi", "Pelling"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Secunderabad"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
    "Uttar Pradesh": ["Lucknow", "Noida", "Varanasi", "Kanpur", "Agra", "Prayagraj", "Meerut", "Ghaziabad", "Greater Noida"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Nainital", "Haldwani", "Roorkee"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Darjeeling"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "Dwarka", "Rohini"],
    "Chandigarh": ["Chandigarh"],
    "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
    "Ladakh": ["Leh", "Kargil"],
    "Puducherry": ["Puducherry", "Karaikal"],
  };

  const tabs = [
    "Personal Info",
    "Contact Info",
    "Family Background",
    "Education",
    "Work Experience",
    "Professional Interests",
    "References",
    "Documents",
    "Consent",
  ];

  // -------- original form state (kept same structure) ----------
  const [formData, setFormData] = useState({
    candidateId: null,
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      gender: "",
      primaryContact: { countryCode: "+91", number: "" },
      currentAddress: { address: "", city: "", state: "", pin: "" },
    },
    exitedPersonalInfo: {
      maritalStatus: "",
      nationality: "",
      languagesKnown: [],
    },
    contactInfo: {
      alternateMobile: "",
      permanentAddress: {
        address: "",
        city: "",
        state: "",
        pin: "",
        sameAsCurrent: false,
      },
    },
    familyBackground: {
      fatherOrSpouseName: "",
      occupation: "",
      numberOfChildren: 0,
      numberOfSiblings: 0,
      familyIncome: "",
    },
    detailedEducation: [],
    detailedWorkExperience: [
      {
        employerName: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        responsibilities: "",
        reasonForLeaving: "",
        // skills: [],
      },
    ],
    professionalInterests: {
      whyJoinTeam: "",
      longTermGoals: "",
      preferredWorkAreas: [],
      availabilityToJoin: "",
    },
    references: [],
    exitedDocuments: {
      passportPhoto: null,
      addressProof: null,
      identityProof: null,
      resume: null,
    },
    exitedConsent: {
      dataCollectionConsent: false,
      informationAccuracy: false,
      termsAgreement: false,
      digitalSignature: false,
    },
  });

  // ---------- file previews state ----------
  const [filePreviews, setFilePreviews] = useState({
    passportPhoto: null,
    addressProof: null,
    identityProof: null,
  });

  // NEW
  // const [isWorkSectionOpen, setIsWorkSectionOpen] = useState(true);
  const [openWorkIndexes, setOpenWorkIndexes] = useState(new Set());
  // Education UI state (paste with other UI states)
  const [openEducationIndexes, setOpenEducationIndexes] = useState(new Set());

  // --- Auto-add first entry for Education, Work Experience, and Reference on mount ---
  const [autoInitDone, setAutoInitDone] = useState(false);
  useEffect(() => {
    if (autoInitDone) return;
    setAutoInitDone(true);

    // Auto-add first education entry if empty
    if (formData.detailedEducation.length === 0) {
      setFormData((prev) => ({
        ...prev,
        detailedEducation: [{
          level: "10th",
          degree: "",
          institution: "",
          yearOfPassing: "",
          percentage: "",
          achievements: "",
        }],
      }));
      setOpenEducationIndexes(new Set([0]));
    }

    // Auto-add first work experience entry if empty
    if (formData.detailedWorkExperience.length === 0) {
      setFormData((prev) => ({
        ...prev,
        detailedWorkExperience: [{
          employerName: "",
          jobTitle: "",
          startDate: "",
          endDate: "",
          responsibilities: "",
          reasonForLeaving: "",
          // skills: [],
        }],
      }));
      setOpenWorkIndexes(new Set([0]));
    }

    // Auto-add one reference if empty
    if (formData.references.length === 0) {
      setFormData((prev) => ({
        ...prev,
        references: [{
          name: "",
          relationship: "",
          contact: "",
          email: "",
        }],
      }));
    }
  }, []);

  useEffect(() => {
    // revoke object URLs when component unmounts
    return () => {
      Object.values(filePreviews).forEach((u) => {
        if (u) URL.revokeObjectURL(u);
      });
    };
  }, [filePreviews]);

  // ---------- Production-ready notify wrapper ----------
  const notify = {
    success: (msg, opts = {}) =>
      toast.success(msg, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        pauseOnHover: true,
        closeOnClick: true,
        theme: "light",
        ...opts,
      }),
    error: (msg, opts = {}) =>
      toast.error(msg, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        closeOnClick: true,
        theme: "light",
        ...opts,
      }),
    info: (msg, opts = {}) =>
      toast.info(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        closeOnClick: true,
        theme: "light",
        ...opts,
      }),
    warn: (msg, opts = {}) =>
      toast.warn(msg, {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        pauseOnHover: true,
        closeOnClick: true,
        theme: "light",
        ...opts,
      }),
  };

  // ---------- small helper to update form progress ----------
  const getProgress = () => {
    // crude progress: fraction of tabs completed (can be replaced by field-level checks)
    const total = tabs.length;
    return Math.round(((currentTab + 1) / total) * 100);
  };

  // ----------------- keep original functions but replace toast calls with notify -----------------
  const handleCheckCandidate = async () => {
    if (!checkIdentifier.email && !checkIdentifier.mobile) {
      notify.error("Please provide email or mobile number");
      return;
    }

    setCheckingCandidate(true);
    try {
      const response = await candidateAPI.checkCandidate(checkIdentifier);
      if (response.data.exists) {
        const candidateData = response.data.data;

        // Helper to convert ISO date to YYYY-MM-DD for <input type="date">
        const toDateInputValue = (isoString) => {
          if (!isoString) return "";
          const date = new Date(isoString);
          if (isNaN(date.getTime())) return "";
          const year = date.getUTCFullYear();
          const month = String(date.getUTCMonth() + 1).padStart(2, "0");
          const day = String(date.getUTCDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        // Format personalInfo with converted date
        const formattedPersonalInfo = {
          ...candidateData.personalInfo,
          dateOfBirth: toDateInputValue(
            candidateData.personalInfo?.dateOfBirth,
          ),
        };

        setExistingCandidate(candidateData);

        setFormData((prev) => {
          // Both forms now use the same array fields, so merge is straightforward
          const mergedEducation =
            Array.isArray(candidateData.detailedEducation) && candidateData.detailedEducation.length
              ? candidateData.detailedEducation
              : prev.detailedEducation;

          const mergedWork =
            Array.isArray(candidateData.detailedWorkExperience) && candidateData.detailedWorkExperience.length
              ? candidateData.detailedWorkExperience
              : prev.detailedWorkExperience;

          const mergedReferences =
            Array.isArray(candidateData.references) && candidateData.references.length
              ? candidateData.references
              : prev.references;

          return {
            ...prev,
            candidateId: candidateData._id,
            personalInfo: formattedPersonalInfo,
            exitedPersonalInfo: candidateData.exitedPersonalInfo || prev.exitedPersonalInfo,
            contactInfo: candidateData.contactInfo || prev.contactInfo,
            familyBackground: candidateData.familyBackground || prev.familyBackground,
            detailedEducation: mergedEducation,
            detailedWorkExperience: mergedWork,
            professionalInterests: candidateData.professionalInterests || prev.professionalInterests,
            references: mergedReferences,
            exitedDocuments: candidateData.exitedDocuments || prev.exitedDocuments,
            exitedConsent: candidateData.exitedConsent || prev.exitedConsent,
            interestInfo: candidateData.interestInfo || prev.interestInfo,
            consent: candidateData.consent || prev.consent,
          };
        });

        // Open all fetched education and work experience accordion entries
        if (Array.isArray(candidateData.detailedEducation) && candidateData.detailedEducation.length > 0) {
          setOpenEducationIndexes(new Set(candidateData.detailedEducation.map((_, i) => i)));
        }
        if (Array.isArray(candidateData.detailedWorkExperience) && candidateData.detailedWorkExperience.length > 0) {
          setOpenWorkIndexes(new Set(candidateData.detailedWorkExperience.map((_, i) => i)));
        }

        notify.success("Existing data found and loaded!");
      } else {
        notify.info("No existing record found. Please fill the complete form.");
      }
    } catch (error) {
      notify.error("Error checking candidate");
    } finally {
      setCheckingCandidate(false);
    }
  };

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
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
  };

  const handleArrayAdd = (section, item) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], item],
    }));
  };

  const handleArrayRemove = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleArrayUpdate = (section, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  // const toggleWorkSection = () => {
  //   setIsWorkSectionOpen((prev) => !prev);
  // };

  // const toggleWorkCard = (index) => {
  //   setOpenWorkIndexes((prev) => {
  //     const updated = new Set(prev);

  //     if (updated.has(index)) {
  //       updated.delete(index);
  //     } else {
  //       updated.add(index);
  //     }

  //     return updated;
  //   });
  // };
  const addLanguage = (lang) => {
    const trimmed = (lang || "").trim();
    if (!trimmed) return;
    if (formData.exitedPersonalInfo.languagesKnown.includes(trimmed)) {
      notify.warn("Language already added");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      exitedPersonalInfo: {
        ...prev.exitedPersonalInfo,
        languagesKnown: [...prev.exitedPersonalInfo.languagesKnown, trimmed],
      },
    }));
    setLanguageInput("");
    notify.success(`Added language: ${trimmed}`);
  };

  const removeLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      exitedPersonalInfo: {
        ...prev.exitedPersonalInfo,
        languagesKnown: prev.exitedPersonalInfo.languagesKnown.filter(
          (_, i) => i !== index,
        ),
      },
    }));
    notify.info("Removed language");
  };

  const addPreferredWorkArea = (area) => {
    const trimmed = (area || "").trim();
    if (!trimmed) return;
    if (formData.professionalInterests.preferredWorkAreas.includes(trimmed)) {
      notify.warn("Work area already added");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      professionalInterests: {
        ...prev.professionalInterests,
        preferredWorkAreas: [
          ...prev.professionalInterests.preferredWorkAreas,
          trimmed,
        ],
      },
    }));
    setWorkAreaInput("");
    notify.success(`Added preferred area: ${trimmed}`);
  };

  const removePreferredWorkArea = (index) => {
    setFormData((prev) => ({
      ...prev,
      professionalInterests: {
        ...prev.professionalInterests,
        preferredWorkAreas:
          prev.professionalInterests.preferredWorkAreas.filter(
            (_, i) => i !== index,
          ),
      },
    }));
    notify.info("Removed preferred work area");
  };

  const addEducation = () => {
    const newIndex = formData.detailedEducation.length;

    handleArrayAdd("detailedEducation", {
      level: "10th",
      degree: "",
      institution: "",
      yearOfPassing: "",
      percentage: "",
      achievements: "",
    });

    // close previous and open only new entry
    setOpenEducationIndexes(new Set([newIndex]));

    notify.success("Added education entry");
  };

  const addWorkExperience = () => {
    const newIndex = formData.detailedWorkExperience.length;

    handleArrayAdd("detailedWorkExperience", {
      employerName: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
      reasonForLeaving: "",
      // skills: [],
    });

    // close previous entries and open only the new one
    setOpenWorkIndexes(new Set([newIndex]));

    notify.success("Added work experience entry");
  };

  const addReference = () => {
    if (formData.references.length >= 1) {
      notify.warn("Maximum 1 reference allowed");
      return;
    }
    handleArrayAdd("references", {
      name: "",
      relationship: "",
      contact: "",
      email: "",
    });
    notify.success("Added reference");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.exitedConsent.dataCollectionConsent ||
      !formData.exitedConsent.informationAccuracy ||
      !formData.exitedConsent.termsAgreement ||
      !formData.exitedConsent.digitalSignature
    ) {
      notify.error("Please accept all consent declarations");
      return;
    }

    setLoading(true);

    try {
      // If backend expects files, convert to FormData here (optional)
      // const payload = createFormDataFrom(formData); // you can add this if required server-side
      await candidateAPI.submitExitedForm(formData);
      notify.success("Exited form submitted successfully!");
      setTimeout(() => {
        navigate("/success", { state: { form: "exited" } });
      }, 1400);
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to submit form");
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

  // ---------------- new helpers for files & UI (safe additions) ----------------
  const handleFileInput = (fieldKey, file) => {
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      exitedDocuments: { ...prev.exitedDocuments, [fieldKey]: file },
    }));

    if (file.type?.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setFilePreviews((prev) => {
        if (prev[fieldKey]) URL.revokeObjectURL(prev[fieldKey]);
        return { ...prev, [fieldKey]: url };
      });
    } else {
      // non-image files: clear preview
      setFilePreviews((prev) => ({ ...prev, [fieldKey]: null }));
    }
  };

  // ---------------- renderTabContent (unchanged structure, improved markup minor) ----------------
  const renderTabContent = () => {
    switch (currentTab) {
      case 0: // Personal Info
        return (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Personal Information
              </h2>
              <div className="text-sm text-gray-600">
                Progress: {getProgress()}%
              </div>
            </div>

            {!existingCandidate && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-3">
                  Already filled interest form? Check for existing data:
                </p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={checkIdentifier.email}
                    onChange={(e) =>
                      setCheckIdentifier({
                        ...checkIdentifier,
                        email: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-2 border border-blue-200 rounded-md bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="Enter mobile"
                    value={checkIdentifier.mobile}
                    onChange={(e) =>
                      setCheckIdentifier({
                        ...checkIdentifier,
                        mobile: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-2 border border-blue-200 rounded-md bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleCheckCandidate}
                    disabled={checkingCandidate}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    {checkingCandidate ? "Checking..." : "Check"}
                  </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={
                    formData.personalInfo.firstName +
                    " " +
                    formData.personalInfo.lastName
                  }
                  onChange={(e) =>
                    handleChange("personalInfo", "firstName", e.target.value)
                  }
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.personalInfo.gender}
                  onChange={(e) =>
                    handleChange("personalInfo", "gender", e.target.value)
                  }
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) =>
                    handleChange("personalInfo", "dateOfBirth", e.target.value)
                  }
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Marital Status <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.exitedPersonalInfo.maritalStatus}
                  onChange={(e) =>
                    handleChange(
                      "exitedPersonalInfo",
                      "maritalStatus",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                >
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Nationality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.exitedPersonalInfo.nationality}
                  onChange={(e) =>
                    handleChange(
                      "exitedPersonalInfo",
                      "nationality",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  placeholder="e.g., Indian"
                />
              </div>

              {/* State dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.personalInfo.currentAddress.state}
                  onChange={(e) => {
                    handleNestedChange(
                      "personalInfo",
                      "currentAddress",
                      "state",
                      e.target.value,
                    );
                    // Reset city when state changes
                    handleNestedChange(
                      "personalInfo",
                      "currentAddress",
                      "city",
                      "",
                    );
                  }}
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* City dropdown (populated based on selected state) */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.personalInfo.currentAddress.city}
                  onChange={(e) =>
                    handleNestedChange(
                      "personalInfo",
                      "currentAddress",
                      "city",
                      e.target.value,
                    )
                  }
                  disabled={existingCandidate || !formData.personalInfo.currentAddress.state}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                >
                  <option value="">{formData.personalInfo.currentAddress.state ? "Select City" : "Select state first"}</option>
                  {(STATE_CITIES[formData.personalInfo.currentAddress.state] || []).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.personalInfo.currentAddress.pin}
                  onChange={(e) =>
                    handleNestedChange(
                      "personalInfo",
                      "currentAddress",
                      "pin",
                      e.target.value,
                    )
                  }
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                  placeholder="Pincode"
                />
              </div>
            </div>

            {/* Languages Known — inline tag input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Languages Known
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.exitedPersonalInfo.languagesKnown.map(
                  (lang, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="text-indigo-400 hover:text-red-500 transition"
                      >
                        ×
                      </button>
                    </span>
                  ),
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLanguage(languageInput);
                    }
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  placeholder="Type a language and press Enter"
                />
                <button
                  type="button"
                  onClick={() => addLanguage(languageInput)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </section>
        );

      case 1: // Contact Info
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
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
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                  placeholder="Mobile number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Alternate Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo.alternateMobile}
                  onChange={(e) =>
                    handleChange(
                      "contactInfo",
                      "alternateMobile",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  placeholder="Alternate number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.personalInfo.email}
                  onChange={(e) =>
                    handleChange("personalInfo", "email", e.target.value)
                  }
                  disabled={existingCandidate}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Residential Address
              </h3>
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
                disabled={existingCandidate}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                rows="3"
                placeholder="Current address"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Permanent Address
              </h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.contactInfo.permanentAddress.sameAsCurrent}
                  onChange={(e) => {
                    handleNestedChange(
                      "contactInfo",
                      "permanentAddress",
                      "sameAsCurrent",
                      e.target.checked,
                    );
                    if (e.target.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        contactInfo: {
                          ...prev.contactInfo,
                          permanentAddress: {
                            ...prev.personalInfo.currentAddress,
                            sameAsCurrent: true,
                          },
                        },
                      }));
                      notify.info(
                        "Copied current address to permanent address",
                      );
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        contactInfo: {
                          ...prev.contactInfo,
                          permanentAddress: {
                            ...prev.contactInfo.permanentAddress,
                            sameAsCurrent: false,
                          },
                        },
                      }));
                    }
                  }}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-700 font-medium">
                  Same as current address
                </span>
              </label>

              {!formData.contactInfo.permanentAddress.sameAsCurrent && (
                <textarea
                  required
                  value={formData.contactInfo.permanentAddress.address}
                  onChange={(e) =>
                    handleNestedChange(
                      "contactInfo",
                      "permanentAddress",
                      "address",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  rows="3"
                  placeholder="Permanent address"
                />
              )}
            </div>
          </section>
        );

      case 2: // Family Background
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Family Background
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Father/Spouse Name
                </label>
                <input
                  type="text"
                  value={formData.familyBackground.fatherOrSpouseName}
                  onChange={(e) =>
                    handleChange(
                      "familyBackground",
                      "fatherOrSpouseName",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  placeholder="Name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                 Father/Spouse Occupation
                </label>  
                <input
                  type="text"
                  value={formData.familyBackground.occupation}
                  onChange={(e) =>
                    handleChange(
                      "familyBackground",
                      "occupation",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  placeholder="Occupation"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Number of Children
                </label>
                <input
                  type="number"
                  value={formData.familyBackground.numberOfChildren}
                  onChange={(e) =>
                    handleChange(
                      "familyBackground",
                      "numberOfChildren",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  min="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Number of Siblings
                </label>
                <input
                  type="number"
                  value={formData.familyBackground.numberOfSiblings}
                  onChange={(e) =>
                    handleChange(
                      "familyBackground",
                      "numberOfSiblings",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Family Income (Optional)
                </label>
                <input
                  type="text"
                  value={formData.familyBackground.familyIncome}
                  onChange={(e) =>
                    handleChange(
                      "familyBackground",
                      "familyIncome",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  placeholder="e.g., 5-10 LPA"
                />
              </div>
            </div>
          </section>
        );

      case 3: // Education
        return (
          <section className="space-y-6">
            {/* Section header (static) */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Educational Qualifications
              </h2>
              <span className="text-sm text-gray-600">
                {formData.detailedEducation.length}{" "}
                {formData.detailedEducation.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            <div className="space-y-4">
              {formData.detailedEducation.map((edu, index) => {
                const isOpen = openEducationIndexes.has(index);

                return (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    {/* Header: static "Education #n" (does NOT reflect inputs) */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-700 font-medium">
                          Education {index + 1}
                        </div>
                        <div className="text-sm text-gray-500">
                          {/* optional small summary (keeps header static) */}
                          {edu.level ? `• ${edu.level}` : ""}{" "}
                          {edu.yearOfPassing ? `• ${edu.yearOfPassing}` : ""}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Edit opens the entry */}
                        {!isOpen && (
                          <button
                            type="button"
                            onClick={() =>
                              setOpenEducationIndexes((prev) => {
                                const next = new Set(prev);
                                next.add(index);
                                return next;
                              })
                            }
                            className="px-2 py-1 text-sm border rounded-md bg-white hover:bg-gray-50"
                          >
                            Edit
                          </button>
                        )}

                        {/* Remove: keeps openEducationIndexes synced */}
                        <button
                          type="button"
                          onClick={() => {
                            handleArrayRemove("detailedEducation", index);

                            setOpenEducationIndexes((prev) => {
                              const next = new Set();
                              [...prev]
                                .filter((i) => i !== index) // drop removed index
                                .map((i) => (i > index ? i - 1 : i)) // shift indexes > removed down by 1
                                .forEach((i) => next.add(i));
                              return next;
                            });
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded-md"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Full form - shown only when open */}
                    {isOpen && (
                      <div className="mt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Level
                            </label>
                            <select
                              value={edu.level}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedEducation",
                                  index,
                                  "level",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md outline-none"
                            >
                              <option value="10th">10th</option>
                              <option value="12th">12th</option>
                              <option value="Graduation">Graduation</option>
                              <option value="Post-Graduation">
                                Post-Graduation
                              </option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Degree/Certification
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedEducation",
                                  index,
                                  "degree",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                              placeholder="Degree name"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Institution
                            </label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedEducation",
                                  index,
                                  "institution",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                              placeholder="School/University name"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Year of Passing
                            </label>
                            <input
                              type="number"
                              value={edu.yearOfPassing}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedEducation",
                                  index,
                                  "yearOfPassing",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Percentage/CGPA
                            </label>
                            <input
                              type="text"
                              value={edu.percentage}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedEducation",
                                  index,
                                  "percentage",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                              placeholder="e.g., 85%"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Achievements
                            </label>
                            <textarea
                              value={edu.achievements}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedEducation",
                                  index,
                                  "achievements",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                              rows={2}
                              placeholder="Any achievements or awards..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ADD BUTTON (relies on addEducation to open only new entry) */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    addEducation();
                  }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md"
                >
                  + Add More Education
                </button>
              </div>
            </div>
          </section>
        );

      case 4: // Work Experience
        return (
          <section className="space-y-6">
            {/* Section header - static, no collapse */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Work Experience
              </h2>
              <span className="text-sm text-gray-600">
                {formData.detailedWorkExperience.length}{" "}
                {formData.detailedWorkExperience.length === 1
                  ? "entry"
                  : "entries"}
              </span>
            </div>

            {/* Experiences list */}
            <div className="space-y-4">
              {formData.detailedWorkExperience.map((work, index) => {
                const isOpen = openWorkIndexes.has(index);

                return (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    {/* Compact header shown when closed, or simple heading when open.
              NOTE: keep header static "Experience #n" — do NOT show employerName */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-700 font-medium">
                          Experience -{index + 1}
                        </div>
                        <div className="text-sm text-gray-500">
                          {/* show small summary text but do NOT replace the header */}
                          {work.jobTitle ? `• ${work.jobTitle}` : ""}
                          {work.startDate ? ` ${work.startDate}` : ""}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Edit opens the card if closed */}
                        {!isOpen && (
                          <button
                            type="button"
                            onClick={() => {
                              // open only this card (relies on your toggle / setOpenWorkIndexes handlers)
                              setOpenWorkIndexes((prev) => {
                                const next = new Set(prev);
                                next.add(index);
                                return next;
                              });
                            }}
                            className="px-2 py-1 text-sm border rounded-md bg-white hover:bg-gray-50"
                          >
                            Edit
                          </button>
                        )}

                        {/* Remove button - also keeps openWorkIndexes synced */}
                        <button
                          type="button"
                          onClick={() => {
                            // remove data
                            handleArrayRemove("detailedWorkExperience", index);

                            // sync openWorkIndexes: drop removed, shift higher indexes down
                            setOpenWorkIndexes((prev) => {
                              const next = new Set();
                              [...prev]
                                .filter((i) => i !== index) // remove the deleted index
                                .map((i) => (i > index ? i - 1 : i)) // shift indexes > removed down by 1
                                .forEach((i) => next.add(i));
                              return next;
                            });
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded-md"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Full form: shown only when this index is open */}
                    {isOpen && (
                      <div className="mt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Employer Name
                            </label>
                            <input
                              type="text"
                              value={work.employerName}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedWorkExperience",
                                  index,
                                  "employerName",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                              placeholder="Company name"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Job Title
                            </label>
                            <input
                              type="text"
                              value={work.jobTitle}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedWorkExperience",
                                  index,
                                  "jobTitle",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                              placeholder="Position"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={work.startDate}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedWorkExperience",
                                  index,
                                  "startDate",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={work.endDate}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedWorkExperience",
                                  index,
                                  "endDate",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Responsibilities
                            </label>
                            <textarea
                              value={work.responsibilities}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedWorkExperience",
                                  index,
                                  "responsibilities",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                              rows={3}
                              placeholder="Describe your responsibilities..."
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Reason for Leaving
                            </label>
                            <input
                              type="text"
                              value={work.reasonForLeaving}
                              onChange={(e) =>
                                handleArrayUpdate(
                                  "detailedWorkExperience",
                                  index,
                                  "reasonForLeaving",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border rounded-md"
                              placeholder="Reason"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add button — relies on your addWorkExperience which auto-opens the new item and closes previous */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    addWorkExperience();
                  }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md"
                >
                  + Add More Work Experience
                </button>
              </div>
            </div>
          </section>
        );

      case 5: // Professional Interests
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Professional Interests & Goals
            </h2>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Why do you want to join our accounting team?
              </label>
              <textarea
                value={formData.professionalInterests.whyJoinTeam} // ✅ changed
                onChange={
                  (e) =>
                    handleChange(
                      "professionalInterests",
                      "whyJoinTeam",
                      e.target.value,
                    ) // ✅ changed
                }
                disabled={existingCandidate}
                className={`w-full px-4 py-3 border rounded-md ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                rows={4}
                placeholder="Share your motivation..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Long-term career goals
              </label>
              <textarea
                value={formData.professionalInterests.longTermGoals} // ✅ changed
                onChange={
                  (e) =>
                    handleChange(
                      "professionalInterests",
                      "longTermGoals",
                      e.target.value,
                    ) // ✅ changed
                }
                disabled={existingCandidate}
                className={`w-full px-4 py-3 border rounded-md ${existingCandidate ? "bg-gray-100" : "bg-white"}`}
                rows={4}
                placeholder="What are your career aspirations?"
              />
            </div>

            {/* Preferred Work Areas — inline tag input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Preferred Work Areas
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.professionalInterests.preferredWorkAreas.map(
                  (area, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => removePreferredWorkArea(index)}
                        className="text-indigo-400 hover:text-red-500 transition"
                      >
                        ×
                      </button>
                    </span>
                  ),
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={workAreaInput}
                  onChange={(e) => setWorkAreaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPreferredWorkArea(workAreaInput);
                    }
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                  placeholder="Type a work area and press Enter"
                />
                <button
                  type="button"
                  onClick={() => addPreferredWorkArea(workAreaInput)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Availability to Join
              </label>
              <input
                type="text"
                value={formData.professionalInterests.availabilityToJoin}
                onChange={(e) =>
                  handleChange(
                    "professionalInterests",
                    "availabilityToJoin",
                    e.target.value,
                  )
                }
                className="w-full px-4 py-3 border rounded-md"
                placeholder="e.g., Immediate, 30 days notice"
              />
            </div>
          </section>
        );

      case 6: // References
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Reference
            </h2>

            {formData.references.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-sm">No reference added. One will be added automatically.</p>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                <h3 className="font-medium text-gray-800">
                  Reference Details
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.references[0]?.name || ""}
                      onChange={(e) =>
                        handleArrayUpdate(
                          "references",
                          0,
                          "name",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 border rounded-md"
                      placeholder="Reference name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Relationship
                    </label>
                    <input
                      type="text"
                      value={formData.references[0]?.relationship || ""}
                      onChange={(e) =>
                        handleArrayUpdate(
                          "references",
                          0,
                          "relationship",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 border rounded-md"
                      placeholder="e.g., Former Manager"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Contact
                    </label>
                    <input
                      type="tel"
                      value={formData.references[0]?.contact || ""}
                      onChange={(e) =>
                        handleArrayUpdate(
                          "references",
                          0,
                          "contact",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 border rounded-md"
                      placeholder="Phone number"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.references[0]?.email || ""}
                      onChange={(e) =>
                        handleArrayUpdate(
                          "references",
                          0,
                          "email",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 border rounded-md"
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        );

      case 7: // Documents
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Documents Upload
            </h2>

            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 text-yellow-800">
              Note: file upload will be sent to backend — preview shown for
              images.
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume / CV
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border rounded-md cursor-pointer">
                  <FaCloudUploadAlt />
                  <span className="text-sm">
                    {formData.exitedDocuments.resume
                      ? formData.exitedDocuments.resume.name
                      : "Choose file (.pdf, .docx)"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) =>
                      handleFileInput("resume", e.target.files?.[0])
                    }
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Photo
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border rounded-md cursor-pointer">
                  <FaCloudUploadAlt />
                  <span className="text-sm">
                    {formData.exitedDocuments.passportPhoto
                      ? formData.exitedDocuments.passportPhoto.name
                      : "Choose photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileInput("passportPhoto", e.target.files?.[0])
                    }
                  />
                </label>
                {filePreviews.passportPhoto && (
                  <img
                    src={filePreviews.passportPhoto}
                    alt="passport preview"
                    className="mt-2 w-28 h-28 object-cover rounded-md border"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Proof
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border rounded-md cursor-pointer">
                  <FaCloudUploadAlt />
                  <span className="text-sm">
                    {formData.exitedDocuments.addressProof
                      ? formData.exitedDocuments.addressProof.name
                      : "Choose file"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileInput("addressProof", e.target.files?.[0])
                    }
                  />
                </label>
                {filePreviews.addressProof && (
                  <img
                    src={filePreviews.addressProof}
                    alt="address preview"
                    className="mt-2 w-28 h-28 object-cover rounded-md border"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identity Proof (Aadhar/PAN/Passport)
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border rounded-md cursor-pointer">
                  <FaCloudUploadAlt />
                  <span className="text-sm">
                    {formData.exitedDocuments.identityProof
                      ? formData.exitedDocuments.identityProof.name
                      : "Choose file"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileInput("identityProof", e.target.files?.[0])
                    }
                  />
                </label>
                {filePreviews.identityProof && (
                  <img
                    src={filePreviews.identityProof}
                    alt="id preview"
                    className="mt-2 w-28 h-28 object-cover rounded-md border"
                  />
                )}
              </div>
            </div>
          </section>
        );

      case 8: // Consent
        return (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Consent & Declaration
            </h2>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.exitedConsent.dataCollectionConsent}
                  onChange={(e) =>
                    handleChange(
                      "exitedConsent",
                      "dataCollectionConsent",
                      e.target.checked,
                    )
                  }
                  className="mt-1 w-5 h-5 text-blue-600"
                />
                <span className="text-gray-700">
                  I consent to the collection and processing of my personal data
                  for recruitment and employment purposes.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.exitedConsent.informationAccuracy}
                  onChange={(e) =>
                    handleChange(
                      "exitedConsent",
                      "informationAccuracy",
                      e.target.checked,
                    )
                  }
                  className="mt-1 w-5 h-5 text-blue-600"
                />
                <span className="text-gray-700">
                  I declare that all information provided is true and accurate
                  to the best of my knowledge.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.exitedConsent.termsAgreement}
                  onChange={(e) =>
                    handleChange(
                      "exitedConsent",
                      "termsAgreement",
                      e.target.checked,
                    )
                  }
                  className="mt-1 w-5 h-5 text-blue-600"
                />
                <span className="text-gray-700">
                  I agree to the terms and conditions of employment and company
                  policies.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.exitedConsent.digitalSignature}
                  onChange={(e) =>
                    handleChange(
                      "exitedConsent",
                      "digitalSignature",
                      e.target.checked,
                    )
                  }
                  className="mt-1 w-5 h-5 text-blue-600"
                />
                <span className="text-gray-700">
                  This serves as my digital signature and acknowledgment of the
                  above declarations.
                </span>
              </label>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-md p-4">
              <div className="flex items-start gap-3">
                <FaCheck className="text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium text-green-900">
                    Ready to Submit!
                  </h3>
                  <p className="text-sm text-green-800">
                    Please review all the information you&apos;ve entered before
                    submitting. Once submitted, your application will be
                    reviewed by our team.
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // ---------------- Main return - modern layout with sidebar ----------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* top header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md bg-gray-100"
            >
              <FaBars />
            </button>
            <Link
              to="/get-started"
              className="flex items-center gap-2 text-gray-700 hover:text-black"
            >
              <FaArrowLeft />
              <span className="font-medium">Back</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <FaCalculator className="text-2xl text-indigo-600" />
            <div>
              <div className="text-lg font-semibold">Application Form</div>
              <div className="text-sm text-gray-500">
                Completing your profile — step {currentTab + 1} of {tabs.length}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 hidden md:block">
            Progress: {getProgress()}%
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-white rounded-xl shadow p-5 sticky top-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                <FaUser />
              </div>
              <div>
                <div className="text-sm font-semibold">Candidate</div>
                <div className="text-xs text-gray-500">Complete profile</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {getProgress()}% complete
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setCurrentTab(i)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 ${i === currentTab ? "bg-indigo-600 text-white" : "hover:bg-gray-50 text-gray-700"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i < currentTab ? "bg-green-600 text-white" : i === currentTab ? "bg-white text-indigo-600" : "bg-gray-200 text-gray-700"}`}
                  >
                    {i < currentTab ? <FaCheck /> : i + 1}
                  </div>
                  <span className="text-sm">{t}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">Sections</div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              <nav className="space-y-2">
                {tabs.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => {
                      setCurrentTab(i);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 ${i === currentTab ? "bg-indigo-600 text-white" : "hover:bg-gray-50 text-gray-700"}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i < currentTab ? "bg-green-600 text-white" : i === currentTab ? "bg-white text-indigo-600" : "bg-gray-200 text-gray-700"}`}
                    >
                      {i < currentTab ? <FaCheck /> : i + 1}
                    </div>
                    <span className="text-sm">{t}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main form content */}
        <main className="lg:col-span-9">
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="border-b px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{tabs[currentTab]}</h3>
                <p className="text-sm text-gray-500">
                  Fill the required fields in this section
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 hidden sm:block">
                  Step {currentTab + 1} of {tabs.length}
                </div>
                <div className="text-sm text-gray-600">
                  Progress {getProgress()}%
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {renderTabContent()}

              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div>
                  <button
                    type="button"
                    onClick={prevTab}
                    disabled={currentTab === 0}
                    className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-40"
                  >
                    Previous
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {currentTab < tabs.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextTab}
                      className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Save & Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExitedForm;
