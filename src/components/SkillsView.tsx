import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Skill, SkillLevel } from '../types';
import { SKILL_CATEGORIES } from '../data/sampleData';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  FolderGit2,
  X,
} from 'lucide-react';

interface SkillsViewProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { skills, projects, addSkill, updateSkill, deleteSkill } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'recent'>('recent');

  // Edit Modal State
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Delete Confirmation State
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    level: SkillLevel;
    experienceMonths: number;
    notes: string;
  }>({
    name: '',
    category: SKILL_CATEGORIES[0],
    level: 'Intermediate',
    experienceMonths: 12,
    notes: '',
  });

  const [formError, setFormError] = useState<string>('');

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      experienceMonths: skill.experienceMonths || 0,
      notes: skill.notes || '',
    });
    setFormError('');
  };

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: SKILL_CATEGORIES[0],
      level: 'Intermediate',
      experienceMonths: 12,
      notes: '',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Please enter a skill name.');
      return;
    }

    if (editingSkill) {
      updateSkill(editingSkill.id, {
        name: formData.name.trim(),
        category: formData.category,
        level: formData.level,
        experienceMonths: Number(formData.experienceMonths) || 0,
        notes: formData.notes.trim(),
      });
      setEditingSkill(null);
    } else {
      addSkill({
        name: formData.name.trim(),
        category: formData.category,
        level: formData.level,
        experienceMonths: Number(formData.experienceMonths) || 0,
        notes: formData.notes.trim(),
      });
      setIsAddModalOpen(false);
    }
  };

  const filteredSkills = useMemo(() => {
    return skills
      .filter((skill) => {
        const matchesSearch =
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (skill.notes && skill.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesLevel = selectedLevel === 'All' || skill.level === selectedLevel;
        const matchesCategory =
          selectedCategory === 'All' || skill.category === selectedCategory;

        return matchesSearch && matchesLevel && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'level') {
          const weight = { Advanced: 3, Intermediate: 2, Beginner: 1 };
          return weight[b.level] - weight[a.level];
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [skills, searchQuery, selectedLevel, selectedCategory, sortBy]);

  const skillProjectCount = useMemo(() => {
    const map: Record<string, number> = {};
    projects.forEach((proj) => {
      proj.skills.forEach((s) => {
        map[s] = (map[s] || 0) + 1;
      });
    });
    return map;
  }, [projects]);

  const getProficiencyPercentage = (level: SkillLevel, months?: number): number => {
    if (level === 'Advanced') return Math.min(100, 85 + Math.min(months ? Math.round(months / 2) : 10, 15));
    if (level === 'Intermediate') return Math.min(80, 55 + Math.min(months ? Math.round(months / 2) : 10, 25));
    return Math.min(45, 25 + Math.min(months ? Math.round(months / 2) : 5, 20));
  };

  const levelBadgeStyles: Record<SkillLevel, string> = {
    Advanced: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    Intermediate: 'bg-slate-100 text-slate-700 border border-slate-200',
    Beginner: 'bg-slate-50 text-slate-600 border border-slate-200/60',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header matching exact prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Skills</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track the skills you're building and your current proficiency.
          </p>
        </div>

        <button
          onClick={openAddModal}
          id="add-skill-top-btn"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Skill</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="skill-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills or notes..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="All">All Categories</option>
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="recent">Recently Updated</option>
              <option value="level">Highest Proficiency</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active filter indication */}
        {(searchQuery || selectedLevel !== 'All' || selectedCategory !== 'All') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing {filteredSkills.length} of {skills.length} skills
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLevel('All');
                setSelectedCategory('All');
              }}
              className="text-indigo-600 hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <Layers className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            {skills.length === 0 ? 'No skills added yet' : 'No skills found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {skills.length === 0
              ? "Start by adding a skill you're currently learning."
              : 'No skills match your current search and filter criteria.'}
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add your first skill</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => {
            const projectCount = skillProjectCount[skill.name] || 0;
            const percent = getProficiencyPercentage(skill.level, skill.experienceMonths);

            return (
              <div
                key={skill.id}
                id={`skill-card-${skill.id}`}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                        {skill.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {skill.name}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        levelBadgeStyles[skill.level]
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>

                  {/* Clean horizontal progress indicator */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Proficiency</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {skill.notes && (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {skill.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    {skill.experienceMonths !== undefined && skill.experienceMonths > 0 && (
                      <span className="text-[11px] text-slate-400">
                        {skill.experienceMonths >= 12
                          ? `${(skill.experienceMonths / 12).toFixed(1)} yrs`
                          : `${skill.experienceMonths} mos`}
                      </span>
                    )}
                    {projectCount > 0 && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                        title={`Applied in ${projectCount} project(s)`}
                      >
                        <FolderGit2 className="w-3 h-3 text-slate-400" />
                        {projectCount} {projectCount === 1 ? 'project' : 'projects'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(skill)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                      title="Edit skill"
                      aria-label={`Edit ${skill.name}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSkillToDelete(skill)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete skill"
                      aria-label={`Delete ${skill.name}`}
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

      {/* Add / Edit Skill Modal */}
      {(isAddModalOpen || editingSkill) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingSkill ? 'Edit Skill' : 'Add Skill'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingSkill(null);
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
                  Skill Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  id="skill-name-input"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formError) setFormError('');
                  }}
                  placeholder="Enter skill name (e.g. SolidWorks, Python, ANSYS)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Proficiency Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value as SkillLevel })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Experience (Months)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.experienceMonths}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experienceMonths: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g. 12"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes & Key Competencies
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter key concepts or tools mastered..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingSkill(null);
                  }}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-skill-btn"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  {editingSkill ? 'Save Changes' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {skillToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete this skill?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong className="text-slate-800">"{skillToDelete.name}"</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSkillToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteSkill(skillToDelete.id);
                  setSkillToDelete(null);
                }}
                id="confirm-delete-skill-btn"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
