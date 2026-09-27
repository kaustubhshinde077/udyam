import React, { useState } from 'react';
import { BasicInfoData, BusinessSetupData, Language } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';
import { ArrowRight, ArrowLeft, Edit2, CheckCircle, ShieldCheck, FileDown, Printer, Shield, FileText } from 'lucide-react';
import { PreliminaryReportModal } from './PreliminaryReportModal';

interface Props {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  language: Language;
  onEditBasicInfo: () => void;
  onEditBusinessSetup: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export const ReviewScreen: React.FC<Props> = ({
  basicInfo,
  businessSetup,
  language,
  onEditBasicInfo,
  onEditBusinessSetup,
  onContinue,
  onBack,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="w-full bg-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title Header */}
        <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                Verification &amp; Review (पडताळणी व पुनरावलोकन)
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Review Your Information
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Check that all entries are correct before starting local area business analysis
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Ready for Verification</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Section 1: About You */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h2 className="text-sm font-bold text-[#0F284E] uppercase tracking-wide">
                  1. About You (आपकी जानकारी)
                </h2>
                <button
                  type="button"
                  onClick={onEditBasicInfo}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 px-2 py-1 bg-white border border-slate-300 rounded"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{t.edit}</span>
                </button>
              </div>

              <dl className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Name:</dt>
                  <dd className="font-bold text-slate-900">{basicInfo.name || 'Not provided'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Date of Birth:</dt>
                  <dd className="font-semibold text-slate-800">{basicInfo.dob || '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Gender / Category:</dt>
                  <dd className="font-semibold text-slate-800">
                    {basicInfo.gender} • {basicInfo.category}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Mobile:</dt>
                  <dd className="font-semibold text-slate-800 tabular-nums">
                    +91 {basicInfo.mobile || '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Current Work:</dt>
                  <dd className="font-semibold text-slate-800">{basicInfo.currentOccupation || '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Business Experience:</dt>
                  <dd className="font-semibold text-slate-800">
                    {basicInfo.workedInBusinessBefore === 'Yes'
                      ? `${basicInfo.experienceYears} Years`
                      : 'First-time entrepreneur'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Section 2: Location */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h2 className="text-sm font-bold text-[#0F284E] uppercase tracking-wide">
                  2. Location (स्थान)
                </h2>
                <button
                  type="button"
                  onClick={onEditBasicInfo}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 px-2 py-1 bg-white border border-slate-300 rounded"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{t.edit}</span>
                </button>
              </div>

              <dl className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">State &amp; District:</dt>
                  <dd className="font-bold text-slate-900">
                    {basicInfo.district}, {basicInfo.state}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Village / Town:</dt>
                  <dd className="font-semibold text-slate-800">{basicInfo.village}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Postal Pincode:</dt>
                  <dd className="font-semibold text-slate-800 tabular-nums">{basicInfo.pincode}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Area Type:</dt>
                  <dd className="font-semibold text-slate-800">{basicInfo.areaType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Report Language:</dt>
                  <dd className="font-semibold text-slate-800">{basicInfo.reportLanguage}</dd>
                </div>
              </dl>
            </div>

            {/* Section 3: Business */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h2 className="text-sm font-bold text-[#0F284E] uppercase tracking-wide">
                  3. Business (व्यवसाय)
                </h2>
                <button
                  type="button"
                  onClick={onEditBusinessSetup}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 px-2 py-1 bg-white border border-slate-300 rounded"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{t.edit}</span>
                </button>
              </div>

              <dl className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Business Category:</dt>
                  <dd className="font-bold text-slate-900">{businessSetup.businessCategory}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Activity / Product:</dt>
                  <dd className="font-semibold text-emerald-800">{businessSetup.subActivity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Work Location:</dt>
                  <dd className="font-semibold text-slate-800">{businessSetup.workLocation}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Primary Selling Area:</dt>
                  <dd className="font-semibold text-slate-800 text-right max-w-[60%]">
                    {Array.isArray(businessSetup.sellLocation)
                      ? businessSetup.sellLocation.join(', ') || 'Not specified'
                      : businessSetup.sellLocation || 'Not specified'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Material Availability:</dt>
                  <dd className="font-semibold text-slate-800">{businessSetup.rawMaterialEase}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Nearby Competitors:</dt>
                  <dd className="font-semibold text-slate-800">{businessSetup.similarBusinessesNearby}</dd>
                </div>
              </dl>
            </div>

            {/* Section 4: What You Have */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h2 className="text-sm font-bold text-[#0F284E] uppercase tracking-wide">
                  4. What You Have (उपलब्ध संसाधने)
                </h2>
                <button
                  type="button"
                  onClick={onEditBusinessSetup}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 px-2 py-1 bg-white border border-slate-300 rounded"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{t.edit}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {businessSetup.alreadyHave.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded bg-white text-slate-800 text-xs font-semibold border border-slate-300"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Section 5: What You Need */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h2 className="text-sm font-bold text-[#0F284E] uppercase tracking-wide">
                  5. What You Need (आवश्यक सामग्री)
                </h2>
                <button
                  type="button"
                  onClick={onEditBusinessSetup}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 px-2 py-1 bg-white border border-slate-300 rounded"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{t.edit}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {businessSetup.needToStart.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200"
                  >
                    • {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Section 6: Money & Financial Support */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h2 className="text-sm font-bold text-[#0F284E] uppercase tracking-wide">
                  6. Money &amp; Financial Support (भांडवल व कर्ज)
                </h2>
                <button
                  type="button"
                  onClick={onEditBusinessSetup}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 px-2 py-1 bg-white border border-slate-300 rounded"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{t.edit}</span>
                </button>
              </div>

              <dl className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Your Own Starting Money:</dt>
                  <dd className="font-bold text-emerald-800">
                    {formatIndianCurrency(businessSetup.ownStartingMoney)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Financial Support Needed:</dt>
                  <dd className="font-semibold text-slate-800">
                    {businessSetup.needFinancialSupport}
                    {businessSetup.financialSupportAmount
                      ? ` (${formatIndianCurrency(businessSetup.financialSupportAmount)})`
                      : ''}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Existing Informal Debt:</dt>
                  <dd className="font-semibold text-slate-800">
                    {businessSetup.hasInformalLoan === 'Yes'
                      ? `${formatIndianCurrency(businessSetup.informalLoanRemaining || 0)} @ ${businessSetup.informalLoanInterestRate || 0}%`
                      : 'None'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Official 7-Day Verification Notice */}
          <div className="mt-6 p-5 bg-[#0F284E] text-white rounded-xl shadow-sm border-2 border-amber-400">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded">
                    7-DAY VERIFICATION TIMELINE
                  </span>
                  <span className="text-xs text-amber-200 font-semibold">• Verification in Progress</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Notice: 1st Report will be visible after 7 days (अहवाल ७ दिवसांनंतर उपलब्ध होईल)
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                  Your enterprise details and citizen registration have been confirmed. In accordance with rural enterprise validation procedures, the <strong>1st Field &amp; Market Feasibility Report</strong> will be generated and visible after the 7-day verification period and local community survey.
                </p>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center gap-2">
                <button
                  id="preview-7day-schedule-btn"
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2.5 bg-blue-900/80 hover:bg-blue-800 text-amber-300 font-semibold text-xs rounded-lg border border-blue-400/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>Preview 7-Day Schedule</span>
                </button>
              </div>
            </div>

            {/* 7-Day Timeline Bar */}
            <div className="mt-4 pt-3 border-t border-blue-800/80 grid grid-cols-3 sm:grid-cols-7 gap-2 text-center text-[10px]">
              <div className="bg-emerald-900/50 border border-emerald-400/40 rounded p-1.5 text-emerald-200 font-medium">
                Day 1: Registration
              </div>
              <div className="bg-blue-900/50 border border-blue-400/30 rounded p-1.5 text-blue-200">
                Day 2: Panchayat Check
              </div>
              <div className="bg-blue-900/50 border border-blue-400/30 rounded p-1.5 text-blue-200">
                Day 3: Mandi Data
              </div>
              <div className="bg-blue-900/50 border border-blue-400/30 rounded p-1.5 text-blue-200">
                Day 4: Supplier Check
              </div>
              <div className="bg-blue-900/50 border border-blue-400/30 rounded p-1.5 text-blue-200">
                Day 5: Customer Survey
              </div>
              <div className="bg-blue-900/50 border border-blue-400/30 rounded p-1.5 text-blue-200">
                Day 6: Credit Review
              </div>
              <div className="bg-amber-500 text-slate-950 font-bold rounded p-1.5 border border-amber-300">
                Day 7: 1st Report Issued
              </div>
            </div>
          </div>

          {/* Reassurance Notice */}
          <div className="mt-4 p-4 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-800 flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              All your information is preserved. You can come back and edit any section at any
              time.
            </span>
          </div>

          {/* Primary Action Button */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3.5 text-slate-800 font-bold text-base rounded-lg border-2 border-slate-300 bg-white hover:bg-slate-100 min-h-[48px] flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.back}</span>
            </button>

            <button
              id="review-continue-btn"
              type="button"
              onClick={onContinue}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0F284E] hover:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-lg shadow-sm min-h-[50px] flex items-center justify-center gap-3 transition-colors"
            >
              <span>Continue to Local Business Analysis</span>
              <ArrowRight className="w-5 h-5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Preliminary Report Modal */}
      <PreliminaryReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        basicInfo={basicInfo}
        businessSetup={businessSetup}
        language={language}
      />
    </div>
  );
};
