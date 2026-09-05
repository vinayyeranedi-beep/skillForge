import {
  StudentProfile,
  Skill,
  Project,
  LearningGoal,
  CareerRoleBenchmark,
  AssistantActionItem,
  GoalPriority,
} from '../types';
import { CAREER_BENCHMARKS } from '../data/sampleData';

export interface StudentContextData {
  profile: StudentProfile;
  skills: Skill[];
  projects: Project[];
  goals: LearningGoal[];
  stats: {
    readinessScore: number;
    scoreInterpretation: {
      score: number;
      status: string;
      displayLabel: string;
      rangeText: string;
      description: string;
    };
    totalSkills: number;
    totalProjects: number;
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
  };
}

interface SkillEvaluation {
  name: string;
  requiredLevel: string;
  currentLevel?: string;
  importance: 'Core' | 'Recommended' | 'Bonus';
  status: 'missing' | 'upgrade_needed' | 'qualified';
}

export function evaluateStudentProfile(context: StudentContextData) {
  const { profile, skills, goals } = context;

  // Find benchmark for student's target role or fallback to first
  const benchmark: CareerRoleBenchmark =
    CAREER_BENCHMARKS.find(
      (b) =>
        b.roleName.toLowerCase() === (profile.targetRole || '').toLowerCase()
    ) || CAREER_BENCHMARKS[0];

  const skillMap = new Map(skills.map((s) => [s.name.toLowerCase().trim(), s]));

  const levelRank: Record<string, number> = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
  };

  const evaluated: SkillEvaluation[] = benchmark.requiredSkills.map((req) => {
    const userSkill = skillMap.get(req.name.toLowerCase().trim());
    if (!userSkill) {
      return {
        name: req.name,
        requiredLevel: req.level,
        importance: req.importance,
        status: 'missing',
      };
    }

    const userRank = levelRank[userSkill.level] || 1;
    const reqRank = levelRank[req.level] || 1;

    if (userRank >= reqRank) {
      return {
        name: req.name,
        requiredLevel: req.level,
        currentLevel: userSkill.level,
        importance: req.importance,
        status: 'qualified',
      };
    } else {
      return {
        name: req.name,
        requiredLevel: req.level,
        currentLevel: userSkill.level,
        importance: req.importance,
        status: 'upgrade_needed',
      };
    }
  });

  const coreGaps = evaluated.filter(
    (e) => e.importance === 'Core' && e.status !== 'qualified'
  );
  const recommendedGaps = evaluated.filter(
    (e) => e.importance === 'Recommended' && e.status !== 'qualified'
  );
  const qualifiedSkills = evaluated.filter((e) => e.status === 'qualified');

  // Check active goals linked to gaps
  const activeGoals = goals.filter((g) => !g.completed);
  const goalsAddressingGaps = activeGoals.filter((g) =>
    evaluated.some(
      (e) =>
        e.status !== 'qualified' &&
        (g.linkedSkill?.toLowerCase() === e.name.toLowerCase() ||
          g.title.toLowerCase().includes(e.name.toLowerCase()))
    )
  );

  return {
    benchmark,
    evaluated,
    coreGaps,
    recommendedGaps,
    qualifiedSkills,
    activeGoals,
    goalsAddressingGaps,
  };
}

