export type ReadinessStatus =
  | 'Getting Started'
  | 'Developing'
  | 'On Track'
  | 'Career Ready'
  | 'Highly Prepared';

export interface ScoreRangeDefinition {
  min: number;
  max: number;
  rangeText: string;
  status: ReadinessStatus;
  description: string;
}

export const SCORE_INTERPRETATION_RANGES: readonly ScoreRangeDefinition[] = [
  {
    min: 0,
    max: 39,
    rangeText: '0–39%',
    status: 'Getting Started',
    description:
      'The student is at an early stage and needs to build foundational skills and complete relevant projects.',
  },
  {
    min: 40,
    max: 59,
    rangeText: '40–59%',
    status: 'Developing',
    description:
      'The student has some relevant skills but still has significant gaps to address.',
  },
  {
    min: 60,
    max: 74,
    rangeText: '60–74%',
    status: 'On Track',
    description:
      'The student has a good foundation and is progressing toward the selected career role, but should strengthen specific skill gaps.',
  },
  {
    min: 75,
    max: 89,
    rangeText: '75–89%',
    status: 'Career Ready',
    description:
      'The student has strong relevant skills and projects and is reasonably prepared for internships or entry-level opportunities.',
  },
  {
    min: 90,
    max: 100,
    rangeText: '90–100%',
    status: 'Highly Prepared',
    description:
      'The student demonstrates strong skills, relevant projects, and consistent learning progress for the selected role.',
  },
] as const;

export interface ScoreContext {
  totalSkills?: number;
  beginnerCount?: number;
  intermediateCount?: number;
  advancedCount?: number;
  totalProjects?: number;
  completedProjects?: number;
  inProgressProjects?: number;
  totalGoals?: number;
  completedGoals?: number;
  activeGoals?: number;
  targetRole?: string;
}

export interface ScoreInterpretationResult {
  score: number;
  status: ReadinessStatus;
  displayLabel: string; // e.g. "72% — On Track"
  rangeText: string;
  description: string;
  whyExplanation: string;
  whatToDoNext: string;
  disclaimer: string;
  theme: {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    ringColor: string;
    barColor: string;
    accentColor: string;
  };
}

export function getScoreInterpretation(
  scoreInput: number,
  context: ScoreContext = {}
): ScoreInterpretationResult {
  const score = Math.max(0, Math.min(100, Math.round(scoreInput)));

  let matched = SCORE_INTERPRETATION_RANGES[0];
  for (const r of SCORE_INTERPRETATION_RANGES) {
    if (score >= r.min && score <= r.max) {
      matched = r;
      break;
    }
  }

  const {
    totalSkills = 0,
    intermediateCount = 0,
    advancedCount = 0,
    totalProjects = 0,
    completedProjects = 0,
    inProgressProjects = 0,
    totalGoals = 0,
    completedGoals = 0,
    targetRole = 'Engineering Role',
  } = context;

  const skilledCount = intermediateCount + advancedCount;

  let whyExplanation = '';
  let whatToDoNext = '';

  switch (matched.status) {
    case 'Getting Started':
      whyExplanation =
        totalSkills === 0 && totalProjects === 0
          ? `Your profile is new with no technical skills or projects recorded yet. Your current score reflects an early beginning with foundational competencies yet to be documented.`
          : `You currently have ${totalSkills} recorded skill${totalSkills === 1 ? '' : 's'} and ${completedProjects} completed project${completedProjects === 1 ? '' : 's'}. You are in the introductory phase with foundational technical proficiencies and portfolio proof still developing.`;
      whatToDoNext =
        'Log 3 to 5 core technical skills, start documenting an academic or coursework project, and set at least two clear learning milestones.';
      break;

    case 'Developing':
      whyExplanation = `You have documented ${totalSkills} skill${totalSkills === 1 ? '' : 's'} (${skilledCount} at intermediate or above) and ${totalProjects} project${totalProjects === 1 ? '' : 's'} (${completedProjects} completed). While initial competencies are in place, significant technical depth and project evidence are still needed for ${targetRole}.`;
      whatToDoNext =
        'Advance beginner skills into intermediate through lab practice, complete in-progress projects with measurable outcomes, and link target goals to core domain tools.';
      break;

    case 'On Track':
      whyExplanation = `You demonstrate a solid engineering base with ${totalSkills} documented skills (${skilledCount} intermediate/advanced) and ${completedProjects} completed project${completedProjects === 1 ? '' : 's'}${inProgressProjects > 0 ? ` plus ${inProgressProjects} in progress` : ''}. You are steadily progressing toward your target role of ${targetRole}, with specific skill gaps remaining to reach peak readiness.`;
      whatToDoNext =
        'Strengthen specific gap areas into advanced proficiency, finish your active projects with clean GitHub/demo documentation, and complete your scheduled learning goals.';
      break;

    case 'Career Ready':
      whyExplanation = `You have built a strong, well-balanced portfolio featuring ${totalSkills} verified skills (${advancedCount} advanced), ${completedProjects} completed engineering projects, and ${completedGoals} achieved learning milestones. You are reasonably prepared for campus placements, technical internships, and entry-level engineering opportunities.`;
      whatToDoNext =
        'Polish your project highlights and metrics for technical interviews, finalize remaining goals, and start applying to target internships or entry-level roles.';
      break;

    case 'Highly Prepared':
      whyExplanation = `You demonstrate thorough technical mastery across ${totalSkills} engineering skills (${advancedCount} advanced), ${completedProjects} completed high-impact projects, and consistent learning goal execution. Your profile exhibits industry-standard rigor for ${targetRole}.`;
      whatToDoNext =
        'Maintain continuous learning momentum, contribute to open-source or advanced capstone engineering, and actively schedule campus placement interviews.';
      break;
  }

  // Visual themes matching clean, anti-slop Tailwind palettes
  const themes: Record<ReadinessStatus, ScoreInterpretationResult['theme']> = {
    'Getting Started': {
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-800',
      badgeBorder: 'border-slate-300',
      ringColor: 'ring-slate-400',
      barColor: 'bg-slate-500',
      accentColor: 'text-slate-700',
    },
    Developing: {
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-200',
      ringColor: 'ring-amber-400',
      barColor: 'bg-amber-500',
      accentColor: 'text-amber-700',
    },
    'On Track': {
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-800',
      badgeBorder: 'border-indigo-200',
      ringColor: 'ring-indigo-500',
      barColor: 'bg-indigo-600',
      accentColor: 'text-indigo-700',
    },
    'Career Ready': {
      badgeBg: 'bg-teal-50',
      badgeText: 'text-teal-800',
      badgeBorder: 'border-teal-200',
      ringColor: 'ring-teal-500',
      barColor: 'bg-teal-600',
      accentColor: 'text-teal-700',
    },
    'Highly Prepared': {
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-200',
      ringColor: 'ring-emerald-500',
      barColor: 'bg-emerald-600',
      accentColor: 'text-emerald-700',
    },
  };

  const displayLabel = `${score}% — ${matched.status}`;
  const disclaimer =
    "This is an MVP career-readiness estimate based on the student's SkillForge profile, not a guaranteed prediction of employment or hiring success.";

  return {
    score,
    status: matched.status,
    displayLabel,
    rangeText: matched.rangeText,
    description: matched.description,
    whyExplanation,
    whatToDoNext,
    disclaimer,
    theme: themes[matched.status],
  };
}
