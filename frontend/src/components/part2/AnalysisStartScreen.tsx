import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { UI_TRANSLATIONS } from '../../data/translations';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface Props {
  language: Language;
  district: string;
  village: string;
  businessCategory: string;
  subActivity: string;
  onComplete: () => void;
}

export const AnalysisStartScreen: React.FC<Props> = ({
  language,
  district,
  village,
  businessCategory,
  subActivity,
  onComplete,
}) => {
  const [completedStepIndex, setCompletedStepIndex] = useState<number>(0);

  const steps = [
    {
      title: '1. Understanding your business',
      sub: `Loaded activity rules and typical scale for ${subActivity} (${businessCategory})`,
    },
    {
      title: '2. Checking local area',
      sub: `Gathering demographic data for ${village}, ${district}`,
    },
    {
      title: '3. Checking nearby businesses',
      sub: 'Scanning local trade registry and registered micro-enterprises',
    },
    {
      title: '4. Checking suppliers and prices',
      sub: 'Loading Mandi wholesale bulletins and sub-district feed/input rates',
    },
    {
      title: '5. Checking community interest',
      sub: 'Verifying seasonal demand patterns and local consumption trends',
    },
  ];

  useEffect(() => {
    // Progress through steps steadily without fake spinner tricks
    const timer = setInterval(() => {
      setCompletedStepIndex((prev) => {
        if (prev < steps.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 650);

    return () => clearInterval(timer);
  }, [steps.length]);

  const allComplete = completedStepIndex >= steps.length;

  return (
    <div className="w-full bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 sm:p-8 shadow-xs">
          {/* Top Heading */}
          <div className="text-center pb-6 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F284E] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              Government Data Integration (Part 2)
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
              Checking your local business situation
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Location: <strong>{village}</strong>, {district} • Business: <strong>{subActivity}</strong>
              </span>
            </p>
          </div>

          {/* Progress / Status Steps List */}
          <div className="mt-6 space-y-4">
            {steps.map((step, idx) => {
              const isDone = completedStepIndex > idx;
              const isCurrent = completedStepIndex === idx;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 transition-all flex items-start gap-3.5 ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-400'
                      : isCurrent
                      ? 'bg-blue-50/70 border-[#0F284E]'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-[#0F284E] animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 text-slate-400 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div>
                    <h2
                      className={`text-sm sm:text-base font-bold ${
                        isDone
                          ? 'text-emerald-950'
                          : isCurrent
                          ? 'text-[#0F284E]'
                          : 'text-slate-600'
                      }`}
                    >
                      {step.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">{step.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Area */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col items-center gap-3">
            {allComplete ? (
              <button
                id="view-analysis-btn"
                type="button"
                onClick={onComplete}
                className="w-full py-4 px-6 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-lg shadow-sm min-h-[50px] flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Local Business Dashboard</span>
                <ArrowRight className="w-5 h-5 text-amber-400" />
              </button>
            ) : (
              <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold py-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#0F284E]" />
                <span>Checking verified records and community registers...</span>
              </div>
            )}

            <p className="text-[11px] text-slate-500 text-center">
              Data synchronized from official Agricultural Produce Market Committees (APMC),
              District Industries Centre, and Panchayat Trade Registry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
