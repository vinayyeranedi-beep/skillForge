import React from 'react';
import { useApp } from '../context/AppContext';
import { CareerReadinessCard } from './CareerReadinessCard';
import {
  Layers,
  FolderGit2,
  Target,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Check,
  Compass,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenAddSkill: () => void;
  onOpenAddProject: () => void;
  onOpenAddGoal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddSkill,
  onOpenAddProject,
  onOpenAddGoal,
}) => {
  const {
    profile,
    skills,
    projects,
    goals,
    stats,
    setActiveTab,
    toggleGoalCompletion,
    openAssistantWithPrompt,
  } = useApp();

  // Active learning goals
  const activeGoals = goals
    .filter((g) => !g.completed)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 4);

  // Recent projects (latest 3)
  const recentProjects = projects.slice(0, 3);

  // Display skills with proficiency percentage
  const getSkillPercent = (level: string, months?: number): number => {
    if (level === 'Advanced') return Math.min(100, 85 + (months ? Math.min(months, 15) : 10));
    if (level === 'Intermediate') return Math.min(80, 55 + (months ? Math.min(months, 20) : 10));
    return Math.min(50, 30 + (months ? Math.min(months, 15) : 5));
  };

  const topSkills = skills.slice(0, 5);

  const studentFirstName = profile.name ? profile.name.split(' ')[0] : 'Student';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Good morning, {studentFirstName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's your current learning progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('portfolio')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <span>View Portfolio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Compact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Skills */}
        <div
          id="metric-skills-card"
          onClick={() => setActiveTab('skills')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 surface-3d card-3d-lift cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills Matrix</span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center icon-container-3d group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{stats.totalSkills}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">{stats.intermediateCount + stats.advancedCount}</span>
              <span>Int / Adv proficiencies</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Projects */}
        <div
          id="metric-projects-card"
          onClick={() => setActiveTab('projects')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 surface-3d card-3d-lift cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capstones</span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center icon-container-3d group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{stats.totalProjects}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">{stats.completedProjects}</span>
              <span>completed deliverables</span>
            </p>
          </div>
        </div>

        {/* Metric 3: Active Goals */}
        <div
          id="metric-goals-card"
          onClick={() => setActiveTab('goals')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 surface-3d card-3d-lift cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Milestones</span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center icon-container-3d group-hover:scale-105 transition-transform">
              <Target className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{stats.activeGoals}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">{stats.completedGoals}</span>
              <span>milestones achieved</span>
            </p>
          </div>
        </div>

        {/* Metric 4: Career Readiness Score */}
        <div
          id="metric-progress-card"
          onClick={() => setActiveTab('career-ai')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-indigo-300 surface-3d card-3d-lift cursor-pointer group"
          title="Click to view Career Readiness Centerpiece"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Readiness Score</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center icon-container-3d group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 truncate">
              {stats.scoreInterpretation.displayLabel}
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate flex items-center gap-1">
              <span className="font-semibold text-indigo-600">{stats.scoreInterpretation.rangeText} Band</span>
              <span>• Analyze Gaps</span>
            </p>
          </div>
        </div>
      </div>

      {/* Primary Score Interpretation Card (Visual Focal Point) */}
      <CareerReadinessCard
        onNavigateToAI={() => setActiveTab('career-ai')}
        onNavigateToSkills={() => setActiveTab('skills')}
      />

      {/* Ask Forge Assistant — Personal Career Guide Banner */}
      <div
        id="dashboard-forge-assistant-card"
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white surface-3d shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600/90 text-white flex items-center justify-center shrink-0 shadow-inner icon-container-3d mt-0.5 sm:mt-0">
            <Compass className="w-5 h-5 text-sky-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Ask Forge Assistant
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-sky-200 border border-indigo-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Personal Career Guide
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Decide what to learn, build, or improve next to accelerate your readiness for{' '}
              <strong className="text-white font-bold">{profile.targetRole || 'Mechanical Design Engineer'}</strong>.
            </p>
            {/* Suggested quick prompt pills */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <button
                onClick={() => openAssistantWithPrompt('What should I learn next?')}
                className="text-[11px] font-medium bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-md transition-colors border border-white/10 flex items-center gap-1"
              >
                <span>What should I learn next?</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-70" />
              </button>
              <button
                onClick={() => openAssistantWithPrompt('What project should I build?')}
                className="text-[11px] font-medium bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-md transition-colors border border-white/10 flex items-center gap-1"
              >
                <span>What project should I build?</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-70" />
              </button>
              <button
                onClick={() => openAssistantWithPrompt('How can I improve my readiness score?')}
                className="text-[11px] font-medium bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-md transition-colors border border-white/10 hidden sm:flex items-center gap-1"
              >
                <span>How can I improve my readiness score?</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-70" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <button
            onClick={() => openAssistantWithPrompt()}
            className="btn-3d w-full md:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-sky-200" />
            <span>Consult Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout (Secondary Information) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Skill Progress */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 surface-3d">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Skill Progress</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current proficiency and mastery across core engineering tools.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('skills')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {skills.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-xs">No skills tracked yet.</p>
              <button
                onClick={onOpenAddSkill}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
              >
                + Add your first skill
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {topSkills.map((skill) => {
                const percent = getSkillPercent(skill.level, skill.experienceMonths);
                return (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{skill.name}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-medium">{skill.level}</span>
                      </div>
                      <span className="font-semibold text-slate-700">{percent}%</span>
                    </div>
                    {/* Dimensional horizontal progress indicator */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden track-3d">
                      <div
                        className="bg-indigo-600 h-full rounded-full fill-3d transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing {topSkills.length} of {skills.length} tracked skills
            </span>
            <button
              onClick={onOpenAddSkill}
              className="btn-3d text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Current Goals */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 surface-3d">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Current Goals</h2>
              <p className="text-xs text-slate-500 mt-0.5">Active milestones and target dates.</p>
            </div>
            <button
              onClick={() => setActiveTab('goals')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {activeGoals.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-xs">No active goals right now.</p>
              <button
                onClick={onOpenAddGoal}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
              >
                + Set a new learning goal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2.5 surface-3d"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => toggleGoalCompletion(goal.id)}
                        className="mt-0.5 w-4 h-4 rounded border border-slate-300 hover:border-emerald-500 flex items-center justify-center text-white hover:bg-emerald-50 transition-colors shrink-0"
                        title="Mark goal completed"
                      >
                        <Check className="w-3 h-3 text-slate-300 hover:text-emerald-600" />
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {goal.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Target: {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 shrink-0">
                      In Progress
                    </span>
                  </div>

                  {/* Goal Progress Bar */}
                  <div className="space-y-1 pt-0.5">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Progress</span>
                      <span>{goal.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden track-3d">
                      <div
                        className="bg-indigo-600 h-full rounded-full fill-3d transition-all duration-500"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {goals.filter((g) => g.completed).length} goals completed
            </span>
            <button
              onClick={onOpenAddGoal}
              className="btn-3d text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set Goal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supporting Information: Recent Projects Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-5 surface-3d">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Projects</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Work you've completed and engineering skills applied.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View all projects</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-xs">No projects documented yet.</p>
            <button
              onClick={onOpenAddProject}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
            >
              + Record your first engineering project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setActiveTab('projects')}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 surface-3d-hover transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {proj.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        proj.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <div className="flex flex-wrap gap-1">
                    {proj.skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                      >
                        {s}
                      </span>
                    ))}
                    {proj.skills.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                        +{proj.skills.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {proj.endDate ? `Completed ${proj.endDate}` : `Started ${proj.startDate}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {projects.length} total projects recorded
          </span>
          <button
            onClick={onOpenAddProject}
            className="btn-3d text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
