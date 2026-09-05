import React from 'react';

export interface SkillForgeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'mono';
  showWordmark?: boolean;
  className?: string;
  id?: string;
}

/**
 * SkillForge Logo:
 * Visual Concept: Skills + Growth + Engineering + Career Development.
 * Geometric symbol combining a precision forge/anvil base with an upward ascending keystone & progress chevron.
 * Professional, minimal, scalable from 16px to 96px+, works on light and dark backgrounds.
 */
export const SkillForgeLogo: React.FC<SkillForgeLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showWordmark = true,
  className = '',
  id = 'skillforge-logo',
}) => {
  // Dimension mapping for mark
  const sizeMap = {
    xs: { mark: 20, text: 'text-sm', spacing: 'gap-1.5' },
    sm: { mark: 24, text: 'text-base', spacing: 'gap-2' },
    md: { mark: 32, text: 'text-lg', spacing: 'gap-2.5' },
    lg: { mark: 40, text: 'text-xl', spacing: 'gap-3' },
    xl: { mark: 52, text: 'text-2xl', spacing: 'gap-3.5' },
  };

  const { mark: dim, text: textSize, spacing } = sizeMap[size];

  // Palette handling: works on light, dark, and mono backgrounds
  const isLightOnDark = variant === 'light';

  return (
    <div
      id={id}
      className={`inline-flex items-center ${spacing} select-none ${className}`}
      aria-label="SkillForge Logo"
    >
      {/* Geometric Emblem: Forge Base + Ascending Progress Chevron */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-[1.03]"
      >
        <defs>
          {/* Subtle metallic/slate precision gradient for forge base */}
          <linearGradient id="sf-forge-base" x1="8" y1="40" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isLightOnDark ? '#334155' : '#1e293b'} />
            <stop offset="100%" stopColor={isLightOnDark ? '#475569' : '#0f172a'} />
          </linearGradient>

          {/* Indigo upward growth gradient */}
          <linearGradient id="sf-ascent-peak" x1="24" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          {/* Accent facet for dimensional depth */}
          <linearGradient id="sf-facet" x1="12" y1="18" x2="36" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4338ca" stopOpacity="0.95" />
          </linearGradient>

          {/* Subtle bevel drop shadow */}
          <filter id="sf-soft-shadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0f172a" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* 1. Forge/Anvil Base Foundation (Engineering Rigor) */}
        <path
          d="M8 38C8 36.8954 8.89543 36 10 36H38C39.1046 36 40 36.8954 40 38V40C40 41.1046 39.1046 42 38 42H10C8.89543 42 8 41.1046 8 40V38Z"
          fill="url(#sf-forge-base)"
        />

        {/* 2. Stepped Precision Pylons (Skills Step-Up) */}
        <path
          d="M13 36L15 28H33L35 36H13Z"
          fill={isLightOnDark ? '#475569' : '#334155'}
        />

        {/* 3. Ascending Geometric Apex Chevron (Growth & Progress Arrow) */}
        <g filter="url(#sf-soft-shadow)">
          <path
            d="M24 5L38 21H30V29H18V21H10L24 5Z"
            fill="url(#sf-ascent-peak)"
          />
        </g>

        {/* 4. Left Facet for Isometric Precision Craftsmanship */}
        <path
          d="M24 5L10 21H18V29L24 23V5Z"
          fill="url(#sf-facet)"
        />

        {/* 5. Center Forge Spark / Precision Core Keystone */}
        <rect
          x="21.5"
          y="18"
          width="5"
          height="5"
          transform="rotate(45 24 20.5)"
          fill="#ffffff"
          opacity="0.95"
        />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex items-baseline tracking-tight">
          <span
            className={`font-bold ${textSize} ${
              isLightOnDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Skill
          </span>
          <span className={`font-black ${textSize} text-indigo-600`}>
            Forge
          </span>
        </div>
      )}
    </div>
  );
};
