import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Skill,
  Project,
  LearningGoal,
  Achievement,
  StudentProfile,
  ToastMessage,
  ActiveTab,
  SkillLevel,
} from '../types';
import {
  getScoreInterpretation,
  ScoreInterpretationResult,
} from '../utils/scoreInterpretation';
import {
  INITIAL_PROFILE,
  INITIAL_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_GOALS,
  INITIAL_ACHIEVEMENTS,
} from '../data/sampleData';

interface AppContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Data state
  profile: StudentProfile;
  skills: Skill[];
  projects: Project[];
  goals: LearningGoal[];
  achievements: Achievement[];

  // Skill actions
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Goal actions
  addGoal: (goal: Omit<LearningGoal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, goal: Partial<LearningGoal>) => void;
  toggleGoalCompletion: (id: string) => void;
  deleteGoal: (id: string) => void;

  // Achievement actions
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  deleteAchievement: (id: string) => void;

  // Profile actions
  updateProfile: (profile: StudentProfile) => void;

  // System actions
  resetToSampleData: () => void;
  clearAllData: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;

  // Notifications
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Forge Assistant state
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  openAssistantWithPrompt: (prompt?: string) => void;
  initialAssistantPrompt: string;
  setInitialAssistantPrompt: (prompt: string) => void;

  // Computed metrics
  stats: {
    totalSkills: number;
    beginnerCount: number;
    intermediateCount: number;
    advancedCount: number;
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    totalGoals: number;
    completedGoals: number;
    activeGoals: number;
    readinessScore: number;
    scoreInterpretation: ScoreInterpretationResult;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'skillforge_profile_v1',
  SKILLS: 'skillforge_skills_v1',
  PROJECTS: 'skillforge_projects_v1',
  GOALS: 'skillforge_goals_v1',
  ACHIEVEMENTS: 'skillforge_achievements_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [initialAssistantPrompt, setInitialAssistantPrompt] = useState<string>('');

  const openAssistantWithPrompt = (prompt?: string) => {
    if (prompt) {
      setInitialAssistantPrompt(prompt);
    }
    setIsAssistantOpen(true);
  };

  // Initial state loaded with LocalStorage fallback
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
      return saved ? JSON.parse(saved) : INITIAL_SKILLS;
    } catch {
      return INITIAL_SKILLS;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [goals, setGoals] = useState<LearningGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  // Sync to LocalStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to LocalStorage', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
    } catch (e) {
      console.error('Failed to save skills to LocalStorage', e);
    }
  }, [skills]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to LocalStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error('Failed to save goals to LocalStorage', e);
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.error('Failed to save achievements to LocalStorage', e);
    }
  }, [achievements]);

  // Toast handler
  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Skill CRUD
  const addSkill = (newSkillData: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSkill: Skill = {
      ...newSkillData,
      id: 'skill-' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    setSkills((prev) => [newSkill, ...prev]);
    showToast({
      type: 'success',
      title: 'Skill Added',
      message: `"${newSkill.name}" (${newSkill.level}) has been added to your inventory.`,
    });
  };

  const updateSkill = (id: string, updatedFields: Partial<Skill>) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, ...updatedFields, updatedAt: new Date().toISOString() }
          : s
      )
    );
    showToast({
      type: 'info',
      title: 'Skill Updated',
      message: 'Changes saved successfully.',
    });
  };

  const deleteSkill = (id: string) => {
    const skillToDelete = skills.find((s) => s.id === id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
    showToast({
      type: 'warning',
      title: 'Skill Removed',
      message: skillToDelete ? `"${skillToDelete.name}" was removed.` : 'Skill removed.',
    });
  };

  // Project CRUD
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      id: 'proj-' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    setProjects((prev) => [newProject, ...prev]);
    showToast({
      type: 'success',
      title: 'Project Added',
      message: `"${newProject.title}" has been recorded.`,
    });
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updatedFields, updatedAt: new Date().toISOString() }
          : p
      )
    );
    showToast({
      type: 'info',
      title: 'Project Updated',
      message: 'Project details have been updated.',
    });
  };

  const deleteProject = (id: string) => {
    const projToDelete = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast({
      type: 'warning',
      title: 'Project Removed',
      message: projToDelete ? `"${projToDelete.title}" was deleted.` : 'Project deleted.',
    });
  };

  // Goals CRUD
  const addGoal = (goalData: Omit<LearningGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newGoal: LearningGoal = {
      ...goalData,
      id: 'goal-' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    setGoals((prev) => [newGoal, ...prev]);
    showToast({
      type: 'success',
      title: 'Goal Created',
      message: `Target set for "${newGoal.title}".`,
    });
  };

  const updateGoal = (id: string, updatedFields: Partial<LearningGoal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const isMarkingComplete = updatedFields.completed === true && !g.completed;
          return {
            ...g,
            ...updatedFields,
            completedAt: isMarkingComplete ? new Date().toISOString() : (updatedFields.completed === false ? undefined : g.completedAt),
            progressPercentage: updatedFields.completed ? 100 : (updatedFields.progressPercentage ?? g.progressPercentage),
            updatedAt: new Date().toISOString(),
          };
        }
        return g;
      })
    );
    showToast({
      type: 'info',
      title: 'Goal Updated',
      message: 'Learning goal updated.',
    });
  };

  const toggleGoalCompletion = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newCompleted = !g.completed;
          return {
            ...g,
            completed: newCompleted,
            progressPercentage: newCompleted ? 100 : Math.min(g.progressPercentage, 75),
            completedAt: newCompleted ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return g;
      })
    );
    const target = goals.find((g) => g.id === id);
    if (target && !target.completed) {
      showToast({
        type: 'success',
        title: 'Goal Completed! 🎉',
        message: `Great job completing "${target.title}"!`,
      });
    } else {
      showToast({
        type: 'info',
        title: 'Goal Re-opened',
        message: 'Goal marked as in progress.',
      });
    }
  };

  const deleteGoal = (id: string) => {
    const goalToDelete = goals.find((g) => g.id === id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast({
      type: 'warning',
      title: 'Goal Removed',
      message: goalToDelete ? `"${goalToDelete.title}" removed.` : 'Goal removed.',
    });
  };

  // Achievements
  const addAchievement = (achData: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = {
      ...achData,
      id: 'ach-' + Date.now(),
    };
    setAchievements((prev) => [newAch, ...prev]);
    showToast({
      type: 'success',
      title: 'Achievement Added',
      message: `"${newAch.title}" recorded.`,
    });
  };

  const deleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    showToast({
      type: 'info',
      title: 'Achievement Removed',
      message: 'Achievement record removed.',
    });
  };

  // Profile
  const updateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your student portfolio profile has been saved.',
    });
  };

  // Data reset & export
  const resetToSampleData = () => {
    setProfile(INITIAL_PROFILE);
    setSkills(INITIAL_SKILLS);
    setProjects(INITIAL_PROJECTS);
    setGoals(INITIAL_GOALS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(INITIAL_SKILLS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
    showToast({
      type: 'info',
      title: 'Sample Data Restored',
      message: 'Loaded realistic engineering sample data successfully.',
    });
  };

  const clearAllData = () => {
    setSkills([]);
    setProjects([]);
    setGoals([]);
    setAchievements([]);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    showToast({
      type: 'warning',
      title: 'Data Cleared',
      message: 'All custom skills, projects, and goals have been wiped.',
    });
  };

  const exportDataJSON = () => {
    const fullBackup = {
      app: 'SkillForge',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      skills,
      projects,
      goals,
      achievements,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SkillForge_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast({
      type: 'success',
      title: 'Export Complete',
      message: 'JSON backup file downloaded to your device.',
    });
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) setProfile(parsed.profile);
      if (Array.isArray(parsed.skills)) setSkills(parsed.skills);
      if (Array.isArray(parsed.projects)) setProjects(parsed.projects);
      if (Array.isArray(parsed.goals)) setGoals(parsed.goals);
      if (Array.isArray(parsed.achievements)) setAchievements(parsed.achievements);
      showToast({
        type: 'success',
        title: 'Import Successful',
        message: 'Loaded custom backup data into SkillForge.',
      });
      return true;
    } catch (e) {
      console.error('Import failed', e);
      showToast({
        type: 'error',
        title: 'Import Failed',
        message: 'Invalid JSON file format. Please check file structure.',
      });
      return false;
    }
  };

  // Metrics computation
  const totalSkills = skills.length;
  const beginnerCount = skills.filter((s) => s.level === 'Beginner').length;
  const intermediateCount = skills.filter((s) => s.level === 'Intermediate').length;
  const advancedCount = skills.filter((s) => s.level === 'Advanced').length;

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;
  const inProgressProjects = projects.filter((p) => p.status === 'In Progress').length;

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.completed).length;
  const activeGoals = totalGoals - completedGoals;

  // Composite Placement Readiness Score (0 - 100%)
  // Factors:
  // - Skills volume & depth (up to 40 pts)
  // - Projects quality & completion (up to 35 pts)
  // - Goals completion (up to 25 pts)
  const skillScore = Math.min(
    40,
    Math.round((beginnerCount * 1.5 + intermediateCount * 3 + advancedCount * 4.5))
  );
  const projectScore = Math.min(
    35,
    Math.round(completedProjects * 10 + inProgressProjects * 5)
  );
  const goalScore = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 25) : 0;
  const readinessScore = Math.min(100, Math.max(0, skillScore + projectScore + goalScore));

  const scoreInterpretation = getScoreInterpretation(readinessScore, {
    totalSkills,
    beginnerCount,
    intermediateCount,
    advancedCount,
    totalProjects,
    completedProjects,
    inProgressProjects,
    totalGoals,
    completedGoals,
    activeGoals,
    targetRole: profile.targetRole || 'Engineering Career Role',
  });

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        skills,
        projects,
        goals,
        achievements,
        addSkill,
        updateSkill,
        deleteSkill,
        addProject,
        updateProject,
        deleteProject,
        addGoal,
        updateGoal,
        toggleGoalCompletion,
        deleteGoal,
        addAchievement,
        deleteAchievement,
        updateProfile,
        resetToSampleData,
        clearAllData,
        exportDataJSON,
        importDataJSON,
        toasts,
        showToast,
        removeToast,
        isAssistantOpen,
        setIsAssistantOpen,
        openAssistantWithPrompt,
        initialAssistantPrompt,
        setInitialAssistantPrompt,
        stats: {
          totalSkills,
          beginnerCount,
          intermediateCount,
          advancedCount,
          totalProjects,
          completedProjects,
          inProgressProjects,
          totalGoals,
          completedGoals,
          activeGoals,
          readinessScore,
          scoreInterpretation,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
