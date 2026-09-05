import React, { useState } from 'react';
import { Layers, FolderGit2, Target, CheckCircle, ArrowUpRight } from 'lucide-react';

interface StepTier {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  metric: string;
  icon: React.ReactNode;
  tags: string[];
  color: {
    top: string;
    front: string;
    side: string;
    accent: string;
    badge: string;
    border: string;
  };
}

export const ProgressionVisual3D: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(3); // default highlight on career ready step

  const steps: StepTier[] = [
    {
      id: 'step-learn',
      step: '01',
      title: 'Learn',
      subtitle: 'Technical Foundation',
      metric: 'Core Competency',
      icon: <Layers className="w-4 h-4 text-slate-700" />,
      tags: ['CAD & Modeling', 'Python', 'Simulation'],
      color: {
        top: 'from-slate-100 to-slate-200/90',
        front: 'bg-slate-300/80',
        side: 'bg-slate-400/80',
        accent: 'text-slate-800',
        badge: 'bg-slate-100 text-slate-700 border-slate-300',
        border: 'border-slate-300',
      },
    },
    {
      id: 'step-build',
      step: '02',
      title: 'Build',
      subtitle: 'Coursework & Capstones',
      metric: 'Applied Evidence',
      icon: <FolderGit2 className="w-4 h-4 text-indigo-700" />,
      tags: ['Robotics Arm', 'IoT Telemetry', 'PCB Layout'],
      color: {
        top: 'from-indigo-50 to-indigo-100',
        front: 'bg-indigo-200/90',
        side: 'bg-indigo-300/90',
        accent: 'text-indigo-900',
        badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        border: 'border-indigo-300',
      },
    },
    {
      id: 'step-improve',
      step: '03',
      title: 'Improve',
      subtitle: 'Target Skill Gaps',
      metric: 'Milestone Velocity',
      icon: <Target className="w-4 h-4 text-violet-700" />,
      tags: ['Placement Goals', 'Gap Benchmarking', 'Level-Ups'],
      color: {
        top: 'from-violet-50 to-violet-100',
        front: 'bg-violet-200/90',
        side: 'bg-violet-300/90',
        accent: 'text-violet-900',
        badge: 'bg-violet-50 text-violet-700 border-violet-200',
        border: 'border-violet-300',
      },
    },
    {
      id: 'step-ready',
      step: '04',
      title: 'Career Ready',
      subtitle: 'Verified Placement Profile',
      metric: '75–89% Benchmark',
      icon: <CheckCircle className="w-4 h-4 text-emerald-700" />,
      tags: ['1-Click PDF Resume', 'Verified Skills', 'Recruiter Proof'],
      color: {
        top: 'from-emerald-50 to-teal-100',
        front: 'bg-teal-200/90',
        side: 'bg-emerald-400/90',
        accent: 'text-teal-950',
        badge: 'bg-teal-50 text-teal-800 border-teal-300',
        border: 'border-teal-400',
      },
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-4 select-none">
      {/* Visual Subtitle / Concept Banner */}
      <div className="text-center mb-6 space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
          <span>The SkillForge Progression Framework</span>
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Learn &rarr; Build &rarr; Improve &rarr; Become Career Ready
        </div>
      </div>

      {/* Stepped 3D Isometric Progression Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-end pt-4 pb-2 px-2">
        {steps.map((item, index) => {
          const isSelected = activeStep === index;
          // Step height offset in pixels to physically manifest progressive ascension
          const elevationPadding = index === 0 ? 'mt-8' : index === 1 ? 'mt-5' : index === 2 ? 'mt-2' : 'mt-0';

          return (
            <div
              key={item.id}
              onClick={() => setActiveStep(index)}
              className={`relative cursor-pointer transition-all duration-200 flex flex-col justify-end group ${elevationPadding}`}
            >
              {/* Connector Progression Line to Next Step */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 z-10 text-slate-300 transform -translate-y-1/2 group-hover:text-indigo-400 transition-colors">
                  &rarr;
                </div>
              )}

              {/* 3D Tier Platform Card */}
              <div
                className={`relative rounded-2xl p-5 border transition-all duration-200 surface-3d-hover ${
                  isSelected
                    ? `${item.color.border} bg-white shadow-[0_8px_24px_-4px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,1)] ring-2 ring-indigo-500/20`
                    : 'border-slate-200 bg-white/90 hover:border-slate-300'
                }`}
              >
                {/* 3D Step Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md border ${item.color.badge}`}
                  >
                    Step {item.step}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center icon-container-3d">
                    {item.icon}
                  </div>
                </div>

                {/* Stage Title */}
                <h4 className="text-base font-black tracking-tight text-slate-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5 mb-3">
                  {item.subtitle}
                </p>

                {/* Metric Readout */}
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/80 mb-3 shadow-[inset_0_1px_1px_rgba(15,23,42,0.03)]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Outcome
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {item.metric}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 3D Layered Base Foundation Shelf (Simulating isometric block elevation) */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Tier Level {index + 1}</span>
                  <span className="text-indigo-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                    Ascend &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
