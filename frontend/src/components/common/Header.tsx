import React, { useState } from 'react';
import { Language, JourneyMode } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import {
  Volume2,
  Home,
  Menu,
  X,
  Sparkles,
  Calculator,
  CalendarDays,
  RotateCcw,
  Bot,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  Sun,
  Moon,
  Globe,
  Sprout,
  User,
} from 'lucide-react';
import { ArthLogo } from './ArthLogo';
import { PremiumButton } from './PremiumButton';

export type FarmerJourneyStageId =
  | 'farmer_details'
  | 'farmer_assessment'
  | 'farmer_loan_status'
  | 'farmer_assistance'
  | 'farmer_schemes'
  | 'farmer_plan';

export type JourneyStageId =
  | 'details'
  | 'idea'
  | 'local_check'
  | 'feasibility'
  | 'financial_engine'
  | 'financing'
  | 'plan'
  | 'track'
  | 'daily_advisor'
  | 'profile'
  | FarmerJourneyStageId;

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenHelp: () => void;
  onGoHome: () => void;
  currentStage?: 'landing' | JourneyStageId | 'login';
  onJumpStage?: (stage: JourneyStageId) => void;
  onStartPlan?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  onOpenChat?: () => void;
  onResetProgress?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  journeyMode?: JourneyMode;
  userName?: string;
  onOpenProfile?: () => void;
  onOpenKisanSathi?: () => void;
}

