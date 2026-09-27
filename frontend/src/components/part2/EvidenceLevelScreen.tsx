import React from 'react';
import { EvidenceLevel, Language } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
  FileText,
  Users,
} from 'lucide-react';

interface Props {
  evidenceLevel: EvidenceLevel;
  village: string;
  district: string;
  language: Language;
  onContinueToSchemes: () => void;
  onBack: () => void;
}

export const EvidenceLevelScreen: React.FC<Props> = ({
  evidenceLevel,
  village,
  district,
  language,
  onContinueToSchemes,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];

  const levels = [
    {
      level: 0,
      title: 'Level 0 — Not enough information (अपर्याप्त माहिती)',
      color: 'border-slate-300 bg-slate-50 text-slate-700',
      activeColor: 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-200',
      icon: ShieldAlert,
      desc: 'Few records found. High uncertainty regarding local demand and costs.',
    },
    {
      level: 1,
      title: 'Level 1 — Some local information (काही स्थानिक माहिती)',
      color: 'border-slate-300 bg-slate-50 text-slate-700',
      activeColor: 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-200',
      icon: Shield,
      desc: 'Basic mandi rates and district benchmarks available, but limited village-level survey.',
    },
    {
      level: 2,
      title: 'Level 2 — Stronger local information (मजबूत स्थानिक पुरावा)',
      color: 'border-slate-300 bg-slate-50 text-slate-700',
      activeColor: 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200',
      icon: ShieldCheck,
      desc: 'Active local surveys, verified APMC prices, and verified competitor registries matching.',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F284E] bg-blue-100 px-2.5 py-1 rounded">
              Reliability Check (Part 2 • Screen 4)
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F284E] mt-1">
              How strong is the available information?
            </h1>
            <p className="text-sm sm:text-base text-slate-700 mt-1">
              (उपलब्ध माहिती किती विश्वासार्ह व भक्कम आहे?)
            </p>
          </div>

          {/* Mandatory Public Service Explanation */}
          <div className="mt-5 p-4 bg-amber-50 border border-amber-300 rounded-xl text-sm text-amber-950 font-semibold leading-relaxed">
            &quot;This level shows how much useful information we found. It does not guarantee business
            success.&quot;
          </div>

          {/* The 3 Simple Levels */}
          <div className="mt-6 space-y-4">
            {levels.map((item) => {
              const isCurrent = evidenceLevel === item.level;
              const Icon = item.icon;

              return (
                <div
                  key={item.level}
                  className={`p-5 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent ? item.activeColor : 'border-slate-200 bg-slate-50/50 opacity-70'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-[#0F284E] text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">{item.title}</h2>
                      <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="px-3 py-1 bg-[#0F284E] text-white text-xs font-bold rounded-md self-start sm:self-auto">
                      Current Status
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 4 Core Data Indicators: Data quality, Recency, Number of responses, Source agreement */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-4">
              Breakdown of Information Strength:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Indicator 1: Data Quality */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>Data Quality</span>
                </div>
                <p className="text-base font-extrabold text-emerald-800">High</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Cross-checked with Panchayat and APMC registry.
                </p>
              </div>

              {/* Indicator 2: Recency */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>Recency</span>
                </div>
                <p className="text-base font-extrabold text-slate-900">August 2026</p>
                <p className="text-[11px] text-slate-500 mt-1">Updated within current quarter.</p>
              </div>

              {/* Indicator 3: Number of Responses */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1">
                  <Users className="w-4 h-4 text-purple-700" />
                  <span>Village Responses</span>
                </div>
                <p className="text-base font-extrabold text-purple-800">12 Citizens</p>
                <p className="text-[11px] text-slate-500 mt-1">Direct feedback from your area.</p>
              </div>

              {/* Indicator 4: Source Agreement */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>Source Agreement</span>
                </div>
                <p className="text-base font-extrabold text-emerald-800">Consistent</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  APMC rates match local shopkeeper reports.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
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
            id="continue-to-schemes-btn"
            type="button"
            onClick={onContinueToSchemes}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-lg shadow-sm min-h-[50px] flex items-center justify-center gap-3 transition-colors"
          >
            <span>Check Possible Financial Support (Screen 5)</span>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
