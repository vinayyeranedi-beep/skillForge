import React from 'react';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { SkillForgeLogo } from './SkillForgeLogo';
import {
  Code2,
  FolderGit2,
  Target,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export interface HeroVisual3DProps {
  onExploreClick?: () => void;
  className?: string;
}

/**
 * HeroVisual3D:
 * Represents the 4-phase engineering cycle: Learn → Build → Improve → Career Ready.
 * Central floating SkillForge emblem surrounded by 5 dimensional physical nodes:
 * Skills, Projects, Goals, Progress, and Career.
 * Smooth organic floating movement with desktop mouse parallax and layered isometric perspective.
 */
export const HeroVisual3D: React.FC<HeroVisual3DProps> = ({
  className = '',
}) => {
  const parallax = useMouseParallax(12);

  return (
    <div
      id="hero-3d-stage"
      className={`relative w-full max-w-xl mx-auto h-[400px] sm:h-[460px] flex items-center justify-center select-none perspective-1000 ${className}`}
      aria-label="SkillForge 3D Career Progression Visual"
    >
      {/* Background Dimensional Ambient Light & Depth Rings */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * -0.3}px, ${parallax.y * -0.3}px, 0px)`,
        }}
      >
        {/* Soft Radial Gradient Glow */}
        <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-indigo-100/60 via-indigo-50/40 to-transparent blur-3xl" />
        
        {/* Concentric Precision Orbital Rings */}
        <div className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full border border-dashed border-indigo-200/50" />
        <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-slate-200/60" />
      </div>

      {/* 3D Isometric Staging Ground Plane (Subtle Physical Platform) */}
      <div
        className="absolute w-64 h-32 sm:w-80 sm:h-40 bottom-12 rounded-full bg-gradient-to-b from-indigo-50/70 to-slate-100/30 border border-slate-200/60 shadow-lg pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(65deg) translate3d(${parallax.x * 0.15}px, ${parallax.y * 0.15}px, -20px)`,
          filter: 'drop-shadow(0 15px 25px rgba(99, 102, 241, 0.08))',
        }}
      />

      {/* Central Core: Floating SkillForge Keystone */}
      <div
        id="hero-central-emblem"
        className="relative z-20 flex flex-col items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `translate3d(${parallax.x * 0.4}px, ${parallax.y * 0.4}px, 30px)`,
        }}
      >
        {/* Multi-layered Floating Base Disc */}
        <div className="relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xl surface-3d animate-float-slow flex flex-col items-center">
          {/* Subtle top bevel specular light */}
          <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent rounded-full" />
          
          <SkillForgeLogo size="lg" showWordmark={false} />
          
          <div className="mt-3 text-center">
            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-slate-800">
              SkillForge Core
            </span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-slate-500">Placement Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Floating Object: SKILLS (Top Left) */}
      <div
        id="hero-node-skills"
        className="absolute top-6 sm:top-10 left-2 sm:left-6 z-30 transition-transform duration-300 ease-out animate-float-medium"
        style={{
          transform: `translate3d(${parallax.x * 0.8}px, ${parallax.y * 0.8}px, 40px)`,
        }}
      >
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xl surface-3d flex items-center gap-2.5 hover:border-indigo-300 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Phase 1: Learn</div>
            <div className="text-xs font-black text-slate-900">Skills Matrix</div>
            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <span className="text-emerald-600 font-bold">24+</span> Verified Skills
            </div>
          </div>
        </div>
      </div>

      {/* 2. Floating Object: PROJECTS (Top Right) */}
      <div
        id="hero-node-projects"
        className="absolute top-10 sm:top-14 right-2 sm:right-6 z-30 transition-transform duration-300 ease-out animate-float-reverse"
        style={{
          transform: `translate3d(${parallax.x * 0.65}px, ${parallax.y * 0.65}px, 35px)`,
        }}
      >
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xl surface-3d flex items-center gap-2.5 hover:border-blue-300 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Phase 2: Build</div>
            <div className="text-xs font-black text-slate-900">Capstone Proofs</div>
            <div className="text-[10px] text-slate-500 font-medium">100% Live Repos</div>
          </div>
        </div>
      </div>

      {/* 3. Floating Object: GOALS (Bottom Left) */}
      <div
        id="hero-node-goals"
        className="absolute bottom-16 sm:bottom-20 left-4 sm:left-8 z-30 transition-transform duration-300 ease-out animate-float-slow"
        style={{
          transform: `translate3d(${parallax.x * 0.75}px, ${parallax.y * 0.75}px, 45px)`,
        }}
      >
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xl surface-3d flex items-center gap-2.5 hover:border-amber-300 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Phase 3: Improve</div>
            <div className="text-xs font-black text-slate-900">Active Milestones</div>
            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Target Dated
            </div>
          </div>
        </div>
      </div>

      {/* 4. Floating Object: CAREER READY (Bottom Right - Focal Peak) */}
      <div
        id="hero-node-career"
        className="absolute bottom-14 sm:bottom-16 right-3 sm:right-8 z-30 transition-transform duration-300 ease-out animate-float-gentle"
        style={{
          transform: `translate3d(${parallax.x * 0.9}px, ${parallax.y * 0.9}px, 50px)`,
        }}
      >
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white border border-indigo-800/80 shadow-2xl surface-3d flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Phase 4: Ready</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>78% Placement Ready</span>
            </div>
            <div className="text-[10px] text-indigo-200/80 font-medium">Industry Benchmark</div>
          </div>
        </div>
      </div>

      {/* 5. Floating Object: PROGRESS VELOCITY BADGE (Center Top) */}
      <div
        id="hero-node-progress"
        className="absolute top-2 sm:top-4 z-10 transition-transform duration-300 ease-out animate-float-medium"
        style={{
          transform: `translate3d(${parallax.x * 0.5}px, ${parallax.y * 0.5}px, 25px)`,
        }}
      >
        <div className="px-3 py-1.5 rounded-full bg-slate-900/90 text-white backdrop-blur-md border border-slate-700 shadow-md flex items-center gap-2 text-[11px] font-bold">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Velocity: Active Momentum</span>
        </div>
      </div>
    </div>
  );
};
