import React from 'react';
import { RiskAssessmentItem, RiskLevel, Language } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import {
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Users,
  Truck,
  Calendar,
  CreditCard,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  risks: RiskAssessmentItem[];
  language: Language;
  onContinueToRecommendation: () => void;
  onBack: () => void;
}

export const RiskScreen: React.FC<Props> = ({
  risks,
  language,
  onContinueToRecommendation,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'High':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-400',
          dot: 'bg-rose-600',
          label: 'High (जास्त जोखीम)',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-400',
          dot: 'bg-amber-600',
          label: 'Medium (मध्यम जोखीम)',
        };
      case 'Low':
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-400',
          dot: 'bg-emerald-600',
          label: 'Low (कमी जोखीम)',
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Competition':
        return Users;
      case 'Supply':
        return Truck;
      case 'Seasonality':
        return Calendar;
      case 'Money / Repayment':
        return CreditCard;
      case 'Local Market':
      default:
        return MapPin;
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F284E] bg-blue-100 px-2.5 py-1 rounded">
              Part 3 • Screen 5: Risk Awareness
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F284E] mt-1">
              What should you be careful about?
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              (व्यवसाय करताना कोणत्या गोष्टींची विशेष काळजी घ्यावी?)
            </p>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-950">
            Every rural business encounters challenges. Understanding them early protects your hard-earned
            capital and prevents unexpected loan distress.
          </div>

          {/* 5 SIMPLE RISK CARDS */}
          <div className="mt-6 space-y-3.5">
            {risks.map((item, idx) => {
              const badge = getRiskBadge(item.level);
              const Icon = getCategoryIcon(item.category);

              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 bg-white border-2 border-slate-300 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shrink-0">
                      <Icon className="w-5 h-5 text-[#0F284E]" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{item.category}</h2>
                      <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  </div>

                  <div className="self-start sm:self-center shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </span>
                  </div>
                </div>
              );
            })}
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
            id="continue-to-rec-btn"
            type="button"
            onClick={onContinueToRecommendation}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-lg shadow-sm min-h-[50px] flex items-center justify-center gap-3 transition-colors"
          >
            <span>See Final Assessment (Screen 6)</span>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
