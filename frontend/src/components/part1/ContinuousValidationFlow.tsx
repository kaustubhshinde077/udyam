import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  BarChart3,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Play,
  Pause,
  MapPin,
  Sparkles,
  Scale,
  Building2,
  Activity,
} from 'lucide-react';
import { formatIndianCurrency } from '../../utils/calculations';

interface StepData {
  id: string;
  number: string;
  title: string;
  badge: string;
  sub: string;
  icon: React.ElementType;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  dataPoints: { label: string; value: string; hint?: string }[];
  highlight: { label: string; value: string; desc: string };
  callout: string;
}

const FLOW_STEPS: StepData[] = [
  {
    id: 'idea',
    number: '01',
    title: 'Local Idea',
    badge: 'Stage 1: Enterprise Concept',
    sub: 'Applicant & Village Opportunity',
    icon: Store,
    accentColor: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-300',
    dataPoints: [
      { label: 'Applicant', value: 'Ramesh Pawar', hint: 'Baramati, Pune' },
      { label: 'Activity', value: '10-Animal Dairy Unit', hint: 'Agri Diversification' },
      { label: 'Project Cost', value: '₹10,00,000', hint: 'Shed, cows, chiller' },
      { label: 'Promoter Equity', value: '₹1,00,000', hint: '10% personal savings' },
    ],
    highlight: {
      label: 'Initial Capital Check',
      value: '₹1,00,000 Committed',
      desc: 'Sufficient equity buffer to initiate a safe proof-of-demand pilot.',
    },
    callout: 'Farmer seeking to convert surplus canal green fodder into daily liquid cash flow.',
  },
  {
    id: 'evidence',
    number: '02',
    title: 'Ground Evidence',
    badge: 'Stage 2: Market & APMC Data',
    sub: 'Hyper-Local Demand & Price Realism',
    icon: BarChart3,
    accentColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    dataPoints: [
      { label: 'APMC Mandi Rate', value: '₹52 – ₹64 / Litre', hint: 'APMC Pune Benchmark' },
      { label: 'Local Off-Takers', value: '12 Tea Stalls + Coop', hint: 'High absorption' },
      { label: 'Local Competitors', value: '1–2 small sheds', hint: '3 km radius' },
      { label: 'Evidence Tier', value: 'Tier 1 Certified', hint: 'Market + Survey data' },
    ],
    highlight: {
      label: 'Demand Realism',
      value: 'Positive Signal',
      desc: 'Local chilling center guarantees minimum daily intake of 100+ litres.',
    },
    callout: 'Actual field validation eliminates guesswork before committing to debt.',
  },
  {
    id: 'finance',
    number: '03',
    title: 'Two-Gate Finance',
    badge: 'Stage 3: Solvency Assessment',
    sub: 'Unit Economics & Stress Testing',
    icon: ShieldCheck,
    accentColor: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    dataPoints: [
      { label: 'Gate 1 (Market)', value: '72% Pass', hint: 'Evidence sufficient' },
      { label: 'Gate 2 (Solvency)', value: '81% Pass', hint: 'Healthy debt coverage' },
      { label: 'Monthly Surplus', value: '₹46,000 / mo', hint: 'After all costs & EMI' },
      { label: 'Solvency Stress Test', value: 'Solvent at -20%', hint: 'Maintains surplus' },
    ],
    highlight: {
      label: 'Decision Verdict',
      value: 'PILOT FIRST',
      desc: 'Viable unit economics, but test 3 cows first before full ₹9.0 Lakh debt drawdown.',
    },
    callout: 'Calculated with strict mathematical solvency rules rather than arbitrary approvals.',
  },
  {
    id: 'plan',
    number: '04',
    title: 'Actionable Plan',
    badge: 'Stage 4: Execution & Monitoring',
    sub: 'Repayment Roadmap & AI Safeguard',
    icon: Calendar,
    accentColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    dataPoints: [
      { label: 'Priority Term Loan', value: '₹9,00,000', hint: '7-Year Tenure @ 8% p.a.' },
      { label: 'Monthly EMI', value: '₹14,042 / mo', hint: 'Reducing balance' },
      { label: 'Daily Sales Target', value: '₹5,200 / day', hint: '100 litres @ ₹52/L' },
      { label: 'Daily EMI Reserve', value: '₹468 / day', hint: 'Dedicated escrow account' },
    ],
    highlight: {
      label: 'Daily Target Safeguard',
      value: '₹468 / day',
      desc: 'Simple operational daily benchmark ensures zero end-of-month panic.',
    },
    callout: 'Continuous vernacular AI advisor monitors feed inflation and seasonal disease alerts.',
  },
];

export const ContinuousValidationFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Auto-advance loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const current = FLOW_STEPS[activeStep];
  const StepIcon = current.icon;

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Top Header of the Animation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded border border-teal-300">
              Interactive Architectural Loop
            </span>
            <span className="text-xs font-semibold text-slate-500">Continuous 4-Stage Validation</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            Local Idea → Ground Evidence → Two-Gate Finance → Actionable Plan
          </h2>
        </div>

        {/* Play / Pause Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-700" />
                <span>Pause Animation</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                <span>Resume Auto-Play</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Interactive Progress Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {FLOW_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                setActiveStep(idx);
                setIsPlaying(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-101 ring-2 ring-teal-500'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {/* Active animated top progress bar */}
              {isActive && isPlaying && (
                <motion.div
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-teal-400 to-amber-400"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4.5, ease: 'linear' }}
                  key={activeStep}
                />
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-teal-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  Step {step.number}
                </span>
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`}
                />
              </div>

              <div className="font-extrabold text-xs sm:text-sm truncate">
                {step.title}
              </div>
              <div
                className={`text-[11px] truncate mt-0.5 ${
                  isActive ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {step.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Animated Display Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={`p-5 sm:p-6 rounded-xl border-2 ${current.borderColor} ${current.bgColor} space-y-4`}
        >
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300/70 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                <StepIcon className={`w-5 h-5 ${current.accentColor}`} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  {current.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {current.title} — {current.sub}
                </h3>
              </div>
            </div>

            <div className="self-start sm:self-auto bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs text-xs font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
              <span>Real Baramati Dairy Prototype</span>
            </div>
          </div>

          {/* 4 Data Points Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {current.dataPoints.map((dp, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs"
              >
                <span className="text-[11px] text-slate-500 block font-medium">
                  {dp.label}
                </span>
                <span className="font-bold text-sm text-slate-900 block mt-0.5 tabular-nums">
                  {dp.value}
                </span>
                {dp.hint && (
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {dp.hint}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Highlight & Callout Banner */}
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  {current.highlight.label}: {current.highlight.value}
                </span>
              </div>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                {current.highlight.desc}
              </p>
            </div>

            <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 italic shrink-0 max-w-xs">
              "{current.callout}"
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Explanatory Footer Pill */}
      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-200">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <strong>Smart India Hackathon 2026 Core Assurance:</strong> No citizen is advised to take commercial debt before passing both Gate 1 (Demand) &amp; Gate 2 (Solvency).
        </span>
        <span className="font-bold text-slate-600">
          Cycle: Stage {activeStep + 1} of 4
        </span>
      </div>
    </div>
  );
};
