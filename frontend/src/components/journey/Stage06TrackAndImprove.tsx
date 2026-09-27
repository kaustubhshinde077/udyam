import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Target,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bot,
  IndianRupee,
  Calendar,
  Save,
  ArrowLeft,
  Home,
  FileSpreadsheet,
  Check,
  BarChart3,
  CalendarDays,
  FileText,
  MessageSquare,
  X,
  Send,
  Printer,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  BasicInfoData,
  BusinessSetupData,
  DailyExpenseItem,
  DailyLogEntry,
  FinancialFeasibilityResult,
  Language,
} from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { formatIndianCurrency } from '../../utils/calculations';
import {
  DEFAULT_EXPENSE_CATEGORIES,
  FARMER_EXPENSE_CATEGORIES,
  createInitialDailyEntries,
  computeDailyComparison,
  computeWeeklyReview,
  computeLoanTracking,
} from '../../utils/dailyTracking';
import { PremiumButton } from '../common/PremiumButton';

interface Stage06TrackAndImproveProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  feasibility: FinancialFeasibilityResult;
  language: Language;
  onBack: () => void;
  onGoHome: () => void;
  onOpenChat?: (prompt?: string) => void;
}

export const Stage06TrackAndImprove: React.FC<Stage06TrackAndImproveProps> = ({
  basicInfo,
  businessSetup,
  feasibility,
  language,
  onBack,
  onGoHome,
  onOpenChat,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const isFarmer = businessSetup?.entityType === 'farmer';

  const [activeTab, setActiveTab] = useState<'entry' | 'target' | 'advisor' | 'reviews' | 'loan'>('entry');

  // Daily entries initialized from feasibility
  const [dailyEntries, setDailyEntries] = useState<DailyLogEntry[]>(() =>
    createInitialDailyEntries(feasibility, isFarmer)
  );
  const currentEntry = dailyEntries[0];

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Quick expense form state
  const [newExpName, setNewExpName] = useState<string>('Raw material');
  const [newExpAmount, setNewExpAmount] = useState<string>('400');
  const [newExpNote, setNewExpNote] = useState<string>('');

  // AI Chatbot Drawer state
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text:
        language === 'mr'
          ? `नमस्कार! मी तुमचा अर्थ एआय व्यावसायिक सल्लागार आहे. आजच्या व्यवहाराची नोंद ठेवा. मी तुमच्या व्यवसायासाठी मार्गदर्शन करण्यास तयार आहे.`
          : language === 'hi'
          ? `नमस्ते! मैं आपका अर्थ एआई सलाहकार हूँ। अपने आज के दैनिक हिसाब दर्ज करें, मैं आपको व्यावहारिक मार्गदर्शन दूंगा।`
          : `Namaste! I am your ARTH AI Ground Advisor. Record today's numbers to track actual cash flow against your model.`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  // Computations using dailyTracking.ts
  const comparison = useMemo(() => {
    return computeDailyComparison(currentEntry, feasibility, language);
  }, [currentEntry, feasibility, language]);

  const weeklyReview = useMemo(() => {
    return computeWeeklyReview(dailyEntries, feasibility);
  }, [dailyEntries, feasibility]);

  const loanTracking = useMemo(() => {
    return computeLoanTracking(feasibility);
  }, [feasibility]);

  const handleUpdateSales = (newSales: number) => {
    setDailyEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[0] };
      entry.sales = Math.max(0, newSales);
      entry.netProfit = entry.sales - entry.totalExpenses;
      updated[0] = entry;
      return updated;
    });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpAmount) || 0;
    if (amt <= 0) return;

    const newItem: DailyExpenseItem = {
      id: `exp-${Date.now()}`,
      name: newExpName.trim() || 'Expense',
      amount: amt,
      note: newExpNote.trim(),
    };

    setDailyEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[0] };
      const newExpenses = [...entry.expenses, newItem];
      const newTotal = newExpenses.reduce((sum, item) => sum + item.amount, 0);
      entry.expenses = newExpenses;
      entry.totalExpenses = newTotal;
      entry.netProfit = entry.sales - newTotal;
      updated[0] = entry;
      return updated;
    });

    setNewExpAmount('');
    setNewExpNote('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRemoveExpense = (itemId: string) => {
    setDailyEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[0] };
      const newExpenses = entry.expenses.filter((x) => x.id !== itemId);
      const newTotal = newExpenses.reduce((sum, item) => sum + item.amount, 0);
      entry.expenses = newExpenses;
      entry.totalExpenses = newTotal;
      entry.netProfit = entry.sales - newTotal;
      updated[0] = entry;
      return updated;
    });
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();
      if (lower.includes('sales') || lower.includes('विक्री') || lower.includes('बिक्री')) {
        reply =
          language === 'mr'
            ? `तुमचे दैनिक विक्री उद्दिष्ट ₹${comparison.targetSales.toLocaleString('en-IN')} आहे. आज विक्री ₹${currentEntry.sales.toLocaleString('en-IN')} नोंदवली गेली आहे. विक्री वाढवण्यासाठी नियमित ग्राहकांशी संपर्क साधा.`
            : language === 'hi'
            ? `आपका दैनिक लक्ष्य ₹${comparison.targetSales.toLocaleString('en-IN')} है। आज की बिक्री ₹${currentEntry.sales.toLocaleString('en-IN')} रही है। बिक्री बढ़ाने के लिए नियमित ग्राहकों से संपर्क करें।`
            : `Your planned daily sales target is ₹${comparison.targetSales.toLocaleString('en-IN')}. Today you logged ₹${currentEntry.sales.toLocaleString('en-IN')}. Lock in advance orders tonight to maintain momentum.`;
      } else if (lower.includes('expense') || lower.includes('खर्च') || lower.includes('transport')) {
        reply =
          language === 'mr'
            ? `दैनिक खर्च मर्यादा ₹${comparison.targetExpenses.toLocaleString('en-IN')} आहे. आजचा खर्च ₹${currentEntry.totalExpenses.toLocaleString('en-IN')} आहे. अनावश्यक खर्च टाळा.`
            : language === 'hi'
            ? `आपकी दैनिक खर्च सीमा ₹${comparison.targetExpenses.toLocaleString('en-IN')} है। आज का खर्च ₹${currentEntry.totalExpenses.toLocaleString('en-IN')} हुआ। फालतू खर्चों पर नियंत्रण रखें।`
            : `Your daily operating expense limit is ₹${comparison.targetExpenses.toLocaleString('en-IN')}. Today expenses were ₹${currentEntry.totalExpenses.toLocaleString('en-IN')}. Keep tight control over logistics.`;
      } else {
        reply =
          language === 'mr'
            ? `दैनिक नफा: ₹${currentEntry.netProfit.toLocaleString('en-IN')}. बँकेच्या मासिक हप्त्यासाठी (₹${(feasibility.monthlyEMI || 0).toLocaleString('en-IN')}) दररोज आवश्यक रक्कम वेगळी ठेवा.`
            : language === 'hi'
            ? `आज का शुद्ध लाभ: ₹${currentEntry.netProfit.toLocaleString('en-IN')}. बैंक किस्त (₹${(feasibility.monthlyEMI || 0).toLocaleString('en-IN')}) के लिए दैनिक हिस्सा अलग रखें।`
            : `Today's net profit stands at ₹${currentEntry.netProfit.toLocaleString('en-IN')}. Always set aside your daily share for the ₹${(feasibility.monthlyEMI || 0).toLocaleString('en-IN')} monthly loan payment.`;
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 450);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 relative">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Step Header */}
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Step 07 of 07 • {t.stepTrackAndImprove}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                  comparison.salesDiff >= 0
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {comparison.salesStatusText}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (onOpenChat) {
                    onOpenChat("How is my daily business performance tracking against my financial plan, and what should I improve today?");
                  } else {
                    setIsChatOpen(!isChatOpen);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-800 text-white text-xs font-bold hover:bg-teal-900 transition-colors cursor-pointer shadow-xs"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{t.askYourBusinessAdvisor}</span>
              </button>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.stepTrackAndImprove}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t.trackRealNotice}
          </p>
        </div>

        {/* ================= PERSONALIZED BUSINESS STATUS BANNER ================= */}
        {businessSetup?.businessStatus === 'new_business' || (!businessSetup?.businessStatus && !businessSetup?.existingBusiness?.businessName) ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                🚀
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                  New Business Launch Mode
                </span>
                <h3 className="text-sm font-bold text-teal-950 mt-1">
                  Launch Preparation &amp; Break-Even Tracker
                </h3>
                <p className="text-xs text-teal-800 mt-0.5">
                  Target: Reach break-even volume of <strong>{feasibility.breakEvenUnitsPerMonth || 120} units/mo</strong> within {feasibility.breakEvenMonths || 6} months. Record your initial trial sales below.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs font-mono font-bold text-teal-900 bg-white px-3 py-1.5 rounded-xl border border-teal-200 shadow-2xs">
                Setup Target: ₹{formatIndianCurrency(feasibility.totalProjectCost)}
              </span>
            </div>
          </div>
        ) : (businessSetup?.existingLoan?.hasLoan === 'Yes' || businessSetup?.businessStatus === 'existing_with_loan') ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                🛡️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                    Active Loan Health Mode
                  </span>
                  <span className="text-xs font-bold text-amber-950">
                    {businessSetup?.existingLoan?.providerName || 'Bank'} EMI: ₹{businessSetup?.existingLoan?.monthlyEMI?.toLocaleString('en-IN') || '2,450'}/mo
                  </span>
                </div>
                <h3 className="text-sm font-bold text-amber-950 mt-1">
                  Daily Loan EMI Reserve Tracker: Set aside ₹{Math.round((businessSetup?.existingLoan?.monthlyEMI || 2450) / 30).toLocaleString('en-IN')}/day
                </h3>
                <p className="text-xs text-amber-900 mt-0.5">
                  Outstanding Balance: ₹{businessSetup?.existingLoan?.outstandingAmount?.toLocaleString('en-IN') || '45,000'}. Keep daily net profit above ₹{Math.round((businessSetup?.existingLoan?.monthlyEMI || 2450) / 25).toLocaleString('en-IN')} to safeguard against default.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('loan')}
                className="text-xs font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-amber-300"
              >
                View Loan Health →
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                📈
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  Established Business Growth Mode
                </span>
                <h3 className="text-sm font-bold text-blue-950 mt-1">
                  {businessSetup?.existingBusiness?.businessName || 'Your Enterprise'} • Cash Flow &amp; Margin Expansion
                </h3>
                <p className="text-xs text-blue-800 mt-0.5">
                  Tracking daily money in &amp; out against your baseline sales of ₹{businessSetup?.existingBusiness?.currentMonthlySales ? businessSetup.existingBusiness.currentMonthlySales.toLocaleString('en-IN') : '50,000'}/mo. No active debt obligations.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs font-mono font-bold text-blue-900 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                Healthy Debt-Free Margin
              </span>
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-1.5 border border-slate-200 rounded-xl p-1 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('entry')}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'entry' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600'
            }`}
          >
            {t.todayMoneyReview}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('target')}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'target' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600'
            }`}
          >
            {t.planVsActual}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advisor')}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'advisor' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600'
            }`}
          >
            {t.todayAdvice}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600'
            }`}
          >
            {t.sevenDayReview}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('loan')}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'loan' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600'
            }`}
          >
            {t.loanProgress}
          </button>
        </div>

        {/* TAB 1: DAILY ENTRY & TODAY'S MONEY REVIEW */}
        {activeTab === 'entry' && (
          <div className="space-y-6">
            {/* Today's Key Figures */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.salesToday}
                </span>
                <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
                  ₹{currentEntry.sales.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Target: ₹{comparison.targetSales.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.expensesToday}
                </span>
                <span className="text-xl font-black font-mono text-rose-700 mt-1 block">
                  ₹{currentEntry.totalExpenses.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Limit: ₹{comparison.targetExpenses.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-mono text-emerald-800 uppercase block font-bold">
                  {t.moneyLeftToday}
                </span>
                <span className="text-xl font-black font-mono text-emerald-950 mt-1 block">
                  ₹{currentEntry.netProfit.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-700 mt-0.5 block">
                  Sales - Expenses
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-500 uppercase block font-semibold">
                  {t.salesTarget}
                </span>
                <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
                  ₹{comparison.targetSales.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Daily Benchmark</span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[11px] font-mono text-amber-800 uppercase block font-bold">
                  {t.differenceFromTarget}
                </span>
                <span className="text-xl font-black font-mono text-amber-950 mt-1 block">
                  {comparison.salesDiff >= 0 ? '+' : ''}₹{comparison.salesDiff.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-amber-800 mt-0.5 block">
                  {comparison.salesDiff >= 0 ? 'Surplus' : 'Deficit'}
                </span>
              </div>
            </div>

            {/* Inputs: Sales & Expenses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Input */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                    {t.salesMoneyEarned}
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">{currentEntry.date}</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t.salesToday} (₹)
                  </label>
                  <input
                    type="number"
                    value={currentEntry.sales}
                    onChange={(e) => handleUpdateSales(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 text-base font-black font-mono bg-white border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Multiple Expenses & Add Form */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                    {t.businessExpenses}
                  </h4>
                  <span className="text-xs text-rose-700 font-mono font-bold">
                    Total: ₹{currentEntry.totalExpenses.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {currentEntry.expenses.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs"
                    >
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-700">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExpense(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddExpense} className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {(isFarmer ? FARMER_EXPENSE_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES).slice(0, 5).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewExpName(cat)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                          newExpName === cat
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder={t.expenseName}
                      value={newExpName}
                      onChange={(e) => setNewExpName(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder={t.amount}
                      value={newExpAmount}
                      onChange={(e) => setNewExpAmount(e.target.value)}
                      className="px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    {t.addExpense}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLAN VS ACTUAL */}
        {activeTab === 'target' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-sans">
                  {t.plannedDailySales}
                </span>
                <p className="text-xl font-black text-slate-900">
                  ₹{comparison.targetSales.toLocaleString('en-IN')}
                </p>
                <span
                  className={`text-xs font-bold block ${
                    comparison.salesDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  Actual: ₹{currentEntry.sales.toLocaleString('en-IN')} ({comparison.salesDiff >= 0 ? '+' : ''}₹{comparison.salesDiff.toLocaleString('en-IN')})
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-sans">
                  {t.plannedDailyExpense}
                </span>
                <p className="text-xl font-black text-slate-900">
                  ₹{comparison.targetExpenses.toLocaleString('en-IN')}
                </p>
                <span
                  className={`text-xs font-bold block ${
                    comparison.expenseDiff <= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  Actual: ₹{currentEntry.totalExpenses.toLocaleString('en-IN')} ({comparison.expenseDiff >= 0 ? '+' : ''}₹{comparison.expenseDiff.toLocaleString('en-IN')})
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-sans">
                  {t.moneyLeftAfterExpenses}
                </span>
                <p className="text-xl font-black text-emerald-700">
                  ₹{currentEntry.netProfit.toLocaleString('en-IN')}
                </p>
                <span className="text-xs text-slate-500 block font-sans">
                  Target: ₹{comparison.targetProfit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold font-mono uppercase block">{comparison.salesStatusText}</span>
              <p>{comparison.shortExplanation}</p>
            </div>
          </div>
        )}

        {/* TAB 3: TODAY'S ADVICE */}
        {activeTab === 'advisor' && (
          <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono tracking-wide uppercase text-amber-300">
                    {t.todayAdvice}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {t.whatYouCanDoTomorrow}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs leading-relaxed text-slate-200">
              <p>{comparison.shortExplanation}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {comparison.tomorrowSuggestions.map((sugg, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                  <span className="font-bold text-amber-300 block font-mono">Action {idx + 1}</span>
                  <p className="text-slate-300 text-[11px]">{sugg}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: 7-DAY REVIEW */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase font-mono text-[11px]">
                  {t.sevenDayReview}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                  {weeklyReview.salesVsTargetPct}% {t.comparedWithWeeklyTarget}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-mono block">{t.totalSales}</span>
                  <strong className="text-sm font-black text-slate-900 font-mono">
                    ₹{weeklyReview.totalSales.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-mono block">{t.totalExpenses}</span>
                  <strong className="text-sm font-black text-rose-700 font-mono">
                    ₹{weeklyReview.totalExpenses.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-mono block">{t.totalProfit}</span>
                  <strong className="text-sm font-black text-emerald-900 font-mono">
                    ₹{weeklyReview.totalProfit.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-mono block">{t.avgDailySales}</span>
                  <strong className="text-sm font-black text-slate-900 font-mono">
                    ₹{weeklyReview.avgDailySales.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-mono block">{t.avgDailyExpenses}</span>
                  <strong className="text-sm font-black text-slate-700 font-mono">
                    ₹{weeklyReview.avgDailyExpenses.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-mono block">{t.avgDailyProfit}</span>
                  <strong className="text-sm font-black text-emerald-700 font-mono">
                    ₹{weeklyReview.avgDailyProfit.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LOAN REPAYMENT TRACKING */}
        {activeTab === 'loan' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t.loanProgress}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.estimateNotice}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-300">
                  {t.onTrack}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-500 block font-sans font-semibold">
                    {t.loanAmount}
                  </span>
                  <span className="text-lg font-black text-slate-900 block mt-0.5">
                    ₹{loanTracking.loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-500 block font-sans font-semibold">
                    {t.interest}
                  </span>
                  <span className="text-lg font-black text-rose-700 block mt-0.5">
                    ₹{loanTracking.totalInterest.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-500 block font-sans font-semibold">
                    {t.monthlyPayment}
                  </span>
                  <span className="text-lg font-black text-slate-900 block mt-0.5">
                    ₹{loanTracking.monthlyPayment.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-500 block font-sans font-semibold">
                    {t.totalAmountToRepay}
                  </span>
                  <span className="text-lg font-black text-slate-900 block mt-0.5">
                    ₹{loanTracking.totalAmountToRepay.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>{t.amountPaid}: ₹{loanTracking.amountPaid.toLocaleString('en-IN')}</span>
                  <span>{t.amountRemaining}: ₹{loanTracking.amountRemaining.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${Math.round(
                        (loanTracking.amountPaid / (loanTracking.totalAmountToRepay || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>{t.nextPayment}: {loanTracking.nextPaymentDueDate}</span>
                  <span>{t.paymentStatus}: {t.onTrack}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Journey Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>{t.home}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
