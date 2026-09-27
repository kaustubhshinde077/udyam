import React from 'react';
import { HyperLocalAnalysis, Language } from '../../types';
import { DataTrustBadge } from '../common/DataTrustBadge';
import { UI_TRANSLATIONS } from '../../data/translations';
import {
  MapPin,
  Users,
  Store,
  Truck,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  analysis: HyperLocalAnalysis;
  district: string;
  village: string;
  businessCategory: string;
  subActivity: string;
  language: Language;
  onContinueToSurvey: () => void;
  onBack: () => void;
}

export const AnalysisDashboardScreen: React.FC<Props> = ({
  analysis,
  district,
  village,
  businessCategory,
  subActivity,
  language,
  onContinueToSurvey,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];

  // Demand signal styling
  const getSignalBadge = (sig: string) => {
    switch (sig) {
      case 'Positive':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-400',
          label: 'Positive Demand Signal (सकारात्मक संकेत)',
        };
      case 'Mixed':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-400',
          label: 'Mixed Demand Signal (मिश्रित संकेत)',
        };
      case 'Limited':
        return {
          bg: 'bg-orange-100 text-orange-900 border-orange-400',
          label: 'Limited Demand Signal (सीमित संकेत)',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          label: 'Insufficient Information (अपर्याप्त जानकारी)',
        };
    }
  };

  const signalStyle = getSignalBadge(analysis.demandSignal);

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Screen Header */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F284E] bg-blue-100 px-2.5 py-1 rounded">
                Hyper-Local Intelligence (Part 2 • Screen 2)
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F284E] mt-1">
                Your Local Business Analysis
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>
                  Surveyed Area: <strong>{village}</strong>, {district} • Business:{' '}
                  <strong>{subActivity}</strong> ({businessCategory})
                </span>
              </p>
            </div>

            {/* Prominent Demand Signal Callout */}
            <div className="text-right sm:text-left">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">
                Preliminary Assessment
              </span>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 font-bold text-sm ${signalStyle.bg}`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{signalStyle.label}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Clearly labeled as a <em>Demand Signal</em>, not confirmed sales.
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-950 flex items-start gap-2">
            <FileCheck2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <p>
              <strong>Data Trust Notice:</strong> Every external benchmark below displays its
              official verification status, reporting authority, date, and locality. We never
              fabricate unavailable local data.
            </p>
          </div>
        </div>

        {/* 8 LARGE, SIMPLE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Local Market */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0F284E] font-bold text-base border-b border-slate-200 pb-2 mb-3">
                <Users className="w-5 h-5 text-blue-700" />
                <h2>1. Local Market (स्थानिक बाजारपेठ)</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">Market Reach:</span>
                  <p className="font-bold text-slate-900 text-base">{analysis.marketReach.value}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Nearby Customer Area:
                  </span>
                  <p className="font-semibold text-slate-800">{analysis.customerArea.value}</p>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                    {analysis.marketExplanation}
                  </p>
                </div>
              </div>
            </div>
            <DataTrustBadge
              status={analysis.marketReach.status}
              source={analysis.marketReach.source}
              date={analysis.marketReach.date}
              location={analysis.marketReach.location}
            />
          </div>

          {/* Card 2: Nearby Businesses */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0F284E] font-bold text-base border-b border-slate-200 pb-2 mb-3">
                <Store className="w-5 h-5 text-amber-700" />
                <h2>2. Nearby Businesses (आसपासचे व्यवसाय)</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Number of similar businesses:
                  </span>
                  <p className="font-bold text-slate-900 text-base">
                    {analysis.nearbyBusinessesCount.value}
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                    {analysis.nearbyBusinessesExplanation}
                  </p>
                </div>
              </div>
            </div>
            <DataTrustBadge
              status={analysis.nearbyBusinessesCount.status}
              source={analysis.nearbyBusinessesCount.source}
              date={analysis.nearbyBusinessesCount.date}
              location={analysis.nearbyBusinessesCount.location}
            />
          </div>

          {/* Card 3: Suppliers */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0F284E] font-bold text-base border-b border-slate-200 pb-2 mb-3">
                <Truck className="w-5 h-5 text-emerald-700" />
                <h2>3. Suppliers &amp; Materials (कच्चा माल व पुरवठादार)</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Material Availability:
                  </span>
                  <p className="font-bold text-slate-900 text-base">
                    {analysis.supplierAvailability.value}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Distance &amp; Accessibility:
                  </span>
                  <p className="font-semibold text-slate-800">{analysis.supplierDistance.value}</p>
                </div>
              </div>
            </div>
            <DataTrustBadge
              status={analysis.supplierAvailability.status}
              source={analysis.supplierAvailability.source}
              date={analysis.supplierAvailability.date}
              location={analysis.supplierAvailability.location}
            />
          </div>

          {/* Card 4: Local Prices */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0F284E] font-bold text-base border-b border-slate-200 pb-2 mb-3">
                <TrendingUp className="w-5 h-5 text-purple-700" />
                <h2>4. Local Prices (स्थानिक दर व किंमत)</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Observed Local Price Range:
                  </span>
                  <p className="font-bold text-emerald-800 text-lg font-mono">
                    {analysis.priceRange.value}
                  </p>
                </div>
                <p className="text-xs text-slate-600">
                  Based on recent weekly APMC / Haat auction registers and consumer purchases.
                </p>
              </div>
            </div>
            <DataTrustBadge
              status={analysis.priceRange.status}
              source={analysis.priceRange.source}
              date={analysis.priceRange.date}
              location={analysis.priceRange.location}
            />
          </div>

          {/* Card 5: Demand Signal */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0F284E] font-bold text-base border-b border-slate-200 pb-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-700" />
                <h2>5. Demand Signal (मागणीचा संकेत)</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div
                  className={`p-3 rounded-lg border-2 font-bold text-sm inline-block ${signalStyle.bg}`}
                >
                  Demand Signal: {analysis.demandSignal}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                  {analysis.demandExplanation}
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  Note: This indicates historical buying interest in this area, not guaranteed
                  revenue.
                </p>
              </div>
            </div>
            <DataTrustBadge status="Estimated" source="Local Trade & Household Survey" />
          </div>

          {/* Card 6: Local Opportunity */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0F284E] font-bold text-base border-b border-slate-200 pb-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h2>6. Local Opportunity (स्थानिक संधी)</h2>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">
                  {analysis.localOpportunity}
                </p>
              </div>
            </div>
            <DataTrustBadge status="Verified" source="DIC Micro-Enterprise Opportunity Matrix" />
          </div>

          {/* Card 7: Local Risks */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs md:col-span-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-base border-b border-slate-200 pb-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h2>7. Local Risks to Watch Out For (संभाव्य जोखीम)</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                <span className="font-bold text-rose-900 block mb-1">Competition:</span>
                <p className="text-slate-700">{analysis.localRisks.competition}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">Supply Difficulty:</span>
                <p className="text-slate-700">{analysis.localRisks.supply}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <span className="font-bold text-blue-900 block mb-1">Seasonal Demand:</span>
                <p className="text-slate-700">{analysis.localRisks.seasonal}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100 border border-slate-300">
                <span className="font-bold text-slate-900 block mb-1">Other Relevant Risks:</span>
                <p className="text-slate-700">{analysis.localRisks.other}</p>
              </div>
            </div>
          </div>

          {/* Card 8: SWOT (Extremely Simple) */}
          <div className="bg-white border-2 border-slate-300 rounded-xl p-5 shadow-xs md:col-span-2">
            <div className="flex items-center gap-2 text-[#0F284E] font-bold text-base border-b border-slate-200 pb-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-[#0F284E]" />
              <h2>8. Simple Business Overview (ताकद, आव्हाने, संधी व धोके)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300">
                <span className="font-bold text-emerald-950 uppercase block mb-1.5">
                  Strengths (ताकद)
                </span>
                <ul className="space-y-1 text-slate-800 list-disc list-inside">
                  {analysis.swot.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-300">
                <span className="font-bold text-amber-950 uppercase block mb-1.5">
                  Challenges (आव्हाने)
                </span>
                <ul className="space-y-1 text-slate-800 list-disc list-inside">
                  {analysis.swot.challenges.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-300">
                <span className="font-bold text-blue-950 uppercase block mb-1.5">
                  Opportunities (संधी)
                </span>
                <ul className="space-y-1 text-slate-800 list-disc list-inside">
                  {analysis.swot.opportunities.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 border border-rose-300">
                <span className="font-bold text-rose-950 uppercase block mb-1.5">
                  Risks (धोके)
                </span>
                <ul className="space-y-1 text-slate-800 list-disc list-inside">
                  {analysis.swot.risks.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3.5 text-slate-800 font-bold text-base rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-100 min-h-[48px] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <button
            id="continue-to-survey-btn"
            type="button"
            onClick={onContinueToSurvey}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-lg shadow-sm min-h-[50px] flex items-center justify-center gap-3 transition-colors"
          >
            <span>Proceed to Community Survey (Screen 3)</span>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
