import React from 'react';
import { ShieldCheck, PhoneCall, Globe, CheckCircle2, RotateCcw } from 'lucide-react';
import { Language } from '../../types';
import { ArthLogo } from './ArthLogo';

interface Props {
  language: Language;
  onReplayIntro?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  theme?: 'light' | 'dark';
}

export const Footer: React.FC<Props> = ({
  language,
  onReplayIntro,
  onNavigateSection,
  theme = 'light',
}) => {
  const scrollTo = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-white dark:bg-[#071324] text-slate-700 dark:text-slate-300 text-sm mt-auto border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200 dark:border-slate-800/80">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-2 text-left">
            <ArthLogo
              size="md"
              variant={theme === 'dark' ? 'dark' : 'light'}
              subtitleText="Assistant for Microentrepreneurs"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md pt-2">
              Stronger Businesses • Stronger Communities.
              ARTH AI empowers Indian microentrepreneurs, artisans, and smallholder farmers with verified local market evidence, quantitative solvency stress testing, and structured priority sector loan planning.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {onReplayIntro && (
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-400/30 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Brand Intro</span>
                </button>
              )}
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                PS 26091 Prototype • SIH 2026
              </span>
            </div>
          </div>

          {/* Navigation Anchors */}
          <div className="space-y-2 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Navigation
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('arth-hero')}
                  className="hover:text-emerald-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-emerald-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('for-micro-businesses')}
                  className="hover:text-emerald-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Business Ideas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('for-farmers')}
                  className="hover:text-emerald-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Market Insights
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('two-gate-model')}
                  className="hover:text-emerald-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Success Stories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('two-gate-model')}
                  className="hover:text-emerald-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  About ARTH
                </button>
              </li>
            </ul>
          </div>

          {/* Citizen Helpline & Support */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Citizen Helpline</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Free micro-enterprise advisory and Panchayat guidance:
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
              <span className="text-amber-600 dark:text-amber-400">1800-180-2000</span> / <span className="text-amber-600 dark:text-amber-400">1800-180-1551</span>
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                English
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                मराठी
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                हिन्दी
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sign-off */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>© 2026 ARTH AI • Assistant for Microentrepreneurs • All rights reserved.</span>
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Advisory framework for pre-financing decisions. Not a statutory loan guarantee.
          </p>
        </div>
      </div>
    </footer>
  );
};
