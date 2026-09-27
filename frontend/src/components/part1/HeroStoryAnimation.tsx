import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  MapPin,
  ShieldCheck,
  Calculator,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Users,
  Building2,
  Scale,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

interface HeroStoryAnimationProps {
  onStartPlan?: () => void;
}

interface StoryStage {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  headline: string;
  detailPoints: { label: string; value: string; hint?: string }[];
  visualType: 'idea' | 'market' | 'evidence' | 'finance' | 'plan' | 'track';
}

const STORY_STAGES: StoryStage[] = [
  {
    id: 'idea',
    stepNumber: '01',
    title: 'YOUR IDEA',
    subtitle: 'Ground Reality & Concept',
    badge: 'Foundation',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: Store,
    accentColor: '#D97706',
    headline: 'Define your business or farm concept with local honesty.',
    detailPoints: [
      { label: 'Activity Type', value: 'Micro-Enterprise or Crop' },
      { label: 'Location Anchor', value: 'Village & Catchment' },
      { label: 'Own Savings', value: '15–20% Equity Buffer' },
    ],
    visualType: 'idea',
  },
  {
    id: 'market',
    stepNumber: '02',
    title: 'LOCAL MARKET',
    subtitle: 'Catchment, Price & Demand',
    badge: 'Ground Evidence',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    icon: MapPin,
    accentColor: '#0D9488',
    headline: 'Verify buyer density and APMC price floor before spending.',
    detailPoints: [
      { label: 'Customer Catchment', value: '3 to 5 km Radius' },
      { label: 'Competitor Density', value: '2 Nearby Outlets' },
      { label: 'Price Benchmark', value: 'APMC Floor Reference' },
    ],
    visualType: 'market',
  },
  {
    id: 'evidence',
    stepNumber: '03',
    title: 'EVIDENCE',
    subtitle: 'Two-Gate Solvency Proof',
    badge: 'Dual-Gate Check',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: ShieldCheck,
    accentColor: '#047857',
    headline: 'Quantify demand certainty and test a -25% price shock.',
    detailPoints: [
      { label: 'Demand Signal', value: 'Positive & Verified' },
      { label: 'Survey Proof', value: 'Local Household Intent' },
      { label: 'Stress Buffer', value: 'Survives Input Rise' },
    ],
    visualType: 'evidence',
  },
  {
    id: 'finance',
    stepNumber: '04',
    title: 'FINANCE',
    subtitle: 'PS 26091 Safe Credit',
    badge: 'Priority Sector',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: Calculator,
    accentColor: '#2563EB',
    headline: 'Structure debt that matches your true seasonal cash flow.',
    detailPoints: [
      { label: 'Total Project Cost', value: 'Sized to Real Needs' },
      { label: 'Promoter Equity', value: 'Your Own Stake' },
      { label: 'Safe Bank Loan', value: 'No Predatory Rates' },
    ],
    visualType: 'finance',
  },
  {
    id: 'plan',
    stepNumber: '05',
    title: 'YOUR PLAN',
    subtitle: 'Yearly, Monthly & Daily Target',
    badge: 'Daily Habit',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    icon: CalendarCheck,
    accentColor: '#4F46E5',
    headline: 'Turn a scary monthly EMI into an achievable daily sales habit.',
    detailPoints: [
      { label: '7-Year Horizon', value: 'Clear Debt Payoff' },
      { label: 'Monthly Surplus', value: 'Net Profit in Hand' },
      { label: 'Daily Milestone', value: 'Manageable ₹ Target' },
    ],
    visualType: 'plan',
  },
  {
    id: 'track',
    stepNumber: '06',
    title: 'TRACK & IMPROVE',
    subtitle: 'Daily Reality & AI Advice',
    badge: 'Living Feedback',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: TrendingUp,
    accentColor: '#059669',
    headline: 'Log your daily cash, stay on track, and get proactive advice.',
    detailPoints: [
      { label: 'Target vs Actual', value: 'Instant Health Signal' },
      { label: 'Daily Expense Alert', value: 'Prevents Cash Leak' },
      { label: 'AI Business Guide', value: 'Practical Next Steps' },
    ],
    visualType: 'track',
  },
];

export const HeroStoryAnimation: React.FC<HeroStoryAnimationProps> = ({ onStartPlan }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Auto-cycle through the 6 stages in a continuous loop every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STORY_STAGES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const currentStage = STORY_STAGES[currentIndex];
  const Icon = currentStage.icon;

  return (
    <div
      id="arth-hero-living-story"
      className="relative w-full max-w-5xl mx-auto rounded-3xl bg-slate-900 text-white border-2 border-slate-800 shadow-2xl overflow-hidden"
    >
      {/* Subtle Ambient Background Gradients & Moving Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl"
        />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 space-y-6">
        {/* Top Story Milestone Tracker */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Living Story • From Idea to Daily Action
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-medium text-slate-400">
            {STORY_STAGES.map((st, idx) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/40'
                    : 'hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={`Jump to ${st.title}`}
              >
                <span className="tabular-nums">{st.stepNumber}</span>
                <span className="hidden md:inline">{st.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Central Dynamic Stage Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[300px]">
          {/* Left Column: Narrative Headline & Evidence Cards */}
          <div className="lg:col-span-6 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${currentStage.badgeColor}`}>
                    {currentStage.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Stage {currentStage.stepNumber} of 06
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                  {currentStage.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {currentStage.headline}
                </p>

                {/* 3 Metric Insight Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  {currentStage.detailPoints.map((pt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-inner flex flex-col justify-between"
                    >
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {pt.label}
                      </span>
                      <span className="text-xs font-bold text-amber-300 mt-1 tabular-nums">
                        {pt.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Living Visual Representation */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-4/3 rounded-2xl bg-slate-950/80 border border-slate-800 p-6 flex flex-col items-center justify-center overflow-hidden shadow-inner">
              {/* Background ambient orbit */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="w-56 h-56 rounded-full border border-dashed border-slate-800"
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage.id}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'backOut' }}
                  className="relative z-10 flex flex-col items-center text-center space-y-3"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-teal-500/20 to-transparent border-2 border-amber-400/60 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    >
                      <Icon className="w-10 h-10 text-amber-400" />
                    </motion.div>

                    {/* Orbiting pulse badge */}
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-semibold shadow-md">
                      ✓ Active
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                      {currentStage.subtitle}
                    </h4>
                    <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                      Continuous pre-debt validation for self-reliance.
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Connected Stage Dots on Bottom of Card */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {STORY_STAGES.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom subtle guidance banner */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>ARTH AI synthesizes market evidence and finances before bank debt.</span>
          </div>

          {onStartPlan && (
            <button
              type="button"
              onClick={onStartPlan}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
            >
              <span>Validate Your Idea Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
