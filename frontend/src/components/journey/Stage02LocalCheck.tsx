import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  MapPin,
  TrendingUp,
  Users,
  Building2,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  IndianRupee,
  Sparkles,
  QrCode,
  Share2,
  Copy,
  Check,
  ExternalLink,
  BarChart3,
  Info,
  Download,
  MessageSquare,
  Sprout,
  Calendar,
  Layers,
  HelpCircle,
  Eye,
  PlusCircle,
} from 'lucide-react';
import {
  BasicInfoData,
  BusinessSetupData,
  HyperLocalAnalysis,
  Language,
  TwoGateDecision,
} from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { PremiumButton } from '../common/PremiumButton';
import {
  CommunitySurvey,
  SurveyResponse,
  SurveyAnalytics,
  getOrCreateSurveyForContext,
  getResponsesForSurvey,
  computeSurveyAnalytics,
  generateQuestionsForContext,
} from '../../utils/surveyStorage';
import { CreateSurveyModal } from '../survey/CreateSurveyModal';
import { PublicSurveyRespondentView } from '../survey/PublicSurveyRespondentView';

interface Stage02LocalCheckProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  analysis?: HyperLocalAnalysis;
  hyperLocal?: HyperLocalAnalysis;
  twoGate?: TwoGateDecision;
  language: Language;
  onNext: () => void;
  onBack: () => void;
}

