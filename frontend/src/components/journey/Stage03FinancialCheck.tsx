import React, { useState } from 'react';
import {
  IndianRupee,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  Percent,
  Activity,
  DollarSign,
  Scale,
} from 'lucide-react';
import {
  BasicInfoData,
  BusinessSetupData,
  FinancialFeasibilityResult,
  Language,
  Phase2CostData,
  SensitivityCases,
  TwoGateDecision,
} from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { formatIndianCurrency } from '../../utils/calculations';
import { PremiumButton } from '../common/PremiumButton';

interface Stage03FinancialCheckProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  feasibility: FinancialFeasibilityResult;
  twoGate: TwoGateDecision;
  sensitivity: SensitivityCases;
  costData: Phase2CostData;
  language: Language;
  onNext: () => void;
  onBack: () => void;
}

export const Stage03FinancialCheck: React.FC<Stage03FinancialCheckProps> = ({
  basicInfo,
  businessSetup,
  feasibility,
  twoGate,
  sensitivity,
  costData,
  language,
  onNext,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [showDetails, setShowDetails] = useState(false);

  // Map TwoGate to simple Status: FEASIBLE, MARGINAL, INFEASIBLE
  let statusBadge = {
    label: 'FEASIBLE',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Expected sales comfortably cover all operating expenses and loan repayment with positive monthly surplus.',
  };

  if (twoGate?.finalStatus === 'DO NOT PROCEED' || twoGate?.gate2?.status === 'FAILED') {
    statusBadge = {
      label: 'INFEASIBLE',
      color: 'bg-rose-100 text-rose-900 border-rose-300',
      description: 'Expected sales do not currently cover production costs and bank interest. Scale down capital or adjust pricing before borrowing.',
    };
  } else if (twoGate?.finalStatus === 'PILOT FIRST' || twoGate?.gate2?.status === 'MARGINAL' || twoGate?.gate2?.status === 'RESIZE REQUIRED') {
    statusBadge = {
      label: 'MARGINAL (TEST FIRST)',
      color: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Surplus is tight under stress. Recommend a small pilot trial or reducing starting machine size to protect your savings.',
    };
  }

  const dailyTarget = Math.round(feasibility.monthlyRevenue / 30);
  const promoterEquityPercent = feasibility.totalProjectCost > 0
    ? Math.round((feasibility.ownContribution / feasibility.totalProjectCost) * 100)
    : 15;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Step Header */}
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Step 03 of 06 • Financial Check
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700">
              <span>Total Cost: {formatIndianCurrency(feasibility.totalProjectCost)}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Let's check whether the numbers make sense.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Evaluating project costs, debt serviceability, break-even sales volume, and real monthly take-home surplus.
          </p>
        </div>

        {/* Primary Financial Status Banner */}
        <div className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${statusBadge.color}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70 border border-current">
                Financial Status
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {statusBadge.label}
              </h3>
            </div>
            <p className="text-xs leading-relaxed max-w-xl">
              {statusBadge.description}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] font-mono uppercase block text-slate-600">
              Expected Net Surplus
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {formatIndianCurrency(feasibility.monthlySurplus)}
              <span className="text-xs font-sans font-normal text-slate-600"> / mo</span>
            </span>
          </div>
        </div>

        {/* The 8 Core Numbers Required by Spec */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* 1. Project Cost */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
              1. Project Cost
            </span>
            <p className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {formatIndianCurrency(feasibility.totalProjectCost)}
            </p>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Machinery, stock &amp; setup
            </span>
          </div>

          {/* 2. Your Contribution */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
              2. Your Contribution
            </span>
            <p className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {formatIndianCurrency(feasibility.ownContribution)}
            </p>
            <span className="text-[10px] text-slate-500 block leading-tight">
              {promoterEquityPercent}% promoter equity
            </span>
          </div>

          {/* 3. Potential Financing */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-blue-800 font-bold block">
              3. Bank Financing
            </span>
            <p className="text-base sm:text-lg font-black text-blue-950 font-mono">
              {formatIndianCurrency(feasibility.potentialLoan)}
            </p>
            <span className="text-[10px] text-blue-800 block leading-tight">
              Priority Sector loan
            </span>
          </div>

          {/* 4. Estimated Repayment */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-blue-800 font-bold block">
              4. Monthly Repayment
            </span>
            <p className="text-base sm:text-lg font-black text-blue-950 font-mono">
              {formatIndianCurrency(feasibility.monthlyEMI)}
            </p>
            <span className="text-[10px] text-blue-800 block leading-tight">
              {feasibility.tenureMonths / 12} yrs @ {feasibility.interestRate}%
            </span>
          </div>

          {/* 5. Expected Sales */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">
              5. Expected Sales
            </span>
            <p className="text-base sm:text-lg font-black text-emerald-950 font-mono">
              {formatIndianCurrency(feasibility.monthlyRevenue)}
            </p>
            <span className="text-[10px] text-emerald-800 block leading-tight">
              Base revenue / month
            </span>
          </div>

          {/* 6. Regular Expenses */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
              6. Total Expenses
            </span>
            <p className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {formatIndianCurrency(feasibility.monthlyCosts)}
            </p>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Materials + overheads + EMI
            </span>
          </div>

          {/* 7. Expected Surplus */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block">
              7. Expected Surplus
            </span>
            <p className="text-base sm:text-lg font-black text-amber-950 font-mono">
              {formatIndianCurrency(feasibility.monthlySurplus)}
            </p>
            <span className="text-[10px] text-amber-800 block leading-tight">
              Net income in hand
            </span>
          </div>

          {/* 8. Break-Even Volume */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
              8. Break-Even Units
            </span>
            <p className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {feasibility.breakEvenUnitsPerMonth} units
            </p>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Sales needed to cover costs
            </span>
          </div>
        </div>

        {/* Collapsible Calculation Details */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-600" />
              <span>View calculation details &amp; stress test sensitivity</span>
            </span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="p-5 space-y-4 bg-white border-t border-slate-200 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">
                  Stress Test Scenarios (What happens if sales change?)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="text-[10px] text-emerald-800 uppercase font-sans font-bold">
                      Good (+20% Sales)
                    </span>
                    <p className="text-sm font-black text-emerald-950">
                      {formatIndianCurrency(sensitivity.good.monthlySurplus)} / mo
                    </p>
                    <span className="text-[10px] text-emerald-700 block font-sans">
                      Low stress, healthy reinvestment
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-600 uppercase font-sans font-bold">
                      Normal (Base Case)
                    </span>
                    <p className="text-sm font-black text-slate-900">
                      {formatIndianCurrency(sensitivity.normal.monthlySurplus)} / mo
                    </p>
                    <span className="text-[10px] text-slate-600 block font-sans">
                      Expected monthly baseline
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                    <span className="text-[10px] text-amber-800 uppercase font-sans font-bold">
                      Difficult (-25% Sales)
                    </span>
                    <p className="text-sm font-black text-amber-950">
                      {formatIndianCurrency(sensitivity.difficult.monthlySurplus)} / mo
                    </p>
                    <span className="text-[10px] text-amber-800 block font-sans">
                      {sensitivity.difficult.monthlySurplus >= 0 ? 'Remains solvent' : 'Requires cash buffer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Debt Service Coverage Ratio Note */}
              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800">
                  Two-Gate Solvency Evaluation Note:
                </span>
                <p>
                  Calculated Debt Service Coverage Ratio (DSCR): <strong>{twoGate.gate2.dscr}x</strong>. Banks require a minimum ratio of 1.25x so that loan payments can be met even during bad weather or seasonal dips.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Action Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
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
            See Financing Options
          </PremiumButton>
        </div>
      </div>
    </div>
  );
};
