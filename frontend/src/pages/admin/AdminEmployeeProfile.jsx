import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaUser,
  FaFileContract,
  FaBalanceScale,
  FaCheckCircle,
  FaUpload,
  FaIdBadge,
} from "react-icons/fa";
import { candidateAPI } from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

const TABS = [
  { key: "basic", label: "Basic Information", icon: FaUser },
  { key: "contract", label: "Contract & Deposit", icon: FaFileContract },
  { key: "legal", label: "Legal Compliance", icon: FaBalanceScale },
  { key: "review", label: "Review & Confirm", icon: FaCheckCircle },
];


// ─── Reusable Input Component ───
const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  readOnly = false,
  children,
}) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children || (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white ${readOnly ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
      />
    )}
  </div>
);

const AdminOnboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [employees, setEmployees] = useState([]);
  const [passportFile, setPassportFile] = useState(null);
  const [depositFile, setDepositFile] = useState(null);
  const [showCredentials, setShowCredentials] = useState(null);

  // ─── Form State ───
  const [form, setForm] = useState({
    // Admin mandatory
    designation: "",
    reportingAuthority: "",
    dateOfJoining: "",
    // Basic info (auto-fetched, editable)
    fatherSpouseFirstName: "",
    fatherSpouseLastName: "",
    fatherSpouseContact: "",
    alternateMobile: "",
    // Permanent address
    permanentAddress: {
      address: "",
      city: "",
      state: "",
      pin: "",
      sameAsCurrent: false,
    },
    // Contract
    contractInfo: {
      workHoursAccepted: false,
      responsibilitiesAccepted: false,
      termsOfEmploymentAccepted: false,
      ndaAccepted: false,
      salaryTermsAccepted: false,
      terminationClauseAccepted: false,
      legalComplianceAccepted: false,
      otherTermsAccepted: false,
      contractAcceptedHindi: false,
      contractAcceptedEnglish: false,
      digitalSignature: false,
      depositAmount: "",
      depositConfirmed: false,
    },
    // Legal
    legalCompliance: {
      aadharNumber: "",
      panNumber: "",
      bankDetails: {
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        branchName: "",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        contact: "",
        email: "",
      },
      criminalRecordDeclaration: false,
      criminalRecordDetails: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [candidateRes, employeesRes] = await Promise.all([
        candidateAPI.getCandidate(id),
        candidateAPI.getCandidates({ status: "APPROVED,ACTIVE" }),
      ]);
      const data = candidateRes.data.data;
      setCandidate(data);

      // Populate employees list for reporting authority dropdown
      const empList = (employeesRes.data.data || []).filter(
        (c) => c.adminInfo?.employeeId && c._id !== id,
      );
      setEmployees(empList);

      // Pre-fill form from existing data
      setForm((prev) => ({
        ...prev,
        designation: data.adminInfo?.designation || "",
        reportingAuthority: data.adminInfo?.reportingAuthority || "",
        dateOfJoining: data.adminInfo?.dateOfJoining?.slice(0, 10) || "",
        fatherSpouseFirstName:
          data.familyBackground?.fatherSpouseFirstName || "",
        fatherSpouseLastName:
          data.familyBackground?.fatherSpouseLastName || "",
        fatherSpouseContact:
          data.familyBackground?.fatherSpouseContact || "",
        alternateMobile: data.contactInfo?.alternateMobile || "",
        permanentAddress: {
          address: data.contactInfo?.permanentAddress?.address || "",
          city: data.contactInfo?.permanentAddress?.city || "",
          state: data.contactInfo?.permanentAddress?.state || "",
          pin: data.contactInfo?.permanentAddress?.pin || "",
          sameAsCurrent:
            data.contactInfo?.permanentAddress?.sameAsCurrent || false,
        },
        contractInfo: {
          ...prev.contractInfo,
          ...(data.contractInfo || {}),
          depositAmount: data.contractInfo?.depositAmount || "",
        },
        legalCompliance: {
          aadharNumber: data.legalCompliance?.aadharNumber || "",
          panNumber: data.legalCompliance?.panNumber || "",
          bankDetails: {
            accountHolderName:
              data.legalCompliance?.bankDetails?.accountHolderName || "",
            bankName: data.legalCompliance?.bankDetails?.bankName || "",
            accountNumber:
              data.legalCompliance?.bankDetails?.accountNumber || "",
            ifscCode: data.legalCompliance?.bankDetails?.ifscCode || "",
            branchName: data.legalCompliance?.bankDetails?.branchName || "",
          },
          emergencyContact: {
            name: data.legalCompliance?.emergencyContact?.name || "",
            relationship:
              data.legalCompliance?.emergencyContact?.relationship || "",
            contact: data.legalCompliance?.emergencyContact?.contact || "",
            email: data.legalCompliance?.emergencyContact?.email || "",
          },
          criminalRecordDeclaration:
            data.legalCompliance?.criminalRecordDeclaration || false,
          criminalRecordDetails:
            data.legalCompliance?.criminalRecordDetails || "",
        },
      }));
    } catch {
      toast.error("Failed to load candidate data");
    } finally {
      setLoading(false);
    }
  };

  const isNewOnboard = candidate?.status === "EXITED" || candidate?.status === "ALLOWED_EXITED";

  const handleSubmit = async () => {
    // Validate mandatory fields
    if (!form.designation) {
      toast.error("Designation is required");
      setActiveTab("basic");
      return;
    }
    if (!form.reportingAuthority) {
      toast.error("Reporting Authority is required");
      setActiveTab("basic");
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("designation", form.designation);
      payload.append("reportingAuthority", form.reportingAuthority);
      payload.append("dateOfJoining", form.dateOfJoining);
      payload.append(
        "familyBackground",
        JSON.stringify({
          fatherSpouseFirstName: form.fatherSpouseFirstName,
          fatherSpouseLastName: form.fatherSpouseLastName,
          fatherSpouseContact: form.fatherSpouseContact,
        }),
      );
      payload.append(
        "contactInfo",
        JSON.stringify({
          alternateMobile: form.alternateMobile,
          permanentAddress: form.permanentAddress,
        }),
      );
      payload.append("contractInfo", JSON.stringify(form.contractInfo));
      payload.append("legalCompliance", JSON.stringify(form.legalCompliance));

      if (passportFile) payload.append("passportPhoto", passportFile);
      if (depositFile) payload.append("depositProof", depositFile);

      let response;
      if (isNewOnboard) {
        response = await candidateAPI.approveCandidate(id, payload);
        const creds = response.data.data?.credentials;
        if (creds) {
          setShowCredentials(creds);
        }
        toast.success("Candidate onboarded successfully!");
      } else {
        response = await candidateAPI.updateAdminFields(id, payload);
        toast.success("Details updated successfully!");
        navigate(-1);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  if (!candidate) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-gray-500">
          Candidate not found
        </div>
      </AdminLayout>
    );
  }

  // ─── Tab Renderers ───
  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Admin-Only Fields */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FaIdBadge /> Admin-Only Fields (Mandatory)
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Designation" required>
            <select
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition bg-white"
            >
              <option value="">Select Designation</option>
              <option value="Accountant">Accountant</option>
              <option value="Senior Accountant">Senior Accountant</option>
              <option value="Manager">Manager</option>
            </select>
          </Field>
          <Field label="Reporting Authority" required>
            <select
              value={form.reportingAuthority || ""}
              onChange={(e) =>
                setForm({ ...form, reportingAuthority: e.target.value })
              }
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition bg-white"
            >
              <option value="">Select Reporting Authority</option>
              <option value="Admin">Admin</option>
              {employees && employees.length > 0 && (
                <>
                  <optgroup label="Managers">
                    {employees.filter(e => e.adminInfo?.designation === 'Manager').map(emp => (
                      <option key={emp._id} value={emp.adminInfo.employeeId}>
                        {emp.personalInfo?.firstName} {emp.personalInfo?.lastName} ({emp.adminInfo.employeeId})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Senior Accountants">
                    {employees.filter(e => e.adminInfo?.designation === 'Senior Accountant').map(emp => (
                      <option key={emp._id} value={emp.adminInfo.employeeId}>
                        {emp.personalInfo?.firstName} {emp.personalInfo?.lastName} ({emp.adminInfo.employeeId})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Accountants">
                    {employees.filter(e => e.adminInfo?.designation === 'Accountant').map(emp => (
                      <option key={emp._id} value={emp.adminInfo.employeeId}>
                        {emp.personalInfo?.firstName} {emp.personalInfo?.lastName} ({emp.adminInfo.employeeId})
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
            </select>
          </Field>
          <Field
            label="Date of Joining"
            type="date"
            value={form.dateOfJoining}
            onChange={(v) => setForm({ ...form, dateOfJoining: v })}
            required
          />
        </div>
      </div>

      {/* Auto-fetched Personal Info (Read-Only) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
          Candidate Details (Auto-Fetched)
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field
            label="Full Name"
            value={`${candidate.personalInfo?.firstName || ""} ${candidate.personalInfo?.lastName || ""}`}
            readOnly
            onChange={() => {}}
          />
          <Field
            label="Date of Birth"
            value={formatDate(candidate.personalInfo?.dateOfBirth)}
            readOnly
            onChange={() => {}}
          />
          <Field
            label="Gender"
            value={candidate.personalInfo?.gender || "—"}
            readOnly
            onChange={() => {}}
          />
          <Field
            label="Marital Status"
            value={candidate.exitedPersonalInfo?.maritalStatus || "—"}
            readOnly
            onChange={() => {}}
          />
          <Field
            label="Email"
            value={candidate.personalInfo?.email || "—"}
            readOnly
            onChange={() => {}}
          />
          <Field
            label="Contact Number"
            value={`${candidate.personalInfo?.primaryContact?.countryCode || ""} ${candidate.personalInfo?.primaryContact?.number || ""}`}
            readOnly
            onChange={() => {}}
          />
        </div>
      </div>

      {/* Editable — Father/Spouse + Contact + Address */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-700   uppercase tracking-wider mb-4">
          Additional Details (Editable)
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          <Field
            label="Father/Spouse First Name"
            value={form.fatherSpouseFirstName}
            onChange={(v) =>
              setForm({ ...form, fatherSpouseFirstName: v })
            }
            placeholder="First Name"
          />
          <Field
            label="Father/Spouse Last Name"
            value={form.fatherSpouseLastName}
            onChange={(v) =>
              setForm({ ...form, fatherSpouseLastName: v })
            }
            placeholder="Last Name"
          />
          <Field
            label="Father/Spouse Contact No."
            value={form.fatherSpouseContact}
            onChange={(v) =>
              setForm({ ...form, fatherSpouseContact: v })
            }
            placeholder="Contact Number"
          />
          <Field
            label="Alternate Mobile"
            value={form.alternateMobile}
            onChange={(v) => setForm({ ...form, alternateMobile: v })}
            placeholder="Optional"
          />
        </div>

        {/* Permanent Address */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-xs font-bold text-gray-600 uppercase">
              Permanent Address
            </h4>
            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={form.permanentAddress.sameAsCurrent}
                onChange={(e) =>
                  setForm({
                    ...form,
                    permanentAddress: {
                      ...form.permanentAddress,
                      sameAsCurrent: e.target.checked,
                      ...(e.target.checked
                        ? {
                            address:
                              candidate.personalInfo?.currentAddress
                                ?.address || "",
                            city:
                              candidate.personalInfo?.currentAddress?.city ||
                              "",
                            state:
                              candidate.personalInfo?.currentAddress
                                ?.state || "",
                            pin:
                              candidate.personalInfo?.currentAddress?.pin ||
                              "",
                          }
                        : {}),
                    },
                  })
                }
                className="w-3.5 h-3.5 text-blue-600 rounded"
              />
              Same as current residential
            </label>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field
              label="Address"
              value={form.permanentAddress.address}
              onChange={(v) =>
                setForm({
                  ...form,
                  permanentAddress: { ...form.permanentAddress, address: v },
                })
              }
              readOnly={form.permanentAddress.sameAsCurrent}
            />
            <Field
              label="City"
              value={form.permanentAddress.city}
              onChange={(v) =>
                setForm({
                  ...form,
                  permanentAddress: { ...form.permanentAddress, city: v },
                })
              }
              readOnly={form.permanentAddress.sameAsCurrent}
            />
            <Field
              label="State"
              value={form.permanentAddress.state}
              onChange={(v) =>
                setForm({
                  ...form,
                  permanentAddress: { ...form.permanentAddress, state: v },
                })
              }
              readOnly={form.permanentAddress.sameAsCurrent}
            />
            <Field
              label="PIN Code"
              value={form.permanentAddress.pin}
              onChange={(v) =>
                setForm({
                  ...form,
                  permanentAddress: { ...form.permanentAddress, pin: v },
                })
              }
              readOnly={form.permanentAddress.sameAsCurrent}
            />
          </div>
        </div>
      </div>

      {/* Passport Photo Upload */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
          Passport-Sized Photo
        </h3>
        <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition">
          <FaUpload className="text-gray-400 text-lg" />
          <span className="text-sm text-gray-600">
            {passportFile
              ? passportFile.name
              : candidate.adminDocuments?.passportPhoto
                ? "Photo uploaded — click to replace"
                : "Upload JPG/PNG"}
          </span>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setPassportFile(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );

  const renderContract = () => (
    <div className="space-y-6">


      {/* Deposit */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
          Deposit Confirmation (10 Days Salary)
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Deposit Amount (₹)"
            type="number"
            value={form.contractInfo.depositAmount}
            onChange={(v) =>
              setForm({
                ...form,
                contractInfo: { ...form.contractInfo, depositAmount: v },
              })
            }
            placeholder="Enter amount"
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Upload Proof of Deposit
            </label>
            <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-3 hover:border-blue-400 transition">
              <FaUpload className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {depositFile ? depositFile.name : "Upload receipt / proof"}
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setDepositFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <label className="flex items-center gap-3 mt-4 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
          <input
            type="checkbox"
            checked={form.contractInfo.depositConfirmed}
            onChange={(e) =>
              setForm({
                ...form,
                contractInfo: {
                  ...form.contractInfo,
                  depositConfirmed: e.target.checked,
                },
              })
            }
            className="w-4 h-4 text-green-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Deposit received and verified
          </span>
        </label>
      </div>
    </div>
  );

  const renderLegal = () => (
    <div className="space-y-6">
      {/* ID Documents */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
          Identity Documents
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Aadhar Number"
            value={form.legalCompliance.aadharNumber}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  aadharNumber: v,
                },
              })
            }
            placeholder="XXXX XXXX XXXX"
          />
          <Field
            label="PAN Number"
            value={form.legalCompliance.panNumber}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  panNumber: v,
                },
              })
            }
            placeholder="ABCDE1234F"
          />
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
          Bank Account Details (For Salary Credit)
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Account Holder Name"
            value={form.legalCompliance.bankDetails.accountHolderName}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  bankDetails: {
                    ...form.legalCompliance.bankDetails,
                    accountHolderName: v,
                  },
                },
              })
            }
          />
          <Field
            label="Bank Name"
            value={form.legalCompliance.bankDetails.bankName}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  bankDetails: {
                    ...form.legalCompliance.bankDetails,
                    bankName: v,
                  },
                },
              })
            }
          />
          <Field
            label="Account Number"
            value={form.legalCompliance.bankDetails.accountNumber}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  bankDetails: {
                    ...form.legalCompliance.bankDetails,
                    accountNumber: v,
                  },
                },
              })
            }
          />
          <Field
            label="IFSC Code"
            value={form.legalCompliance.bankDetails.ifscCode}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  bankDetails: {
                    ...form.legalCompliance.bankDetails,
                    ifscCode: v,
                  },
                },
              })
            }
          />
          <Field
            label="Branch Name"
            value={form.legalCompliance.bankDetails.branchName}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  bankDetails: {
                    ...form.legalCompliance.bankDetails,
                    branchName: v,
                  },
                },
              })
            }
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
          Emergency Contact
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Name"
            value={form.legalCompliance.emergencyContact.name}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  emergencyContact: {
                    ...form.legalCompliance.emergencyContact,
                    name: v,
                  },
                },
              })
            }
          />
          <Field
            label="Relationship"
            value={form.legalCompliance.emergencyContact.relationship}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  emergencyContact: {
                    ...form.legalCompliance.emergencyContact,
                    relationship: v,
                  },
                },
              })
            }
          />
          <Field
            label="Contact Number"
            value={form.legalCompliance.emergencyContact.contact}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  emergencyContact: {
                    ...form.legalCompliance.emergencyContact,
                    contact: v,
                  },
                },
              })
            }
          />
          <Field
            label="Email (Optional)"
            type="email"
            value={form.legalCompliance.emergencyContact.email}
            onChange={(v) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  emergencyContact: {
                    ...form.legalCompliance.emergencyContact,
                    email: v,
                  },
                },
              })
            }
          />
        </div>
      </div>

      {/* Criminal Record */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
          Declaration of No Criminal Record
        </h3>
        <div className="flex gap-6 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="criminal"
              checked={!form.legalCompliance.criminalRecordDeclaration}
              onChange={() =>
                setForm({
                  ...form,
                  legalCompliance: {
                    ...form.legalCompliance,
                    criminalRecordDeclaration: false,
                    criminalRecordDetails: "",
                  },
                })
              }
              className="w-4 h-4 text-green-600"
            />
            <span className="text-sm text-gray-700">
              No criminal record / legal issues
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="criminal"
              checked={form.legalCompliance.criminalRecordDeclaration}
              onChange={() =>
                setForm({
                  ...form,
                  legalCompliance: {
                    ...form.legalCompliance,
                    criminalRecordDeclaration: true,
                  },
                })
              }
              className="w-4 h-4 text-red-600"
            />
            <span className="text-sm text-gray-700">Yes (provide details)</span>
          </label>
        </div>
        {form.legalCompliance.criminalRecordDeclaration && (
          <textarea
            value={form.legalCompliance.criminalRecordDetails}
            onChange={(e) =>
              setForm({
                ...form,
                legalCompliance: {
                  ...form.legalCompliance,
                  criminalRecordDetails: e.target.value,
                },
              })
            }
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition"
            rows={3}
            placeholder="Provide details..."
          />
        )}
      </div>
    </div>
  );

  const renderReview = () => {
    const fullName = `${candidate.personalInfo?.firstName || ""} ${candidate.personalInfo?.lastName || ""}`.trim();

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Basic Info Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-blue-700 uppercase mb-3">
              Basic Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Full Name</span>
                <span className="font-medium text-gray-800">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Designation</span>
                <span className="font-medium text-gray-800">
                  {form.designation || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reporting To</span>
                <span className="font-medium text-gray-800">
                  {form.reportingAuthority || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date of Joining</span>
                <span className="font-medium text-gray-800">
                  {form.dateOfJoining || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-800">
                  {candidate.personalInfo?.email || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Contract Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-green-700 uppercase mb-3">
              Contract & Deposit
            </h4>
            <div className="space-y-4 text-sm">
              {/* Deposit Info */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Deposit Amount</span>
                  <span className="font-medium text-gray-800">
                    ₹{form.contractInfo.depositAmount || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Deposit Received</span>
                  <span className="font-medium text-gray-800">
                    {form.contractInfo.depositConfirmed ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* Employee Acceptance Status */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Employee Acceptance Status</p>
                <div className="flex items-center gap-2">
                  {candidate?.employeeContractAcceptance?.allTermsAccepted ? (
                    <>
                      <FaCheckCircle className="text-green-600 text-sm" />
                      <span className="font-medium text-green-600">Accepted & Digitally Signed</span>
                    </>
                  ) : (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                      <span className="font-medium text-orange-600">Pending Acceptance</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Legal Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-purple-700 uppercase mb-3">
              Legal Compliance
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Aadhar</span>
                <span className="font-medium text-gray-800">
                  {form.legalCompliance.aadharNumber || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PAN</span>
                <span className="font-medium text-gray-800">
                  {form.legalCompliance.panNumber || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bank</span>
                <span className="font-medium text-gray-800">
                  {form.legalCompliance.bankDetails.bankName || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Emergency Contact</span>
                <span className="font-medium text-gray-800">
                  {form.legalCompliance.emergencyContact.name || "—"}
                </span>
              </div>
              {/* Emergency Contact Number */}
              <div className="flex justify-between">
                <span className="text-gray-500">Emergency Contact Number</span>
                <span className="font-medium text-gray-800">
                  {form.legalCompliance.emergencyContact.contact || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Photo & Files */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-orange-700 uppercase mb-3">
              Documents
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Passport Photo</span>
                <span className={`font-medium ${passportFile || candidate.adminDocuments?.passportPhoto ? "text-green-600" : "text-red-500"}`}>
                  {passportFile ? "✓ Selected" : candidate.adminDocuments?.passportPhoto ? "✓ Uploaded" : "✗ Not uploaded"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deposit Proof</span>
                <span className={`font-medium ${depositFile || candidate.adminDocuments?.depositProof ? "text-green-600" : "text-red-500"}`}>
                  {depositFile ? "✓ Selected" : candidate.adminDocuments?.depositProof ? "✓ Uploaded" : "✗ Not uploaded"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Confirmation */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-3">
            Final Confirmation
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            By submitting, the candidate will be onboarded and login credentials
            will be generated. Please verify all information is accurate.
          </p>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition disabled:opacity-50 text-sm"
          >
            {saving
              ? "Processing..."
              : isNewOnboard
                ? "Complete Onboarding & Generate Credentials"
                : "Save Changes"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FaArrowLeft className="text-lg text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isNewOnboard
                    ? "Accountant Onboarding"
                    : "Update Admin Details"}
                </h1>
                <p className="text-sm text-gray-500">
                  {candidate.personalInfo?.firstName}{" "}
                  {candidate.personalInfo?.lastName} —{" "}
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {candidate.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex border-b overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                    isActive
                      ? "border-blue-600 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={isActive ? "text-blue-600" : "text-gray-400"}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "basic" && renderBasicInfo()}
          {activeTab === "contract" && renderContract()}
          {activeTab === "legal" && renderLegal()}
          {activeTab === "review" && renderReview()}
        </div>

        {/* Bottom Navigation */}
        {activeTab !== "review" && (
          <div className="flex justify-between">
            <button
              onClick={() => {
                const idx = TABS.findIndex((t) => t.key === activeTab);
                if (idx > 0) setActiveTab(TABS[idx - 1].key);
              }}
              disabled={activeTab === TABS[0].key}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition disabled:opacity-30"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                const idx = TABS.findIndex((t) => t.key === activeTab);
                if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key);
              }}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Credentials Modal */}
      {showCredentials && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-3xl text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Onboarding Complete!
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Share these credentials with the employee
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Employee ID
                </p>
                <p className="text-lg font-bold text-blue-700 font-mono">
                  {showCredentials.employeeId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Temporary Password
                </p>
                <p className="text-lg font-bold text-green-700 font-mono">
                  {showCredentials.temporaryPassword}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowCredentials(null);
                navigate(-1);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOnboardPage;
