import React, { useState } from 'react';
import {
  Calendar,
  CalendarDays,
  Sun,
  IndianRupee,
  TrendingUp,
  Download,
  Printer,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Target,
  FileText,
  Sliders,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import {
  BasicInfoData,
  BusinessSetupData,
  FinancialFeasibilityResult,
  Language,
} from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { formatIndianCurrency } from '../../utils/calculations';
import { PremiumButton } from '../common/PremiumButton';

interface Stage05YourPlanProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  feasibility: FinancialFeasibilityResult;
  language: Language;
  onNext: () => void;
  onBack: () => void;
}

export const Stage05YourPlan: React.FC<Stage05YourPlanProps> = ({
  basicInfo,
  businessSetup,
  feasibility,
  language,
  onNext,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'scenarios'>('daily');
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'expected' | 'optimistic'>('expected');
  const [salesMultiplier, setSalesMultiplier] = useState<number>(1.0);
  const [costMultiplier, setCostMultiplier] = useState<number>(1.0);

  const isFarmer = businessSetup?.entityType === 'farmer';
  const activityTitle = isFarmer
    ? `${businessSetup?.farmerData?.cropName || 'Crop'} Farming`
    : businessSetup?.subActivity || businessSetup?.businessCategory || 'Micro-Enterprise';

  // Scenario Multiplier adjustment
  const scenarioMultiplier = activeScenario === 'conservative' ? 0.85 : activeScenario === 'optimistic' ? 1.15 : 1.0;
  const effectiveSalesMult = salesMultiplier * scenarioMultiplier;
  const effectiveCostMult = activeScenario === 'conservative' ? costMultiplier * 1.08 : costMultiplier;

  // Dynamically adjusted figures
  const adjustedMonthlyRevenue = Math.round(feasibility.monthlyRevenue * effectiveSalesMult);
  const adjustedMonthlyOperatingCosts = Math.round((feasibility.monthlyCosts - feasibility.monthlyEMI) * effectiveCostMult);
  const monthlyRepayment = feasibility.monthlyEMI;
  const adjustedMonthlySurplus = adjustedMonthlyRevenue - adjustedMonthlyOperatingCosts - monthlyRepayment;

  // Derived Daily & Weekly Figures
  const dailySalesTarget = Math.round(adjustedMonthlyRevenue / 30);
  const dailyExpenseLimit = Math.round(adjustedMonthlyOperatingCosts / 30);
  const dailyEMIEscrow = Math.round(monthlyRepayment / 30);
  const dailyNetSurplus = dailySalesTarget - dailyExpenseLimit - dailyEMIEscrow;

  const weeklySalesTarget = dailySalesTarget * 7;
  const weeklyExpenseLimit = dailyExpenseLimit * 7;
  const weeklyEMIEscrow = dailyEMIEscrow * 7;
  const weeklyNetSurplus = dailyNetSurplus * 7;

  // Yearly Schedule (Years 1 to 7)
  const maxYears = feasibility.selectedScheme === 'micro' ? 3 : 7;
  const yearlySchedule = Array.from({ length: maxYears }, (_, i) => {
    const yearNum = i + 1;
    const growthMult = 1 + i * 0.05;
    const yearRevenue = Math.round(adjustedMonthlyRevenue * 12 * growthMult);
    const yearOperatingCosts = Math.round(adjustedMonthlyOperatingCosts * 12 * (1 + i * 0.03));
    const yearLoanRepayment = monthlyRepayment * 12;
    const yearNetSurplus = yearRevenue - yearOperatingCosts - yearLoanRepayment;
    const cumulativeBalance = yearNetSurplus * yearNum;

    return {
      year: yearNum,
      revenue: yearRevenue,
      expenses: yearOperatingCosts,
      profit: yearRevenue - yearOperatingCosts,
      repayment: yearLoanRepayment,
      surplus: yearNetSurplus,
      closingBalance: cumulativeBalance,
    };
  });

  // Monthly Breakdown (Months 1 to 12)
  const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const ramp = monthNum <= 2 ? 0.85 : monthNum <= 4 ? 0.95 : 1.0;
    const sales = Math.round(adjustedMonthlyRevenue * ramp);
    const operatingExp = Math.round(adjustedMonthlyOperatingCosts * (ramp > 0.9 ? 1 : 0.9));
    const surplus = sales - operatingExp - monthlyRepayment;

    return {
      month: `Month ${monthNum}`,
      sales,
      expenses: operatingExp,
      profit: sales - operatingExp,
      payment: monthlyRepayment,
      cashSurplus: surplus,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Step Header */}
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              Step 06 of 07 • Your Plan
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer print:hidden"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Plan Dossier</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Build your operational and financial plan.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            A concrete cash flow roadmap for <strong className="text-slate-900">{activityTitle}</strong> in {basicInfo.village || 'your village'}, ensuring bank loan repayments are comfortably protected.
          </p>
        </div>

        {/* Financial Construction Flow Visual Ribbon */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-amber-400">
              Financial Construction Flow
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              BALANCED MODEL
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <span className="text-[9px] text-slate-400 block">Total Cost</span>
              <strong className="text-slate-200">{formatIndianCurrency(feasibility.totalProjectCost)}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <span className="text-[9px] text-slate-400 block">Own Margin</span>
              <strong className="text-amber-300">{formatIndianCurrency(feasibility.ownContribution)}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <span className="text-[9px] text-slate-400 block">Bank Loan</span>
              <strong className="text-blue-300">{formatIndianCurrency(feasibility.potentialLoan)}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <span className="text-[9px] text-slate-400 block">Revenue/mo</span>
              <strong className="text-slate-200">{formatIndianCurrency(adjustedMonthlyRevenue)}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <span className="text-[9px] text-slate-400 block">Costs/mo</span>
              <strong className="text-rose-300">{formatIndianCurrency(adjustedMonthlyOperatingCosts)}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <span className="text-[9px] text-slate-400 block">Profit/mo</span>
              <strong className="text-slate-200">{formatIndianCurrency(adjustedMonthlyRevenue - adjustedMonthlyOperatingCosts)}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <span className="text-[9px] text-slate-400 block">EMI/mo</span>
              <strong className="text-blue-300">{formatIndianCurrency(monthlyRepayment)}</strong>
            </div>
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500">
              <span className="text-[9px] text-emerald-300 block">Net Surplus</span>
              <strong className="text-emerald-400">{formatIndianCurrency(adjustedMonthlySurplus)}</strong>
            </div>
          </div>
        </div>

        {/* 3 Executive High-Impact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block">
              Daily Target
            </span>
            <p className="text-xl sm:text-2xl font-black text-amber-950 font-mono">
              {formatIndianCurrency(dailySalesTarget)}
              <span className="text-xs font-sans font-normal text-amber-800"> / day</span>
            </p>
            <span className="text-[11px] text-amber-800 block">
              Daily operational sales milestone
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">
              Monthly Net Surplus
            </span>
            <p className="text-xl sm:text-2xl font-black text-emerald-950 font-mono">
              {formatIndianCurrency(adjustedMonthlySurplus)}
              <span className="text-xs font-sans font-normal text-emerald-800"> / month</span>
            </p>
            <span className="text-[11px] text-emerald-800 block">
              Net profit in hand after all costs &amp; EMI
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
            <span className="text-[10px] font-mono uppercase text-blue-800 font-bold block">
              Monthly Bank Repayment
            </span>
            <p className="text-xl sm:text-2xl font-black text-blue-950 font-mono">
              {formatIndianCurrency(monthlyRepayment)}
              <span className="text-xs font-sans font-normal text-blue-800"> / mo</span>
            </p>
            <span className="text-[11px] text-blue-800 block">
              Protected debt service obligation
            </span>
          </div>
        </div>

        {/* Tab Navigation: DAILY, WEEKLY, MONTHLY, YEARLY, SCENARIOS */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('daily')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>DAILY PLAN</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('weekly')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'weekly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>WEEKLY PLAN</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('monthly')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'monthly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>MONTHLY PLAN</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('yearly')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'yearly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>YEARLY SCHEDULE</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('scenarios')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'scenarios'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>SCENARIO ANALYSIS</span>
            </button>
          </div>

          {/* TAB 1: DAILY PLAN */}
          {activeTab === 'daily' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
                <Target className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">
                    Daily Financial Discipline: The "Rule of 3 Pockets"
                  </span>
                  <p className="text-amber-900 leading-relaxed">
                    To never default on a bank loan, separate every day's sales into three envelopes: (1) Daily operating supplies, (2) Loan repayment escrow, and (3) Family living surplus.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Envelope 1: Daily Supplies Limit
                  </span>
                  <p className="text-xl font-black text-slate-900 font-mono">
                    {formatIndianCurrency(dailyExpenseLimit)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Maximum allowed daily expense on raw inputs, diesel, and packaging.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-900 block">
                    Envelope 2: Daily Loan Escrow
                  </span>
                  <p className="text-xl font-black text-blue-950 font-mono">
                    {formatIndianCurrency(dailyEMIEscrow)}
                  </p>
                  <p className="text-[11px] text-blue-800">
                    Set aside every evening into your loan savings bank account.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-900 block">
                    Envelope 3: Daily Family Surplus
                  </span>
                  <p className="text-xl font-black text-emerald-950 font-mono">
                    {formatIndianCurrency(dailyNetSurplus)}
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    Your pure take-home reward for your daily hard work.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEEKLY PLAN */}
          {activeTab === 'weekly' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Weekly operational milestones help you monitor performance without daily stress.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">Weekly Sales Target</span>
                  <strong className="text-lg font-black text-slate-900 font-mono">
                    {formatIndianCurrency(weeklySalesTarget)}
                  </strong>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">Weekly Expense Budget</span>
                  <strong className="text-lg font-black text-slate-900 font-mono">
                    {formatIndianCurrency(weeklyExpenseLimit)}
                  </strong>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                  <span className="text-[10px] text-blue-800 font-mono block">Weekly EMI Reserve</span>
                  <strong className="text-lg font-black text-blue-950 font-mono">
                    {formatIndianCurrency(weeklyEMIEscrow)}
                  </strong>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] text-emerald-800 font-mono block">Weekly Net Surplus</span>
                  <strong className="text-lg font-black text-emerald-950 font-mono">
                    {formatIndianCurrency(weeklyNetSurplus)}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MONTHLY BREAKDOWN */}
          {activeTab === 'monthly' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                12-month projection showing ramp-up period (Months 1–3) and stabilized surplus.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Month</th>
                      <th className="px-4 py-3">Sales</th>
                      <th className="px-4 py-3">Operating Exp</th>
                      <th className="px-4 py-3">Gross Profit</th>
                      <th className="px-4 py-3">Bank EMI</th>
                      <th className="px-4 py-3 text-emerald-300">Net Cash Surplus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {monthlyBreakdown.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-bold text-slate-800">{m.month}</td>
                        <td className="px-4 py-2.5 text-slate-900">{formatIndianCurrency(m.sales)}</td>
                        <td className="px-4 py-2.5 text-slate-600">{formatIndianCurrency(m.expenses)}</td>
                        <td className="px-4 py-2.5 text-slate-900">{formatIndianCurrency(m.profit)}</td>
                        <td className="px-4 py-2.5 text-blue-700">{formatIndianCurrency(m.payment)}</td>
                        <td className="px-4 py-2.5 font-bold text-emerald-700">{formatIndianCurrency(m.cashSurplus)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: YEARLY SCHEDULE */}
          {activeTab === 'yearly' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Long-term {maxYears}-year debt amortization and accumulated wealth projection.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-white uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Year</th>
                      <th className="px-4 py-3">Revenue</th>
                      <th className="px-4 py-3">Operating Expenses</th>
                      <th className="px-4 py-3">Bank Repayment</th>
                      <th className="px-4 py-3 text-amber-300">Annual Surplus</th>
                      <th className="px-4 py-3 text-emerald-300">Closing Reserve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {yearlySchedule.map((y) => (
                      <tr key={y.year} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-bold text-slate-800">Year {y.year}</td>
                        <td className="px-4 py-2.5 text-slate-900">{formatIndianCurrency(y.revenue)}</td>
                        <td className="px-4 py-2.5 text-slate-600">{formatIndianCurrency(y.expenses)}</td>
                        <td className="px-4 py-2.5 text-blue-700">{formatIndianCurrency(y.repayment)}</td>
                        <td className="px-4 py-2.5 font-bold text-amber-700">{formatIndianCurrency(y.surplus)}</td>
                        <td className="px-4 py-2.5 font-bold text-emerald-700">{formatIndianCurrency(y.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SCENARIO ANALYSIS */}
          {activeTab === 'scenarios' && (
            <div className="space-y-5 p-5 rounded-2xl bg-purple-50/50 border border-purple-200 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-purple-950 text-sm block">
                    Stress-Testing &amp; Scenario Simulator
                  </span>
                  <p className="text-purple-800 text-[11px]">
                    See how your monthly surplus and debt payment behave under difficult conditions.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-purple-200">
                  <button
                    type="button"
                    onClick={() => setActiveScenario('conservative')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                      activeScenario === 'conservative'
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'text-slate-600'
                    }`}
                  >
                    Conservative (-15%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScenario('expected')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                      activeScenario === 'expected'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Expected (Normal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScenario('optimistic')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                      activeScenario === 'optimistic'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'text-slate-600'
                    }`}
                  >
                    Optimistic (+15%)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-purple-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">Sales in Scenario</span>
                  <strong className="text-lg font-black text-slate-900 font-mono">
                    {formatIndianCurrency(adjustedMonthlyRevenue)}
                  </strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-purple-200 space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">Operating Costs</span>
                  <strong className="text-lg font-black text-slate-900 font-mono">
                    {formatIndianCurrency(adjustedMonthlyOperatingCosts)}
                  </strong>
                </div>
                <div className="p-4 rounded-xl bg-white border border-purple-200 space-y-1">
                  <span className="text-[10px] text-emerald-800 font-mono block">Monthly Surplus in Scenario</span>
                  <strong className={`text-lg font-black font-mono ${adjustedMonthlySurplus > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {formatIndianCurrency(adjustedMonthlySurplus)}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Action Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 print:hidden">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Financing</span>
          </button>

          <PremiumButton
            type="button"
            onClick={onNext}
            variant="gold"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Start Tracking &amp; Daily Advisor
          </PremiumButton>
        </div>
      </div>
    </div>
  );
};
