import React, { useState } from 'react';
import {
  Printer,
  CheckCircle2,
  Sprout,
  LandPlot,
  IndianRupee,
  CreditCard,
  FileText,
  Clock,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Building,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { BasicInfoData, BusinessSetupData, Language } from '../../types';
import { formatIndianCurrency } from '../../utils/calculations';
import { UI_TRANSLATIONS } from '../../data/translations';

interface FarmerActionPlanProps {
  basicInfo: BasicInfoData;
  businessSetup: BusinessSetupData;
  language?: Language;
  onBack: () => void;
  onModifyDetails: () => void;
  onOpenAdvisor?: () => void;
}

export const FarmerActionPlan: React.FC<FarmerActionPlanProps> = ({
  basicInfo,
  businessSetup,
  language = 'en',
  onBack,
  onModifyDetails,
  onOpenAdvisor,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const fData = businessSetup.farmerData;
  const loan = businessSetup.existingLoan;
  const hasLoan = loan?.hasLoan === 'Yes';

  const cropName = fData?.cropName || 'Crop Cultivation';
  const landArea = fData?.landAreaAcres || 2;
  const season = fData?.season || 'Rabi';
  const irrigation = fData?.irrigationStatus || 'Irrigated';
  const costPerAcre = fData?.cultivationCostPerAcre || 55000;
  const totalCost = fData?.totalCultivationCost || costPerAcre * landArea;
  const ownContribution = fData?.farmerSavingsContribution || 25000;
  const financingGap = businessSetup.financialSupportAmount || Math.max(0, totalCost - ownContribution);
  const insuranceStatus = fData?.hasCropInsurance || 'Not Sure';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn" id="farmer-action-plan-container">
      {/* Top Banner */}
      <div className="bg-slate-900 dark:bg-[#071322] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl print:bg-white print:text-black print:border-none print:shadow-none" id="plan-header-banner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-400/30 mb-3 print:hidden">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>STAGE 06 · COMPLETED ACTION PLAN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white print:text-black mb-1">
              Your Farm Financing Action Plan
            </h1>
            <p className="text-sm text-slate-300 dark:text-slate-400 print:text-slate-600">
              Personalized agricultural credit and preparation roadmap for {basicInfo.name || 'Farmer Citizen'}
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 9-Point Action Plan */}
      <div className="bg-white dark:bg-[#0c182a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0" id="nine-point-action-plan">
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Complete Farm Profile & Credit Action Steps</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Structured in simple language for bank branch or PACS submission</p>
        </div>

        <div className="space-y-4 text-sm divide-y divide-slate-100 dark:divide-slate-800/80">
          {/* 1. Your Crop */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Your Crop</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Notified agricultural crop and production cycle</span>
              </div>
            </div>
            <div className="text-left sm:text-right font-semibold text-slate-900 dark:text-white pl-8 sm:pl-0">
              <div>{cropName}</div>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-normal">{season} Season</span>
            </div>
          </div>

          {/* 2. Your Land Area */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Your Land Area</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">As recorded in village 7/12 extract</span>
              </div>
            </div>
            <div className="text-left sm:text-right font-semibold text-slate-900 dark:text-white pl-8 sm:pl-0">
              <div>{landArea} Acres</div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{irrigation}</span>
            </div>
          </div>

          {/* 3. Estimated Cultivation Requirement */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Estimated Cultivation Requirement</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Seeds, fertilizer, pesticides, fuel & labour</span>
              </div>
            </div>
            <div className="text-left sm:text-right font-bold text-slate-900 dark:text-white pl-8 sm:pl-0">
              <div>{formatIndianCurrency(totalCost)}</div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">~{formatIndianCurrency(costPerAcre)} / acre</span>
            </div>
          </div>

          {/* 4. Your Own Contribution */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">4</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Your Own Contribution</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Cash savings invested without borrowing</span>
              </div>
            </div>
            <div className="text-left sm:text-right font-bold text-emerald-700 dark:text-emerald-400 pl-8 sm:pl-0">
              <div>{formatIndianCurrency(ownContribution)}</div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {totalCost > 0 ? `${Math.round((ownContribution / totalCost) * 100)}% of total cost` : '100%'}
              </span>
            </div>
          </div>

          {/* 5. Existing Loan Status */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">5</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Existing Loan Status</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Pre-existing credit obligations</span>
              </div>
            </div>
            <div className="text-left sm:text-right font-semibold text-slate-900 dark:text-white pl-8 sm:pl-0">
              {hasLoan ? (
                <div>
                  <div className="text-amber-700 dark:text-amber-400 font-bold">
                    Active Loan: {formatIndianCurrency(loan?.outstandingAmount || 0)}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {loan?.providerName} · EMI {formatIndianCurrency(loan?.monthlyEMI || 0)}/mo
                  </span>
                </div>
              ) : (
                <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                  No existing loan reported (Debt-Free)
                </div>
              )}
            </div>
          </div>

          {/* 6. Estimated Financing Gap */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">6</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Estimated Financing Gap</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Net credit required to complete cultivation</span>
              </div>
            </div>
            <div className="text-left sm:text-right font-black text-xl text-emerald-800 dark:text-emerald-300 pl-8 sm:pl-0">
              <div>{formatIndianCurrency(financingGap)}</div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {financingGap > 0 ? 'Suggested seasonal credit limit' : 'Self-sufficient from savings'}
              </span>
            </div>
          </div>

          {/* 7. Relevant Schemes / Support */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">7</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Relevant Schemes & Support</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Applicable institutional credit & safety nets</span>
              </div>
            </div>
            <div className="text-left sm:text-right font-medium text-slate-800 dark:text-slate-200 pl-8 sm:pl-0 max-w-sm">
              <ul className="text-xs space-y-1">
                <li className="font-semibold text-emerald-800 dark:text-emerald-300">· Kisan Credit Card (KCC) Crop Loan</li>
                <li className="text-slate-600 dark:text-slate-300">· Modified Interest Subvention (4% net rate on prompt repayment)</li>
                <li className="text-slate-600 dark:text-slate-300">· PM Fasal Bima Yojana ({insuranceStatus === 'Yes' ? 'Enrolled' : 'Enroll before sowing cut-off'})</li>
              </ul>
            </div>
          </div>

          {/* 8. Documents to Prepare */}
          <div className="pt-3 space-y-2">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">8</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Documents to Prepare</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Keep ready before visiting your bank or PACS branch</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8 pt-1 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-[#101f35] rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200"><strong>7/12 Extract (सातबारा) & 8-A:</strong> Latest computerized copy with digital signature</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#101f35] rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200"><strong>Crop Sowing Proof (पीक पाहणी):</strong> Entry in e-Pik Pahani app or Talathi certificate</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#101f35] rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200"><strong>Identity Proof:</strong> Aadhaar Card and PAN Card (copies)</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#101f35] rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200"><strong>Bank Passbook:</strong> Copy of passbook showing active Aadhaar NPCI linkage</span>
              </div>
            </div>
          </div>

          {/* 9. Suggested Next Administrative Step */}
          <div className="pt-3 space-y-2">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">9</span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Suggested Next Administrative Step</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Clear chronological action plan for this season</span>
              </div>
            </div>
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-slate-800 dark:text-slate-200 space-y-2 pl-8">
              <p className="font-semibold text-emerald-950 dark:text-emerald-200">
                {hasLoan
                  ? `Visit your current lending branch (${loan?.providerName || 'your bank'}) 30 days before sowing season. Request renewal or limit review of your existing KCC based on the new DLTC scale of finance for ${cropName}, instead of taking high-cost informal credit.`
                  : `Visit your local Primary Agricultural Credit Society (PACS) or Gramin / Nationalized bank branch with your 7/12 extract and Aadhaar. Submit the simplified one-page KCC application for an estimated seasonal requirement of ${formatIndianCurrency(financingGap)}.`}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Ensure your crop sowing declaration is updated on <strong>e-Pik Pahani</strong> as soon as germination occurs to secure both KCC interest subvention and PMFBY claim eligibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footnotes & Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 print:hidden" id="plan-actions">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c182a] text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Schemes</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onModifyDetails}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c182a] text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Modify Farm Details</span>
          </button>

          {onOpenAdvisor && (
            <button
              type="button"
              onClick={onOpenAdvisor}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-700/20 transition-all text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask ARTH Advisor</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
