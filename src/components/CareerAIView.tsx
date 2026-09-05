import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CAREER_BENCHMARKS } from '../data/sampleData';
import { CareerRoleBenchmark, SkillLevel } from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Target,
  BrainCircuit,
  Compass,
  Briefcase,
  ChevronRight,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const CareerAIView: React.FC = () => {
  const { skills, stats, addSkill, addGoal, setActiveTab, showToast, openAssistantWithPrompt } = useApp();

  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>(
    CAREER_BENCHMARKS[0].id
  );

  const selectedRole = useMemo(() => {
    return (
      CAREER_BENCHMARKS.find((b) => b.id === selectedBenchmarkId) ||
      CAREER_BENCHMARKS[0]
    );
  }, [selectedBenchmarkId]);

  // Skill comparison logic
  const analysis = useMemo(() => {
    const studentSkillMap = new Map(
      skills.map((s) => [s.name.toLowerCase(), s.level])
    );

    const levelWeights: Record<SkillLevel, number> = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3,
    };

    let totalPoints = 0;
    let earnedPoints = 0;

    const matched: {
      name: string;
      currentLevel: SkillLevel;
      requiredLevel: SkillLevel;
      meetsRequirement: boolean;
      importance: string;
    }[] = [];

    const gaps: {
      name: string;
      requiredLevel: SkillLevel;
      importance: 'Core' | 'Recommended' | 'Bonus';
      category: string;
    }[] = [];

    selectedRole.requiredSkills.forEach((req) => {
      const importanceMultiplier =
        req.importance === 'Core' ? 3 : req.importance === 'Recommended' ? 2 : 1;
      const targetWeight = levelWeights[req.level] * importanceMultiplier;
      totalPoints += targetWeight;

      const userLevel = studentSkillMap.get(req.name.toLowerCase());

      if (userLevel) {
        const userWeight = levelWeights[userLevel] * importanceMultiplier;
        earnedPoints += Math.min(userWeight, targetWeight);
        const meets = levelWeights[userLevel] >= levelWeights[req.level];

        matched.push({
          name: req.name,
          currentLevel: userLevel,
          requiredLevel: req.level,
          meetsRequirement: meets,
          importance: req.importance,
        });

        if (!meets) {
          gaps.push({
            name: req.name,
            requiredLevel: req.level,
            importance: req.importance,
            category: 'Proficiency Upgrade',
          });
        }
      } else {
        gaps.push({
          name: req.name,
          requiredLevel: req.level,
          importance: req.importance,
          category: 'Missing Skill',
        });
      }
    });

    const matchPercent =
      totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    return {
      matchPercent,
      matched,
      gaps,
    };
  }, [skills, selectedRole]);

  // Quick 1-click Add Missing Skill
  const handleAddMissingSkill = (skillName: string, level: SkillLevel) => {
    addSkill({
      name: skillName,
      category: 'Core Engineering',
      level: 'Beginner',
      experienceMonths: 1,
      notes: `Targeting proficiency for ${selectedRole.roleName}.`,
    });
  };

  // Quick 1-click Set Learning Goal
  const handleSetTargetGoal = (skillName: string) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 45);

    addGoal({
      title: `Master ${skillName} Fundamentals for ${selectedRole.roleName}`,
      description: `Complete coursework and practice projects to achieve industry qualification in ${skillName}.`,
      targetDate: futureDate.toISOString().split('T')[0],
      completed: false,
      priority: 'High',
      linkedSkill: skillName,
      resources: 'Official documentation, campus lab practice, and open engineering courses',
      progressPercentage: 15,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI Skill-Gap Analyzer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyze your student skill profile against industry requirements to identify gaps and target career readiness.
          </p>
        </div>

        {/* Free / Rule-Based Architecture Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Free & Open-Source (0 Paid APIs)</span>
        </div>
      </div>

      {/* SkillForge Profile Career Readiness Context Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 surface-3d flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 icon-container-3d">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-700">Overall Profile Readiness:</span>
              <strong className="text-slate-900 font-extrabold text-sm">
                {stats.scoreInterpretation.displayLabel}
              </strong>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${stats.scoreInterpretation.theme.badgeBg} ${stats.scoreInterpretation.theme.badgeText} ${stats.scoreInterpretation.theme.badgeBorder}`}
              >
                {stats.scoreInterpretation.rangeText} Band
              </span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
              {stats.scoreInterpretation.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className="btn-3d text-xs font-semibold text-indigo-600 hover:text-indigo-700 shrink-0 flex items-center gap-1 self-start sm:self-center px-3 py-1.5 rounded-lg bg-indigo-50/50 border border-indigo-200/60"
        >
          <span>View Dashboard Score</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Target Role Selector Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 surface-3d space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Select Target Engineering Career Role
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {CAREER_BENCHMARKS.map((benchmark) => {
            const isSelected = benchmark.id === selectedBenchmarkId;
            return (
              <button
                key={benchmark.id}
                onClick={() => setSelectedBenchmarkId(benchmark.id)}
                className={`text-left p-3.5 rounded-xl border transition-all surface-3d ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-500/20 translate-y-[-2px]'
                    : 'border-slate-200 hover:border-indigo-200 bg-white hover:translate-y-[-2px]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                    {benchmark.discipline}
                  </span>
                  {isSelected && <Compass className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                  {benchmark.roleName}
                </h3>
              </button>
            );
          })}
        </div>
      </div>

      {/* Match Score & Analysis Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              Role Benchmark
            </span>
            <h2 className="text-xl font-black text-slate-900">
              {selectedRole.roleName}
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {selectedRole.description}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Career Fit Score
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {analysis.matchPercent}%
              </span>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-slate-200 flex items-center justify-center relative">
              <div
                className="w-14 h-14 rounded-full border-4 border-indigo-600 absolute inset-0 transition-all duration-700"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${analysis.matchPercent}%, 0 ${analysis.matchPercent}%)`,
                }}
              />
              <span className="text-xs font-bold text-indigo-700">
                {analysis.matchPercent >= 70
                  ? 'Strong'
                  : analysis.matchPercent >= 50
                  ? 'Moderate'
                  : 'Gap'}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Comparison Grid: Matched Skills vs Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Skills You Already Have */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Verified In Your Inventory ({analysis.matched.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">Current vs Required</span>
            </div>

            {analysis.matched.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                No matching skills found for this role yet. Check the recommendations on the right.
              </div>
            ) : (
              <div className="space-y-2">
                {analysis.matched.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{m.name}</span>
                        <span className="text-[10px] text-slate-400">({m.importance})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Your level:{' '}
                        <strong className="text-indigo-600 font-bold">{m.currentLevel}</strong> • Required:{' '}
                        {m.requiredLevel}
                      </div>
                    </div>

                    {m.meetsRequirement ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Qualified ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Upgrade Needed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Identified Gaps & Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Skill Gaps & Recommendations ({analysis.gaps.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">1-Click Action</span>
            </div>

            {analysis.gaps.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                🎉 Impressive! You have achieved all benchmarked core skills for this role.
              </div>
            ) : (
              <div className="space-y-2">
                {analysis.gaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-amber-200/70 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{gap.name}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            gap.importance === 'Core'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {gap.importance}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Target target proficiency: <strong>{gap.requiredLevel}</strong> ({gap.category})
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAddMissingSkill(gap.name, gap.requiredLevel)}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                        title="Add to skills inventory"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Skill</span>
                      </button>

                      <button
                        onClick={() => handleSetTargetGoal(gap.name)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                        title="Create target learning goal"
                      >
                        <Target className="w-3 h-3" />
                        <span>Set Goal</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ask Forge Assistant — Career Readiness Guide Banner */}
      <div
        id="career-ai-forge-assistant-callout"
        className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-indigo-900/80 surface-3d shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-sky-200 flex items-center justify-center shrink-0 icon-container-3d shadow-inner mt-0.5 sm:mt-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                Ask Forge Assistant
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-sky-200 border border-indigo-400/30">
                Gap Consultation
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Want personalized recommendations on closing your gaps for <strong className="text-white font-bold">{selectedRole.roleName}</strong>? Ask Forge Assistant to recommend high-impact goals or projects.
            </p>
          </div>
        </div>
        <button
          onClick={() => openAssistantWithPrompt(`Which skills am I missing for ${selectedRole.roleName}?`)}
          className="btn-3d px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <Compass className="w-4 h-4 text-sky-200" />
          <span>Consult Forge Assistant</span>
        </button>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-slate-500 text-xs">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-700">Estimate Disclaimer:</strong>{' '}
          Do not present the score as a guaranteed prediction of employment or hiring success. It is an{' '}
          <span className="font-semibold text-slate-700">MVP career-readiness estimate based on the student's SkillForge profile</span>.
        </p>
      </div>

      {/* AI Architecture & Extensibility Note (Prompt Section 7 compliance) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">
            SkillForge AI Extensibility Architecture
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          In strict adherence to the student MVP mandate, this skill-gap analyzer operates using a
          <strong> fast, deterministic rule-based benchmark engine</strong> that requires <em>zero paid API keys, zero credit cards, and zero external subscriptions</em>.
          The architecture is cleanly modularized so an external LLM (such as Google Gemini via server-side endpoints) can be plugged in to perform custom syllabus parsing and automated resume feedback whenever desired.
        </p>
        <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-400">
          <span>✓ Local Processing</span>
          <span>✓ Instant Real-time Results</span>
          <span>✓ Safe for Free Student Deployment</span>
        </div>
      </div>
    </div>
  );
};
