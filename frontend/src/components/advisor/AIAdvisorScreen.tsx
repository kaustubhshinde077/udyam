import React, { useState } from 'react';
import {
  BasicInfoData,
  BusinessSetupData,
  FinancialFeasibilityResult,
  HyperLocalAnalysis,
  Language,
  RecommendationType,
} from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { DataTrustBadge } from '../common/DataTrustBadge';
import {
  Sparkles,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building2,
  MapPin,
  TrendingUp,
  ShieldAlert,
  Send,
  HelpCircle,
  Cpu,
} from 'lucide-react';

interface Props {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  hyperLocal: HyperLocalAnalysis;
  feasibility: FinancialFeasibilityResult;
  recommendation: {
    result: RecommendationType;
    reasons: string[];
    summary: string;
  };
  language: Language;
  onContinueToReport: () => void;
  onBack: () => void;
  isDairyDemo?: boolean;
}

export const AIAdvisorScreen: React.FC<Props> = ({
  basicInfo,
  businessSetup,
  hyperLocal,
  feasibility,
  recommendation,
  language,
  onContinueToReport,
  onBack,
  isDairyDemo = true,
}) => {
  const isFarmer = businessSetup?.entityType === 'farmer';
  const activityName = businessSetup?.subActivity || businessSetup?.businessCategory || 'Micro-Enterprise';
  const locationLabel = `${basicInfo?.village ? basicInfo.village + ', ' : ''}${basicInfo?.district || 'Your District'}`;
  const surplusFormatted = formatIndianCurrency(feasibility?.monthlySurplus || 0);
  const loanFormatted = formatIndianCurrency(feasibility?.potentialLoan || 0);
  const ownContributionFormatted = formatIndianCurrency(feasibility?.ownContribution || 0);

  const [customQuestion, setCustomQuestion] = useState('');
  const [interactiveMessages, setInteractiveMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: `Hello ${basicInfo.name || 'Entrepreneur'}! I have analyzed your ${activityName} plan for ${locationLabel}. The calculation model projects a monthly surplus of ${surplusFormatted} with a "${recommendation.result}" recommendation. What specific aspect would you like advice on?`,
      time: 'Just now',
    },
  ]);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const userText = customQuestion;
    setInteractiveMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: 'Just now' },
    ]);
    setCustomQuestion('');

    setTimeout(() => {
      let aiReply = '';
      const lower = userText.toLowerCase();
      if (lower.includes('loan') || lower.includes('scheme') || lower.includes('financing')) {
        aiReply = `Under the PS 26091 Priority Sector framework, projects up to ₹1.40 Lakh qualify for the Micro Finance Scheme (6.5% interest, 3-year tenure), while larger units up to ₹50 Lakh qualify for Term Loans (8.0% interest, 7-year tenure). You provide ${ownContributionFormatted} (minimum 10%) and borrow ${loanFormatted} with structured repayments.`;
      } else if (lower.includes('feed') || lower.includes('cost') || lower.includes('expense') || lower.includes('price')) {
        aiReply = `Local procurement costs typically fluctuate by 10%–20% seasonally in ${basicInfo.district || 'your district'}. We recommend locking in supply agreements or holding 1–2 months working capital buffer to safeguard your projected ${surplusFormatted} monthly cash surplus.`;
      } else if (lower.includes('risk') || lower.includes('loss') || lower.includes('difficult')) {
        aiReply = `In difficult conditions (-25% sales revenue), maintaining minimal fixed overheads and avoiding informal high-interest borrowing protects your family's cash flow. Start with a lean pilot scale before expanding.`;
      } else {
        aiReply = `Based on local benchmarks for ${locationLabel}, ensuring consistent customer relationships and adhering to your daily revenue and expense targets provides the highest probability of sustainable business health.`;
      }
      setInteractiveMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiReply, time: 'Just now' },
      ]);
    }, 600);
  };

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Contextual Advisory
                </span>
                <DataTrustBadge status="AI Generated" compact />
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                ARTH Business Advisory
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Objective guidance derived deterministically from your financial inputs, local market evidence, and risk factors.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block">Active Evaluation Context</span>
              <div className="text-slate-600 mt-1 space-y-0.5">
                <div><strong>Business:</strong> {activityName}</div>
                <div><strong>Location:</strong> {locationLabel}</div>
                <div><strong>Decision:</strong> <span className="font-bold text-blue-800">{recommendation.result}</span></div>
              </div>
            </div>
          </div>

          {/* 4 CONTEXTUAL SECTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* 1. WHY THIS MATTERS */}
            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
              <div className="flex items-center gap-2 text-blue-950 font-bold text-sm">
                <Compass className="w-4 h-4 text-blue-700" />
                <span>1. WHY THIS MATTERS (या निर्णयाचे महत्त्व)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Market evidence indicates {hyperLocal.demandSignal.toLowerCase()} demand. Committing to a {loanFormatted} loan without verified buyer willingness could create financial strain during off-peak seasons.
              </p>
              <div className="text-[11px] font-semibold text-blue-800 pt-1">
                ✦ Key takeaway: Base model monthly surplus of {surplusFormatted} is viable, but operating discipline is essential.
              </div>
            </div>

            {/* 2. WHAT TO DO NEXT */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>2. WHAT TO DO NEXT (पुढील प्रत्यक्ष पावले)</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>
                  <strong>Start with available own capital ({ownContributionFormatted})</strong> before drawing debt.
                </li>
                <li>
                  <strong>Secure initial regular customer commitments</strong> in {basicInfo.village || 'your village'} or local market.
                </li>
                <li>
                  <strong>Prepare documentation for PS 26091 prototype financing</strong> with verified quotations.
                </li>
              </ul>
            </div>

            {/* 3. RISK ASSESSMENT */}
            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-amber-800" />
                <span>3. RISK MITIGATION (धोका व्यवस्थापन)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Local Input Cost &amp; Seasonality:</strong> Fluctuations in supplies can reduce monthly margins by 10%–15%.
              </p>
              <div className="p-2 bg-amber-100/60 rounded-md text-[11px] text-amber-950 font-medium">
                Action: Build a 1-month working capital reserve before increasing sales volume or taking additional liabilities.
              </div>
            </div>

            {/* 4. LOCAL OPPORTUNITY */}
            <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
              <div className="flex items-center gap-2 text-teal-950 font-bold text-sm">
                <Lightbulb className="w-4 h-4 text-teal-800" />
                <span>4. VALUE-ADDED OPPORTUNITY (नफ्याची संधी)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {hyperLocal.localOpportunity || 'Selling directly to village consumers and local shops retains higher trade margins than intermediaries.'}
              </p>
              <div className="p-2 bg-teal-100/60 rounded-md text-[11px] text-teal-950 font-medium">
                Action: Target local village weekly haat days and neighborhood direct orders to improve cash realization.
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Query Assistant */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-700" />
              Ask Contextual Guidance Questions
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Grounded in {locationLabel} data
            </span>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {interactiveMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs ${
                    msg.sender === 'user'
                      ? 'bg-teal-800 text-white font-medium'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleAskQuestion} className="flex gap-2 pt-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="e.g. How should I manage repayments during the 6-month moratorium?"
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-700"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>

        {/* Navigation CTAs */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 min-h-[40px] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Repayment</span>
          </button>

          <button
            type="button"
            onClick={onContinueToReport}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-800 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-teal-900 min-h-[40px] transition-colors shadow-sm"
          >
            <span>Proceed to Feasibility Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
