import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { DashboardView } from './components/DashboardView';
import { SkillsView } from './components/SkillsView';
import { ProjectsView } from './components/ProjectsView';
import { GoalsView } from './components/GoalsView';
import { PortfolioView } from './components/PortfolioView';
import { CareerAIView } from './components/CareerAIView';
import { AboutView } from './components/AboutView';
import { LandingView } from './components/LandingView';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  // State to trigger modals from anywhere (Navbar quick add or dashboard quick actions)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const handleQuickAdd = (type: 'skill' | 'project' | 'goal') => {
    if (type === 'skill') {
      setActiveTab('skills');
      setIsSkillModalOpen(true);
    } else if (type === 'project') {
      setActiveTab('projects');
      setIsProjectModalOpen(true);
    } else if (type === 'goal') {
      setActiveTab('goals');
      setIsGoalModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar onQuickAdd={handleQuickAdd} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'landing' && <LandingView />}

        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenAddSkill={() => handleQuickAdd('skill')}
            onOpenAddProject={() => handleQuickAdd('project')}
            onOpenAddGoal={() => handleQuickAdd('goal')}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsView
            isAddModalOpen={isSkillModalOpen}
            setIsAddModalOpen={setIsSkillModalOpen}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            isAddModalOpen={isProjectModalOpen}
            setIsAddModalOpen={setIsProjectModalOpen}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView
            isAddModalOpen={isGoalModalOpen}
            setIsAddModalOpen={setIsGoalModalOpen}
          />
        )}

        {activeTab === 'portfolio' && <PortfolioView />}

        {activeTab === 'career-ai' && <CareerAIView />}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Global Notifications */}
      <ToastContainer />

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SkillForge</span>
            <span>— Engineering Student Skills & Placement Portfolio MVP</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setActiveTab('landing')}
              className="hover:text-indigo-600 transition-colors"
            >
              Product Overview
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('skills')}
              className="hover:text-indigo-600 transition-colors"
            >
              Skills
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('portfolio')}
              className="hover:text-indigo-600 transition-colors"
            >
              Portfolio
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
