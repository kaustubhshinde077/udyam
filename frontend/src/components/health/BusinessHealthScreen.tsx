import React, { useState } from 'react';
import { Language } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { DataTrustBadge } from '../common/DataTrustBadge';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  X,
  RotateCcw,
  Sliders,
  DollarSign,
  PieChart,
  Lightbulb,
} from 'lucide-react';

interface Props {
  language: Language;
  onContinue: () => void;
  onBack: () => void;
  isDairyDemo?: boolean;
}

export const BusinessHealthScreen: React.FC<Props> = ({
  language,
  onContinue,
  onBack,
  isDairyDemo = true,
}) => {
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'monitor' | 'whatif'>('monitor');

  // Daily Entry state (Section 21)
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    unitsSold: 105, // litres
    pricePerUnit: 52, // ₹/litre
    feedCost: 1800,
    transportCost: 150,
    wagesCost: 100,
    otherCost: 50,
    notes: 'Morning and evening cooperative collection completed. Milk fat tested at 4.2%.',
  });

  // Auto-calculated daily figures
  const calcRevenue = logForm.unitsSold * logForm.pricePerUnit;
  const calcExpenses =
    Number(logForm.feedCost) +
    Number(logForm.transportCost) +
    Number(logForm.wagesCost) +
    Number(logForm.otherCost);
  const calcDailySurplus = calcRevenue - calcExpenses;
  const dailyLoanAllocation = 787; // PS 26091 allocation
  const calcTakeHomeProfit = Math.max(0, calcDailySurplus - dailyLoanAllocation);

  // Status definition
  const healthStatus: 'ON TRACK' | 'WATCH' | 'NEEDS ATTENTION' =
    calcRevenue >= 5000 ? 'ON TRACK' : calcRevenue >= 4400 ? 'WATCH' : 'NEEDS ATTENTION';

  // Section 25: What-if Simulator State
  const [simExtraAnimals, setSimExtraAnimals] = useState<number>(0);
  const [simFeedCostDiscount, setSimFeedCostDiscount] = useState<number>(0); // percentage

  // Simulator calculations (base: 10 cows, 100L/day, ₹1,56,000 rev, ₹86,400 cost)
  const simLitresPerDay = 100 + simExtraAnimals * 10;
  const simMonthlyRevenue = simLitresPerDay * 52 * 30;
  const simFeedCostRatio = 1 - simFeedCostDiscount / 100;
  const simMonthlyExpenses = Math.round(
    (86400 * ((10 + simExtraAnimals) / 10)) * simFeedCostRatio
  );
  const simMonthlyEMI = 23600 + Math.round(simExtraAnimals * 2360);
  const simNetProfit = simMonthlyRevenue - simMonthlyExpenses - simMonthlyEMI;

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogModalOpen(false);
  };

  // Multilingual AI Guidance text (Section 22)
  const guidanceContent = {
    en: {
      statusTitle: "Today's Assessment: ON TRACK",
      whyMatters: 'Daily milk output of 105L exceeded baseline target (100L) by 5%, generating a healthy ₹5,460 revenue.',
      whatToDo: 'Deposit today’s ₹787 loan allocation into the separate EMI bank account before sundown.',
      risk: 'Summer temperature rise may decrease evening milk yields by 8% if shed ventilation is not maintained.',
      opportunity: 'Local sweet shop in nearby town offers ₹55/L for 25 litres of surplus evening milk tomorrow.',
    },
    mr: {
      statusTitle: "आजचे मूल्यांकन: उत्कृष्ट स्थिती (ON TRACK)",
      whyMatters: 'आजचे १०५ लिटर दूध उत्पादन आधारभूत लक्ष्यापेक्षा (१०० लि.) ५% जास्त झाले असून ₹५,४६० ची उत्तम विक्री झाली.',
      whatToDo: 'आजचा ₹७८७ चा कर्ज हप्ता संध्याकाळपूर्वी स्वतंत्र बँक खात्यामध्ये बाजूला ठेवा.',
      risk: 'उन्हाळ्यामुळे गोठ्यात पुरेशी हवा नसेल तर संध्याकाळच्या उत्पादनात ८% घट होऊ शकते.',
      opportunity: 'शेजारच्या गावातील मिठाई दुकानाकडून २५ लिटर जास्तीच्या दुधासाठी ₹५५/लिटर दराने मागणी आहे.',
    },
    hi: {
      statusTitle: "आज का मूल्यांकन: सही दिशा में (ON TRACK)",
      whyMatters: 'आज का 105 लीटर दूध उत्पादन लक्ष्य (100 लीटर) से 5% अधिक रहा और ₹5,460 का कारोबार हुआ।',
      whatToDo: 'आज का ₹787 का ऋण हिस्सा शाम से पहले अलग खाते में जमा करें।',
      risk: 'गर्मी बढ़ने से शाम के दूध उत्पादन में गिरावट की संभावना, छाया का प्रबंध रखें।',
      opportunity: 'पास के कस्बे का मिष्ठान विक्रेता अतिरिक्त दूध के लिए ₹55 प्रति लीटर देने को तैयार है।',
    },
  }[language];

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  Sections 21–25 • Post-Financing Operations
                </span>
                <DataTrustBadge status="Demo Data" compact />
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Business Health &amp; Daily Monitoring System
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Monitor live performance against bankable forecasts, receive daily AI operational alerts, and stress-test expansion scenarios.
              </p>
            </div>

            {/* Status & Log Action */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{guidanceContent.statusTitle}</span>
              </div>

              <button
                type="button"
                id="open-log-modal-btn"
                onClick={() => setIsLogModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors min-h-[38px]"
              >
                <Plus className="w-4 h-4" />
                <span>Log Today&apos;s Business</span>
              </button>
            </div>
          </div>

          {/* Tab Switcher: Live Monitor vs What-If Simulator */}
          <div className="flex gap-2 pt-4 border-b border-slate-200">
            <button
              type="button"
              id="tab-health-monitor"
              onClick={() => setActiveTab('monitor')}
              className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'monitor'
                  ? 'border-teal-800 text-teal-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Performance Monitor &amp; Reviews (Sections 21–24)</span>
            </button>
            <button
              type="button"
              id="tab-whatif-simulator"
              onClick={() => setActiveTab('whatif')}
              className={`pb-2.5 px-3 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'whatif'
                  ? 'border-teal-800 text-teal-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Business Health &amp; What-If Simulator (Section 25)</span>
            </button>
          </div>
        </div>

        {activeTab === 'monitor' && (
          <>
            {/* SECTION 22: TODAY'S AI GUIDANCE */}
            <div className="bg-gradient-to-r from-teal-900 to-[#0F284E] text-white rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <h2 className="text-base font-extrabold tracking-wide">
                    TODAY&apos;S AI GUIDANCE (दैनिक कृत्रिम बुद्धिमत्ता सल्ला)
                  </h2>
                </div>
                <span className="text-xs font-bold uppercase bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded">
                  Live AI Advisory
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/10 rounded-lg p-3 border border-white/10 space-y-1">
                  <span className="text-teal-200 font-bold uppercase tracking-wider block">Why this matters:</span>
                  <p className="text-slate-100 leading-snug">{guidanceContent.whyMatters}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 border border-white/10 space-y-1">
                  <span className="text-emerald-300 font-bold uppercase tracking-wider block">What to do today:</span>
                  <p className="text-slate-100 leading-snug">{guidanceContent.whatToDo}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 border border-white/10 space-y-1">
                  <span className="text-rose-300 font-bold uppercase tracking-wider block">Risk to watch:</span>
                  <p className="text-slate-100 leading-snug">{guidanceContent.risk}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 border border-white/10 space-y-1">
                  <span className="text-amber-300 font-bold uppercase tracking-wider block">Opportunity:</span>
                  <p className="text-slate-100 leading-snug">{guidanceContent.opportunity}</p>
                </div>
              </div>
            </div>

            {/* SECTION 21: TODAY'S LOG SUMMARY */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Section 21 • Today&apos;s Entry Summary
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Daily Financial Reconciled Metrics ({logForm.date})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(true)}
                  className="text-xs font-bold text-teal-800 hover:underline"
                >
                  Edit Today&apos;s Entry
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold block">Units Sold</span>
                  <span className="text-lg font-black text-slate-900 font-mono block mt-1">
                    {logForm.unitsSold} Litres
                  </span>
                  <span className="text-[11px] text-slate-500">@ ₹{logForm.pricePerUnit}/L</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold block">Today&apos;s Revenue</span>
                  <span className="text-lg font-black text-slate-900 font-mono block mt-1">
                    {formatIndianCurrency(calcRevenue)}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">105% of target</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-semibold block">Operating Costs</span>
                  <span className="text-lg font-black text-rose-700 font-mono block mt-1">
                    {formatIndianCurrency(calcExpenses)}
                  </span>
                  <span className="text-[11px] text-slate-500">Feed + wages + misc</span>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900">
                  <span className="font-semibold block">Loan Allocation</span>
                  <span className="text-lg font-black font-mono block mt-1">
                    {formatIndianCurrency(dailyLoanAllocation)}
                  </span>
                  <span className="text-[11px] text-blue-700 font-semibold">Auto-reserved</span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                  <span className="font-semibold block">Net Take-Home</span>
                  <span className="text-lg font-black font-mono block mt-1">
                    {formatIndianCurrency(calcTakeHomeProfit)}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">Clean daily profit</span>
                </div>
              </div>

              {logForm.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 italic">
                  &quot;{logForm.notes}&quot;
                </p>
              )}
            </div>

            {/* SECTIONS 23 & 24: WEEKLY & MONTHLY REVIEWS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* SECTION 23: WEEKLY REVIEW */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-500">Section 23</span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-teal-700" />
                      WEEKLY REVIEW (मागील ७ दिवस)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ON TRACK
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-600">Total Revenue vs Target:</span>
                    <span className="font-bold text-slate-900 font-mono">₹37,800 / ₹36,400 (+3.8%)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-600">Total Expenses vs Budget:</span>
                    <span className="font-bold text-slate-900 font-mono">₹19,800 / ₹20,160 (-1.8%)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-600">Loan Allocation Accumulated:</span>
                    <span className="font-bold text-blue-900 font-mono">₹5,509 (7 days @ ₹787)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-600">Average Daily Production:</span>
                    <span className="font-bold text-slate-900 font-mono">103.5 Litres / day</span>
                  </div>
                </div>

                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg text-xs text-teal-950 space-y-1.5">
                  <span className="font-bold block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal-800" /> AI Weekly Insight:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-teal-900">
                    <li>Production remained consistent despite Monday rain.</li>
                    <li>Fodder costs controlled by sourcing silage locally.</li>
                    <li>Action: Schedule routine veterinary booster injection this Thursday.</li>
                  </ul>
                </div>
              </div>

              {/* SECTION 24: MONTHLY REVIEW */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-500">Section 24</span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-teal-700" />
                      MONTHLY REVIEW (मागील ३० दिवस)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ON TRACK
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-600">Monthly Revenue vs Target:</span>
                    <span className="font-bold text-slate-900 font-mono">₹1,58,200 / ₹1,56,000</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-600">Monthly Expenses vs Budget:</span>
                    <span className="font-bold text-slate-900 font-mono">₹86,100 / ₹86,400</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-600">Bank Loan EMI Status:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PAID (₹23,600 debited on 5th)
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="text-slate-600">Remaining Loan Balance:</span>
                    <span className="font-bold text-slate-900 font-mono">₹8,82,400 (1 of 84 Mos)</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-950 space-y-1.5">
                  <span className="font-bold block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-800" /> AI Monthly Strategy:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-blue-900">
                    <li>1st EMI serviced smoothly from reserved daily funds.</li>
                    <li>Net monthly entrepreneur surplus: ₹48,500.</li>
                    <li>Next Month: Pre-buy 2 tons of dry straw before pre-monsoon price spike.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: BUSINESS HEALTH SCORE & WHAT-IF SIMULATOR (Section 25) */}
        {activeTab === 'whatif' && (
          <div className="space-y-6">
            {/* Health Score Overview */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                    Section 25 • Composite Health Index
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    Business Health Score: 88 / 100 (Robust)
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Multidimensional operational health evaluated from daily production logs and debt coverage.
                  </p>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-emerald-600 bg-emerald-50 flex flex-col items-center justify-center shrink-0">
                  <span className="text-2xl font-black text-emerald-900 font-mono leading-none">88</span>
                  <span className="text-[10px] text-emerald-700 font-bold mt-0.5">Grade A</span>
                </div>
              </div>

              {/* 4 Breakdown Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">Revenue Health</span>
                    <span className="text-emerald-700">90%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '90%' }} />
                  </div>
                  <p className="text-[11px] text-slate-500">105L output vs 100L target</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">Cost Discipline</span>
                    <span className="text-emerald-700">85%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                  <p className="text-[11px] text-slate-500">Feed expenses within ₹2,880 limit</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">Repayment Regularity</span>
                    <span className="text-emerald-700">100%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                  <p className="text-[11px] text-slate-500">All EMI allocations deposited</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">Market Position</span>
                    <span className="text-amber-700">78%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }} />
                  </div>
                  <p className="text-[11px] text-slate-500">Opportunity for value-added retail</p>
                </div>
              </div>
            </div>

            {/* WHAT-IF SIMULATOR */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  Interactive Simulator
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  &quot;What-If&quot; Sensitivity &amp; Expansion Simulator
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Test operational changes before committing capital.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
                {/* Control 1: Add More Animals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <label htmlFor="sim-cows-range" className="text-slate-800">
                      What if I add more cows?
                    </label>
                    <span className="text-teal-800 font-mono">
                      +{simExtraAnimals} Animals ({10 + simExtraAnimals} Total)
                    </span>
                  </div>
                  <input
                    id="sim-cows-range"
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={simExtraAnimals}
                    onChange={(e) => setSimExtraAnimals(Number(e.target.value))}
                    className="w-full accent-teal-800 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Produces +{simExtraAnimals * 10} L/day with incremental capital &amp; feed.
                  </span>
                </div>

                {/* Control 2: Feed Price Discount */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <label htmlFor="sim-feed-discount-range" className="text-slate-800">
                      What if bulk feed price drops?
                    </label>
                    <span className="text-emerald-800 font-mono">
                      {simFeedCostDiscount}% Discount
                    </span>
                  </div>
                  <input
                    id="sim-feed-discount-range"
                    type="range"
                    min="0"
                    max="20"
                    step="5"
                    value={simFeedCostDiscount}
                    onChange={(e) => setSimFeedCostDiscount(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Bulk procurement or farmer producer company (FPO) tie-up.
                  </span>
                </div>
              </div>

              {/* Simulated Financial Outcome */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-2">
                  Simulated Monthly Financial Impact:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-emerald-700 block font-sans">Monthly Revenue:</span>
                    <strong className="text-base text-slate-900 font-bold">
                      {formatIndianCurrency(simMonthlyRevenue)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 block font-sans">Operating Expenses:</span>
                    <strong className="text-base text-slate-900 font-bold">
                      {formatIndianCurrency(simMonthlyExpenses)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 block font-sans">Monthly EMI:</span>
                    <strong className="text-base text-slate-900 font-bold">
                      {formatIndianCurrency(simMonthlyEMI)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 block font-sans">Projected Net Profit:</span>
                    <strong className="text-lg text-emerald-900 font-black">
                      {formatIndianCurrency(simNetProfit)}
                    </strong>
                  </div>
                </div>
              </div>
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
            <span>Back to Repayment Plan</span>
          </button>

          <button
            id="continue-to-advisor-btn"
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-teal-900 min-h-[40px] flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Proceed to AI Advisor &amp; Executive Dashboard</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Log Today Modal (Section 21) */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Section 21 Input Screen
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Log Today&apos;s Business Operations
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={logForm.date}
                  onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Units Sold Today (Litres)
                  </label>
                  <input
                    type="number"
                    value={logForm.unitsSold}
                    onChange={(e) => setLogForm({ ...logForm, unitsSold: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Price Achieved (₹/Unit)
                  </label>
                  <input
                    type="number"
                    value={logForm.pricePerUnit}
                    onChange={(e) => setLogForm({ ...logForm, pricePerUnit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                    required
                  />
                </div>
              </div>

              {/* Operating Expenses Breakdown */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-800 block">Today&apos;s Operating Expenses:</span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div>
                    <label className="text-[11px] text-slate-500 block">Feed &amp; Fodder (₹):</label>
                    <input
                      type="number"
                      value={logForm.feedCost}
                      onChange={(e) => setLogForm({ ...logForm, feedCost: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">Transport / Fuel (₹):</label>
                    <input
                      type="number"
                      value={logForm.transportCost}
                      onChange={(e) => setLogForm({ ...logForm, transportCost: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">Wages / Labor (₹):</label>
                    <input
                      type="number"
                      value={logForm.wagesCost}
                      onChange={(e) => setLogForm({ ...logForm, wagesCost: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">Other / Misc (₹):</label>
                    <input
                      type="number"
                      value={logForm.otherCost}
                      onChange={(e) => setLogForm({ ...logForm, otherCost: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Real-time Auto Calculated Summary */}
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-teal-900 font-sans">Today&apos;s Revenue:</span>
                  <strong>{formatIndianCurrency(calcRevenue)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-800 font-sans">Total Expenses:</span>
                  <strong>{formatIndianCurrency(calcExpenses)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-900 font-sans">Loan Allocation (Auto):</span>
                  <strong>{formatIndianCurrency(dailyLoanAllocation)}</strong>
                </div>
                <div className="flex justify-between border-t border-teal-300 pt-1 font-bold text-teal-950">
                  <span className="font-sans">Net Take-Home Profit:</span>
                  <strong className="text-sm">{formatIndianCurrency(calcTakeHomeProfit)}</strong>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Notes / Observations
                </label>
                <textarea
                  rows={2}
                  value={logForm.notes}
                  onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                  placeholder="e.g. fat percentage, cattle health, local market demand"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-md font-bold hover:bg-teal-900"
                >
                  Save &amp; Update Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
