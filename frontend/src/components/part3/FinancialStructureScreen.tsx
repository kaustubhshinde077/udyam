import React, { useState } from 'react';
import { FinancialFeasibilityResult, Language } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Equal,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  feasibility: FinancialFeasibilityResult;
  language: Language;
  onContinueToFeasibility: () => void;
  onBack: () => void;
}

export const FinancialStructureScreen: React.FC<Props> = ({
  feasibility,
  language,
  onContinueToFeasibility,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [showCalculation, setShowCalculation] = useState<boolean>(false);

  const ownPercent =
    feasibility.totalProjectCost > 0
      ? Math.round((feasibility.ownContribution / feasibility.totalProjectCost) * 100)
      : 0;
  const loanPercent = Math.max(0, 100 - ownPercent);

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F284E] bg-blue-100 px-2.5 py-1 rounded">
              Part 3 • Screen 2: Capital Structure
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F284E] mt-1">
              Financial Structure
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              (भांडवली रचना: स्वतःचे पैसे + संभाव्य बँक कर्ज = एकूण प्रकल्प खर्च)
            </p>
          </div>

          {/* CLEAR VISUAL EQUATION: Your Money + Potential Support = Project Cost */}
          <div className="mt-8 bg-slate-50 border-2 border-slate-300 rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 text-center">
              {/* Box 1: Your Money */}
              <div className="md:col-span-2 bg-white p-5 rounded-xl border-2 border-emerald-500 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                  Your Money (स्वतःचे पैसे)
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-mono mt-3">
                  {formatIndianCurrency(feasibility.ownContribution)}
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Own Contribution ({ownPercent}%)
                </p>
              </div>

              {/* Plus Sign */}
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold text-xl shadow-inner">
                  <Plus className="w-6 h-6" />
                </div>
              </div>

              {/* Box 2: Potential Financial Support */}
              <div className="md:col-span-2 bg-white p-5 rounded-xl border-2 border-blue-500 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-1 rounded">
                  Potential Financial Support
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-[#0F284E] font-mono mt-3">
                  {formatIndianCurrency(feasibility.potentialLoan)}
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Potential Loan / Scheme ({loanPercent}%)
                </p>
              </div>
            </div>

            {/* Equals Bar */}
            <div className="my-5 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-sm">
                <Equal className="w-6 h-6" />
              </div>
            </div>

            {/* Result Box: Total Project Cost */}
            <div className="bg-[#0F284E] text-white p-6 rounded-xl text-center border-2 border-amber-400 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Business Project Cost (एकूण व्यवसाय खर्च)
              </span>
              <p className="text-3xl sm:text-4xl font-black text-white font-mono mt-2">
                {formatIndianCurrency(feasibility.totalProjectCost)}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Required to acquire all setup tools, machinery, and initial stock.
              </p>
            </div>
          </div>

          {/* Expandable "See calculation" section */}
          <div className="mt-6 border-2 border-slate-300 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setShowCalculation(!showCalculation)}
              className="w-full px-5 py-4 flex items-center justify-between text-sm font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0F284E]" />
                <span>See Calculation Details (हिशोब पहा)</span>
              </span>
              {showCalculation ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {showCalculation && (
              <div className="p-5 space-y-3 text-xs sm:text-sm bg-white border-t border-slate-200">
                <p className="text-slate-700">
                  How this financial structure was computed without complicated jargon:
                </p>
                <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono">
                  <div className="flex justify-between">
                    <span>Total Setup Requirements:</span>
                    <span>{formatIndianCurrency(feasibility.totalProjectCost)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800">
                    <span>(-) Minus Your Declared Savings:</span>
                    <span>{formatIndianCurrency(feasibility.ownContribution)}</span>
                  </div>
                  <div className="flex justify-between text-blue-900 border-t border-slate-300 pt-1 font-bold">
                    <span>(=) Remaining Needed as Loan / Scheme Support:</span>
                    <span>{formatIndianCurrency(feasibility.potentialLoan)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Prototype financing rules based on problem-statement parameters (PS 26091)
                  where micro-enterprises contribute 10% or more promoter equity with up to 90% institutional credit.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3.5 text-slate-800 font-bold text-base rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-100 min-h-[48px] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <button
            id="continue-to-feasibility-btn"
            type="button"
            onClick={onContinueToFeasibility}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-lg shadow-sm min-h-[50px] flex items-center justify-center gap-3 transition-colors"
          >
            <span>Check Feasibility &amp; Monthly Surplus (Screen 3)</span>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
