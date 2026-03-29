import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, Lock, FileText, Calendar, Users, Home, ThumbsUp, ThumbsDown, ArrowRight, ChevronLeft, MessageCircle, AlertCircle, Heart, UserPlus, Eye, Sparkles, Send, User, Edit3, Phone, Mic, Square, BookOpen, Activity, Info, Shield, Globe, Bot, BarChart3, LogOut, Sun, Moon } from 'lucide-react';
import { generateChatResponse, generateObservationSummary } from './services/geminiService';

// --- LANGUAGE STRINGS ---
type Language = 'en' | 'ne';

const STRINGS: Record<Language, Record<string, string>> = {
  en: {
    'welcome.headline': 'You are not alone.',
    'welcome.mapani': 'Ma Pani.',
    'welcome.subtitle': 'A safe, culturally grounded space for you and your family to find understanding and care.',
    'welcome.createAccount': 'Create Account',
    'welcome.login': 'Log In',
    'welcome.explore': 'Explore Anonymously',
    'home.nepali': 'आज मनमा के छ?',
    'home.heading': 'What brings you here today?',
    'home.subheading': 'A quiet space. No labels, no judgment.',
    'home.door.family.title': "I'm concerned about someone I love",
    'home.door.family.desc': 'For family members who noticed a change',
    'home.door.self.title': 'I want to understand myself better',
    'home.door.self.desc': 'A private conversation with Maan',
    'home.door.share.title': 'Share your experience',
    'home.door.share.desc': 'Your words could help someone going through the same thing.',
    'home.community': 'From the community',
    'home.relate': 'relate',
    'chat.title': 'Maan',
    'chat.active': 'Active now',
    'chat.placeholder': "Share what's on your mind...",
    'chat.greeting.family': "You're here because you care about someone. That already matters.",
    'chat.greeting.family.sub': 'Tell me what you have noticed — there are no wrong words here.',
    'chat.greeting.self': 'This is your space. No labels, no rush.',
    'chat.greeting.self.sub': "What's been on your mind?",
    'chat.greeting.share': 'Your experience could help someone who feels alone right now.',
    'chat.greeting.share.sub': 'Share what feels right.',
    'chautari.title': 'Chautari',
    'chautari.subtitle': '"Me Too" — You are not alone in this.',
    'chautari.shareCta': "What's on your mind?",
    'chautari.share': 'Share',
    'chautari.maPani': 'Ma Pani',
    'chautari.filter.all': 'All Stories',
    'chautari.signUpToShare': 'Sign up to share your experience',
    'journal.title': 'My Journal',
    'journal.subtitle': 'Private insights and reflections',
    'consultation.title': 'Connect with a Professional',
    'consultation.subtitle': 'Licensed professionals who understand your culture and context.',
    'nav.home': 'Home',
    'nav.chautari': 'Chautari',
    'nav.journal': 'Journal',
    'nav.consultation': 'Consult',
    'help.title': 'Help & Support',
    'help.crisis.nepal': 'Nepal: 1166',
    'help.crisis.nepal.desc': 'National Mental Health Helpline',
    'help.crisis.us': 'US: 988',
    'help.crisis.us.desc': 'Suicide & Crisis Lifeline',
    'auth.join': 'Join the community',
    'auth.joinDesc': 'Create a free account to relate to stories, share experiences, and save your journal.',
    'auth.createFree': 'Create Free Account',
    'auth.continueBrowsing': 'Continue browsing',
    'auth.guestLabel': 'Browsing anonymously',
    'auth.signUpToRelate': 'Sign up to relate',
  },
  ne: {
    'welcome.headline': 'तपाईं एक्लो हुनुहुन्न।',
    'welcome.mapani': 'म पनि।',
    'welcome.subtitle': 'तपाईं र तपाईंको परिवारको लागि एक सुरक्षित, सांस्कृतिक रूपमा जोडिएको ठाउँ।',
    'welcome.createAccount': 'खाता बनाउनुहोस्',
    'welcome.login': 'लग इन',
    'welcome.explore': 'अज्ञात रूपमा हेर्नुहोस्',
    'home.nepali': 'आज मनमा के छ?',
    'home.heading': 'आज तपाईंलाई यहाँ के ल्यायो?',
    'home.subheading': 'एक शान्त ठाउँ। कुनै लेबल छैन, कुनै निर्णय छैन।',
    'home.door.family.title': 'मलाई मेरो माया गर्ने मान्छेको चिन्ता छ',
    'home.door.family.desc': 'परिवर्तन देख्ने परिवारका सदस्यको लागि',
    'home.door.self.title': 'म आफैंलाई राम्रोसँग बुझ्न चाहन्छु',
    'home.door.self.desc': 'माँनसँग एक निजी कुराकानी',
    'home.door.share.title': 'आफ्नो अनुभव साझा गर्नुहोस्',
    'home.door.share.desc': 'तपाईंको शब्दले उही बाटोमा हिँड्ने कसैलाई मद्दत गर्न सक्छ।',
    'home.community': 'समुदायबाट',
    'home.relate': 'जना',
    'chat.title': 'माँन',
    'chat.active': 'सक्रिय',
    'chat.placeholder': 'मनमा जे छ भन्नुहोस्...',
    'chat.greeting.family': 'तपाईं यहाँ हुनुहुन्छ किनभने तपाईं कसैको ख्याल राख्नुहुन्छ। त्यो आफैंमा ठूलो कुरा हो।',
    'chat.greeting.family.sub': 'तपाईंले के देख्नुभयो भन्नुहोस् — यहाँ कुनै गलत शब्द छैन।',
    'chat.greeting.self': 'यो तपाईंको ठाउँ हो। कुनै लेबल छैन, कुनै हतार छैन।',
    'chat.greeting.self.sub': 'मनमा के चलिरहेको छ?',
    'chat.greeting.share': 'तपाईंको अनुभवले एक्लो महसुस गर्ने कसैलाई मद्दत गर्न सक्छ।',
    'chat.greeting.share.sub': 'जे ठीक लाग्छ त्यो साझा गर्नुहोस्।',
    'chautari.title': 'चौतारी',
    'chautari.subtitle': '"म पनि" — तपाईं यसमा एक्लो हुनुहुन्न।',
    'chautari.shareCta': 'मनमा के छ?',
    'chautari.share': 'साझा',
    'chautari.maPani': 'म पनि',
    'chautari.filter.all': 'सबै कथा',
    'chautari.signUpToShare': 'साझा गर्न खाता बनाउनुहोस्',
    'journal.title': 'मेरो डायरी',
    'journal.subtitle': 'निजी अन्तरदृष्टि र प्रतिबिम्ब',
    'consultation.title': 'पेशेवर खोज्नुहोस्',
    'consultation.subtitle': 'सांस्कृतिक रूपमा जोडिएको, व्यावसायिक रूपमा प्रशिक्षित।',
    'nav.home': 'घर',
    'nav.chautari': 'चौतारी',
    'nav.journal': 'डायरी',
    'nav.consultation': 'परामर्श',
    'help.title': 'मद्दत',
    'help.crisis.nepal': 'नेपाल: ११६६',
    'help.crisis.nepal.desc': 'राष्ट्रिय मानसिक स्वास्थ्य हेल्पलाइन',
    'help.crisis.us': 'US: 988',
    'help.crisis.us.desc': 'आत्महत्या र संकट लाइफलाइन',
    'auth.join': 'समुदायमा सामेल हुनुहोस्',
    'auth.joinDesc': 'कथामा साथ दिन, अनुभव साझा गर्न, र डायरी सुरक्षित गर्न निःशुल्क खाता बनाउनुहोस्।',
    'auth.createFree': 'खाता बनाउनुहोस्',
    'auth.continueBrowsing': 'हेरिरहनुहोस्',
    'auth.guestLabel': 'अज्ञात रूपमा हेर्दै',
    'auth.signUpToRelate': 'साथ दिन खाता बनाउनुहोस्',
  }
};

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
  const [journalUnlocked, setJournalUnlocked] = useState(false);
  const [bookingStep, setBookingStep] = useState<'browse' | 'confirm' | 'done'>('browse');
  const [bookingType, setBookingType] = useState<string | null>(null);
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [autoStartMicNext, setAutoStartMicNext] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<{ summary: string; patterns: string[]; peerEvidence: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [dynamicConsultations, setDynamicConsultations] = useState(CONSULTATIONS);
  const [userType, setUserType] = useState<'guest' | 'user'>('guest');
  const [userName, setUserName] = useState<string>('');
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const t = useCallback((key: string) => STRINGS[language]?.[key] ?? key, [language]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    if (generatedSummary) {
      setDynamicConsultations(prev => prev.map(c =>
        c.id === '1' ? {
          ...c,
          summary: generatedSummary.summary,
          evidence: generatedSummary.peerEvidence,
          status: 'Needs Review'
        } : c
      ));
    }
  }, [generatedSummary]);

  const handleSaveJournal = (summary: string, mood: string, techniques: string[]) => {
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      mood,
      summary,
      techniques
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    setJournalUnlocked(true); // Auto-unlock after saving from Maan
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
    <div className="min-h-[100dvh] flex items-center justify-center sm:p-4 md:p-8 overflow-hidden">
      {/* Persistent theme toggle — always accessible on every screen */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 z-[200] w-8 h-8 rounded-full bg-brand-surface-alt border border-brand-border flex items-center justify-center text-brand-ink/60 hover:text-brand-ink transition-colors shadow-md"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      {/* Mobile Shell Container */}
      <div className="w-full h-[100dvh] max-w-md sm:h-[844px] sm:max-h-[min(90vh,844px)] sm:w-[390px] sm:min-w-[390px] bg-brand-bg sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative sm:border-[8px] sm:border-white shrink-0">
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative scrollbar-hide animate-page-in" key={currentView}>
          {currentView === 'demo-select' && <DemoSelectScreen onSelect={(role) => navigateTab(role === 'pro' ? 'login' : 'welcome')} onAdmin={() => setCurrentView('admin')} />}
          {currentView === 'welcome' && (
            <WelcomeScreen
              onCreateAccount={() => { setUserType('user'); setUserName('Sita'); navigateTab('user-home'); }}
              onLogin={() => { setUserType('user'); setUserName('Sita'); navigateTab('user-home'); }}
              onExplore={() => { setUserType('guest'); setUserName(''); navigateTab('user-home'); }}
              t={t}
            />
          )}
          {currentView === 'user-home' && <UserHomeScreen onStartChat={(ctx) => { setChatContext(ctx); setAutoStartMicNext(false); setCurrentView('ai-chat'); }} onExplore={() => setCurrentView('community-feed')} userType={userType} userName={userName} language={language} setLanguage={setLanguage} t={t} onLogout={() => setCurrentView('demo-select')} />}
          {currentView === 'admin' && <AdminDashboardScreen onBack={goBack} onLogout={() => setCurrentView('demo-select')} />}
          {currentView === 'ai-chat' && <AiChatScreen context={chatContext} onBack={goBack} onExplore={() => setCurrentView('community-feed')} onConsult={() => { setBookingType(chatContext === 'family' ? 'Family Guidance' : 'Individual Session'); setBookingStep('browse'); setCurrentView('user-consultation'); }} onSaveJournal={handleSaveJournal} onGenerateSummary={(msgs) => { setChatMessages(msgs); setCurrentView('user-summary'); }} autoStartMic={autoStartMicNext} />}
          {currentView === 'user-summary' && (
            <SummaryScreen
              context={chatContext}
              messages={chatMessages}
              generatedSummary={generatedSummary}
              setGeneratedSummary={setGeneratedSummary}
              onConsult={() => { setBookingType(chatContext === 'family' ? 'Family Guidance' : 'Individual Session'); setBookingStep('browse'); setCurrentView('user-consultation'); }}
              onBack={goBack}
              onHome={() => navigateTab('user-home')}
            />
          )}
          {currentView === 'community-feed' && <CommunityFeedScreen onBack={goBack} onStartShare={() => { setChatContext('share'); setAutoStartMicNext(false); setCurrentView('ai-chat'); }} userType={userType} userName={userName} onAuthRequired={() => setShowSignUpPrompt(true)} t={t} />}
          {currentView === 'user-journal' && (
            journalUnlocked
              ? <JournalScreen entries={journalEntries} onBack={goBack} onStartChat={() => { setChatContext('individual'); setAutoStartMicNext(true); setCurrentView('ai-chat'); }} />
              : <JournalPinScreen onUnlock={() => setJournalUnlocked(true)} onSkip={() => setJournalUnlocked(true)} onBack={goBack} />
          )}
          {currentView === 'login' && <LoginScreen onLogin={handleLogin} onBack={goBack} />}
          {currentView === 'queue' && <DashboardScreen consultations={dynamicConsultations} onViewBrief={handleViewBrief} onLogout={() => setCurrentView('demo-select')} />}
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
              consult={dynamicConsultations.find(c => c.id === selectedConsultId)!}
              onBack={goBack}
            />
          )}
          {currentView === 'user-consultation' && (
            <div className="flex flex-col h-full bg-brand-bg">
              {/* Header */}
              <div className="bg-brand-bg/90 backdrop-blur-md z-10 px-6 py-6 border-b border-brand-border sticky top-0">
                <h1 className="font-serif text-2xl font-semibold text-brand-ink">Connect with a Professional</h1>
                <p className="text-brand-ink/60 text-sm mt-1">Licensed professionals who understand your culture and context.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-5">
                {bookingStep === 'done' ? (
                  <div className="flex flex-col items-center text-center mt-8">
                    <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mb-4">
                      <ShieldCheck size={32} />
                    </div>
                    <h2 className="font-serif text-2xl font-semibold text-brand-ink mb-2">Consultation Booked</h2>
                    <p className="text-sm text-brand-ink/70 mb-1">Dr. Anjali Sharma</p>
                    <p className="text-sm font-medium text-brand-rust mb-1">{bookingTime}</p>
                    <p className="text-xs text-brand-ink/50 mb-6">{bookingType}</p>
                    <p className="text-xs text-brand-ink/50 mb-8 max-w-[260px]">You'll receive preparation guidance before your session. Your Maan conversation summary will be shared with the professional (with your consent).</p>
                    <button onClick={() => navigateTab('user-home')} className="w-full bg-brand-rust text-brand-on-rust rounded-2xl py-4 font-medium text-sm mb-3">Back to Home</button>
                    <button onClick={() => setCurrentView('community-feed')} className="w-full bg-brand-surface border border-brand-border text-brand-ink rounded-2xl py-4 font-medium text-sm">Continue Exploring</button>
                  </div>
                ) : (
                  <>
                    {/* Professional Card */}
                    <div className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-brand-rust/10 flex items-center justify-center font-serif text-brand-rust text-lg font-semibold shrink-0">AS</div>
                        <div className="flex-1">
                          <h3 className="font-serif text-lg font-semibold text-brand-ink">Dr. Anjali Sharma</h3>
                          <p className="text-xs text-brand-ink/60">Clinical Psychologist · Kathmandu</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-brand-ink/70 text-xs">★ 4.9</span>
                            <span className="text-[10px] text-brand-ink/50">(124 sessions)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['Fluent Nepali', 'Family Systems', 'Intergenerational Trauma'].map(tag => (
                          <span key={tag} className="text-[10px] font-medium bg-brand-green/10 text-brand-green px-2 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <p className="text-sm text-brand-ink/70 leading-relaxed italic">"Specializing in bridging the gap between traditional family expectations and modern mental health needs."</p>
                    </div>

                    {/* Choose Type */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/50 mb-3">Session Type</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setBookingType('Family Guidance')}
                          className={`p-4 rounded-2xl border text-left transition-colors ${bookingType === 'Family Guidance' ? 'bg-brand-green/10 border-brand-green' : 'bg-brand-surface border-brand-border hover:bg-brand-surface-alt'}`}
                        >
                          <Users size={18} className={`${bookingType === 'Family Guidance' ? 'text-brand-green' : 'text-brand-ink/50'} mb-2`} />
                          <p className="text-xs font-semibold text-brand-ink">Family Guidance</p>
                          <p className="text-[10px] text-brand-ink/50 mt-0.5">For someone you care about</p>
                        </button>
                        <button
                          onClick={() => setBookingType('Individual Session')}
                          className={`p-4 rounded-2xl border text-left transition-colors ${bookingType === 'Individual Session' ? 'bg-brand-rust/10 border-brand-rust' : 'bg-brand-surface border-brand-border hover:bg-brand-surface-alt'}`}
                        >
                          <User size={18} className={`${bookingType === 'Individual Session' ? 'text-brand-rust' : 'text-brand-ink/50'} mb-2`} />
                          <p className="text-xs font-semibold text-brand-ink">Individual Session</p>
                          <p className="text-[10px] text-brand-ink/50 mt-0.5">For personal support</p>
                        </button>
                      </div>
                    </div>

                    {/* Choose Time */}
                    {bookingType && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/50 mb-3">Available Times</h3>
                        <div className="space-y-2">
                          {['Tomorrow, 10:00 AM', 'Tomorrow, 2:00 PM', 'March 30, 11:00 AM', 'March 30, 4:00 PM'].map(slot => (
                            <button
                              key={slot}
                              onClick={() => setBookingTime(slot)}
                              className={`w-full p-4 rounded-2xl border text-left text-sm transition-colors ${bookingTime === slot ? 'bg-brand-rust/10 border-brand-rust text-brand-ink font-medium' : 'bg-brand-surface border-brand-border text-brand-ink/70 hover:bg-brand-surface-alt'}`}
                            >
                              <Calendar size={14} className="inline mr-2" />{slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Book Button */}
                    {bookingType && bookingTime && (
                      <div>
                        <button
                          onClick={() => { if (userType === 'guest') { setShowSignUpPrompt(true); return; } setBookingStep('done'); }}
                          className="w-full bg-brand-rust text-brand-on-rust rounded-2xl py-4 font-medium text-sm shadow-md hover:bg-brand-rust/90 transition-colors"
                        >
                          Book Consultation
                        </button>
                        <p className="text-[10px] text-brand-ink/50 text-center mt-3 leading-relaxed">
                          Consultations are guidance sessions, not diagnostic appointments. NPR 500-1000 / $5-11 per session.
                        </p>
                      </div>
                    )}

                    {/* What to Expect */}
                    <div className="bg-brand-bg rounded-2xl p-4 border border-brand-border/50">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/50 mb-3">What to Expect</h3>
                      <div className="space-y-3">
                        {[
                          { icon: <MessageCircle size={14} />, text: 'Your Maan conversation summary is shared with your consent' },
                          { icon: <Eye size={14} />, text: 'The professional reviews your context before the session' },
                          { icon: <Activity size={14} />, text: 'Sessions are 30-45 minutes via video call' },
                          { icon: <Lock size={14} />, text: 'Everything discussed is confidential' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="text-brand-green mt-0.5 shrink-0">{item.icon}</div>
                            <p className="text-xs text-brand-ink/60 leading-relaxed">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {currentView === 'user-help' && <HelpScreen onBack={goBack} onHome={() => navigateTab('user-home')} />}
        </div>

        {/* Bottom Navigation (User) */}
        {['user-home', 'community-feed', 'user-consultation', 'user-journal'].includes(currentView) && (
          <nav aria-label="Main navigation" className="absolute bottom-0 w-full z-50 bg-brand-bg/85 backdrop-blur-xl border-t border-brand-border/50 px-6 py-4 flex justify-between items-center pb-8">
            <button
              aria-current={currentView === 'user-home' ? 'page' : undefined}
              onClick={() => navigateTab('user-home')}
              className={`flex flex-col items-center transition-colors ${currentView === 'user-home' ? 'text-brand-rust' : 'text-brand-ink/50 hover:text-brand-ink'}`}
            >
              <Home size={24} strokeWidth={currentView === 'user-home' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{t('nav.home')}</span>
            </button>
            <button
              aria-current={currentView === 'community-feed' ? 'page' : undefined}
              onClick={() => navigateTab('community-feed')}
              className={`flex flex-col items-center transition-colors ${currentView === 'community-feed' ? 'text-brand-rust' : 'text-brand-ink/50 hover:text-brand-ink'}`}
            >
              <Users size={24} strokeWidth={currentView === 'community-feed' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{t('nav.chautari')}</span>
            </button>
            <button
              aria-current={currentView === 'user-journal' ? 'page' : undefined}
              onClick={() => { if (userType === 'guest') { setShowSignUpPrompt(true); return; } navigateTab('user-journal'); }}
              className={`flex flex-col items-center transition-colors ${currentView === 'user-journal' ? 'text-brand-rust' : 'text-brand-ink/50 hover:text-brand-ink'}`}
            >
              <BookOpen size={24} strokeWidth={currentView === 'user-journal' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{t('nav.journal')}</span>
            </button>
            <button
              aria-current={currentView === 'user-consultation' ? 'page' : undefined}
              onClick={() => { setBookingStep('browse'); setBookingType(null); setBookingTime(null); navigateTab('user-consultation'); }}
              className={`flex flex-col items-center transition-colors ${currentView === 'user-consultation' ? 'text-brand-rust' : 'text-brand-ink/50 hover:text-brand-ink'}`}
            >
              <Calendar size={24} strokeWidth={currentView === 'user-consultation' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{t('nav.consultation')}</span>
            </button>
          </nav>
        )}

        {/* Bottom Navigation (Only on Dashboard) */}
        {['queue', 'schedule', 'profile', 'clients', 'client-detail'].includes(currentView) && (
          <nav aria-label="Professional navigation" className="bg-brand-bg border-t border-brand-border px-6 py-4 flex justify-between items-center pb-8">
            <button 
              onClick={() => navigateTab('queue')}
              className={`flex flex-col items-center transition-colors ${currentView === 'queue' ? 'text-brand-rust' : 'text-brand-ink/50 hover:text-brand-ink'}`}
            >
              <Home size={24} strokeWidth={currentView === 'queue' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Queue</span>
            </button>
            <button 
              onClick={() => navigateTab('clients')}
              className={`flex flex-col items-center transition-colors ${['clients', 'client-detail'].includes(currentView) ? 'text-brand-rust' : 'text-brand-ink/50 hover:text-brand-ink'}`}
            >
              <Users size={24} strokeWidth={['clients', 'client-detail'].includes(currentView) ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Clients</span>
            </button>
            <button 
              onClick={() => navigateTab('schedule')}
              className={`flex flex-col items-center transition-colors ${currentView === 'schedule' ? 'text-brand-rust' : 'text-brand-ink/50 hover:text-brand-ink'}`}
            >
              <Calendar size={24} strokeWidth={currentView === 'schedule' ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">Schedule</span>
            </button>
            <button
              aria-current={currentView === 'profile' ? 'page' : undefined}
              onClick={() => navigateTab('profile')}
              className={`flex flex-col items-center transition-colors ${currentView === 'profile' ? 'text-brand-rust' : 'text-brand-ink/50 hover:text-brand-ink'}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-serif ${currentView === 'profile' ? 'bg-brand-rust text-brand-on-rust' : 'bg-brand-surface-alt border border-brand-border text-brand-ink'}`}>
                Dr
              </div>
              <span className="text-[10px] font-medium mt-1">Profile</span>
            </button>
          </nav>
        )}

        {/* Sign-Up Prompt Modal */}
        {showSignUpPrompt && (
          <div className="absolute inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={() => setShowSignUpPrompt(false)}>
            <div className="bg-brand-bg rounded-t-3xl w-full p-6 pb-8 shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-brand-border rounded-full mx-auto mb-6"></div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-rust/10 flex items-center justify-center mx-auto mb-4">
                  <Heart size={20} className="text-brand-rust" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-brand-ink mb-2">{t('auth.join')}</h3>
                <p className="text-sm text-brand-ink/60 mb-6">{t('auth.joinDesc')}</p>
                <button
                  onClick={() => { setUserType('user'); setUserName('Sita'); setShowSignUpPrompt(false); }}
                  className="w-full py-4 rounded-2xl bg-brand-rust text-brand-on-rust font-semibold text-sm shadow-sm mb-3"
                >
                  {t('auth.createFree')}
                </button>
                <button
                  onClick={() => setShowSignUpPrompt(false)}
                  className="w-full py-3 text-sm text-brand-ink/50"
                >
                  {t('auth.continueBrowsing')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SCREENS ---

function DemoSelectScreen({ onSelect, onAdmin }: { onSelect: (role: 'pro' | 'user') => void; onAdmin: () => void }) {
  return (
    <div className="p-8 flex flex-col h-full justify-center items-center text-center bg-brand-bg">
      <div className="mb-12">
        <div className="w-16 h-16 bg-brand-rust text-brand-on-rust rounded-2xl flex items-center justify-center font-serif text-3xl shadow-md mx-auto mb-6">
          S
        </div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-brand-ink mb-2">Sahara</h1>
        <p className="text-brand-ink/60 text-sm">Prototype Environment</p>
      </div>

      <div className="w-full space-y-4">
        <button
          onClick={() => onSelect('user')}
          className="w-full bg-brand-rust rounded-2xl p-6 text-left transition-colors shadow-sm group animate-fade-up"
          style={{ animationDelay: '0ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl font-semibold text-brand-on-rust">Patient / Family</h2>
            <ArrowRight size={20} className="text-brand-on-rust/70" />
          </div>
          <p className="text-sm text-brand-on-rust/70">Community feed, anonymous browsing, and intake flow.</p>
        </button>

        <button
          onClick={() => onSelect('pro')}
          className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-6 text-left transition-colors shadow-sm group animate-fade-up"
          style={{ animationDelay: '150ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl font-semibold text-brand-ink">Professional</h2>
            <ArrowRight size={20} className="text-brand-ink/20 group-hover:text-brand-rust transition-colors" />
          </div>
          <p className="text-sm text-brand-ink/60">Queue, AI summaries, client roster, and schedule.</p>
        </button>

        <button
          onClick={onAdmin}
          className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-6 text-left transition-colors shadow-sm group animate-fade-up"
          style={{ animationDelay: '300ms' }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl font-semibold text-brand-ink">Admin Portal</h2>
            <ArrowRight size={20} className="text-brand-ink/20 group-hover:text-brand-rust transition-colors" />
          </div>
          <p className="text-sm text-brand-ink/60">Platform monitoring &amp; oversight.</p>
        </button>
      </div>
    </div>
  );
}

function WelcomeScreen({ onCreateAccount, onLogin, onExplore, t }: {
  onCreateAccount: () => void;
  onLogin: () => void;
  onExplore: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-col h-full bg-brand-bg items-center justify-center text-center px-8">
      <div className="w-16 h-16 rounded-full bg-brand-rust/10 flex items-center justify-center mb-6">
        <Heart size={28} className="text-brand-rust" />
      </div>

      <h1 className="font-serif text-3xl font-semibold text-brand-ink mb-2">{t('welcome.headline')}</h1>
      <p className="font-serif text-xl text-brand-rust mb-3 italic">{t('welcome.mapani')}</p>
      <p className="text-sm text-brand-ink/60 leading-relaxed mb-10 max-w-xs">
        {t('welcome.subtitle')}
      </p>

      <div className="w-full space-y-3 mb-6">
        <button
          onClick={onCreateAccount}
          className="w-full py-4 rounded-2xl bg-brand-rust text-brand-on-rust font-semibold text-sm shadow-sm flex items-center justify-center gap-2"
        >
          <Users size={16} />
          {t('welcome.createAccount')}
        </button>
        <button
          onClick={onLogin}
          className="w-full py-4 rounded-2xl bg-brand-surface border border-brand-border text-brand-ink font-semibold text-sm"
        >
          {t('welcome.login')}
        </button>
      </div>

      <div className="flex items-center gap-4 w-full mb-6">
        <div className="flex-1 h-px bg-brand-border"></div>
        <span className="text-xs text-brand-ink/50">or</span>
        <div className="flex-1 h-px bg-brand-border"></div>
      </div>

      <button
        onClick={onExplore}
        className="flex items-center gap-2 text-sm font-medium text-brand-ink/60 hover:text-brand-ink transition-colors"
      >
        <Info size={14} />
        {t('welcome.explore')}
      </button>
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
          aria-label="Go back"
          className="w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-serif text-2xl font-semibold text-brand-ink">Help & Support</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-4">

        {/* Crisis Helplines */}
        <div className="bg-brand-ink rounded-2xl p-5 shadow-sm">
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
          className="w-full bg-brand-rust hover:bg-brand-rust/90 text-brand-on-rust rounded-2xl py-4 font-medium text-base transition-colors shadow-sm"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
}

function UserHomeScreen({ onStartChat, onExplore, userType, userName, language, setLanguage, t, onLogout }: { onStartChat: (context: string) => void, onExplore: () => void, userType: 'guest' | 'user', userName: string, language: Language, setLanguage: (l: Language) => void, t: (key: string) => string, onLogout: () => void }) {
  return (
    <div className="flex flex-col h-full bg-brand-bg relative pb-24">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-brand-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-rust text-brand-on-rust rounded-full flex items-center justify-center font-serif text-lg shadow-sm">
            S
          </div>
          <span className="font-serif text-xl font-semibold text-brand-ink">Sahara</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
            aria-label={`Switch to ${language === 'en' ? 'Nepali' : 'English'}`}
            className="w-8 h-8 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-[10px] font-bold text-brand-ink/60 hover:bg-brand-surface-alt transition-colors"
          >
            {language === 'en' ? 'ने' : 'EN'}
          </button>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm shadow-sm ${
            userType === 'guest'
              ? 'bg-brand-ink/10 border border-brand-border text-brand-ink/50'
              : 'bg-brand-surface border border-brand-border text-brand-rust'
          }`}>
            {userType === 'guest' ? '?' : userName.charAt(0)}
          </div>
          <button
            onClick={onLogout}
            aria-label="Back to Demo Select"
            className="w-8 h-8 rounded-full bg-brand-surface-alt border border-brand-border flex items-center justify-center text-brand-ink hover:text-brand-rust transition-colors ml-1"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
      {userType === 'guest' && (
        <div className="px-6 pt-2">
          <div className="flex items-center gap-2 text-[10px] text-brand-ink/50">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-ink/20"></div>
            {t('auth.guestLabel')}
          </div>
        </div>
      )}

      <div className="px-6 pb-6">
        <p className="text-brand-rust italic text-sm mb-1">{t('home.nepali')}</p>
        <h1 className="font-serif text-3xl font-semibold text-brand-ink mb-2 tracking-tight">{t('home.heading')}</h1>
        <p className="text-brand-ink/60 text-sm mb-8">{t('home.subheading')}</p>

        <div className="space-y-4 mb-10">
          <button onClick={() => onStartChat('family')} className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-5 text-left transition-colors shadow-sm flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-brand-rust/10 flex items-center justify-center text-brand-rust shrink-0">
              <Users size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold text-brand-ink mb-0.5 line-clamp-2">{t('home.door.family.title')}</h3>
              <p className="text-xs text-brand-ink/60">{t('home.door.family.desc')}</p>
            </div>
            <ArrowRight size={16} className="text-brand-ink/20 group-hover:text-brand-rust transition-colors shrink-0" />
          </button>

          <button onClick={() => onStartChat('self')} className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-5 text-left transition-colors shadow-sm flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
              <User size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold text-brand-ink mb-0.5 line-clamp-2">{t('home.door.self.title')}</h3>
              <p className="text-xs text-brand-ink/60">{t('home.door.self.desc')}</p>
            </div>
            <ArrowRight size={16} className="text-brand-ink/20 group-hover:text-brand-green transition-colors shrink-0" />
          </button>

          <button onClick={() => onStartChat('share')} className="w-full bg-brand-rust/10 border border-brand-rust/20 hover:bg-brand-rust/20 rounded-2xl p-5 text-left transition-colors shadow-sm flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-brand-rust/20 flex items-center justify-center text-brand-rust shrink-0">
              <Edit3 size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold text-brand-ink mb-0.5 line-clamp-2">{t('home.door.share.title')}</h3>
              <p className="text-xs text-brand-ink/60">{t('home.door.share.desc')}</p>
            </div>
          </button>

        </div>

        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/50 mb-4">{t('home.community')}</h3>
          
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
          <p className="text-center text-brand-ink/70 mt-3 px-4" style={{ fontSize: '10px' }}>
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
        aria-label="Go back"
        className="absolute top-6 left-6 w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors z-10"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex-1 mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-rust text-brand-on-rust rounded-xl flex items-center justify-center font-serif text-2xl shadow-sm">
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
              aria-label="Email address"
              className="w-full bg-transparent px-4 py-3 text-brand-ink placeholder:text-brand-ink/50 focus:outline-none"
              defaultValue="dr.sharma@sahara.health"
            />
          </div>
          <div className="bg-brand-surface rounded-2xl p-1 border border-brand-border shadow-sm">
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              className="w-full bg-transparent px-4 py-3 text-brand-ink placeholder:text-brand-ink/50 focus:outline-none"
              defaultValue="••••••••"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={onLogin}
          className="w-full bg-brand-rust hover:bg-brand-rust/90 text-brand-on-rust rounded-2xl py-4 font-medium text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
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

function JournalPinScreen({ onUnlock, onSkip, onBack }: { onUnlock: () => void, onSkip: () => void, onBack: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const DEMO_PIN = '1234';

  const handleDigit = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      if (next === DEMO_PIN) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => { setPin(''); setError(false); }, 1000);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="flex flex-col h-full bg-brand-bg items-center justify-center px-8 relative">
      <button
        onClick={onBack}
        aria-label="Go back"
        className="absolute top-6 left-6 w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="w-16 h-16 rounded-full bg-brand-rust/10 flex items-center justify-center text-brand-rust mb-6">
        <Lock size={28} />
      </div>

      <h2 className="font-serif text-2xl font-semibold text-brand-ink mb-2">Private Journal</h2>
      <p className="text-sm text-brand-ink/60 text-center mb-2">Your reflections are protected.</p>
      <p className="text-[10px] text-brand-ink/50 text-center mb-8 max-w-[240px] leading-relaxed">
        In homes where phones are shared, your privacy matters. No one — not even Sahara — can read your journal without your PIN.
      </p>

      {/* PIN Dots */}
      <div className={`flex gap-4 mb-8 ${error ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-colors ${
              i < pin.length ? 'bg-brand-rust' : 'border-2 border-brand-border'
            }`}
          />
        ))}
      </div>

      {error && <p className="text-xs text-red-500 mb-4">Incorrect PIN. Try again.</p>}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {['1','2','3','4','5','6','7','8','9','','0','←'].map((key) => {
          if (key === '') return <div key="empty" />;
          if (key === '←') return (
            <button key="back" onClick={handleBackspace} className="w-16 h-16 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-ink text-xl hover:bg-brand-surface-alt transition-colors">
              ←
            </button>
          );
          return (
            <button key={key} onClick={() => handleDigit(key)} className="w-16 h-16 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-ink font-serif text-xl hover:bg-brand-surface-alt transition-colors">
              {key}
            </button>
          );
        })}
      </div>

      <button onClick={onSkip} className="text-xs text-brand-ink/50 hover:text-brand-ink/60 transition-colors">
        Set up later →
      </button>

      <p className="text-[10px] text-brand-ink/30 mt-4">Demo PIN: 1234</p>
    </div>
  );
}

function JournalScreen({ entries, onBack, onStartChat }: { entries: any[], onBack: () => void, onStartChat?: () => void }) {
  return (
    <div className="flex flex-col h-full bg-brand-bg relative">
      <div className="bg-brand-bg/90 backdrop-blur-md z-10 px-6 py-6 border-b border-brand-border flex items-center gap-4 sticky top-0">
        <button 
          onClick={onBack}
          aria-label="Go back"
          className="w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors shrink-0"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-ink">My Journal</h1>
          <p className="text-xs text-brand-ink/60">Private insights and reflections</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24 relative">
        {entries.map((entry: any) => (
          <div key={entry.id} className="bg-brand-surface p-5 rounded-2xl shadow-sm border border-brand-border">
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
            <p className="text-brand-ink/50 text-xs mt-1">Chat with Maan to generate insights.</p>
          </div>
        )}
      </div>
      {/* Floating Action Button for New Entry */}
      {onStartChat && (
        <div className="absolute bottom-6 right-6 z-20">
          <button 
            onClick={onStartChat}
            className="w-14 h-14 rounded-full bg-brand-rust text-brand-on-rust shadow-[0_8px_16px_rgba(189,111,88,0.3)] flex items-center justify-center hover:bg-brand-rust/90 transition-transform hover:scale-105 active:scale-95 group"
            aria-label="New Voice Entry"
          >
            <Mic size={24} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}

function CommunityFeedScreen({ onBack, onStartShare, userType, userName, onAuthRequired, t }: { onBack: () => void, onStartShare: () => void, userType: 'guest' | 'user', userName: string, onAuthRequired: () => void, t: (key: string) => string }) {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number | string>>(new Set());
  const [postCounts, setPostCounts] = useState<Record<string | number, number>>({});
  const filters = ['All', 'Social Withdrawal', 'Academic Pressure', 'Stigma & Resistance', 'Social Isolation'];

  const handleInteract = () => {
    setShowAuthPrompt(true);
    setTimeout(() => setShowAuthPrompt(false), 3000);
  };

  const handleMaPani = (postId: number | string, originalCount: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
    setPostCounts(prev => ({
      ...prev,
      [postId]: likedPosts.has(postId) ? originalCount : originalCount + 1
    }));
  };

  const FEED_POSTS: Array<{
    id: number | string;
    type: 'story' | 'expert';
    author?: string;
    time?: string;
    tag: string;
    aiSummary?: string;
    content: string;
    meTooCount?: number;
    proResponses?: number;
    name?: string;
    credential?: string;
    verified?: boolean;
  }> = [
    {
      id: 1,
      type: 'story',
      author: "Anonymous Sister",
      time: "2 hours ago",
      tag: "Social Withdrawal",
      aiSummary: "3-week social withdrawal. Parents misread as laziness. Seeking advice on family communication gap.",
      content: "My brother hasn't left his room in weeks. My parents keep telling him to 'just go outside and get fresh air' and think he is just being lazy. I know it's something deeper but I don't know how to bridge the gap between them.",
      meTooCount: 124,
      proResponses: 2
    },
    {
      id: 'expert-1',
      type: 'expert',
      name: "Dr. Asha S.",
      credential: "Psychiatrist, Kathmandu",
      verified: true,
      tag: "Social Withdrawal",
      content: "When a family member says 'he's just lazy,' that's often the first sign someone needs gentle support. Starting with a conversation — not a confrontation — makes a real difference."
    },
    {
      id: 2,
      type: 'story',
      author: "Anonymous Son",
      time: "5 hours ago",
      tag: "Academic Pressure",
      aiSummary: "Severe pressure to succeed. Fears therapy = parental failure. Looking for conversation starters.",
      content: "The pressure to succeed and provide is crushing me. If I tell my family I need therapy, they will think they failed as parents or that I am broken. How do you start this conversation?",
      meTooCount: 89,
      proResponses: 1
    },
    {
      id: 3,
      type: 'story',
      author: "Anonymous Mother",
      time: "1 day ago",
      tag: "Stigma & Resistance",
      aiSummary: "Husband resistant to counseling due to stigma. Mother feels stuck between child's need and spouse's resistance.",
      content: "I suggested to my husband that we see a counselor for our daughter. He got very angry and said 'we don't air our dirty laundry to strangers'. I feel so stuck.",
      meTooCount: 210,
      proResponses: 4
    },
    {
      id: 'expert-2',
      type: 'expert',
      name: "Dr. Prabhat K.",
      credential: "Keynote Speaker, Mental Health Advocate",
      verified: true,
      tag: "Stigma & Resistance",
      content: "Stigma is the single largest barrier to mental health care in South Asia. But every family that starts a conversation — even an imperfect one — breaks the cycle for the next generation."
    },
    {
      id: 4,
      type: 'story',
      author: "Worried Daughter",
      time: "1 day ago",
      tag: "Social Isolation",
      aiSummary: "2-month social isolation. Verbal denial vs. visible distress. Seeking peer strategies for family conversation.",
      content: "My mother hasn't left the house in two months. She says she's fine but I can see it in her eyes. How did others approach this conversation?",
      meTooCount: 67,
      proResponses: 1
    },
    {
      id: 5,
      type: 'story',
      author: "Anonymous Student",
      time: "3 days ago",
      tag: "Academic Pressure",
      aiSummary: "High-achieving student experiencing burnout. Afraid to ask for help due to family's sacrifice narrative.",
      content: "My parents sacrificed everything so I could study abroad. Now I can barely get out of bed. How do I tell them I'm struggling without making them feel like it was all for nothing?",
      meTooCount: 156,
      proResponses: 3
    }
  ];

  return (
    <div className="flex flex-col h-full bg-brand-bg relative">
      {/* Story Detail Overlay */}
      {selectedStory && selectedStory.type === 'story' && (
        <div className="absolute inset-0 bg-brand-bg z-40 flex flex-col overflow-y-auto">
          <div className="sticky top-0 bg-brand-bg/90 backdrop-blur-md z-10 px-6 py-4 border-b border-brand-border flex items-center gap-3">
            <button onClick={() => setSelectedStory(null)} aria-label="Go back" className="w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-[10px] font-medium uppercase tracking-wider text-brand-ink/50 bg-brand-bg px-2 py-1 rounded-md border border-brand-border">{selectedStory.tag}</span>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-rust/10 flex items-center justify-center"><Users size={16} className="text-brand-rust" /></div>
              <div>
                <p className="text-sm font-semibold text-brand-ink">{selectedStory.author}</p>
                <p className="text-xs text-brand-ink/50">{selectedStory.time}</p>
              </div>
            </div>

            <p className="text-base text-brand-ink/80 leading-relaxed">"{selectedStory.content}"</p>

            <div className="bg-brand-bg rounded-xl p-4 border border-brand-border/50">
              <div className="flex items-center gap-1.5 mb-2 text-brand-rust">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">AI-Organized Pattern</span>
              </div>
              <p className="text-sm text-brand-ink/70 leading-relaxed">{selectedStory.aiSummary}</p>
            </div>

            <div className="flex items-center justify-between py-4 border-y border-brand-border/60">
              <button
                onClick={() => { if (userType === 'guest') { onAuthRequired(); return; } handleMaPani(selectedStory.id, selectedStory.meTooCount!); }}
                className={`flex items-center gap-2 transition-colors ${likedPosts.has(selectedStory.id) ? 'text-brand-rust' : 'text-brand-ink/50 hover:text-brand-rust'}`}
              >
                <Heart size={18} fill={likedPosts.has(selectedStory.id) ? 'currentColor' : 'none'} />
                <span className="text-sm font-medium">{postCounts[selectedStory.id] ?? selectedStory.meTooCount} {t('chautari.maPani')}</span>
              </button>
              <button onClick={handleInteract} className="flex items-center gap-1.5 text-brand-green bg-brand-green/10 px-3 py-1.5 rounded-full">
                <ShieldCheck size={14} />
                <span className="text-xs font-medium">{selectedStory.proResponses} Pro Responses</span>
              </button>
            </div>

            <div className="bg-brand-rust/5 rounded-2xl p-5 border border-brand-rust/10 text-center">
              <p className="text-sm text-brand-ink/70 mb-3">Going through something similar?</p>
              <button onClick={() => { if (userType === 'guest') { onAuthRequired(); return; } setSelectedStory(null); onStartShare(); }} className="bg-brand-rust text-brand-on-rust rounded-xl px-6 py-3 text-sm font-medium">
                Share Your Experience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Prompt Toast */}
      {showAuthPrompt && (
        <div className="absolute top-20 left-4 right-4 bg-brand-ink text-brand-bg p-4 rounded-2xl shadow-xl z-50 flex items-start gap-3">
          <Lock size={20} className="text-brand-rust shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm mb-1">Create an account to interact</p>
            <p className="text-xs text-brand-bg/70">Join the community to save stories, say "Ma Pani", and connect with professionals.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-brand-bg/90 backdrop-blur-md z-10 px-6 py-6 border-b border-brand-border sticky top-0">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} aria-label="Go back" className="w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="w-10 h-10 bg-brand-rust text-brand-on-rust rounded-full flex items-center justify-center font-serif text-xl shadow-sm">S</div>
        </div>
        <h1 className="font-serif text-3xl font-semibold text-brand-ink mb-1">Chautari / Ma Pani</h1>
        <p className="text-brand-ink/60 text-sm">{t('chautari.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-b border-brand-border/50">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeFilter === f
                ? 'bg-brand-ink text-brand-bg shadow-sm'
                : 'bg-brand-surface border border-brand-border text-brand-ink hover:bg-brand-surface-alt'
            }`}
          >
            {f === 'All' ? 'All Stories' : f}
          </button>
        ))}
      </div>



      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-20">
        {/* Share CTA */}
        <div
          onClick={() => { if (userType === 'guest') { onAuthRequired(); return; } onStartShare(); }}
          className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-brand-surface-alt transition-colors shadow-sm"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm shrink-0 ${
            userType === 'guest' ? 'bg-brand-ink/10 text-brand-ink/50' : 'bg-brand-rust/10 text-brand-rust'
          }`}>
            {userType === 'guest' ? '?' : userName.charAt(0)}
          </div>
          {userType === 'guest'
            ? <span className="text-sm font-medium text-brand-ink/80 flex-1">{t('chautari.signUpToShare')}</span>
            : <span className="text-sm font-medium text-brand-ink/80 flex-1">What's on your mind?</span>
          }
          <div className="text-xs font-bold uppercase tracking-wider text-brand-on-rust bg-brand-rust px-4 py-2 rounded-full flex items-center gap-1 hover:bg-brand-rust/90 transition-colors">
            Share <ArrowRight size={14} />
          </div>
        </div>

        {/* AI Knowledge Base Container */}
        {activeFilter === 'All' && (
          <div className="mb-2 mt-2 bg-brand-surface-alt border border-brand-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-brand-rust" />
              <h2 className="text-sm font-bold text-brand-ink">AI Knowledge Base</h2>
            </div>
            <p className="text-xs text-brand-ink/60 mb-4">Maan organizes community insights using these vetted clinical resources.</p>
            
            <div className="flex flex-col gap-2">
              <a href="/content/family-psychoeducation-guide.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full bg-brand-surface border border-brand-border text-brand-ink rounded-xl p-3 shadow-sm hover:border-brand-rust/30 transition-colors group">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-rust mb-0.5">Guide</p>
                  <h3 className="text-sm font-semibold leading-tight pr-2">When Someone You Love Is Struggling</h3>
                </div>
                <div className="shrink-0 flex items-center gap-1 bg-brand-bg px-2 py-1 rounded-md border border-brand-border text-[10px] font-bold uppercase text-brand-ink/60 group-hover:text-brand-rust transition-colors">
                  View PDF <ArrowRight size={12} className="ml-0.5" />
                </div>
              </a>
              <a href="/content/individual-wellness-guide.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full bg-brand-surface border border-brand-border text-brand-ink rounded-xl p-3 shadow-sm hover:border-brand-green/30 transition-colors group">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-green mb-0.5">Self-Care</p>
                  <h3 className="text-sm font-semibold leading-tight pr-2">Understanding What You're Feeling</h3>
                </div>
                <div className="shrink-0 flex items-center gap-1 bg-brand-bg px-2 py-1 rounded-md border border-brand-border text-[10px] font-bold uppercase text-brand-ink/60 group-hover:text-brand-green transition-colors">
                  View PDF <ArrowRight size={12} className="ml-0.5" />
                </div>
              </a>
              <a href="/content/cultural-context-community.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full bg-brand-surface border border-brand-border text-brand-ink rounded-xl p-3 shadow-sm hover:border-brand-ink/30 transition-colors group">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-ink/50 mb-0.5">Context</p>
                  <h3 className="text-sm font-semibold leading-tight pr-2">Mental Health in Nepali Families</h3>
                </div>
                <div className="shrink-0 flex items-center gap-1 bg-brand-bg px-2 py-1 rounded-md border border-brand-border text-[10px] font-bold uppercase text-brand-ink/60 transition-colors group-hover:text-brand-ink">
                  View PDF <ArrowRight size={12} className="ml-0.5" />
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Posts */}
        {FEED_POSTS.filter(p => activeFilter === 'All' || p.tag === activeFilter).map((post) => {
          // Expert card
          if (post.type === 'expert') {
            return (
              <div key={post.id} className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm border-l-4 border-l-brand-green">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center font-serif text-brand-green text-sm font-semibold">
                    {post.name!.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-ink">{post.name} <span className="text-brand-green text-xs">✓ Verified</span></p>
                    <p className="text-[10px] text-brand-ink/50">{post.credential}</p>
                  </div>
                </div>
                <p className="text-sm text-brand-ink/80 leading-relaxed">{post.content}</p>
                <div className="mt-3">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-brand-ink/50 bg-brand-bg px-2 py-1 rounded-md border border-brand-border/50">{post.tag}</span>
                </div>
              </div>
            );
          }

          // Story card — human story FIRST, AI summary SECOND
          return (
            <div key={post.id} className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-rust/10 flex items-center justify-center">
                    <Users size={14} className="text-brand-rust" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-ink">{post.author}</p>
                    <p className="text-[10px] text-brand-ink/50">{post.time}</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-brand-ink/50 bg-brand-bg px-2 py-1 rounded-md border border-brand-border">
                  {post.tag}
                </span>
              </div>

              {/* Human story FIRST */}
              <div className="px-1 mb-4">
                <p className="text-sm text-brand-ink/70 leading-relaxed">
                  "{post.content}"
                </p>
              </div>

              {/* AI Summary SECOND */}
              <div className="bg-brand-bg rounded-xl p-3 mb-4 border border-brand-border/50">
                <div className="flex items-center gap-1.5 mb-1.5 text-brand-rust">
                  <Sparkles size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-wider">AI-Organized Pattern</span>
                </div>
                <p className="text-xs text-brand-ink/70 leading-relaxed">
                  {post.aiSummary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-brand-border/60">
                <div className="flex flex-col items-start gap-0.5">
                  <button
                    onClick={() => { if (userType === 'guest') { onAuthRequired(); return; } handleMaPani(post.id, post.meTooCount!); }}
                    className={`flex items-center gap-1.5 transition-colors ${likedPosts.has(post.id) ? 'text-brand-rust' : 'text-brand-ink/50 hover:text-brand-rust'}`}
                  >
                    <Heart size={16} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                    <span className="text-xs font-medium">{postCounts[post.id] ?? post.meTooCount} {t('chautari.maPani')}</span>
                  </button>
                  {userType === 'guest' && (
                    <span className="text-[9px] text-brand-ink/30">{t('auth.signUpToRelate')}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedStory(post)} className="text-xs font-medium text-brand-rust hover:underline">Read full story →</button>
                  <button
                    onClick={handleInteract}
                    className="flex items-center gap-1.5 text-brand-green hover:text-brand-green/80 transition-colors bg-brand-green/10 px-3 py-1.5 rounded-full"
                  >
                    <ShieldCheck size={14} />
                    <span className="text-xs font-medium">{post.proResponses} Pro Responses</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AiChatScreen({ context, onBack, onExplore, onConsult, onSaveJournal, onGenerateSummary, autoStartMic }: { context: string, onBack: () => void, onExplore: () => void, onConsult: () => void, onSaveJournal: (summary: string, mood: string, techniques: string[]) => void, onGenerateSummary: (messages: { role: 'user' | 'model', text: string }[]) => void, autoStartMic?: boolean }) {
  const greetings: Record<string, string> = {
    family: "You're here because you care about someone. That already matters. Tell me what you've noticed — there are no wrong words here.",
    self: "This is your space. No labels, no rush. What's been on your mind?",
    share: "Your experience could help someone who feels alone right now. Share what feels right."
  };

  const [messages, setMessages] = useState<{role: 'ai' | 'user' | 'action', text?: string, actions?: any[]}[]>([
    { role: 'ai', text: greetings[context] || greetings.self }
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

      if (autoStartMic) {
        setTimeout(() => {
          try {
            recognition.lang = 'en-US'; // Defaulting to EN as initialized
            recognition.start();
            setIsRecording(true);
          } catch (e) {
            console.error("Could not auto-start recording", e);
          }
        }, 300);
      }
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

      const userMessageCount = newMessages.filter(m => m.role === 'user').length;

      const actions = [
        { id: 'community', icon: <Users size={16} />, title: 'See community stories', subtitle: 'Others have been here too' },
        { id: 'consult', icon: <Calendar size={16} />, title: 'Talk to a professional', subtitle: "When you're ready — no pressure" },
        { id: 'journal', icon: <BookOpen size={16} />, title: 'End & Save to Journal', subtitle: "Generate private insights" },
        { id: 'continue', icon: <Edit3 size={16} />, title: 'Keep sharing', subtitle: "Tell me more, I'm listening" }
      ];

      if (userMessageCount >= 3) {
        actions.splice(1, 0, { id: 'summary', icon: <Sparkles size={16} />, title: 'Generate my summary', subtitle: 'See your observations organized by AI' });
      }

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
    if (actionId === 'summary') {
      const chatHistory = messages
        .filter(m => m.role === 'user' || m.role === 'ai')
        .map(m => ({
          role: m.role === 'ai' ? 'model' as const : 'user' as const,
          text: m.text || ''
        }));
      onGenerateSummary(chatHistory);
    }
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

  const promptsByContext: Record<string, string[]> = {
    family: [
      "My family member has been withdrawing",
      "I don't know how to bring it up",
      "Is what I'm seeing serious?"
    ],
    self: [
      "I've been feeling overwhelmed lately",
      "I don't know how to describe what I feel",
      "I want to understand myself better"
    ],
    share: [
      "I went through something similar",
      "Here's what helped my family",
      "I want others to know they're not alone"
    ]
  };
  const initialPrompts = promptsByContext[context] || promptsByContext.self;

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
            <div className="w-16 h-16 bg-brand-rust/80 text-brand-on-rust rounded-full flex items-center justify-center font-serif text-2xl mb-4 shadow-sm">
              म
            </div>
            <p className="text-brand-green text-xs font-medium mb-2">
              {context === 'family' ? 'Caring for someone' : context === 'share' ? 'Sharing your experience' : 'Understanding myself'}
            </p>
            <p className="text-sm text-brand-ink/70 max-w-[260px]">
              {context === 'family'
                ? "You're here because you care about someone. That already matters."
                : context === 'share'
                ? 'Your experience could help someone who feels alone right now.'
                : "This is your space. No labels, no rush."}
            </p>
            <p className="text-brand-ink/50 mt-2 max-w-[260px]" style={{ fontSize: '10px' }}>
              Maan helps organize your thoughts — it does not diagnose or replace professional care.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => {
          if (msg.role === 'action') {
            return (
              <div key={idx} className="bg-brand-surface rounded-2xl p-4 border border-brand-border shadow-sm space-y-2">
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
              <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-brand-rust/80 text-brand-on-rust rounded-br-sm' : 'bg-brand-surface border border-brand-border text-brand-ink rounded-bl-sm shadow-sm'}`}>
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
            <div className="max-w-[85%] rounded-2xl p-4 bg-brand-surface border border-brand-border text-brand-ink rounded-bl-sm shadow-sm flex items-center gap-2">
              <Sparkles size={16} className="text-brand-rust animate-pulse" />
              <span className="text-xs font-semibold text-brand-ink/70">Maan is organizing thoughts...</span>
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
              aria-label="Stop recording"
              className="w-11 h-11 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shrink-0 shadow-sm"
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
              aria-label="Message to Maan"
              className="flex-1 bg-transparent text-sm text-brand-ink placeholder:text-brand-ink/50 focus:outline-none py-2 disabled:opacity-50"
            />
            {inputValue.trim() ? (
              <button
                onClick={() => handleSend(inputValue)}
                aria-label="Send message"
                disabled={isLoading}
                className="w-11 h-11 rounded-full bg-brand-rust text-brand-on-rust shadow-sm flex items-center justify-center hover:bg-brand-rust/90 transition-transform hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            ) : (
              <button
                onClick={toggleRecording}
                aria-label="Voice input"
                disabled={isLoading}
                className="w-11 h-11 rounded-full bg-brand-rust text-brand-on-rust shadow-sm flex items-center justify-center hover:bg-brand-rust/90 transition-transform hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50"
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

function SummaryScreen({
  context,
  messages,
  generatedSummary,
  setGeneratedSummary,
  onConsult,
  onBack,
  onHome
}: {
  context: string,
  messages: { role: 'user' | 'model', text: string }[],
  generatedSummary: { summary: string; patterns: string[]; peerEvidence: string; sources?: { title: string, url: string }[] } | null,
  setGeneratedSummary: (s: any) => void,
  onConsult: () => void,
  onBack: () => void,
  onHome: () => void
}) {
  const [loading, setLoading] = useState(!generatedSummary);

  useEffect(() => {
    if (!generatedSummary) {
      setLoading(true);
      generateObservationSummary(messages, context).then(result => {
        setGeneratedSummary(result);
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      <div className="bg-brand-bg/90 backdrop-blur-md z-10 px-6 py-6 border-b border-brand-border sticky top-0">
        <button onClick={onBack} aria-label="Go back" className="w-11 h-11 rounded-full bg-brand-surface flex items-center justify-center text-brand-ink border border-brand-border hover:bg-brand-surface-alt transition-colors mb-4">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-serif text-2xl font-semibold text-brand-ink">Your Observations, Organized</h1>
        <p className="text-brand-ink/60 text-sm mt-1">AI-organized from your conversation with Maan. This is not a diagnosis.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-24 space-y-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <div className="w-12 h-12 rounded-full bg-brand-rust/10 flex items-center justify-center text-brand-rust mb-4 animate-pulse">
              <Sparkles size={24} />
            </div>
            <p className="text-sm text-brand-ink/60">Organizing your observations...</p>
            <p className="text-[10px] text-brand-ink/50 mt-2">This uses AI to find patterns — not to diagnose.</p>
          </div>
        ) : generatedSummary ? (
          <>
            <div className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-brand-rust" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-rust">AI-Organized Summary</span>
              </div>
              <p className="text-sm text-brand-ink/80 leading-relaxed">{generatedSummary.summary}</p>
            </div>

            <div className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/50 mb-3">Patterns Observed</h3>
              <div className="space-y-2">
                {generatedSummary.patterns.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-rust/10 flex items-center justify-center text-brand-rust text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                    <p className="text-sm text-brand-ink/70">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-green/10 rounded-2xl p-5 border border-brand-green/20">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-brand-green" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-green">Similar Patterns on Sahara</span>
              </div>
              <p className="text-sm text-brand-ink/70">{generatedSummary.peerEvidence}</p>
              <p className="text-[10px] text-brand-ink/50 mt-2">Based on anonymous community patterns. Counts are from real stories shared on this platform.</p>
            </div>

            {generatedSummary.sources && generatedSummary.sources.length > 0 && (
              <div className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={16} className="text-brand-rust" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-rust">Grounded In</span>
                </div>
                <div className="space-y-3">
                  {generatedSummary.sources.map((s: any, i: number) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group">
                      <p className="text-sm font-medium text-brand-ink group-hover:text-brand-rust transition-colors">{s.title}</p>
                      <ArrowRight size={14} className="text-brand-ink/30 group-hover:text-brand-rust transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-brand-bg rounded-xl p-4 border border-brand-border/50">
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="text-brand-ink/50 mt-0.5 shrink-0" />
                <p className="text-[10px] text-brand-ink/50 leading-relaxed">
                  This summary organizes what you shared — it does not diagnose, label, or categorize any condition.
                  A licensed professional will review this with their own clinical judgment.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink/50">What would you like to do?</h3>
              <button onClick={onConsult} className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-4 text-left transition-colors shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0"><Calendar size={18} /></div>
                <div><p className="text-sm font-semibold text-brand-ink">Share with a professional</p><p className="text-[10px] text-brand-ink/60">They'll review this before your session</p></div>
              </button>
              <button onClick={onHome} className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-4 text-left transition-colors shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-rust/10 flex items-center justify-center text-brand-rust shrink-0"><Heart size={18} /></div>
                <div><p className="text-sm font-semibold text-brand-ink">Keep exploring</p><p className="text-[10px] text-brand-ink/60">Browse community stories and resources</p></div>
              </button>
              <button onClick={onBack} className="w-full bg-brand-surface border border-brand-border hover:bg-brand-surface-alt rounded-2xl p-4 text-left transition-colors shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-ink/50 shrink-0"><Edit3 size={18} /></div>
                <div><p className="text-sm font-semibold text-brand-ink">Continue sharing</p><p className="text-[10px] text-brand-ink/60">Add more to your conversation with Maan</p></div>
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function DashboardScreen({ consultations, onViewBrief, onLogout }: { consultations: typeof CONSULTATIONS, onViewBrief: (id: string) => void, onLogout: () => void }) {
  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-end mb-8 mt-4">
        <div>
          <p className="text-brand-rust font-medium text-sm mb-1 italic">Today's Queue</p>
          <h1 className="font-serif text-3xl font-semibold text-brand-ink">Namaste, Dr. Sharma</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center shadow-sm">
            <Calendar size={18} className="text-brand-ink/60" />
          </div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 rounded-full bg-brand-surface-alt border border-brand-border flex items-center justify-center text-brand-ink hover:text-brand-rust transition-colors shadow-sm ml-1"
            aria-label="Back to Demo Select"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        <button className="px-5 py-2 rounded-full bg-brand-ink text-brand-bg text-sm font-medium whitespace-nowrap shadow-sm">
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
        {consultations.map((consult) => (
          <div 
            key={consult.id} 
            className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
                  ? 'bg-brand-green-light text-brand-badge-green-text' 
                  : 'bg-brand-rust-light text-brand-badge-rust-text'
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
          <div key={i} className={`flex flex-col items-center p-3 rounded-2xl min-w-[3rem] ${d.active ? 'bg-brand-rust text-brand-on-rust shadow-md' : 'bg-brand-surface border border-brand-border text-brand-ink/60'}`}>
            <span className="text-[10px] uppercase font-semibold tracking-wider mb-1">{d.day}</span>
            <span className={`font-serif text-xl ${d.active ? 'text-brand-on-rust' : 'text-brand-ink'}`}>{d.date}</span>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-semibold text-brand-ink mb-4">Wednesday, Oct 14</h3>
        
        <div className="flex gap-4 items-start">
          <div className="w-16 text-right text-xs font-medium text-brand-ink/50 pt-3">09:00 AM</div>
          <div className="flex-1 bg-brand-surface-alt border border-brand-border border-dashed rounded-xl p-4 text-center text-sm text-brand-ink/50">
            Available Slot
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-16 text-right text-xs font-medium text-brand-ink/50 pt-3">10:00 AM</div>
          <div className="flex-1 bg-brand-green-light/50 border border-brand-green/30 rounded-xl p-4">
            <p className="font-semibold text-brand-ink text-sm">Sita, 34</p>
            <p className="text-xs text-brand-ink/60 mt-1">Family Guidance</p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-16 text-right text-xs font-medium text-brand-ink/50 pt-3">11:00 AM</div>
          <div className="flex-1 bg-brand-surface-alt border border-brand-border border-dashed rounded-xl p-4 text-center text-sm text-brand-ink/50">
            Available Slot
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-16 text-right text-xs font-medium text-brand-ink/50 pt-3">11:30 AM</div>
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
      <div className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm mb-6">
        <h3 className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wider mb-4">Cultural & Clinical Focus</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-brand-bg rounded-lg text-xs font-medium text-brand-ink border border-brand-border">🇳🇵 Fluent Nepali</span>
          <span className="px-3 py-1.5 bg-brand-bg rounded-lg text-xs font-medium text-brand-ink border border-brand-border">🇬🇧 Fluent English</span>
          <span className="px-3 py-1.5 bg-brand-rust-light/50 rounded-lg text-xs font-medium text-brand-badge-rust-text border border-brand-rust/20">Family Systems</span>
          <span className="px-3 py-1.5 bg-brand-green-light/50 rounded-lg text-xs font-medium text-brand-badge-green-text border border-brand-green/20">Intergenerational Trauma</span>
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
      <div className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wider">Client Impact</h3>
          <span className="flex items-center gap-1.5 text-sm font-medium text-brand-ink">
            <span className="text-brand-rust text-lg leading-none">★</span> 
            4.9 
            <span className="text-brand-ink/50 font-normal ml-1">(124 sessions)</span>
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
        <div className="text-brand-ink/50 mr-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input
          type="text"
          placeholder="Search clients..."
          aria-label="Search clients"
          className="w-full bg-transparent py-3 text-sm text-brand-ink placeholder:text-brand-ink/50 focus:outline-none"
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
        <div className="bg-brand-surface rounded-2xl p-5 border border-brand-border shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-ink/50 mb-1">Consultation Type</p>
              <p className="text-sm font-medium text-brand-ink">{client.type}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-ink/50 mb-1">Total Sessions</p>
              <p className="text-sm font-medium text-brand-ink">{client.totalSessions}</p>
            </div>
          </div>
          {client.subject !== 'Self' && (
            <div className="pt-4 border-t border-brand-border/60">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-ink/50 mb-1">Subject of Concern</p>
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
                    <span className="text-[10px] font-semibold text-brand-ink/50 uppercase tracking-wider">{post.community}</span>
                    <span className="text-[10px] text-brand-ink/50">{post.date}</span>
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
            <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-ink/50 mb-1.5">Consultation Type</p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
              consult.isFamily 
                ? 'bg-brand-green-light text-brand-badge-green-text' 
                : 'bg-brand-rust-light text-brand-badge-rust-text'
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
        <div className="bg-brand-bg rounded-2xl p-6 border border-brand-border mb-6">
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
            <p className="text-xs font-semibold text-brand-ink/50 uppercase tracking-wider mb-2">Similar Patterns on Sahara</p>
            <p className="text-sm font-medium text-brand-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              {consult.evidence}
            </p>
          </div>
        </div>

        {/* Raw Transcript Snippet */}
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border mb-8 shadow-sm">
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
        <div className="bg-brand-surface border-2 border-brand-rust/30 rounded-2xl p-5">
          <h4 className="font-serif text-lg font-semibold text-brand-ink mb-2">Help Sahara Learn</h4>
          <p className="text-brand-ink/60 text-sm mb-6 leading-relaxed">
            Does this AI summary accurately reflect the clinical reality of your consultation?
          </p>

          {feedbackGiven ? (
            <div className="bg-brand-bg rounded-xl p-4 text-center border border-brand-border">
              <p className="text-sm font-medium text-brand-green flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> Feedback recorded. Thank you.
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setFeedbackGiven('up')}
                className="flex-1 bg-brand-bg hover:bg-brand-surface-alt border border-brand-border rounded-xl py-3 flex items-center justify-center gap-2 transition-colors text-sm font-medium text-brand-ink"
              >
                <ThumbsUp size={16} /> Accurate
              </button>
              <button
                onClick={() => setFeedbackGiven('down')}
                className="flex-1 bg-brand-bg hover:bg-brand-surface-alt border border-brand-border rounded-xl py-3 flex items-center justify-center gap-2 transition-colors text-sm font-medium text-brand-ink"
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

/* ─── Admin Dashboard Screen ────────────────────────────────── */
function AdminDashboardScreen({ onBack, onLogout }: { onBack: () => void, onLogout: () => void }) {
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'postmvp'>('dashboard');

  return (
    <div className="flex flex-col h-full bg-brand-bg">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-brand-border">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-ink/60 hover:bg-brand-surface-alt transition-colors"
              aria-label="Back to home"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={onLogout}
              className="w-9 h-9 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-brand-ink hover:text-brand-rust transition-colors shadow-sm"
              aria-label="Back to Demo Select"
            >
              <LogOut size={16} />
            </button>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
            All Systems Healthy
          </span>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-brand-ink mt-1">Admin Dashboard</h1>
        <p className="text-xs text-brand-ink/50 mt-0.5">Platform monitoring · Last updated 2 min ago</p>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-brand-border flex">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 text-center py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'dashboard' ? 'text-brand-rust border-brand-rust' : 'text-brand-ink/40 border-transparent hover:text-brand-ink'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('postmvp')}
          className={`flex-1 text-center py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'postmvp' ? 'text-brand-rust border-brand-rust' : 'text-brand-ink/40 border-transparent hover:text-brand-ink'
          }`}
        >
          Post-MVP Roadmap
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {activeTab === 'dashboard' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'AI Quality Score', value: '4.2', delta: '↑ 0.3 this week', color: 'text-brand-ink' },
                { label: 'Crisis Signals Missed', value: '0', delta: 'Perfect record', color: 'text-green-600' },
                { label: 'Families Supported', value: '247', delta: '↑ 18 this week', color: 'text-brand-rust' },
                { label: 'Individuals', value: '31', delta: '↑ 7 this week', color: 'text-brand-rust' },
              ].map((s) => (
                <div key={s.label} className="bg-brand-surface border border-brand-border rounded-2xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-brand-ink/40 mb-1.5">{s.label}</p>
                  <p className={`font-serif text-3xl leading-none ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] font-semibold mt-1 text-green-600">{s.delta}</p>
                </div>
              ))}
            </div>

            {/* Safety */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mt-5 mb-2.5">Safety & HCAI Compliance</p>
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-green-50 flex items-center justify-center">
                  <ShieldCheck size={14} className="text-green-600" />
                </div>
                <span className="font-serif text-sm font-semibold text-brand-ink">Automated Checks</span>
              </div>
              {[
                { label: 'No diagnostic language in AI output', status: 'pass' as const },
                { label: 'Crisis hotline on every screen', status: 'pass' as const },
                { label: 'AI grounding accuracy', text: '96.2%', status: 'pass' as const },
                { label: 'Transparency link on AI summaries', status: 'pass' as const },
                { label: 'Demographic bias check', text: 'Review', status: 'warn' as const },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-brand-border/50 last:border-b-0">
                  <span className="text-xs font-medium text-brand-ink/80">{row.label}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg ${row.status === 'pass' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-700'}`}>
                    {row.text || (row.status === 'pass' ? '✓ Pass' : 'Review')}
                  </span>
                </div>
              ))}
            </div>

            {/* Self-Learning */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mt-5 mb-2.5">Self-Learning Loop</p>
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-brand-green/10 flex items-center justify-center">
                  <ThumbsUp size={14} className="text-brand-green" />
                </div>
                <span className="font-serif text-sm font-semibold text-brand-ink">AI Summary Feedback</span>
              </div>
              <div className="h-2.5 rounded-full bg-brand-border overflow-hidden flex mb-2">
                <div className="bg-brand-green h-full rounded-l-full" style={{ width: '78%' }} />
                <div className="bg-brand-rust h-full rounded-r-full" style={{ width: '22%' }} />
              </div>
              <div className="flex justify-between text-xs text-brand-ink/50">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-green inline-block" /> 78% Helpful</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-rust inline-block" /> 22% Needs work</span>
              </div>
              <div className="mt-3 text-xs font-semibold text-brand-rust bg-brand-rust/10 rounded-xl px-3 py-2">
                ⚠ 3 summaries flagged for professional review
              </div>
            </div>

            {/* Community */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mt-5 mb-2.5">Community Health</p>
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-brand-rust/10 flex items-center justify-center">
                  <Heart size={14} className="text-brand-rust" />
                </div>
                <span className="font-serif text-sm font-semibold text-brand-ink">Chautari & Ma Pani</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[{ v: '6', l: 'Active clusters' }, { v: '89', l: 'Stories shared' }, { v: '12', l: 'Pro articles' }].map((s) => (
                  <div key={s.l} className="text-center py-2.5 bg-brand-bg rounded-xl">
                    <p className="font-serif text-xl leading-none text-brand-ink">{s.v}</p>
                    <p className="text-[10px] text-brand-ink/50 mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-[10px] text-brand-ink/30 mt-2 mb-4">
              All metrics are aggregated. No individual user data is visible.<br />Privacy-preserving by design.
            </p>
          </>
        ) : (
          <>
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-3.5 mb-4 text-xs text-brand-ink/60 leading-relaxed">
              Sahara&apos;s admin layer evolves with the platform. These capabilities are designed to scale trust, quality, and cultural reach as the community grows.
            </div>
            {[
              { icon: <BookOpen size={16} />, bg: 'bg-brand-green/10', color: 'text-brand-green', name: 'Professional Knowledge Hub', status: 'planned', desc: "Verified clinicians contribute articles, review AI summaries, and enrich the knowledge base that grounds Maan's responses. Quality controlled by editorial workflow." },
              { icon: <Mic size={16} />, bg: 'bg-brand-rust/10', color: 'text-brand-rust', name: 'Voice Input', status: 'in-progress', desc: 'Speech-to-text via Web Speech API for low-literacy users. Speak observations in Nepali or English — Maan transcribes and organizes automatically.' },
              { icon: <Globe size={16} />, bg: 'bg-brand-ink/5', color: 'text-brand-ink/60', name: 'Multilingual Support', status: 'planned', desc: 'Full Nepali language toggle across all screens. Localized community content, professional profiles, and AI summaries. Hindi and Korean to follow.' },
              { icon: <Bot size={16} />, bg: 'bg-brand-green/10', color: 'text-brand-green', name: 'AI Agents (Tier 3)', status: 'planned', desc: 'Automated content curation, pattern monitoring, and demographic bias detection. Every agent action requires human approval before execution.' },
              { icon: <BarChart3 size={16} />, bg: 'bg-brand-rust/10', color: 'text-brand-rust', name: 'Advanced Analytics', status: 'planned', desc: 'Aggregated trend analysis across communities. Identify emerging mental health patterns by region without exposing individual data. Privacy-preserving by design.' },
            ].map((f) => (
              <div key={f.name} className="bg-brand-surface border border-brand-border rounded-2xl p-4 mb-3">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-xl ${f.bg} flex items-center justify-center ${f.color}`}>{f.icon}</div>
                  <span className="font-serif text-sm font-semibold text-brand-ink">{f.name}</span>
                  <span className={`ml-auto text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-lg ${f.status === 'in-progress' ? 'bg-brand-rust/10 text-brand-rust' : 'bg-brand-green/10 text-brand-green'}`}>
                    {f.status === 'in-progress' ? 'In Progress' : 'Planned'}
                  </span>
                </div>
                <p className="text-xs text-brand-ink/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
            <p className="text-center text-[10px] text-brand-ink/30 mt-2 mb-4">
              Roadmap reflects team vision. Timelines adapt based on<br />community feedback and pilot learnings.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
