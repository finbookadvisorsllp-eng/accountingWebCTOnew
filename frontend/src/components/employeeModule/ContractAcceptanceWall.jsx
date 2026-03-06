import React, { useState } from "react";
import {
  FaFileContract,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaHandshake,
  FaUserLock,
  FaMoneyBillWave,
  FaGavel,
  FaBalanceScale,
  FaClipboardList,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { candidateAPI } from "../../services/api";

const CONTRACT_POINTS = [
  {
    key: "workHours",
    label: "Work Hours & Expectations",
    desc: "I understand and accept the standard working hours, overtime policies, and attendance expectations as outlined by the organization.",
    icon: FaClock,
  },
  {
    key: "responsibilities",
    label: "Responsibilities of the Accountant",
    desc: "I acknowledge my core duties, reporting structure, and deliverables as defined for my designated role.",
    icon: FaClipboardList,
  },
  {
    key: "termsOfEmployment",
    label: "Terms of Employment",
    desc: "I accept the duration of employment, role definition, employment type, and probationary period conditions.",
    icon: FaHandshake,
  },
  {
    key: "nda",
    label: "Confidentiality & Non-Disclosure Agreement",
    desc: "I agree to maintain strict confidentiality of all client data, company information, and proprietary systems. Breach of this agreement may result in legal action.",
    icon: FaUserLock,
  },
  {
    key: "salaryTerms",
    label: "Salary Payment & Deductions",
    desc: "I understand the payment cycle, applicable deductions (tax, PF, etc.), and the approved salary structure for my position.",
    icon: FaMoneyBillWave,
  },
  {
    key: "terminationClause",
    label: "Termination Clause & Notice Period",
    desc: "I accept the notice period requirements and understand the conditions under which employment may be terminated by either party.",
    icon: FaGavel,
  },
  {
    key: "legalCompliance",
    label: "Legal Compliance (GST, IT Act, etc.)",
    desc: "I commit to adhering to all applicable legal and regulatory requirements including GST, Income Tax, and professional standards.",
    icon: FaBalanceScale,
  },
  {
    key: "otherTerms",
    label: "Other Terms & Workplace Policies",
    desc: "I accept the leave policy, workplace conduct rules, anti-harassment policy, dress code, and other operational guidelines.",
    icon: FaShieldAlt,
  },
];

const ContractAcceptanceWall = ({ userId, onAccepted }) => {
  const [accepted, setAccepted] = useState({});
  const [digitalSignature, setDigitalSignature] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allPointsAccepted = CONTRACT_POINTS.every((p) => accepted[p.key]);
  const canSubmit = allPointsAccepted && digitalSignature;
  const progress = Math.round(
    ((Object.values(accepted).filter(Boolean).length +
      (digitalSignature ? 1 : 0)) /
      (CONTRACT_POINTS.length + 1)) *
      100,
  );

  const handleAccept = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await candidateAPI.acceptContract(userId);
      // Update local storage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.contractAccepted = true;
      user.status = "ACTIVE"; // Reflect backend activation
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Contract accepted! Welcome aboard 🎉");
      onAccepted();
    } catch {
      toast.error("Failed to accept contract. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-[9999] overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20">
            <FaFileContract className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Employment Contract
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg">
            Please read and accept all terms below before accessing the
            application. This is a one-time verification.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Acceptance Progress
            </span>
            <span className="text-sm font-bold text-amber-400">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-green-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Contract Points */}
        <div className="w-full max-w-2xl space-y-3 mb-8">
          {CONTRACT_POINTS.map((point, index) => {
            const Icon = point.icon;
            const isChecked = accepted[point.key];
            return (
              <label
                key={point.key}
                className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  isChecked
                    ? "border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/5"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
                }`}
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked || false}
                  onChange={(e) =>
                    setAccepted({ ...accepted, [point.key]: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 rounded border-2 border-slate-500 text-green-500 focus:ring-green-500 focus:ring-offset-0 focus:ring-offset-slate-800 bg-slate-700 cursor-pointer shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      className={`text-sm shrink-0 ${isChecked ? "text-green-400" : "text-slate-500"}`}
                    />
                    <h3
                      className={`text-sm font-bold ${isChecked ? "text-green-300" : "text-white"}`}
                    >
                      {point.label}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
                {isChecked && (
                  <FaCheckCircle className="text-green-400 text-lg shrink-0 mt-1" />
                )}
              </label>
            );
          })}
        </div>

        {/* Digital Signature */}
        <div className="w-full max-w-2xl mb-8">
          <label
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              digitalSignature
                ? "border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
            }`}
          >
            <input
              type="checkbox"
              checked={digitalSignature}
              onChange={(e) => setDigitalSignature(e.target.checked)}
              disabled={!allPointsAccepted}
              className="w-5 h-5 rounded border-2 border-slate-500 text-amber-500 focus:ring-amber-500 bg-slate-700 cursor-pointer disabled:opacity-30"
            />
            <div>
              <h3
                className={`text-sm font-bold ${digitalSignature ? "text-amber-300" : "text-white"}`}
              >
                ✍️ Digital Signature & Final Confirmation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                By checking this, I confirm that I have read, understood, and
                agree to all the terms and conditions above. This serves as my
                digital signature.
              </p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="w-full max-w-2xl mb-12">
          <button
            onClick={handleAccept}
            disabled={!canSubmit || submitting}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl ${
              canSubmit
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-500/20 hover:shadow-green-500/40 cursor-pointer"
                : "bg-slate-700 text-slate-500 cursor-not-allowed shadow-none"
            }`}
          >
            {submitting
              ? "Processing..."
              : canSubmit
                ? "Accept & Continue to Application →"
                : `Accept all ${CONTRACT_POINTS.length} terms + Digital Signature to continue`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractAcceptanceWall;
