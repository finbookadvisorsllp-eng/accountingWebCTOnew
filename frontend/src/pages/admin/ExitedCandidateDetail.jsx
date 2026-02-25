import React, { useState, useMemo } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaHeart,
  FaFilePdf,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const formatDate = (isoString) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB");
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

const TimelineItem = ({ title, subtitle, from, to, description }) => (
  <div className="relative pl-6">
    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white shadow" />
    <div className="text-sm">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
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

export default function ExitedCandidateDetail({ candidate }) {
  const {
    personalInfo = {},
    exitedPersonalInfo = {},
    detailedEducation = [],
    detailedWorkExperience = [],
    professionalInterests = {},
    documents = {},
  } = candidate || {};

  const [tab, setTab] = useState("overview");

  const skillTags = useMemo(() => {
    // derive small useful tags: languages + preferred areas + education degrees
    const langs = exitedPersonalInfo.languagesKnown || [];
    const areas = professionalInterests.preferredWorkAreas || [];
    const degrees = (detailedEducation || [])
      .map((d) => d.degree)
      .filter(Boolean);
    return [...new Set([...langs, ...areas, ...degrees])].slice(0, 12);
  }, [exitedPersonalInfo, professionalInterests, detailedEducation]);

  const resumeUrl = documents?.resume || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left profile */}
      <motion.aside
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-4 bg-gradient-to-br from-white/70 to-indigo-50/60 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-sm"
        aria-label="candidate profile"
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500">
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
              {exitedPersonalInfo?.maritalStatus
                ? `${exitedPersonalInfo.maritalStatus} • `
                : ""}
              {personalInfo?.currentAddress?.city || "Unknown"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
                {detailedEducation?.[0]?.degree || "Education"}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-800 font-semibold">
                {detailedWorkExperience?.length || 0} jobs
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
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-sm text-gray-500">Experience</div>
            <div className="font-bold text-gray-900">
              {detailedWorkExperience?.length || "—"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Education</div>
            <div className="font-bold text-gray-900">
              {detailedEducation?.length || "—"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Availability</div>
            <div className="font-bold text-gray-900">
              {professionalInterests?.availabilityToJoin || "—"}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Right content */}
      <main className="lg:col-span-8 space-y-4">
        <nav className="flex items-center gap-2 bg-white/60 p-1 rounded-xl border border-gray-100 shadow-sm">
          {[
            { id: "overview", label: "Overview", icon: FaCalendarAlt },
            { id: "experience", label: "Experience", icon: FaBriefcase },
            { id: "education", label: "Education", icon: FaGraduationCap },
            { id: "interest", label: "Interests", icon: FaHeart },
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
              <p className="text-sm text-gray-700 mt-2">
                Summary of the candidate's core profile, exited details and
                contact.
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
                    k="Primary Contact"
                    v={personalInfo?.primaryContact?.number}
                    alignRight
                  />
                  <KeyValue k="Email" v={personalInfo?.email} alignRight />
                  <KeyValue
                    k="Nationality"
                    v={exitedPersonalInfo?.nationality}
                    alignRight
                  />
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm text-gray-500">Tags & quick info</h4>
                <div className="mt-3">
                  <TagList items={skillTags} />
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
                {detailedWorkExperience?.length ? (
                  detailedWorkExperience.map((w, idx) => (
                    <TimelineItem
                      key={idx}
                      title={w.jobTitle || "—"}
                      subtitle={w.employerName || ""}
                      from={w.startDate ? formatDate(w.startDate) : "—"}
                      to={w.endDate ? formatDate(w.endDate) : "Present"}
                      description={w.responsibilities}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No work history available.
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
                {detailedEducation?.length ? (
                  detailedEducation.map((edu, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {edu.degree || edu.level || "—"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {edu.institution}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {edu.yearOfPassing || "—"}
                        </div>
                      </div>
                      {edu.percentage && (
                        <div className="mt-3 text-sm text-gray-700">
                          Score:{" "}
                          <span className="font-medium">{edu.percentage}%</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No education records available.
                  </p>
                )}
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
              <h3 className="text-lg font-semibold">Professional Interests</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                {professionalInterests?.whyJoinTeam && (
                  <div>
                    <div className="text-xs text-gray-500">Why join</div>
                    <div className="mt-1 font-medium">
                      {professionalInterests.whyJoinTeam}
                    </div>
                  </div>
                )}
                {professionalInterests?.longTermGoals && (
                  <div>
                    <div className="text-xs text-gray-500">Long-term goals</div>
                    <div className="mt-1 font-medium">
                      {professionalInterests.longTermGoals}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="p-3 rounded-lg bg-indigo-50">
                    <div className="text-xs text-gray-500">Availability</div>
                    <div className="mt-1 font-medium">
                      {professionalInterests?.availabilityToJoin || "—"}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <div className="text-xs text-gray-500">Preferred Areas</div>
                    <div className="mt-1 font-medium">
                      {(professionalInterests?.preferredWorkAreas || []).join(
                        ", ",
                      ) || "—"}
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
