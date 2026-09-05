import { pgTable, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  uid: text('uid').primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(), // typically the auth user id
  name: text('name').notNull(),
  headline: text('headline').notNull(),
  degree: text('degree').notNull(),
  department: text('department').notNull(),
  institution: text('institution').notNull(),
  graduationYear: text('graduation_year').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  location: text('location').notNull(),
  linkedin: text('linkedin').notNull(),
  github: text('github').notNull(),
  targetRole: text('target_role').notNull(),
  summary: text('summary').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const skills = pgTable('skills', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  level: text('level').notNull(), // 'Beginner' | 'Intermediate' | 'Advanced'
  experienceMonths: integer('experience_months'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  status: text('status').notNull(),
  skills: jsonb('skills').notNull().$type<string[]>(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  githubUrl: text('github_url'),
  demoUrl: text('demo_url'),
  highlights: jsonb('highlights').notNull().$type<string[]>(),
  role: text('role'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const goals = pgTable('goals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  targetDate: text('target_date').notNull(),
  completed: boolean('completed').default(false).notNull(),
  completedAt: text('completed_at'),
  priority: text('priority').notNull(), // 'High' | 'Medium' | 'Low'
  linkedSkill: text('linked_skill'),
  resources: text('resources'),
  progressPercentage: integer('progress_percentage').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const achievements = pgTable('achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  issuer: text('issuer').notNull(),
  date: text('date').notNull(),
  type: text('type').notNull(), // 'Certification' | 'Competition' | 'Publication' | 'Honor' | 'Workshop' | 'Internship' | 'Experience'
  credentialUrl: text('credential_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
