import React from 'react';
import { SensitivityAnalysisResult, Language } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';
import { DataTrustBadge } from '../common/DataTrustBadge';
import {
  ArrowRight,
  ArrowLeft,
  Sun,
  Cloud,
  CloudRain,
  AlertCircle,
  TrendingUp,
  Percent,
  Scale,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  sensitivity: SensitivityAnalysisResult;
  language: Language;
  onContinueToRisks: () => void;
  onBack: () => void;
  isDairyDemo?: boolean;
}

export const ScenarioAnalysisScreen: React.FC<Props> = ({
  sensitivity,
  language,
  onContinueToRisks,
  onBack,
  isDairyDemo = true,
}) => {
  const t = UI_TRANSLATIONS[language];

  // Derive rich comparative metrics dynamically from the 3 scenarios
  // Best Case (+20% revenue)
  const bestRev = sensitivity.good.monthlyRevenue;
  const bestExp = sensitivity.good.monthlyCosts;
  const bestProfit = sensitivity.good.monthlySurplus;
  const bestMargin = bestRev > 0 ? Math.round((bestProfit / bestRev) * 100) : 0;
  const bestBreakEven = `${Math.round((bestExp / (bestRev || 1)) * 100)}% of capacity`;
  const bestSurplus = bestProfit;

  // Base Case (Expected model)
  const baseRev = sensitivity.normal.monthlyRevenue;
  const baseExp = sensitivity.normal.monthlyCosts;
  const baseProfit = sensitivity.normal.monthlySurplus;
  const baseMargin = baseRev > 0 ? Math.round((baseProfit / baseRev) * 100) : 0;
  const baseBreakEven = `${Math.round((baseExp / (baseRev || 1)) * 100)}% of capacity`;
  const baseSurplus = baseProfit;

  // Worst Case (-20% to -25% revenue shock)
  const worstRev = sensitivity.difficult.monthlyRevenue;
  const worstExp = sensitivity.difficult.monthlyCosts;
  const worstProfit = sensitivity.difficult.monthlySurplus;
  const worstMargin = worstRev > 0 ? Math.round((worstProfit / worstRev) * 100) : 0;
  const worstBreakEven = `${Math.round((worstExp / (worstRev || 1)) * 100)}% of capacity`;
  const worstSurplus = worstProfit;

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  Scenario &amp; Stress Testing
                </span>
                <DataTrustBadge status="Demo Data" compact />
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Scenario Analysis: What if conditions change?
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Understand how demand drop, fodder cost inflation, or peak sales impact your loan servicing capability.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded border border-slate-200 self-start sm:self-auto">
              3 Rigorous Stress Cases
            </span>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-950 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Deterministic sensitivity engine: tests solvency under demand shock (-20%) and raw material price spikes (+12%).
            </span>
          </div>

          {/* THREE CLEAR CARDS: BEST CASE, BASE CASE, WORST CASE */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: BEST CASE */}
            <div className="bg-emerald-50/40 border-2 border-emerald-400 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-3">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-base">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span>BEST CASE (उत्कृष्ट स्थिती)</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">
                    +20% Demand
                  </span>
                </div>
                <p className="text-xs text-emerald-800 font-semibold mb-3">
                  Peak festival season &amp; high local consumer retail.
                </p>

                {/* 7 Compared Metrics */}
                <div className="space-y-2 text-xs divide-y divide-emerald-100">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Monthly Revenue:</span>
                    <span className="font-bold font-mono text-slate-900">{formatIndianCurrency(bestRev)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Monthly Expenses:</span>
                    <span className="font-bold font-mono text-slate-900">{formatIndianCurrency(bestExp)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold text-emerald-950">Monthly Profit:</span>
                    <span className="font-extrabold font-mono text-emerald-800 text-sm">{formatIndianCurrency(bestProfit)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Profit Margin:</span>
                    <span className="font-bold text-emerald-700">{bestMargin}%</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Break-even Output:</span>
                    <span className="font-bold text-slate-800">{bestBreakEven}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Cash Surplus:</span>
                    <span className="font-bold text-emerald-800">{formatIndianCurrency(bestSurplus)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Peak operations yielding {formatIndianCurrency(bestSurplus)} monthly surplus.</span>
              </div>
            </div>

            {/* Card 2: BASE CASE */}
            <div className="bg-blue-50/40 border-2 border-blue-600 rounded-xl p-5 shadow-xs flex flex-col justify-between relative ring-2 ring-blue-200">
              <div>
                <div className="flex items-center justify-between border-b border-blue-200 pb-2 mb-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                    <Cloud className="w-5 h-5 text-blue-700" />
                    <span>BASE CASE (प्रमाणभूत स्थिती)</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-blue-900 text-white px-2 py-0.5 rounded">
                    Baseline
                  </span>
                </div>
                <p className="text-xs text-blue-950 font-semibold mb-3">
                  Baseline operating model under expected demand.
                </p>

                {/* 6 Compared Metrics */}
                <div className="space-y-2 text-xs divide-y divide-blue-100">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Monthly Revenue:</span>
                    <span className="font-bold font-mono text-slate-900">{formatIndianCurrency(baseRev)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Monthly Expenses:</span>
                    <span className="font-bold font-mono text-slate-900">{formatIndianCurrency(baseExp)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold text-blue-950">Monthly Profit:</span>
                    <span className="font-black font-mono text-blue-900 text-sm">{formatIndianCurrency(baseProfit)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Profit Margin:</span>
                    <span className="font-bold text-blue-800">{baseMargin}%</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Break-even Output:</span>
                    <span className="font-bold text-slate-800">{baseBreakEven}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Cash Surplus:</span>
                    <span className="font-bold text-blue-900">{formatIndianCurrency(baseSurplus)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-200 text-[11px] text-blue-900 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>Generates {formatIndianCurrency(baseSurplus)} monthly surplus after all operating expenses.</span>
              </div>
            </div>

            {/* Card 3: WORST CASE */}
            <div className="bg-rose-50/40 border-2 border-rose-300 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-rose-200 pb-2 mb-3">
                  <div className="flex items-center gap-2 text-rose-950 font-bold text-base">
                    <CloudRain className="w-5 h-5 text-rose-700" />
                    <span>WORST CASE (कठीण काळ)</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-rose-700 text-white px-2 py-0.5 rounded">
                    -20% Drop
                  </span>
                </div>
                <p className="text-xs text-rose-950 font-semibold mb-3">
                  Difficult market scenario (-25% demand shock or price drop).
                </p>

                {/* 6 Compared Metrics */}
                <div className="space-y-2 text-xs divide-y divide-rose-100">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Monthly Revenue:</span>
                    <span className="font-bold font-mono text-slate-900">{formatIndianCurrency(worstRev)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Monthly Expenses:</span>
                    <span className="font-bold font-mono text-slate-900">{formatIndianCurrency(worstExp)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold text-rose-950">Monthly Profit:</span>
                    <span className="font-extrabold font-mono text-rose-800 text-sm">{formatIndianCurrency(worstProfit)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Profit Margin:</span>
                    <span className="font-bold text-rose-800">{worstMargin}%</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Break-even Output:</span>
                    <span className="font-bold text-slate-800">{worstBreakEven}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Cash Surplus:</span>
                    <span className="font-bold text-rose-800">{formatIndianCurrency(worstSurplus)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200 text-[11px] text-rose-900 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                <span>
                  {worstSurplus >= 0
                    ? `Surplus remains positive (${formatIndianCurrency(worstSurplus)}/month) under stress.`
                    : `Shows monthly deficit (${formatIndianCurrency(worstSurplus)}/month); pilot first recommended.`}
                </span>
              </div>
            </div>
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

          <button
            id="continue-to-risks-btn"
            type="button"
            onClick={onContinueToRisks}
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm min-h-[40px] flex items-center justify-center gap-2 transition-colors"
          >
            <span>Proceed to Risk &amp; Feasibility Decision</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
