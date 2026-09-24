import React, { useState } from "react";
import { MapPin, BookOpen, ArrowUpRight, X, CheckCircle, UploadCloud, Briefcase } from "lucide-react";

interface RoleDetails {
  id: string;
  title: string;
  category: string;
  location: string;
  compensation: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
}

const OPEN_ROLES: RoleDetails[] = [
  {
    id: "science-field",
    title: "Science & Field Correspondent",
    category: "Planetary Science & Biomes",
    location: "Remote / Field Dispatches",
    compensation: "Per-Dispatch Honorarium / Retainer",
    description: "Investigate and report on terrestrial biodiversity, bioacoustics, geothermal research, and ecological systems worldwide.",
    responsibilities: [
      "File original, investigative field dispatches from local ecosystems",
      "Collaborate with scientists and indigenous land stewards",
      "Produce fact-checked, high-objectivity articles with source citations",
    ],
    qualifications: [
      "Background in ecology, planetary science, or investigative journalism",
      "Strong long-form prose and field photography skills",
      "Commitment to independent, non-partisan objective reporting",
    ],
  },
  {
    id: "tech-systems",
    title: "Open Technology & Hardware Columnist",
    category: "Eco-Technology & Microgrids",
    location: "Global / Remote",
    compensation: "Per-Article Grant / Editorial Retainer",
    description: "Cover breakthrough hardware, decentralized infrastructure, atmospheric water systems, and open-source planetary engineering.",
    responsibilities: [
      "Analyze emerging open-hardware blueprints and clean-tech patents",
      "Publish hands-on technical audits and deep architectural longreads",
      "Interview independent engineers, inventors, and lab researchers",
    ],
    qualifications: [
      "Experience in engineering, computer science, or technology journalism",
      "Ability to translate complex technical schematics into clear editorial prose",
    ],
  },
  {
    id: "visual-artist",
    title: "Visual Cartographer & Scientific Artist",
    category: "Art, Visual Essays & Media",
    location: "Worldwide / Remote Studio",
    compensation: "Commission per Visual Essay & Hero Art",
    description: "Create classical Japanese-inspired woodblock visuals, technical infographics, telemetry charts, and botanical illustrations for Paen.",
    responsibilities: [
      "Design bespoke editorial illustrations and masthead covers",
      "Produce geospatial data maps and infographics for scientific reports",
      "Work directly with the Head Editor on visual identity",
    ],
    qualifications: [
      "Portfolio demonstrating editorial illustration, cartography, or typography",
      "Comfort with minimalist, high-contrast print and digital aesthetics",
    ],
  },
];

interface CorrespondentsGridProps {
  onSearchAuthor: (name: string) => void;
}

