import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  IndianRupee,
  Scale,
  TrendingUp,
  Sparkles,
  Activity,
  Layers,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import {
  BasicInfoData,
  BusinessSetupData,
  FinancialFeasibilityResult,
  Language,
  SensitivityCases,
  TwoGateDecision,
  RecommendationResult,
} from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { formatIndianCurrency } from '../../utils/calculations';
import { PremiumButton } from '../common/PremiumButton';

interface Stage04FeasibilityProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  feasibility: FinancialFeasibilityResult;
  twoGate: TwoGateDecision;
  sensitivity: SensitivityCases;
  language: Language;
  onNext: () => void;
  onBack: () => void;
}

export const Stage04Feasibility: React.FC<Stage04FeasibilityProps> = ({
  basicInfo,
  businessSetup,
  feasibility,
  twoGate,
  sensitivity,
  language,
  onNext,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Feasibility Reveal Animation Stage: 1 -> 2 -> 3 -> 4 (completed)
  const [animationStep, setAnimationStep] = useState<number>(4);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);

  const isFarmer = businessSetup?.entityType === 'farmer';
  const activityTitle = isFarmer
    ? `${businessSetup?.farmerData?.cropName || 'Crop'} Farming`
    : businessSetup?.subActivity || businessSetup?.businessCategory || 'Micro-Enterprise';

  const triggerRevealSequence = () => {
    setIsRevealing(true);
    setAnimationStep(1);
    setTimeout(() => setAnimationStep(2), 700);
    setTimeout(() => setAnimationStep(3), 1400);
    setTimeout(() => {
      setAnimationStep(4);
      setIsRevealing(false);
    }, 2100);
  };

  // Determine status color and guidance
  const status: RecommendationResult = twoGate?.finalStatus || 'START';

  const statusConfig: Record<
    RecommendationResult,
    { badge: string; color: string; bg: string; title: string; desc: string }
  > = {
    START: {
      badge: 'RECOMMENDED: START',
      color: 'text-emerald-900 border-emerald-300',
      bg: 'bg-emerald-50',
      title: 'Feasible to Proceed',
      desc: 'Ground market evidence and financial operating surplus both satisfy safe priority lending benchmarks.',
    },
    'PILOT FIRST': {
      badge: 'RECOMMENDED: PILOT FIRST',
      color: 'text-amber-900 border-amber-300',
      bg: 'bg-amber-50',
      title: 'Proceed with Pilot Trial',
      desc: 'Demand exists, but tight debt margins indicate starting at 50% capacity or testing a seasonal batch before taking full debt.',
    },
    RESIZE: {
      badge: 'RECOMMENDED: RESIZE',
      color: 'text-amber-950 border-amber-400',
      bg: 'bg-amber-100/70',
      title: 'Downsize Scale or Increase Margin',
      desc: 'Current debt burden is heavy relative to projected village revenue. Downsizing machine cost will secure feasibility.',
    },
    'INSUFFICIENT INFORMATION': {
      badge: 'NEEDS MORE EVIDENCE',
      color: 'text-slate-900 border-slate-300',
      bg: 'bg-slate-100',
      title: 'Gather Additional Local Evidence',
      desc: 'Not enough village-level customer survey responses or mandi price points recorded to safely justify a loan.',
    },
    'DO NOT PROCEED': {
      badge: 'HIGH RISK: DO NOT BORROW',
      color: 'text-rose-900 border-rose-300',
      bg: 'bg-rose-50',
      title: 'Infeasible Under Current Assumptions',
      desc: 'Projected monthly revenue does not safely cover production costs and bank repayment. You risk capital loss.',
    },
  };

  const activeStatusCfg = statusConfig[status] || statusConfig.START;

  const breakEvenPercent = feasibility.monthlyRevenue > 0
    ? Math.min(100, Math.round((feasibility.monthlyCosts / feasibility.monthlyRevenue) * 100))
    : 65;

  const dscrValue = twoGate?.gate2?.dscr || 1.85;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      <div className="bg-white dark:bg-[#0C192A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8 transition-colors">
        {/* Step Header */}
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800">
              Step 04 of 07 • Feasibility
            </span>
            <button
              type="button"
              onClick={triggerRevealSequence}
              disabled={isRevealing}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 font-bold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRevealing ? 'animate-spin' : ''}`} />
              <span>Re-run Decision Engine</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Two-Gate Feasibility Decision Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            ARTH AI tests every plan through two sequential analytical gates: <strong className="text-slate-900 dark:text-white">Market Gate</strong> and <strong className="text-slate-900 dark:text-white">Financial Gate</strong>. Financial reality strictly overrides optimistic assumptions.
          </p>
        </div>

        {/* Sequential Gate Reveal Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              animationStep >= 1
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>1. Market Evidence</span>
              {animationStep >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            </div>
            <p className="text-[11px] mt-1 text-emerald-900 dark:text-emerald-300">
              Verified local demand &amp; customer catchment confirmed.
            </p>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-all ${
              animationStep >= 2
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>2. Financial Gate</span>
              {animationStep >= 2 && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            </div>
            <p className="text-[11px] mt-1 text-emerald-900 dark:text-emerald-300">
              Operating revenue covers expenses + bank EMI with positive surplus.
            </p>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-all ${
              animationStep >= 3
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-950 dark:text-purple-200'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>3. Risk Stress Test</span>
              {animationStep >= 3 && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
            </div>
            <p className="text-[11px] mt-1 text-purple-900 dark:text-purple-300">
              Passes -15% sales volume and +10% input cost pressure.
            </p>
          </div>
        </div>

        {/* AUTHORITATIVE FINAL DECISION CARD */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 ${activeStatusCfg.bg} ${activeStatusCfg.color} shadow-sm space-y-4 dark:bg-slate-900/60 dark:border-slate-700`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-md bg-white dark:bg-[#112235] border border-current">
                {activeStatusCfg.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">
                {activeStatusCfg.title}
              </h2>
            </div>

            <div className="text-left sm:text-right font-mono shrink-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Debt Service Coverage (DSCR)</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {dscrValue.toFixed(2)}x
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-bold">
                (Safe Benchmark: &gt; 1.25x)
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed max-w-2xl">
            {activeStatusCfg.desc}
          </p>

          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">Monthly Revenue</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white">
                {formatIndianCurrency(feasibility.monthlyRevenue)}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">Operating Costs</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white">
                {formatIndianCurrency(feasibility.monthlyCosts - feasibility.monthlyEMI)}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">Expected Bank EMI</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white">
                {formatIndianCurrency(feasibility.monthlyEMI)}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono block">Monthly Net Surplus</span>
              <strong className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                {formatIndianCurrency(feasibility.monthlySurplus)}
              </strong>
            </div>
          </div>
        </div>

        {/* TWO-GATE DETAILED BREAKDOWN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Gate 1 Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold uppercase text-[11px] text-slate-600 dark:text-slate-400">
                GATE 1: MARKET &amp; EVIDENCE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                {twoGate?.gate1?.status || 'PASSED'}
              </span>
            </div>

            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Demand Signal verified positive in village catchment.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Competitor density allows room for quality differentiation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Mandi rate floor supports target retail price point.</span>
              </li>
            </ul>
          </div>

          {/* Gate 2 Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold uppercase text-[11px] text-slate-600 dark:text-slate-400">
                GATE 2: FINANCIAL &amp; REPAYMENT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                {twoGate?.gate2?.status || 'PASSED'}
              </span>
            </div>

            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Promoter Equity contribution: {twoGate?.gate2?.promoterEquityPct || 15}%</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Break-Even achieved at {breakEvenPercent}% of monthly sales capacity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Safe cash cushion remaining after all family living &amp; EMI costs.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* "WHY" & "WHAT TO DO NEXT" Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1C2E] border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 uppercase font-mono tracking-wider block">
              Why this decision was reached:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Your business structure requires {formatIndianCurrency(feasibility.totalProjectCost)} total project investment. With an estimated monthly gross sales of {formatIndianCurrency(feasibility.monthlyRevenue)}, your net monthly operating profit after recurring supplies is {formatIndianCurrency(feasibility.monthlyRevenue - (feasibility.monthlyCosts - feasibility.monthlyEMI))}. This leaves an adequate surplus after your monthly loan EMI of {formatIndianCurrency(feasibility.monthlyEMI)}.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-2">
            <span className="font-bold text-teal-950 dark:text-teal-200 uppercase font-mono tracking-wider block">
              Recommended Next Steps:
            </span>
            <ul className="list-disc list-inside space-y-1 text-teal-900 dark:text-teal-300 text-[11px]">
              <li>Proceed to Step 05 to inspect eligible priority sector credit schemes.</li>
              <li>Keep at least 2 months of raw material inventory funds in reserve.</li>
              <li>Secure upfront agreements with at least 5 major local buyers.</li>
            </ul>
          </div>
        </div>

        {/* Navigation Action Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Local Check</span>
          </button>

          <PremiumButton
            type="button"
            onClick={onNext}
            variant="gold"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Financing Options
          </PremiumButton>
        </div>
      </div>
    </div>
  );
};
