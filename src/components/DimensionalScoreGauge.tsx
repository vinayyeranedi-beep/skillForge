import React, { useState } from 'react';
import { ReadinessStatus } from '../types';

interface DimensionalScoreGaugeProps {
  score: number;
  status: ReadinessStatus;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showTicks?: boolean;
}

export const DimensionalScoreGauge: React.FC<DimensionalScoreGaugeProps> = ({
  score,
  status,
  size = 156,
  strokeWidth = 12,
  className = '',
  showTicks = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2 - 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  // Arc stroke color themes based on status
  const themeGradients: Record<ReadinessStatus, { start: string; mid: string; end: string; badgeBg: string; text: string; glow: string }> = {
    'Getting Started': {
      start: '#64748b',
      mid: '#475569',
      end: '#334155',
      badgeBg: 'bg-slate-100 border-slate-200 text-slate-700',
      text: 'text-slate-700',
      glow: 'rgba(100, 116, 139, 0.15)',
    },
    Developing: {
      start: '#fbbf24',
      mid: '#f59e0b',
      end: '#d97706',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
      text: 'text-amber-700',
      glow: 'rgba(245, 158, 11, 0.18)',
    },
    'On Track': {
      start: '#818cf8',
      mid: '#6366f1',
      end: '#4f46e5',
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      text: 'text-indigo-700',
      glow: 'rgba(99, 102, 241, 0.18)',
    },
    'Career Ready': {
      start: '#2dd4bf',
      mid: '#0d9488',
      end: '#0f766e',
      badgeBg: 'bg-teal-50 border-teal-200 text-teal-800',
      text: 'text-teal-700',
      glow: 'rgba(13, 148, 136, 0.18)',
    },
    'Highly Prepared': {
      start: '#34d399',
      mid: '#10b981',
      end: '#059669',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      text: 'text-emerald-700',
      glow: 'rgba(16, 185, 129, 0.18)',
    },
  };

  const theme = themeGradients[status] || themeGradients['On Track'];
  const gradientId = `sf-gauge-grad-${status.replace(/\s+/g, '-').toLowerCase()}`;
  const trackShadowId = `sf-gauge-inset-${size}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none group transition-transform duration-300 ease-out ${className}`}
      style={{
        width: size,
        height: size,
        transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0px) scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="meter"
      aria-valuenow={safeScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Career Readiness Score: ${safeScore}%, ${status}`}
    >
      {/* 1. Outer Elevated Base Disc with 3D Bevel Rim */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-100/90 border border-slate-200/90 transition-shadow duration-300"
        style={{
          boxShadow: isHovered
            ? `0 12px 28px -4px rgba(15, 23, 42, 0.1), 0 4px 12px ${theme.glow}, inset 0 1px 1px rgba(255, 255, 255, 1)`
            : '0 6px 18px -2px rgba(15, 23, 42, 0.07), inset 0 1.5px 0 rgba(255, 255, 255, 0.95)',
        }}
      />

      {/* 2. SVG Radial Gauge Track & Dimensional Arc */}
      <svg
        width={size}
        height={size}
        className="relative transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          {/* Multi-stop dimensional gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.start} />
            <stop offset="50%" stopColor={theme.mid} />
            <stop offset="100%" stopColor={theme.end} />
          </linearGradient>

          {/* Deep Inset Shadow Filter */}
          <filter id={trackShadowId} x="-15%" y="-15%" width="130%" height="130%">
            <feOffset dx="0" dy="1.5" />
            <feGaussianBlur stdDeviation="1.5" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="#0f172a" floodOpacity="0.12" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Outer Precision Calibration Guideline */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2 + 1.5}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="1"
        />

        {/* Deep Recessed Inset Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={`url(#${trackShadowId})`}
        />

        {/* Active 3D Dimensional Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) motion-reduce:transition-none"
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(15, 23, 42, 0.15))',
          }}
        />

        {/* Calibration Ticks (12 geometric notches representing progression steps) */}
        {showTicks &&
          Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const innerR = radius - strokeWidth / 2 - 3.5;
            const outerR = radius - strokeWidth / 2 - 1;
            const x1 = size / 2 + innerR * Math.cos(angle);
            const y1 = size / 2 + innerR * Math.sin(angle);
            const x2 = size / 2 + outerR * Math.cos(angle);
            const y2 = size / 2 + outerR * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#cbd5e1"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity={i % 3 === 0 ? '0.9' : '0.45'}
              />
            );
          })}
      </svg>

      {/* 3. Floating Embossed Center Core Disc */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2.5 pointer-events-none">
        <div
          className="w-[70%] h-[70%] rounded-full bg-white flex flex-col items-center justify-center border border-slate-200/80 gauge-core-3d transition-transform duration-300"
          style={{
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          {/* Subtle Top Specular Rim */}
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-full mb-0.5" />

          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black leading-none mb-0.5">
            Readiness
          </span>

          <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-none">
            {safeScore}
            <span className="text-xs font-bold text-slate-400 ml-0.5">%</span>
          </div>

          <span
            className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs leading-tight ${theme.badgeBg}`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

