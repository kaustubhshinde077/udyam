import React, { useState } from 'react';
import { FinancialFeasibilityResult, Language } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { DataTrustBadge } from '../common/DataTrustBadge';
import {
  Calendar,
  Clock,
  Target,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PiggyBank,
  Receipt,
  FileSpreadsheet,
  Activity,
} from 'lucide-react';

interface Props {
  feasibility: FinancialFeasibilityResult;
  language: Language;
  onContinue: () => void;
  onBack: () => void;
  isDairyDemo?: boolean;
}

export const RepaymentScreen: React.FC<Props> = ({
  feasibility,
  language,
  onContinue,
  onBack,
  isDairyDemo = true,
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  // Term loan parameters aligned with PS 26091 (₹9 Lakh loan, 8% p.a., 7 years)
  const loanAmount = isDairyDemo ? 900000 : feasibility.potentialLoan || 900000;
  const annualInterestRate = 0.08; // 8.0% p.a.
  const tenureYears = 7; // 7 years as requested
  const totalMonths = tenureYears * 12; // 84 months
  const monthlyRate = annualInterestRate / 12;

  // Standard EMI calculation formula
  const emi =
    loanAmount > 0
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        )
      : 0;

  const totalRepayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  // Daily target breakdown for micro-entrepreneur (Section 20 specifications)
  const dailySalesTarget = 5200; // 100 litres @ ₹52
  const dailyExpenseLimit = 2880;
  const dailyRepaymentAllocation = 787;
  const dailyProfitTarget = 1533; // 5200 - 2880 - 787

  // Section 18: Yearly Business & Repayment Plan (Year 1 to Year 7)
  const yearlySchedule = [];
  let balance = loanAmount;
  const baseRevenue = isDairyDemo ? 1872000 : feasibility.annualSurplus + (feasibility.monthlyCosts * 12);
  const baseExpenses = isDairyDemo ? 1036800 : feasibility.monthlyCosts * 12;

  for (let year = 1; year <= tenureYears; year++) {
    // 5% modest annual revenue growth
    const growthFactor = Math.pow(1.05, year - 1);
    const revenueTarget = Math.round(baseRevenue * growthFactor);
    const expenseBudget = Math.round(baseExpenses * Math.pow(1.03, year - 1));
    const profitTarget = revenueTarget - expenseBudget;

    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let m = 1; m <= 12; m++) {
      const monthInterest = Math.round(balance * monthlyRate);
      const monthPrincipal = Math.min(balance, emi - monthInterest);
      yearInterest += monthInterest;
      yearPrincipal += monthPrincipal;
      balance = Math.max(0, balance - monthPrincipal);
    }
    const totalRepay = yearPrincipal + yearInterest;
    const cashSurplusTarget = profitTarget - totalRepay;

    yearlySchedule.push({
      year,
      revenueTarget,
      expenseBudget,
      profitTarget,
      principalRepayment: yearPrincipal,
      interest: yearInterest,
      totalRepayment: totalRepay,
      cashSurplusTarget,
      closingBalance: balance,
    });
  }

  // Section 19: Monthly Target (Month 1 to Month 12)
  const monthlyTargets = [
    { month: 'Month 1', target: 156000, actual: 148000, performance: 95, status: 'WATCH' },
    { month: 'Month 2', target: 156000, actual: 154000, performance: 99, status: 'ON TRACK' },
    { month: 'Month 3', target: 156000, actual: 158500, performance: 102, status: 'ON TRACK' },
    { month: 'Month 4', target: 156000, actual: 161000, performance: 103, status: 'ON TRACK' },
    { month: 'Month 5', target: 156000, actual: 159000, performance: 102, status: 'ON TRACK' },
    { month: 'Month 6', target: 156000, actual: 155000, performance: 99, status: 'ON TRACK' },
    { month: 'Month 7', target: 156000, actual: 149000, performance: 96, status: 'WATCH' },
    { month: 'Month 8', target: 156000, actual: 142000, performance: 91, status: 'NEEDS ATTENTION' },
    { month: 'Month 9', target: 156000, actual: 153000, performance: 98, status: 'ON TRACK' },
    { month: 'Month 10', target: 156000, actual: 162000, performance: 104, status: 'ON TRACK' },
    { month: 'Month 11', target: 156000, actual: 165000, performance: 106, status: 'ON TRACK' },
    { month: 'Month 12', target: 156000, actual: 168000, performance: 108, status: 'ON TRACK' },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  Sections 18–20 • Repayment &amp; Target Planning
                </span>
                <DataTrustBadge status="Demo Data" compact />
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Business &amp; Repayment Target Architecture
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Translating long-term loan obligations into actionable daily, monthly, and 7-year financial milestones.
              </p>
            </div>

            <div className="text-right sm:text-left bg-teal-50/70 p-3 rounded-xl border border-teal-200">
              <span className="text-[11px] font-bold text-teal-800 uppercase block">
                Calculated Monthly EMI
              </span>
              <span className="text-2xl font-black text-teal-900 font-mono">
                {formatIndianCurrency(emi)}
              </span>
              <span className="text-[11px] text-teal-700 block mt-0.5">
                84 Months (7 Yrs) @ 8.0% p.a.
              </span>
            </div>
          </div>

          {/* Quick Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Principal Loan</span>
              <span className="font-bold text-slate-900 text-sm font-mono mt-0.5 block">
                {formatIndianCurrency(loanAmount)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Total Interest (7 yrs)</span>
              <span className="font-bold text-slate-900 text-sm font-mono mt-0.5 block">
                {formatIndianCurrency(totalInterest)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium block">Total Repayment</span>
              <span className="font-bold text-slate-900 text-sm font-mono mt-0.5 block">
                {formatIndianCurrency(totalRepayment)}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
              <span className="text-emerald-700 font-medium block">Daily Sales Target</span>
              <span className="font-bold text-emerald-900 text-sm font-mono mt-0.5 block">
                {formatIndianCurrency(dailySalesTarget)} / day
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 gap-2">
          <button
            type="button"
            id="tab-daily-targets"
            onClick={() => setActiveTab('daily')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'daily'
                ? 'border-teal-800 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>DAILY TARGETS (दैनिक लक्ष्य)</span>
          </button>
          <button
            type="button"
            id="tab-monthly-targets"
            onClick={() => setActiveTab('monthly')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'monthly'
                ? 'border-teal-800 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>MONTHLY TARGETS (मासिक उद्दिष्टे)</span>
          </button>
          <button
            type="button"
            id="tab-yearly-schedule"
            onClick={() => setActiveTab('yearly')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'yearly'
                ? 'border-teal-800 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>7-YEAR AMORTIZATION (७-वर्षीय आराखडा)</span>
          </button>
        </div>

        {/* TAB 1: DAILY TARGET (Section 20) */}
        {activeTab === 'daily' && (
          <div className="bg-white border border-slate-200 rounded-b-xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 uppercase">
                  Section 20 Requirement
                </span>
                <span className="text-xs text-slate-500">Understandable in &lt; 10 seconds</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Daily Operational Target Matrix
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Simple, memorable rules of thumb designed specifically for rural micro-entrepreneurs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Daily Sales */}
              <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-5">
                <span className="text-xs font-bold uppercase text-teal-800 block">
                  1. Daily Sales Target
                </span>
                <div className="text-2xl sm:text-3xl font-black text-teal-950 font-mono mt-2">
                  {formatIndianCurrency(dailySalesTarget)}
                </div>
                <p className="text-xs text-teal-800 mt-1 font-medium">
                  100 litres @ ₹52/L to local village dairy &amp; customers.
                </p>
              </div>

              {/* Daily Expense Limit */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
                <span className="text-xs font-bold uppercase text-amber-900 block">
                  2. Daily Expense Limit
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono mt-2">
                  {formatIndianCurrency(dailyExpenseLimit)}
                </div>
                <p className="text-xs text-amber-800 mt-1 font-medium">
                  Green fodder, cattle feed, dry straw &amp; electricity ceiling.
                </p>
              </div>

              {/* Daily Repayment Allocation */}
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5">
                <span className="text-xs font-bold uppercase text-blue-900 block">
                  3. Repayment Allocation
                </span>
                <div className="text-2xl sm:text-3xl font-black text-blue-950 font-mono mt-2">
                  {formatIndianCurrency(dailyRepaymentAllocation)}
                </div>
                <p className="text-xs text-blue-800 mt-1 font-medium">
                  Set aside daily in piggybank/UPI to guarantee monthly EMI.
                </p>
              </div>

              {/* Daily Profit Target */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-5">
                <span className="text-xs font-bold uppercase text-emerald-800 block">
                  4. Daily Profit Target
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono mt-2">
                  {formatIndianCurrency(dailyProfitTarget)}
                </div>
                <p className="text-xs text-emerald-800 mt-1 font-medium">
                  Net household surplus after all expenses and loan allocation.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">10-Second Mental Accounting Formula:</strong>
                <span className="leading-relaxed">
                  Earn ₹5,200 → Spend max ₹2,880 on cows → Deposit ₹787 into loan box → Take home ₹1,533 clean profit. No surprise debt at the end of the month!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MONTHLY TARGET (Section 19) */}
        {activeTab === 'monthly' && (
          <div className="bg-white border border-slate-200 rounded-b-xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 uppercase">
                    Section 19 Requirement
                  </span>
                  <span className="text-xs text-slate-500">Year 1 Performance Tracking</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  12-Month Target vs. Actual Tracking Table
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">ON TRACK</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">WATCH</span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">NEEDS ATTENTION</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3">Target (₹)</th>
                    <th className="py-2.5 px-3">Actual (₹)</th>
                    <th className="py-2.5 px-3">Performance</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {monthlyTargets.map((row, idx) => {
                    const statusClass =
                      row.status === 'ON TRACK'
                        ? 'bg-emerald-100 text-emerald-800'
                        : row.status === 'WATCH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800';

                    return (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-2 px-3 font-sans font-semibold text-slate-800">{row.month}</td>
                        <td className="py-2 px-3 text-slate-700">{formatIndianCurrency(row.target)}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{formatIndianCurrency(row.actual)}</td>
                        <td className="py-2 px-3 font-semibold">
                          <span
                            className={
                              row.performance >= 100
                                ? 'text-emerald-700'
                                : row.performance >= 95
                                ? 'text-amber-700'
                                : 'text-rose-700'
                            }
                          >
                            {row.performance}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-sans font-bold">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${statusClass}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: 7-YEAR AMORTIZATION (Section 18) */}
        {activeTab === 'yearly' && (
          <div className="bg-white border border-slate-200 rounded-b-xl p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 uppercase">
                  Section 18 Requirement
                </span>
                <span className="text-xs text-slate-500">PS 26091 Term Loan Compliant</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                7-Year Business &amp; Repayment Plan (Year 1 to Year 7)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete amortization trajectory with full debt closure by Year 7.
              </p>
            </div>

            {/* Visual Trend Progress */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                7-Year Trajectory: Revenue vs. Outstanding Debt
              </span>
              <div className="grid grid-cols-7 gap-2 text-center text-[11px]">
                {yearlySchedule.map((row) => (
                  <div key={row.year} className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">Y{row.year}</span>
                    <span className="text-[10px] text-emerald-700 font-mono block">
                      +{formatIndianCurrency(row.cashSurplusTarget)}
                    </span>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-700 rounded-full"
                        style={{ width: `${Math.max(5, (row.closingBalance / loanAmount) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {row.closingBalance === 0 ? 'Debt Free' : formatIndianCurrency(row.closingBalance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-2.5">Year</th>
                    <th className="py-3 px-2.5">Revenue Target</th>
                    <th className="py-3 px-2.5">Expense Budget</th>
                    <th className="py-3 px-2.5">Profit Target</th>
                    <th className="py-3 px-2.5 text-emerald-800">Principal</th>
                    <th className="py-3 px-2.5 text-rose-800">Interest</th>
                    <th className="py-3 px-2.5 font-bold">Total Repay</th>
                    <th className="py-3 px-2.5 text-emerald-700 font-bold">Cash Surplus</th>
                    <th className="py-3 px-2.5 text-right">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {yearlySchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-2.5 font-sans font-bold text-slate-900">Year {row.year}</td>
                      <td className="py-2.5 px-2.5 text-slate-700">{formatIndianCurrency(row.revenueTarget)}</td>
                      <td className="py-2.5 px-2.5 text-slate-600">{formatIndianCurrency(row.expenseBudget)}</td>
                      <td className="py-2.5 px-2.5 font-semibold text-slate-900">{formatIndianCurrency(row.profitTarget)}</td>
                      <td className="py-2.5 px-2.5 text-emerald-700">{formatIndianCurrency(row.principalRepayment)}</td>
                      <td className="py-2.5 px-2.5 text-rose-700">{formatIndianCurrency(row.interest)}</td>
                      <td className="py-2.5 px-2.5 font-bold text-slate-900">{formatIndianCurrency(row.totalRepayment)}</td>
                      <td className="py-2.5 px-2.5 text-emerald-800 font-bold">{formatIndianCurrency(row.cashSurplusTarget)}</td>
                      <td className="py-2.5 px-2.5 text-right font-bold text-teal-900">
                        {row.closingBalance === 0 ? '₹0 (Paid Off)' : formatIndianCurrency(row.closingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Navigation CTAs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-2.5 text-slate-700 font-semibold text-xs sm:text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50 min-h-[40px] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Feasibility Report</span>
          </button>

          <button
            id="continue-to-health-btn"
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-teal-900 min-h-[40px] flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Proceed to Business Health &amp; Daily Log</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
