import React from 'react';
import { useApp } from '../context/AppContext';
import { SkillForgeLogo } from './SkillForgeLogo';
import { ProgressionVisual3D } from './ProgressionVisual3D';
import {
  Layers,
  FolderGit2,
  Target,
  FileBadge2,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { setActiveTab } = useApp();

  const capabilities = [
    {
      title: 'Skills Inventory',
      description:
        'Document technical competencies across CAD, programming, simulation, and core engineering with clear proficiency levels.',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      detail: 'Beginner, Intermediate, and Advanced tracking',
    },
    {
      title: 'Project Showcase',
      description:
        'Keep track of academic capstones, hackathon builds, and coursework with detailed descriptions and applied skills.',
      icon: <FolderGit2 className="w-5 h-5 text-indigo-600" />,
      detail: 'Link technical skills to real engineering work',
    },
    {
      title: 'Learning Goals',
      description:
        'Turn what you want to learn into clear, actionable goals with target completion dates and milestone progress.',
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      detail: 'Pace your preparation for campus placements',
    },
    {
      title: 'Placement Portfolio',
      description:
        'Generate a structured, print-ready student profile and resume summary formatted for engineering internship applications.',
      icon: <FileBadge2 className="w-5 h-5 text-indigo-600" />,
      detail: 'Clean browser print and PDF export',
    },
    {
      title: 'Role Benchmarking',
      description:
        'Compare your documented skill inventory against real engineering industry roles to identify strengths and bridge gaps.',
      icon: <Compass className="w-5 h-5 text-indigo-600" />,
      detail: 'Tailored for mechanical, software, and robotics paths',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-14 space-y-16 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto px-4">
        {/* Prominent SkillForge Logo Showcase */}
        <div className="flex justify-center pt-2">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/90 surface-3d inline-flex items-center justify-center">
            <SkillForgeLogo size="lg" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Student Productivity & Placement Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
          Build your skills. Track your progress. Be placement ready.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          SkillForge is a dedicated workspace for engineering students to organize technical skills, showcase applied coursework and projects, and prepare an industry-ready portfolio for campus placements.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setActiveTab('dashboard')}
            id="hero-start-tracking-btn"
            className="btn-3d inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-bold rounded-xl transition-all"
          >
            <span>Start Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3D-Inspired Progression Structure Visual (Prompt Section 4) */}
      <section className="px-4">
        <div className="bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-3xl p-6 sm:p-8 border border-slate-200/80 surface-3d">
          <ProgressionVisual3D />
        </div>
      </section>

      {/* 5 Core Capabilities Section */}
      <section className="space-y-6 px-4">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Everything you need for engineering placement success
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Five core capabilities designed specifically for college engineering students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap, index) => (
            <div
              key={cap.title}
              className={`bg-white rounded-2xl border border-slate-200/90 p-6 surface-3d surface-3d-hover flex flex-col justify-between space-y-4 ${
                index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center icon-container-3d">
                  {cap.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {cap.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {cap.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{cap.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Simplicity Footer Banner */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 surface-3d flex flex-col sm:flex-row sm:items-center justify-between gap-6 mx-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            Ready to organize your engineering profile?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            All data persists locally in your browser. No account setup required.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="btn-3d inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shrink-0"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
