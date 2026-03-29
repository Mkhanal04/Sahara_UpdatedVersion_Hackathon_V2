import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, FileText, Calendar, Users, Home, ThumbsUp, ThumbsDown, ArrowRight, ChevronLeft, MessageCircle, AlertCircle, Heart, UserPlus, Eye, Sparkles, Send, User, Edit3, Phone, Mic, Square, BookOpen, Activity } from 'lucide-react';
import { generateChatResponse } from './services/geminiService';

// --- MOCK DATA ---
const CONSULTATIONS = [
  {
    id: '1',
    clientName: 'Sita, 34',
    subjectName: 'Ram, 28 (Brother)',
    time: '10:00 AM - 10:45 AM',
    type: 'Family Guidance',
    isFamily: true,
    status: 'Needs Review',
    summary: "Sita is seeking guidance regarding her brother, Ram. She notes social withdrawal (3 weeks), irregular sleep, and missing work. Sita needs coaching on how to broach the topic of mental health with him without triggering defensiveness.",
    evidence: "Resonated with: Work/Study Impact (28 families)",
    transcriptPreview: "My brother stopped going to work 3 weeks ago. My parents think he's lazy, but I feel like something deeper is going on."
  },
  {
    id: '2',
    clientName: 'Ram, 28',
    subjectName: 'Self',
    time: '11:30 AM - 12:15 PM',
    type: 'Individual Intake',
    isFamily: false,
    status: 'Reviewed',
    summary: "Ram completed the self-assessment. Primary concerns: Anxiety related to family expectations, difficulty sleeping. He is looking for culturally-grounded coping strategies.",
    evidence: "Resonated with: Sleep Changes (32 individuals)",
    transcriptPreview: "I cannot sleep. My chest feels heavy every night."
  }
];

const CLIENT_ROSTER = [
  {
    id: 'c1',
    name: 'Sita, 34',
    type: 'Family Guidance',
    subject: 'Ram, 28 (Brother)',
    lastSession: 'Oct 14, 2026',
    totalSessions: 1,
    sharedPosts: [
      {
        date: '3 weeks ago',
        content: "My brother stopped going to work. My parents think he's lazy, but I feel like something deeper is going on. Has anyone else dealt with this?",
        community: 'Social Withdrawal'
      }
    ]
  },
  {
    id: 'c2',
    name: 'Aarav, 42',
    type: 'Individual Therapy',
    subject: 'Self',
    lastSession: 'Oct 02, 2026',
    totalSessions: 4,
    sharedPosts: []
  },
  {
    id: 'c3',
    name: 'Priya, 29',
    type: 'Family Guidance',
    subject: 'Mother, 55',
    lastSession: 'Sep 28, 2026',
    totalSessions: 2,
    sharedPosts: [
      {
        date: '1 month ago',
        content: "My mother refuses to leave the house but gets angry when we suggest a doctor. She says we are calling her 'paagal'.",
        community: 'Stigma & Resistance'
      }
    ]
  }
];

const MOCK_JOURNAL_ENTRIES = [
  {
    id: '1',
    date: 'March 26, 2026',
    mood: 'Anxious',
    summary: 'Discussed feelings of overwhelm at work and difficulty sleeping. Explored the root causes of the anxiety and identified some immediate triggers.',
    techniques: ['4-7-8 Breathing', 'Progressive Muscle Relaxation']
  },
  {
    id: '2',
    date: 'March 20, 2026',
    mood: 'Reflective',
    summary: 'Talked about family dynamics and setting boundaries. Acknowledged the guilt associated with saying no, but recognized its importance for long-term well-being.',
    techniques: ['"I" Statements', 'Boundary Setting Practice']
  }
];

// --- COMPONENTS ---

