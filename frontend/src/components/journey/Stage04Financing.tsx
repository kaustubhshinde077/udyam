import React, { useState } from 'react';
import {
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  IndianRupee,
  Clock,
  Percent,
  FileCheck,
  Calendar,
  Landmark,
  Sparkles,
  HelpCircle,
  Building,
  Check,
  FileText,
  BadgePercent,
  TrendingUp,
} from 'lucide-react';
import {
  FinancialFeasibilityResult,
  BasicInfoData,
  BusinessSetupData,
  Language,
} from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { formatIndianCurrency } from '../../utils/calculations';
import { PremiumButton } from '../common/PremiumButton';

interface Stage04FinancingProps {
  feasibility: FinancialFeasibilityResult;
  basicInfo?: BasicInfoData;
  businessSetup?: BusinessSetupData;
  language: Language;
  onSelectScheme: (scheme: 'micro' | 'term') => void;
  onNext: () => void;
  onBack: () => void;
}

export const Stage04Financing: React.FC<Stage04FinancingProps> = ({
  feasibility,
  basicInfo,
  businessSetup,
  language,
  onSelectScheme,
  onNext,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Auto-select based on project cost
  const recommendedScheme: 'micro' | 'term' =
    feasibility.totalProjectCost <= 140000 ? 'micro' : 'term';

  const [selectedScheme, setSelectedScheme] = useState<'micro' | 'term'>(
    feasibility.selectedScheme || recommendedScheme
  );

  const [activeTab, setActiveTab] = useState<'schemes' | 'loans' | 'subsidies' | 'other'>(
    'schemes'
  );

  const existingLoan = businessSetup?.existingLoan;
  const hasActiveLoan =
    existingLoan?.hasLoan === 'Yes' || businessSetup?.businessStatus === 'existing_with_loan';
  const financialHelpType = businessSetup?.financialHelpType || 'need_new_loan';

  const handleSelect = (scheme: 'micro' | 'term') => {
    setSelectedScheme(scheme);
    onSelectScheme(scheme);
  };

  // Government Schemes & Subsidies Catalog
  const governmentSchemes = [
    {
      id: 'mudra',
      name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
      category: 'Central Government Scheme',
      suitability: 'For micro shops, tailoring units, food processing, dairy and repair services.',
      amount: 'Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), Tarun (up to ₹10 Lakh)',
      documents: 'Aadhaar, PAN, proof of business address, quotation for machinery/stock',
      repayment: '3 to 5 years tenure, competitive interest (around 8.5% - 11% p.a.)',
      conditions: 'No collateral or third-party guarantee required for eligible microenterprises.',
      tag: 'Collateral-Free',
    },
    {
      id: 'pmegp',
      name: 'Prime Minister’s Employment Generation Programme (PMEGP)',
      category: 'Credit-Linked Subsidy Program',
      suitability: 'New micro manufacturing projects (up to ₹50 Lakh) and service units (up to ₹20 Lakh).',
      amount: 'Bank finance with 15% to 35% government capital subsidy on project cost.',
      documents: 'Project report, 8th pass certificate (for projects > ₹10 Lakh), caste/residence cert',
      repayment: '3 to 7 years with initial moratorium during setup.',
      conditions: 'Beneficiary contribution: 5% (special category / women / rural) or 10% (general).',
      tag: 'Up to 35% Subsidy',
    },
    {
      id: 'pmfme',
      name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
      category: 'Food Processing Sector',
      suitability: 'Grain mills, spice grinding, dairy products, bakery, pickles, and snack units.',
      amount: 'Credit-linked capital subsidy @ 35% of eligible project cost, max ₹10 Lakh per unit.',
      documents: 'FSSAI basic registration / Udyam, address proof, raw material plan',
      repayment: 'Bank term loan tenure of 5 to 7 years.',
      conditions: 'One District One Product (ODOP) priority, seed capital for SHG members.',
      tag: 'Agro & Food',
    },
  ];

  const otherFinancingOptions = [
    {
      id: 'shg',
      name: 'Self Help Group (SHG) Bank Linkage / NRLM',
      desc: 'Collective credit for women microentrepreneurs at subsidized interest (around 7% or lower with subvention).',
      features: 'Group guarantee, low documentation, peer support, flexible repayment cycle.',
    },
    {
      id: 'equipment',
      name: 'Machinery & Equipment Hypothecation / Lease',
      desc: 'Vendor or NBFC financing specifically tied to the asset (refrigerator, flour mill, auto rikshaw).',
      features: 'Faster turnaround, asset itself serves as primary security.',
    },
  ];

  const tabs = [
    { id: 'schemes', label: t.tabGovtSchemes || '🏛️ Government Schemes & Subsidies' },
    { id: 'loans', label: t.tabBankLoans || '🏦 Priority Sector Bank Loans' },
    { id: 'subsidies', label: t.tabSubsidies || '💰 Capital Subsidies & Relief' },
    { id: 'other', label: t.tabOtherFinance || '🤝 Other Financing Options' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 animate-fadeIn" id="stage04-financing-container">
      <div className="bg-white dark:bg-[#0c182a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-8">
        
        {/* Step Header */}
        <div className="space-y-3 border-b border-slate-100 dark:border-slate-800/80 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800/60">
              {t.stepOf?.replace('{current}', '05').replace('{total}', '07') || 'Step 05 of 07'} • {t.financingStepTitle || 'Financing & Schemes'}
            </span>
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700/60">
              {t.projectCost || 'Project Cost'}: <strong className="text-slate-900 dark:text-white font-bold">{formatIndianCurrency(feasibility.totalProjectCost)}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.exploreFinancing || 'Explore Suitable Financing & Support Options'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {t.financingSubtitle || 'ARTH AI evaluates priority sector loans, government subsidies, and safe debt repayment limits based on your ground cash flow.'}
          </p>
        </div>

        {/* EXISTING LOAN ALERT & REPAYMENT FIRST WARNING */}
        {hasActiveLoan && (
          <div className="p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 space-y-3" id="existing-loan-alert">
            <div className="flex items-start gap-3">
              <Landmark className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                    {t.activeLoanDetected || 'Active Loan Detected'}
                  </span>
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                    {existingLoan?.providerName || 'Bank'} ({existingLoan?.loanType || 'Business Loan'})
                  </span>
                </div>

                <p className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
                  Outstanding loan left: <strong>{formatIndianCurrency(existingLoan?.outstandingAmount || 45000)}</strong> with monthly payment of <strong>{formatIndianCurrency(existingLoan?.monthlyEMI || 2450)} / month</strong>.
                  Current status: <span className="font-bold underline">{existingLoan?.repaymentStatus === 'normal' ? 'Repaying normally on time' : 'Requires repayment caution'}</span>.
                </p>

                <div className="pt-2 text-xs text-amber-950 dark:text-amber-200 font-medium">
                  {financialHelpType === 'manage_existing_loan' || financialHelpType === 'reduce_repayment_burden' ? (
                    <span className="text-emerald-900 dark:text-emerald-200 font-bold bg-emerald-100/70 dark:bg-emerald-900/40 px-2.5 py-1 rounded-md inline-block border border-emerald-300 dark:border-emerald-700">
                      ✓ Focused on managing current loan without taking on new debt.
                    </span>
                  ) : (
                    <span>
                      ⚠️ <strong>Caution:</strong> Taking an additional loan will increase your total monthly EMI burden. Ensure your operating surplus comfortably covers all cumulative payments.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Responsible Advisory Notice */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101f35] border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white block">
              Decision Support &amp; Transparent Criteria (No Guaranteed Approvals)
            </span>
            <p className="leading-relaxed">
              {t.disclaimerScheme || 'These options are identified as potentially suitable matches based on national priority sector and microenterprise norms. Final approval depends entirely on the lending institution and statutory verification.'}
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3" id="financing-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 dark:bg-amber-400 text-amber-400 dark:text-slate-950 shadow-sm ring-1 ring-amber-400/40'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: GOVERNMENT SCHEMES */}
        {activeTab === 'schemes' && (
          <div className="space-y-4" id="tab-govt-schemes">
            {governmentSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c182a] hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4 shadow-2xs"
                id={`scheme-card-${scheme.id}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {scheme.tag}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">• {scheme.category}</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {scheme.name}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#101f35] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {t.whySuitsYou || 'Why this may suit you'}:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{scheme.suitability}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#101f35] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      {t.estimatedSupport || 'Estimated Support Amount'}:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{scheme.amount}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#101f35] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {t.docsRequired || 'What you may need (Documents)'}:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{scheme.documents}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#101f35] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      {t.repaymentInfo || 'Repayment Information & Conditions'}:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{scheme.repayment} • {scheme.conditions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PRIORITY SECTOR BANK LOANS */}
        {activeTab === 'loans' && (
          <div className="space-y-5" id="tab-bank-loans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option A: Micro Finance Scheme */}
              <div
                onClick={() => handleSelect('micro')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-5 ${
                  selectedScheme === 'micro'
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-400/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c182a] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                id="loan-option-micro"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                      Project Cost up to ₹1.40 Lakh
                    </span>
                    {recommendedScheme === 'micro' && (
                      <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                        Recommended Fit
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t.microFinanceName || 'Micro Finance Scheme (Priority Sector)'}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {t.microFinanceDesc || 'Designed for village retail stores, small livestock, handlooms, and home workshops.'}
                    </p>
                  </div>

                  {/* Key Specs */}
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-sans">Coverage:</span>
                      <span className="font-bold text-slate-900 dark:text-white">Up to 90% (Max ₹1.25 Lakh)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-sans">Interest Rate:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">6.5% - 8.5% p.a.</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-sans">Tenure:</span>
                      <span className="font-bold text-slate-900 dark:text-white">3 Years (36 Months)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-sans">Moratorium:</span>
                      <span className="font-bold text-slate-900 dark:text-white">3 Months</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className={`text-xs font-bold font-mono ${selectedScheme === 'micro' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {selectedScheme === 'micro' ? (t.selectedOption || '✓ Selected Option') : (t.clickToSelect || 'Click to Select')}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Fast processing</span>
                </div>
              </div>

              {/* Option B: Priority Sector Term Loan */}
              <div
                onClick={() => handleSelect('term')}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-5 ${
                  selectedScheme === 'term'
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-400/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c182a] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                id="loan-option-term"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                      Project Cost ₹1.40L to ₹50 Lakh
                    </span>
                    {recommendedScheme === 'term' && (
                      <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                        Recommended Fit
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t.termLoanName || 'Priority Sector Term Loan'}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {t.termLoanDesc || 'Structured for processing machines, commercial transport, dairy expansion, and equipment.'}
                    </p>
                  </div>

                  {/* Key Specs */}
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-sans">Coverage:</span>
                      <span className="font-bold text-slate-900 dark:text-white">Up to 90% (Max ₹45 Lakh)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-sans">Interest Rate:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">8.0% - 9.5% p.a.</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-sans">Tenure:</span>
                      <span className="font-bold text-slate-900 dark:text-white">Up to 7 Years (84 Months)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-sans">Moratorium:</span>
                      <span className="font-bold text-slate-900 dark:text-white">6 Months</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className={`text-xs font-bold font-mono ${selectedScheme === 'term' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {selectedScheme === 'term' ? (t.selectedOption || '✓ Selected Option') : (t.clickToSelect || 'Click to Select')}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Longer horizon</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CAPITAL SUBSIDIES & RELIEF */}
        {activeTab === 'subsidies' && (
          <div className="space-y-4" id="tab-subsidies">
            <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <BadgePercent className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
                    Government Interest Subvention &amp; Capital Subsidy Schemes
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">Targeted relief schemes for eligible microentrepreneurs</p>
                </div>
              </div>

              <p className="text-xs text-emerald-900 dark:text-emerald-200/90 leading-relaxed">
                Eligible microentrepreneurs, women-owned enterprises, and rural SHG units may qualify for interest subvention (reducing net interest by 2% to 3%) or upfront margin money back directly credited to their loan account.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 bg-white dark:bg-[#0c182a] rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                  <strong className="block text-slate-900 dark:text-white font-bold">Kisan / Livestock Credit Card:</strong>
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed block">3% prompt repayment incentive brings effective interest down to 4% p.a.</span>
                </div>
                <div className="p-4 bg-white dark:bg-[#0c182a] rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                  <strong className="block text-slate-900 dark:text-white font-bold">State Micro Enterprise Policy:</strong>
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed block">Reimbursement of electricity duty and patent / trademark subsidies.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OTHER FINANCING OPTIONS */}
        {activeTab === 'other' && (
          <div className="space-y-4" id="tab-other">
            {otherFinancingOptions.map((opt) => (
              <div key={opt.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c182a] space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{opt.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{opt.desc}</p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#101f35] text-xs text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-800">
                  <strong className="text-slate-900 dark:text-white font-bold">Key Highlights:</strong> {opt.features}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Plan Summary Bar */}
        <div className="p-5 rounded-2xl bg-slate-900 dark:bg-[#101f35] text-white border border-slate-800 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md" id="active-scheme-summary">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wide font-bold">
              {t.activeSelection || 'Active Selection'}
            </span>
            <p className="text-xs font-semibold text-slate-200">
              {selectedScheme === 'micro'
                ? 'Micro Finance Scheme (3 Years @ 6.5%)'
                : 'Priority Sector Term Loan (7 Years @ 8.0%)'}
            </p>
          </div>
          <div className="text-right self-end sm:self-auto">
            <span className="text-[10px] font-mono text-slate-400 uppercase">{t.estimatedMonthlyEmi || 'Estimated Monthly EMI'}</span>
            <p className="text-2xl font-black text-amber-300 font-mono">
              {formatIndianCurrency(feasibility.monthlyEMI)}
              <span className="text-xs font-sans text-slate-400 font-normal"> / month</span>
            </p>
          </div>
        </div>

        {/* Navigation Action Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#0c182a] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToFeasibility || 'Back to Feasibility'}</span>
          </button>

          <PremiumButton
            type="button"
            onClick={onNext}
            variant="gold"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {t.buildYourPlan || 'Build Your Plan'}
          </PremiumButton>
        </div>
      </div>
    </div>
  );
};
