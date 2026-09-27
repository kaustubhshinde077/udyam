import React, { useState, useMemo } from 'react';
import {
  Sprout,
  Calendar as CalendarIcon,
  MapPin,
  Maximize2,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Send,
  Bot,
  ShieldCheck,
  TrendingUp,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  Mic,
  ChevronRight,
  Check,
  RotateCcw,
  Bug,
  Tag,
  Scissors,
  DollarSign,
  Smile,
  Compass,
} from 'lucide-react';
import { Language } from '../../types';
import {
  KISAN_SATHI_CROPS,
  CropProfile,
  StageGuidance,
  KISAN_LEARN_LESSONS,
  PEST_DIAGNOSIS_DATABASE,
  PestDiagnosisItem,
  LearnLesson,
} from '../../data/kisanSathiKnowledgeBase';
import {
  FarmerProfile,
  generatePersonalizedFarmPlan,
  answerKisanSathiQuestion,
} from '../../services/kisanSathiService';

interface Props {
  language: Language;
  onBackToHome: () => void;
  onNavigateToMarket?: () => void;
  theme?: 'light' | 'dark';
}

const LOCAL_STORAGE_KEY = 'kisan_sathi_farmer_profile';

export const KisanSathiScreen: React.FC<Props> = ({
  language: initialLanguage,
  onBackToHome,
  onNavigateToMarket,
  theme = 'light',
}) => {
  // 1. Language state (first-class Marathi, Hindi, English switcher)
  const [activeLang, setActiveLang] = useState<Language>(() => {
    return initialLanguage || 'mr';
  });

  // 2. Farmer Farm Profile State
  const [profile, setProfile] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      cropId: 'onion',
      farmAreaAcres: 2,
      location: 'Nashik, Maharashtra',
      district: 'Nashik',
      state: 'Maharashtra',
      village: 'Loni',
      soilInfo: 'Medium Black Loam (Well-drained)',
      irrigationMethod: 'drip',
      plantingStatus: 'crop_growing',
      sowingDate: '2025-10-15',
      expectedHarvestPeriod: 'March – April',
      farmingConstraints: 'Drip laterals installed; regular electricity',
    };
  });

  // Simple Onboarding Step State (0 = Plan Dashboard, 1..5 = Step-by-Step Onboarding)
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  // Active view tab: 'today' | 'seed' | 'timeline' | 'calendar' | 'pest' | 'learn' | 'selling' | 'assistant'
  const [activeView, setActiveView] = useState<
    'today' | 'seed' | 'timeline' | 'calendar' | 'pest' | 'learn' | 'selling' | 'assistant'
  >('today');

  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState<string>('onion_yellowing');
  const [selectedLearnLessonId, setSelectedLearnLessonId] = useState<string>('smart_irrigation');

  // Chat Assistant State
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'assistant'; text: string; knowledgeBasis?: string; sourceUrl?: string }>
  >([
    {
      sender: 'assistant',
      text:
        activeLang === 'mr'
          ? 'राम राम शेतकरी मित्र! मी तुमचा किसान साथी पीक मार्गदर्शक आहे. ICAR आणि इस्त्रायली अचूक शेती तंत्रज्ञानावर आधारित माहिती मी देतो. आज मी तुम्हाला कशी मदत करू?'
          : activeLang === 'hi'
          ? 'नमस्ते किसान मित्र! मैं आपका किसान साथी फसल सहायक हूं। ICAR अनुसंधान एवं इज़राइली सटीक खेती पर आधारित सलाह के लिए आप प्रश्न पूछ सकते हैं।'
          : 'Namaste Farmer! I am your Kisan Sathi Crop Growth Assistant. Grounded in ICAR research and Israeli-inspired precision practices. How can I assist your farm today?',
      knowledgeBasis: 'Indo-Israel Agricultural Project & ICAR Technical Framework',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);

  // Save profile changes to localStorage
  const updateProfile = (updated: Partial<FarmerProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Compute Personalized Farm Plan
  const plan = useMemo(() => {
    return generatePersonalizedFarmPlan(profile);
  }, [profile]);

  // Selected stage for inspection in timeline
  const inspectedStage = useMemo(() => {
    if (selectedStageId) {
      return plan.allStages.find((s) => s.id === selectedStageId) || plan.currentStage;
    }
    return plan.currentStage;
  }, [selectedStageId, plan]);

  // Selected Pest Diagnosis Item
  const activePestDiagnosis = useMemo(() => {
    return (
      PEST_DIAGNOSIS_DATABASE.find((item) => item.id === selectedDiagnosisId) ||
      PEST_DIAGNOSIS_DATABASE[0]
    );
  }, [selectedDiagnosisId]);

  // Selected Learn Lesson
  const activeLearnLesson = useMemo(() => {
    return (
      KISAN_LEARN_LESSONS.find((lesson) => lesson.id === selectedLearnLessonId) ||
      KISAN_LEARN_LESSONS[0]
    );
  }, [selectedLearnLessonId]);

  // Handle Chat Submit
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsAsking(true);

    setTimeout(() => {
      const response = answerKisanSathiQuestion(text, plan, activeLang);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: response.answer,
          knowledgeBasis: response.knowledgeBasis,
          sourceUrl: response.sourceUrl,
        },
      ]);
      setIsAsking(false);
    }, 350);
  };

  // Quick Questions in natural Marathi/Hindi/English
  const quickQuestions = useMemo(() => {
    if (activeLang === 'mr') {
      return [
        'आज काय करायचं?',
        'पिकाला पाणी कधी द्यायचं?',
        'कांद्याला कोणते खत द्यावे?',
        'पाने पिवळी पडत आहेत, काय करू?',
        'काढणी कधी करायची?',
        'बियाणे कसे निवडावे?',
      ];
    } else if (activeLang === 'hi') {
      return [
        'आज क्या करें?',
        'फसल को पानी कब दें?',
        'कौन सा खाद देना चाहिए?',
        'पत्तियां पीली पड़ रही हैं, क्या करें?',
        'कटाई कब करें?',
        'बीज का चयन कैसे करें?',
      ];
    }
    return [
      'What should I do today?',
      'When should I irrigate?',
      'My leaves are turning yellow, what should I check?',
      'What fertilizer should I apply?',
      'When should I harvest?',
      'How to select certified seed?',
    ];
  }, [activeLang]);

  // UI Strings Translation Dictionary
  const ui = useMemo(() => {
    switch (activeLang) {
      case 'mr':
        return {
          badge: 'शेतकरी सहाय्यक • मराठी उपलब्ध',
          israeliBadge: 'इस्त्रायली सूक्ष्म सिंचन व अचूक शेती मार्गदर्शन',
          title: '🌾 किसान साथी',
          subtitle: 'बियाण्यापासून ते थेट बाजारापर्यंत तुमचा विश्वासू कृषी साथीदार',
          goodMorning: 'सुप्रभात, शेतकरी मित्र',
          whatToDoToday: 'आज काय करायचं?',
          todayPrioritiesSub: `तुमच्या ${plan.farmAreaAcres} एकर ${plan.cropProfile.name.mr} पिकासाठी आजचे मुख्य नियोजन:`,
          next7Days: 'पुढील ७ दिवसांचे नियोजन',
          changeFarm: 'शेती तपशील बदला',
          startPlan: 'नवीन शेती नियोजन',
          yourFarmToday: 'माझे शेत आज',
          irrigationStatus: 'ठिबक सिंचन',
          cropStageStatus: 'पीक अवस्था',
          pestStatus: 'रोग व कीड पाहणी',
          upcomingStatus: 'पुढील कामे',
          normal: 'सामान्य / व्यवस्थित',
          caution: 'काळजी घ्या',
          why: 'कारण (WHY):',
          whatToDo: 'काय करावे (WHAT TO DO):',
          when: 'कधी करावे (WHEN):',
          watchFor: 'कशावर लक्ष ठेवावे (WATCH FOR):',
          step1Seed: '🌱 पायरी १: बियाणे निवड',
          beforeYouBuy: 'खरेदी करण्यापूर्वी ५ गोष्टी तपासा',
          checkMyCrop: '🐛 माझे पीक तपासा (रोग व कीड)',
          learnFarming: '📚 शेती शिका (सुलभ धडे)',
          cropCalendar: '📅 माझे शेत कॅलेंडर',
          sellingPrep: '💰 बाजार व विक्री नियोजन',
          askKisanSathi: '🤖 किसान साथीला विचारा',
          voicePrompt: 'माईक दाबून बोला किंवा प्रश्न निवडा',
          currentStageHere: 'तुमचे पीक सध्या या टप्प्यावर आहे',
        };
      case 'hi':
        return {
          badge: 'किसान सहायक • हिंदी एवं मराठी में',
          israeliBadge: 'इज़राइली सूक्ष्म सिंचाई एवं सटीक कृषि मार्गदर्शन',
          title: '🌾 किसान साथी',
          subtitle: 'बीज चयन से लेकर फसल कटाई और बाजार बिक्री तक आपका साथी',
          goodMorning: 'शुभ प्रभात, किसान मित्र',
          whatToDoToday: 'आज क्या करना है?',
          todayPrioritiesSub: `आपके ${plan.farmAreaAcres} एकड़ ${plan.cropProfile.name.hi} खेत हेतु आज की प्राथमिकताएं:`,
          next7Days: 'अगले 7 दिनों की योजना',
          changeFarm: 'खेत विवरण बदलें',
          startPlan: 'नया खेत प्लान शुरू करें',
          yourFarmToday: 'मेरा खेत आज',
          irrigationStatus: 'ड्रिप सिंचाई',
          cropStageStatus: 'फसल अवस्था',
          pestStatus: 'कीट निगरानी',
          upcomingStatus: 'आगामी कार्य',
          normal: 'सामान्य / ठीक',
          caution: 'सावधानी रखें',
          why: 'कारण (WHY):',
          whatToDo: 'क्या करें (WHAT TO DO):',
          when: 'कब करें (WHEN):',
          watchFor: 'क्या ध्यान रखें (WATCH FOR):',
          step1Seed: '🌱 चरण 1: बीज चयन',
          beforeYouBuy: 'खरीदने से पहले आवश्यक जांच',
          checkMyCrop: '🐛 मेरी फसल जांचें (रोग व कीट)',
          learnFarming: '📚 खेती सीखें',
          cropCalendar: '📅 मेरा खेत कैलेंडर',
          sellingPrep: '💰 बाजार एवं बिक्री तैयारी',
          askKisanSathi: '🤖 किसान साथी से पूछें',
          voicePrompt: 'माइक दबाकर बोलें या प्रश्न चुनें',
          currentStageHere: 'आपकी फसल वर्तमान में यहां है',
        };
      default:
        return {
          badge: 'Farmer Assistant • Marathi Available',
          israeliBadge: 'Israeli-Inspired Precision Farming Guidance',
          title: '🌾 KISAN SATHI',
          subtitle: 'Your crop companion from seed to sale',
          goodMorning: 'Good morning, Farmer',
          whatToDoToday: 'WHAT SHOULD I DO TODAY?',
          todayPrioritiesSub: `Actionable priorities for your ${plan.farmAreaAcres} acre ${plan.cropProfile.name.en} plot:`,
          next7Days: 'Next 7 Days Plan',
          changeFarm: 'Change Farm Inputs',
          startPlan: 'Start New Plan',
          yourFarmToday: 'YOUR FARM TODAY',
          irrigationStatus: 'Irrigation',
          cropStageStatus: 'Crop Stage',
          pestStatus: 'Pest Scouting',
          upcomingStatus: 'Upcoming Tasks',
          normal: 'Optimal',
          caution: 'Needs Attention',
          why: 'WHY:',
          whatToDo: 'WHAT TO DO:',
          when: 'WHEN:',
          watchFor: 'WATCH FOR:',
          step1Seed: '🌱 Step 1: Choose Your Seed',
          beforeYouBuy: 'Before You Buy Checklist',
          checkMyCrop: '🐛 Check My Crop (Pests & Diseases)',
          learnFarming: '📚 Learn Precision Farming',
          cropCalendar: '📅 Personal Farm Calendar',
          sellingPrep: '💰 Selling & Market Preparation',
          askKisanSathi: '🤖 Ask Kisan Sathi',
          voicePrompt: 'Tap microphone or choose a quick question below',
          currentStageHere: 'Your crop is currently here',
        };
    }
  }, [activeLang, plan]);

  // =========================================================================
  // SIMPLE 5-STEP ONBOARDING SCREEN (If onboardingStep > 0)
  // =========================================================================
  if (onboardingStep > 0) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-8 text-left animate-fadeIn">
        <div className="bg-white dark:bg-[#0C192A] rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-10 shadow-xl space-y-6">
          {/* Header & Step progress */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {activeLang === 'mr' ? 'सोपे ५ प्रश्न' : activeLang === 'hi' ? 'सरल 5 प्रश्न' : 'Quick 5 Steps'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {activeLang === 'mr'
                  ? 'चला, तुमचे शेती नियोजन सुरू करूया!'
                  : activeLang === 'hi'
                  ? 'आइए अपना खेत प्लान शुरू करें!'
                  : "Let's start your farm plan"}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <span>{onboardingStep} / 5</span>
              <button
                type="button"
                onClick={() => setOnboardingStep(0)}
                className="text-xs text-slate-400 hover:text-slate-600 ml-2"
              >
                ✕
              </button>
            </div>
          </div>

          {/* STEP 1: CROP */}
          {onboardingStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🌱 {activeLang === 'mr' ? 'तुम्ही कोणते पीक घेत आहात?' : 'Which crop are you growing?'}</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(KISAN_SATHI_CROPS) as Array<'onion' | 'corn' | 'grapes' | 'pomegranate'>).map(
                  (cid) => {
                    const c = KISAN_SATHI_CROPS[cid];
                    const isSelected = profile.cropId === cid;
                    return (
                      <button
                        key={cid}
                        type="button"
                        onClick={() => {
                          updateProfile({ cropId: cid });
                          setOnboardingStep(2);
                        }}
                        className={`p-5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/40'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        <span className="text-4xl block">{c.icon}</span>
                        <span className="text-base font-black block mt-2">
                          {c.name[activeLang] || c.name.en}
                        </span>
                        <span className="text-xs opacity-80 block">{c.durationDays} Days</span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* STEP 2: LAND AREA */}
          {onboardingStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📐 {activeLang === 'mr' ? 'तुमचे शेत किती क्षेत्रफळाचे आहे?' : 'How much land do you have?'}</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[0.5, 1, 2, 5].map((acres) => (
                  <button
                    key={acres}
                    type="button"
                    onClick={() => {
                      updateProfile({ farmAreaAcres: acres });
                      setOnboardingStep(3);
                    }}
                    className={`py-4 px-3 rounded-2xl border text-center font-black text-base cursor-pointer transition-all ${
                      profile.farmAreaAcres === acres
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {acres} {activeLang === 'mr' ? 'एकर' : activeLang === 'hi' ? 'एकड़' : 'Acres'}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  {activeLang === 'mr' ? 'किंवा इतर एकर प्रविष्ट करा:' : 'Or enter custom acres:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0.25}
                    max={100}
                    step={0.5}
                    value={profile.farmAreaAcres}
                    onChange={(e) => updateProfile({ farmAreaAcres: Number(e.target.value) || 1 })}
                    className="w-32 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                  >
                    {activeLang === 'mr' ? 'पुढे जा →' : 'Next →'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION */}
          {onboardingStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📍 {activeLang === 'mr' ? 'तुमचे शेत कोठे आहे?' : 'Where is your farm?'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">
                    {activeLang === 'mr' ? 'राज्य' : 'State'}
                  </label>
                  <input
                    type="text"
                    value={profile.state || 'Maharashtra'}
                    onChange={(e) => updateProfile({ state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">
                    {activeLang === 'mr' ? 'जिल्हा' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={profile.district || 'Nashik'}
                    onChange={(e) =>
                      updateProfile({
                        district: e.target.value,
                        location: `${e.target.value}, ${profile.state || 'Maharashtra'}`,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOnboardingStep(4)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer mt-2"
              >
                {activeLang === 'mr' ? 'पुढे जा →' : 'Next →'}
              </button>
            </div>
          )}

          {/* STEP 4: PLANTING STATUS */}
          {onboardingStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🌱 {activeLang === 'mr' ? 'लागवड झाली आहे का?' : 'Have you already planted?'}</span>
              </h3>
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    updateProfile({ plantingStatus: 'not_planted' });
                    setOnboardingStep(5);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                    profile.plantingStatus === 'not_planted'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="block text-sm font-black">
                    {activeLang === 'mr' ? 'अजून नाही (बियाणे निवडायचे आहे)' : 'Not yet (Starting from Seed Selection)'}
                  </span>
                  <span className="text-xs opacity-80 block mt-0.5">
                    {activeLang === 'mr' ? 'आम्ही बियाणे व वाण निवडीपासून मार्गदर्शन करू.' : 'We will guide you from seed selection & land prep.'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateProfile({ plantingStatus: 'recently_planted' });
                    setOnboardingStep(5);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                    profile.plantingStatus === 'recently_planted'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="block text-sm font-black">
                    {activeLang === 'mr' ? 'हो, नुकतीच लावली (१ ते १० दिवस)' : 'Yes, recently planted (1–10 days)'}
                  </span>
                  <span className="text-xs opacity-80 block mt-0.5">
                    {activeLang === 'mr' ? 'रोपे स्थिर होणे व सुरुवातीचे पाणी नियोजन.' : 'Early root establishment guidance.'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateProfile({ plantingStatus: 'crop_growing' });
                    setOnboardingStep(5);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                    profile.plantingStatus === 'crop_growing'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="block text-sm font-black">
                    {activeLang === 'mr' ? 'हो, पीक वाढीच्या अवस्थेत आहे' : 'Yes, crop is already growing'}
                  </span>
                  <span className="text-xs opacity-80 block mt-0.5">
                    {activeLang === 'mr' ? 'सध्याच्या टप्प्यावरून त्वरित मार्गदर्शन मिळवा.' : 'Start directly from your active growth stage.'}
                  </span>
                </button>
              </div>

              {profile.plantingStatus !== 'not_planted' && (
                <div className="pt-2 text-xs">
                  <label className="block font-bold text-slate-500 mb-1">
                    {activeLang === 'mr' ? 'लागवड / पेरणी तारीख' : 'Planting Date:'}
                  </label>
                  <input
                    type="date"
                    value={profile.sowingDate}
                    onChange={(e) => updateProfile({ sowingDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 5: IRRIGATION */}
          {onboardingStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>💧 {activeLang === 'mr' ? 'सिंचनाची कोणती सोय आहे?' : 'What irrigation do you have?'}</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                {[
                  { id: 'drip', label: activeLang === 'mr' ? 'ठिबक सिंचन (Drip)' : 'Drip Micro-Irrigation', icon: '💧' },
                  { id: 'flood', label: activeLang === 'mr' ? 'पाट पाणी (Flood)' : 'Flood / Surface', icon: '🌊' },
                  { id: 'sprinkler', label: activeLang === 'mr' ? 'तुषार (Sprinkler)' : 'Sprinkler', icon: '🚿' },
                  { id: 'borewell', label: activeLang === 'mr' ? 'विहीर / बोअरवेल' : 'Well / Borewell', icon: '🚜' },
                ].map((ir) => (
                  <button
                    key={ir.id}
                    type="button"
                    onClick={() => {
                      updateProfile({ irrigationMethod: ir.id as any });
                      setOnboardingStep(0);
                      if (profile.plantingStatus === 'not_planted') {
                        setActiveView('seed');
                      } else {
                        setActiveView('today');
                      }
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      profile.irrigationMethod === ir.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl block">{ir.icon}</span>
                    <span className="block mt-1">{ir.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Back/Cancel */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            {onboardingStep > 1 ? (
              <button
                type="button"
                onClick={() => setOnboardingStep((s) => s - 1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ← {activeLang === 'mr' ? 'मागे' : 'Back'}
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={() => setOnboardingStep(0)}
              className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              {activeLang === 'mr' ? 'थेट डॅशबोर्ड पहा →' : 'Skip to Dashboard →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN KISAN SATHI FARMER DASHBOARD
  // =========================================================================
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left animate-fadeIn">
      {/* 1. TOP HEADER WITH FIRST-CLASS MARATHI / HINDI / ENGLISH SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-tight">
              {ui.badge}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span>{ui.israeliBadge}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{ui.title}</span>
            <span className="text-sm sm:text-base font-normal text-slate-500">— {ui.subtitle}</span>
          </h1>
        </div>

        {/* Right Controls: Top Language Switcher & Home */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* First-Class Language Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-black">
            <button
              type="button"
              onClick={() => setActiveLang('mr')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLang === 'mr'
                  ? 'bg-emerald-600 text-white shadow-2xs font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600'
              }`}
            >
              मराठी
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('hi')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLang === 'hi'
                  ? 'bg-emerald-600 text-white shadow-2xs font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeLang === 'en'
                  ? 'bg-emerald-600 text-white shadow-2xs font-black'
                  : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600'
              }`}
            >
              English
            </button>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {activeLang === 'mr' ? 'मुख्य पान' : 'Home'}
          </button>
        </div>
      </div>

      {/* 2. SMART FARM HEALTH CARD: "YOUR FARM TODAY" (माझे शेत आज) */}
      <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-3xl shrink-0">
              {plan.cropProfile.icon}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {ui.yourFarmToday}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{plan.cropProfile.name[activeLang] || plan.cropProfile.name.en}</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {plan.farmAreaAcres} {activeLang === 'mr' ? 'एकर' : activeLang === 'hi' ? 'एकड़' : 'Acres'}
                </span>
              </h2>
              <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{profile.location}</span>
                <span className="text-slate-300">•</span>
                <span className="capitalize">{profile.irrigationMethod} Micro-Drip</span>
              </span>
            </div>
          </div>

          {/* Quick Edit Inputs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnboardingStep(1)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{ui.changeFarm}</span>
            </button>
          </div>
        </div>

        {/* 4 Status Health Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">
              {ui.cropStageStatus}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5 truncate">
              {plan.currentStage.stageNameLocal[activeLang === 'mr' ? 'mr' : 'hi'] || plan.currentStage.stageName}
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block mt-1">
              🟢 {profile.plantingStatus === 'not_planted' ? 'बियाणे नियोजन' : `दिवस ${plan.daysElapsed}`}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {ui.irrigationStatus}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5 truncate">
              {profile.irrigationMethod === 'drip' ? 'ठिबक सिंचन' : 'नियमित सिंचन'}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
              🟢 {ui.normal}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase block">
              {ui.pestStatus}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5 truncate">
              {plan.currentStage.whatToMonitor[0]?.slice(0, 24) || 'नियमित पाहणी'}...
            </span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block mt-1">
              🟡 {ui.caution}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {ui.upcomingStatus}
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5 truncate">
              {plan.next7DaysPlanner[0]?.activityLocal[activeLang === 'mr' ? 'mr' : 'hi'] || plan.next7DaysPlanner[0]?.activity}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
              🟢 नियोजित
            </span>
          </div>
        </div>
      </div>

      {/* 3. ONE-TAP ACTION BUTTONS (Large touch-friendly mobile buttons) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {[
          { id: 'today', icon: '☀️', label: activeLang === 'mr' ? 'आज काय करायचं' : activeLang === 'hi' ? 'आज का कार्य' : "Today's Tasks" },
          { id: 'seed', icon: '🌱', label: activeLang === 'mr' ? 'बियाणे निवड' : activeLang === 'hi' ? 'बीज चयन' : 'Seed Selection' },
          { id: 'timeline', icon: '🌿', label: activeLang === 'mr' ? 'पीक वाढ चक्र' : activeLang === 'hi' ? 'फसल चक्र' : 'Crop Stages' },
          { id: 'calendar', icon: '📅', label: activeLang === 'mr' ? 'माझे कॅलेंडर' : activeLang === 'hi' ? 'खेत कैलेंडर' : 'Farm Calendar' },
          { id: 'pest', icon: '🐛', label: activeLang === 'mr' ? 'माझे पीक तपासा' : activeLang === 'hi' ? 'फसल जांचें' : 'Check My Crop' },
          { id: 'learn', icon: '📚', label: activeLang === 'mr' ? 'शेती शिका' : activeLang === 'hi' ? 'खेती सीखें' : 'Learn Farming' },
          { id: 'selling', icon: '💰', label: activeLang === 'mr' ? 'बाजार व विक्री' : activeLang === 'hi' ? 'बाजार तैयारी' : 'Selling & Market' },
          { id: 'assistant', icon: '🤖', label: activeLang === 'mr' ? 'किसान साथी AI' : activeLang === 'hi' ? 'किसान सहायक' : 'Ask Assistant' },
        ].map((btn) => {
          const isActive = activeView === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => setActiveView(btn.id as any)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-black scale-102'
                  : 'bg-white dark:bg-[#0C192A] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-400 font-bold'
              }`}
            >
              <span className="text-xl">{btn.icon}</span>
              <span className="text-[11px] leading-tight truncate w-full">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. VIEW: "WHAT SHOULD I DO TODAY?" */}
      {activeView === 'today' && (
        <div className="space-y-6 animate-fadeIn text-left">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/15 dark:via-[#0E1F33] dark:to-[#071324] rounded-3xl border-2 border-amber-300 dark:border-amber-500/40 p-6 sm:p-8 text-left shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 dark:border-slate-800 pb-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 text-xs font-black uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  {ui.goodMorning} • {profile.plantingStatus === 'not_planted' ? 'लागवड पूर्व नियोजन' : `दिवस ${plan.daysElapsed}`}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {ui.whatToDoToday}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                  {ui.todayPrioritiesSub}
                </p>
              </div>

              {profile.plantingStatus === 'not_planted' && (
                <button
                  type="button"
                  onClick={() => setActiveView('seed')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1 self-start sm:self-center"
                >
                  <span>{ui.step1Seed}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 3-5 Priority Task Cards in WHY / WHAT / WHEN / WATCH format */}
            <div className="space-y-4">
              {plan.todaysPriorities.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#071324] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:border-amber-400 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {item.titleLocal[activeLang === 'mr' ? 'mr' : 'hi'] || item.title}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                    {item.detailsLocal[activeLang === 'mr' ? 'mr' : 'hi'] || item.details}
                  </p>

                  {/* WHY / WHAT / WHEN / WATCH breakdown */}
                  {item.why && (
                    <div className="ml-9 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <strong className="text-amber-700 dark:text-amber-400">{ui.why}</strong>{' '}
                        <span className="text-slate-600 dark:text-slate-300">{item.why}</span>
                      </div>
                      <div>
                        <strong className="text-emerald-700 dark:text-emerald-400">{ui.whatToDo}</strong>{' '}
                        <span className="text-slate-600 dark:text-slate-300">{item.whatToDo}</span>
                      </div>
                      <div>
                        <strong className="text-blue-700 dark:text-blue-400">{ui.when}</strong>{' '}
                        <span className="text-slate-600 dark:text-slate-300">{item.when}</span>
                      </div>
                      <div>
                        <strong className="text-rose-700 dark:text-rose-400">{ui.watchFor}</strong>{' '}
                        <span className="text-slate-600 dark:text-slate-300">{item.whatToWatch}</span>
                      </div>
                    </div>
                  )}

                  <div className="pl-9 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <BookOpen className="w-3 h-3 text-amber-500" />
                    <span>आधार: {item.sourceBasis}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEXT 7 DAYS TIMELINE */}
          <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-left shadow-xs">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
              {ui.next7Days}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {activeLang === 'mr'
                ? 'पुढील आठवड्यातील सिंचन व पीक पाहणीचे वेळापत्रक:'
                : 'Next week scheduled irrigation and scouting:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {plan.next7DaysPlanner.map((day) => (
                <div
                  key={day.dayOffset}
                  className="rounded-2xl p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-2 hover:border-emerald-500 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {day.dayLabelLocal[activeLang === 'mr' ? 'mr' : 'hi'] || day.dayLabel}
                      </span>
                      <span className="text-[10px] text-slate-500">{day.dateStr}</span>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-600">
                      {day.type}
                    </span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                      {day.activityLocal[activeLang === 'mr' ? 'mr' : 'hi'] || day.activity}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3">
                    {day.guidanceLocal[activeLang === 'mr' ? 'mr' : 'hi'] || day.guidance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW: SEED SELECTION (STEP 1) */}
      {activeView === 'seed' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  {ui.step1Seed}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {plan.cropProfile.seedSelection.title[activeLang] || plan.cropProfile.seedSelection.title.en}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {activeLang === 'mr'
                    ? 'योग्य प्रमाणित वाण निवडल्यास उत्पादनात २० ते २५% भरघोस वाढ होते.'
                    : 'Selecting certified variety suitable for your season maximizes yield.'}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 font-bold">
                आधार: {plan.cropProfile.seedSelection.sources[0]?.title || 'ICAR संदर्शिका'}
              </div>
            </div>

            {/* Recommended Varieties */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {activeLang === 'mr' ? 'शिफारस केलेले प्रमाणित वाण / हायब्रिड:' : 'Recommended Certified Varieties:'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.cropProfile.seedSelection.varieties.map((v, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                        {v.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {v.suitableSeason}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {v.keyCharacteristics}
                    </p>
                    <div className="pt-1 text-[10px] text-slate-400">
                      कालावधी: {v.duration} • स्रोत: {v.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* "Before You Buy" Checklist */}
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/60 space-y-3">
              <h3 className="text-sm font-black text-amber-950 dark:text-amber-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>{ui.beforeYouBuy}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900 dark:text-amber-200">
                {plan.cropProfile.seedSelection.beforeYouBuy.map((chk, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/60 font-semibold">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{chk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality & Treatment Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white">
                  {activeLang === 'mr' ? 'बियाणे गुणवत्ता निकष:' : 'Seed Quality Checklist:'}
                </h4>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  {plan.cropProfile.seedSelection.seedQualityChecklist.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60 space-y-2">
                <h4 className="font-extrabold text-teal-950 dark:text-teal-200">
                  {activeLang === 'mr' ? 'बीजप्रक्रिया (Seed Treatment):' : 'Seed Treatment:'}
                </h4>
                <p className="text-teal-900 dark:text-teal-300 leading-relaxed">
                  {plan.cropProfile.seedSelection.seedTreatment}
                </p>
                <div className="text-[10px] text-teal-700 dark:text-teal-400 pt-1">
                  सुरक्षा नियम: बियाणे पेरणीपूर्वी ट्रायकोडर्मा किंवा जैविक घटकांचा वापर करून मर रोगापासून संरक्षण करा.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW: COMPLETE VISUAL CROP LIFECYCLE */}
      {activeView === 'timeline' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase">
                {ui.currentStageHere}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {plan.cropProfile.name[activeLang] || plan.cropProfile.name.en} — संपूर्ण पीक चक्र ({plan.allStages.length} टप्पे)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                कोणत्याही टप्प्यावर क्लिक करून त्या टप्प्यातील कामे, पाणी व कीड नियंत्रण पहा.
              </p>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {plan.allStages.map((st, idx) => {
                const isSelected = inspectedStage.id === st.id;
                const isCurrent = plan.currentStage.id === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStageId(st.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/40'
                        : isCurrent
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-600 text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500 text-white font-black text-[9px] uppercase">
                        सध्या
                      </span>
                    )}
                    <span className="text-[10px] block opacity-80 uppercase font-bold">
                      टप्पा {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold block truncate">
                      {st.stageNameLocal[activeLang === 'mr' ? 'mr' : 'hi'] || st.stageName}
                    </span>
                    <span className="text-[10px] block opacity-75">
                      दिवस {st.dayRange[0]}–{st.dayRange[1]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stage Detail Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {inspectedStage.stageNameLocal[activeLang === 'mr' ? 'mr' : 'hi'] || inspectedStage.stageName} (दिवस {inspectedStage.dayRange[0]} ते {inspectedStage.dayRange[1]})
                </h3>
                <span className="text-[11px] text-slate-400 font-bold">
                  आधार: {inspectedStage.sources[0]?.title || 'ICAR'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-extrabold text-emerald-800 dark:text-emerald-300 mb-1">
                    ✓ काय करायचे (What to do):
                  </h4>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {inspectedStage.whatToDo.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-extrabold text-amber-800 dark:text-amber-300 mb-1">
                    🔍 कशावर लक्ष ठेवावे (What to monitor):
                  </h4>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {inspectedStage.whatToMonitor.map((m, i) => (
                      <li key={i}>• {m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-extrabold text-blue-800 dark:text-blue-300 mb-1">
                    💧 पाणी व्यवस्थापन (Irrigation):
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300">{inspectedStage.irrigationGuidance}</p>
                </div>

                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-extrabold text-teal-800 dark:text-teal-300 mb-1">
                    🌿 खत नियोजन (Nutrients):
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300">{inspectedStage.nutrientGuidance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. VIEW: 🐛 "CHECK MY CROP" PEST DIAGNOSIS */}
      {activeView === 'pest' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase">
                {ui.checkMyCrop}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                पिकावरील रोग व कीड लक्षणे तपासा
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                लक्षण निवडा आणि ICAR शास्त्रोक्त उपायांची माहिती मिळवा. अनधिकृत औषध फवारणी टाळा.
              </p>
            </div>

            {/* Symptom Selection Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PEST_DIAGNOSIS_DATABASE.map((diag) => {
                const isSelected = activePestDiagnosis.id === diag.id;
                return (
                  <button
                    key={diag.id}
                    type="button"
                    onClick={() => setSelectedDiagnosisId(diag.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-200 ring-2 ring-rose-400/40'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase text-slate-400 block">
                      {diag.cropId}
                    </span>
                    <span className="text-sm font-black block mt-1">
                      {diag.symptomTitle[activeLang] || diag.symptomTitle.en}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Diagnosis Result Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                लक्षण विश्लेषण: {activePestDiagnosis.symptomTitle[activeLang] || activePestDiagnosis.symptomTitle.en}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h4 className="font-extrabold text-amber-800 dark:text-amber-300">
                    १. संभाव्य कारणे (Possible Causes):
                  </h4>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {activePestDiagnosis.possibleCauses.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h4 className="font-extrabold text-blue-800 dark:text-blue-300">
                    २. काय निरीक्षण करावे (What to observe):
                  </h4>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                    {activePestDiagnosis.whatToObserve.map((o, i) => (
                      <li key={i}>• {o}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50 space-y-1 text-xs">
                <h4 className="font-extrabold text-emerald-900 dark:text-emerald-200">
                  ३. सुरक्षित पुढील पावले (Safe Next Steps):
                </h4>
                <ul className="space-y-1 text-emerald-950 dark:text-emerald-100">
                  {activePestDiagnosis.safeNextSteps.map((s, i) => (
                    <li key={i}>✓ {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200">
                <strong>तज्ज्ञांशी कधी संपर्क साधावा:</strong> {activePestDiagnosis.whenToContactExpert}
              </div>

              <div className="text-[10px] text-slate-400">
                वैज्ञानिक आधार: {activePestDiagnosis.sourceBasis}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. VIEW: 📅 PERSONAL FARM CALENDAR */}
      {activeView === 'calendar' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase">
                {ui.cropCalendar}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {activeLang === 'mr' ? 'तुमचे वैयक्तिक शेती कॅलेंडर' : 'Personal Farm Activity Calendar'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                आज, या आठवड्यात आणि आगामी टप्प्यातील शेती कामांचे व्यवस्थित नियोजन.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Today */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-amber-600 dark:text-amber-400 border-b border-amber-200 dark:border-amber-800/60 pb-2">
                  ☀️ {activeLang === 'mr' ? 'आजची कामे (TODAY)' : 'TODAY'}
                </h3>
                <div className="space-y-2.5">
                  {plan.calendar.today.map((t) => (
                    <div key={t.id} className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 block">{t.time}</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">{t.task}</p>
                      <span className="text-[10px] text-slate-500 block">{t.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* This Week */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 border-b border-emerald-200 dark:border-emerald-800/60 pb-2">
                  📅 {activeLang === 'mr' ? 'या आठवड्यात (THIS WEEK)' : 'THIS WEEK'}
                </h3>
                <div className="space-y-2.5">
                  {plan.calendar.thisWeek.map((w) => (
                    <div key={w.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">{w.day}</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">{w.task}</p>
                      <span className="text-[10px] text-slate-500 block">{w.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800/60 pb-2">
                  🌱 {activeLang === 'mr' ? 'पुढील टप्पा (UPCOMING)' : 'UPCOMING'}
                </h3>
                <div className="space-y-2.5">
                  {plan.calendar.upcoming.map((u) => (
                    <div key={u.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">{u.timeframe}</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">{u.task}</p>
                      <span className="text-[10px] text-slate-500 block">{u.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. VIEW: 📚 "LEARN FARMING" SHORT VISUAL LESSONS */}
      {activeView === 'learn' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase">
                {ui.learnFarming}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {activeLang === 'mr' ? 'अचूक शेती तंत्रज्ञान व सोपे धडे' : 'Scientific & Precision Farming Lessons'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                पाणी, खत, बियाणे आणि कीड नियंत्रणाचे मूलभूत नियम सोप्या भाषेत.
              </p>
            </div>

            {/* Lesson Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {KISAN_LEARN_LESSONS.map((ls) => {
                const isSel = activeLearnLesson.id === ls.id;
                return (
                  <button
                    key={ls.id}
                    type="button"
                    onClick={() => setSelectedLearnLessonId(ls.id)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSel
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl block">{ls.icon}</span>
                    <span className="text-xs font-extrabold block mt-1 truncate">
                      {ls.title[activeLang] || ls.title.en}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Lesson Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{activeLearnLesson.icon}</span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {activeLearnLesson.title[activeLang] || activeLearnLesson.title.en}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeLearnLesson.summary[activeLang] || activeLearnLesson.summary.en}
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {activeLang === 'mr' ? 'मुख्य ४ वैज्ञानिक सूत्रे:' : 'Key Principles:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeLearnLesson.keyPoints.map((pt, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="text-slate-800 dark:text-slate-200">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                संदर्भ स्रोत: {activeLearnLesson.sourceBasis}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. VIEW: 💰 SELLING PREPARATION & MARKET */}
      {activeView === 'selling' && (
        <div className="space-y-6 animate-fadeIn text-left">
          <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  {ui.sellingPrep}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {plan.cropProfile.name[activeLang] || plan.cropProfile.name.en} — काढणी, प्रतवारी व बाजार विक्री
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  योग्य वाळवण, प्रतवारी आणि बाजारपेठेतील आवक पाहून विक्रीचे नियोजन करा.
                </p>
              </div>

              {onNavigateToMarket && (
                <button
                  type="button"
                  onClick={onNavigateToMarket}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <span>नाशिक बाजारभाव अंदाज तपासा</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 4 Cards: Harvest, Curing, Grading, Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-emerald-600" />
                  <span>काढणी परिपक्वतेची लक्षणे:</span>
                </h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {plan.cropProfile.harvestAndMarket.harvestIndicators.map((h, i) => (
                    <li key={i}>• {h}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>वाळवण व क्युरिंग:</span>
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {plan.cropProfile.harvestAndMarket.curingAndDrying}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>प्रतवारी व पॅकिंग:</span>
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {plan.cropProfile.harvestAndMarket.gradingAndSorting}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>बाजार व विक्री धोरण:</span>
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {plan.cropProfile.harvestAndMarket.sellingStrategy}
                </p>
                <div className="pt-1 text-[10px] text-slate-500">
                  साठवणूक पद्धत: {plan.cropProfile.harvestAndMarket.storageAdvice}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. VIEW: 🤖 KISAN SATHI CHAT ASSISTANT (CONVERSATIONAL AI) */}
      {activeView === 'assistant' && (
        <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn text-left">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {ui.askKisanSathi}
                </h2>
                <span className="text-[11px] text-slate-500">
                  {activeLang === 'mr'
                    ? 'ICAR व इस्त्रायली सिंचन तंत्रज्ञानावर आधारित थेट शेतकरी मदतनीस'
                    : 'Grounded in ICAR & Indo-Israeli Precision Farming'}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              सत्यापित कृषी माहिती
            </div>
          </div>

          {/* Quick Question Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400">
              {activeLang === 'mr' ? 'वारंवार विचारले जाणारे प्रश्न:' : 'Common Questions:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((qq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(qq)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  {qq}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Log */}
          <div className="space-y-3.5 max-h-[440px] overflow-y-auto p-4 rounded-2xl bg-slate-50/80 dark:bg-[#071324] border border-slate-200 dark:border-slate-800">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none font-medium'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-2xs'
                  }`}
                >
                  {msg.text}

                  {msg.knowledgeBasis && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold">माहितीचा आधार: {msg.knowledgeBasis}</span>
                      {msg.sourceUrl && (
                        <a
                          href={msg.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 underline"
                        >
                          पोर्टल पहा
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAsking && (
              <div className="text-xs text-slate-400 flex items-center gap-1.5 p-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{activeLang === 'mr' ? 'माहिती शोधत आहे...' : 'Retrieving verified knowledge...'}</span>
              </div>
            )}
          </div>

          {/* Input with Voice-Ready Microphone Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button (UI Ready for Voice) */}
            <button
              type="button"
              onClick={() => {
                const sampleVoice =
                  activeLang === 'mr' ? 'आज काय करायचं?' : activeLang === 'hi' ? 'आज क्या करें?' : 'What should I do today?';
                setChatInput(sampleVoice);
              }}
              title={ui.voicePrompt}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0 transition-colors"
            >
              <Mic className="w-4 h-4 text-emerald-600" />
            </button>

            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={
                activeLang === 'mr'
                  ? 'उदा. पाणी कधी द्यावे, पाने पिवळी पडत आहेत, बियाणे निवड...'
                  : 'Ask about irrigation, seed selection, yellow leaves, harvest...'
              }
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              disabled={isAsking || !chatInput.trim()}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>{activeLang === 'mr' ? 'विचारा' : 'Ask'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 12. STRICT AGRICULTURAL SAFETY POLICY */}
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/60 flex items-start gap-3 text-left">
        <ShieldCheck className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-amber-950 dark:text-amber-200">
            {activeLang === 'mr' ? 'शेतकरी सुरक्षा व शून्य-भ्रामक माहिती धोरण' : 'Agricultural Safety Policy'}
          </h4>
          <p className="text-[11px] text-amber-900/90 dark:text-amber-300/80 leading-relaxed">
            {activeLang === 'mr'
              ? 'किसान साथी मधील सर्व माहिती ICAR संशोधन संस्था व इंडो-इस्त्रायल प्रकल्पाच्या अधिकृत मार्गदर्शनावर आधारित आहे. आम्ही रासायनिक कीटकनाशकांचे मनमानी प्रमाण किंवा हमीभावाचे दावे करत नाही. रासायनिक फवारणीपूर्वी नेहमी आपल्या कृषी विज्ञान केंद्रातील (KVK) तज्ज्ञांचा सल्ला घ्या.'
              : 'All advice is drawn strictly from ICAR research institutes and Indo-Israeli precision frameworks. ARTH AI never fabricates chemical doses or claims guaranteed market prices. Always verify chemical treatments with your local KVK.'}
          </p>
        </div>
      </div>
    </div>
  );
};
