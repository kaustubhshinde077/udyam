import React from 'react';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingUp,
  Landmark,
  Coins,
  Building2,
  Play,
  User,
  BarChart3,
  FileText,
  Check,
  X,
  PieChart,
  Users,
  Sprout,
  ShoppingBag,
  Scissors,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { DemoPresetKey } from '../../data/demoPresets';
import { CropMarketPricePredictor } from './CropMarketPricePredictor';

interface Props {
  language: Language;
  onStart: () => void;
  onLoadPreset?: (key: DemoPresetKey) => void;
  onWatchIntro?: () => void;
  onOpenKisanSathi?: () => void;
  theme?: 'light' | 'dark';
}

export const LandingScreen: React.FC<Props> = ({
  language,
  onStart,
  onLoadPreset,
  onWatchIntro,
  onOpenKisanSathi,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="arth-landing-page relative w-full overflow-hidden bg-[#FAFBFD] dark:bg-[#07111E] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Background animation: visual only; does not change existing content or functionality. */}
      <div className="arth-bg-animation" aria-hidden="true">
        <div className="arth-bg-orb arth-bg-orb-1" />
        <div className="arth-bg-orb arth-bg-orb-2" />
        <div className="arth-bg-orb arth-bg-orb-3" />
        <div className="arth-bg-grid" />
        <div className="arth-bg-line arth-bg-line-1" />
        <div className="arth-bg-line arth-bg-line-2" />
      </div>

      <div className="relative z-10">
        <style>{`
          .arth-landing-page {
            isolation: isolate;
          }

          .arth-bg-animation {
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
          }

          .arth-bg-orb {
            position: absolute;
            border-radius: 9999px;
            filter: blur(72px);
            will-change: transform;
            pointer-events: none;
          }

          .arth-bg-orb-1 {
            width: 340px;
            height: 340px;
            left: -120px;
            top: 70px;
            background: rgba(16, 185, 129, 0.18);
            animation: arthBgOrbOne 14s ease-in-out infinite;
          }

          .arth-bg-orb-2 {
            width: 300px;
            height: 300px;
            right: -110px;
            top: 150px;
            background: rgba(245, 166, 35, 0.16);
            animation: arthBgOrbTwo 17s ease-in-out infinite;
          }

          .arth-bg-orb-3 {
            width: 240px;
            height: 240px;
            left: 43%;
            top: 52%;
            background: rgba(20, 184, 166, 0.11);
            animation: arthBgOrbThree 19s ease-in-out infinite;
          }

          .arth-bg-grid {
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(rgba(16, 185, 129, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.025) 1px, transparent 1px);
            background-size: 56px 56px;
            opacity: 0.75;
            mask-image: linear-gradient(to bottom, rgba(0,0,0,0.65), transparent 82%);
            -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.65), transparent 82%);
            animation: arthBgGrid 26s linear infinite;
          }

          .arth-bg-line {
            position: absolute;
            width: 55vw;
            max-width: 760px;
            height: 1px;
            opacity: 0.16;
            filter: blur(0.2px);
          }

          .arth-bg-line-1 {
            left: -10%;
            top: 34%;
            background: linear-gradient(90deg, transparent, rgba(16,185,129,0.7), transparent);
            animation: arthBgLineOne 12s ease-in-out infinite;
          }

          .arth-bg-line-2 {
            right: -10%;
            top: 64%;
            background: linear-gradient(90deg, transparent, rgba(245,166,35,0.65), transparent);
            animation: arthBgLineTwo 15s ease-in-out infinite;
          }

          @keyframes arthBgOrbOne {
            0%, 100% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(105px,35px,0) scale(1.08); }
          }

          @keyframes arthBgOrbTwo {
            0%, 100% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(-105px,-45px,0) scale(1.1); }
          }

          @keyframes arthBgOrbThree {
            0%, 100% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(-75px,-55px,0) scale(1.12); }
          }

          @keyframes arthBgGrid {
            from { background-position: 0 0, 0 0; }
            to { background-position: 56px 56px, 56px 56px; }
          }

          @keyframes arthBgLineOne {
            0%, 100% { transform: translateX(-8%) rotate(-8deg); opacity: 0.08; }
            50% { transform: translateX(28%) rotate(-8deg); opacity: 0.24; }
          }

          @keyframes arthBgLineTwo {
            0%, 100% { transform: translateX(8%) rotate(7deg); opacity: 0.07; }
            50% { transform: translateX(-28%) rotate(7deg); opacity: 0.22; }
          }

          .dark .arth-bg-orb-1 { background: rgba(16,185,129,0.24); }
          .dark .arth-bg-orb-2 { background: rgba(245,166,35,0.20); }
          .dark .arth-bg-orb-3 { background: rgba(20,184,166,0.15); }
          .dark .arth-bg-grid {
            background-image:
              linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px);
          }

          @media (max-width: 640px) {
            .arth-bg-orb-1 { width: 220px; height: 220px; left: -90px; }
            .arth-bg-orb-2 { width: 200px; height: 200px; right: -90px; }
            .arth-bg-orb-3 { width: 160px; height: 160px; left: 40%; }
            .arth-bg-grid { background-size: 42px 42px; }
          }

          @media (prefers-reduced-motion: reduce) {
            .arth-bg-orb, .arth-bg-grid, .arth-bg-line {
              animation: none !important;
            }
          }
        `}</style>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Matches Reference Layout & Visual Hierarchy)             */}
      {/* ========================================================================= */}
      <section id="arth-hero" className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5 sm:space-y-6 text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/90 dark:border-amber-800/80 text-amber-900 dark:text-amber-300 text-xs font-semibold shadow-2xs">
              <span className="text-amber-500">⭐</span>
              <span>Empowering Local Entrepreneurs</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.16]">
              Validate your business <br />
              <span className="text-[#E58E1B] dark:text-[#F5A623]">before you finance it.</span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-xl">
              Get real local insights, check your numbers, explore schemes and loans, and build a practical plan — all in one place.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <button
                type="button"
                id="btn-hero-start"
                onClick={onStart}
                className="px-6 py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#E2981B] text-slate-950 font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Your Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="btn-hero-watch"
                onClick={onWatchIntro || (() => scrollToSection('how-it-works'))}
                className="px-5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>See How It Works</span>
              </button>
            </div>

            {/* 4 Benefit Indicators */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-200/80 dark:border-slate-800/80">
              {/* 1. Data-Driven Insights */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Data-Driven Insights
                </span>
              </div>

              {/* 2. Government Schemes */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Government Schemes
                </span>
              </div>

              {/* 3. Loan Matching */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Coins className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Loan Matching
                </span>
              </div>

              {/* 4. AI Guidance */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  AI Guidance
                </span>
              </div>
            </div>

            {/* Subtle Rural Enterprise Cultural Ribbon (Matches Reference Image) */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <span className="text-emerald-600">🌱</span>
              <span>छोटे उद्यमी, बड़ी पहचान • Dedicated to Bharat's Micro-Enterprises</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HOW ARTH AI WORKS (Clean 6-Step Visual Timeline in Reference)          */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
              How ARTH AI Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              A simple 6-step process from idea to impact.
            </p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6-Step Container */}
        <div className="w-full bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            {/* Step 01: Your Profile */}
            <div
              onClick={onStart}
              className="flex flex-col items-center text-center group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
                <User className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-900 dark:text-slate-200">
                01 Your Profile
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Tell us about you and your business idea
              </p>
            </div>

            {/* Step 02: Local Market */}
            <div
              onClick={onStart}
              className="flex flex-col items-center text-center group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-700/80 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-900 dark:text-slate-200">
                02 Local Market
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Get real market data and demand insights
              </p>
            </div>

            {/* Step 03: Evidence */}
            <div
              onClick={onStart}
              className="flex flex-col items-center text-center group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700/80 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-900 dark:text-slate-200">
                03 Evidence
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Validate feasibility with data and community insights
              </p>
            </div>

            {/* Step 04: Finance */}
            <div
              onClick={onStart}
              className="flex flex-col items-center text-center group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-700/80 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-900 dark:text-slate-200">
                04 Finance
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Get scheme matches and loan options
              </p>
            </div>

            {/* Step 05: Plan */}
            <div
              onClick={onStart}
              className="flex flex-col items-center text-center group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                05 Plan
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Build your practical business plan
              </p>
            </div>

            {/* Step 06: Track & Grow */}
            <div
              onClick={onStart}
              className="flex flex-col items-center text-center group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-700/80 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-900 dark:text-slate-200">
                06 Track & Grow
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Monitor progress and get continuous guidance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POPULAR BUSINESS OPPORTUNITIES (3 Cards Side-by-Side as in Reference) */}
      {/* ========================================================================= */}
      <section id="for-micro-businesses" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
              Popular Business Opportunities
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Explore real business ideas with local market insights and cost estimates.
            </p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Ideas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Rural Dairy Livestock */}
          <div
            onClick={() => (onLoadPreset ? onLoadPreset('dairy') : onStart())}
            className="group bg-white dark:bg-[#0E1C2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-md hover:border-amber-400/70 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Livestock / Cow Orange Square Icon */}
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 10C3.4 10 3 10.4 3 11V13C3 13.6 3.4 14 4 14H5V17C5 18.1 5.9 19 7 19H8C9.1 19 10 18.1 10 17V14H14V17C14 18.1 14.9 19 16 19H17C18.1 19 19 18.1 19 17V14H20C20.6 14 21 13.6 21 13V11C21 10.4 20.6 10 20 10H19V7C19 5.9 18.1 5 17 5H15.5C15.2 4.4 14.6 4 14 4H10C9.4 4 8.8 4.4 8.5 5H7C5.9 5 5 5.9 5 7V10H4ZM7 7H17V12H7V7Z" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Rural Dairy Livestock
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Cross-breed cattle unit, milk fat incentives, local chilling centers, and cooperative pricing.
              </p>
            </div>

            {/* Footer with Cost, Margin & Circular Arrow Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Project Cost: <strong className="text-slate-900 dark:text-white">~₹3,80,000</strong> • Margin: <strong className="text-emerald-600 dark:text-emerald-400">15%</strong>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-500/15 group-hover:bg-amber-500 text-amber-600 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Textile & Garments */}
          <div
            onClick={() => (onLoadPreset ? onLoadPreset('tailoring') : onStart())}
            className="group bg-white dark:bg-[#0E1C2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-md hover:border-teal-400/70 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Scissors / Garments Mint Square Icon */}
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <Scissors className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Textile & Garments
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Powerloom, apparel tailoring, school uniforms, and local weekly bazaar distribution.
              </p>
            </div>

            {/* Footer with Cost, Margin & Circular Arrow Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Project Cost: <strong className="text-slate-900 dark:text-white">~₹1,80,000</strong> • Margin: <strong className="text-emerald-600 dark:text-emerald-400">15%</strong>
              </div>
              <div className="w-8 h-8 rounded-full bg-teal-500/15 group-hover:bg-teal-500 text-teal-600 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Provisions & Kirana */}
          <div
            onClick={() => (onLoadPreset ? onLoadPreset('kirana') : onStart())}
            className="group bg-white dark:bg-[#0E1C2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-md hover:border-purple-400/70 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Shopping Bag Purple Square Icon */}
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Provisions & Kirana
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Daily groceries, fast-moving provisions, wholesale supply access, and credit cycle control.
              </p>
            </div>

            {/* Footer with Cost, Margin & Circular Arrow Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Project Cost: <strong className="text-slate-900 dark:text-white">~₹1,20,000</strong> • Margin: <strong className="text-emerald-600 dark:text-emerald-400">10%</strong>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500/15 group-hover:bg-purple-500 text-purple-600 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DEDICATED KISAN SATHI SECTION & CROP ECONOMICS                         */}
      {/* ========================================================================= */}
      <section id="for-farmers" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 🌾 KISAN SATHI Prominent Hero Card */}
        <div className="w-full bg-gradient-to-br from-emerald-950 via-[#0A2624] to-[#07192C] text-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-10 shadow-xl relative overflow-hidden text-left">
          {/* Subtle Ambient Glow */}
          <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/15 via-transparent to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                  🌾 KISAN SATHI
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold">
                  Farmer Assistant
                </span>
                <span className="px-2.5 py-1 rounded-full bg-teal-400/20 border border-teal-300/40 text-teal-200 text-xs font-bold">
                  🇮🇳 Marathi Available (मराठी उपलब्ध)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-[11px] font-semibold">
                  Israeli-Inspired Precision Farming
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  “Your crop companion from seed to sale”
                </h2>
                <p className="text-xs sm:text-base text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
                  Personalized scientific farming guidance in Marathi, Hindi and English — from choosing the right seed to harvesting and selling your crop.
                </p>
              </div>

              {/* 6 Lifecycle Steps Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10 flex items-center gap-1.5">
                  🌱 Seed Selection
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10 flex items-center gap-1.5">
                  💧 Irrigation
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10 flex items-center gap-1.5">
                  🌿 Crop Growth
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10 flex items-center gap-1.5">
                  🐛 Crop Protection
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10 flex items-center gap-1.5">
                  ✂️ Harvest
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10 flex items-center gap-1.5">
                  💰 Selling
                </span>
              </div>
            </div>

            {/* Right CTA */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center space-y-3">
              <button
                type="button"
                onClick={onOpenKisanSathi}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#F5A623] hover:bg-[#E5981B] text-slate-950 font-black text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>Start Kisan Sathi →</span>
              </button>
              <span className="text-[11px] text-emerald-200/80 font-medium">
                मराठी • हिन्दी • English • Zero Hallucination
              </span>
            </div>
          </div>
        </div>

        {/* Existing Crop Economics & Mandi Price Floors */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
              Crop Economics & Mandi Price Floors
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Calculate total cultivation cost per acre, APMC arrival prices, and the minimum yield required to break even.
            </p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Crops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 Wide Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crop Card 1: Rabi Onion */}
          <div
            onClick={() => (onLoadPreset ? onLoadPreset('onion') : onStart())}
            className="group bg-white dark:bg-[#0E1C2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Real Circular Photo of Red Onions */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                <img
                  src="/assets/images/crop_rabi_onion_1789896010271.jpg"
                  alt="Rabi Onion Crop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    // Fallback to red background if image fails
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Crop Information */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Rabi Onion
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    📍 Nashik Belt
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  High commercial value with post-harvest storage requirements to survive seasonal gluts.
                </p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-left">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Cultivation Cost / Acre</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">₹42,000</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Expected Yield / Acre</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">70 Quintals</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">APMC Price Floor</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#E58E1B] dark:text-[#F5A623]">₹1,650 / Qtl</span>
              </div>
            </div>
          </div>

          {/* Crop Card 2: Kharif Soybean */}
          <div
            onClick={() => (onLoadPreset ? onLoadPreset('soybean') : onStart())}
            className="group bg-white dark:bg-[#0E1C2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Real Circular Photo of Golden Soybeans */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                <img
                  src="/assets/images/crop_soybean_1789896029042.jpg"
                  alt="Kharif Soybean Crop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Crop Information */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Kharif Soybean
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
                    📍 Vidarbha / Marathwada
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Predictable oilseed cash crop with established crushing plant procurement channels.
                </p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-left">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Cultivation Cost / Acre</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">₹22,000</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Expected Yield / Acre</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">9 Quintals</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">APMC Price Floor</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#E58E1B] dark:text-[#F5A623]">₹4,600 / Qtl</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nashik Local Crop Market Price Predictor */}
        <CropMarketPricePredictor language={language} />
      </section>

      {/* ========================================================================= */}
      {/* 5. THE TWO-GATE MODEL (Preserves Existing Deep Ground Reality Checks)      */}
      {/* ========================================================================= */}
      <section id="two-gate-model" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-[#081524] text-white rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Side: Headline & Explanation */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                  THE TWO-GATE MODEL
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Pre-Debt Validation vs. Debt Trap
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Most micro-borrowers fail not because they lack hard work, but because they borrowed money without verifying ground demand first.
              </p>
            </div>

            {/* Right Side: 2 Comparison Panels */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Panel 1: Conventional Borrowing Trap */}
              <div className="bg-[#0f1d2f] border border-rose-900/40 rounded-2xl p-5 space-y-3.5 text-left">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span>Conventional Borrowing Trap</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 shrink-0 mt-0.5">✕</span>
                    <span>Unverified revenue claims accepted on face value.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 shrink-0 mt-0.5">✕</span>
                    <span>Predatory informal debt at 24–36% annual interest.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 shrink-0 mt-0.5">✕</span>
                    <span>First bad month causes immediate loan default and asset loss.</span>
                  </li>
                </ul>
              </div>

              {/* Panel 2: The ARTH AI Way */}
              <div className="bg-[#0f1d2f] border border-emerald-900/40 rounded-2xl p-5 space-y-3.5 text-left">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>The ARTH AI Way</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                    <span><strong>Gate 1:</strong> Ground-level demand & APMC pricing verified first.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                    <span><strong>Gate 2:</strong> Survives a -25% sales shock with positive cash surplus.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                    <span>Daily ₹ target habit makes monthly bank payments effortless.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL CALL TO ACTION (CTA Banner with Plant Sprout as in Reference)    */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800">
        <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-amber-50/60 dark:from-[#0c1e33] dark:via-[#091729] dark:to-[#0c1e33] border border-emerald-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-5">
            {/* Sprouting Young Green Plant from fertile soil */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-emerald-200 dark:border-emerald-800/80 shadow-xs bg-white dark:bg-emerald-950/40">
              <img
                src="/assets/images/sprouting_plant_1789896044616.jpg"
                alt="New Business Growth Sprout"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="space-y-1.5 text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 dark:text-white">
                Turn your idea into a <span className="text-[#E58E1B] dark:text-[#F5A623]">practical plan.</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl">
                Validate your market, structure your loan responsibly, and protect your family's savings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="px-6 py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#E2981B] text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 hover:scale-[1.02]"
          >
            <span>Start Your Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
      </div>
    </div>
  );
};
