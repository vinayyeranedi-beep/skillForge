import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LearningGoal, GoalPriority } from '../types';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Layers,
} from 'lucide-react';

interface GoalsViewProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { goals, skills, addGoal, updateGoal, toggleGoalCompletion, deleteGoal } = useApp();

  const [filterTab, setFilterTab] = useState<'All' | 'Active' | 'Completed'>('All');
  const [editingGoal, setEditingGoal] = useState<LearningGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<LearningGoal | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    targetDate: string;
    priority: GoalPriority;
    linkedSkill: string;
    progressPercentage: number;
  }>({
    title: '',
    description: '',
    targetDate: '',
    priority: 'High',
    linkedSkill: '',
    progressPercentage: 25,
  });

  const [formError, setFormError] = useState('');

  // Pre-fill target date as 30 days ahead for convenience
  const defaultFutureDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }, []);

  const openAddModal = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      targetDate: defaultFutureDate,
      priority: 'High',
      linkedSkill: skills[0]?.name || '',
      progressPercentage: 25,
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (goal: LearningGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate,
      priority: goal.priority,
      linkedSkill: goal.linkedSkill || '',
      progressPercentage: goal.progressPercentage,
    });
    setFormError('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Please enter a goal title.');
      return;
    }
    if (!formData.targetDate) {
      setFormError('Please select a target completion date.');
      return;
    }

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetDate: formData.targetDate,
        priority: formData.priority,
        linkedSkill: formData.linkedSkill || undefined,
        progressPercentage: Number(formData.progressPercentage),
      });
      setEditingGoal(null);
    } else {
      addGoal({
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetDate: formData.targetDate,
        priority: formData.priority,
        linkedSkill: formData.linkedSkill || undefined,
        progressPercentage: Number(formData.progressPercentage),
        completed: false,
      });
      setIsAddModalOpen(false);
    }
  };

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (filterTab === 'Active') return !g.completed;
      if (filterTab === 'Completed') return g.completed;
      return true;
    });
  }, [goals, filterTab]);

  const activeCount = goals.filter((g) => !g.completed).length;
  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header matching exact prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Learning Goals</h1>
          <p className="text-sm text-slate-500 mt-1">
            Set target skills and track your progress over time.
          </p>
        </div>

        <button
          onClick={openAddModal}
          id="add-goal-top-btn"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Set Goal</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1">
          {(['All', 'Active', 'Completed'] as const).map((tab) => {
            const count =
              tab === 'All' ? goals.length : tab === 'Active' ? activeCount : completedCount;
            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterTab === tab
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Completion rate:{' '}
          <strong className="text-slate-800">
            {goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0}%
          </strong>
        </div>
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <Target className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            {filterTab === 'Completed' ? 'No completed goals yet' : 'No learning goals set yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filterTab === 'Completed'
              ? 'Check off active goals once you complete milestones to celebrate your progress.'
              : "Set a clear goal with a target date to structure your placement preparation."}
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Set your first goal</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGoals.map((goal) => {
            return (
              <div
                key={goal.id}
                id={`goal-card-${goal.id}`}
                className={`bg-white rounded-xl p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  goal.completed
                    ? 'border-slate-200 bg-slate-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left: Checkbox (Mark Complete Action) & Goal Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => toggleGoalCompletion(goal.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    title={goal.completed ? 'Mark as Active' : 'Mark as Complete'}
                    aria-label={`Mark complete for ${goal.title}`}
                  >
                    {goal.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-bold text-slate-900 ${
                          goal.completed ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {goal.title}
                      </h3>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          goal.completed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                        }`}
                      >
                        {goal.completed ? 'Completed' : 'Active'}
                      </span>
                    </div>

                    {goal.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {goal.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Target: {new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>

                      {goal.linkedSkill && (
                        <span className="flex items-center gap-1 font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          <Layers className="w-3 h-3 text-slate-400" />
                          Skill: {goal.linkedSkill}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Progress Slider / Percentage & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:w-64 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex-1 max-w-[140px]">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold text-slate-700">{goal.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          goal.completed ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(goal)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                      title="Edit goal"
                      aria-label={`Edit ${goal.title}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setGoalToDelete(goal)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete goal"
                      aria-label={`Delete ${goal.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      {(isAddModalOpen || editingGoal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingGoal ? 'Edit Learning Goal' : 'Set Learning Goal'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingGoal(null);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Goal Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (formError) setFormError('');
                  }}
                  placeholder="e.g. Master Finite Element Analysis (FEA)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What will you learn or build to achieve this?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Skill
                  </label>
                  <select
                    value={formData.linkedSkill}
                    onChange={(e) => setFormData({ ...formData, linkedSkill: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                  >
                    <option value="">None / General</option>
                    {skills.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Progress Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Current Progress ({formData.progressPercentage}%)
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.progressPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progressPercentage: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingGoal(null);
                  }}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-goal-btn"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  {editingGoal ? 'Save Changes' : 'Set Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {goalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete this goal?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong className="text-slate-800">"{goalToDelete.title}"</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setGoalToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteGoal(goalToDelete.id);
                  setGoalToDelete(null);
                }}
                id="confirm-delete-goal-btn"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
