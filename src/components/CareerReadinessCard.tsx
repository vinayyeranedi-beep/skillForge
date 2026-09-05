import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SCORE_INTERPRETATION_RANGES, ScoreRangeDefinition } from '../utils/scoreInterpretation';
import { DimensionalScoreGauge } from './DimensionalScoreGauge';
import {
  TrendingUp,
  Info,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface CareerReadinessCardProps {
  variant?: 'full' | 'compact';
  onNavigateToAI?: () => void;
  onNavigateToSkills?: () => void;
}

export const CareerReadinessCard: React.FC<CareerReadinessCardProps> = ({
  variant = 'full',
  onNavigateToAI,
  onNavigateToSkills,
}) => {
  const { stats, profile, setActiveTab } = useApp();
  const { scoreInterpretation } = stats;
  const [showAllRanges, setShowAllRanges] = useState(false);

  // Fallback handlers
  const handleGoToAI = onNavigateToAI || (() => setActiveTab('career-ai'));
  const handleGoToSkills = onNavigateToSkills || (() => setActiveTab('skills'));

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 surface-3d space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Career Readiness</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${scoreInterpretation.theme.badgeBg} ${scoreInterpretation.theme.badgeText} ${scoreInterpretation.theme.badgeBorder}`}
          >
            {scoreInterpretation.status}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <DimensionalScoreGauge
            score={stats.readinessScore}
            status={scoreInterpretation.status}
            size={72}
            strokeWidth={7}
            showTicks={false}
          />
          <div className="space-y-1 min-w-0">
            <div className="text-base font-extrabold tracking-tight text-slate-900 truncate">
              {scoreInterpretation.displayLabel}
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {scoreInterpretation.whyExplanation}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[10px]">MVP Profile Estimate</span>
          <button
            onClick={() => setActiveTab('portfolio')}
            className="font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-[11px]"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="career-readiness-interpretation-card"
      className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 space-y-6 surface-3d"
    >
      {/* Top Banner & Visual Focal Point (Circular 3D Gauge + Score Readout) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 inline-flex items-center gap-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Career Readiness Score
            </span>
            <span className="text-xs text-slate-400">
              Target: <strong className="text-slate-700 font-semibold">{profile.targetRole || 'Engineering Professional'}</strong>
            </span>
          </div>

          {/* Primary Display: percentage score and status label */}
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {scoreInterpretation.displayLabel}
            </h2>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md border shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${scoreInterpretation.theme.badgeBg} ${scoreInterpretation.theme.badgeText} ${scoreInterpretation.theme.badgeBorder}`}
            >
              {scoreInterpretation.rangeText} Band
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {scoreInterpretation.description}
          </p>

          <div className="pt-1 flex items-center gap-3">
            <button
              onClick={handleGoToAI}
              id="readiness-explore-gaps-btn"
              className="btn-3d inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shrink-0"
            >
              <span>Analyze Skill Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-400">
              Assessing against placement benchmark
            </span>
          </div>
        </div>

        {/* Circular 3D-Style Progress Gauge Focal Point */}
        <div className="flex flex-col items-center justify-center shrink-0 self-center md:self-auto p-2">
          <DimensionalScoreGauge
            score={stats.readinessScore}
            status={scoreInterpretation.status}
            size={144}
            strokeWidth={11}
          />
          <span className="text-[11px] font-semibold text-slate-500 mt-2">
            Dimensional Readiness Arc
          </span>
        </div>
      </div>

      {/* 5-Tier Segmented Scale Visualizer */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Readiness Score Scale (5 Performance Tiers)</span>
          <span className="text-slate-500 font-medium">
            Profile Score: <strong className="text-slate-900 font-bold">{stats.readinessScore}%</strong>
          </span>
        </div>

        {/* 5 Range Bars with 3D Track & Fill */}
        <div className="grid grid-cols-5 gap-2 h-3">
          {SCORE_INTERPRETATION_RANGES.map((r) => {
            const isCurrent = scoreInterpretation.status === r.status;
            return (
              <div
                key={r.status}
                className="relative rounded-full overflow-hidden bg-slate-100 track-3d transition-all"
                title={`${r.rangeText} — ${r.status}: ${r.description}`}
              >
                <div
                  className={`h-full rounded-full fill-3d transition-all duration-500 ${
                    isCurrent
                      ? `${scoreInterpretation.theme.barColor}`
                      : stats.readinessScore >= r.max
                      ? 'bg-slate-300'
                      : 'bg-transparent'
                  }`}
                  style={{
                    width: isCurrent
                      ? `${Math.min(100, Math.max(15, ((stats.readinessScore - r.min) / (r.max - r.min || 1)) * 100))}%`
                      : stats.readinessScore >= r.max
                      ? '100%'
                      : '0%',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Range Labels */}
        <div className="grid grid-cols-5 text-center text-[10px] text-slate-500 font-medium pt-0.5">
          {SCORE_INTERPRETATION_RANGES.map((r) => {
            const isCurrent = scoreInterpretation.status === r.status;
            return (
              <div key={r.status} className="truncate px-0.5">
                <span
                  className={
                    isCurrent
                      ? `font-bold ${scoreInterpretation.theme.accentColor}`
                      : 'text-slate-400'
                  }
                >
                  {r.rangeText}
                </span>
                <span className="hidden md:inline text-slate-400"> • {r.status}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Explanation Section (Why you received this score & What to do next) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why the student received that score */}
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2 surface-3d">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center icon-container-3d">
              <Info className="w-3.5 h-3.5" />
            </div>
            <span>Why you received this score</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {scoreInterpretation.whyExplanation}
          </p>
          <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              {stats.totalSkills} Skills ({stats.intermediateCount + stats.advancedCount} Int/Adv)
            </span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              {stats.completedProjects} Completed Projects
            </span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              {stats.completedGoals} Completed Goals
            </span>
          </div>
        </div>

        {/* What they should do next */}
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2 flex flex-col justify-between surface-3d">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center icon-container-3d">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>What you should do next</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {scoreInterpretation.whatToDoNext}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleGoToSkills}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>+ Record Skill</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab('goals')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
            >
              <span>+ Set Goal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Full Score Interpretation Guide (0–100% Ranges) */}
      <div className="border-t border-slate-100 pt-3">
        <button
          onClick={() => setShowAllRanges(!showAllRanges)}
          id="toggle-score-guide-btn"
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Score Interpretation Guide ({SCORE_INTERPRETATION_RANGES.length} Performance Bands)</span>
          </span>
          {showAllRanges ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showAllRanges && (
          <div className="mt-3 space-y-2 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
            {SCORE_INTERPRETATION_RANGES.map((item: ScoreRangeDefinition) => {
              const isCurrent = scoreInterpretation.status === item.status;
              return (
                <div
                  key={item.status}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? 'border-indigo-300 bg-indigo-50/40 surface-3d'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold">
                        {item.rangeText} — {item.status}
                      </strong>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
                          Current Tier
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer: MVP Estimate, not a guarantee */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-slate-500 text-xs">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-700">MVP Estimate Disclaimer:</strong>{' '}
          Do not present the score as a guaranteed prediction of employment or hiring success. It is an{' '}
          <span className="font-semibold text-slate-700">MVP career-readiness estimate based on the student's SkillForge profile</span>.
        </p>
      </div>
    </div>
  );
};