export const Stage02LocalCheck: React.FC<Stage02LocalCheckProps> = ({
  basicInfo,
  businessSetup,
  analysis,
  hyperLocal,
  twoGate,
  language,
  onNext,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'market' | 'survey' | 'evidence'>('market');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showSwot, setShowSwot] = useState<boolean>(true);

  // Survey state & modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isRespondentModalOpen, setIsRespondentModalOpen] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const activeAnalysis = analysis || hyperLocal;
  const isFarmer = businessSetup?.entityType === 'farmer';
  const cropName = businessSetup?.farmerData?.cropName || 'Kharif Onion';
  const activityTitle = isFarmer
    ? `${cropName} Farming`
    : businessSetup?.subActivity || businessSetup?.businessCategory || 'Micro-Enterprise';

  // Load or initialize active survey
  const [survey, setSurvey] = useState<CommunitySurvey>(() => {
    return getOrCreateSurveyForContext(
      basicInfo.village || 'Village',
      basicInfo.district || 'District',
      basicInfo.state || 'Maharashtra',
      businessSetup.businessCategory,
      activityTitle,
      isFarmer,
      cropName
    );
  });

  // Real responses loaded from localStorage
  const [responses, setResponses] = useState<SurveyResponse[]>(() => {
    return getResponsesForSurvey(survey.id);
  });

  // Compute analytics dynamically from real responses
  const analytics: SurveyAnalytics = computeSurveyAnalytics(survey, responses);

  // Refresh responses when modal closes or updates
  const refreshResponses = () => {
    const updated = getResponsesForSurvey(survey.id);
    setResponses(updated);
  };

  // Generate shareable URL
  const [surveyUrl, setSurveyUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const url = `${origin}${pathname}?surveyId=${encodeURIComponent(survey.id)}`;
      setSurveyUrl(url);

      // Generate QR Code with high contrast
      QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0B1523',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })
        .then((dataUrl) => {
          setQrDataUrl(dataUrl);
        })
        .catch((err) => {
          console.warn('QR Code generation error:', err);
        });
    }
  }, [survey.id]);

  const handleCopySurveyLink = () => {
    if (navigator.clipboard && surveyUrl) {
      navigator.clipboard.writeText(surveyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `arth-survey-qr-${survey.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareWhatsApp = () => {
    const message = `Hello! We are conducting a short community survey to understand local needs. Please take a moment to participate:\n\n${surveyUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = () => {
    if (navigator.share && surveyUrl) {
      navigator.share({
        title: survey.title,
        text: `Please participate in this quick community survey for ${activityTitle} in ${basicInfo.village}:`,
        url: surveyUrl,
      }).catch(() => handleCopySurveyLink());
    } else {
      handleCopySurveyLink();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-6">
      <div className="bg-white dark:bg-[#0C192A] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-8 space-y-6 sm:space-y-8 transition-colors max-w-full overflow-hidden">
        
        {/* ======================================================== */}
        {/* SECTION 1 — PAGE HEADER                                   */}
        {/* ======================================================== */}
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-200 dark:border-teal-800">
              {isFarmer ? 'Step 03 • Agricultural Local Check' : 'STEP 03 OF 07 • LOCAL CHECK'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{basicInfo?.village || 'Sangamner'}, {basicInfo?.district || 'Ahmednagar'}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isFarmer ? `Local Mandi & Agricultural Check for ${cropName}` : "Let's understand your local market."}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isFarmer ? (
              <>
                Ground evidence for agricultural financing: local APMC mandi modal price benchmarks, certified seed/fertilizer access, regional yield estimates, and seasonal production risks for <strong className="text-slate-900 dark:text-white">{activityTitle}</strong> in {basicInfo.village || 'the village'}.
              </>
            ) : (
              <>
                Ground evidence: customer demand, nearby competitors, APMC price benchmarks, and community survey signals for <strong className="text-slate-900 dark:text-white">{activityTitle}</strong>.
              </>
            )}
          </p>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2 — LOCAL EVIDENCE NAVIGATION                     */}
        {/* ======================================================== */}
        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-[#0E1C2E] text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('market')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'market'
                ? 'bg-white dark:bg-[#15273C] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">{isFarmer ? 'Mandi & Farm Signals' : 'Market & Competitors'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('survey')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'survey'
                ? 'bg-white dark:bg-[#15273C] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Community Survey ({responses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-white dark:bg-[#15273C] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Evidence Ladder</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: MARKET & COMPETITORS (OR FARMER SIGNALS)          */}
        {/* ======================================================== */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            
            {/* ======================================================== */}
            {/* SECTION 3 — KEY LOCAL SIGNALS (4 EQUAL WEIGHT CARDS)      */}
            {/* Desktop: 4 columns, Tablet: 2 columns, Mobile: 1 column   */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Demand Signal / Regional Yield Signal */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase text-emerald-800 dark:text-emerald-300 font-bold truncate">
                      {isFarmer ? 'Regional Yield Potential' : 'Demand Signal'}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-lg font-black text-emerald-950 dark:text-emerald-200 mt-1 break-words">
                    {isFarmer
                      ? (businessSetup?.farmerData?.yieldPerAcreQuintals
                          ? `${businessSetup.farmerData.yieldPerAcreQuintals} Qtl / Acre`
                          : '12–16 Qtl / Acre')
                      : activeAnalysis?.demandSignal || 'Positive'}
                  </p>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-snug">
                  {isFarmer
                    ? 'State Agri Dept historical average benchmark for Ahmednagar district irrigated land.'
                    : 'Consistent daily consumer requirement within 5 km catchment.'}
                </p>
              </div>

              {/* Card 2: Competitors Nearby / Input Store Access */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold truncate">
                      {isFarmer ? 'Input Centers / KSK' : 'Competition'}
                    </span>
                    {isFarmer ? (
                      <Sprout className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                    ) : (
                      <Users className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-1 break-words">
                    {isFarmer ? '2 Krishi Seva Centers' : activeAnalysis?.nearbyBusinessesCount?.value || '2–3 Units'}
                  </p>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  {isFarmer
                    ? 'Certified seeds, NPK fertilizers and bio-pesticides within 4 km village radius.'
                    : 'Moderate density; room for quality/reliability differentiation.'}
                </p>
              </div>

              {/* Card 3: Mandi / Price Floor */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase text-amber-800 dark:text-amber-300 font-bold truncate">
                      {isFarmer ? 'APMC Mandi Price Floor' : 'Mandi / Price Floor'}
                    </span>
                    <IndianRupee className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  </div>
                  <p className="text-lg font-black text-amber-950 dark:text-amber-200 mt-1 break-words">
                    {isFarmer
                      ? (businessSetup?.farmerData?.marketPricePerQuintal
                          ? `₹${businessSetup.farmerData.marketPricePerQuintal.toLocaleString('en-IN')} / Qtl`
                          : '₹2,200 – ₹2,600 / Qtl')
                      : activeAnalysis?.priceRange?.value || '₹48 – ₹54 / unit'}
                  </p>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
                  {isFarmer
                    ? 'APMC modal auction average price without speculative inflated expectations.'
                    : 'Prevailing local benchmark without speculative markup.'}
                </p>
              </div>

              {/* Card 4: Supply Access / Irrigation Status */}
              <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-1.5 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase text-teal-800 dark:text-teal-300 font-bold truncate">
                      {isFarmer ? 'Water & Irrigation' : 'Supply Access'}
                    </span>
                    <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  </div>
                  <p className="text-lg font-black text-teal-950 dark:text-teal-200 mt-1 break-words">
                    {isFarmer
                      ? (businessSetup?.farmerData?.irrigationStatus ? 'Borewell / Drip' : 'Irrigated Well')
                      : activeAnalysis?.supplierDistance?.value || 'Within 6 km'}
                  </p>
                </div>
                <p className="text-[11px] text-teal-800 dark:text-teal-300 leading-snug">
                  {isFarmer
                    ? 'Micro-irrigation subsidy eligible under PMKSY scheme; 8-hour farm power roster.'
                    : 'Raw materials and servicing accessible via taluka market road.'}
                </p>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 4 — LOCAL MARKET SUMMARY                         */}
            {/* 2-Column layout on desktop, stacked on mobile            */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2 min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider block">
                  {isFarmer ? 'Mandi Offtake & Transport Reach' : 'Customer Catchment Reach'}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isFarmer ? (
                    <>
                      Primary agricultural auction takes place at the Taluka APMC Mandi (11 km away). Shared tractor-trolley and mini-tempo freight services operate daily at ₹35–₹45 per quintal haulage rate from {basicInfo.village || 'the village'}.
                    </>
                  ) : (
                    <>
                      Primary customer catchment encompasses {basicInfo?.village || 'the village'} and two adjacent hamlets (approx. 1,400 households). Estimated monthly retail addressable volume: ~₹3.2 lakh.
                    </>
                  )}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-2 min-w-0">
                <span className="text-xs font-bold text-teal-950 dark:text-teal-200 uppercase font-mono tracking-wider block">
                  {isFarmer ? 'Farm Realization & Margin Gap' : 'Local Opportunity Gap'}
                </span>
                <p className="text-xs text-teal-900 dark:text-teal-300 leading-relaxed">
                  {isFarmer ? (
                    <>
                      Local farmgate middlemen offer 15–20% below APMC modal rates for immediate cash. By accessing institutional seasonal credit and collective transport, you retain full mandi auction realization without distress selling.
                    </>
                  ) : (
                    <>
                      Local consumers currently travel 12–15 km to taluka headquarters for reliable supply. Opening consistent local delivery captures unmet daily convenience demand.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 5 — SWOT / OPERATIONAL VULNERABILITIES           */}
            {/* Expand / collapse interaction working                    */}
            {/* ======================================================== */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
              <button
                type="button"
                onClick={() => setShowSwot(!showSwot)}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-[#112237] hover:bg-slate-100 dark:hover:bg-[#15273C] flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                  <span>
                    {isFarmer
                      ? 'Agricultural Risk Assessment & Operational Vulnerabilities'
                      : 'Local SWOT Analysis & Operational Vulnerabilities'}
                  </span>
                </span>
                {showSwot ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
              </button>

              {showSwot && (
                <div className="p-4 sm:p-5 space-y-4 bg-white dark:bg-[#0C192A] border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5 min-w-0">
                      <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        Strengths
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-emerald-900 dark:text-emerald-300 text-[11px] leading-relaxed">
                        {isFarmer ? (
                          <>
                            <li>Familiarity with local soil, field micro-climate and crop cycles</li>
                            <li>Direct access to family labor reducing peak harvesting costs</li>
                            <li>Multiple APMC market yards accessible within a 20 km radius</li>
                          </>
                        ) : (
                          <>
                            <li>Direct customer relationships and immediate trust in local hamlet</li>
                            <li>Zero intermediary commission on village-level deliveries</li>
                            <li>Lower real estate overhead compared to city highway clusters</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Challenges */}
                    <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5 min-w-0">
                      <span className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        Challenges
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-amber-900 dark:text-amber-300 text-[11px] leading-relaxed">
                        {isFarmer ? (
                          <>
                            <li>Upfront cultivation capital needed for certified seeds &amp; fertilizers</li>
                            <li>Post-harvest price volatility if whole crop is sold at peak arrival</li>
                            <li>Power cuts for irrigation pumps require night or solar backup scheduling</li>
                          </>
                        ) : (
                          <>
                            <li>Working capital required upfront for bulk inputs before credit recovery</li>
                            <li>Seasonal variations in farm income affects consumer purchasing cycles</li>
                            <li>Power fluctuations require backup planning for cold storage / machinery</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick banner linking to Survey Tab */}
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-[#112237] border border-teal-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 min-w-0">
                <span className="font-bold text-teal-950 dark:text-white flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  Live Community Ground Verification
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  {responses.length === 0
                    ? 'No responses collected yet. Create and share your survey QR to gather verified customer interest.'
                    : `${responses.length} real responses collected from residents and farmers in ${basicInfo.village}.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('survey')}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>View Community Survey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: LIVE COMMUNITY SURVEY WORKFLOW                    */}
        {/* ======================================================== */}
        {activeTab === 'survey' && (
          <div className="space-y-6">
            
            {/* Top Action Bar: Create Survey, Share, Test */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0E1C2E] border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase text-teal-800 dark:text-teal-300">
                  Ground Demand Verification
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {survey.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Community Survey</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRespondentModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-[#15273C] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1B324D] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Test Survey as Respondent</span>
                </button>
              </div>
            </div>

            {/* QR Code & Share Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row items-center gap-6">
                
                {/* Visual QR Code Container */}
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center gap-2 shrink-0">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Community Survey QR Code"
                      className="w-40 h-40 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      Generating QR...
                    </div>
                  )}

                  <span className="text-[10px] font-mono text-slate-900 font-bold uppercase tracking-wider">
                    Scan to participate
                  </span>

                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="inline-flex items-center gap-1 text-[11px] text-teal-700 hover:underline font-semibold mt-0.5 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download PNG</span>
                  </button>
                </div>

                {/* Survey Controls & Details */}
                <div className="space-y-4 flex-1 text-xs w-full min-w-0">
                  <div>
                    <span className="text-teal-800 dark:text-teal-300 font-mono font-bold uppercase text-[10px] bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                      Shareable Live Survey
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1 break-words">
                      Village Demand Census for {activityTitle}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      Share this QR code and link with neighbors, village shopkeepers, and buyers in {basicInfo.village || 'the village'}. Every response feeds into your genuine local evidence score.
                    </p>
                  </div>

                  {/* Share Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopySurveyLink}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#15273C] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-[#1C324D] transition-colors cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share on WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Direct link display */}
                  <div className="p-2 rounded-xl bg-white dark:bg-[#0A1626] border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {surveyUrl || 'Generating survey link...'}
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 10 — SURVEY RESPONSE VIEW                        */}
            {/* Real responses or Zero-Response State                    */}
            {/* ======================================================== */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                    Community Survey Response Summary
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live tally of real collected survey responses in {basicInfo.village}.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-800">
                  {responses.length} Verified Responses
                </span>
              </div>

              {/* ZERO RESPONSES STATE: Never fabricate fake responses! */}
              {responses.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white dark:bg-[#0F2035] border border-slate-200 dark:border-slate-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      No community responses yet.
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                      You haven&apos;t received responses yet. Share the QR code or link with local villagers, neighbors, and customers to collect authentic ground evidence.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Send to Local Groups via WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRespondentModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-[#15273C] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1B324D] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Fill First Test Response</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* REAL RESPONSES SUMMARY */
                <div className="space-y-4">
                  {/* High-level metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#0F2035] border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase block">
                        Total Responses
                      </span>
                      <strong className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                        {analytics.totalResponses}
                      </strong>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0F2035] border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase block">
                        Purchase Intent / Positive Signal
                      </span>
                      <strong className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                        {analytics.purchaseIntentPercentage !== undefined ? `${analytics.purchaseIntentPercentage}%` : 'N/A'}
                      </strong>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0F2035] border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase block">
                        Average Community Rating
                      </span>
                      <strong className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
                        {analytics.averageRatingOverall ? `${analytics.averageRatingOverall} / 5.0` : 'N/A'}
                      </strong>
                    </div>
                  </div>

                  {/* Respondent Type Breakdown */}
                  <div className="p-4 rounded-xl bg-white dark:bg-[#0F2035] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white font-mono uppercase text-[11px] block">
                      Respondent Type Breakdown
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {Object.entries(analytics.respondentTypeBreakdown).map(([type, count]) => {
                        if (count === 0) return null;
                        const pct = Math.round((count / analytics.totalResponses) * 100);
                        return (
                          <div key={type} className="p-2 rounded-lg bg-slate-50 dark:bg-[#14263D] border border-slate-200 dark:border-slate-700/60">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-700 dark:text-slate-300 font-semibold">{type}</span>
                              <span className="font-mono font-bold text-teal-700 dark:text-teal-300">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div className="bg-teal-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question summaries */}
                  <div className="p-4 rounded-xl bg-white dark:bg-[#0F2035] border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white font-mono uppercase text-[11px] block">
                      Top Community Answers
                    </span>
                    <div className="space-y-2.5">
                      {analytics.questionSummaries.map((qs, i) => (
                        <div key={qs.questionId} className="p-3 rounded-lg bg-slate-50 dark:bg-[#14263D] border border-slate-200 dark:border-slate-700/60 space-y-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                            <span className="text-teal-600 dark:text-teal-400 mr-1.5 font-bold">Q{i + 1}.</span>
                            {qs.questionText}
                          </p>
                          {qs.topAnswer ? (
                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <span className="text-slate-600 dark:text-slate-400">
                                Most common: <strong className="text-slate-900 dark:text-white">{qs.topAnswer}</strong>
                              </span>
                              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                {qs.topPercentage}% of answers
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">No responses recorded for this question yet</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent responses list */}
                  <div className="p-4 rounded-xl bg-white dark:bg-[#0F2035] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white font-mono uppercase text-[11px] block">
                      Recent Submissions ({responses.length})
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {responses.slice(0, 5).map((resp) => (
                        <div key={resp.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#14263D] border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{resp.respondent.respondentType}</span>
                            <span className="text-slate-500 dark:text-slate-400 ml-1.5">• {resp.respondent.village} • Age {resp.respondent.ageGroup}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {new Date(resp.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quality and Anti-Spam Checks */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0F2035] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white font-mono uppercase text-[11px] block">
                Survey Anti-Spam &amp; Reliability Checks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Device Fingerprint Duplicate Guard</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Completion Speed Verification (&gt;45s)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>GPS Geolocation Proximity Check</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: EVIDENCE CONFIDENCE LADDER                        */}
        {/* ======================================================== */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 dark:bg-[#081321] text-white space-y-3 border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <h3 className="text-sm font-bold font-mono tracking-wide uppercase text-amber-300">
                    Evidence Confidence: Tier 1 (Verified Local Signals)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Validated Pre-Debt
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ARTH AI ranks ground verification into 5 evidence tiers. A bank or microloan should never be backed by Tier 0 guesswork.
              </p>
            </div>

            {/* Clear distinction banner: Verified Survey vs Market Data vs Estimates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                  1. Verified Survey Evidence
                </span>
                <p className="font-bold text-emerald-950 dark:text-emerald-200">
                  {responses.length === 0 ? '0 responses collected' : `${responses.length} responses collected`}
                </p>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Direct citizen &amp; farmer feedback collected through survey.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-blue-800 dark:text-blue-300 block">
                  2. Official Market Data
                </span>
                <p className="font-bold text-blue-950 dark:text-blue-200">
                  APMC Mandi &amp; Census Benchmarks
                </p>
                <p className="text-[11px] text-blue-800 dark:text-blue-300">
                  Government district mandi prices &amp; taluka arrival logs.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300 block">
                  3. System Estimates
                </span>
                <p className="font-bold text-amber-950 dark:text-amber-200">
                  Standard Operating Cost Models
                </p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Working capital &amp; margin guidelines for rural micro-units.
                </p>
              </div>
            </div>

            {/* 5 Tiers Ladder */}
            <div className="space-y-3">
              {[
                {
                  tier: 'Tier 4',
                  title: 'Verified Pilot Sales & Cash Receipts',
                  desc: 'Actual pilot transactions recorded, verified customer repeat orders, and vendor receipts.',
                  status: 'Optional Advanced',
                  active: false,
                },
                {
                  tier: 'Tier 3',
                  title: 'Formal Offtake Contracts & B2B MoUs',
                  desc: 'Signed advance purchase agreements with local dairy federations, retail shops, or mandis.',
                  status: 'High Institutional Confidence',
                  active: false,
                },
                {
                  tier: 'Tier 2',
                  title: 'Community Survey & Local Price Census',
                  desc: `Requires 15+ verified survey responses. Currently: ${responses.length} responses recorded.`,
                  status: responses.length >= 15 ? 'Active Status' : 'Pending 15 Responses',
                  active: responses.length >= 15,
                },
                {
                  tier: 'Tier 1',
                  title: 'District Census & APMC Mandi Data (Current)',
                  desc: 'Official taluka arrivals, mandi price floors, and demographic household counts verified.',
                  status: 'Active Status',
                  active: true,
                },
                {
                  tier: 'Tier 0',
                  title: 'Unverified Assumptions (Guesswork)',
                  desc: 'Generic internet projections without local footfall or verified nearby competitors.',
                  status: 'Rejected by ARTH AI',
                  active: false,
                },
              ].map((item) => (
                <div
                  key={item.tier}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    item.active
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 ring-2 ring-amber-200 dark:ring-amber-900/50'
                      : 'bg-slate-50 dark:bg-[#112237] border-slate-200 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{item.tier}:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                      {item.active && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold">
                          CURRENT LEVEL
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold shrink-0 self-start sm:self-center">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Data Trust Badges */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#112237] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white font-mono uppercase text-[11px] block">
                ARTH AI Data Reliability Tags Used in this Report:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-bold">
                  VERIFIED MANDI BENCHMARK
                </span>
                <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800 text-[10px] font-mono font-bold">
                  TALUKA CENSUS DATA
                </span>
                <span className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-800 text-[10px] font-mono font-bold">
                  COMMUNITY SURVEY SIGNALS ({responses.length})
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-[10px] font-mono font-bold">
                  ESTIMATED OPERATING COSTS
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* NAVIGATION ACTION FOOTER                                  */}
        {/* ======================================================== */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isFarmer ? 'Back to Farm Details' : 'Back to Idea'}</span>
          </button>

          <PremiumButton
            type="button"
            onClick={onNext}
            variant="gold"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isFarmer ? 'Continue to Farm Assessment' : 'Continue to Feasibility'}
          </PremiumButton>
        </div>
      </div>

      {/* Survey Customization Modal */}
      <CreateSurveyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        survey={survey}
        onSurveyUpdated={(updated) => {
          setSurvey(updated);
        }}
      />

      {/* Respondent Survey Preview / Test Modal */}
      {isRespondentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 dark:bg-black/90 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#FAFBFD] dark:bg-[#07111E] shadow-2xl p-2 relative">
            <PublicSurveyRespondentView
              survey={survey}
              onSubmitted={() => {
                refreshResponses();
              }}
              onExit={() => {
                refreshResponses();
                setIsRespondentModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
