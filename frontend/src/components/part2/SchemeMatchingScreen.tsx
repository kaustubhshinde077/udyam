import React, { useState } from 'react';
import { SchemeMatch, Language } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';
import { DataTrustBadge } from '../common/DataTrustBadge';
import {
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Percent,
  Clock,
  Calendar,
  FileCheck,
  FileText,
  BadgeAlert,
  Coins,
  Building2,
  Sparkles,
} from 'lucide-react';

interface Props {
  schemeMatch: SchemeMatch;
  language: Language;
  projectCost?: number;
  ownContribution?: number;
  selectedSchemeType?: 'micro' | 'term';
  onSelectScheme?: (scheme: 'micro' | 'term') => void;
  onContinueToPart3: () => void;
  onBack: () => void;
  isDairyDemo?: boolean;
}

export const SchemeMatchingScreen: React.FC<Props> = ({
  schemeMatch,
  language,
  projectCost = 1000000,
  ownContribution = 100000,
  selectedSchemeType: externalScheme,
  onSelectScheme,
  onContinueToPart3,
  onBack,
  isDairyDemo = true,
}) => {
  const t = UI_TRANSLATIONS[language];

  // Default selection based on project cost
  const defaultSelection: 'micro' | 'term' = projectCost <= 140000 ? 'micro' : 'term';
  const [internalScheme, setInternalScheme] = useState<'term' | 'micro'>(
    externalScheme || defaultSelection
  );

  const activeScheme = externalScheme || internalScheme;

  const handleSelect = (scheme: 'micro' | 'term') => {
    setInternalScheme(scheme);
    if (onSelectScheme) {
      onSelectScheme(scheme);
    }
  };

  const isMicroSuitable = projectCost <= 140000;
  const isTermSuitable = projectCost > 140000 && projectCost <= 5000000;

  // Actual funding math based on project cost & own contribution
  const potentialLoanAmount = Math.max(0, projectCost - ownContribution);
  const microMaxLoan = Math.min(potentialLoanAmount, 125000);
  const termMaxLoan = Math.min(potentialLoanAmount, 4500000);

  const schemesData = {
    micro: {
      code: 'Option A: Micro Finance Scheme',
      title: 'Micro Finance Scheme for Tiny Trades & Artisans',
      target: 'Micro-enterprises, small village shops, rural artisans, home crafts',
      maxCost: 'Up to ₹1.40 Lakh',
      maxLoanText: 'Up to ₹1.25 Lakh (Max 90%)',
      fundingRatio: 'Up to 90% institutional funding',
      interest: '6.5% p.a.',
      interestNote: 'Concessional priority lending rate',
      tenure: '3 Years (36 Months)',
      moratorium: '3 Months initial setup grace period',
      isSuitable: isMicroSuitable,
      suitabilityReason: isMicroSuitable
        ? `Your project cost (${formatIndianCurrency(projectCost)}) falls within the ₹1.40 Lakh ceiling. Concessional 6.5% interest rate minimizes monthly financial burden.`
        : `Your projected cost (${formatIndianCurrency(projectCost)}) exceeds the ₹1.40 Lakh ceiling. Option B (Term Loan) is better sized for this capital requirement.`,
      calculatedLoan: microMaxLoan,
      calculatedEquity: Math.max(projectCost - microMaxLoan, Math.round(projectCost * 0.1)),
    },
    term: {
      code: 'Option B: Term Loan',
      title: 'Term Loan for Commercial & Expansion Units',
      target: 'Commercial dairy, agro-processing, poultry, small retail & service units',
      maxCost: '₹1.40 Lakh to ₹50.00 Lakh',
      maxLoanText: 'Above ₹1.25 Lakh up to ₹45.00 Lakh',
      fundingRatio: 'Up to 90% institutional funding',
      interest: '8.0% p.a.',
      interestNote: 'Priority sector enterprise rate',
      tenure: 'Up to 7 Years (84 Months)',
      moratorium: '6 Months initial setup grace period (plantation/construction activities may receive specific moratorium per official rules)',
      isSuitable: isTermSuitable || projectCost > 140000,
      suitabilityReason: projectCost > 140000
        ? `Your project scale (${formatIndianCurrency(projectCost)}) matches commercial expansion needs. Extended 7-year repayment window keeps monthly EMIs manageable.`
        : `Available for this project, but Option A offers a lower 6.5% concessional interest rate for setups under ₹1.40 Lakh.`,
      calculatedLoan: termMaxLoan,
      calculatedEquity: Math.max(projectCost - termMaxLoan, Math.round(projectCost * 0.1)),
    },
  };

  const current = schemesData[activeScheme];

  const requiredDocuments = [
    'Aadhaar Card & PAN Card of Applicant',
    'Proof of Place / Land / Shed (7/12 Extract, Rent Agreement, or Gram Panchayat NOC)',
    'Bank Account Statement (Last 6 Months)',
    'Machinery / Asset Quotations from Certified Vendors',
    'ARTH AI Feasibility Report & Financial Projections Dossier',
    'Passport Size Photographs (3 copies)',
  ];

  const applicationRoadmap = [
    {
      step: '1. Prepare Bankable Dossier',
      desc: 'Export comprehensive ARTH AI validation report with verified local market demand and cash-flow model.',
      icon: '📝',
    },
    {
      step: '2. Branch Submission',
      desc: 'Submit application at nearest commercial, regional rural bank (RRB), or DCCB branch.',
      icon: '🏛️',
    },
    {
      step: '3. Field Officer Verification',
      desc: 'Field inspection of village location, premises, electricity, and water infrastructure.',
      icon: '🔍',
    },
    {
      step: '4. Direct Vendor Disbursement',
      desc: 'Sanctioned funds disbursed directly to certified machinery, shed, or livestock suppliers.',
      icon: '🏦',
    },
    {
      step: '5. Moratorium Setup Period',
      desc: `${current.moratorium} — zero principal repayment while initial revenue stabilizes.`,
      icon: '⏳',
    },
    {
      step: '6. Predictable Repayments',
      desc: 'Structured monthly repayment supported by daily ARTH AI health and cash surplus monitoring.',
      icon: '📈',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  Section 10 • Institutional Credit Structure
                </span>
                <DataTrustBadge status="Official Source" source="PS 26091 Framework" compact />
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Prototype Credit Scheme Matching (PS 26091)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Select your financing window based on project scale. The chosen scheme directly feeds downstream financial and repayment calculations.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
              PS 26091 Prototype Parameters
            </span>
          </div>

          {/* TWO CLEAR CARDS: MICRO FINANCE VS TERM LOAN */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Micro Finance Scheme */}
            <div
              id="card-micro-finance-scheme"
              onClick={() => handleSelect('micro')}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                activeScheme === 'micro'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                        Option A
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                        Micro Finance Scheme
                      </h3>
                    </div>
                  </div>

                  {schemesData.micro.isSuitable ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Potentially Suitable
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      <BadgeAlert className="w-3 h-3" /> Scale Exceeded
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/80 p-2.5 rounded border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block text-[11px]">Project Cost:</span>
                    <strong className="text-slate-900 text-xs sm:text-sm">Up to ₹1.40 Lakh</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block text-[11px]">Max Loan:</span>
                    <strong className="text-slate-900 text-xs sm:text-sm">Up to ₹1.25 Lakh</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block text-[11px]">Interest Rate:</span>
                    <strong className="text-emerald-700 text-xs sm:text-sm">6.5% p.a. (Concessional)</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block text-[11px]">Tenure &amp; Grace:</span>
                    <strong className="text-slate-900 text-xs sm:text-sm">3 Years • 3 Mos Moratorium</strong>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded bg-white/90 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block text-[11px] mb-0.5">Suitability Assessment:</span>
                  <p className="text-slate-600 leading-snug">{schemesData.micro.suitabilityReason}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Funding: Up to 90% of project cost
                </span>
                <button
                  type="button"
                  className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                    activeScheme === 'micro'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {activeScheme === 'micro' ? 'Selected ✓' : 'Select Option A'}
                </button>
              </div>
            </div>

            {/* Card 2: Term Loan */}
            <div
              id="card-term-loan-scheme"
              onClick={() => handleSelect('term')}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                activeScheme === 'term'
                  ? 'border-[#0F284E] bg-blue-50/50 shadow-sm ring-2 ring-[#0F284E]/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
                        Option B
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                        Term Loan Facility
                      </h3>
                    </div>
                  </div>

                  {schemesData.term.isSuitable ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Potentially Suitable
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      <BadgeAlert className="w-3 h-3" /> Smaller Scale
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/80 p-2.5 rounded border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block text-[11px]">Project Cost:</span>
                    <strong className="text-slate-900 text-xs sm:text-sm">₹1.40L to ₹50.00L</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block text-[11px]">Max Loan:</span>
                    <strong className="text-slate-900 text-xs sm:text-sm">Up to ₹45.00 Lakh</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block text-[11px]">Interest Rate:</span>
                    <strong className="text-blue-900 text-xs sm:text-sm">8.0% p.a. (Priority)</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded border border-slate-200/80">
                    <span className="text-slate-500 font-semibold block text-[11px]">Tenure &amp; Grace:</span>
                    <strong className="text-slate-900 text-xs sm:text-sm">7 Years • 6 Mos Moratorium</strong>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded bg-white/90 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block text-[11px] mb-0.5">Suitability Assessment:</span>
                  <p className="text-slate-600 leading-snug">{schemesData.term.suitabilityReason}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Funding: Up to 90% of project cost
                </span>
                <button
                  type="button"
                  className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                    activeScheme === 'term'
                      ? 'bg-[#0F284E] text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {activeScheme === 'term' ? 'Selected ✓' : 'Select Option B'}
                </button>
              </div>
            </div>
          </div>

          {/* Institutional Advisory Notice */}
          <div className="mt-5 p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">PS 26091 Prototype Advisory Notice:</p>
              <p className="mt-0.5 leading-relaxed text-amber-900">
                &quot;Potentially suitable classification is based on problem statement rules. Final loan sanction, margin requirements, interest rate subventions, and repayment schedules depend strictly on official lending guidelines and branch appraisal. No government or commercial bank loan is guaranteed.&quot;
              </p>
            </div>
          </div>

          {/* Active Scheme Financial Structure Summary */}
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-teal-900 bg-teal-100 px-2.5 py-1 rounded border border-teal-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Financing Model: {current.code}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5">
                  {current.title}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">{current.target}</p>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-xs text-slate-500 block">Estimated Project Cost:</span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
                  {formatIndianCurrency(projectCost)}
                </span>
              </div>
            </div>

            {/* Financial Component Breakdown (NO fabricated subsidy) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-white p-4 rounded-xl border border-emerald-300 bg-emerald-50/20">
                <span className="text-xs font-bold text-emerald-900 block uppercase tracking-wider">
                  Promoter Equity / Own Contribution:
                </span>
                <p className="text-2xl font-extrabold text-emerald-900 font-mono mt-1">
                  {formatIndianCurrency(current.calculatedEquity)}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Your declared savings or minimum 10% equity commitment.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-300 bg-blue-50/20">
                <span className="text-xs font-bold text-blue-900 block uppercase tracking-wider">
                  Institutional Loan Support:
                </span>
                <p className="text-2xl font-extrabold text-blue-950 font-mono mt-1">
                  {formatIndianCurrency(current.calculatedLoan)}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Interest: {current.interest} • Tenure: {current.tenure} • Moratorium: {current.moratorium}
                </p>
              </div>
            </div>

            {/* Application Roadmap */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-teal-700" />
                Disbursement &amp; Repayment Flow:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                {applicationRoadmap.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <strong className="text-slate-900 font-bold">{item.step}</strong>
                    </div>
                    <p className="text-slate-600 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Checklist */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-700" />
                Document Checklist for Loan Appraisal:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-2.5 text-slate-700 font-semibold text-xs sm:text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50 min-h-[44px] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <button
            id="continue-to-part3-btn"
            type="button"
            onClick={onContinueToPart3}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0F284E] hover:bg-blue-950 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm min-h-[44px] flex items-center justify-center gap-2 transition-colors"
          >
            <span>Proceed with {current.code.split(':')[0]} (Part 3)</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
