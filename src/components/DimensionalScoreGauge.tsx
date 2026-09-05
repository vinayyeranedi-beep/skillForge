import React from 'react';
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
  size = 140,
  strokeWidth = 11,
  className = '',
  showTicks = true,
}) => {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2 - 6; // Leave breathing room for outer bevel ring
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  // Arc stroke color themes based on status
  const themeGradients: Record<ReadinessStatus, { start: string; end: string; ringBg: string; text: string }> = {
    'Getting Started': {
      start: '#64748b',
      end: '#475569',
      ringBg: 'bg-slate-100',
      text: 'text-slate-700',
    },
    Developing: {
      start: '#f59e0b',
      end: '#d97706',
      ringBg: 'bg-amber-50',
      text: 'text-amber-700',
    },
    'On Track': {
      start: '#6366f1',
      end: '#4f46e5',
      ringBg: 'bg-indigo-50',
      text: 'text-indigo-700',
    },
    'Career Ready': {
      start: '#0d9488',
      end: '#0f766e',
      ringBg: 'bg-teal-50',
      text: 'text-teal-700',
    },
    'Highly Prepared': {
      start: '#10b981',
      end: '#059669',
      ringBg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
  };

  const theme = themeGradients[status] || themeGradients['On Track'];
  const gradientId = `gauge-gradient-${status.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={safeScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Career Readiness Score: ${safeScore}%, ${status}`}
    >
      {/* Outer Subtle Dimensional Bevel Disc */}
      <div
        className="absolute inset-0 rounded-full border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] bg-gradient-to-b from-white to-slate-50/70"
      />

      {/* SVG Radial Gauge */}
      <svg
        width={size}
        height={size}
        className="relative transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          {/* Dimensional arc stroke gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.start} />
            <stop offset="100%" stopColor={theme.end} />
          </linearGradient>

          {/* Inset shadow simulation filter */}
          <filter id="gauge-track-inset" x="-10%" y="-10%" width="120%" height="120%">
            <feOffset dx="0" dy="1" />
            <feGaussianBlur stdDeviation="1" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="#0f172a" floodOpacity="0.08" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Outer subtle guide ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2 + 1}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="1"
        />

        {/* Inset background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Active Dimensional Progress Arc */}
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
          className="transition-all duration-700 ease-out motion-reduce:transition-none"
        />

        {/* Optional decorative calibration ticks (10 tick notches around ring) */}
        {showTicks &&
          Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const innerR = radius - strokeWidth / 2 - 3;
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
                strokeWidth="1"
                opacity="0.8"
              />
            );
          })}
      </svg>

      {/* Center Readout (Inner Bevel Center) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        {/* Dimensional Inner Center Disc */}
        <div
          className="w-[72%] h-[72%] rounded-full bg-white flex flex-col items-center justify-center border border-slate-200/70 shadow-[0_1px_3px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,1)]"
        >
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none mb-0.5">
            Score
          </span>
          <div className="text-2xl font-black tracking-tight text-slate-900 leading-none">
            {safeScore}
            <span className="text-xs font-bold text-slate-400 ml-0.5">%</span>
          </div>
          <span
            className={`mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded leading-tight ${theme.text}`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};