export function generateRuleBasedResponse(
  query: string,
  context: StudentContextData
): { content: string; actions: AssistantActionItem[] } {
  const q = query.toLowerCase().trim();
  const { profile, skills, projects, stats } = context;
  const {
    benchmark,
    coreGaps,
    recommendedGaps,
    qualifiedSkills,
    activeGoals,
    goalsAddressingGaps,
  } = evaluateStudentProfile(context);

  const actions: AssistantActionItem[] = [];

  // 1. "What should I learn next?" or learning recommendations
  if (
    q.includes('learn next') ||
    q.includes('what to learn') ||
    q.includes('study next') ||
    q.includes('learning recommendation') ||
    q.includes('next priority')
  ) {
    if (coreGaps.length > 0) {
      const topGap = coreGaps[0];
      const hasGoal = goalsAddressingGaps.find(
        (g) => g.linkedSkill?.toLowerCase() === topGap.name.toLowerCase()
      );

      let text = `Based on your target role as **${benchmark.roleName}**, your highest-priority focus is **${topGap.name}**.\n\n`;

      if (topGap.status === 'missing') {
        text += `• **Skill Gap:** You currently do not have **${topGap.name}** in your inventory, but it is a **Core** requirement at the **${topGap.requiredLevel}** level.\n`;
      } else {
        text += `• **Proficiency Gap:** Your current proficiency in **${topGap.name}** is **${topGap.currentLevel}**, but industry benchmarks require **${topGap.requiredLevel}**.\n`;
      }

      if (hasGoal) {
        text += `• **Active Goal Detected:** You already have an active goal: "${hasGoal.title}" (${hasGoal.progressPercentage}% complete). Prioritize finishing this goal and applying it in an engineering design project.\n\n`;
      } else {
        text += `• **Recommended Action:** Create a dedicated learning goal to study ${topGap.name} fundamentals and integrate it into your portfolio.\n\n`;
        actions.push({
          id: `goal-action-${Date.now()}-1`,
          type: 'create_goal',
          label: `Create Goal: Master ${topGap.name}`,
          payload: {
            title: `Master ${topGap.name} Fundamentals`,
            description: `Study standard practices, coursework, and apply ${topGap.name} to portfolio projects for ${benchmark.roleName}.`,
            skill: topGap.name,
            priority: 'High' as GoalPriority,
          },
        });
      }

      if (qualifiedSkills.length > 0) {
        text += `You already have solid foundations in **${qualifiedSkills.map((s) => s.name).slice(0, 2).join(' and ')}**, so building out ${topGap.name} will significantly improve your career alignment.`;
      }

      actions.push({
        id: `project-action-${Date.now()}-2`,
        type: 'add_project',
        label: `Add Project applying ${topGap.name}`,
        payload: {
          title: `${topGap.name} Applied Engineering Project`,
          category: 'Academic',
          skills: [topGap.name, ...(qualifiedSkills.slice(0, 2).map((s) => s.name))],
        },
      });

      return { content: text, actions };
    }

    if (recommendedGaps.length > 0) {
      const topRec = recommendedGaps[0];
      const text = `You've achieved all benchmarked Core skills for **${benchmark.roleName}**! Next, strengthen your profile with recommended electives:\n\n` +
        `• **Recommended Focus:** **${topRec.name}** (Target: ${topRec.requiredLevel})\n` +
        `• This will give you a competitive edge over peer candidates and push your Readiness Score toward Job-Ready.`;

      actions.push({
        id: `goal-rec-${Date.now()}`,
        type: 'create_goal',
        label: `Create Goal: Learn ${topRec.name}`,
        payload: {
          title: `Learn ${topRec.name}`,
          description: `Expand engineering capabilities in ${topRec.name} to strengthen profile for ${benchmark.roleName}.`,
          skill: topRec.name,
          priority: 'Medium' as GoalPriority,
        },
      });

      return { content: text, actions };
    }

    return {
      content: `Outstanding progress! Your technical inventory fully covers the required benchmarks for **${benchmark.roleName}**.\n\n` +
        `To continue advancing, consider:\n` +
        `1. Publishing technical documentation or write-ups for your completed capstones.\n` +
        `2. Pursuing advanced industry credentials (such as CSWP or FE exam prep).\n` +
        `3. Exploring multi-disciplinary electives in systems automation.`,
      actions: [
        {
          id: `view-readiness-${Date.now()}`,
          type: 'view_readiness',
          label: 'View Career Readiness Details',
        },
      ],
    };
  }

  // 2. "Which skills am I missing?"
  if (
    q.includes('missing') ||
    q.includes('skill gap') ||
    q.includes('lacking') ||
    q.includes('which skills')
  ) {
    if (coreGaps.length === 0 && recommendedGaps.length === 0) {
      return {
        content: `Great news! You have zero critical skill gaps for **${benchmark.roleName}**. All core and recommended competencies are present in your profile.`,
        actions: [
          {
            id: `view-roles-${Date.now()}`,
            type: 'view_roles',
            label: 'Compare Other Roles',
          },
        ],
      };
    }

    let text = `For your target role as **${benchmark.roleName}**, here is your skill gap breakdown:\n\n`;

    if (coreGaps.length > 0) {
      text += `**Critical Core Gaps (${coreGaps.length}):**\n`;
      coreGaps.forEach((g) => {
        text += `• **${g.name}**: ${g.status === 'missing' ? 'Missing from inventory' : `Current level (${g.currentLevel}) is below target (${g.requiredLevel})`}\n`;
      });
      text += '\n';

      const firstGap = coreGaps[0];
      actions.push({
        id: `goal-gap-${Date.now()}`,
        type: 'create_goal',
        label: `Create Goal for ${firstGap.name}`,
        payload: {
          title: `Master ${firstGap.name}`,
          skill: firstGap.name,
          priority: 'High' as GoalPriority,
        },
      });
    }

    if (recommendedGaps.length > 0) {
      text += `**Recommended Growth Areas (${recommendedGaps.length}):**\n`;
      recommendedGaps.forEach((g) => {
        text += `• **${g.name}** (Target: ${g.requiredLevel})\n`;
      });
    }

    text += `\nClosing these gaps will directly elevate your **${stats.scoreInterpretation.displayLabel}** readiness score.`;

    actions.push({
      id: `view-readiness-${Date.now()}`,
      type: 'view_readiness',
      label: 'Open Skill Gap Analyzer',
    });

    return { content: text, actions };
  }

  // 3. "Am I ready for my target role?" or readiness score
  if (
    q.includes('ready') ||
    q.includes('readiness') ||
    q.includes('score') ||
    q.includes('evaluation') ||
    q.includes('am i prepared')
  ) {
    const score = stats.readinessScore;
    const status = stats.scoreInterpretation.status;
    const coreCount = coreGaps.length;

    let text = `Your SkillForge Career Readiness Score is currently **${stats.scoreInterpretation.displayLabel} (${status})** for **${benchmark.roleName}**.\n\n`;

    text += `**Current Standing:**\n`;
    text += `• **Strengths:** ${qualifiedSkills.length > 0 ? qualifiedSkills.map((s) => s.name).join(', ') : 'Solid foundational coursework'}\n`;
    text += `• **Core Gaps Remaining:** ${coreCount === 0 ? 'None! All core requirements satisfied.' : `${coreCount} core requirements need completion or upgrading.`}\n`;
    text += `• **Active Goals:** ${activeGoals.length} goal${activeGoals.length === 1 ? '' : 's'} in progress\n\n`;

    if (score >= 85) {
      text += `You are in a strong **Job-Ready** position. Focus on polishing your portfolio documentation and resume technical narratives.`;
    } else if (score >= 65) {
      text += `You are **On Track**, but closing remaining core gaps like **${coreGaps[0]?.name || 'advanced modeling'}** will elevate your candidacy from candidate to top contender.`;
    } else {
      text += `You are currently in **Foundation Building**. Complete your active learning milestones and build at least 1-2 end-to-end projects demonstrating your skills.`;
    }

    if (coreGaps.length > 0) {
      actions.push({
        id: `goal-ready-${Date.now()}`,
        type: 'create_goal',
        label: `Create Goal: ${coreGaps[0].name}`,
        payload: {
          title: `Achieve Proficiency in ${coreGaps[0].name}`,
          skill: coreGaps[0].name,
          priority: 'High' as GoalPriority,
        },
      });
    }

    actions.push({
      id: `view-readiness-${Date.now()}`,
      type: 'view_readiness',
      label: 'Inspect Score Breakdown',
    });

    return { content: text, actions };
  }

  // 4. "What project should I build?" or project recommendations
  if (
    q.includes('project') ||
    q.includes('build') ||
    q.includes('portfolio work') ||
    q.includes('capstone')
  ) {
    const topGapName = coreGaps[0]?.name || recommendedGaps[0]?.name || 'Engineering Analysis';
    const strongSkill = qualifiedSkills[0]?.name || 'CAD Modeling';

    const projectSuggestion = {
      title: `${benchmark.roleName} Verification & Design System`,
      category: 'Academic' as Project['category'],
      skills: [topGapName, strongSkill, 'Technical Report Writing'],
      description: `Comprehensive design and engineering analysis project applying ${strongSkill} and ${topGapName} with complete bill of materials and tolerance documentation.`,
    };

    let text = `To maximize your career readiness as **${benchmark.roleName}**, I recommend building a project that bridges your existing strength in **${strongSkill}** with your gap in **${topGapName}**.\n\n`;

    text += `**Suggested Project Concept:**\n`;
    text += `• **Title:** ${projectSuggestion.title}\n`;
    text += `• **Core Focus:** Practical implementation of **${topGapName}** paired with ${strongSkill}\n`;
    text += `• **Deliverables:** 3D assembly models, detailed drawing sheets with proper tolerancing, and FEA stress report.\n\n`;
    text += `Recruiters look for applied evidence that you understand manufacturing constraints, not just theoretical models.`;

    actions.push({
      id: `project-add-${Date.now()}`,
      type: 'add_project',
      label: `Add Project: ${projectSuggestion.title}`,
      payload: {
        title: projectSuggestion.title,
        category: projectSuggestion.category,
        skills: projectSuggestion.skills,
        description: projectSuggestion.description,
      },
    });

    if (coreGaps.length > 0) {
      actions.push({
        id: `goal-proj-${Date.now()}`,
        type: 'create_goal',
        label: `Set Goal: Learn ${topGapName} first`,
        payload: {
          title: `Learn ${topGapName} for Projects`,
          skill: topGapName,
          priority: 'High' as GoalPriority,
        },
      });
    }

    return { content: text, actions };
  }

  // 5. "How can I improve my readiness score?"
  if (
    q.includes('improve') ||
    q.includes('increase score') ||
    q.includes('boost score') ||
    q.includes('higher readiness')
  ) {
    let text = `Your readiness score (${stats.readinessScore}%) is calculated from a weighted combination of technical skills, completed projects, verified achievements, and active goal momentum.\n\n`;

    text += `**Fastest ways to increase your score:**\n`;
    text += `1. **Close Core Skill Gaps:** Adding or upgrading **${coreGaps.slice(0, 2).map((g) => g.name).join(' and ') || 'key industry skills'}** yields the largest direct score gain.\n`;
    text += `2. **Complete In-Progress Goals:** You currently have **${activeGoals.length} active goal${activeGoals.length === 1 ? '' : 's'}**. Completing them provides immediate verification points.\n`;
    text += `3. **Link Projects to Skills:** Ensure your ${projects.length} projects clearly tag the technical skills you applied.\n\n`;
    text += `Taking these steps moves you directly into the **Career Ready** tier.`;

    if (coreGaps.length > 0) {
      actions.push({
        id: `goal-improve-${Date.now()}`,
        type: 'create_goal',
        label: `Create Goal: ${coreGaps[0].name}`,
        payload: {
          title: `Master ${coreGaps[0].name}`,
          skill: coreGaps[0].name,
          priority: 'High' as GoalPriority,
        },
      });
    }

    actions.push({
      id: `view-readiness-${Date.now()}`,
      type: 'view_readiness',
      label: 'View Readiness Score Formula',
    });

    return { content: text, actions };
  }

  // 6. Career selection / role comparison
  if (
    q.includes('role') ||
    q.includes('career') ||
    q.includes('compare') ||
    q.includes('jobs') ||
    q.includes('discipline')
  ) {
    let text = `Your current profile is configured for **${profile.targetRole || benchmark.roleName}** (${profile.department}).\n\n`;

    text += `Based on your existing skills in **${skills.slice(0, 3).map((s) => s.name).join(', ')}**:\n`;
    text += `• **Primary Match:** ${benchmark.roleName} (${stats.scoreInterpretation.displayLabel})\n`;
    text += `• **Alternative Disciplines:** You can also compare your skills against Robotics & Mechatronics, Thermal/CAE Engineering, or Quality Engineering in the Skill-Gap Analyzer.\n\n`;
    text += `Would you like to review alternative benchmark requirements?`;

    actions.push({
      id: `view-roles-${Date.now()}`,
      type: 'view_roles',
      label: 'Compare Career Benchmarks',
    });

    return { content: text, actions };
  }

  // Default fallback answer incorporating real profile
  let generalText = `As Forge Assistant, I've analyzed your SkillForge profile for **${benchmark.roleName}**:\n\n`;
  generalText += `• **Career Readiness:** ${stats.scoreInterpretation.displayLabel} (${stats.scoreInterpretation.status})\n`;
  generalText += `• **Top Priority:** ${coreGaps.length > 0 ? `Close the skill gap in **${coreGaps[0].name}**` : 'Maintain project portfolio documentation'}\n`;
  generalText += `• **Portfolio Standing:** ${projects.length} projects documented and ${activeGoals.length} active learning goals.\n\n`;
  generalText += `What would you like specific guidance on? You can ask about what skill to learn next, what project to build, or how to reach job readiness.`;

  if (coreGaps.length > 0) {
    actions.push({
      id: `goal-general-${Date.now()}`,
      type: 'create_goal',
      label: `Create Goal: ${coreGaps[0].name}`,
      payload: {
        title: `Master ${coreGaps[0].name}`,
        skill: coreGaps[0].name,
        priority: 'High' as GoalPriority,
      },
    });
  }

  return { content: generalText, actions };
}
