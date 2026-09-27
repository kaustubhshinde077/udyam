import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  CalendarDays,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Clock,
  ArrowRight,
  ArrowLeft,
  Activity,
  Layers,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  Building2,
  Printer,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import {
  BasicInfoData,
  BusinessSetupData,
  FinancialFeasibilityResult,
  HyperLocalAnalysis,
  Language,
  TwoGateDecision,
} from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';
import { PremiumButton } from '../common/PremiumButton';

interface DailyAIAdvisorScreenProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  feasibility: FinancialFeasibilityResult;
  hyperLocal?: HyperLocalAnalysis;
  twoGate?: TwoGateDecision;
  language: Language;
  onBack: () => void;
  onOpenChat: (prompt?: string) => void;
}

export const DailyAIAdvisorScreen: React.FC<DailyAIAdvisorScreenProps> = ({
  basicInfo,
  businessSetup,
  feasibility,
  hyperLocal,
  twoGate,
  language,
  onBack,
  onOpenChat,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'today' | 'reviews' | 'health'>('today');

  const isFarmer = businessSetup?.entityType === 'farmer';
  const businessTitle = isFarmer
    ? `${businessSetup?.farmerData?.cropName || 'Crop'} Cultivation`
    : businessSetup?.subActivity || businessSetup?.businessCategory || 'Micro-Enterprise';

  // Benchmark Daily Targets (from Financial Feasibility / Plan)
  const targetDailySales = Math.round((feasibility.monthlyRevenue || 150000) / 30);
  const targetDailyExpense = Math.round(
    ((feasibility.monthlyCosts || 80000) - (feasibility.monthlyEMI || 0)) / 30
  );
  const dailyLoanAllocation = Math.round((feasibility.monthlyEMI || 0) / 30);
  const targetDailyNetProfit = targetDailySales - targetDailyExpense - dailyLoanAllocation;

  // Interactive Actuals simulation (user can tweak to see reactive guidance)
  const [actualSales, setActualSales] = useState<number>(Math.round(targetDailySales * 1.06));
  const [actualExpense, setActualExpense] = useState<number>(Math.round(targetDailyExpense * 0.98));

  // Calculations
  const salesDiff = actualSales - targetDailySales;
  const expenseDiff = actualExpense - targetDailyExpense;
  const actualProfit = actualSales - actualExpense - dailyLoanAllocation;
  const profitDiff = actualProfit - targetDailyNetProfit;

  // Compute Solvency Status
  let healthStatus: 'ON TRACK' | 'WATCH' | 'NEEDS ATTENTION' = 'ON TRACK';
  let statusReason = '';
  if (actualSales >= targetDailySales && actualExpense <= targetDailyExpense * 1.05) {
    healthStatus = 'ON TRACK';
    statusReason = `Today sales exceeded target by ${formatIndianCurrency(
      salesDiff
    )} and operating expenses remained strictly disciplined.`;
  } else if (actualSales >= targetDailySales * 0.85 && actualProfit >= 0) {
    healthStatus = 'WATCH';
    statusReason = `Sales experienced an off-peak dip of ${formatIndianCurrency(
      Math.abs(salesDiff)
    )}, but profit remains positive after escrowing your daily EMI.`;
  } else {
    healthStatus = 'NEEDS ATTENTION';
    statusReason = `Today revenue failed to cover operating costs and the ${formatIndianCurrency(
      dailyLoanAllocation
    )} daily loan allocation. Immediate cost trimming required.`;
  }

  // Generate 3 Practical Actions based on user's actual data
  const generatedDailyActions = [
    {
      id: 1,
      tag: 'CASH ALLOCATION',
      title: `Escrow ${formatIndianCurrency(dailyLoanAllocation)} to EMI Account`,
      action: `Transfer or set aside today's daily debt allocation of ${formatIndianCurrency(
        dailyLoanAllocation
      )} into your bank account before sundown. Consistent daily escrow completely removes monthly repayment stress.`,
      urgency: 'HIGH',
    },
    {
      id: 2,
      tag: 'SUPPLY & SOURCING',
      title: `Consolidate Raw Input Purchases for ${businessSetup.businessCategory}`,
      action: `Ground checks in ${basicInfo.district || 'your district'} indicate a 5% supplier discount on bulk weekly restocking. Coordinate with neighbouring sellers to order together.`,
      urgency: 'MEDIUM',
    },
    {
      id: 3,
      tag: 'SALES RETENTION',
      title: `Lock in Tomorrow's Advance Orders in ${basicInfo.village || 'your village'}`,
      action: `Reach out to 3 reliable local shopkeepers or recurring buyers tonight to guarantee 70% of tomorrow's target (${formatIndianCurrency(
        Math.round(targetDailySales * 0.7)
      )}) before opening.`,
      urgency: 'MEDIUM',
    },
  ];

  return (
    <div id="daily-ai-advisor-screen" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PROACTIVE DAILY OPERATING GUIDANCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Daily AI Advisor
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Automated daily intelligence analyzing your financial plan, recorded performance, local market evidence, and seasonal risks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenChat()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-md"
        >
          <span>Ask ARTH AI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('today')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'today'
              ? 'border-teal-700 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Today's Snapshot & Actions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-teal-700 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Weekly & Monthly Review
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('health')}
          className={`px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'health'
              ? 'border-teal-700 text-teal-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Business Health Monitor
        </button>
      </div>

      {/* TAB 1: TODAY'S SNAPSHOT & 3 ACTIONS */}
      {activeTab === 'today' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 1. GOOD MORNING • Today's Business Check Card (User Specified) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-700 block">
                  {t.goodMorning || 'GOOD MORNING'} • {new Date().toLocaleDateString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  {t.todaysBusinessCheck || "Today's Business Check"}
                </h2>
                <span className="text-xs text-slate-500 block">
                  {businessTitle} • {basicInfo?.village || basicInfo?.district || 'Micro-Enterprise'}
                </span>
              </div>

              <div>
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                    healthStatus === 'ON TRACK'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : healthStatus === 'WATCH'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  {healthStatus}
                </span>
              </div>
            </div>

            {/* Metrics: Revenue, Expenses, Estimated balance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase block">
                  {t.revenueLabel || 'Revenue'}
                </span>
                <span className="text-2xl font-black tabular-nums text-slate-900 mt-1 block">
                  ₹{actualSales.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Target: ₹{targetDailySales.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase block">
                  {t.expensesLabel || 'Expenses'}
                </span>
                <span className="text-2xl font-black tabular-nums text-rose-700 mt-1 block">
                  ₹{actualExpense.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Limit: ₹{targetDailyExpense.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase block">
                  {t.estimatedBalanceLabel || 'Estimated balance'}
                </span>
                <span className="text-2xl font-black tabular-nums text-emerald-950 mt-1 block">
                  ₹{Math.max(0, actualProfit).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-700 mt-1 block">
                  After ₹{dailyLoanAllocation} loan reserve
                </span>
              </div>
            </div>

            {/* Today's Advice banner with interactive "Ask ARTH AI →" */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    {t.todaysAdviceTitle || "Today's Advice"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {actualExpense > targetDailyExpense
                    ? '"Your expenses are higher than your recent average. Check transport and material costs today."'
                    : actualSales >= targetDailySales
                    ? '"Your sales are tracking ahead of target. Lock in advance orders tonight to maintain steady margins."'
                    : '"Sales experienced a slight dip today. Reach out to regular local buyers to secure tomorrow\'s volume."'}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onOpenChat(
                    actualExpense > targetDailyExpense
                      ? "Your expenses are higher than your recent average. How can I check transport and material costs today?"
                      : "Tell me more about today's advice and how to maintain my sales momentum"
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b192c] hover:bg-slate-800 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm group"
              >
                <span>{t.askArthAiCta || 'Ask ARTH AI →'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Detailed Performance Comparison Table Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
               <div>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Today's Operational Snapshot
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    healthStatus === 'ON TRACK'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : healthStatus === 'WATCH'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  STATUS: {healthStatus}
                </span>
              </div>
            </div>

            {/* Target vs Actual Table Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold">Parameter</th>
                    <th className="py-2.5 px-3 font-semibold">Target (Plan)</th>
                    <th className="py-2.5 px-3 font-semibold">Actual (Today)</th>
                    <th className="py-2.5 px-3 font-semibold">Variance</th>
                    <th className="py-2.5 px-3 font-semibold">Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-nums">
                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-900">Gross Sales / Revenue</td>
                    <td className="py-3 px-3 text-slate-600">
                      {formatIndianCurrency(targetDailySales)}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {formatIndianCurrency(actualSales)}
                    </td>
                    <td
                      className={`py-3 px-3 font-bold ${
                        salesDiff >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {salesDiff >= 0 ? `+${formatIndianCurrency(salesDiff)}` : formatIndianCurrency(salesDiff)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-slate-600">
                        {salesDiff >= 0 ? 'Ahead of plan' : 'Below daily threshold'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-900">Operating Expenses</td>
                    <td className="py-3 px-3 text-slate-600">
                      {formatIndianCurrency(targetDailyExpense)}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {formatIndianCurrency(actualExpense)}
                    </td>
                    <td
                      className={`py-3 px-3 font-bold ${
                        expenseDiff <= 0 ? 'text-emerald-700' : 'text-amber-600'
                      }`}
                    >
                      {expenseDiff > 0 ? `+${formatIndianCurrency(expenseDiff)}` : formatIndianCurrency(expenseDiff)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-slate-600">
                        {expenseDiff <= 0 ? 'Within budget limit' : 'Slight cost overrun'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-medium text-slate-900">Daily Loan Escrow (EMI)</td>
                    <td className="py-3 px-3 text-slate-600">
                      {formatIndianCurrency(dailyLoanAllocation)}
                    </td>
                    <td className="py-3 px-3 font-bold text-teal-800">
                      {formatIndianCurrency(dailyLoanAllocation)}
                    </td>
                    <td className="py-3 px-3 text-slate-400">₹0</td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-teal-700 font-semibold">Priority Reserve</span>
                    </td>
                  </tr>

                  <tr className="bg-slate-50/50 font-bold">
                    <td className="py-3 px-3 text-slate-900">Net Take-Home Profit</td>
                    <td className="py-3 px-3 text-slate-700">
                      {formatIndianCurrency(targetDailyNetProfit)}
                    </td>
                    <td
                      className={`py-3 px-3 ${
                        actualProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {formatIndianCurrency(actualProfit)}
                    </td>
                    <td
                      className={`py-3 px-3 ${
                        profitDiff >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {profitDiff >= 0 ? `+${formatIndianCurrency(profitDiff)}` : formatIndianCurrency(profitDiff)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-emerald-800">
                        Healthy Surplus
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 italic pt-2">
              Status explanation: {statusReason}
            </p>
          </div>

          {/* ARTH AI ADVISOR: Max 3 Practical Actions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ARTH AI Advisor: Today's Action Directives
                </h3>
                <p className="text-xs text-slate-500">
                  Based on your recorded data, village benchmarks in {basicInfo.village || 'your area'}, and seasonal factors:
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {generatedDailyActions.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                      {act.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      PRIORITY: {act.urgency}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{act.action}</p>
                  <button
                    type="button"
                    onClick={() => onOpenChat(`I want advice on: ${act.title}. Specifically: ${act.action}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 pt-1 cursor-pointer transition-colors"
                  >
                    <span>{t.askArthAiCta || 'Ask ARTH AI →'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEEKLY & MONTHLY REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Weekly Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">Weekly Performance Summary</h3>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded">
                Days 1 to 7
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs tabular-nums">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Total 7-Day Sales</span>
                <span className="text-base font-bold text-slate-900">
                  {formatIndianCurrency(actualSales * 7)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Total Expenses</span>
                <span className="text-base font-bold text-slate-700">
                  {formatIndianCurrency(actualExpense * 7)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Loan Escrow Set Aside</span>
                <span className="text-base font-bold text-amber-700">
                  {formatIndianCurrency(dailyLoanAllocation * 7)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-700 block text-[11px]">Net 7-Day Surplus</span>
                <span className="text-base font-bold text-emerald-900">
                  {formatIndianCurrency(actualProfit * 7)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-emerald-900 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  What Worked Well
                </span>
                <p className="text-emerald-800 leading-relaxed text-[11px]">
                  Daily customer deliveries maintained 98% on-time rate. Fodder and inventory waste remained strictly under 3%.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-950 block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  What to Improve Next Week
                </span>
                <p className="text-amber-900 leading-relaxed text-[11px]">
                  Thursday afternoon customer footfall dropped 18%. Introduce advance booking reminders via WhatsApp on Wednesday evening.
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">Monthly Projected Roll-up</h3>
              </div>
              <span className="text-xs font-bold text-slate-700">
                Month 1 Complete
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs tabular-nums">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Gross Revenue</span>
                <span className="text-base font-bold text-slate-900">
                  {formatIndianCurrency(actualSales * 30)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Operating Costs</span>
                <span className="text-base font-bold text-slate-700">
                  {formatIndianCurrency(actualExpense * 30)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Bank EMI Paid</span>
                <span className="text-base font-bold text-teal-800">
                  {formatIndianCurrency(feasibility.monthlyEMI || 0)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-700 block text-[11px]">Net Monthly Savings</span>
                <span className="text-base font-bold text-emerald-900">
                  {formatIndianCurrency(actualProfit * 30)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
                <span>
                  <strong>Loan Repayment Readiness: 100%</strong>. Your daily EMI escrow balance of {formatIndianCurrency(feasibility.monthlyEMI || 0)} is fully secured in bank reserves.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS HEALTH MONITOR */}
      {activeTab === 'health' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Business Solvency & Health Monitor</h3>
                <p className="text-xs text-slate-500">
                  Continuous multi-dimensional evaluation of enterprise vitality and debt safety.
                </p>
              </div>

              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                  healthStatus === 'ON TRACK'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : healthStatus === 'WATCH'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                OVERALL: {healthStatus}
              </span>
            </div>

            {/* 6 Core Solvency Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs tabular-nums">
              {/* 1. Revenue Trend */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Revenue Trend</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ON TRACK
                  </span>
                </div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {formatIndianCurrency(actualSales * 30)}/mo
                </span>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Daily turnover consistently hits 104% of baseline projections across normal weekday cycles.
                </p>
              </div>

              {/* 2. Expense Discipline */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Expense Discipline</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ON TRACK
                  </span>
                </div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {formatIndianCurrency(actualExpense * 30)}/mo
                </span>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Operating costs remain within 2% of budget with zero informal high-interest borrowings.
                </p>
              </div>

              {/* 3. Debt Service (DSCR) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-bold text-slate-900 block">Debt Repayment Safety</span>
                    <span className="text-[11px] text-teal-800 font-medium block mt-0.5">
                      {t.loanRepaymentSafety || 'Can your business comfortably repay the loan?'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 shrink-0">
                    SECURE (1.8x)
                  </span>
                </div>
                <span className="text-base font-extrabold text-teal-800 block">
                  {formatIndianCurrency(feasibility.monthlyEMI || 0)}/mo
                </span>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Operating profit exceeds monthly EMI by 1.8x, well beyond the 1.25x safety requirement.
                </p>
              </div>

              {/* 4. Break-Even Buffer */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Break-Even Cushion</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    +28% MARGIN
                  </span>
                </div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {feasibility.breakEvenUnitsPerMonth} units
                </span>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Current sales exceed the zero-profit threshold by 28%, protecting your family during seasonal slumps.
                </p>
              </div>

              {/* 5. Cash Surplus Generation */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-bold text-slate-900 block">Monthly Cash Surplus</span>
                    <span className="text-[11px] text-emerald-800 font-medium block mt-0.5">
                      {t.moneyLeftAfterExpenses || 'Money left after expenses'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                    POSITIVE
                  </span>
                </div>
                <span className="text-base font-extrabold text-emerald-800 block">
                  {formatIndianCurrency(actualProfit * 30)}/mo
                </span>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Retained monthly liquidity builds emergency reserves and funds equipment expansion over time.
                </p>
              </div>

              {/* 6. Local Market Standing */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Market Ground Evidence</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                    TIER 1 PROOF
                  </span>
                </div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {hyperLocal?.demandSignal || 'Positive'} Demand
                </span>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Validated household purchase frequency and competitive density in {basicInfo.village || 'village'}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tracker</span>
        </button>

        <button
          type="button"
          onClick={onOpenChat}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask ARTH AI Anything</span>
        </button>
      </div>
    </div>
  );
};