export const Header: React.FC<Props> = ({
  language,
  onLanguageChange,
  onOpenHelp,
  onGoHome,
  currentStage = 'landing',
  onJumpStage,
  onStartPlan,
  onNavigateSection,
  onOpenChat,
  onResetProgress,
  theme = 'light',
  onToggleTheme,
  journeyMode = 'business',
  userName,
  onOpenProfile,
  onOpenKisanSathi,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLanding = currentStage === 'landing';

  const businessStages: { id: JourneyStageId; stepNum: string; label: string }[] = [
    { id: 'details', stepNum: '01', label: t.stageDetails || 'Details' },
    { id: 'idea', stepNum: '02', label: t.stageIdea || 'Idea' },
    { id: 'local_check', stepNum: '03', label: t.stageLocalCheck || 'Local Check' },
    { id: 'feasibility', stepNum: '04', label: t.stageFeasibility || 'Feasibility' },
    { id: 'financing', stepNum: '05', label: t.stageFinancing || 'Financing' },
    { id: 'plan', stepNum: '06', label: t.stagePlan || 'Your Plan' },
    { id: 'track', stepNum: '07', label: t.stageTrack || 'Track' },
  ];

  const farmerStages: { id: JourneyStageId; stepNum: string; label: string }[] = [
    { id: 'farmer_details', stepNum: '01', label: 'Farm Details' },
    { id: 'farmer_assessment', stepNum: '02', label: 'Farm Assessment' },
    { id: 'farmer_loan_status', stepNum: '03', label: 'Loan Status' },
    { id: 'farmer_assistance', stepNum: '04', label: 'Financial Assistance' },
    { id: 'farmer_schemes', stepNum: '05', label: 'Schemes & Support' },
    { id: 'farmer_plan', stepNum: '06', label: 'Action Plan' },
  ];

  const isFarmerMode =
    journeyMode === 'farmer' ||
    currentStage === 'farmer_details' ||
    currentStage === 'farmer_assessment' ||
    currentStage === 'farmer_loan_status' ||
    currentStage === 'farmer_assistance' ||
    currentStage === 'farmer_schemes' ||
    currentStage === 'farmer_plan';

  const stages = isFarmerMode ? farmerStages : businessStages;

  const currentStageIndex = isLanding
    ? -1
    : stages.findIndex((s) => s.id === currentStage);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (!isLanding) {
      onGoHome();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-white/95 dark:bg-[#071324]/95 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 shadow-xs sticky top-0 z-40 backdrop-blur-md transition-colors">
      {/* Top golden accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-teal-400 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            id="brand-header"
            onClick={onGoHome}
            className="flex items-center cursor-pointer select-none group shrink-0"
            role="button"
            tabIndex={0}
            title="Return to Home"
          >
            <ArthLogo
              size="md"
              variant={theme === 'dark' ? 'dark' : 'light'}
              subtitleText={t.portalSub || 'Assistant for Microentrepreneurs'}
            />
          </div>

          {/* 1. Navigation Links (Landing and Onboarding Details) */}
          {(isLanding || currentStage === 'details') && (
            <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <button
                type="button"
                onClick={onGoHome}
                className="px-3.5 py-1.5 rounded-full bg-teal-700 text-white font-bold transition-colors cursor-pointer shadow-2xs"
              >
                {t.homeNav || 'Home'}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="px-2.5 py-1.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                {t.navHowItWorks || 'How It Works'}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('for-micro-businesses')}
                className="px-2.5 py-1.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                {t.navBusinessIdeas || 'Business Ideas'}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('for-farmers')}
                className="px-2.5 py-1.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                {t.navMarketInsights || 'Market Insights'}
              </button>
              {onOpenKisanSathi && (
                <button
                  type="button"
                  onClick={onOpenKisanSathi}
                  className="px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Kisan Sathi – Crop Growth Assistant"
                >
                  <span>🌾 Kisan Sathi</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => scrollToSection('two-gate-model')}
                className="px-2.5 py-1.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                {t.navSuccessStories || 'Success Stories'}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('two-gate-model')}
                className="px-2.5 py-1.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                {t.navAbout || 'About'}
              </button>
            </nav>
          )}

          {/* 2. In-Journey Active Stage Badge in Main Bar (Compact & responsive) */}
          {!isLanding && currentStage !== 'details' && (
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#122336] text-slate-800 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700/80 font-medium shadow-2xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {stages[currentStageIndex]?.stepNum || '01'}
                </span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 max-w-[180px] truncate">
                  {stages[currentStageIndex]?.label || 'Stage'}
                </span>
              </span>
            </div>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#122336] border border-slate-300/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-2.5 py-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  aria-label="Select Interface Language"
                  className="bg-transparent text-slate-800 dark:text-slate-200 text-xs pr-4 appearance-none focus:outline-hidden cursor-pointer font-medium"
                >
                  <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">English</option>
                  <option value="hi" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">हिन्दी</option>
                  <option value="mr" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">मराठी</option>
                </select>
                <div className="pointer-events-none absolute right-2 text-slate-500 dark:text-slate-400">
                  <span className="text-[10px]">▼</span>
                </div>
              </div>
            </div>

            {/* Light / Dark Mode Toggle */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label="Toggle Theme"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-1.5 rounded-xl border border-slate-300/80 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-100 dark:bg-[#122336] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-amber-400 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>
            )}

            {/* Ask ARTH AI CTA Button (Warm Yellow/Gold as in reference) */}
            {onOpenChat && (
              <button
                type="button"
                onClick={onOpenChat}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F5A623] hover:bg-[#E5981B] text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
                title="Ask ARTH AI Assistant"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask ARTH</span>
              </button>
            )}

            {/* Help / Audio Guide */}
            <button
              type="button"
              onClick={onOpenHelp}
              className="p-1.5 rounded-xl border border-slate-300/80 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-100 dark:bg-[#122336] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer hidden sm:flex"
              title={t.helpBtn || 'Help & Audio Guide'}
            >
              <Volume2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </button>

            {/* Home button (if inside app) */}
            {!isLanding && (
              <button
                type="button"
                onClick={onGoHome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300/80 dark:border-slate-700 transition-colors cursor-pointer"
                title={t.homeNav || 'Return to Home'}
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.homeNav || 'Home'}</span>
              </button>
            )}

            {/* Reset / Start Fresh button (if in active journey) */}
            {!isLanding && onResetProgress && (
              <button
                type="button"
                onClick={onResetProgress}
                className="p-1.5 rounded-xl border border-slate-300/80 dark:border-slate-700 hover:border-rose-500/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title={t.resetProgress || 'Reset Plan / Start Fresh'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Profile Avatar & Navigation Button */}
            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  currentStage === 'profile'
                    ? 'bg-teal-600 text-white border-teal-500 ring-2 ring-teal-400/50'
                    : 'bg-slate-100 dark:bg-[#122336] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300/80 dark:border-slate-700/80'
                }`}
                title="My Profile & Settings"
              >
                <div className="w-5 h-5 rounded-full bg-teal-700 text-white font-black text-[10px] flex items-center justify-center select-none shrink-0 ring-1 ring-white/40">
                  {userName ? userName.trim().slice(0, 1).toUpperCase() : 'P'}
                </div>
                <span className="hidden md:inline max-w-[85px] truncate">
                  {userName ? userName.split(' ')[0] : 'Profile'}
                </span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-lg cursor-pointer ml-0.5"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-3 border-t border-slate-200 dark:border-slate-800 mt-2 space-y-2 text-xs">
            {/* Mobile Profile Link */}
            {onOpenProfile && (
              <button
                type="button"
                onClick={() => {
                  onOpenProfile();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                  currentStage === 'profile'
                    ? 'bg-teal-600 text-white border-teal-500'
                    : 'bg-slate-100 dark:bg-[#122336] text-slate-800 dark:text-slate-200 border-slate-300/80 dark:border-slate-700'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {userName ? userName.trim().slice(0, 1).toUpperCase() : 'P'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-900 dark:text-white">{userName || 'Savita Patil'}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">View Profile &amp; Settings</span>
                </div>
              </button>
            )}
            {isLanding ? (
              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onGoHome();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg text-amber-300 font-bold hover:bg-slate-800"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-left py-2 px-3 rounded-lg text-slate-300 hover:text-amber-300 font-semibold hover:bg-slate-800"
                >
                  {t.navHowItWorks || 'How It Works'}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('for-micro-businesses')}
                  className="text-left py-2 px-3 rounded-lg text-slate-300 hover:text-amber-300 font-semibold hover:bg-slate-800"
                >
                  {t.navBusinessIdeas || 'Business Ideas'}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('for-farmers')}
                  className="text-left py-2 px-3 rounded-lg text-slate-300 hover:text-amber-300 font-semibold hover:bg-slate-800"
                >
                  {t.navMarketInsights || 'Market Insights'}
                </button>
                {onOpenKisanSathi && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenKisanSathi();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-2 px-3 rounded-lg text-emerald-400 font-bold hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <span>🌾 Kisan Sathi (Crop Growth Assistant)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => scrollToSection('living-story')}
                  className="text-left py-2 px-3 rounded-lg text-slate-300 hover:text-amber-300 font-semibold hover:bg-slate-800"
                >
                  {t.navSuccessStories || 'Success Stories'}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('two-gate-model')}
                  className="text-left py-2 px-3 rounded-lg text-slate-300 hover:text-amber-300 font-semibold hover:bg-slate-800"
                >
                  {t.navAbout || 'About'}
                </button>

                {onOpenChat && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChat();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-2 px-3 rounded-lg text-amber-300 font-semibold hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bot className="w-4 h-4" />
                    <span>{t.askArthAiAdvisorTitle || 'Ask ARTH AI Assistant'}</span>
                  </button>
                )}

                {onStartPlan && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onStartPlan();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs text-center flex items-center justify-center gap-1.5"
                    >
                      <span>{t.startBtn || 'Start Your Plan'} →</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                  Journey Stages & Analytical Tools:
                </span>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {stages.map((st, idx) => {
                    const isCurrent = currentStage === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          if (onJumpStage) {
                            onJumpStage(st.id);
                            setMobileMenuOpen(false);
                          }
                        }}
                        className={`text-left p-2 rounded-lg text-xs font-medium cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span className="tabular-nums font-semibold mr-1">{st.stepNum}</span>
                        {st.label}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onJumpStage) onJumpStage('financial_engine');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-teal-950/60 border border-teal-800 text-teal-300 font-bold"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Financial Engine Calculator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onJumpStage) onJumpStage('daily_advisor');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 font-bold"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>Daily AI Advisor</span>
                  </button>

                  {onOpenChat && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenChat();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-800 text-white font-bold"
                    >
                      <Bot className="w-4 h-4 text-amber-400" />
                      <span>Ask ARTH AI Assistant</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* In-Journey Stage Stepper Sub-Bar (Smooth, overflow-x-auto, no-scrollbar, zero page horizontal scroll) */}
      {!isLanding && currentStage !== 'details' && (
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/95 dark:bg-[#091524]/95 px-4 py-2 overflow-x-auto no-scrollbar shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-max">
            {/* Steps Stepper */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
              {stages.map((st, idx) => {
                const isPast = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;
                const isClickable = onJumpStage !== undefined;

                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => isClickable && onJumpStage(st.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-xs ring-1 ring-amber-300'
                        : isPast
                        ? 'text-emerald-700 dark:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span className="tabular-nums font-mono text-[11px]">{isPast ? '✓' : st.stepNum}</span>
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dedicated Tools shortcuts */}
            <div className="flex items-center gap-1.5 text-xs pl-3 border-l border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => onJumpStage && onJumpStage('financial_engine')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                  currentStage === 'financial_engine'
                    ? 'bg-teal-600 text-white'
                    : 'text-teal-700 dark:text-teal-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
                }`}
                title={t.financialEngineNav || 'Open Financial Engine'}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{t.engineNav || 'Engine'}</span>
              </button>

              <button
                type="button"
                onClick={() => onJumpStage && onJumpStage('daily_advisor')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                  currentStage === 'daily_advisor'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-amber-700 dark:text-amber-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
                }`}
                title={t.advisorNav || 'Daily AI Advisor'}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{t.advisorNav || 'Advisor'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
