import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentProfile, Achievement } from '../types';
import { SkillForgeLogo } from './SkillForgeLogo';
import {
  Printer,
  Copy,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Award,
  Plus,
  Trash2,
  CheckCircle2,
  FolderGit2,
  Layers,
  GraduationCap,
  ExternalLink,
  Target,
  X,
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const {
    profile,
    updateProfile,
    skills,
    projects,
    goals,
    achievements,
    addAchievement,
    deleteAchievement,
    stats,
    showToast,
  } = useApp();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<StudentProfile>(profile);

  // Add Achievement Modal
  const [isAddAchOpen, setIsAddAchOpen] = useState(false);
  const [achForm, setAchForm] = useState<{
    title: string;
    issuer: string;
    date: string;
    type: Achievement['type'];
    credentialUrl: string;
  }>({
    title: '',
    issuer: '',
    date: new Date().getFullYear().toString(),
    type: 'Certification',
    credentialUrl: '',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditProfileOpen(false);
  };

  const handleSaveAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achForm.title.trim() || !achForm.issuer.trim()) return;
    addAchievement({
      title: achForm.title.trim(),
      issuer: achForm.issuer.trim(),
      date: achForm.date.trim(),
      type: achForm.type,
      credentialUrl: achForm.credentialUrl.trim() || undefined,
    });
    setAchForm({
      title: '',
      issuer: '',
      date: new Date().getFullYear().toString(),
      type: 'Certification',
      credentialUrl: '',
    });
    setIsAddAchOpen(false);
  };

  const copyMarkdownSummary = () => {
    const md = `# ${profile.name}
**${profile.headline}**
Target Role: ${profile.targetRole} | ${profile.institution} (Class of ${profile.graduationYear})
Email: ${profile.email} | Phone: ${profile.phone} | Location: ${profile.location}
LinkedIn: ${profile.linkedin} | GitHub: ${profile.github}

---

## Career Readiness Assessment
**Readiness Score:** ${stats.scoreInterpretation.displayLabel} (${stats.scoreInterpretation.rangeText})
*Status Description:* ${stats.scoreInterpretation.description}
*Why Received:* ${stats.scoreInterpretation.whyExplanation}
*Next Steps:* ${stats.scoreInterpretation.whatToDoNext}
*Disclaimer:* MVP career-readiness estimate based on the student's SkillForge profile, not a guaranteed prediction of employment or hiring success.

## Professional Summary
${profile.summary}

## Core Technical Skills
${skills.map((s) => `- **${s.name}** (${s.level}) - ${s.category}`).join('\n')}

## Engineering Projects
${projects
  .map(
    (p) => `### ${p.title} (${p.status})
*Role: ${p.role || 'Contributor'} | ${p.startDate} - ${p.endDate || 'Present'}*
${p.description}
**Skills:** ${p.skills.join(', ')}
${p.highlights.map((h) => `- ${h}`).join('\n')}
`
  )
  .join('\n')}

## Certifications & Achievements
${achievements.map((a) => `- **${a.title}** - ${a.issuer} (${a.date})`).join('\n')}

## Learning Milestones & Goals
${goals.map((g) => `- [${g.completed ? 'x' : ' '}] ${g.title} (Target: ${g.targetDate})`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    showToast({
      type: 'success',
      title: 'Portfolio Copied!',
      message: 'Clean Markdown portfolio copied to your clipboard.',
    });
  };

  // Group skills by category for clear presentation
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Placement Portfolio Summary</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured, print-ready document formatted for internship submissions and engineering job applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setProfileForm(profile);
              setIsEditProfileOpen(true);
            }}
            id="portfolio-edit-profile-btn"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setIsAddAchOpen(true)}
            id="portfolio-add-ach-btn"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Add Achievement</span>
          </button>

          <button
            onClick={copyMarkdownSummary}
            id="portfolio-copy-md-btn"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-indigo-600" />
            <span>Copy as Markdown</span>
          </button>

          <button
            onClick={handlePrint}
            id="portfolio-print-btn"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Professional Portfolio Document */}
      <div
        id="portfolio-document"
        className="bg-white rounded-2xl border border-slate-200/90 surface-3d p-6 sm:p-10 max-w-5xl mx-auto space-y-8 text-slate-800 print:shadow-none print:border-none print:p-0"
      >
        {/* Document Header / Identity */}
        <header className="border-b border-slate-200 pb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="mb-2">
                <SkillForgeLogo size="sm" showWordmark={true} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans">
                {profile.name}
              </h1>
              <p className="text-base font-bold text-indigo-600 mt-1">
                {profile.headline}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Target Role: <strong className="text-slate-900">{profile.targetRole}</strong> •{' '}
                {profile.institution} (Graduating {profile.graduationYear})
              </p>
            </div>

            <div className="no-print sm:text-right">
              <div className="inline-block px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs shadow-2xs">
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Career Readiness Score</span>
                <span className="font-black text-indigo-600 text-sm sm:text-base">
                  {stats.scoreInterpretation.displayLabel}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">
                  {stats.scoreInterpretation.status}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details & Links */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 pt-2">
            {profile.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profile.email}
              </span>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {profile.phone}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {profile.location}
              </span>
            )}
            {profile.linkedin && (
              <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                <Linkedin className="w-3.5 h-3.5 text-indigo-600" />
                {profile.linkedin}
              </span>
            )}
            {profile.github && (
              <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                <Github className="w-3.5 h-3.5 text-slate-700" />
                {profile.github}
              </span>
            )}
          </div>
        </header>

        {/* Section 1: Professional Summary */}
        <section className="space-y-2">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Professional Summary & Career Objective</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            {profile.summary}
          </p>
        </section>

        {/* Section: Career Readiness Assessment */}
        <section className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 page-break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                SkillForge Profile Assessment
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Career Readiness Score: <span className="text-indigo-600">{stats.scoreInterpretation.displayLabel}</span>
              </h3>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border w-fit ${stats.scoreInterpretation.theme.badgeBg} ${stats.scoreInterpretation.theme.badgeText} ${stats.scoreInterpretation.theme.badgeBorder}`}
            >
              {stats.scoreInterpretation.rangeText} Band
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {stats.scoreInterpretation.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <strong className="text-slate-800 font-semibold block text-[11px]">Why this score was received:</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {stats.scoreInterpretation.whyExplanation}
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-slate-800 font-semibold block text-[11px]">Actionable next steps:</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {stats.scoreInterpretation.whatToDoNext}
              </p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 border-t border-slate-200/70 pt-2 leading-relaxed italic">
            * MVP career-readiness estimate based on the student's SkillForge profile. Not a guaranteed prediction of employment or hiring success.
          </p>
        </section>

        {/* Section 2: Technical Skills Inventory */}
        <section className="space-y-3 page-break-inside-avoid">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Technical Skills & Proficiency</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(skillsByCategory).map(([category, catSkills]) => (
              <div
                key={category}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2"
              >
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {catSkills.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white border border-slate-200 text-slate-800 shadow-2xs"
                    >
                      <span>{s.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          s.level === 'Advanced'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : s.level === 'Intermediate'
                            ? 'bg-indigo-50/60 text-indigo-600 border border-indigo-100'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {s.level}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Engineering Projects Showcase */}
        <section className="space-y-4 page-break-inside-avoid">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <FolderGit2 className="w-4 h-4 text-indigo-600" />
            <span>Engineering Projects & Applied Work</span>
          </h2>

          <div className="space-y-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="space-y-1.5 border-l-2 border-indigo-600 pl-3.5 py-0.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {proj.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {proj.startDate} → {proj.endDate || 'Present'}
                  </span>
                </div>

                {proj.role && (
                  <p className="text-xs text-indigo-600 font-semibold">{proj.role}</p>
                )}

                <p className="text-xs text-slate-700 leading-relaxed">
                  {proj.description}
                </p>

                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="space-y-1 pt-1">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap items-center gap-1.5 pt-1.5 text-[10px]">
                  <span className="font-bold text-slate-400 uppercase">Skills applied:</span>
                  {proj.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-100"
                    >
                      {s}
                    </span>
                  ))}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto text-indigo-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      Repo <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Certifications & Achievements */}
        <section className="space-y-3 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Certifications, Competitions & Honors</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                    {ach.type}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 mt-1">{ach.title}</h3>
                  <p className="text-[11px] text-slate-500">
                    {ach.issuer} • {ach.date}
                  </p>
                </div>
                <button
                  onClick={() => deleteAchievement(ach.id)}
                  className="no-print text-slate-300 hover:text-rose-600 p-1 transition-colors"
                  title="Remove achievement"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Learning Trajectory & Completed Goals */}
        <section className="space-y-2 page-break-inside-avoid">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Continuous Learning & Milestones</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {goals.map((g) => (
              <div
                key={g.id}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100"
              >
                {g.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className={`truncate ${g.completed ? 'font-medium' : 'text-slate-600'}`}>
                  {g.title}
                </span>
                <span className="ml-auto text-[10px] text-slate-400 shrink-0">
                  {g.completed ? 'Achieved' : `Due ${g.targetDate}`}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Document Footer */}
        <footer className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Generated via SkillForge — Verified Engineering Skill & Project Portfolio Summary • {new Date().toLocaleDateString()}
        </footer>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Edit Student Profile</h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={profileForm.graduationYear}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, graduationYear: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={profileForm.targetRole}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, targetRole: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={profileForm.institution}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, institution: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LinkedIn Handle
                  </label>
                  <input
                    type="text"
                    value={profileForm.linkedin}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GitHub Handle
                  </label>
                  <input
                    type="text"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Summary & Bio
                </label>
                <textarea
                  rows={4}
                  value={profileForm.summary}
                  onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Achievement Modal */}
      {isAddAchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Add Achievement or Certification</h2>
              <button
                onClick={() => setIsAddAchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAchievement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={achForm.title}
                  onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                  placeholder="e.g. Certified SOLIDWORKS Associate (CSWA)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Issuing Organization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={achForm.issuer}
                    onChange={(e) => setAchForm({ ...achForm, issuer: e.target.value })}
                    placeholder="e.g. Dassault Systèmes, IEEE"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={achForm.type}
                    onChange={(e) =>
                      setAchForm({ ...achForm, type: e.target.value as Achievement['type'] })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Certification">Certification</option>
                    <option value="Competition">Competition / Hackathon</option>
                    <option value="Publication">Technical Publication</option>
                    <option value="Honor">Honor / Award</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date Awarded
                </label>
                <input
                  type="text"
                  value={achForm.date}
                  onChange={(e) => setAchForm({ ...achForm, date: e.target.value })}
                  placeholder="e.g. Oct 2024"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAchOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
