import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus } from '../types';
import {
  FolderGit2,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';

interface ProjectsViewProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { projects, skills, addProject, updateProject, deleteProject } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: Project['category'];
    status: ProjectStatus;
    skills: string[];
    startDate: string;
    endDate: string;
    githubUrl: string;
    demoUrl: string;
    role: string;
  }>({
    title: '',
    description: '',
    category: 'Academic',
    status: 'In Progress',
    skills: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    githubUrl: '',
    demoUrl: '',
    role: 'Lead Engineer',
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: 'Academic',
      status: 'In Progress',
      skills: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      githubUrl: '',
      demoUrl: '',
      role: 'Lead Engineer',
    });
    setFormError('');
    setCustomSkillInput('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status,
      skills: [...project.skills],
      startDate: project.startDate,
      endDate: project.endDate || '',
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      role: project.role || '',
    });
    setFormError('');
    setCustomSkillInput('');
  };

  const handleToggleSkillSelection = (skillName: string) => {
    if (formData.skills.includes(skillName)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((s) => s !== skillName),
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillName],
      });
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, trimmed],
      });
      setCustomSkillInput('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Please enter a project title.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Please provide a brief description.');
      return;
    }

    if (editingProject) {
      updateProject(editingProject.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        status: formData.status,
        skills: formData.skills,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        githubUrl: formData.githubUrl.trim() || undefined,
        demoUrl: formData.demoUrl.trim() || undefined,
        role: formData.role.trim() || undefined,
      });
      setEditingProject(null);
    } else {
      addProject({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        status: formData.status,
        skills: formData.skills,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        githubUrl: formData.githubUrl.trim() || undefined,
        demoUrl: formData.demoUrl.trim() || undefined,
        role: formData.role.trim() || undefined,
        highlights: [],
      });
      setIsAddModalOpen(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === 'All' || project.status === selectedStatus;
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [projects, searchQuery, selectedStatus, selectedCategory]);

  const statusBadgeStyles: Record<ProjectStatus, string> = {
    Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    'In Progress': 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    Planned: 'bg-slate-100 text-slate-600 border border-slate-200',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header matching exact prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">
            Showcase practical work, coursework, and technical builds.
          </p>
        </div>

        <button
          onClick={openAddModal}
          id="add-project-top-btn"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Project</span>
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
              id="project-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or skills used..."
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

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            {['All', 'Completed', 'In Progress', 'Planned'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Personal">Personal</option>
              <option value="Internship">Internship</option>
              <option value="Hackathon">Hackathon</option>
            </select>
          </div>
        </div>

        {(searchQuery || selectedStatus !== 'All' || selectedCategory !== 'All') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
                setSelectedCategory('All');
              }}
              className="text-indigo-600 hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Projects Cards Display */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <FolderGit2 className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            {projects.length === 0 ? 'No projects added yet' : 'No projects found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {projects.length === 0
              ? 'Start showcasing your engineering coursework, capstones, and builds.'
              : 'No projects match your current search and filter criteria.'}
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add your first project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                      {project.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {project.title}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                      statusBadgeStyles[project.status]
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {project.description}
                </p>

                {/* Skills Used (Chips) */}
                {project.skills.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                      Skills Used:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Date, Edit, Delete */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {project.endDate
                      ? `Completed: ${project.endDate}`
                      : `Started: ${project.startDate}`}
                  </span>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 text-slate-500 hover:text-indigo-600 font-medium inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                    title="Edit project"
                    aria-label={`Edit ${project.title}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setProjectToDelete(project)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete project"
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {(isAddModalOpen || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProject(null);
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
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (formError) setFormError('');
                  }}
                  placeholder="e.g. Automated Robotic Gripper"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (formError) setFormError('');
                  }}
                  placeholder="Explain what was built, objectives, and practical engineering results..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Personal">Personal</option>
                    <option value="Internship">Internship</option>
                    <option value="Hackathon">Hackathon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as ProjectStatus })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date (or Expected)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              {/* Skills Used Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skills Used (select or add)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {skills.map((s) => {
                    const isSelected = formData.skills.includes(s.name);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleToggleSkillSelection(s.name)}
                        className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {s.name}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={handleAddCustomSkill}
                    placeholder="Type other skill and press enter..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="save-project-btn"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  {editingProject ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Delete this project?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong className="text-slate-800">"{projectToDelete.title}"</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                }}
                id="confirm-delete-project-btn"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