export default function CorrespondentsGrid({ onSearchAuthor }: CorrespondentsGridProps) {
  const [selectedRole, setSelectedRole] = useState<RoleDetails | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantLink, setApplicantLink] = useState("");
  const [applicantNote, setApplicantNote] = useState("");

  const handleOpenModal = (role: RoleDetails) => {
    setSelectedRole(role);
    setSubmitted(false);
    setApplicantName("");
    setApplicantEmail("");
    setApplicantLink("");
    setApplicantNote("");
  };

  const handleCloseModal = () => {
    setSelectedRole(null);
    setSubmitted(false);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;
    setSubmitted(true);
  };

  return (
    <section
      className="w-full border-b-2 border-double border-zinc-300 dark:border-zinc-800 pb-14 mb-14"
      id="fellows-directory-section"
    >
      {/* Section Header */}
      <div className="flex justify-between items-center border-b border-zinc-250 dark:border-zinc-850 pb-2.5 mb-8 text-[9.5px] font-mono tracking-[0.25em] uppercase text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-none inline-block" />
          <span className="font-bold text-foreground">SECTION III • WHO WE ARE & OPEN ROLES</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-zinc-400">
          <span>PRINCIPAL FELLOWS</span>
          <span>✦</span>
          <span>CONTRIBUTOR OPENINGS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CONTAINER 1: Single Unified Box for ceoDemitri with all titles */}
        <div
          className="group border border-zinc-250 dark:border-zinc-800 p-5 bg-[#faf7f2] dark:bg-zinc-950/40 flex flex-col justify-between hover:border-emerald-600/50 transition-all duration-300 shadow-sm"
          id="correspondent-card-primary"
        >
          <div>
            {/* Avatar & Masthead Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <img
                  src="https://github.com/ceoDemitri.png"
                  alt="ceoDemitri"
                  className="w-14 h-14 object-cover border border-zinc-300 dark:border-zinc-700 rounded-sm"
                />
                <span
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full"
                  title="Active Principal Fellow"
                />
              </div>
              <span className="px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                FOUNDER
              </span>
            </div>

            <h4 className="font-serif font-bold text-xl text-foreground leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              ceoDemitri
            </h4>

            {/* All Titles in the First Box: Editor / Author / Field / Artist */}
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold mt-1 pb-2 border-b border-zinc-250 dark:border-zinc-800">
              Chief Editor / Author / Field / Artist
            </div>

            <div className="flex items-center gap-1.5 text-[9.5px] font-sans text-zinc-500 mt-2.5 font-light">
              <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
              <span>Kyoto Field Station & Global Labs</span>
            </div>

            <p className="text-[11px] font-sans text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed font-light">
              Investigating the confluence of planetary science, deep technology, decentralized sovereign polity, and Kyoto visual arts.
            </p>
          </div>

          <div className="border-t border-zinc-250 dark:border-zinc-800 pt-3 mt-4">
            <button
              onClick={() => onSearchAuthor("ceoDemitri")}
              className="w-full py-2 px-2 text-[9px] font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 hover:border-emerald-600/40 transition-colors flex items-center justify-center gap-1.5 font-bold"
            >
              <BookOpen className="w-3 h-3 text-emerald-600" />
              View Dispatches by Author
            </button>
          </div>
        </div>

        {/* CONTAINERS 2, 3, 4: Apply for this Role Cards (Light Orange Background) */}
        {OPEN_ROLES.map((role, idx) => (
          <div
            key={role.id}
            className="group border border-amber-300/70 dark:border-amber-600/30 p-5 bg-[#fff7ed] dark:bg-[#1a140d] flex flex-col justify-between hover:border-amber-500/80 transition-all duration-300 shadow-sm relative overflow-hidden"
            id={`open-role-card-${idx}`}
          >
            {/* Top subtle accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

            <div>
              {/* Header Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-sm bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-400/40">
                  APPLY FOR THIS ROLE
                </span>
              </div>

              <h4 className="font-serif font-bold text-lg text-zinc-900 dark:text-amber-100 leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                {role.title}
              </h4>

              <div className="text-[9.5px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold mt-1">
                {role.category}
              </div>

              <div className="flex items-center gap-1.5 text-[9.5px] font-sans text-zinc-600 dark:text-zinc-400 mt-2 font-light">
                <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{role.location}</span>
              </div>

              <p className="text-[11px] font-sans text-zinc-700 dark:text-zinc-300 mt-3 leading-relaxed line-clamp-3 font-light">
                {role.description}
              </p>
            </div>

            <div className="border-t border-amber-200 dark:border-amber-900/50 pt-3 mt-4 space-y-2">
              <button
                onClick={() => handleOpenModal(role)}
                className="w-full py-2 px-3 text-[9.5px] font-mono uppercase tracking-wider text-amber-950 dark:text-white bg-amber-500 hover:bg-amber-400 text-center font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>Submit Resume</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => handleOpenModal(role)}
                className="w-full text-center text-[8.5px] font-mono uppercase tracking-wider text-amber-800 dark:text-amber-300/80 hover:underline"
              >
                Role Overview & Scope →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MINIMALISTIC ROLE APPLICATION & OVERVIEW MODAL */}
      {selectedRole && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-lg bg-[#faf7f2] dark:bg-[#121815] border border-amber-500/40 text-zinc-900 dark:text-zinc-100 shadow-2xl relative p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-zinc-250 dark:border-zinc-800 pb-3 mb-4 pr-6">
              <div className="text-[9px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold mb-1">
                PAEN EDITORIAL FELLOWSHIP • {selectedRole.category}
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-foreground">
                {selectedRole.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                <span>Location: {selectedRole.location}</span>
                <span>•</span>
                <span>{selectedRole.compensation}</span>
              </div>
            </div>

            {submitted ? (
              /* Submission Confirmation State */
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-foreground">
                  Application Received
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto font-sans leading-relaxed">
                  Thank you, <strong>{applicantName}</strong>. Our editorial desk has received your background and portfolio. If selected for dispatch, we will contact you at <strong>{applicantEmail}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-mono text-xs uppercase tracking-wider font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Minimal Application & Description Flow */
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
                    {selectedRole.description}
                  </p>
                </div>

                {/* Scope & Expectations */}
                <div className="space-y-2 bg-zinc-100 dark:bg-zinc-900/60 p-3.5 border border-zinc-200 dark:border-zinc-800 text-[11px] font-sans">
                  <div className="font-mono text-[9px] uppercase tracking-wider font-bold text-zinc-600 dark:text-zinc-400">
                    Key Scope & Responsibilities:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                    {selectedRole.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>

                {/* Straight to the point Resume / Application Form */}
                <form onSubmit={handleSubmitApplication} className="space-y-3 pt-2">
                  <div className="font-mono text-[9.5px] uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">
                    Submit Resume / Application
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-zinc-500 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Linus Kramer"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-foreground focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono uppercase text-zinc-500 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.earth"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-foreground focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-zinc-500 mb-1">
                      Resume / Portfolio / GitHub / Substack Link *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={applicantLink}
                      onChange={(e) => setApplicantLink(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-foreground focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase text-zinc-500 mb-1">
                      Short Pitch or Field Experience Note (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief note on your topics of inquiry or field research background..."
                      value={applicantNote}
                      onChange={(e) => setApplicantNote(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-foreground focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
