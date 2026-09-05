import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Award, CheckCircle2, ChevronRight, Lock, Target } from 'lucide-react';

const INDUSTRY_TARGETS = [
  {
    id: 'cert-google-swe',
    title: 'Google SWE Internship',
    provider: 'Google',
    type: 'Internship',
    description: 'Requires strong algorithmic thinking, systems design, and backend engineering skills.',
    requiredSkills: ['Data Structures', 'Algorithms', 'Python', 'System Design'],
    color: 'border-blue-200 bg-blue-50/50',
    iconColor: 'text-blue-600',
    logo: 'G'
  },
  {
    id: 'cert-aws-architect',
    title: 'AWS Solutions Architect',
    provider: 'Amazon Web Services',
    type: 'Certification',
    description: 'Validates ability to design and deploy well-architected solutions on AWS.',
    requiredSkills: ['Cloud Computing', 'AWS', 'System Architecture', 'Networking'],
    color: 'border-orange-200 bg-orange-50/50',
    iconColor: 'text-orange-600',
    logo: 'AWS'
  },
  {
    id: 'cert-meta-frontend',
    title: 'Meta Front-End Developer',
    provider: 'Meta',
    type: 'Certification',
    description: 'Demonstrates proficiency in React, JavaScript, and modern UI engineering.',
    requiredSkills: ['React', 'JavaScript', 'CSS', 'UI/UX Design'],
    color: 'border-blue-200 bg-blue-50/50',
    iconColor: 'text-blue-700',
    logo: 'Meta'
  },
  {
    id: 'cert-msft-ai',
    title: 'Microsoft AI Engineer',
    provider: 'Microsoft',
    type: 'Certification',
    description: 'Focuses on implementing AI solutions using Azure AI services.',
    requiredSkills: ['Machine Learning', 'Python', 'Artificial Intelligence', 'Azure'],
    color: 'border-emerald-200 bg-emerald-50/50',
    iconColor: 'text-emerald-600',
    logo: 'MSFT'
  }
];

export const IndustryCertificationsTracker: React.FC = () => {
  const { skills, addGoal, setActiveTab } = useApp();

  const studentSkillNames = useMemo(() => {
    return new Set(skills.map(s => s.name.toLowerCase()));
  }, [skills]);

  const targetsWithProgress = useMemo(() => {
    return INDUSTRY_TARGETS.map(target => {
      const matchCount = target.requiredSkills.filter(req => 
        studentSkillNames.has(req.toLowerCase())
      ).length;
      
      const progress = Math.round((matchCount / target.requiredSkills.length) * 100);
      const isReady = progress === 100;
      
      const missingSkills = target.requiredSkills.filter(req => 
        !studentSkillNames.has(req.toLowerCase())
      );

      return {
        ...target,
        progress,
        isReady,
        missingSkills
      };
    });
  }, [INDUSTRY_TARGETS, studentSkillNames]);

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center gap-2 mb-2">
        <Award className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Top Industry Programs & Certifications</h2>
      </div>
      <p className="text-sm text-slate-500 max-w-2xl">
        Track your readiness for competitive internships and globally recognized certifications from top tech companies based on your current skill matrix.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {targetsWithProgress.map((target) => (
          <div 
            key={target.id}
            className={`rounded-2xl border ${target.color} p-5 flex flex-col justify-between transition-all hover:shadow-md`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-sm shadow-sm ${target.iconColor}`}>
                    {target.logo}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{target.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-medium text-slate-600">{target.provider}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{target.type}</span>
                    </div>
                  </div>
                </div>
                {target.isReady ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center" title="Requirements not met">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {target.description}
              </p>
              
              {/* Progress Bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Readiness Score</span>
                  <span className={`font-bold ${target.isReady ? 'text-emerald-600' : 'text-slate-600'}`}>{target.progress}%</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden border border-slate-200/50">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${target.isReady ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${target.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/50">
              {target.isReady ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are ready to apply!</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2 text-xs">
                  <span className="font-semibold text-slate-700">Missing Core Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {target.missingSkills.map(skill => (
                      <span key={skill} className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 text-[10px] font-medium flex items-center gap-1">
                        {skill}
                        <button 
                          onClick={() => {
                            addGoal({
                              title: `Learn ${skill} for ${target.title}`,
                              description: `Required to become ready for ${target.provider} ${target.type}.`,
                              targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                              priority: 'High',
                              progressPercentage: 0,
                              completed: false
                            });
                            setActiveTab('goals');
                          }}
                          className="hover:text-indigo-600 ml-0.5"
                          title="Add as Learning Goal"
                        >
                          <Target className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
