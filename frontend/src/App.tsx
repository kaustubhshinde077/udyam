import React, { useState, useEffect } from 'react';
import {
  BasicInfoData,
  BusinessSetupData,
  Language,
  Phase2CostData,
  FinancialFeasibilityResult,
  JourneyMode,
} from './types';
import { Header, JourneyStageId } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HelpModal } from './components/common/HelpModal';
import { LeavePlanModal } from './components/common/LeavePlanModal';
import { BrandIntroAnimation } from './components/common/BrandIntroAnimation';

// Landing Screen
import { LandingScreen } from './components/part1/LandingScreen';
import { KisanSathiScreen } from './components/kisanSathi/KisanSathiScreen';

// 7-Stage User Journey Components (Business Track)
import { Stage01Details } from './components/journey/Stage01Details';
import { Stage01Idea } from './components/journey/Stage01Idea';
import { Stage02LocalCheck } from './components/journey/Stage02LocalCheck';
import { Stage04Feasibility } from './components/journey/Stage04Feasibility';
import { Stage04Financing } from './components/journey/Stage04Financing';
import { Stage05YourPlan } from './components/journey/Stage05YourPlan';
import { Stage06TrackAndImprove } from './components/journey/Stage06TrackAndImprove';

// Farmer-Specific Financing Assistance Journey Components
import { FarmerDetails } from './components/journey/FarmerDetails';
import { FarmerFinancialAssessment } from './components/journey/FarmerFinancialAssessment';
import { FarmerLoanStatus } from './components/journey/FarmerLoanStatus';
import { FarmerAssistance } from './components/journey/FarmerAssistance';
import { FarmerSchemes } from './components/journey/FarmerSchemes';
import { FarmerActionPlan } from './components/journey/FarmerActionPlan';

// New First-Class Screens & AI Assistants
import { FinancialEngineScreen } from './components/journey/FinancialEngineScreen';
import { DailyAIAdvisorScreen } from './components/advisor/DailyAIAdvisorScreen';
import { AskArthChatModal } from './components/chat/AskArthChatModal';
import { DraggableArthChatbot } from './components/common/DraggableArthChatbot';
import { LoginPage } from './components/auth/LoginPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { PublicSurveyRespondentView } from './components/survey/PublicSurveyRespondentView';
import { getSurveyById, getOrCreateSurveyForContext } from './utils/surveyStorage';

// Presets & Financial Calculation Engine
import { DEMO_PRESETS, DemoPresetKey } from './data/demoPresets';
import { getLocalAnalysis } from './data/mockLocalData';
import {
  calculateFinancialFeasibility,
  calculateSensitivityCases,
  calculateRisks,
  evaluateTwoGates,
} from './utils/calculations';
import { Bot, Sparkles, Calculator, CalendarDays } from 'lucide-react';

export type AppJourneyStage = 'landing' | JourneyStageId | 'login' | 'kisan_sathi';

const STORAGE_KEYS = {
  BASIC_INFO: 'arth_ai_basic_info',
  BUSINESS_SETUP: 'arth_ai_business_setup',
  PHASE2_COST: 'arth_ai_phase2_cost',
  SELECTED_SCHEME: 'arth_ai_selected_scheme',
  JOURNEY_STAGE: 'arth_ai_journey_stage',
  MAX_STAGE: 'arth_ai_max_stage',
  LANGUAGE: 'arth_ai_language',
  AUTHENTICATED: 'arth_ai_authenticated',
  AUTH_MOBILE: 'arth_ai_auth_mobile',
};

const DEFAULT_BASIC_INFO: BasicInfoData = {
  name: '',
  dob: '',
  gender: 'Female',
  category: 'OBC',
  mobile: '',
  currentOccupation: '',
  workedInBusinessBefore: 'No',
  experienceYears: 0,
  state: 'Maharashtra',
  district: 'Ahmednagar',
  village: 'Loni Budruk',
  pincode: '413736',
  areaType: 'Rural',
  reportLanguage: 'English',
  specialAssistance: 'No',
};

