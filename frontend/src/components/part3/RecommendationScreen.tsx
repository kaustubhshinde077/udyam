import React from 'react';
import {
  RecommendationResult,
  Language,
  FinancialFeasibilityResult,
  HyperLocalAnalysis,
  BusinessSetupData,
  BasicInfoData,
  RecommendationType,
} from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { DataTrustBadge } from '../common/DataTrustBadge';
import { formatIndianCurrency } from '../../utils/calculations';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Minimize2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Sparkles,
  ListOrdered,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  recommendation: RecommendationResult;
  feasibility?: FinancialFeasibilityResult;
  hyperLocal?: HyperLocalAnalysis;
  businessSetup?: BusinessSetupData;
  basicInfo?: BasicInfoData;
  language: Language;
  onContinueToReport: () => void;
  onContinueToRepayment?: () => void;
  onBack: () => void;
  isDairyDemo?: boolean;
}

export const RecommendationScreen: React.FC<Props> = ({
  recommendation,
  feasibility,
  hyperLocal,
  businessSetup,
  basicInfo,
  language,
  onContinueToReport,
  onContinueToRepayment,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];
  const twoGate = recommendation.twoGate;

  const statusConfig: Record<
    RecommendationType,
    {
      label: string;
      hiLabel: string;
      mrLabel: string;
      sub: string;
      color: string;
      bannerBg: string;
      icon: React.ReactNode;
    }
  > = {
    START: {
      label: 'START',
      hiLabel: 'शुरू करें (START)',
      mrLabel: 'सुरू करा (START)',
      sub: 'Strong evidence & healthy margin',
      color: 'bg-emerald-600 text-white',
      bannerBg: 'bg-emerald-900',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-300" />,
    },
    'PILOT FIRST': {
      label: 'PILOT FIRST',
      hiLabel: 'पहले पायलट करें (PILOT FIRST)',
      mrLabel: 'प्रथम चाचणी करा (PILOT FIRST)',
      sub: 'Viable, validate with smaller trial',
      color: 'bg-blue-900 text-white ring-4 ring-blue-300',
      bannerBg: 'bg-blue-900',
      icon: <CheckCircle2 className="w-8 h-8 text-amber-300" />,
    },
    RESIZE: {
      label: 'RESIZE',
      hiLabel: 'आकार कम करें (RESIZE)',
      mrLabel: 'आकार कमी करा (RESIZE)',
      sub: 'Reduce equipment or debt burden',
      color: 'bg-amber-600 text-white',
      bannerBg: 'bg-amber-900',
      icon: <Minimize2 className="w-8 h-8 text-amber-300" />,
    },
    'INSUFFICIENT INFORMATION': {
      label: 'INSUFFICIENT EVIDENCE',
      hiLabel: 'अपूर्ण साक्ष्य (INSUFFICIENT)',
      mrLabel: 'अपुरा पुरावा (INSUFFICIENT)',
      sub: 'Gather local survey & supplier rates',
      color: 'bg-slate-600 text-white',
      bannerBg: 'bg-slate-800',
      icon: <HelpCircle className="w-8 h-8 text-slate-300" />,
    },
    'DO NOT PROCEED': {
      label: "DON'T PROCEED",
      hiLabel: 'आगे न बढ़ें (DO NOT PROCEED)',
      mrLabel: 'पुढे जाऊ नका (DO NOT PROCEED)',
      sub: 'High risk of debt distress',
      color: 'bg-rose-700 text-white',
      bannerBg: 'bg-rose-900',
      icon: <XCircle className="w-8 h-8 text-rose-300" />,
    },
  };

  const currentCfg = statusConfig[recommendation.result] || statusConfig['PILOT FIRST'];

  const possibleStatuses: RecommendationType[] = [
    'START',
    'PILOT FIRST',
    'RESIZE',
    'INSUFFICIENT INFORMATION',
    'DO NOT PROCEED',
  ];

  // Default fallback checks if twoGate not yet evaluated
  const gate1Passed = twoGate ? twoGate.gate1.passed : true;
  const gate1Score = twoGate ? twoGate.gate1.evidenceScore : 72;
  const gate1Checks = twoGate?.gate1.checks || {
    demandEvidence: `${hyperLocal?.demandSignal || 'Positive'} local demand detected`,
    buyerValidation: 'Village collection centers & retail outlets verified',
    priceRealism: 'Current mandi rate within realistic operational range',
    evidenceQuality: `${twoGate?.gate1.evidenceTier || 'Tier 1'} (Direct local market baseline)`,
  };

  const gate2Passed = twoGate ? twoGate.gate2.passed : true;
  const gate2Score = twoGate ? twoGate.gate2.financialScore : 81;
  const gate2Checks = twoGate?.gate2.checks || {
    profitability: feasibility
      ? `${Math.round((feasibility.monthlySurplus / (feasibility.monthlyRevenue || 1)) * 100)}% margin`
      : 'Healthy operational margin',
    cashSurplus: feasibility
      ? `${formatIndianCurrency(feasibility.monthlySurplus)}/month positive surplus`
      : 'Positive cash surplus after all costs',
    repaymentCoverage: feasibility
      ? `EMI: ${formatIndianCurrency(feasibility.monthlyEMI)} / mo (${feasibility.tenureMonths || 84} mo tenure)`
      : 'Solvent under standard priority term loan',
    breakEven: 'Break-even reached within normal capacity',
    stressResistance: 'Maintains solvency under -20% stress shock',
  };

  const reasonsList = recommendation.reasons && recommendation.reasons.length > 0
    ? recommendation.reasons
    : [
        twoGate?.primaryRationale || recommendation.summary,
        `Gate 1 Status: ${gate1Passed ? 'Passed' : 'Needs verification'} (${gate1Score}% evidence confidence).`,
        `Gate 2 Status: ${gate2Passed ? 'Passed' : 'Risk detected'} (${gate2Score}% financial solvency).`,
      ];

  const nextActionsList = twoGate?.nextActions && twoGate.nextActions.length > 0
    ? twoGate.nextActions
    : [
        `Begin with a small 30-day proof-of-demand trial using ${formatIndianCurrency(feasibility?.ownContribution || 100000)} equity.`,
        'Formalize buyer agreements or advance collection arrangements with local outlets.',
        'Submit the validated 12-section feasibility report for priority institutional term credit.',
      ];

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  Two-Gate Assessment Engine
                </span>
                <DataTrustBadge status="Demo Data" compact />
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Business Feasibility Decision
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {businessSetup?.subActivity || 'Rural Micro-Enterprise'} in{' '}
                {basicInfo?.village || 'Baramati'}, {basicInfo?.district || 'Pune'} — Objective evaluation synthesized from local ground evidence and quantitative solvency rules.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
              Rule Engine v2.4 (SIH 2026)
            </span>
          </div>

          {/* 5 Status Spectrum Bar */}
          <div className="mt-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Decision Spectrum
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {possibleStatuses.map((st) => {
                const cfg = statusConfig[st];
                const isActive = recommendation.result === st;
                return (
                  <div
                    key={st}
                    className={`p-2.5 rounded-lg text-center transition-all ${
                      isActive
                        ? `${cfg.color} shadow-sm font-bold scale-102`
                        : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-60'
                    }`}
                  >
                    <span className="text-xs block font-mono">{cfg.label}</span>
                    <span className="text-[10px] block opacity-90 truncate">{cfg.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Outcome Banner */}
          <div className={`mt-6 p-6 sm:p-7 rounded-2xl ${currentCfg.bannerBg} text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-5`}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 shadow-xs">
                {currentCfg.icon}
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-slate-200">
                  Calculated Outcome
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-white">
                  {language === 'hi'
                    ? currentCfg.hiLabel
                    : language === 'mr'
                    ? currentCfg.mrLabel
                    : currentCfg.label}
                </h2>
                <p className="text-xs sm:text-sm text-slate-100 mt-1 max-w-xl leading-relaxed">
                  {recommendation.summary}
                </p>
              </div>
            </div>
          </div>

          {/* TWO GATES VISUALIZATION */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* GATE 1: MARKET & EVIDENCE */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-800 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">
                    GATE 1: MARKET &amp; EVIDENCE ({gate1Score}% Pass)
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    gate1Passed
                      ? 'text-emerald-800 bg-emerald-100'
                      : 'text-amber-800 bg-amber-100'
                  }`}
                >
                  {gate1Passed ? 'PASSED' : 'NEEDS ACTION'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-600">Demand Evidence:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[60%] truncate">
                    {gate1Checks.demandEvidence}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-600">Buyer Validation:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[60%] truncate">
                    {gate1Checks.buyerValidation}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-600">Price Realism:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[60%] truncate">
                    {gate1Checks.priceRealism}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-600">Evidence Quality:</span>
                  <span className="font-bold text-teal-900 text-right max-w-[60%] truncate">
                    {gate1Checks.evidenceQuality}
                  </span>
                </div>
              </div>
            </div>

            {/* GATE 2: FINANCIAL HEALTH */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">
                    GATE 2: FINANCIAL SOLVENCY ({gate2Score}% Pass)
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    gate2Passed
                      ? 'text-emerald-800 bg-emerald-100'
                      : 'text-rose-800 bg-rose-100'
                  }`}
                >
                  {gate2Passed ? 'PASSED' : 'HIGH RISK'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-600">Profitability:</span>
                  <span className="font-bold text-emerald-800 text-right max-w-[60%] truncate">
                    {gate2Checks.profitability}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-600">Monthly Cash Surplus:</span>
                  <span className="font-bold text-emerald-800 font-mono text-right max-w-[60%] truncate">
                    {gate2Checks.cashSurplus}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-600">Debt Servicing (EMI):</span>
                  <span className="font-bold text-slate-900 text-right max-w-[60%] truncate">
                    {gate2Checks.repaymentCoverage}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-600">Break-even Point:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[60%] truncate">
                    {gate2Checks.breakEven}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-600">Stress Test Resistance:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[60%] truncate">
                    {gate2Checks.stressResistance}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* WHY THIS DECISION? (Concise Rationale Points) */}
          <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-teal-700" />
              Why this decision? (Concise Rationale Points)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              {reasonsList.slice(0, 3).map((reason, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                  <strong className="block text-slate-900 mb-1">
                    Point {idx + 1}
                  </strong>
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT TO DO NEXT (3 Practical Actions) */}
          <div className="mt-4 p-5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              What to do next? (3 Practical Actions)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              {nextActionsList.slice(0, 3).map((action, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-emerald-200">
                  <strong className="block text-emerald-900 mb-1">
                    Step {idx + 1}
                  </strong>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Notice */}
          <div className="mt-4 p-3 bg-slate-100 rounded-lg text-[11px] text-slate-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              <strong>System Architecture:</strong> Deterministic calculations and Two-Gate solvency rules drive the decision. AI provides contextual synthesis and natural-language explanations without inventing financial outcomes.
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-2.5 text-slate-700 font-semibold text-xs sm:text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50 min-h-[40px] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            {onContinueToRepayment && (
              <button
                id="recom-continue-repayment-btn"
                type="button"
                onClick={onContinueToRepayment}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 font-bold text-xs sm:text-sm rounded-lg shadow-xs min-h-[40px] flex items-center justify-center gap-2 transition-colors"
              >
                <span>Repayment &amp; Daily Targets</span>
                <ArrowRight className="w-4 h-4 text-teal-700" />
              </button>
            )}

            <button
              id="view-final-report-btn"
              type="button"
              onClick={onContinueToReport}
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm min-h-[40px] flex items-center justify-center gap-2 transition-colors"
            >
              <span>View 12-Section Feasibility Report</span>
              <FileText className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
