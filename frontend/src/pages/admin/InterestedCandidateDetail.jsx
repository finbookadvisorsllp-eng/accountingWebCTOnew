// InterestedCandidateDetail.modern.jsx
// Modern, production-ready redesign of the InterestedCandidateDetail component
// - Uses TailwindCSS for styling (no CSS file required)
// - Uses framer-motion for subtle animations
// - Responsive layout: left profile column + right details with tabs and accordions
// - Accessibility minded (aria attributes, semantic HTML)
// Install: npm i framer-motion react-icons prop-types

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFilePdf,
  FaCalendarAlt,
  FaGraduationCap,
  FaBriefcase,
  FaThumbsUp,
} from "react-icons/fa";

// --- Small presentational helpers ---
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB");
};

const KeyValue = ({ k, v, alignRight }) => (
  <div className="flex justify-between items-start border-b border-gray-100 py-2">
    <dt className="text-xs text-gray-500">{k}</dt>
    <dd className={`text-sm font-medium ${alignRight ? "text-right" : ""}`}>
      {" "}
      {v || "—"}{" "}
    </dd>
  </div>
);

const TagList = ({ items }) => {
  if (!items || items.length === 0)
    return <span className="text-sm text-gray-400 italic">No items</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t, i) => (
        <span
          key={i}
          className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-full text-xs font-semibold text-indigo-700"
        >
          {t}
        </span>
      ))}
    </div>
  );
};

// Timeline item for experiences (education / work)
const TimelineItem = ({ title, subtitle, from, to, description }) => (
  <div className="relative pl-6">
    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white shadow" />
    <div className="text-sm">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <span className="text-xs text-gray-400">•</span>
        <span className="text-xs text-gray-500">{subtitle}</span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {from} — {to}
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded whitespace-pre-wrap">
          {description}
        </p>
      )}
    </div>
  </div>
);