const DEFAULT_BUSINESS_SETUP: BusinessSetupData = {
  entityType: 'business',
  businessCategory: 'Dairy Business',
  subActivity: 'Milk Collection & Chilling Unit',
  workLocation: 'Rented Shop',
  sellLocation: ['Local Village Customers', 'Weekly Haat / Mandi'],
  rawMaterialEase: 'Yes, nearby',
  similarBusinessesNearby: '1–2',
  alreadyHave: ['Basic tools & utensils'],
  needToStart: ['Machinery / Equipment', 'Working Capital stock'],
  ownStartingMoney: 50000,
  needFinancialSupport: 'Yes',
  financialSupportAmount: 330000,
  hasInformalLoan: 'No',
};

const DEFAULT_PHASE2_COST: Phase2CostData = {
  costItems: [
    {
      category: 'Shop / Place',
      description: 'Shed renovation or floor cementing',
      amount: 25000,
      selected: true,
    },
    {
      category: 'Equipment / Tools',
      description: 'Milk testing machine, fat analyzer, aluminium milk cans',
      amount: 85000,
      selected: true,
    },
    {
      category: 'Vehicle',
      description: 'Second-hand two-wheeler / delivery carrier',
      amount: 40000,
      selected: true,
    },
    {
      category: 'Livestock',
      description: 'Additional high-yield dairy animal',
      amount: 50000,
      selected: true,
    },
    {
      category: 'Raw Material',
      description: 'Initial cattle feed stock & testing consumables',
      amount: 20000,
      selected: true,
    },
  ],
  expectedPricePerUnit: 42,
  expectedCustomersOrUnitsPerMonth: 2200,
  rawMaterialCostPerMonth: 55000,
  otherMonthlyExpenses: 15000,
};

