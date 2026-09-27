import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Sparkles,
  Check,
  Store,
  Info,
} from 'lucide-react';
import {
  BasicInfoData,
  BusinessSetupData,
  BusinessStatusType,
  UserGoalType,
  ExistingBusinessDetails,
  ExistingLoanDetails,
  FinancialHelpType,
  Gender,
  Language,
  SocialCategory,
  AreaType,
} from '../../types';
import { STATES_AND_DISTRICTS, OCCUPATION_OPTIONS } from '../../data/mockLocalData';
import { UI_TRANSLATIONS } from '../../data/translations';
import { BusinessStatusSelection } from './BusinessStatusSelection';
import { ExistingBusinessOnboarding } from './ExistingBusinessOnboarding';

interface Stage01DetailsProps {
  initialBasicInfo: BasicInfoData;
  initialBusinessSetup?: BusinessSetupData;
  language: Language;
  onSaveAndNext: (updatedBasic: BasicInfoData, updatedSetup?: BusinessSetupData) => void;
  onBack: () => void;
  onOpenChat?: () => void;
  theme?: 'light' | 'dark';
}

export const Stage01Details: React.FC<Stage01DetailsProps> = ({
  initialBasicInfo,
  initialBusinessSetup,
  language,
  onSaveAndNext,
  onBack,
  onOpenChat,
  theme = 'light',
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Business Status & Goals State
  const [businessStatus, setBusinessStatus] = useState<BusinessStatusType>(
    initialBasicInfo?.businessStatusType || initialBusinessSetup?.businessStatus || 'new_business'
  );

  const [userGoals, setUserGoals] = useState<UserGoalType[]>(
    initialBasicInfo?.userGoals || initialBusinessSetup?.userGoals || ['start_new', 'check_feasibility']
  );

  const [existingBusiness, setExistingBusiness] = useState<ExistingBusinessDetails>(
    initialBusinessSetup?.existingBusiness || {
      businessName: 'Patil Agro & Daily Store',
      businessCategory: 'Grocery / General Store',
      businessActivity: 'General retail and animal feed sales',
      businessAgeYears: 3,
      businessAgeMonths: 6,
      ownershipType: 'Sole Proprietorship',
      currentMonthlySales: 65000,
      currentMonthlyExpenses: 42000,
      currentMonthlyProfit: 23000,
      numberOfWorkers: 1,
      keyAssets: ['Display Racks', 'Refrigeration unit', 'Digital balance'],
      currentChallenges: ['Working capital shortage', 'Customer credit delay'],
      growthGoal: 'Expand stock inventory and add dairy packaging',
    }
  );

  const [existingLoan, setExistingLoan] = useState<ExistingLoanDetails>(
    initialBusinessSetup?.existingLoan || {
      hasLoan: businessStatus === 'existing_with_loan' ? 'Yes' : 'No',
      providerName: 'Bank of Maharashtra',
      loanType: 'Mudra Shishu / Kishore',
      originalAmount: 80000,
      outstandingAmount: 45000,
      monthlyEMI: 2450,
      interestRate: 10.5,
      interestRateUnknown: false,
      emisPaid: 18,
      emisRemaining: 18,
      repaymentStatus: 'normal',
      overdueAmount: 0,
      loanPurpose: 'Inventory purchase and store renovation',
    }
  );

  const [financialHelpType, setFinancialHelpType] = useState<FinancialHelpType>(
    initialBusinessSetup?.financialHelpType ||
      (businessStatus === 'existing_with_loan' ? 'manage_existing_loan' : 'explore_schemes_subsidies')
  );

  // Profile Form Data
  const [profile, setProfile] = useState<BasicInfoData>({
    ...initialBasicInfo,
    name: initialBasicInfo?.name || 'Savita Patil',
    dob: initialBasicInfo?.dob || '1992-05-14',
    gender: initialBasicInfo?.gender || 'Female',
    category: initialBasicInfo?.category || 'OBC',
    mobile: initialBasicInfo?.mobile || '9899983663',
    state: initialBasicInfo?.state || 'Maharashtra',
    district: initialBasicInfo?.district || 'Ahmednagar',
    village: initialBasicInfo?.village || 'Loni Budruk',
    pincode: initialBasicInfo?.pincode || '413736',
    areaType: initialBasicInfo?.areaType || 'Rural',
    currentOccupation: initialBasicInfo?.currentOccupation || 'Farming & Dairy Cooperative Member',
    workedInBusinessBefore: initialBasicInfo?.workedInBusinessBefore || 'Yes',
    experienceYears: initialBasicInfo?.experienceYears ?? 4,
    reportLanguage: initialBasicInfo?.reportLanguage || 'English',
    specialAssistance: initialBasicInfo?.specialAssistance || 'No',
  });

  // Steps in Onboarding: 'status' (Step 1) -> 'profile' (Step 2) -> with optional 'existing'
  const [activeStep, setActiveStep] = useState<'status' | 'existing' | 'profile'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/onboarding/profile')) {
      return 'profile';
    }
    return 'status';
  });
  const [profileSubStep, setProfileSubStep] = useState<1 | 2 | 3>(1);

  // Synchronize route URL with onboarding steps
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeStep === 'profile') {
        if (window.location.pathname !== '/onboarding/profile') {
          window.history.pushState(null, '', '/onboarding/profile');
        }
      } else {
        if (window.location.pathname !== '/onboarding') {
          window.history.pushState(null, '', '/onboarding');
        }
      }
    }
  }, [activeStep]);

  useEffect(() => {
    const handlePop = () => {
      if (typeof window !== 'undefined') {
        if (window.location.pathname.includes('/onboarding/profile')) {
          setActiveStep('profile');
        } else if (window.location.pathname.includes('/onboarding')) {
          setActiveStep('status');
        }
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const availableDistricts = STATES_AND_DISTRICTS[profile.state] || [
    'Ahmednagar',
    'Pune',
    'Nashik',
    'Satara',
    'Solapur',
  ];

  const updateProfileField = <K extends keyof BasicInfoData>(field: K, value: BasicInfoData[K]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusContinue = () => {
    if (businessStatus === 'new_business') {
      setActiveStep('profile');
    } else {
      setActiveStep('existing');
    }
  };

  const handleExistingBusinessFinished = (
    bus: ExistingBusinessDetails,
    ln: ExistingLoanDetails,
    hlp: FinancialHelpType
  ) => {
    setExistingBusiness(bus);
    setExistingLoan(ln);
    setFinancialHelpType(hlp);
    setActiveStep('profile');
  };

  const handleFinalSaveAndContinue = () => {
    const updatedBasic: BasicInfoData = {
      ...profile,
      businessStatusType: businessStatus,
      userGoals: userGoals,
      existingLoanDetails: existingLoan,
      existingBusinessDetails: existingBusiness,
      financialHelpType: financialHelpType,
    };

    const updatedSetup: BusinessSetupData = {
      ...(initialBusinessSetup || ({} as any)),
      businessStatus: businessStatus,
      userGoals: userGoals,
      existingBusiness: existingBusiness,
      existingLoan: existingLoan,
      financialHelpType: financialHelpType,
    };

    onSaveAndNext(updatedBasic, updatedSetup);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden bg-gradient-to-b from-[#DDF0FD] via-[#ECF7EE]/70 to-[#F4FAF6] dark:from-[#071324] dark:via-[#09192C] dark:to-[#050E1A] text-slate-900 dark:text-slate-100 py-8 sm:py-12 transition-colors duration-300">
      {/* Ambient background rural landscape & floating particles */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Soft radial aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-300/15 dark:bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-3xl" />

        {/* Floating gentle particles */}
        <div className="absolute top-16 left-[12%] w-3 h-3 rounded-full bg-emerald-400/40 animate-[arth-float-ambient_8s_ease-in-out_infinite]" />
        <div className="absolute top-44 left-[22%] w-2 h-2 rounded-full bg-amber-400/50 animate-[arth-float-slow_6s_ease-in-out_infinite_1s]" />
        <div className="absolute top-32 right-[18%] w-3.5 h-3.5 rounded-full bg-emerald-500/30 animate-[arth-float-ambient_10s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-32 right-[12%] w-2.5 h-2.5 rounded-full bg-teal-400/40 animate-[arth-float-slow_7s_ease-in-out_infinite_1.5s]" />

        {/* Decorative Floating Leaves SVG */}
        <svg
          className="absolute top-28 left-[6%] w-6 h-6 text-emerald-600/30 dark:text-emerald-400/20 animate-[arth-float-ambient_12s_ease-in-out_infinite]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
        <svg
          className="absolute bottom-40 left-[14%] w-5 h-5 text-amber-600/25 dark:text-amber-400/15 animate-[arth-float-slow_9s_ease-in-out_infinite_2s]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>

      {/* Slogan on Left Side (Large screens matching reference) */}
      <div className="hidden xl:block absolute left-4 2xl:left-12 top-48 -rotate-6 select-none pointer-events-none opacity-80 dark:opacity-60 transition-opacity z-0">
        <p className="text-2xl 2xl:text-3xl font-serif italic font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-tight">
          Ideas Today<br />
          <span className="text-slate-900 dark:text-white font-extrabold not-italic font-sans">
            Stronger Tomorrow
          </span>
        </p>
        <svg className="w-40 2xl:w-48 h-3.5 text-amber-500 mt-1" viewBox="0 0 160 16" fill="none">
          <path d="M4 12 C 40 4, 110 4, 156 12 C 120 7, 50 7, 4 12 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Slogan & Standing Mascot on Right Side (Large screens matching reference) */}
      <div className="hidden xl:block absolute right-4 2xl:right-10 top-24 select-none z-0 text-right">
        <div className="rotate-6 opacity-80 dark:opacity-60 mb-6">
          <p className="text-2xl 2xl:text-3xl font-serif italic font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-tight">
            Small Steps<br />
            <span className="text-slate-900 dark:text-white font-extrabold not-italic font-sans">
              Bigger Futures
            </span>
          </p>
          <svg className="w-40 2xl:w-48 h-3.5 text-amber-500 mt-1 ml-auto" viewBox="0 0 160 16" fill="none">
            <path d="M4 12 C 40 4, 110 4, 156 12 C 120 7, 50 7, 4 12 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Standing ARTH Character Mascot with Speech Bubble */}
        <div
          onClick={onOpenChat}
          className="relative inline-flex flex-col items-center cursor-pointer group pointer-events-auto transition-transform hover:scale-105 duration-300"
          title="Ask ARTH anything"
        >
          {/* Speech Bubble */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl p-3 max-w-[170px] text-left mb-2 transition-all group-hover:border-amber-400">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white leading-tight">
              <span>Need help?</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            </div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
              I'm <span className="font-extrabold text-slate-900 dark:text-white">ARTH</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
              Ask me anytime!
            </p>
          </div>

          {/* Character Avatar / Standing Cutout */}
          <div className="w-32 h-44 rounded-2xl overflow-hidden border-2 border-white/80 dark:border-slate-800 shadow-xl bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative">
            <img
              src="/assets/images/arth_mascot_character.jpg"
              alt="ARTH Mascot"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                // Fallback to circular avatar if needed
                (e.currentTarget as HTMLImageElement).src = '/assets/images/arth_chatbot_avatar_1789895973497.jpg';
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Centered Master Card Container */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 relative z-10">
        <div className="bg-white dark:bg-[#0c182a] rounded-[28px] sm:rounded-[36px] border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 p-6 sm:p-10 space-y-7 transition-colors">
          {/* Top Status & Auth Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              {activeStep === 'status' ? 'Step 1 of 2' : 'Step 2 of 2'}
            </span>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-[11px] sm:text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Authenticated: +91 {profile.mobile}</span>
            </div>
          </div>

          {/* Main Title & Description */}
          <div className="space-y-2 text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Tell ARTH about your{' '}
              <span className="text-[#F5A623] dark:text-[#FBBF24]">business journey.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              ARTH AI personalizes market signals, scheme matching, and feasibility to your location, background, and whether you are starting fresh or expanding an existing business.
            </p>
          </div>

          {/* Step Indicator Capsule Bar (Exact match to reference image) */}
          <div className="w-full max-w-2xl bg-slate-100/90 dark:bg-slate-800/80 p-1.5 rounded-full flex items-center justify-between transition-colors">
            {/* Step 1: Business Status */}
            <button
              type="button"
              onClick={() => setActiveStep('status')}
              className={`flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer ${
                activeStep === 'status'
                  ? 'bg-white dark:bg-slate-900 border border-amber-300/90 dark:border-amber-500/70 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {activeStep === 'status' ? (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
                </div>
              ) : (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                1. Business Status
              </span>
            </button>

            {/* Connecting Golden Line with Central Node */}
            <div className="flex-1 h-0.5 bg-amber-400 dark:bg-amber-500 mx-2 sm:mx-4 relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-amber-400 dark:border-amber-500 bg-white dark:bg-slate-900 shadow-xs" />
            </div>

            {/* Step 2: Location & Profile */}
            <button
              type="button"
              onClick={() => setActiveStep('profile')}
              className={`flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer ${
                activeStep === 'profile'
                  ? 'bg-white dark:bg-slate-900 border border-amber-300/90 dark:border-amber-500/70 shadow-xs text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 ${
                  activeStep === 'profile'
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-xs'
                    : 'bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                2. Location &amp; Profile
              </span>
            </button>
          </div>

          {/* ================= STEP 1: BUSINESS STATUS SELECTION ================= */}
          {activeStep === 'status' && (
            <BusinessStatusSelection
              selectedStatus={businessStatus}
              selectedGoals={userGoals}
              language={language}
              onSelectStatus={(status) => setBusinessStatus(status)}
              onToggleGoal={(goal) => {
                setUserGoals((prev) =>
                  prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
                );
              }}
              onContinue={handleStatusContinue}
              onBack={onBack}
            />
          )}

          {/* ================= OPTIONAL STEP: EXISTING BUSINESS SETUP ================= */}
          {activeStep === 'existing' && (
            <div className="space-y-6">
              <ExistingBusinessOnboarding
                initialBusiness={existingBusiness}
                initialLoan={existingLoan}
                initialHelpType={financialHelpType}
                defaultHasLoan={businessStatus === 'existing_with_loan'}
                language={language}
                onSaveAndContinue={handleExistingBusinessFinished}
                onBack={() => setActiveStep('status')}
                onSkip={() => setActiveStep('profile')}
              />
            </div>
          )}

          {/* ================= STEP 2: LOCATION & PROFILE ================= */}
          {activeStep === 'profile' && (
            <div className="space-y-6">
              {/* Profile Sub-step Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setProfileSubStep(1)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    profileSubStep === 1
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  1. About You
                </button>
                <button
                  type="button"
                  onClick={() => setProfileSubStep(2)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    profileSubStep === 2
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  2. Your Location
                </button>
                <button
                  type="button"
                  onClick={() => setProfileSubStep(3)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    profileSubStep === 3
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  3. Experience &amp; Goals
                </button>
              </div>

              {/* Sub-Step 1: Personal Information */}
              {profileSubStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-left">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => updateProfileField('name', e.target.value)}
                      placeholder="e.g. Savita Patil"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Date of Birth / Age
                    </label>
                    <input
                      type="date"
                      value={profile.dob}
                      onChange={(e) => updateProfileField('dob', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Gender
                    </label>
                    <select
                      value={profile.gender}
                      onChange={(e) => updateProfileField('gender', e.target.value as Gender)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Female">Female (Eligible for Women Entrepreneur Concessions)</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Social Category
                    </label>
                    <select
                      value={profile.category}
                      onChange={(e) => updateProfileField('category', e.target.value as SocialCategory)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC (Other Backward Class)</option>
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="ST">ST (Scheduled Tribe)</option>
                      <option value="Other / EWS">EWS / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Preferred Report Language
                    </label>
                    <select
                      value={profile.reportLanguage}
                      onChange={(e) => updateProfileField('reportLanguage', e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">हिंदी (Hindi)</option>
                      <option value="Marathi">मराठी (Marathi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Verified Mobile
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs font-mono font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>+91 {profile.mobile}</span>
                      <span className="ml-auto text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Step 2: Location Information */}
              {profileSubStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-left">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      State
                    </label>
                    <select
                      value={profile.state}
                      onChange={(e) => updateProfileField('state', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      {Object.keys(STATES_AND_DISTRICTS).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      District
                    </label>
                    <select
                      value={profile.district}
                      onChange={(e) => updateProfileField('district', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Village / Town / City
                    </label>
                    <input
                      type="text"
                      value={profile.village}
                      onChange={(e) => updateProfileField('village', e.target.value)}
                      placeholder="e.g. Loni Budruk / Sangamner"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Pincode (6 digits)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={profile.pincode}
                      onChange={(e) => updateProfileField('pincode', e.target.value.replace(/\D/g, ''))}
                      placeholder="413736"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Area Type
                    </label>
                    <select
                      value={profile.areaType}
                      onChange={(e) => updateProfileField('areaType', e.target.value as AreaType)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Rural">Rural (Gram Panchayat)</option>
                      <option value="Semi-Urban">Semi-Urban (Town / Nagar Panchayat)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Sub-Step 3: Experience & Background */}
              {profileSubStep === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-left">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Current Occupation
                    </label>
                    <select
                      value={profile.currentOccupation}
                      onChange={(e) => updateProfileField('currentOccupation', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      {OCCUPATION_OPTIONS.map((occ) => (
                        <option key={occ} value={occ}>{occ}</option>
                      ))}
                      <option value="Farming & Dairy Cooperative Member">Farming &amp; Dairy Cooperative Member</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Prior Business Experience
                    </label>
                    <select
                      value={profile.workedInBusinessBefore}
                      onChange={(e) => updateProfileField('workedInBusinessBefore', e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Yes">Yes, I have operated or worked in a small business</option>
                      <option value="No">No, I am a first-time aspiring entrepreneur</option>
                    </select>
                  </div>

                  {profile.workedInBusinessBefore === 'Yes' && (
                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Years of Practical Experience
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={40}
                        value={profile.experienceYears}
                        onChange={(e) => updateProfileField('experienceYears', Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Special Scheme Eligibility Assistance
                    </label>
                    <select
                      value={profile.specialAssistance}
                      onChange={(e) => updateProfileField('specialAssistance', e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="No">Standard Microenterprise Schemes</option>
                      <option value="Yes">Include Divyangjan / Minority Special Subsidies</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Bottom Buttons for Profile Step */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setActiveStep('status')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Business Status</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSaveAndContinue}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#F59E0B] hover:from-[#E5981B] hover:to-[#D97706] text-slate-950 font-black text-sm sm:text-base shadow-md shadow-amber-500/20 hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <span>Save &amp; Continue to Your Idea</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
