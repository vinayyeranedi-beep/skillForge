import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { SkillForgeLogo } from './SkillForgeLogo';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import {
  Wrench,
  LayoutDashboard,
  Layers,
  FolderGit2,
  Target,
  FileBadge2,
  Sparkles,
  HelpCircle,
  Menu,
  X,
  Plus,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  onQuickAdd: (type: 'skill' | 'project' | 'goal') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onQuickAdd }) => {
  const { activeTab, setActiveTab, profile, openAssistantWithPrompt } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'career-ai', label: 'Career Readiness' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'goals', label: 'Goals' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & Desktop Navigation */}
          <div className="flex items-center gap-8">
            {/* SkillForge Logo */}
            <button
              onClick={() => handleNavClick(activeTab === 'landing' ? 'dashboard' : 'landing')}
              id="brand-logo-btn"
              className="flex items-center text-left focus:outline-none group transition-transform duration-150 active:scale-[0.98]"
              title="SkillForge Home"
            >
              <SkillForgeLogo size="sm" />
            </button>

            {/* Desktop Navigation Links (quiet, restrained) */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-1.5 rounded-md text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-slate-100/90 text-slate-900 font-semibold shadow-[inset_0_1px_1px_rgba(15,23,42,0.04)]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Quick Add & Student Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ask Forge Assistant Trigger Button */}
            <button
              id="navbar-forge-assistant-btn"
              onClick={() => openAssistantWithPrompt()}
              className="btn-3d inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
              title="Ask Forge Assistant"
            >
              <Compass className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">Ask Forge</span>
            </button>

            {/* Quick Add Button */}
            <div className="relative">
              <button
                id="quick-add-btn"
                onClick={() => setQuickAddOpen(!quickAddOpen)}
                className="btn-3d inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                aria-expanded={quickAddOpen}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Add</span>
              </button>

              {quickAddOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setQuickAddOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200/90 py-1.5 z-30 animate-in fade-in surface-3d">
                    <button
                      onClick={() => {
                        setQuickAddOpen(false);
                        onQuickAdd('skill');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      Add Skill
                    </button>
                    <button
                      onClick={() => {
                        setQuickAddOpen(false);
                        onQuickAdd('project');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
                      Add Project
                    </button>
                    <button
                      onClick={() => {
                        setQuickAddOpen(false);
                        onQuickAdd('goal');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Target className="w-3.5 h-3.5 text-slate-500" />
                      Add Goal
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Student Profile Link or Sign In */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('portfolio')}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-slate-700 hover:bg-slate-100/80 transition-all text-xs font-medium border border-transparent hover:border-slate-200"
                  title="View your student profile"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] icon-container-3d">
                      {user.displayName ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
                    </div>
                  )}
                  <span className="hidden sm:inline font-medium text-slate-800 truncate max-w-[120px]">
                    {user.displayName?.split(' ')[0] || 'Student'}
                  </span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="btn-3d flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-all text-xs font-semibold border border-slate-200 shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign In
              </button>
            )}

            {/* Mobile menu toggle button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAssistantWithPrompt();
              }}
              className="w-full text-left px-3 py-2 rounded-md text-xs font-bold text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100/80 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Ask Forge Assistant</span>
            </button>
            <button
              onClick={() => handleNavClick('landing')}
              className="w-full text-left px-3 py-2 text-xs text-slate-500 hover:text-slate-900"
            >
              Product Overview (Landing Page)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
