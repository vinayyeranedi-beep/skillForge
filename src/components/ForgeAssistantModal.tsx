import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AssistantMessage, VoiceState, AssistantActionItem } from '../types';
import { generateRuleBasedResponse, StudentContextData } from '../utils/careerAssistantEngine';
import {
  X,
  Send,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  FolderGit2,
  Compass,
  AlertCircle,
  Bot,
  User,
} from 'lucide-react';

const QUICK_QUESTIONS = [
  'What should I learn next?',
  'Which skills am I missing?',
  'Am I ready for my target role?',
  'What project should I build?',
  'How can I improve my readiness score?',
];

export const ForgeAssistantModal: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    initialAssistantPrompt,
    setInitialAssistantPrompt,
    profile,
    skills,
    projects,
    goals,
    stats,
    addGoal,
    addProject,
    setActiveTab,
    showToast,
  } = useApp();

  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    return [
      {
        id: 'initial-welcome',
        role: 'assistant',
        content: `Hello ${profile.name.split(' ')[0]}! I'm **Forge Assistant**, your personal career development guide.\n\nI've connected to your SkillForge profile (${profile.targetRole || 'Engineering Student'}, Readiness: **${stats.scoreInterpretation.displayLabel}**).\n\nHow can I help guide your next step today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom();
      // If an initial prompt was provided when opened, send it automatically
      if (initialAssistantPrompt) {
        handleSendMessage(initialAssistantPrompt);
        setInitialAssistantPrompt('');
      } else {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    } else {
      // Stop speech when assistant closes
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMessageId(null);
      stopListening();
    }
  }, [isAssistantOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      stopListening();
    };
  }, []);

  // Build context object for assistant
  const buildContextData = (): StudentContextData => ({
    profile,
    skills,
    projects,
    goals,
    stats: {
      readinessScore: stats.readinessScore,
      scoreInterpretation: {
        score: stats.scoreInterpretation.score,
        status: stats.scoreInterpretation.status,
        displayLabel: stats.scoreInterpretation.displayLabel,
        rangeText: stats.scoreInterpretation.rangeText,
        description: stats.scoreInterpretation.description,
      },
      totalSkills: stats.totalSkills,
      totalProjects: stats.totalProjects,
      totalGoals: stats.totalGoals,
      activeGoals: stats.activeGoals,
      completedGoals: stats.completedGoals,
    },
  });

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputQuery).trim();
    if (!query || isLoading) return;

    // Stop current speech if any
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);
    setVoiceNotice(null);

    const contextData = buildContextData();

    try {
      // Attempt server-side Gemini API first
      const res = await fetch('/api/forge-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
          studentContext: contextData,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && !data.fallback && data.content) {
          const assistantMsg: AssistantMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: data.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actions: data.actions || [],
            fallbackUsed: false,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsLoading(false);
          return;
        }
      }

      // If server returns fallback or network error, execute local profile rules engine
      const ruleResult = generateRuleBasedResponse(query, contextData);
      const assistantMsg: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: ruleResult.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: ruleResult.actions,
        fallbackUsed: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Offline/network failure fallback: robust rule-based response
      const ruleResult = generateRuleBasedResponse(query, contextData);
      const assistantMsg: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: ruleResult.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: ruleResult.actions,
        fallbackUsed: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text to Speech (TTS)
  const toggleSpeak = (messageId: string, content: string) => {
    if (!('speechSynthesis' in window)) {
      setVoiceNotice('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown tags for natural speech
    const cleanText = content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/•/g, '')
      .replace(/#/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Input (Speech Recognition)
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice("Voice input isn't supported in this browser. You can continue using text chat.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceState('listening');
        setVoiceNotice('Listening... Speak now.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceState('processing');
        setVoiceNotice('Processing speech...');
        setInputQuery(transcript);
        handleSendMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        setVoiceState('idle');
        if (event.error === 'not-allowed') {
          setVoiceNotice('Microphone access was denied. You can continue using text chat.');
        } else if (event.error === 'no-speech') {
          setVoiceNotice('No speech detected. Tap microphone to try again.');
        } else {
          setVoiceNotice("Microphone unavailable. You can continue using text chat.");
        }
      };

      recognition.onend = () => {
        setVoiceState('idle');
      };

      recognition.start();
    } catch {
      setVoiceState('idle');
      setVoiceNotice('Microphone access error. You can continue using text chat.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setVoiceState('idle');
  };

  const handleMicToggle = () => {
    if (voiceState === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleClearChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared! How can I assist your engineering career journey next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setVoiceNotice(null);
  };

  // Action item handlers (real actions)
  const handleExecuteAction = (action: AssistantActionItem) => {
    if (action.type === 'create_goal' && action.payload) {
      const today = new Date();
      const future = new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 days out
      addGoal({
        title: action.payload.title || 'Master Engineering Competency',
        description: action.payload.description || `Targeted learning goal recommended by Forge Assistant to bridge career readiness gaps.`,
        targetDate: future.toISOString().split('T')[0],
        completed: false,
        priority: action.payload.priority || 'High',
        linkedSkill: action.payload.skill,
        progressPercentage: 0,
      });
      showToast({
        type: 'success',
        title: 'Goal Created Successfully',
        message: `"${action.payload.title}" added to your active Learning Goals.`,
      });
      // Append confirmation in chat
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          role: 'assistant',
          content: `✓ **Created Learning Goal:** "${action.payload?.title}". You can track your progress in the **Goals** tab!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else if (action.type === 'add_project' && action.payload) {
      const today = new Date().toISOString().split('T')[0];
      addProject({
        title: action.payload.title || 'Applied Engineering System',
        description: action.payload.description || `Portfolio project created to apply and demonstrate engineering competencies.`,
        category: action.payload.category || 'Academic',
        status: 'In Progress',
        skills: action.payload.skills || [action.payload.skill || 'CAD & 3D Modeling'],
        startDate: today,
        highlights: [
          'Initiated engineering design project based on Forge Assistant recommendation.',
          'Focusing on manufacturing verification, analysis, and comprehensive documentation.',
        ],
      });
      showToast({
        type: 'success',
        title: 'Project Added Successfully',
        message: `"${action.payload.title}" added to your Engineering Projects.`,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          role: 'assistant',
          content: `✓ **Created Project Draft:** "${action.payload?.title}". Added to your **Projects** inventory with status "In Progress".`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else if (action.type === 'view_readiness') {
      setActiveTab('dashboard');
      setIsAssistantOpen(false);
      showToast({
        type: 'info',
        title: 'Navigating to Dashboard',
        message: 'Viewing your Career Readiness breakdown and dimensional score.',
      });
    } else if (action.type === 'view_roles' || action.type === 'view_skills') {
      setActiveTab('career-ai');
      setIsAssistantOpen(false);
      showToast({
        type: 'info',
        title: 'Opening Skill-Gap Analyzer',
        message: 'Review benchmark requirements and industry role comparisons.',
      });
    }
  };

  if (!isAssistantOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forge-assistant-title"
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsAssistantOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-out Panel (Desktop: Right drawer, Mobile: Full height bottom sheet) */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white h-full flex flex-col shadow-2xl z-10 border-l border-slate-200/90 surface-3d animate-in slide-in-from-right duration-250">
        {/* Header */}
        <header className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0 icon-container-3d">
              <Compass className="w-5 h-5 text-sky-200" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2
                  id="forge-assistant-title"
                  className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight"
                >
                  Forge Assistant
                </h2>
                {/* Subtle Status Indicator */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  {voiceState === 'listening' ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-rose-600">Listening...</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-indigo-600">Assistant responding...</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-600">Ready to help</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Your personal career development guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Clear Chat Button */}
            <button
              onClick={handleClearChat}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Clear conversation"
              aria-label="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Quick Mic Button in Header */}
            <button
              onClick={handleMicToggle}
              className={`p-2 rounded-lg transition-colors ${
                voiceState === 'listening'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                  : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
              }`}
              title={voiceState === 'listening' ? 'Stop listening' : 'Talk to Forge'}
              aria-label="Toggle voice input"
            >
              {voiceState === 'listening' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsAssistantOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close Forge Assistant"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Student Profile Quick Context Strip */}
        <div className="bg-indigo-50/60 border-b border-indigo-100 px-4 py-2 flex items-center justify-between text-[11px] text-indigo-900">
          <span className="truncate">
            Target: <strong className="font-bold text-slate-900">{profile.targetRole || 'Mechanical Engineer'}</strong>
          </span>
          <span className="font-bold text-indigo-700 shrink-0">
            Readiness: {stats.scoreInterpretation.displayLabel} ({stats.scoreInterpretation.status})
          </span>
        </div>

        {/* Voice Feedback Notice Banner */}
        {voiceNotice && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 line-clamp-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{voiceNotice}</span>
            </span>
            <button
              onClick={() => setVoiceNotice(null)}
              className="text-amber-700 hover:text-amber-900 text-xs font-bold shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isSpeaking = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs surface-3d shadow-xs'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 opacity-80 text-[10px] font-bold">
                    <span className="flex items-center gap-1">
                      {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-indigo-600" />}
                      <span>{isUser ? 'You' : 'Forge Assistant'}</span>
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Content (supports markdown bullet points, bold, headers) */}
                  <div className="space-y-2 whitespace-pre-line break-words">
                    {msg.content.split('\n\n').map((para, pIdx) => (
                      <p key={pIdx}>
                        {para.split('**').map((chunk, cIdx) =>
                          cIdx % 2 === 1 ? (
                            <strong key={cIdx} className={isUser ? 'text-sky-200 font-bold' : 'text-slate-900 font-bold'}>
                              {chunk}
                            </strong>
                          ) : (
                            chunk
                          )
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Actions & TTS Bar for Assistant messages */}
                  {!isUser && (
                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[10px] text-slate-400">
                        {msg.fallbackUsed ? 'SkillForge Profile Rules' : 'AI Career Guidance'}
                      </div>

                      {/* Read Aloud Button */}
                      <button
                        onClick={() => toggleSpeak(msg.id, msg.content)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                          isSpeaking
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                        title={isSpeaking ? 'Stop reading' : 'Read response aloud'}
                        aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3 text-indigo-600 animate-pulse" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Read aloud</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Render Action Buttons below Assistant Response */}
                {!isUser && msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 max-w-[92%] sm:max-w-[85%]">
                    {msg.actions.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => handleExecuteAction(act)}
                        className="btn-3d inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-50 shadow-2xs transition-all"
                      >
                        {act.type === 'create_goal' ? (
                          <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
                        ) : act.type === 'add_project' ? (
                          <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Bubble */}
          {isLoading && (
            <div className="flex items-start space-y-1.5">
              <div className="bg-white rounded-2xl p-4 text-xs border border-slate-200/90 shadow-xs surface-3d flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
                <span className="text-slate-500 font-medium ml-1">Analyzing your SkillForge profile...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Questions (shown when conversation is fresh or below messages) */}
        {messages.length <= 3 && !isLoading && (
          <div className="p-3 bg-white border-t border-slate-200/80 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Suggested Questions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-[11px] font-semibold text-slate-700 hover:text-indigo-700 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 px-2.5 py-1.5 rounded-lg text-left transition-colors shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Bar */}
        <footer className="p-3 sm:p-4 border-t border-slate-200 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                voiceState === 'listening'
                  ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 animate-pulse'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title={voiceState === 'listening' ? 'Listening... Tap to stop' : 'Talk to Forge'}
              aria-label="Talk to Forge"
            >
              {voiceState === 'listening' ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  voiceState === 'listening'
                    ? 'Listening... speak clearly into your mic'
                    : 'Ask Forge about skills, projects, or readiness...'
                }
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs transition-all shrink-0"
              title="Send message"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Voice State Hint */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
            <span>
              {voiceState === 'listening'
                ? 'Listening... tap mic to finish'
                : 'Tap microphone to speak or type your question'}
            </span>
            <span>Esc to close</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
