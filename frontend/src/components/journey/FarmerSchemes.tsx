import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Info,
  Calendar,
  IndianRupee,
  LandPlot,
  Filter,
  Check,
  Sparkles,
} from 'lucide-react';
import { BasicInfoData, BusinessSetupData, Language } from '../../types';
import { VERIFIED_FARMER_SCHEMES, FarmerSchemeItem } from '../../data/farmerData';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';

interface FarmerSchemesProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  language?: Language;
  onNext: () => void;
  onBack: () => void;
}

export const FarmerSchemes: React.FC<FarmerSchemesProps> = ({
  basicInfo,
  businessSetup,
  language = 'en',
  onNext,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const fData = businessSetup.farmerData;
  const loan = businessSetup.existingLoan;
  const hasLoan = loan?.hasLoan === 'Yes';
  const cropName = fData?.cropName || 'Crop';
  const season = fData?.season || 'Rabi';
  const landArea = fData?.landAreaAcres || 2;
  const financingGap = businessSetup.financialSupportAmount || 0;
  const insuranceStatus = fData?.hasCropInsurance || 'Not Sure';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedScheme, setExpandedScheme] = useState<string | null>(
    VERIFIED_FARMER_SCHEMES[0]?.id || null
  );

  const categories = [
    { id: 'all', label: t.allSchemes || 'All Schemes & Programs' },
    { id: 'Crop Loan / Working Capital', label: t.cropLoanKcc || 'Crop Loan (KCC)' },
    { id: 'Interest Subvention', label: t.interestSubvention || 'Interest Subvention' },
    { id: 'Crop Insurance', label: t.cropInsurancePmfby || 'Crop Insurance (PMFBY)' },
    { id: 'Direct Support', label: t.directSupportKisan || 'Income Support (PM-Kisan)' },
    { id: 'Infrastructure', label: t.agriInfra || 'Agri Infrastructure' },
  ];

  const filteredSchemes = VERIFIED_FARMER_SCHEMES.filter((scheme) => {
    if (selectedCategory === 'all') return true;
    return scheme.category === selectedCategory;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn" id="farmer-schemes-container">
      {/* Top Banner */}
      <div className="bg-slate-900 dark:bg-[#071322] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl" id="schemes-banner">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30 mb-3">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>STAGE 05 · RELEVANT SCHEMES &amp; PROTECTION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          {t.farmerSchemesTitle || 'Farmer Schemes & Financial Support'}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {t.farmerSchemesSubtitle || `Verified agricultural credit schemes, interest concessions, and safety nets matching your ${cropName} crop on ${landArea} acres.`} Final eligibility and sanction are subject to official revenue and banking appraisal.
        </p>
      </div>

      {/* SECTION 9 MANDATE: Crop Insurance / Protection Status Box */}
      <div className="bg-white dark:bg-[#0c182a] rounded-2xl border border-emerald-600/30 dark:border-emerald-500/30 p-6 shadow-sm space-y-4" id="crop-insurance-status-box">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.cropProtectionStatus || 'Crop Protection & Insurance Status'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.cropProtectionSub || 'Pradhan Mantri Fasal Bima Yojana (PMFBY) / Weather Insurance'}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center ${
            insuranceStatus === 'Yes'
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : insuranceStatus === 'No'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}>
            Status: {insuranceStatus === 'Yes' ? 'Covered' : insuranceStatus === 'No' ? 'Not Covered' : 'Not Sure / Needs Check'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-[#101f35] rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{t.cropAndSeason || 'Crop & Season'}</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{cropName} ({season})</span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#101f35] rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{t.notifiedArea || 'Notified Area Enrollment'}</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{basicInfo.district || 'Maharashtra'}</span>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#101f35] rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">{t.farmerPremiumShare || 'Standard Farmer Premium Share'}</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              {season === 'Kharif' ? '2.0% (Kharif)' : season === 'Rabi' ? '1.5% (Rabi)' : '5.0% (Horticultural)'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed border border-emerald-200 dark:border-emerald-800/60">
          {insuranceStatus === 'Yes' ? (
            <p>
              <strong>Your crop is protected:</strong> Keep your sowing certificate (e-Pik Pahani) and premium deduction receipt safe. If unseasonal weather or localized perils occur, report damage within 72 hours via the Crop Insurance App or to your local agriculture officer.
            </p>
          ) : (
            <p>
              <strong>Action required before cut-off date:</strong> If you are taking a KCC crop loan, you can enroll directly through your bank branch. Non-loanee farmers can register with land records (7/12) via the nearest Common Service Center (CSC) or on <span className="font-bold">ncip.gov.in</span>.
            </p>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar" id="schemes-category-filter">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#0c182a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Verified Scheme Cards List */}
      <div className="space-y-4" id="farmer-schemes-list">
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedScheme === scheme.id;
          return (
            <div
              key={scheme.id}
              className="bg-white dark:bg-[#0c182a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700"
              id={`scheme-card-${scheme.id}`}
            >
              <div
                onClick={() => setExpandedScheme(isExpanded ? null : scheme.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                      {scheme.category}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">· {scheme.authority}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{scheme.schemeName}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">{scheme.whatItHelpsWith}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                    {isExpanded ? (t.hideDetails || 'Hide Details') : (t.viewFullDetails || 'View Full Details & Documents')}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#101f35]/50 space-y-5 text-xs animate-fadeIn">
                  {/* Who it is for & Potential Support */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-[#0c182a] rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white block mb-1 text-sm">
                        {t.whoItIsFor || 'Who It May Be Relevant For'}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{scheme.whoItIsFor}</p>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#0c182a] rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white block mb-1 text-sm">
                        {t.potentialSupport || 'Potential Support & Credit Terms'}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{scheme.potentialSupport}</p>
                    </div>
                  </div>

                  {/* Key Documents & Eligibility */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-[#0c182a] rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white block mb-2 text-sm flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        {t.keyDocumentsRequired || 'Key Documents Required'}
                      </span>
                      <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                        {scheme.keyDocuments.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#0c182a] rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white block mb-2 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        {t.eligibilityAndConditions || 'Eligibility & Conditions'}
                      </span>
                      <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                        {scheme.eligibilityConditions.map((cond, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0 mt-1.5" />
                            <span>{cond}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Application / Action Info */}
                  <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                    <span className="font-bold text-emerald-950 dark:text-emerald-200 block mb-1 text-sm">
                      {t.howToApply || 'How to Apply / Suggested Action'}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{scheme.applicationAction}</p>
                  </div>

                  {/* Mandatory Disclaimer */}
                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>{t.officialDisclaimer || 'Official Disclaimer'}:</strong> {scheme.disclaimer}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800" id="schemes-actions">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c182a] text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToAssistance || 'Back to Financial Assistance'}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-lg shadow-emerald-700/20 transition-all text-sm group cursor-pointer"
        >
          <span>{t.viewFarmActionPlan || 'View Your Farm Action Plan'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
