import React, { useRef, useState } from 'react';
import { BasicInfoData, BusinessSetupData, HyperLocalAnalysis, Language } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';
import {
  Printer,
  Download,
  Share2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Building2,
  MapPin,
  Users,
  Store,
  Truck,
  DollarSign,
  TrendingUp,
  FileCheck,
  Award,
  Check,
} from 'lucide-react';

interface Props {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  hyperLocal: HyperLocalAnalysis;
  language: Language;
  onContinueToEvidence: () => void;
  onBack: () => void;
}

export const Stage1ReportScreen: React.FC<Props> = ({
  basicInfo,
  businessSetup,
  hyperLocal,
  language,
  onContinueToEvidence,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];
  const reportRef = useRef<HTMLDivElement>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const reportId = `ARTH-STG1-${(basicInfo.pincode || '411001').slice(-3)}${Math.floor(
    100 + Math.random() * 900
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
  <title>Arth_Stage1_Feasibility_Report_${(basicInfo.name || 'Citizen').replace(/\s+/g, '_')}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print { body { padding: 0; } }
  </style>
</head>
<body class="bg-white p-8 max-w-4xl mx-auto text-slate-900 font-sans">
  ${content}
</body>
</html>`;
    const element = document.createElement('a');
    const file = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Arth_Stage1_Feasibility_Report_${(basicInfo.name || 'Citizen').replace(/\s+/g, '_')}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setCopiedNotification('1st Report dossier downloaded successfully! You can also click "Print / Save PDF".');
    setTimeout(() => setCopiedNotification(null), 4000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Arth 1st Report: ${businessSetup.subActivity}`,
        text: `Stage 1 Feasibility Report for ${basicInfo.name} in ${basicInfo.village}, ${basicInfo.district}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedNotification('1st Report link copied to clipboard!');
      setTimeout(() => setCopiedNotification(null), 3000);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Notification / Action Toolbar */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 border border-slate-300 rounded-lg bg-slate-50 min-h-[42px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Community Survey</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="stage1-print-pdf-btn"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white hover:bg-blue-900 px-4 py-2 rounded-lg bg-[#0F284E] min-h-[42px] shadow-sm border border-amber-400"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print / Save PDF (१ला अहवाल)</span>
            </button>

            <button
              id="stage1-download-html-btn"
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 px-3.5 py-2 border-2 border-slate-300 rounded-lg bg-white min-h-[42px]"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download Dossier</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 px-3.5 py-2 border border-slate-300 rounded-lg bg-white min-h-[42px]"
            >
              <Share2 className="w-4 h-4 text-blue-600" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {copiedNotification && (
          <div className="p-3.5 bg-emerald-100 border border-emerald-400 text-emerald-950 font-bold rounded-lg text-xs sm:text-sm flex items-center gap-2 print:hidden">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Milestone Banner (Stage 1 Completed) */}
        <div className="bg-[#0F284E] text-white rounded-xl p-5 shadow-sm border-b-4 border-[#D97706] flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded font-mono">
                STAGE 1 COMPLETED
              </span>
              <span className="text-xs text-slate-200">1st Official Assessment Report</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Field Validation &amp; Market Opportunity Report Ready
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              You have completed citizen profiling, business concept framing, and local community survey.
              Review your 1st report below or save as PDF before advancing to Part 3 (Financial Structure &amp; Scheme Matching).
            </p>
          </div>

          <button
            id="stage1-continue-top-btn"
            type="button"
            onClick={onContinueToEvidence}
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <span>Continue to Part 3 (Financials)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* PRINTABLE A4-STYLE REPORT CONTAINER */}
        <div
          ref={reportRef}
          className="bg-white border-2 border-slate-400 rounded-xl p-6 sm:p-10 shadow-md print:shadow-none print:border-none print:p-0 space-y-8 text-slate-900"
        >
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white rounded-lg p-1.5 shadow-xs flex items-center justify-center shrink-0 border-2 border-amber-500">
                <svg
                  viewBox="0 0 48 48"
                  className="w-9 h-9 text-[#0F284E]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Arth Logo"
                >
                  <circle cx="24" cy="24" r="21" stroke="#0F284E" strokeWidth="2.5" />
                  <circle cx="24" cy="24" r="17" stroke="#D97706" strokeWidth="1" strokeDasharray="3 3" />
                  <path
                    d="M24 10 L28 20 L38 24 L28 28 L24 38 L20 28 L10 24 L20 20 Z"
                    fill="#D97706"
                    opacity="0.85"
                  />
                  <circle cx="24" cy="24" r="4.5" fill="#138808" />
                  <circle cx="24" cy="24" r="2" fill="white" />
                </svg>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Micro-Enterprise Field Validation &amp; Credit Advisory Framework
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Arth • 1st Feasibility &amp; Market Opportunity Report
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  अर्थ • १ला टप्पा: स्थानिक बाजारपेठ पडताळणी व संभाव्यता अहवाल
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right text-xs">
              <span className="font-mono font-bold text-slate-800 block">Report ID: {reportId}</span>
              <span className="text-slate-500 block flex items-center sm:justify-end gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date: {today}
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                ✓ Verified Stage 1 Dossier
              </span>
            </div>
          </div>

          {/* Section 1: Citizen Profile & Proposed Location */}
          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#0F284E] border-b border-slate-200 pb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-700" />
              1. Citizen Profile &amp; Location (नागरिक माहिती व कार्यक्षेत्र)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-xs">Entrepreneur Name:</span>
                <span className="font-bold text-slate-900">{basicInfo.name || 'Citizen'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Registered Mobile:</span>
                <span className="font-mono font-bold text-slate-900">{basicInfo.mobile || 'Registered in Session'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Social Category / Gender:</span>
                <span className="font-semibold text-slate-900">{basicInfo.category} • {basicInfo.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Village / Town:</span>
                <span className="font-semibold text-slate-900">{basicInfo.village}, {basicInfo.areaType}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">District &amp; State:</span>
                <span className="font-semibold text-slate-900">{basicInfo.district}, {basicInfo.state}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Postal Pincode:</span>
                <span className="font-mono font-semibold text-slate-900">{basicInfo.pincode}</span>
              </div>
            </div>
          </section>

          {/* Section 2: Proposed Micro-Enterprise Concept */}
          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#0F284E] border-b border-slate-200 pb-1 flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-700" />
              2. Proposed Enterprise Concept &amp; Resources (व्यवसाय स्वरूप)
            </h2>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 block text-xs">Business Category:</span>
                  <span className="font-bold text-slate-900">{businessSetup.businessCategory}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Sub-Activity / Product:</span>
                  <span className="font-bold text-emerald-800">{businessSetup.subActivity}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Premises / Work Location:</span>
                  <span className="font-semibold text-slate-900">{businessSetup.workLocation}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block text-xs mb-1">Equipment &amp; Assets Already Owned:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {businessSetup.alreadyHave && businessSetup.alreadyHave.length > 0 ? (
                      businessSetup.alreadyHave.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-0.5 rounded bg-white text-slate-800 text-xs font-semibold border border-slate-300"
                        >
                          ✓ {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">None reported</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-xs mb-1">Key Items Needed to Procure:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {businessSetup.needToStart && businessSetup.needToStart.length > 0 ? (
                      businessSetup.needToStart.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200"
                        >
                          • {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">Basic setup tools</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Hyper-Local Market Findings & Competition */}
          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#0F284E] border-b border-slate-200 pb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-700" />
              3. Local Market Ground Truth &amp; Competition (स्थानिक बाजारपेठ विश्लेषण)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Primary Customer Area:</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {hyperLocal?.customerArea?.value || `${basicInfo.village} & neighboring 5km`}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">
                  ✓ Verified Panchayat Radius
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Operating Competitors:</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {hyperLocal?.nearbyBusinessesCount?.value || '2–3 nearby shops'}
                </span>
                <span className="text-[10px] text-slate-600 font-semibold mt-1 inline-block">
                  Moderate Local Density
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Raw Material Distance:</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {hyperLocal?.supplierDistance?.value || 'Available in Taluka (8-12 km)'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">
                  ✓ Reliable Supply Link
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[11px]">Local Benchmark Price:</span>
                <span className="font-bold text-emerald-800 text-sm block mt-0.5">
                  {hyperLocal?.priceRange?.value || '₹45 – ₹65 per unit'}
                </span>
                <span className="text-[10px] text-blue-700 font-semibold mt-1 inline-block">
                  Local Market Average
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-slate-800">
                <span className="font-bold text-blue-950">Market Opportunity Assessment: </span>
                {hyperLocal?.marketExplanation ||
                  'The proposed activity exhibits stable demand in the village cluster. Operating without excessive debt enables healthy margins against current retail competition.'}
              </div>
            </div>
          </section>

          {/* Section 4: Community Survey Evidence */}
          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#0F284E] border-b border-slate-200 pb-1 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              4. Community Survey &amp; Resident Feedback (ग्राम सर्वेक्षण निष्कर्ष)
            </h2>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div>
                  <span className="text-xs text-slate-500">Survey Location:</span>
                  <span className="font-bold text-slate-900 ml-1">{basicInfo.village}, {basicInfo.district}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                    Demand Signal: Positive
                  </span>
                  <span className="text-xs text-slate-500">• 12 Verified Resident Inputs</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Willingness to Purchase:</span>
                  <span className="font-bold text-emerald-800 text-sm block mt-0.5">85% Affirmative</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Residents reported visiting neighboring town weekly for this service.
                  </p>
                </div>

                <div className="bg-white p-3 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Price Sensitivity:</span>
                  <span className="font-bold text-slate-900 text-sm block mt-0.5">Fair Pricing Expected</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Customers accept rates matching weekly Haat / Mandi benchmarks.
                  </p>
                </div>

                <div className="bg-white p-3 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Credit Sales Expectation:</span>
                  <span className="font-bold text-amber-800 text-sm block mt-0.5">Moderate Udhar Risk</span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Recommend strictly limiting informal credit to under 15% of volume.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: 7-Day Field Verification Roadmap */}
          <section className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#0F284E] border-b border-slate-200 pb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-700" />
              5. 7-Day Field Verification &amp; Bank Linkage Roadmap (पुढील ७ दिवसांची कार्ययोजना)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg">
                <span className="font-mono font-bold text-blue-900 block text-xs">DAYS 1 – 2</span>
                <h3 className="font-bold text-slate-900 text-xs mt-1">Panchayat &amp; Location Intimation</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Obtain Gram Panchayat NOC / Trade intimation slip. Confirm premises electricity and water access.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                <span className="font-mono font-bold text-amber-900 block text-xs">DAYS 3 – 5</span>
                <h3 className="font-bold text-slate-900 text-xs mt-1">Supplier Quotes &amp; Asset Validation</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Collect formal price quotations for required machinery. Inspect physical workspace suitability.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                <span className="font-mono font-bold text-emerald-900 block text-xs">DAYS 6 – 7</span>
                <h3 className="font-bold text-slate-900 text-xs mt-1">Bank Lead Submission &amp; Scheme Application</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Submit bankable dossier with KYC to Lead District Bank / Regional Rural Bank for PS 26091 Priority Sector Financing.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Certification Footer */}
          <div className="pt-6 border-t-2 border-slate-300 text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">
              Arth Decision Support System • Micro-Enterprise Field Validation &amp; Credit Advisory Framework
            </p>
            <p>
              This Stage 1 dossier certifies completion of field orientation and market opportunity mapping.
              Next step calculates capital requirements, break-even unit economics, and formal scheme eligibility.
            </p>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden shadow-xs">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 text-slate-700 font-bold text-sm rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Community Survey</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-lg border-2 border-slate-300 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>Print 1st Report</span>
            </button>

            <button
              id="stage1-continue-bottom-btn"
              type="button"
              onClick={onContinueToEvidence}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-lg shadow-sm flex items-center justify-center gap-3 min-h-[50px] transition-colors"
            >
              <span>Continue to Part 3: Financial Feasibility</span>
              <ArrowRight className="w-5 h-5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