export default function App() {
  // Theme state with localStorage fallback and system preference detection
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('arth_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('arth_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn('Theme update error:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Load initial states with localStorage fallback
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language) || 'en';
  });
 const [showBrandIntro, setShowBrandIntro] = useState<boolean>(true);

  // Authentication State (Local/Demo for SIH Prototype)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_KEYS.AUTHENTICATED) === 'true';
      }
    } catch {
      // fallback
    }
    return false;
  });

  // Restore authenticated session from localStorage if present
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedAuth = localStorage.getItem(STORAGE_KEYS.AUTHENTICATED) === 'true';
        const storedMobile = localStorage.getItem(STORAGE_KEYS.AUTH_MOBILE);
        if (storedAuth && storedMobile) {
          setBasicInfo((prev) => ({
            ...prev,
            mobile: storedMobile || prev.mobile || '9876543210',
          }));
        }
      }
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, []);

  const [journeyStage, setJourneyStage] = useState<AppJourneyStage>(() => {
    try {
      const isAuth = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.AUTHENTICATED) === 'true';
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const hash = window.location.hash;
        if (path === '/login' || hash === '#/login' || hash === '#login') {
          return 'login';
        }
        if (
          path === '/onboarding' ||
          path.startsWith('/onboarding') ||
          hash.includes('onboarding') ||
          path === '/details'
        ) {
          return isAuth ? 'details' : 'login';
        }
      }
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNEY_STAGE) as AppJourneyStage;
      if (saved && saved !== 'landing' && saved !== 'login' && !isAuth) {
        return 'login';
      }
      return saved || 'landing';
    } catch {
      return 'landing';
    }
  });

  // Direct Community Survey link detection (e.g. ?surveyId=... or /community-survey/<id>)
  const [activeSurveyId, setActiveSurveyId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sId = params.get('surveyId') || params.get('survey');
      if (sId) return sId;
      const path = window.location.pathname;
      if (path.includes('/community-survey/')) {
        return path.split('/community-survey/')[1];
      }
      const hash = window.location.hash;
      if (hash.includes('community-survey/')) {
        return hash.split('community-survey/')[1];
      }
    }
    return null;
  });

  const [leaveModalOpen, setLeaveModalOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [helpTopic, setHelpTopic] = useState<string>('general');
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);

  const handleOpenChat = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    setIsChatDrawerOpen(true);
  };

  // Track max stage reached to allow backward/forward jump in header
  const [maxStageReached, setMaxStageReached] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MAX_STAGE);
    return saved ? Number(saved) : 0;
  });

  // Application State
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BASIC_INFO);
      const savedMobile = localStorage.getItem(STORAGE_KEYS.AUTH_MOBILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (savedMobile && !parsed.mobile) {
          parsed.mobile = savedMobile;
        }
        return parsed;
      }
      return {
        ...DEFAULT_BASIC_INFO,
        mobile: savedMobile || '',
      };
    } catch {
      return DEFAULT_BASIC_INFO;
    }
  });

  const [businessSetup, setBusinessSetup] = useState<BusinessSetupData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUSINESS_SETUP);
      return saved ? JSON.parse(saved) : DEFAULT_BUSINESS_SETUP;
    } catch {
      return DEFAULT_BUSINESS_SETUP;
    }
  });

  const [phase2Cost, setPhase2Cost] = useState<Phase2CostData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHASE2_COST);
      return saved ? JSON.parse(saved) : DEFAULT_PHASE2_COST;
    } catch {
      return DEFAULT_PHASE2_COST;
    }
  });

  const [selectedScheme, setSelectedScheme] = useState<'micro' | 'term'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.SELECTED_SCHEME) as 'micro' | 'term') || 'term';
  });

  const [journeyMode, setJourneyMode] = useState<JourneyMode>(() => {
    try {
      const saved = localStorage.getItem('arth_ai_journey_mode') as JourneyMode;
      if (saved === 'farmer' || saved === 'business') return saved;
      const savedSetup = localStorage.getItem(STORAGE_KEYS.BUSINESS_SETUP);
      if (savedSetup) {
        const parsed = JSON.parse(savedSetup);
        if (parsed.entityType === 'farmer') return 'farmer';
      }
    } catch {}
    return 'business';
  });

  // Persist states to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      localStorage.setItem(STORAGE_KEYS.JOURNEY_STAGE, journeyStage);
      localStorage.setItem(STORAGE_KEYS.MAX_STAGE, maxStageReached.toString());
      localStorage.setItem(STORAGE_KEYS.BASIC_INFO, JSON.stringify(basicInfo));
      localStorage.setItem(STORAGE_KEYS.BUSINESS_SETUP, JSON.stringify(businessSetup));
      localStorage.setItem(STORAGE_KEYS.PHASE2_COST, JSON.stringify(phase2Cost));
      localStorage.setItem(STORAGE_KEYS.SELECTED_SCHEME, selectedScheme);
      localStorage.setItem('arth_ai_journey_mode', journeyMode);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [language, journeyStage, maxStageReached, basicInfo, businessSetup, phase2Cost, selectedScheme, journeyMode]);

  // Dynamic derivations based on user inputs
  const hyperLocal = getLocalAnalysis(
    businessSetup.businessCategory,
    businessSetup.subActivity,
    basicInfo.district,
    basicInfo.village
  );

  const feasibility = calculateFinancialFeasibility(
    basicInfo,
    businessSetup,
    phase2Cost,
    selectedScheme
  );
  const sensitivity = calculateSensitivityCases(feasibility);
  const risks = calculateRisks(basicInfo, businessSetup, hyperLocal, feasibility);
  const twoGate = evaluateTwoGates(
    hyperLocal,
    businessSetup,
    feasibility,
    sensitivity
  );

  const businessStageOrder: JourneyStageId[] = [
    'details',
    'idea',
    'local_check',
    'feasibility',
    'financial_engine',
    'financing',
    'plan',
    'track',
    'daily_advisor',
  ];

  const farmerStageOrder: JourneyStageId[] = [
    'farmer_details',
    'farmer_assessment',
    'farmer_loan_status',
    'farmer_assistance',
    'farmer_schemes',
    'farmer_plan',
  ];

  const stageOrder = journeyMode === 'farmer' ? farmerStageOrder : businessStageOrder;

  const navigateToStage = (stage: JourneyStageId) => {
    const idx = stageOrder.indexOf(stage);
    if (idx > maxStageReached && idx !== -1) {
      setMaxStageReached(idx);
    }
    setJourneyStage(stage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prevent bypassing authentication: redirect to /login if unauthenticated (allow landing, login, and kisan_sathi)
  useEffect(() => {
    if (!isAuthenticated && journeyStage !== 'landing' && journeyStage !== 'login' && journeyStage !== 'kisan_sathi') {
      setJourneyStage('login');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.history.pushState(null, '', '/login');
      }
    }
  }, [isAuthenticated, journeyStage]);

  // Sync URL when journeyStage changes, and handle browser back/forward buttons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (journeyStage === 'login') {
        if (window.location.pathname !== '/login') {
          window.history.pushState(null, '', '/login');
        }
      } else if (journeyStage === 'landing') {
        if (window.location.pathname === '/login') {
          window.history.pushState(null, '', '/');
        }
      } else if (journeyStage === 'details') {
        if (!window.location.pathname.startsWith('/onboarding')) {
          window.history.pushState(null, '', '/onboarding');
        }
      }
    }

    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const hash = window.location.hash;
        const isAuth = localStorage.getItem(STORAGE_KEYS.AUTHENTICATED) === 'true';

        if (path === '/login' || hash === '#/login' || hash === '#login') {
          setJourneyStage('login');
        } else if (path === '/onboarding' || path.startsWith('/onboarding') || hash.includes('onboarding')) {
          if (isAuth) {
            setJourneyStage('details');
          } else {
            setJourneyStage('login');
            window.history.replaceState(null, '', '/login');
          }
        } else if (path === '/' || path === '') {
          setJourneyStage('landing');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [journeyStage, isAuthenticated]);

  const handleLoginClick = () => {
    setJourneyStage('login');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (verifiedMobile: string, _uid?: string) => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTHENTICATED, 'true');
      if (verifiedMobile) {
        localStorage.setItem(STORAGE_KEYS.AUTH_MOBILE, verifiedMobile);
      }
    } catch (e) {
      console.warn('Failed saving auth to localStorage:', e);
    }

    if (verifiedMobile) {
      setBasicInfo((prev) => ({
        ...prev,
        mobile: verifiedMobile,
      }));
    }

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/onboarding');
    }
    // Navigate to Step 1: Business Journey / Business Status (Stage 01: Details)
    navigateToStage('details');
  };

  const handleBackToHomeFromLogin = () => {
    setJourneyStage('landing');
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPlan = () => {
    if (!isAuthenticated) {
      setJourneyStage('login');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/login');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/onboarding');
      }
      navigateToStage('details');
    }
  };

  const handleLoadPreset = (presetKey: DemoPresetKey) => {
    const preset = DEMO_PRESETS[presetKey];
    if (!preset) return;
    setBasicInfo(preset.basicInfo);
    setBusinessSetup(preset.businessSetup);
    setPhase2Cost(preset.phase2Cost);

    const calculatedCost = preset.phase2Cost.costItems
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    setSelectedScheme(calculatedCost <= 140000 ? 'micro' : 'term');

    if (preset.businessSetup.entityType === 'farmer') {
      setJourneyMode('farmer');
      setMaxStageReached(1);
      setJourneyStage('farmer_assessment');
    } else {
      setJourneyMode('business');
      // Preset loaded: take user to Step 02 Local Check to inspect live evidence
      setMaxStageReached(2);
      setJourneyStage('local_check');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenHelp = (topic?: string) => {
    setHelpTopic(topic || 'general');
    setIsHelpOpen(true);
  };

  const handleLogoOrHomeClick = () => {
    if (journeyStage === 'login') {
      handleBackToHomeFromLogin();
      return;
    }
    if (journeyStage === 'landing') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (journeyStage === 'kisan_sathi') {
      setJourneyStage('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setLeaveModalOpen(true);
  };

  const handleConfirmLeave = () => {
    setLeaveModalOpen(false);
    setJourneyStage('landing');
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTHENTICATED);
      localStorage.removeItem(STORAGE_KEYS.AUTH_MOBILE);
    } catch {}
    setIsAuthenticated(false);
    // Return directly to login screen
    setJourneyStage('login');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all entered data and start a new business plan from scratch?')) {
      try {
        localStorage.clear();
      } catch {}
      setIsAuthenticated(false);
      setBasicInfo(DEFAULT_BASIC_INFO);
      setBusinessSetup(DEFAULT_BUSINESS_SETUP);
      setPhase2Cost(DEFAULT_PHASE2_COST);
      setSelectedScheme('term');
      setMaxStageReached(0);
      setJourneyStage('landing');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Callback when Financial Engine applies updated numbers
  const handleUpdateFinancials = (
    newFeasibility: FinancialFeasibilityResult,
    newCostData: Phase2CostData
  ) => {
    setPhase2Cost(newCostData);
    if (newFeasibility.selectedScheme) {
      setSelectedScheme(newFeasibility.selectedScheme);
    }
    setBusinessSetup((prev) => ({
      ...prev,
      ownStartingMoney: newFeasibility.ownContribution,
      financialSupportAmount: newFeasibility.potentialLoan,
    }));
  };

  // Fullscreen Cinematic Brand Intro Animation
  if (showBrandIntro) {
    return (
      <BrandIntroAnimation
        onComplete={() => setShowBrandIntro(false)}
        lang={language}
      />
    );
  }

  // Dedicated Separate Login / Authentication Page
  if (journeyStage === 'login') {
    return (
      <LoginPage
        onSuccess={handleLoginSuccess}
        onBackToHome={handleBackToHomeFromLogin}
        language={language}
      />
    );
  }

  // Standalone Public Survey Respondent View (via shareable link/QR)
  if (activeSurveyId) {
    const isFarmerEntity = businessSetup.entityType === 'farmer';
    const crop = businessSetup.farmerData?.cropName || 'Kharif Onion';
    const activityName = isFarmerEntity
      ? `${crop} Farming`
      : businessSetup.subActivity || businessSetup.businessCategory || 'Micro-Enterprise';

    const respondentSurvey =
      getSurveyById(activeSurveyId) ||
      getOrCreateSurveyForContext(
        basicInfo.village || 'Village',
        basicInfo.district || 'District',
        basicInfo.state || 'Maharashtra',
        businessSetup.businessCategory,
        activityName,
        isFarmerEntity,
        crop
      );

    return (
      <div className="min-h-screen bg-[#FAFBFD] dark:bg-[#07111E] text-slate-900 dark:text-slate-100 font-sans antialiased py-6 px-4 transition-colors">
        <PublicSurveyRespondentView
          survey={respondentSurvey}
          onExit={() => {
            if (typeof window !== 'undefined') {
              const url = new URL(window.location.href);
              url.searchParams.delete('surveyId');
              url.searchParams.delete('survey');
              window.history.pushState(null, '', url.pathname || '/');
            }
            setActiveSurveyId(null);
          }}
          theme={theme}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFD] dark:bg-[#07111E] text-slate-900 dark:text-slate-100 font-sans antialiased relative transition-colors duration-200">
      {/* 1. Header with navigation, engine shortcuts & safety home button */}
      <Header
        language={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          const langMap: Record<Language, 'English' | 'Hindi' | 'Marathi'> = {
            en: 'English',
            hi: 'Hindi',
            mr: 'Marathi',
          };
          setBasicInfo((prev) => ({
            ...prev,
            reportLanguage: langMap[lang] || 'English',
          }));
        }}
        onOpenHelp={() => handleOpenHelp('general')}
        onGoHome={handleLogoOrHomeClick}
        currentStage={journeyStage}
        onJumpStage={(stage) => navigateToStage(stage)}
        onStartPlan={handleStartPlan}
        onOpenChat={() => handleOpenChat()}
        onResetProgress={handleResetProgress}
        theme={theme}
        onToggleTheme={toggleTheme}
        journeyMode={journeyMode}
        userName={basicInfo.name || 'Savita Patil'}
        onOpenProfile={() => navigateToStage('profile')}
        onOpenKisanSathi={() => {
          setJourneyStage('kisan_sathi');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateSection={(sectionId) => {
          if (journeyStage !== 'landing') {
            setLeaveModalOpen(true);
          } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 2. Main Content Container: Renders Landing or The 7-Stage Journey */}
      <main className="flex-1 w-full pb-16 sm:pb-20">
        {journeyStage === 'landing' && (
          <LandingScreen
            language={language}
            onStart={handleStartPlan}
            onLoadPreset={handleLoadPreset}
            onWatchIntro={() => setShowBrandIntro(true)}
            onOpenKisanSathi={() => {
              setJourneyStage('kisan_sathi');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            theme={theme}
          />
        )}

        {/* KISAN SATHI — CROP GROWTH ASSISTANT */}
        {journeyStage === 'kisan_sathi' && (
          <KisanSathiScreen
            language={language}
            onBackToHome={handleLogoOrHomeClick}
            onNavigateToMarket={() => {
              setJourneyStage('landing');
              setTimeout(() => {
                const el = document.getElementById('nashik-crop-market-predictor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            theme={theme}
          />
        )}

        {/* STAGE 01: DETAILS */}
        {journeyStage === 'details' && (
          <Stage01Details
            initialBasicInfo={basicInfo}
            initialBusinessSetup={businessSetup}
            language={language}
            onSaveAndNext={(updatedBasic, updatedBusiness) => {
              setBasicInfo(updatedBasic);
              if (updatedBusiness) {
                setBusinessSetup(updatedBusiness);
              }
              navigateToStage('idea');
            }}
            onBack={handleLogoOrHomeClick}
            onOpenChat={() => handleOpenChat()}
            theme={theme}
          />
        )}

        {/* STAGE 02: IDEA */}
        {journeyStage === 'idea' && (
          <Stage01Idea
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            initialBasicInfo={basicInfo}
            initialBusinessSetup={businessSetup}
            language={language}
            onSaveAndNext={(updatedBasic, updatedBusiness) => {
              setBasicInfo(updatedBasic);
              setBusinessSetup(updatedBusiness);
              if (updatedBusiness.entityType === 'farmer') {
                setJourneyMode('farmer');
                navigateToStage('farmer_details');
              } else {
                setJourneyMode('business');
                navigateToStage('local_check');
              }
            }}
            onBack={() => navigateToStage('details')}
            onBackToHome={handleLogoOrHomeClick}
          />
        )}

        {/* ======================================================== */}
        {/* FARMER FINANCING-ASSISTANCE JOURNEY (6 DEDICATED STAGES) */}
        {/* ======================================================== */}

        {/* FARMER STAGE 01: FARM & CROP DETAILS */}
        {journeyStage === 'farmer_details' && (
          <FarmerDetails
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            onSaveAndNext={(updatedBasic, updatedBusiness) => {
              setBasicInfo(updatedBasic);
              setBusinessSetup(updatedBusiness);
              navigateToStage('local_check');
            }}
            onBack={() => navigateToStage('idea')}
          />
        )}

        {/* FARMER STAGE 02: FARM FINANCIAL ASSESSMENT */}
        {journeyStage === 'farmer_assessment' && (
          <FarmerFinancialAssessment
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            onNext={() => navigateToStage('farmer_loan_status')}
            onBack={() => navigateToStage('local_check')}
            onEditInputs={() => navigateToStage('farmer_details')}
          />
        )}

        {/* FARMER STAGE 03: LOAN STATUS */}
        {journeyStage === 'farmer_loan_status' && (
          <FarmerLoanStatus
            businessSetup={businessSetup}
            onSaveLoanStatus={(updatedSetup) => {
              setBusinessSetup(updatedSetup);
            }}
            onNext={() => navigateToStage('farmer_assistance')}
            onBack={() => navigateToStage('farmer_assessment')}
          />
        )}

        {/* FARMER STAGE 04: FINANCIAL ASSISTANCE */}
        {journeyStage === 'farmer_assistance' && (
          <FarmerAssistance
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            onNext={() => navigateToStage('farmer_schemes')}
            onBack={() => navigateToStage('farmer_loan_status')}
          />
        )}

        {/* FARMER STAGE 05: SCHEMES & SUPPORT */}
        {journeyStage === 'farmer_schemes' && (
          <FarmerSchemes
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            language={language}
            onNext={() => navigateToStage('farmer_plan')}
            onBack={() => navigateToStage('farmer_assistance')}
          />
        )}

        {/* FARMER STAGE 06: ACTION PLAN */}
        {journeyStage === 'farmer_plan' && (
          <FarmerActionPlan
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            language={language}
            onBack={() => navigateToStage('farmer_schemes')}
            onModifyDetails={() => navigateToStage('farmer_details')}
            onOpenAdvisor={() => handleOpenChat('Can you help me prepare my bank documents for this season?')}
          />
        )}

        {/* STAGE 03: LOCAL CHECK */}
        {journeyStage === 'local_check' && (
          <Stage02LocalCheck
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            hyperLocal={hyperLocal}
            twoGate={twoGate}
            language={language}
            onNext={() => {
              if (businessSetup.entityType === 'farmer') {
                navigateToStage('farmer_assessment');
              } else {
                navigateToStage('feasibility');
              }
            }}
            onBack={() => {
              if (businessSetup.entityType === 'farmer') {
                navigateToStage('farmer_details');
              } else {
                navigateToStage('idea');
              }
            }}
          />
        )}

        {/* STAGE 04: FEASIBILITY */}
        {journeyStage === 'feasibility' && (
          <Stage04Feasibility
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            feasibility={feasibility}
            twoGate={twoGate}
            sensitivity={sensitivity}
            language={language}
            onNext={() => navigateToStage('financing')}
            onBack={() => navigateToStage('local_check')}
          />
        )}

        {/* DEDICATED FINANCIAL ENGINE SCREEN */}
        {journeyStage === 'financial_engine' && (
          <FinancialEngineScreen
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            phase2Cost={phase2Cost}
            feasibility={feasibility}
            language={language}
            onUpdateFinancials={handleUpdateFinancials}
            onBack={() => navigateToStage('feasibility')}
            onGoToPlan={() => navigateToStage('plan')}
          />
        )}

        {/* STAGE 05: FINANCING */}
        {journeyStage === 'financing' && (
          <Stage04Financing
            feasibility={feasibility}
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            language={language}
            onSelectScheme={(scheme) => setSelectedScheme(scheme)}
            onNext={() => navigateToStage('plan')}
            onBack={() => navigateToStage('feasibility')}
          />
        )}

        {/* STAGE 06: YOUR PLAN */}
        {journeyStage === 'plan' && (
          <Stage05YourPlan
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            feasibility={feasibility}
            language={language}
            onNext={() => navigateToStage('track')}
            onBack={() => navigateToStage('financing')}
          />
        )}

        {/* STAGE 07: TRACK & IMPROVE */}
        {journeyStage === 'track' && (
          <Stage06TrackAndImprove
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            feasibility={feasibility}
            language={language}
            onBack={() => navigateToStage('plan')}
            onGoHome={handleLogoOrHomeClick}
            onOpenChat={handleOpenChat}
          />
        )}

        {/* DEDICATED DAILY AI ADVISOR SCREEN */}
        {journeyStage === 'daily_advisor' && (
          <DailyAIAdvisorScreen
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            feasibility={feasibility}
            hyperLocal={hyperLocal}
            twoGate={twoGate}
            language={language}
            onBack={() => navigateToStage('track')}
            onOpenChat={(prompt?: string) => handleOpenChat(prompt)}
          />
        )}

        {/* PROFILE & USER SETTINGS SCREEN */}
        {journeyStage === 'profile' && (
          <ProfilePage
            basicInfo={basicInfo}
            businessSetup={businessSetup}
            phase2Cost={phase2Cost}
            feasibility={feasibility}
            language={language}
            theme={theme}
            isAuthenticated={isAuthenticated}
            journeyMode={journeyMode}
            onUpdateBasicInfo={(updated) => {
              setBasicInfo(updated);
              try {
                localStorage.setItem(STORAGE_KEYS.BASIC_INFO, JSON.stringify(updated));
              } catch {}
            }}
            onLanguageChange={(lang) => {
              setLanguage(lang);
              const langMap: Record<Language, 'English' | 'Hindi' | 'Marathi'> = {
                en: 'English',
                hi: 'Hindi',
                mr: 'Marathi',
              };
              setBasicInfo((prev) => ({
                ...prev,
                reportLanguage: langMap[lang] || 'English',
              }));
            }}
            onToggleTheme={toggleTheme}
            onNavigateToStage={(st) => navigateToStage(st)}
            onLogout={handleLogout}
            onBack={() => {
              if (businessSetup.entityType === 'farmer') {
                navigateToStage('farmer_details');
              } else {
                navigateToStage('details');
              }
            }}
          />
        )}
      </main>

      {/* Floating Draggable ARTH Chatbot Avatar (Approachable Indian Microentrepreneur Advisor) */}
      <DraggableArthChatbot
        onOpenChat={() => handleOpenChat()}
        language={language}
      />

      {/* Ask ARTH AI Chatbot Drawer Modal */}
      <AskArthChatModal
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        basicInfo={basicInfo}
        businessSetup={businessSetup}
        feasibility={feasibility}
        hyperLocal={hyperLocal}
        twoGate={twoGate}
        language={language}
        onLanguageChange={setLanguage}
        initialPrompt={chatInitialPrompt}
        onClearInitialPrompt={() => setChatInitialPrompt(undefined)}
      />

      {/* 3. Global Footer */}
      <Footer
        language={language}
        theme={theme}
        onReplayIntro={() => {
          setShowBrandIntro(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateSection={(sectionId) => {
          if (journeyStage !== 'landing') {
            setLeaveModalOpen(true);
          } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 4. Safety Leave Confirmation Modal */}
      <LeavePlanModal
        isOpen={leaveModalOpen}
        onContinueEditing={() => setLeaveModalOpen(false)}
        onConfirmLeave={handleConfirmLeave}
        language={language}
      />

      {/* 5. Help & Audio Guide Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
        topic={helpTopic}
      />
    </div>
  );
}
