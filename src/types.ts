export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  experienceMonths?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'In Progress' | 'Completed' | 'Planned';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Academic' | 'Personal' | 'Capstone' | 'Hackathon' | 'Research' | 'Industry';
  status: ProjectStatus;
  skills: string[]; // Associated skills
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  demoUrl?: string;
  highlights: string[];
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export type GoalPriority = 'High' | 'Medium' | 'Low';

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  completedAt?: string;
  priority: GoalPriority;
  linkedSkill?: string;
  resources?: string;
  progressPercentage: number; // 0 to 100
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  type: 'Certification' | 'Competition' | 'Publication' | 'Honor' | 'Workshop';
  credentialUrl?: string;
}

export interface StudentProfile {
  name: string;
  headline: string;
  degree: string;
  department: string;
  institution: string;
  graduationYear: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  targetRole: string;
  summary: string;
}

export interface CareerRoleBenchmark {
  id: string;
  roleName: string;
  discipline: string;
  description: string;
  requiredSkills: {
    name: string;
    level: SkillLevel;
    importance: 'Core' | 'Recommended' | 'Bonus';
  }[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

export type ReadinessStatus =
  | 'Getting Started'
  | 'Developing'
  | 'On Track'
  | 'Career Ready'
  | 'Highly Prepared';

export type ActiveTab = 'landing' | 'dashboard' | 'skills' | 'projects' | 'goals' | 'portfolio' | 'career-ai' | 'about';
