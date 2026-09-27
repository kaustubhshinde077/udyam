import React from 'react';
import { FinancialFeasibilityResult, Language } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';
import {
  ArrowRight,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Receipt,
  Scale,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface Props {
  feasibility: FinancialFeasibilityResult;
  language: Language;
  onContinueToScenarios: () => void;
  onBack: () => void;
}

export const BusinessFeasibilityScreen: React.FC<Props> = ({
  feasibility,
  language,
  onContinueToScenarios,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];
  const isSurplusPositive = feasibility.monthlySurplus > 0;

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F284E] bg-blue-100 px-2.5 py-1 rounded">
              Part 3 • Screen 3: Monthly Sustainability
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F284E] mt-1">
              Can this business support its costs?
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              (हा व्यवसाय स्वतःचा खर्च भागवू शकेल का?)
            </p>
          </div>

          {/* Mandatory Clear Assumption Note */}
          <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-950 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Transparent Working Assumption:</p>
              <p className="mt-0.5 leading-relaxed">
                &quot;Based on the information you provided and available local data.&quot;
              </p>
            </div>
          </div>

          {/* 4 LARGE RESULT CARDS */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Card 1: Expected Sales */}
            <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  Monthly Inflow
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-2">
                  Expected Sales (अपेक्षित मासिक विक्री)
                </h2>
                <p className="text-3xl font-black text-slate-900 font-mono mt-3">
                  {formatIndianCurrency(feasibility.monthlyRevenue)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Estimated revenue per month based on your stated unit price and customers.
                </p>
              </div>
            </div>

            {/* Card 2: Expected Costs */}
            <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                  Monthly Outflow
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-2">
                  Expected Costs (अपेक्षित मासिक खर्च)
                </h2>
                <p className="text-3xl font-black text-rose-700 font-mono mt-3">
                  {formatIndianCurrency(feasibility.monthlyCosts)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Raw material restocking, electricity/stall rent, and loan installment allowance.
                </p>
              </div>
            </div>

            {/* Card 3: Expected Surplus (Money left after business costs) */}
            <div
              className={`border-2 rounded-xl p-5 shadow-xs flex flex-col justify-between sm:col-span-2 ${
                isSurplusPositive
                  ? 'bg-emerald-50/70 border-emerald-500'
                  : 'bg-rose-50 border-rose-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
                      isSurplusPositive
                        ? 'bg-emerald-200 text-emerald-950 border-emerald-400'
                        : 'bg-rose-200 text-rose-950 border-rose-400'
                    }`}
                  >
                    Key Assessment Result
                  </span>
                  <span className="text-xs text-slate-500 italic">
                    (Technical term: {t.operatingProfitSub})
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-2">
                  {t.moneyLeftAfterCosts} (हातात उरणारी रक्कम)
                </h2>

                <p
                  className={`text-4xl sm:text-5xl font-black font-mono mt-2 ${
                    isSurplusPositive ? 'text-emerald-900' : 'text-rose-700'
                  }`}
                >
                  {formatIndianCurrency(feasibility.monthlySurplus)} / month
                </p>

                <p className="text-xs sm:text-sm text-slate-700 mt-2">
                  {isSurplusPositive
                    ? 'This is the clear surplus left each month for your family expenses and savings after paying all shop costs and debt obligations.'
                    : 'Warning: Costs exceed expected sales. You will need to either increase unit volume or lower starting costs.'}
                </p>
              </div>
            </div>

            {/* Card 4: Break-Even */}
            <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs sm:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-[#0F284E]" />
                <h2 className="text-base font-bold text-slate-900">
                  Break-even (खर्च-नफा समान बिंदू)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mt-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 block">
                    Minimum Monthly Sales Volume Needed:
                  </span>
                  <p className="text-lg font-extrabold text-[#0F284E] font-mono mt-0.5">
                    {feasibility.breakEvenUnitsPerMonth} units / visits
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Selling at least this quantity ensures you don&apos;t face a loss.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 block">
                    Estimated Time to Recover Investment:
                  </span>
                  <p className="text-lg font-extrabold text-emerald-800 font-mono mt-0.5">
                    Approx. {feasibility.breakEvenMonths} Months
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assuming steady sales and regular monthly reinvestment.
                  </p>
                </div>
              </div>
            </div>
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
            id="continue-to-scenarios-btn"
            type="button"
            onClick={onContinueToScenarios}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-lg shadow-sm min-h-[50px] flex items-center justify-center gap-3 transition-colors"
          >
            <span>What if conditions change? (Screen 4)</span>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