// --- Main component ---
export default function InterestedCandidateDetail({ candidate }) {
  const {
    personalInfo = {},
    education = {},
    workExperience = {},
    interestInfo = {},
    consent = {},
    documents = {},
  } = candidate || {};

  const [tab, setTab] = useState("overview");

  const skills = useMemo(
    () => education?.certifications || interestInfo?.skills || [],
    [education, interestInfo],
  );

  const resumeUrl = documents?.resume
    ? `${documents.resume.startsWith("http") ? "" : ""}${documents.resume}`
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left column - profile card */}
      <motion.aside
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-4 bg-gradient-to-br from-white/70 to-indigo-50/60 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-sm"
        aria-label="candidate profile"
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500">
            {/* avatar fallback: initials */}
            <span className="text-xl font-bold">
              {(personalInfo?.firstName || "?")[0]}
              {(personalInfo?.lastName || "")[0]}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {personalInfo?.firstName} {personalInfo?.lastName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {workExperience?.jobTitle || "Candidate"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
                {personalInfo?.currentAddress?.city || "Unknown"}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-800 font-semibold">
                {education?.highestQualification || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* contact actions */}
        <div className="mt-6 space-y-3">
          <a
            href={`mailto:${personalInfo?.email}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
            aria-label="email candidate"
          >
            <FaEnvelope className="text-gray-600" />
            <div className="text-sm">
              <div className="text-xs text-gray-400">Email</div>
              <div className="font-medium text-gray-800">
                {personalInfo?.email || "—"}
              </div>
            </div>
          </a>

          <a
            href={`tel:${personalInfo?.primaryContact?.number}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
            aria-label="call candidate"
          >
            <FaPhone className="text-gray-600" />
            <div className="text-sm">
              <div className="text-xs text-gray-400">Phone</div>
              <div className="font-medium text-gray-800">
                {personalInfo?.primaryContact?.number || "—"}
              </div>
            </div>
          </a>

          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            <FaMapMarkerAlt className="text-gray-600" />
            <div className="text-sm">
              <div className="text-xs text-gray-400">Location</div>
              <div className="font-medium text-gray-800">
                {personalInfo?.currentAddress?.city || "—"}
              </div>
            </div>
          </div>

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              aria-label="view resume"
            >
              <FaFilePdf /> View Resume
            </a>
          )}
        </div>

        {/* small stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-sm text-gray-500">Experience</div>
            <div className="font-bold text-gray-900">
              {workExperience?.yearsOfExperience || "—"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Certs</div>
            <div className="font-bold text-gray-900">
              {(education?.certifications || []).length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Consent</div>
            <div className="font-bold text-gray-900">
              {consent?.dataProcessingConsent ? "Yes" : "No"}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Right column - tabs + content */}
      <main className="lg:col-span-8 space-y-4">
        <nav className="flex items-center gap-2 bg-white/60 p-1 rounded-xl border border-gray-100 shadow-sm">
          {[
            { id: "overview", label: "Overview", icon: FaThumbsUp },
            { id: "experience", label: "Experience", icon: FaBriefcase },
            { id: "education", label: "Education", icon: FaGraduationCap },
            { id: "interest", label: "Interest", icon: FaCalendarAlt },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:bg-gray-50"}`}
              aria-pressed={tab === t.id}
            >
              <t.icon />
              {t.label}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait" initial={false}>
          {tab === "overview" && (
            <motion.section
              key="overview"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">Overview</h3>
              <p className="text-sm text-gray-700 mt-3">
                A compact summary of the candidate with contact and high level
                details.
              </p>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <KeyValue
                    k="Full name"
                    v={`${personalInfo?.firstName || ""} ${personalInfo?.lastName || ""}`}
                  />
                  <KeyValue k="DOB" v={formatDate(personalInfo?.dateOfBirth)} />
                  <KeyValue k="Gender" v={personalInfo?.gender} />
                </div>
                <div>
                  <KeyValue
                    k="Current Address"
                    v={`${personalInfo?.currentAddress?.address || ""} ${personalInfo?.currentAddress?.city || ""}`}
                    alignRight
                  />
                  <KeyValue
                    k="Primary Contact"
                    v={personalInfo?.primaryContact?.number}
                    alignRight
                  />
                  <KeyValue k="Email" v={personalInfo?.email} alignRight />
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm text-gray-500">
                  Key skills & certifications
                </h4>
                <div className="mt-3">
                  <TagList items={skills} />
                </div>
              </div>
            </motion.section>
          )}

          {tab === "experience" && (
            <motion.section
              key="experience"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">Work Experience</h3>
              <div className="mt-4 space-y-4">
                {workExperience && workExperience.jobTitle ? (
                  <TimelineItem
                    title={workExperience.jobTitle}
                    subtitle={workExperience.companyName}
                    from={
                      workExperience.startDate
                        ? formatDate(workExperience.startDate)
                        : "—"
                    }
                    to={
                      workExperience.endDate
                        ? formatDate(workExperience.endDate)
                        : "Present"
                    }
                    description={workExperience.responsibilities}
                  />
                ) : (
                  <p className="text-sm text-gray-400">
                    No work experience available.
                  </p>
                )}
              </div>
            </motion.section>
          )}

          {tab === "education" && (
            <motion.section
              key="education"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">
                Education & Certifications
              </h3>
              <div className="mt-4 space-y-4">
                <TimelineItem
                  title={education?.highestQualification || "—"}
                  subtitle={education?.institution || ""}
                  from={education?.startYear || "—"}
                  to={education?.yearOfPassing || "—"}
                  description={education?.notes}
                />
                <div>
                  <h4 className="text-sm text-gray-500">Certifications</h4>
                  <div className="mt-2">
                    <TagList items={education?.certifications} />
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {tab === "interest" && (
            <motion.section
              key="interest"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">Interest & Consent</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                {interestInfo?.whyJoin && (
                  <div>
                    <div className="text-xs text-gray-500">Why join</div>
                    <div className="mt-1 font-medium">
                      {interestInfo.whyJoin}
                    </div>
                  </div>
                )}
                {interestInfo?.careerGoals && (
                  <div>
                    <div className="text-xs text-gray-500">Career goals</div>
                    <div className="mt-1 font-medium">
                      {interestInfo.careerGoals}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="p-3 rounded-lg bg-indigo-50">
                    <div className="text-xs text-gray-500">
                      Source of awareness
                    </div>
                    <div className="mt-1 font-medium">
                      {interestInfo?.sourceOfAwareness || "—"}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <div className="text-xs text-gray-500">
                      Consent - Data processing
                    </div>
                    <div className="mt-1 font-medium">
                      {consent?.dataProcessingConsent
                        ? "Granted"
                        : "Not granted"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
