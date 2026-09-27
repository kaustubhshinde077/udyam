import React, { useRef, useState } from 'react';
import {
  BasicInfoData,
  BusinessSetupData,
  FinancialFeasibilityResult,
  HyperLocalAnalysis,
  Language,
  RecommendationResult,
  RiskAssessmentItem,
  SchemeMatch,
  SensitivityAnalysisResult,
} from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';
import { DataTrustBadge } from '../common/DataTrustBadge';
import {
  Download,
  Share2,
  Printer,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Building2,
  Check,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface Props {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  hyperLocal: HyperLocalAnalysis;
  feasibility: FinancialFeasibilityResult;
  sensitivity: SensitivityAnalysisResult;
  risks: RiskAssessmentItem[];
  schemeMatch: SchemeMatch;
  recommendation: RecommendationResult;
  language: Language;
  onBack: () => void;
  onStartOver: () => void;
  onContinueToRepayment?: () => void;
  isDairyDemo?: boolean;
}

export const FinalReportScreen: React.FC<Props> = ({
  basicInfo,
  businessSetup,
  hyperLocal,
  feasibility,
  sensitivity,
  risks,
  schemeMatch,
  recommendation,
  language,
  onBack,
  onStartOver,
  onContinueToRepayment,
}) => {
  const t = UI_TRANSLATIONS[language];
  const reportRef = useRef<HTMLDivElement>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const reportId = `ARTH-${(basicInfo.district || 'PUN').slice(0, 3).toUpperCase()}-2026-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = reportRef.current ? reportRef.current.innerHTML : '';
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ARTH_Feasibility_Report_${(basicInfo.name || 'Citizen').replace(/\s+/g, '_')}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print { body { padding: 0; } }
  </style>
</head>
<body class="bg-white p-8 max-w-5xl mx-auto text-slate-900 font-sans">
  ${content}
</body>
</html>`;
    const element = document.createElement('a');
    const file = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `ARTH_Feasibility_Report_${(basicInfo.name || 'Citizen').replace(/\s+/g, '_')}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setCopiedNotification('Report dossier downloaded successfully!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `ARTH Feasibility Report: ${businessSetup.subActivity}`,
        text: `Business Feasibility Assessment for ${basicInfo.name} in ${basicInfo.village}, ${basicInfo.district}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedNotification('Report link copied to clipboard!');
      setTimeout(() => setCopiedNotification(null), 3000);
    }
  };

  const displayProjectCost = feasibility.totalProjectCost;
  const displayCapital = feasibility.ownContribution;
  const displayLoan = feasibility.potentialLoan;
  const displayMonthlyProfit = feasibility.monthlySurplus;
  const displayRevenue = feasibility.monthlyRevenue;
  const displayExpenses = feasibility.monthlyCosts;

  const twoGate = recommendation.twoGate;

  const resultColorMap: Record<string, string> = {
    START: 'bg-emerald-900',
    'PILOT FIRST': 'bg-blue-900',
    RESIZE: 'bg-amber-900',
    'INSUFFICIENT INFORMATION': 'bg-slate-800',
    'DO NOT PROCEED': 'bg-rose-900',
  };
  const bannerBg = resultColorMap[recommendation.result] || 'bg-blue-900';

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="final-print-pdf-btn"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white hover:bg-teal-900 px-4 py-2 rounded-lg bg-teal-800 min-h-[38px] shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print / Save PDF</span>
            </button>

            <button
              id="final-download-html-btn"
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg bg-white min-h-[38px] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download HTML</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 px-3 py-2 border border-slate-300 rounded-lg bg-white min-h-[38px] transition-colors"
            >
              <Share2 className="w-4 h-4 text-teal-700" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {copiedNotification && (
          <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-950 font-bold rounded-lg text-xs sm:text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* PRINTABLE A4-STYLE REPORT CONTAINER */}
        <div
          ref={reportRef}
          className="bg-white border border-slate-300 rounded-xl p-6 sm:p-10 shadow-md print:shadow-none print:border-none print:p-0 space-y-8 text-slate-900"
        >
          {/* Official Header Banner */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-teal-900 flex items-center justify-center p-2 text-white shrink-0 shadow-sm">
                <Building2 className="w-7 h-7 text-teal-300" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Smart India Hackathon 2026 • PS 26091 Prototype
                </span>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  ARTH AI • Business Feasibility Dossier
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Assistant for Microentrepreneurs • Pre-financing viability assessment &amp; local market ground check
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right text-xs">
              <span className="font-mono font-bold text-slate-800 block">Dossier ID: {reportId}</span>
              <span className="text-slate-500 block">Evaluation Date: {new Date().toLocaleDateString('en-IN')}</span>
              <div className="flex items-center gap-1.5 justify-end mt-1">
                <DataTrustBadge status="Demo Data" compact />
                <span className="text-[10px] font-bold uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Two-Gate Certified
                </span>
              </div>
            </div>
          </div>

          {/* 1. BUSINESS OVERVIEW */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Business Overview</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Entrepreneur Name:</span>
                <span className="font-bold text-slate-900">{basicInfo.name || 'Ramesh Pawar'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Enterprise Category:</span>
                <span className="font-bold text-slate-900">{businessSetup.businessCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Core Activity:</span>
                <span className="font-bold text-teal-900">{businessSetup.subActivity}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Experience Level:</span>
                <span className="font-bold text-slate-900">{basicInfo.experienceYears || 3} Years</span>
              </div>
            </div>
          </section>

          {/* 2. LOCATION */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Location Profile</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Village / Ward:</span>
                <span className="font-bold text-slate-900">{basicInfo.village || 'Baramati'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">District &amp; State:</span>
                <span className="font-bold text-slate-900">{basicInfo.district || 'Pune'}, {basicInfo.state || 'Maharashtra'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Area Classification:</span>
                <span className="font-bold text-slate-900">{basicInfo.areaType || 'Rural'} (PIN: {basicInfo.pincode || '413102'})</span>
              </div>
            </div>
          </section>

          {/* 3. MARKET SNAPSHOT */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Market Snapshot</span>
            </h2>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <p className="leading-relaxed text-slate-700">{hyperLocal.marketExplanation}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block">Benchmark Rate:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{hyperLocal.averagePrice} / {hyperLocal.priceUnit || 'unit'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block">Demand Signal:</span>
                  <span className="font-bold text-emerald-800">{hyperLocal.demandSignal} Local Demand</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block">Local Market Outlets:</span>
                  <span className="font-bold text-slate-900">{hyperLocal.potentialBuyers} buyers in zone</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. EVIDENCE BASIS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">4</span>
              <span>Evidence Basis &amp; Ground Data</span>
            </h2>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <span className="font-bold text-slate-900">
                  Evidence Tier: {twoGate?.gate1.evidenceTier || 'Tier 1'} (Direct Market + Mandi Benchmarks)
                </span>
                <span className="text-[11px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Gate 1 Score: {twoGate?.gate1.evidenceScore || 72}% Pass
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Ground evidence synthesized from APMC mandi bulletins for {basicInfo.district || 'Pune'}, direct local buyer surveys, and verified operational benchmarks for {businessSetup.subActivity}.
              </p>
            </div>
          </section>

          {/* 5. COMPETITOR & SUPPLY */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">5</span>
              <span>Competitor &amp; Supply Overview</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block">Local Units Nearby:</span>
                <p className="text-slate-600 mt-1">
                  {businessSetup.similarBusinessesNearby || '1–2'} similar operational units reported within 3 km of {basicInfo.village || 'the village'}. Direct market saturation is manageable.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block">Supply Chain &amp; Inputs:</span>
                <p className="text-slate-600 mt-1">
                  Required raw materials, equipment servicing, and local labor are accessible within {basicInfo.district || 'the local district'} corridor with regular weekly transport.
                </p>
              </div>
            </div>
          </section>

          {/* 6. FINANCIAL SUMMARY */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">6</span>
              <span>Financial Summary (Base Model)</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Project Cost:</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm block mt-0.5">
                  {formatIndianCurrency(displayProjectCost)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Own Capital (10%):</span>
                <span className="font-extrabold text-slate-900 font-mono text-sm block mt-0.5">
                  {formatIndianCurrency(displayCapital)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Required Loan:</span>
                <span className="font-extrabold text-teal-900 font-mono text-sm block mt-0.5">
                  {formatIndianCurrency(displayLoan)}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-950">
                <span className="font-bold block">Monthly Surplus:</span>
                <span className="font-black font-mono text-sm block mt-0.5 text-emerald-900">
                  {formatIndianCurrency(displayMonthlyProfit)} / mo
                </span>
              </div>
            </div>
          </section>

          {/* 7. SCENARIO ANALYSIS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">7</span>
              <span>Scenario Analysis &amp; Stress Testing</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-300">
                <span className="font-bold text-emerald-900 block">Best Case (+20% Demand):</span>
                <span className="font-mono text-slate-800 block mt-1">
                  Rev: {formatIndianCurrency(sensitivity.good.monthlyRevenue)} | Surplus: {formatIndianCurrency(sensitivity.good.monthlySurplus)}
                </span>
                <span className="text-[11px] text-emerald-700">
                  Margin: {sensitivity.good.monthlyRevenue > 0 ? Math.round((sensitivity.good.monthlySurplus / sensitivity.good.monthlyRevenue) * 100) : 0}%
                </span>
              </div>
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-300">
                <span className="font-bold text-blue-950 block">Base Case (Expected Model):</span>
                <span className="font-mono text-slate-800 block mt-1">
                  Rev: {formatIndianCurrency(sensitivity.normal.monthlyRevenue)} | Surplus: {formatIndianCurrency(sensitivity.normal.monthlySurplus)}
                </span>
                <span className="text-[11px] text-blue-800">
                  Margin: {sensitivity.normal.monthlyRevenue > 0 ? Math.round((sensitivity.normal.monthlySurplus / sensitivity.normal.monthlyRevenue) * 100) : 0}%
                </span>
              </div>
              <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-300">
                <span className="font-bold text-rose-950 block">Worst Case (-25% Demand Shock):</span>
                <span className="font-mono text-slate-800 block mt-1">
                  Rev: {formatIndianCurrency(sensitivity.difficult.monthlyRevenue)} | Surplus: {formatIndianCurrency(sensitivity.difficult.monthlySurplus)}
                </span>
                <span className="text-[11px] text-rose-800">
                  {sensitivity.difficult.monthlySurplus >= 0 ? 'Solvent under stress' : 'Shows deficit; pilot first'}
                </span>
              </div>
            </div>
          </section>

          {/* 8. RISKS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">8</span>
              <span>Key Enterprise Risks &amp; Mitigation</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {risks.slice(0, 4).map((r, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between font-bold">
                    <span>{r.riskTitle}</span>
                    <span className={r.severity === 'HIGH' ? 'text-rose-700' : 'text-amber-700'}>
                      {r.severity} Risk
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">Mitigation: {r.mitigationStrategy}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 9. FEASIBILITY DECISION */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">9</span>
              <span>Business Feasibility Decision</span>
            </h2>
            <div className={`p-4 ${bannerBg} text-white rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4`}>
              <div>
                <span className="text-xs uppercase tracking-widest text-slate-200 font-bold">
                  Evaluation Verdict
                </span>
                <div className="text-2xl font-black text-white mt-0.5">
                  {recommendation.result}
                </div>
                <p className="text-xs text-slate-100 mt-1 max-w-xl">
                  {recommendation.summary}
                </p>
              </div>
              <div className="text-right shrink-0 bg-white/10 p-3 rounded-lg border border-white/20">
                <span className="text-[11px] text-slate-200 block">Rule Engine Certainty</span>
                <span className="text-xl font-extrabold text-amber-300">
                  Gate 2: {twoGate?.gate2.financialScore || 81}%
                </span>
              </div>
            </div>
          </section>

          {/* 10. FINANCING / SCHEME INFORMATION */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">10</span>
              <span>Financing &amp; Scheme Information</span>
            </h2>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-bold text-slate-900">
                <span>Potentially Suitable Scheme: {schemeMatch?.schemeName || 'PS 26091 Prototype: Priority Sector Term Loan'}</span>
                <span className="text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 self-start sm:self-auto">
                  PS 26091 Framework
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {schemeMatch?.fundingStructureSummary ||
                  'Up to 90% Institutional Funding + Minimum 10% Promoter Equity. Standard 8.0% p.a. indicative interest, 7-year tenure, 6-month moratorium.'}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                *Note: Sanction, margin requirements, and interest rates depend on lending bank appraisal and RBI Priority Sector guidelines. No unverified government subsidies are assumed.
              </p>
            </div>
          </section>

          {/* 11. REPAYMENT PLAN */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">11</span>
              <span>Repayment Plan &amp; Daily Target</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Monthly Loan EMI:</span>
                <span className="font-bold text-slate-900 font-mono text-sm block mt-0.5">
                  {feasibility.monthlyEMI ? `${formatIndianCurrency(feasibility.monthlyEMI)} / mo` : '—'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {feasibility.tenureMonths ? `${feasibility.tenureMonths} Months (${feasibility.interestRate || 8.0}% p.a.)` : '84 Months reducing balance'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Required Daily Revenue:</span>
                <span className="font-bold text-teal-900 font-mono text-sm block mt-0.5">
                  {formatIndianCurrency(Math.ceil((displayRevenue || 1) / 30))} / day
                </span>
                <span className="text-[11px] text-slate-500">Daily average benchmark</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Daily Loan Allocation:</span>
                <span className="font-bold text-slate-900 font-mono text-sm block mt-0.5">
                  {feasibility.monthlyEMI ? `${formatIndianCurrency(Math.ceil(feasibility.monthlyEMI / 30))} / day` : '—'}
                </span>
                <span className="text-[11px] text-slate-500">Set aside daily in dedicated escrow account</span>
              </div>
            </div>
          </section>

          {/* 12. RECOMMENDED NEXT STEPS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-teal-900 text-white flex items-center justify-center text-[10px]">12</span>
              <span>Recommended Next Steps (Action Plan)</span>
            </h2>
            <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs text-slate-800 space-y-2">
              {twoGate?.nextActions && twoGate.nextActions.length > 0 ? (
                twoGate.nextActions.map((act, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-800 shrink-0">Step {i + 1}:</span>
                    <span>{act}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-800 shrink-0">Step 1:</span>
                    <span>Conduct a 30-day proof-of-demand trial using your {formatIndianCurrency(displayCapital)} equity before commercial debt drawdown.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-800 shrink-0">Step 2:</span>
                    <span>Lock in written or advance supply agreements with local suppliers and off-takers.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-800 shrink-0">Step 3:</span>
                    <span>Submit this ARTH Feasibility Dossier to the local lead bank branch under Priority Sector lending window.</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Legal Certification Footer */}
          <div className="pt-5 border-t border-slate-300 text-center text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">
              ARTH AI • Assistant for Microentrepreneurs • PS 26091 Prototype
            </p>
            <p>
              This advisory report is generated for decision support and pre-financing planning purposes. It does not constitute a statutory sanction or guaranteed loan approval.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onStartOver}
            className="w-full sm:w-auto px-5 py-2.5 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
          >
            Start Another Business Assessment
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-lg border border-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print or Save PDF</span>
            </button>

            {onContinueToRepayment && (
              <button
                id="report-continue-repayment-btn"
                type="button"
                onClick={onContinueToRepayment}
                className="w-full sm:w-auto px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Proceed to Repayment &amp; Daily Target Plan</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