export default function App() {
  const [viewHistory, setViewHistory] = useState<string[]>(['demo-select']);
  const currentView = viewHistory[viewHistory.length - 1];
  const [selectedConsultId, setSelectedConsultId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [chatContext, setChatContext] = useState<string>('self');
  const [journalEntries, setJournalEntries] = useState(MOCK_JOURNAL_ENTRIES);

  const handleSaveJournal = (summary: string, mood: string, techniques: string[]) => {
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      mood,
      summary,
      techniques
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    navigateTab('user-journal');
  };

  const setCurrentView = (view: string) => {
    setViewHistory(prev => [...prev, view]);
  };

  const goBack = () => {
    setViewHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  const navigateTab = (view: string) => {
    setViewHistory(['demo-select', view]);
  };

  const handleLogin = () => navigateTab('queue');
  
  const handleViewBrief = (id: string) => {
    setSelectedConsultId(id);
    setCurrentView('brief');
  };

  const handleViewClient = (id: string) => {
    setSelectedClientId(id);
    setCurrentView('client-detail');
  };

  const handleBackToQueue = () => {
    setSelectedConsultId(null);
    goBack();
  };

  const handleBackToClients = () => {
    setSelectedClientId(null);
    goBack();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-[390px] h-[844px] max-h-[90vh] bg-brand-bg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative border-4 border-white">
        
        {/* Top Crisis Banner */}
        <div className="bg-[#4A3B36] text-white text-xs font-medium py-2 px-4 text-center z-50">
          Crisis support available — Nepal: 1166 · US: 988
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative scrollbar-hide">
          {currentView === 'demo-select' && <DemoSelectScreen onSelect={(role) => navigateTab(role === 'pro' ? 'login' : 'user-home')} />}
          {currentView === 'user-home' && <UserHomeScreen onStartChat={(ctx) => { setChatContext(ctx); setCurrentView('ai-chat'); }} onExplore={() => setCurrentView('community-feed')} />}
          {currentView === 'ai-chat' && <AiChatScreen context={chatContext} onBack={goBack} onExplore={() => setCurrentView('community-feed')} onConsult={() => setCurrentView('user-consultation')} onSaveJournal={handleSaveJournal} />}
          {currentView === 'community-feed' && <CommunityFeedScreen onBack={goBack} />}
          {currentView === 'user-journal' && <JournalScreen entries={journalEntries} onBack={goBack} />}
          {currentView === 'login' && <LoginScreen onLogin={handleLogin} onBack={goBack} />}
          {currentView === 'queue' && <DashboardScreen onViewBrief={handleViewBrief} />}
          {currentView === 'schedule' && <ScheduleScreen />}
          {currentView === 'profile' && <ProfileScreen />}
          {currentView === 'clients' && <ClientsScreen onViewClient={handleViewClient} />}
          {currentView === 'client-detail' && selectedClientId && (
            <ClientDetailScreen 
              client={CLIENT_ROSTER.find(c => c.id === selectedClientId)!} 
              onBack={goBack} 
            />
          )}
          {currentView === 'brief' && selectedConsultId && (
            <PatientBriefScreen 
              consult={CONSULTATIONS.find(c => c.id === selectedConsultId)!} 
              onBack={goBack} 
            />
          )}
          {currentView === 'user-consultation' && (
            <div className="p-8 flex flex-col h-full items-center justify-center text-center">
              <button 
                onClick={goBack}
                className="absolute top-6 left-6 w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <Calendar size={48} className="text-brand-rust mb-4" />
              <h2 className="font-serif text-2xl font-semibold text-brand-ink mb-2">Consultation Booking</h2>
              <p className="text-brand-ink/60 text-sm">This feature is coming soon.</p>
              <button onClick={() => navigateTab('user-home')} className="mt-8 text-brand-rust font-medium">Back to Home</button>
            </div>
          )}
          {currentView === 'user-help' && <HelpScreen onBack={goBack} onHome={() => navigateTab('user-home')} />}
        </div>

        {/* Bottom Navigation (User) */}
        {['user-home', 'community-feed', 'user-consultation', 'user-journal'].includes(currentView) && (
          <div className="bg-brand-bg border-t border-brand-border px-6 py-4 flex justify-between items-center pb-8">
            <button 
              onClick={() => navigateTab('user-home')}
              className={`flex flex-col items-center transition-colors ${currentView === 'user-home' ? 'text-brand-rust' : 'text-brand-ink/40 hover:text-brand-ink'}`}
            >
              <Home size={24} strokeWidth={currentView === 'user-home' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Home</span>
            </button>
            <button 
              onClick={() => navigateTab('community-feed')}
              className={`flex flex-col items-center transition-colors ${currentView === 'community-feed' ? 'text-brand-rust' : 'text-brand-ink/40 hover:text-brand-ink'}`}
            >
              <Users size={24} strokeWidth={currentView === 'community-feed' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Chautari</span>
            </button>
            <button 
              onClick={() => navigateTab('user-journal')}
              className={`flex flex-col items-center transition-colors ${currentView === 'user-journal' ? 'text-brand-rust' : 'text-brand-ink/40 hover:text-brand-ink'}`}
            >
              <BookOpen size={24} strokeWidth={currentView === 'user-journal' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Journal</span>
            </button>
            <button 
              onClick={() => navigateTab('user-consultation')}
              className={`flex flex-col items-center transition-colors ${currentView === 'user-consultation' ? 'text-brand-rust' : 'text-brand-ink/40 hover:text-brand-ink'}`}
            >
              <Calendar size={24} strokeWidth={currentView === 'user-consultation' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Consultation</span>
            </button>
          </div>
        )}

        {/* Bottom Navigation (Only on Dashboard) */}
        {['queue', 'schedule', 'profile', 'clients', 'client-detail'].includes(currentView) && (
          <div className="bg-brand-bg border-t border-brand-border px-6 py-4 flex justify-between items-center pb-8">
            <button 
              onClick={() => navigateTab('queue')}
              className={`flex flex-col items-center transition-colors ${currentView === 'queue' ? 'text-brand-rust' : 'text-brand-ink/40 hover:text-brand-ink'}`}
            >
              <Home size={24} strokeWidth={currentView === 'queue' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Queue</span>
            </button>
            <button 
              onClick={() => navigateTab('clients')}
              className={`flex flex-col items-center transition-colors ${['clients', 'client-detail'].includes(currentView) ? 'text-brand-rust' : 'text-brand-ink/40 hover:text-brand-ink'}`}
            >
              <Users size={24} strokeWidth={['clients', 'client-detail'].includes(currentView) ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Clients</span>
            </button>
            <button 
              onClick={() => navigateTab('schedule')}
              className={`flex flex-col items-center transition-colors ${currentView === 'schedule' ? 'text-brand-rust' : 'text-brand-ink/40 hover:text-brand-ink'}`}
            >
              <Calendar size={24} strokeWidth={currentView === 'schedule' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Schedule</span>
            </button>
            <button 
              onClick={() => navigateTab('profile')}
              className={`flex flex-col items-center transition-colors ${currentView === 'profile' ? 'text-brand-rust' : 'text-brand-ink/40 hover:text-brand-ink'}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-serif ${currentView === 'profile' ? 'bg-brand-rust text-white' : 'bg-brand-surface-alt border border-brand-border text-brand-ink'}`}>
                Dr
              </div>
              <span className="text-[10px] font-medium mt-1">Profile</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SCREENS ---

function DemoSelectScreen({ onSelect }: { onSelect: (role: 'pro' | 'user') => void }) {
  return (
    <div className="p-8 flex flex-col h-full justify-center items-center text-center bg-brand-bg">
      <div className="mb-12">
        <div className="w-16 h-16 bg-brand-rust text-white rounded-2xl flex items-center justify-center font-serif text-3xl shadow-md mx-auto mb-6">
          S
        </div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-brand-ink mb-2">Sahara</h1>
        <p className="text-brand-ink/60 text-sm">Prototype Environment</p>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={() => onSelect('user')}
          className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-6 text-left transition-colors shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl font-semibold text-brand-ink">Patient / Family</h2>
            <ArrowRight size={20} className="text-brand-rust opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-brand-ink/60">Community feed, anonymous browsing, and intake flow.</p>
        </button>

        <button 
          onClick={() => onSelect('pro')}
          className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-6 text-left transition-colors shadow-sm group"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl font-semibold text-brand-ink">Professional</h2>
            <ArrowRight size={20} className="text-brand-rust opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-brand-ink/60">Queue, AI summaries, client roster, and schedule.</p>
        </button>
      </div>
    </div>
  );
}

function HelpScreen({ onBack, onHome }: { onBack: () => void, onHome: () => void }) {
  return (
    <div className="flex flex-col h-full bg-brand-bg">
      {/* Header */}
      <div className="px-6 py-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-serif text-2xl font-semibold text-brand-ink">Help & Support</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-4">

        {/* Crisis Helplines */}
        <div className="bg-[#2C1810] rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Crisis Support — Always Available</p>
          <a
            href="tel:1166"
            className="flex items-center gap-3 py-3 border-b border-white/10"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Phone size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-base">Nepal: 1166</p>
              <p className="text-white/50 text-xs">National Mental Health Helpline</p>
            </div>
          </a>
          <a
            href="tel:988"
            className="flex items-center gap-3 pt-3"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Phone size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-base">US: 988</p>
              <p className="text-white/50 text-xs">Suicide & Crisis Lifeline</p>
            </div>
          </a>
        </div>

        {/* Important Disclaimer */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-brand-rust shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wider text-brand-ink/50">Important Disclaimer</p>
          </div>
          <p className="text-sm text-brand-ink/80 leading-relaxed">
            Sahara is not a diagnostic tool and does not provide medical advice, diagnoses, or treatment. The AI companion organizes your observations — it never labels, categorizes, or diagnoses conditions.
          </p>
        </div>

        {/* About Sahara */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={16} className="text-brand-rust shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wider text-brand-ink/50">About Sahara</p>
          </div>
          <p className="text-sm text-brand-ink/80 leading-relaxed">
            Sahara is a culturally-grounded mental health platform built for families and individuals in collectivist communities. We recognize that in many cultures, a family member notices a change before anyone else does. Sahara creates a structured pathway for that person — the one who noticed — alongside support for individuals seeking to understand themselves.
          </p>
        </div>

        {/* Privacy */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lock size={16} className="text-brand-rust shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wider text-brand-ink/50">Privacy</p>
          </div>
          <p className="text-sm text-brand-ink/80 leading-relaxed">
            All community stories are anonymous and moderated. Your conversations with Maan are private and not shared without your consent. This prototype does not collect or store real patient data.
          </p>
        </div>

        {/* Back to Home */}
        <button
          onClick={onHome}
          className="w-full bg-brand-rust hover:bg-brand-rust/90 text-white rounded-2xl py-4 font-medium text-base transition-colors shadow-sm"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
}

function UserHomeScreen({ onStartChat, onExplore }: { onStartChat: (context: string) => void, onExplore: () => void }) {
  return (
    <div className="flex flex-col h-full bg-brand-bg relative pb-24">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-brand-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-rust text-white rounded-full flex items-center justify-center font-serif text-lg shadow-sm">
            S
          </div>
          <span className="font-serif text-xl font-semibold text-brand-ink">Sahara</span>
        </div>
        <div className="w-8 h-8 bg-brand-surface border border-brand-border text-brand-rust rounded-full flex items-center justify-center font-serif text-sm shadow-sm">
          S
        </div>
      </div>

      <div className="px-6 pb-6">
        <p className="text-brand-rust italic text-sm mb-1">आज मनमा के छ?</p>
        <h1 className="font-serif text-3xl font-semibold text-brand-ink mb-2 tracking-tight">What brings you here today?</h1>
        <p className="text-brand-ink/60 text-sm mb-8">A quiet space. No labels, no judgment.</p>

        <div className="space-y-4 mb-10">
          <button onClick={() => onStartChat('family')} className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-5 text-left transition-colors shadow-sm flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-brand-rust/10 flex items-center justify-center text-brand-rust shrink-0">
              <Users size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold text-brand-ink mb-0.5">I'm concerned about someone I love</h3>
              <p className="text-xs text-brand-ink/60">For family members who noticed a change</p>
            </div>
            <ArrowRight size={16} className="text-brand-ink/20 group-hover:text-brand-rust transition-colors" />
          </button>

          <button onClick={() => onStartChat('self')} className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-5 text-left transition-colors shadow-sm flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
              <User size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold text-brand-ink mb-0.5">I want to understand myself better</h3>
              <p className="text-xs text-brand-ink/60">A private conversation with Maan</p>
            </div>
            <ArrowRight size={16} className="text-brand-ink/20 group-hover:text-brand-green transition-colors" />
          </button>

          <button onClick={() => onStartChat('share')} className="w-full bg-brand-rust/10 border border-brand-rust/20 hover:bg-brand-rust/20 rounded-2xl p-5 text-left transition-colors shadow-sm flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-brand-rust/20 flex items-center justify-center text-brand-rust shrink-0">
              <Edit3 size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold text-brand-ink mb-0.5">Share your experience</h3>
              <p className="text-xs text-brand-ink/60">Talk to our AI companion. Your words could help someone going through the same thing.</p>
            </div>
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/40 mb-4">From the community</h3>
          
          <div className="space-y-4">
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-sm">
              <p className="text-brand-rust font-serif text-2xl leading-none mb-2">"</p>
              <p className="text-sm text-brand-ink/80 leading-relaxed mb-4">My brother stopped going to work 3 weeks ago. My parents think he's lazy, but I feel like something deeper is going on.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-brand-ink/50">— Concerned Sister</span>
                <span className="text-[10px] font-medium bg-brand-green/10 text-brand-green px-2 py-1 rounded-full">47 relate</span>
              </div>
            </div>

            <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-sm">
              <p className="text-brand-rust font-serif text-2xl leading-none mb-2">"</p>
              <p className="text-sm text-brand-ink/80 leading-relaxed mb-4">I smile on the outside but inside I'm exhausted. I don't know how to explain it.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-brand-ink/50">— Anonymous</span>
                <span className="text-[10px] font-medium bg-brand-green/10 text-brand-green px-2 py-1 rounded-full">31 relate</span>
              </div>
            </div>
          </div>

          <button onClick={onExplore} className="w-full text-center py-4 text-sm font-medium text-brand-rust hover:underline mt-2">
            See all community stories &rarr;
          </button>
          <p className="text-center text-brand-ink/40 mt-1" style={{ fontSize: '10px' }}>
            Sahara organizes observations — it does not diagnose or replace professional care.
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, onBack }: { onLogin: () => void, onBack: () => void }) {
  return (
    <div className="p-8 flex flex-col h-full relative">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors z-10"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex-1 mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-rust text-white rounded-xl flex items-center justify-center font-serif text-2xl shadow-sm">
            S
          </div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink">Sahara</h1>
        </div>

        <p className="text-brand-rust font-medium text-sm mb-2 italic">For Professionals</p>
        <h2 className="font-serif text-[2.5rem] leading-[1.1] font-semibold text-brand-ink mb-6 tracking-tight">
          Review.<br />Understand.<br />Connect.
        </h2>
        
        <p className="text-brand-ink/70 text-base leading-relaxed mb-12">
          Empowering your practice with cultural context. Review AI-summarized family observations before you meet.
        </p>

        <div className="space-y-4">
          <div className="bg-brand-surface rounded-2xl p-1 border border-brand-border shadow-sm">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-transparent px-4 py-3 text-brand-ink placeholder:text-brand-ink/40 focus:outline-none"
              defaultValue="dr.sharma@sahara.health"
            />
          </div>
          <div className="bg-brand-surface rounded-2xl p-1 border border-brand-border shadow-sm">
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-transparent px-4 py-3 text-brand-ink placeholder:text-brand-ink/40 focus:outline-none"
              defaultValue="••••••••"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={onLogin}
          className="w-full bg-brand-rust hover:bg-brand-rust/90 text-white rounded-2xl py-4 font-medium text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <ShieldCheck size={20} />
          Sign In as Professional
        </button>

        <div className="flex justify-center gap-6 mt-8 text-[11px] text-brand-ink/50 font-medium uppercase tracking-wider">
          <span className="flex items-center gap-1"><Lock size={12} /> Secure</span>
          <span className="flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>
          <span className="flex items-center gap-1"><FileText size={12} /> HIPAA</span>
        </div>
      </div>
    </div>
  );
}

function JournalScreen({ entries, onBack }: { entries: any[], onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-brand-bg relative">
      <div className="bg-brand-bg/90 backdrop-blur-md z-10 px-6 py-6 border-b border-brand-border flex items-center gap-4 sticky top-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors shrink-0"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-ink">My Journal</h1>
          <p className="text-xs text-brand-ink/60">Private insights and reflections</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
        {entries.map((entry: any) => (
          <div key={entry.id} className="bg-brand-surface p-5 rounded-[1.5rem] shadow-sm border border-brand-border">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium text-brand-ink/50">{entry.date}</span>
              <span className="text-xs font-medium bg-brand-bg border border-brand-border px-2 py-1 rounded-md text-brand-rust flex items-center gap-1">
                <Activity size={12}/> {entry.mood}
              </span>
            </div>
            <p className="text-sm text-brand-ink leading-relaxed mb-4">{entry.summary}</p>
            {entry.techniques && entry.techniques.length > 0 && (
              <div className="bg-brand-bg p-3 rounded-xl border border-brand-border/50">
                <span className="text-[10px] font-semibold text-brand-ink/70 uppercase tracking-wider mb-2 block">Suggested Techniques</span>
                <ul className="text-sm text-brand-ink space-y-1.5">
                  {entry.techniques.map((t: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-rust rounded-full"></div>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-brand-ink/20 mb-4" />
            <p className="text-brand-ink/60 text-sm">Your journal is empty.</p>
            <p className="text-brand-ink/40 text-xs mt-1">Chat with Maan to generate insights.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityFeedScreen({ onBack }: { onBack: () => void }) {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleInteract = () => {
    setShowAuthPrompt(true);
    setTimeout(() => setShowAuthPrompt(false), 3000);
  };

  const FEED_POSTS = [
    {
      id: 1,
      author: "Anonymous Sister",
      time: "2 hours ago",
      tag: "Social Withdrawal",
      aiSummary: "Concerned about brother's 3-week social withdrawal and parents' misinterpretation as laziness. Seeking advice on bridging the communication gap.",
      content: "My brother hasn't left his room in weeks. My parents keep telling him to 'just go outside and get fresh air' and think he is just being lazy. I know it's something deeper but I don't know how to bridge the gap between them.",
      meTooCount: 124,
      proResponses: 2
    },
    {
      id: 2,
      author: "Anonymous Son",
      time: "5 hours ago",
      tag: "Academic Pressure",
      aiSummary: "Experiencing severe pressure to succeed. Fears family will perceive need for therapy as a failure. Looking for ways to initiate conversation.",
      content: "The pressure to succeed and provide is crushing me. If I tell my family I need therapy, they will think they failed as parents or that I am broken. How do you start this conversation?",
      meTooCount: 89,
      proResponses: 1
    },
    {
      id: 3,
      author: "Anonymous Mother",
      time: "1 day ago",
      tag: "Stigma & Resistance",
      aiSummary: "Husband is resistant to seeking counseling for daughter due to stigma around 'airing dirty laundry'. Mother feels stuck.",
      content: "I suggested to my husband that we see a counselor for our daughter. He got very angry and said 'we don't air our dirty laundry to strangers'. I feel so stuck.",
      meTooCount: 210,
      proResponses: 4
    }
  ];

  return (
    <div className="flex flex-col h-full bg-brand-bg relative">
      {/* Auth Prompt Toast */}
      {showAuthPrompt && (
        <div className="absolute top-24 left-4 right-4 bg-brand-ink text-white p-4 rounded-2xl shadow-xl z-50 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <Lock size={20} className="text-brand-rust shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm mb-1">Create an account to interact</p>
            <p className="text-xs text-white/70">Join the community to save stories, say "Ma Pani", and connect with professionals.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-brand-bg/90 backdrop-blur-md z-10 px-6 py-6 border-b border-brand-border sticky top-0">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="w-10 h-10 bg-brand-rust text-white rounded-full flex items-center justify-center font-serif text-xl shadow-sm">
            S
          </div>
        </div>
        <h1 className="font-serif text-3xl font-semibold text-brand-ink mb-1">Chautari / Ma Pani</h1>
        <p className="text-brand-ink/60 text-sm">"Me Too" — You are not alone in this.</p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-b border-brand-border/50">
        <button className="px-4 py-2 rounded-full bg-brand-ink text-white text-xs font-medium whitespace-nowrap shadow-sm">
          All Stories
        </button>
        <button className="px-4 py-2 rounded-full bg-brand-surface border border-brand-border text-brand-ink text-xs font-medium whitespace-nowrap hover:bg-brand-surface-alt transition-colors">
          Family Dynamics
        </button>
        <button className="px-4 py-2 rounded-full bg-brand-surface border border-brand-border text-brand-ink text-xs font-medium whitespace-nowrap hover:bg-brand-surface-alt transition-colors">
          Academic Pressure
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-20">
        {FEED_POSTS.map((post) => (
          <div key={post.id} className="bg-brand-surface rounded-[1.5rem] p-5 border border-brand-border shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-rust/10 flex items-center justify-center">
                  <Users size={14} className="text-brand-rust" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-ink">{post.author}</p>
                  <p className="text-[10px] text-brand-ink/40">{post.time}</p>
                </div>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-brand-ink/50 bg-brand-bg px-2 py-1 rounded-md border border-brand-border">
                {post.tag}
              </span>
            </div>
            
            {/* AI Summary Block */}
            <div className="bg-brand-bg rounded-xl p-4 mb-4 border border-brand-border/50 relative">
              <div className="flex items-center gap-1.5 mb-2 text-brand-rust">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">AI Summary</span>
              </div>
              <p className="text-sm text-brand-ink/90 font-medium leading-relaxed">
                {post.aiSummary}
              </p>
            </div>

            {/* Full Story Snippet */}
            <div className="px-1 mb-4">
              <p className="text-sm text-brand-ink/60 leading-relaxed italic line-clamp-2">
                "{post.content}"
              </p>
              <button className="text-xs font-medium text-brand-rust mt-1 hover:underline">Read full story</button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-brand-border/60">
              <button 
                onClick={handleInteract}
                className="flex items-center gap-1.5 text-brand-ink/50 hover:text-brand-rust transition-colors"
              >
                <Heart size={16} />
                <span className="text-xs font-medium">{post.meTooCount} Ma Pani</span>
              </button>
              <button 
                onClick={handleInteract}
                className="flex items-center gap-1.5 text-brand-green hover:text-brand-green/80 transition-colors bg-brand-green-light/30 px-3 py-1.5 rounded-full"
              >
                <ShieldCheck size={14} />
                <span className="text-xs font-medium">{post.proResponses} Pro Responses</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Floating Action Button (Prompts Auth) */}
      <button 
        onClick={handleInteract}
        className="absolute bottom-4 right-6 w-14 h-14 bg-brand-rust text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand-rust/90 transition-colors z-20"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </div>
  );
}

function AiChatScreen({ context, onBack, onExplore, onConsult, onSaveJournal }: { context: string, onBack: () => void, onExplore: () => void, onConsult: () => void, onSaveJournal: (summary: string, mood: string, techniques: string[]) => void }) {
  const [messages, setMessages] = useState<{role: 'ai' | 'user' | 'action', text?: string, actions?: any[]}[]>([
    { role: 'ai', text: "Namaste, sathi\n\nSomething brought you here today. You do not have to explain it perfectly — just start anywhere." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechLang, setSpeechLang] = useState<'en-US' | 'ne-NP'>('en-US');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      // Language is set dynamically in toggleRecording

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        if (finalTranscript) {
          setInputValue(prev => prev + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = speechLang;
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.error("Could not start recording", e);
        }
      } else {
        alert("Voice input is not supported in this browser. Please type your message instead.");
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: 'user' as const, text }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Filter out action messages and format for Gemini
      const chatHistory = newMessages
        .filter(m => m.role === 'user' || m.role === 'ai')
        .map(m => ({
          role: m.role === 'ai' ? 'model' as const : 'user' as const,
          text: m.text || ''
        }));

      const responseText = await generateChatResponse(chatHistory, context);

      const actions = [
        { id: 'community', icon: <Users size={16} />, title: 'See community stories', subtitle: 'Others have been here too' },
        { id: 'consult', icon: <Calendar size={16} />, title: 'Talk to a professional', subtitle: "When you're ready — no pressure" },
        { id: 'journal', icon: <BookOpen size={16} />, title: 'End & Save to Journal', subtitle: "Generate private insights" },
        { id: 'continue', icon: <Edit3 size={16} />, title: 'Keep sharing', subtitle: "Tell me more, I'm listening" }
      ];

      if (context === 'share' && newMessages.length > 2) {
        actions.unshift({ id: 'post', icon: <MessageCircle size={16} />, title: 'Post to Chautari', subtitle: "Share your story anonymously" });
      }

      setMessages(prev => [
        ...prev, 
        { role: 'ai', text: responseText },
        {
          role: 'action',
          actions
        }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: "I'm sorry, I'm having trouble connecting right now. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (actionId: string) => {
    if (actionId === 'community') onExplore();
    if (actionId === 'consult') onConsult();
    if (actionId === 'journal') {
      // In a real app, we would ask AI to generate these based on chat history
      onSaveJournal(
        "Discussed current feelings and explored some initial thoughts. The AI provided a safe space to vent and offered gentle guidance.",
        "Reflective",
        ["Grounding Exercise", "Journaling"]
      );
    }
    if (actionId === 'post') {
      setMessages(prev => [...prev, { role: 'ai', text: "I've created a summary of our conversation. You can review it before posting to Chautari." }]);
      // In a real app, this would open a modal to review the AI summary and post
    }
    if (actionId === 'continue') {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm here. What else is on your mind?" }]);
    }
  };

  const initialPrompts = [
    "I feel empty but I do not know why",
    "I smile on the outside but inside I am exhausted",
    "I cannot sleep. My chest feels heavy every night.",
    "I do not know what I am doing with my life"
  ];

  return (
    <div className="flex flex-col h-full bg-brand-bg relative">
      {/* Header */}
      <div className="bg-brand-bg/90 backdrop-blur-md z-10 px-4 py-4 border-b border-brand-border flex items-center justify-between sticky top-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="font-serif text-lg font-semibold text-brand-ink flex items-center gap-2">
            Maan • मन
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-brand-green"></div>
          <span className="text-[10px] font-medium text-brand-green uppercase tracking-wider">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 1 && (
          <div className="flex flex-col items-center text-center mb-8 mt-4">
            <div className="w-16 h-16 bg-brand-rust/80 text-white rounded-full flex items-center justify-center font-serif text-2xl mb-4 shadow-sm">
              म
            </div>
            <p className="text-brand-green text-xs font-medium mb-2">Understanding myself</p>
            <h2 className="font-serif text-2xl font-semibold text-brand-ink mb-2">Namaste, sathi</h2>
            <p className="text-sm text-brand-ink/70 max-w-[260px]">
              Something brought you here today. You do not have to explain it perfectly — just start anywhere.
            </p>
            <p className="text-brand-ink/40 mt-2 max-w-[260px]" style={{ fontSize: '10px' }}>
              Maan helps organize your thoughts — it does not diagnose or replace professional care.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => {
          if (msg.role === 'action') {
            return (
              <div key={idx} className="bg-brand-surface rounded-[1.5rem] p-4 border border-brand-border shadow-sm space-y-2">
                {msg.actions?.map(action => (
                  <button 
                    key={action.id}
                    onClick={() => handleAction(action.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-brand-bg transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-rust shrink-0">
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-ink">{action.title}</p>
                      <p className="text-[10px] text-brand-ink/60">{action.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            );
          }

          if (idx === 0) return null; // Skip the first AI message as it's rendered as a header initially

          return (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-[1.5rem] p-4 ${msg.role === 'user' ? 'bg-brand-rust/80 text-white rounded-br-sm' : 'bg-brand-surface border border-brand-border text-brand-ink rounded-bl-sm shadow-sm'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {messages.length === 1 && (
          <div className="space-y-3 mt-8">
            {initialPrompts.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-4 text-left transition-colors shadow-sm text-sm text-brand-ink/80 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-[1.5rem] p-4 bg-brand-surface border border-brand-border text-brand-ink rounded-bl-sm shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-rust/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-brand-rust/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-brand-rust/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-brand-bg border-t border-brand-border">
        {isRecording ? (
          <div className="flex items-center gap-3 bg-red-50 rounded-[2rem] border border-red-100 p-2 shadow-sm">
            <div className="flex-1 flex items-center gap-3 pl-4">
              <div className="flex gap-1 items-center h-4">
                <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
              </div>
              <span className="text-sm font-medium text-red-500">Listening... (Nepali or English)</span>
            </div>
            <button 
              onClick={toggleRecording}
              className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shrink-0 shadow-sm"
            >
              <Square size={16} fill="currentColor" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-brand-surface rounded-[2rem] border border-brand-border p-1 pl-2 shadow-sm">
            <button
              onClick={() => setSpeechLang(prev => prev === 'en-US' ? 'ne-NP' : 'en-US')}
              className="text-[10px] font-bold text-brand-rust uppercase tracking-wider px-2 py-1.5 bg-brand-bg rounded-full border border-brand-border/50 hover:bg-brand-surface-alt transition-colors shrink-0"
              title="Toggle Speech Language"
            >
              {speechLang === 'en-US' ? 'EN' : 'NE'}
            </button>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              disabled={isLoading}
              placeholder="Share what's on your mind..."
              className="flex-1 bg-transparent text-sm text-brand-ink placeholder:text-brand-ink/40 focus:outline-none py-2 disabled:opacity-50"
            />
            {inputValue.trim() ? (
              <button 
                onClick={() => handleSend(inputValue)}
                disabled={isLoading}
                className="w-10 h-10 rounded-full bg-brand-rust/80 text-white flex items-center justify-center hover:bg-brand-rust transition-colors shrink-0 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            ) : (
              <button 
                onClick={toggleRecording}
                disabled={isLoading}
                className="w-10 h-10 rounded-full bg-brand-surface-alt border border-brand-border text-brand-ink flex items-center justify-center hover:bg-brand-border transition-colors shrink-0 disabled:opacity-50"
              >
                <Mic size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardScreen({ onViewBrief }: { onViewBrief: (id: string) => void }) {
  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-end mb-8 mt-4">
        <div>
          <p className="text-brand-rust font-medium text-sm mb-1 italic">Today's Queue</p>
          <h1 className="font-serif text-3xl font-semibold text-brand-ink">Namaste, Dr. Sharma</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center shadow-sm">
          <Calendar size={18} className="text-brand-ink/60" />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        <button className="px-5 py-2 rounded-full bg-brand-ink text-white text-sm font-medium whitespace-nowrap shadow-sm">
          Needs Review (1)
        </button>
        <button className="px-5 py-2 rounded-full bg-brand-surface border border-brand-border text-brand-ink/70 text-sm font-medium whitespace-nowrap hover:bg-brand-surface-alt transition-colors">
          Upcoming (3)
        </button>
        <button className="px-5 py-2 rounded-full bg-brand-surface border border-brand-border text-brand-ink/70 text-sm font-medium whitespace-nowrap hover:bg-brand-surface-alt transition-colors">
          Completed
        </button>
      </div>

      <div className="space-y-4">
        {CONSULTATIONS.map((consult) => (
          <div 
            key={consult.id} 
            className="bg-brand-surface rounded-[1.5rem] p-5 border border-brand-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onViewBrief(consult.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-brand-ink">{consult.clientName}</h3>
                {consult.isFamily && (
                  <p className="text-xs font-medium text-brand-ink/60 mt-0.5">
                    Consulting regarding: <span className="text-brand-ink">{consult.subjectName}</span>
                  </p>
                )}
              </div>
              <span className="text-xs font-medium text-brand-ink/50 bg-brand-surface-alt px-2 py-1 rounded-md whitespace-nowrap ml-2">
                {consult.time}
              </span>
            </div>
            
            <div className="mb-4 mt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                consult.isFamily 
                  ? 'bg-brand-green-light text-[#3A4A36]' 
                  : 'bg-brand-rust-light text-[#5A3A30]'
              }`}>
                {consult.isFamily ? <Users size={12} /> : <Home size={12} />}
                {consult.type}
              </span>
            </div>

            <p className="text-sm text-brand-ink/70 line-clamp-2 leading-relaxed mb-4">
              <span className="font-medium text-brand-ink">AI Summary:</span> {consult.summary}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-brand-border/60">
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-rust">
                <AlertCircle size={14} />
                {consult.status}
              </span>
              <button className="flex items-center gap-1 text-sm font-medium text-brand-ink hover:text-brand-rust transition-colors">
                Review Brief <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleScreen() {
  const days = [
    { day: 'Mon', date: '12', active: false },
    { day: 'Tue', date: '13', active: false },
    { day: 'Wed', date: '14', active: true },
    { day: 'Thu', date: '15', active: false },
    { day: 'Fri', date: '16', active: false },
  ];

  return (
    <div className="p-6 pb-24">
      <div className="mb-8 mt-4">
        <h1 className="font-serif text-3xl font-semibold text-brand-ink">Schedule</h1>
        <p className="text-brand-ink/60 text-sm mt-1">Manage your availability and bookings.</p>
      </div>

      {/* Week View */}
      <div className="flex justify-between mb-8">
        {days.map((d, i) => (
          <div key={i} className={`flex flex-col items-center p-3 rounded-2xl min-w-[3rem] ${d.active ? 'bg-brand-rust text-white shadow-md' : 'bg-brand-surface border border-brand-border text-brand-ink/60'}`}>
            <span className="text-[10px] uppercase font-semibold tracking-wider mb-1">{d.day}</span>
            <span className={`font-serif text-xl ${d.active ? 'text-white' : 'text-brand-ink'}`}>{d.date}</span>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-semibold text-brand-ink mb-4">Wednesday, Oct 14</h3>
        
        <div className="flex gap-4 items-start">
          <div className="w-16 text-right text-xs font-medium text-brand-ink/40 pt-3">09:00 AM</div>
          <div className="flex-1 bg-brand-surface-alt border border-brand-border border-dashed rounded-xl p-4 text-center text-sm text-brand-ink/50">
            Available Slot
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-16 text-right text-xs font-medium text-brand-ink/40 pt-3">10:00 AM</div>
          <div className="flex-1 bg-brand-green-light/50 border border-brand-green/30 rounded-xl p-4">
            <p className="font-semibold text-brand-ink text-sm">Sita, 34</p>
            <p className="text-xs text-brand-ink/60 mt-1">Family Guidance</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-16 text-right text-xs font-medium text-brand-ink/40 pt-3">11:00 AM</div>
          <div className="flex-1 bg-brand-surface-alt border border-brand-border border-dashed rounded-xl p-4 text-center text-sm text-brand-ink/50">
            Available Slot
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-16 text-right text-xs font-medium text-brand-ink/40 pt-3">11:30 AM</div>
          <div className="flex-1 bg-brand-rust-light/50 border border-brand-rust/30 rounded-xl p-4">
            <p className="font-semibold text-brand-ink text-sm">Ram, 28</p>
            <p className="text-xs text-brand-ink/60 mt-1">Individual Intake</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-start mb-8 mt-4">
        <h1 className="font-serif text-3xl font-semibold text-brand-ink">Profile</h1>
        <button className="text-sm font-medium text-brand-rust hover:underline">Edit</button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-brand-surface border-4 border-white shadow-md flex items-center justify-center mb-4 overflow-hidden">
          <img src="https://picsum.photos/seed/doctor/200/200" alt="Dr. Sharma" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-brand-ink">Dr. Anjali Sharma</h2>
        <p className="text-sm text-brand-ink/60 mt-1">Clinical Psychologist · Kathmandu</p>
      </div>

      {/* Cultural Competencies (The SAHARA Differentiator) */}
      <div className="bg-brand-surface rounded-[1.5rem] p-5 border border-brand-border shadow-sm mb-6">
        <h3 className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wider mb-4">Cultural & Clinical Focus</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-brand-bg rounded-lg text-xs font-medium text-brand-ink border border-brand-border">🇳🇵 Fluent Nepali</span>
          <span className="px-3 py-1.5 bg-brand-bg rounded-lg text-xs font-medium text-brand-ink border border-brand-border">🇬🇧 Fluent English</span>
          <span className="px-3 py-1.5 bg-brand-rust-light/50 rounded-lg text-xs font-medium text-[#5A3A30] border border-brand-rust/20">Family Systems</span>
          <span className="px-3 py-1.5 bg-brand-green-light/50 rounded-lg text-xs font-medium text-[#3A4A36] border border-brand-green/20">Intergenerational Trauma</span>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8 px-2">
        <h3 className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wider mb-2">About</h3>
        <p className="text-sm text-brand-ink/80 leading-relaxed">
          Specializing in bridging the gap between traditional family expectations and modern mental health needs. I work closely with families to build understanding before crisis hits.
        </p>
      </div>

      {/* Client Impact (Simplified) */}
      <div className="bg-brand-surface rounded-[1.5rem] p-5 border border-brand-border shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wider">Client Impact</h3>
          <span className="flex items-center gap-1.5 text-sm font-medium text-brand-ink">
            <span className="text-brand-rust text-lg leading-none">★</span> 
            4.9 
            <span className="text-brand-ink/40 font-normal ml-1">(124 sessions)</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ClientsScreen({ onViewClient }: { onViewClient: (id: string) => void }) {
  return (
    <div className="p-6 pb-24">
      <div className="mb-6 mt-4">
        <h1 className="font-serif text-3xl font-semibold text-brand-ink">Clients</h1>
        <p className="text-brand-ink/60 text-sm mt-1">Manage your active and past consultations.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-brand-surface rounded-2xl p-1 border border-brand-border shadow-sm mb-6 flex items-center px-3">
        <div className="text-brand-ink/40 mr-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input 
          type="text" 
          placeholder="Search clients..." 
          className="w-full bg-transparent py-3 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:outline-none"
        />
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {CLIENT_ROSTER.map((client) => (
          <div 
            key={client.id}
            onClick={() => onViewClient(client.id)}
            className="bg-brand-surface rounded-2xl p-4 border border-brand-border shadow-sm flex items-center justify-between cursor-pointer hover:bg-brand-surface-alt transition-colors"
          >
            <div>
              <h3 className="font-serif text-lg font-semibold text-brand-ink">{client.name}</h3>
              <p className="text-xs text-brand-ink/60 mt-0.5">{client.type}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-brand-ink/50 mb-1">Last: {client.lastSession}</p>
              <div className="flex justify-end">
                <ArrowRight size={16} className="text-brand-rust" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientDetailScreen({ client, onBack }: { client: any, onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-brand-bg">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-brand-bg/90 backdrop-blur-md z-10 px-4 py-4 border-b border-brand-border flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="font-serif text-lg font-semibold text-brand-ink">{client.name}</h2>
        </div>
        <div className="w-10 h-10"></div> {/* Spacer */}
      </div>

      <div className="p-6 pb-24 overflow-y-auto">
        
        {/* Client Meta */}
        <div className="bg-brand-surface rounded-[1.5rem] p-5 border border-brand-border shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-ink/40 mb-1">Consultation Type</p>
              <p className="text-sm font-medium text-brand-ink">{client.type}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-ink/40 mb-1">Total Sessions</p>
              <p className="text-sm font-medium text-brand-ink">{client.totalSessions}</p>
            </div>
          </div>
          {client.subject !== 'Self' && (
            <div className="pt-4 border-t border-brand-border/60">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-ink/40 mb-1">Subject of Concern</p>
              <p className="text-sm font-medium text-brand-ink">{client.subject}</p>
            </div>
          )}
        </div>

        {/* Shared Context (Ma Pani Integration) */}
        {client.sharedPosts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-serif text-lg font-semibold text-brand-ink">Shared Context</h3>
              <span className="flex items-center gap-1 text-[10px] font-medium text-brand-green uppercase tracking-wider bg-brand-green-light/50 px-2 py-1 rounded-md">
                <Lock size={10} /> Shared with consent
              </span>
            </div>
            <p className="text-xs text-brand-ink/60 mb-4 px-1">
              The client explicitly opted to share these anonymous community posts with you during intake.
            </p>
            
            <div className="space-y-3">
              {client.sharedPosts.map((post: any, idx: number) => (
                <div key={idx} className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-rust/30"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-semibold text-brand-ink/40 uppercase tracking-wider">{post.community}</span>
                    <span className="text-[10px] text-brand-ink/40">{post.date}</span>
                  </div>
                  <p className="text-sm text-brand-ink/80 leading-relaxed italic">
                    "{post.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Notes Placeholder */}
        <div>
          <h3 className="font-serif text-lg font-semibold text-brand-ink mb-3 px-1">Private Notes</h3>
          <div className="bg-brand-surface rounded-2xl p-4 border border-brand-border border-dashed text-center">
            <p className="text-sm text-brand-ink/50 mb-3">No private notes recorded yet.</p>
            <button className="text-sm font-medium text-brand-rust hover:underline">
              + Add Clinical Note
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function PatientBriefScreen({ consult, onBack }: { consult: any, onBack: () => void }) {
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  return (
    <div className="flex flex-col h-full bg-brand-surface">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-brand-surface/90 backdrop-blur-md z-10 px-4 py-4 border-b border-brand-border flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-brand-surface-alt flex items-center justify-center text-brand-ink hover:bg-brand-border transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="font-serif text-lg font-semibold text-brand-ink">Client: {consult.clientName}</h2>
          <p className="text-xs text-brand-ink/50 font-medium">{consult.time}</p>
        </div>
        <div className="w-10 h-10"></div> {/* Spacer for centering */}
      </div>

      <div className="p-6 pb-24 overflow-y-auto">
        
        {/* Context Tags */}
        <div className="mb-6 flex flex-col gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-ink/40 mb-1.5">Consultation Type</p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
              consult.isFamily 
                ? 'bg-brand-green-light text-[#3A4A36]' 
                : 'bg-brand-rust-light text-[#5A3A30]'
            }`}>
              {consult.isFamily ? <Users size={16} /> : <Home size={16} />}
              {consult.type}
            </div>
          </div>
          
          {consult.isFamily && (
            <div className="bg-brand-surface-alt rounded-xl p-3 border border-brand-border">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-ink/50 mb-1">Subject of Concern</p>
              <p className="text-sm font-medium text-brand-ink">{consult.subjectName}</p>
            </div>
          )}
        </div>

        {/* AI Summary Card */}
        <div className="bg-brand-bg rounded-[1.5rem] p-6 border border-brand-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-rust/10 text-brand-rust flex items-center justify-center">
              <FileText size={16} />
            </div>
            <h3 className="font-serif text-xl font-semibold text-brand-ink">AI Summary</h3>
          </div>
          <p className="text-brand-ink/80 text-base leading-relaxed mb-6">
            {consult.summary}
          </p>
          
          <div className="bg-brand-surface rounded-xl p-4 border border-brand-border/60">
            <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wider mb-2">Community Resonance</p>
            <p className="text-sm font-medium text-brand-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              {consult.evidence}
            </p>
          </div>
        </div>

        {/* Raw Transcript Snippet */}
        <div className="bg-brand-surface rounded-[1.5rem] p-6 border border-brand-border mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-surface-alt text-brand-ink/60 flex items-center justify-center">
              <MessageCircle size={16} />
            </div>
            <h3 className="font-serif text-lg font-semibold text-brand-ink">Client's Intake Words</h3>
          </div>
          <div className="pl-4 border-l-2 border-brand-rust/30 italic text-brand-ink/70 text-base leading-relaxed">
            "{consult.transcriptPreview}"
          </div>
          <button className="mt-4 text-sm font-medium text-brand-rust hover:underline">
            View full intake transcript
          </button>
        </div>

        {/* AI Feedback Loop */}
        <div className="bg-[#3A2E2B] rounded-[1.5rem] p-6 text-white shadow-lg">
          <h4 className="font-serif text-lg font-semibold mb-2">Help SAHARA Learn</h4>
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            Does this AI summary accurately reflect the clinical reality of your consultation?
          </p>
          
          {feedbackGiven ? (
            <div className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
              <p className="text-sm font-medium text-brand-green-light flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> Feedback recorded. Thank you.
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => setFeedbackGiven('up')}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl py-3 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
              >
                <ThumbsUp size={16} /> Accurate
              </button>
              <button 
                onClick={() => setFeedbackGiven('down')}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl py-3 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
              >
                <ThumbsDown size={16} /> Missed Nuance
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
