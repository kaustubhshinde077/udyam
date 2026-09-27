import React from 'react';
import {
  BasicInfoData,
  BusinessSetupData,
  FinancialFeasibilityResult,
  HyperLocalAnalysis,
  Language,
  RecommendationResult,
  RecommendationType,
} from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { DataTrustBadge } from '../common/DataTrustBadge';
import {
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Award,
  Compass,
  FileSpreadsheet,
  Calendar,
  Sparkles,
  RefreshCw,
  Building2,
  MapPin,
  ChevronRight,
  Activity,
  BarChart3,
  CircleDollarSign,
  Scale,
  XCircle,
  HelpCircle,
  Minimize2,
} from 'lucide-react';
import { DEMO_PRESETS, DemoPresetKey } from '../../data/demoPresets';

interface Props {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  hyperLocal: HyperLocalAnalysis;
  feasibility: FinancialFeasibilityResult;
  recommendation: RecommendationResult;
  language: Language;
  onNavigate: (step: any) => void;
  onLoadPreset: (presetKey: DemoPresetKey) => void;
  activePresetId?: string;
}

export const ExecutiveDashboard: React.FC<Props> = ({
  basicInfo,
  businessSetup,
  hyperLocal,
  feasibility,
  recommendation,
  language,
  onNavigate,
  onLoadPreset,
  activePresetId = 'dairy',
}) => {
  const displayProjectCost = feasibility.totalProjectCost;
  const displayCapital = feasibility.ownContribution;
  const displayLoan = feasibility.potentialLoan;
  const displayMonthlyProfit = feasibility.monthlySurplus;
  const displayRevenue = feasibility.monthlyRevenue;
  const displayExpenses = feasibility.monthlyCosts;

  const twoGate = recommendation.twoGate;
  const marketScore = twoGate?.gate1.evidenceScore ?? 72;
  const financialScore = twoGate?.gate2.financialScore ?? 81;
  const evidenceTier = twoGate?.gate1.evidenceTier ?? 'Tier 1';
  const competition = businessSetup.similarBusinessesNearby || '1–2 units';
  const demandSignal = hyperLocal.demandSignal || 'Positive';

  const statusConfig: Record<
    RecommendationType,
    {
      label: string;
      sub: string;
      color: string;
      bannerBg: string;
      icon: React.ReactNode;
    }
  > = {
    START: {
      label: 'START (सुरू करा)',
      sub: 'Strong market evidence & high margin',
      color: 'bg-emerald-600 text-white',
      bannerBg: 'bg-emerald-900',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />,
    },
    'PILOT FIRST': {
      label: 'PILOT FIRST (प्रथम चाचणी करा)',
      sub: 'Viable, validate with smaller trial',
      color: 'bg-blue-900 text-white',
      bannerBg: 'bg-blue-900',
      icon: <CheckCircle2 className="w-6 h-6 text-amber-300 shrink-0" />,
    },
    RESIZE: {
      label: 'RESIZE (आकार कमी करा)',
      sub: 'Reduce equipment or debt burden',
      color: 'bg-amber-600 text-white',
      bannerBg: 'bg-amber-900',
      icon: <Minimize2 className="w-6 h-6 text-amber-300 shrink-0" />,
    },
    'INSUFFICIENT INFORMATION': {
      label: 'INSUFFICIENT EVIDENCE (अपुरा पुरावा)',
      sub: 'Gather local survey & supplier rates',
      color: 'bg-slate-700 text-white',
      bannerBg: 'bg-slate-800',
      icon: <HelpCircle className="w-6 h-6 text-slate-300 shrink-0" />,
    },
    'DO NOT PROCEED': {
      label: "DON'T PROCEED (पुढे जाऊ नका)",
      sub: 'High risk of debt distress',
      color: 'bg-rose-700 text-white',
      bannerBg: 'bg-rose-900',
      icon: <XCircle className="w-6 h-6 text-rose-300 shrink-0" />,
    },
  };

  const currentCfg = statusConfig[recommendation.result] || statusConfig['PILOT FIRST'];

  const reasonsList = recommendation.reasons && recommendation.reasons.length > 0
    ? recommendation.reasons
    : [
        twoGate?.primaryRationale || recommendation.summary,
        `Gate 1: ${marketScore}% Evidence sufficiency based on local benchmark rates.`,
        `Gate 2: ${financialScore}% Solvency score with ${formatIndianCurrency(displayMonthlyProfit)}/mo cash buffer.`,
      ];

  const dailyRequiredRevenue = Math.ceil((displayRevenue || 1) / 30);
  const dailyRequiredEMI = feasibility.monthlyEMI ? Math.ceil(feasibility.monthlyEMI / 30) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner: Enterprise Snapshot & Demo Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                Business Intelligence Dashboard
              </span>
              <DataTrustBadge status="Demo Data" compact />
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                SIH 2026 Internal Evaluation
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 flex items-center gap-2">
              Your Business Snapshot
            </h1>

            <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-600 flex-wrap">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-700" />
                {businessSetup.subActivity || 'Rural Micro-Enterprise'} ({businessSetup.businessCategory || 'Agri-Business'})
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                {basicInfo.village || 'Baramati'}, {basicInfo.district || 'Pune'}, {basicInfo.state || 'Maharashtra'}
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Applicant: {basicInfo.name || 'Ramesh Pawar'}
              </span>
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 shrink-0">
            <span className="text-xs font-bold text-slate-600 px-2 flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-teal-600" /> Live Demo:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onLoadPreset('dairy')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activePresetId === 'dairy'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Dairy (Pune)
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset('onion')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activePresetId === 'onion'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Onion (Nashik)
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset('poultry')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activePresetId === 'poultry'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Poultry (Nagpur)
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset('textile')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activePresetId === 'textile'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Textile (Kolhapur)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Project Cost */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Project Cost
              </span>
              <DataTrustBadge status="Estimated" compact />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-2">
              {formatIndianCurrency(displayProjectCost)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete setup, machinery &amp; initial capital
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Shed, tools, stock &amp; buffer</span>
            <button
              onClick={() => onNavigate('financial_structure')}
              className="font-bold text-teal-700 hover:underline"
            >
              Breakdown →
            </button>
          </div>
        </div>

        {/* Card 2: Available Capital */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Available Capital
              </span>
              <DataTrustBadge status="User Provided" compact />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-2">
              {formatIndianCurrency(displayCapital)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Entrepreneur&apos;s personal equity ({displayProjectCost > 0 ? Math.round((displayCapital / displayProjectCost) * 100) : 10}%)
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Savings / Promoter equity</span>
            <span className="font-semibold text-emerald-700">Committed</span>
          </div>
        </div>

        {/* Card 3: Potential Loan */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Potential Loan
              </span>
              <span className="text-[10px] font-bold uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Priority Term Loan
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-2">
              {formatIndianCurrency(displayLoan)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Eligible institutional term finance requirement
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              {feasibility.monthlyEMI ? `Est. EMI: ${formatIndianCurrency(feasibility.monthlyEMI)}/mo` : '7-Year Tenure'}
            </span>
            <button
              onClick={() => onNavigate('repayment_plan')}
              className="font-bold text-teal-700 hover:underline"
            >
              Repayment →
            </button>
          </div>
        </div>

        {/* Card 4: Monthly Profit */}
        <div className="bg-white border-2 border-emerald-300 rounded-xl p-5 shadow-xs flex flex-col justify-between bg-emerald-50/30">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Estimated Monthly Profit
              </span>
              <DataTrustBadge status="AI Generated" compact />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-mono mt-2">
              {formatIndianCurrency(displayMonthlyProfit)}
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              Surplus remaining after all operational costs &amp; EMI
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-200/60 text-[11px] text-emerald-800 flex items-center justify-between font-semibold">
            <span>Rev: {formatIndianCurrency(displayRevenue)}</span>
            <span>Cost: {formatIndianCurrency(displayExpenses)}</span>
          </div>
        </div>
      </div>

      {/* FEASIBILITY VERDICT HERO SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Evaluation Engine Verdict
            </span>
            <h2 className="text-xl font-bold text-slate-800 mt-0.5">
              BUSINESS FEASIBILITY DECISION
            </h2>
            <div className={`mt-3 inline-flex items-center gap-3 px-5 py-2.5 ${currentCfg.bannerBg} text-white rounded-lg shadow-sm`}>
              {currentCfg.icon}
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-wide">
                  {currentCfg.label}
                </span>
                <span className="text-xs text-slate-200 ml-2 font-semibold block sm:inline">
                  {currentCfg.sub}
                </span>
              </div>
            </div>
          </div>

          {/* Two Major Evidence Gates */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto">
            {/* Gate 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-w-[170px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Gate 1: Market Evidence
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-teal-800">
                  {marketScore}%
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {twoGate?.gate1.passed !== false ? 'Sufficient' : 'Review'}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all"
                  style={{ width: `${marketScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Mandi rates &amp; buyer validation</p>
            </div>

            {/* Gate 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-w-[170px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Gate 2: Financial Solvency
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-800">
                  {financialScore}%
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {twoGate?.gate2.passed !== false ? 'Healthy' : 'Deficit'}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${financialScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Debt servicing &amp; cash surplus</p>
            </div>
          </div>
        </div>

        {/* Supporting Signals Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-b border-slate-200 text-sm">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-600 font-medium">Competition Level:</span>
            <span className="font-bold text-slate-900 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded text-xs border border-amber-300">
              {competition}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-600 font-medium">Demand Signal:</span>
            <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded text-xs border border-emerald-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {demandSignal} (Local Buyers)
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-600 font-medium">Evidence Level:</span>
            <span className="font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded text-xs border border-blue-300">
              {evidenceTier} (APMC + Ground Data)
            </span>
          </div>
        </div>

        {/* Why this decision? Section */}
        <div className="mt-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-700" />
              Why this decision?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic rule rationale based on your local market evidence and financial projections:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {reasonsList.slice(0, 3).map((r, i) => (
              <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Rationale Point {i + 1}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              id="dash-view-full-btn"
              type="button"
              onClick={() => onNavigate('analysis_dashboard')}
              className="w-full sm:w-auto px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-lg shadow-sm text-sm flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <span>View Full Market Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onNavigate('scenario_analysis')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 min-h-[40px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Stress Test Scenarios</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('final_report')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 min-h-[40px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-700" />
                <span>Feasibility Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Modules Quick Jump Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module 1: Market Intelligence */}
        <div
          onClick={() => onNavigate('analysis_dashboard')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-200">
              <BarChart3 className="w-5 h-5" />
            </div>
            <DataTrustBadge status="Verified" compact />
          </div>
          <h3 className="font-bold text-base text-slate-900 mt-3 group-hover:text-teal-800 transition-colors flex items-center justify-between">
            <span>Market Intelligence</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-transform group-hover:translate-x-0.5" />
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Local competitors ({competition}), benchmark rate (₹{hyperLocal.averagePrice}/{hyperLocal.priceUnit || 'unit'}), and buyer demand.
          </p>
        </div>

        {/* Module 2: Repayment & Financial Targets */}
        <div
          onClick={() => onNavigate('repayment_plan')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Daily Target Active
            </span>
          </div>
          <h3 className="font-bold text-base text-slate-900 mt-3 group-hover:text-teal-800 transition-colors flex items-center justify-between">
            <span>Repayment &amp; Cash Target</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-transform group-hover:translate-x-0.5" />
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Required daily sales target: {formatIndianCurrency(dailyRequiredRevenue)}/day, daily loan allocation: {formatIndianCurrency(dailyRequiredEMI)}/day.
          </p>
        </div>

        {/* Module 3: Contextual AI Advisor */}
        <div
          onClick={() => onNavigate('ai_advisor')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center border border-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <DataTrustBadge status="AI Generated" compact />
          </div>
          <h3 className="font-bold text-base text-slate-900 mt-3 group-hover:text-teal-800 transition-colors flex items-center justify-between">
            <span>Contextual AI Advisor</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-transform group-hover:translate-x-0.5" />
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Actionable guidance on risk mitigation, input supply contracts, and institutional loan readiness.
          </p>
        </div>
      </div>
    </div>
  );
};
